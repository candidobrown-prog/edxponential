import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PRICE_MAP = {
  subscription_starter_monthly: 'price_1TXfZwBbfspRwLeFnS5SU3JN',
  subscription_pro_monthly: 'price_1TUsXOBbfspRwLeFiTDL4MP9',
  subscription_pro_yearly: 'price_1TUsXNBbfspRwLeFElMb9Q1n',
  subscription_enterprise_monthly: 'price_1TUsXOBbfspRwLeFQU2UxcdS',
  subscription_enterprise_yearly: 'price_1TUsXOBbfspRwLeF3nPDXjDB',
  coaching_session: 'price_1TUsXOBbfspRwLeFOAMBGPYo',
  course_purchase: 'price_1TUsXOBbfspRwLeF0935YjTu',
  tutoring_session: 'price_1TUsXOBbfspRwLeF5FUkZp3U',
  job_posting: 'price_1TUsXOBbfspRwLeFcNtbZPYb',
  content_purchase: 'price_1TUsXOBbfspRwLeFoJs2CJJO',
  deal_room_access: 'price_1TUsXOBbfspRwLeFMc9Kjc2R',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { product_type, price_id, amount, currency = 'usd', description, brand, product_name, metadata = {} } = body;

    const resolvedPriceId = price_id || PRICE_MAP[product_type];
    let lineItems;

    if (resolvedPriceId) {
      lineItems = [{ price: resolvedPriceId, quantity: 1 }];
    } else if (amount) {
      lineItems = [{
        price_data: {
          currency,
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: product_name || description || 'edXponential Payment',
            description: description || `${brand || 'edXponential'} — ${product_type}`,
          },
          ...(product_type?.startsWith('subscription') ? { recurring: { interval: 'month' } } : {}),
        },
        quantity: 1,
      }];
    } else {
      return Response.json({ error: 'Missing price_id or amount' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://app.base44.com';
    const isSubscription = !!(resolvedPriceId && product_type?.includes('subscription'));
    const isOnboarding = metadata?.onboarding === 'true';

    const successUrl = isOnboarding
      ? `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/billing?payment=success&session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = isOnboarding
      ? `${origin}/onboarding/checkout?payment=cancelled`
      : `${origin}/billing?payment=cancelled`;

    const sessionConfig = {
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: lineItems,
      customer_email: user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      payment_method_types: ['card'],
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        user_name: user.full_name || '',
        product_type: product_type || 'other',
        brand: brand || 'edxponential_core',
        product_name: product_name || '',
        ...metadata,
      },
    };

    if (isSubscription) {
      sessionConfig.subscription_data = { trial_period_days: 14 };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    await base44.entities.Transaction.create({
      stripe_session_id: session.id,
      user_email: user.email,
      user_name: user.full_name || '',
      amount: session.amount_total || (amount ? Math.round(amount * 100) : 0),
      amount_usd: (session.amount_total || (amount ? Math.round(amount * 100) : 0)) / 100,
      currency,
      product_type: product_type || 'other',
      product_name: product_name || description || '',
      brand: brand || 'edxponential_core',
      status: 'pending',
      description,
    });

    return Response.json({ url: session.url, session_id: session.id });
  } catch (error) {
    console.error('createCheckout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});