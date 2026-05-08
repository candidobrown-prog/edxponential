import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

// Price catalog — map product_type to Stripe price IDs
const PRICE_MAP = {
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

    const { product_type, price_id, amount, currency = 'usd', description, brand, product_name, custom_price, metadata = {} } = await req.json();

    // Resolve price — use custom price_id, catalog lookup, or dynamic price
    let lineItems;
    const resolvedPriceId = price_id || PRICE_MAP[product_type];

    if (resolvedPriceId) {
      lineItems = [{ price: resolvedPriceId, quantity: 1 }];
    } else if (amount) {
      // Dynamic price for custom amounts (donations, investments, custom bookings)
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

    const session = await stripe.checkout.sessions.create({
      mode: resolvedPriceId && (product_type?.includes('subscription') || PRICE_MAP[product_type]?.includes('monthly') || PRICE_MAP[product_type]?.includes('yearly')) ? 'subscription' : 'payment',
      line_items: lineItems,
      customer_email: user.email,
      success_url: `${origin}/billing?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing?payment=cancelled`,
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
    });

    // Record pending transaction
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