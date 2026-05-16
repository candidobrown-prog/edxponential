import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    let event;
    if (webhookSecret && sig) {
      event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    const base44 = createClientFromRequest(req);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const meta = session.metadata || {};

      // Update transaction to completed
      const existing = await base44.asServiceRole.entities.Transaction.filter({ stripe_session_id: session.id });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.Transaction.update(existing[0].id, {
          status: 'completed',
          stripe_payment_intent_id: session.payment_intent || '',
          stripe_customer_id: session.customer || '',
          amount: session.amount_total || 0,
          amount_usd: (session.amount_total || 0) / 100,
          receipt_url: session.receipt_url || '',
          payout_status: 'pending',
        });
      } else {
        // Create new if webhook arrives before frontend
        await base44.asServiceRole.entities.Transaction.create({
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent || '',
          stripe_customer_id: session.customer || '',
          user_email: meta.user_email || session.customer_email || '',
          user_name: meta.user_name || '',
          amount: session.amount_total || 0,
          amount_usd: (session.amount_total || 0) / 100,
          currency: session.currency || 'usd',
          product_type: meta.product_type || 'other',
          product_name: meta.product_name || '',
          brand: meta.brand || 'edxponential_core',
          status: 'completed',
          payout_status: 'pending',
        });
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      const existing = await base44.asServiceRole.entities.Transaction.filter({ stripe_payment_intent_id: pi.id });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.Transaction.update(existing[0].id, { status: 'failed' });
      }
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const existing = await base44.asServiceRole.entities.Transaction.filter({ stripe_payment_intent_id: charge.payment_intent });
      if (existing.length > 0) {
        const refundAmount = charge.amount_refunded / 100;
        await base44.asServiceRole.entities.Transaction.update(existing[0].id, {
          status: charge.refunded ? 'refunded' : 'partially_refunded',
          refund_amount: refundAmount,
          refunded_at: new Date().toISOString(),
        });
      }
    }

    // Sync subscription status to user profile
    if (['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)) {
      const sub = event.data.object;
      const customerId = sub.customer;
      const status = sub.status; // trialing, active, canceled, past_due, etc.

      // Find user by stripe_customer_id stored in their profile via Transaction
      const transactions = await base44.asServiceRole.entities.Transaction.filter({ stripe_customer_id: customerId });
      if (transactions.length > 0) {
        const userEmail = transactions[0].user_email;
        const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
        if (users.length > 0) {
          const dashboardUnlocked = status === 'trialing' || status === 'active';
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: status,
            stripe_subscription_id: sub.id,
            stripe_customer_id: customerId,
            payment_method_added: true,
            dashboard_unlocked: dashboardUnlocked,
            trial_end_date: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          });
          console.log(`Updated user ${userEmail} subscription status to ${status}`);
        }
      }
    }

    if (event.type === 'checkout.session.completed') {
      // Also mark payment_method_added on checkout complete for subscriptions
      const session = event.data.object;
      if (session.mode === 'subscription' && session.customer_email) {
        const users = await base44.asServiceRole.entities.User.filter({ email: session.customer_email });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            payment_method_added: true,
            stripe_customer_id: session.customer || '',
          });
        }
      }
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      const transactions = await base44.asServiceRole.entities.Transaction.filter({ stripe_customer_id: customerId });
      if (transactions.length > 0) {
        const userEmail = transactions[0].user_email;
        const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: 'past_due',
            dashboard_unlocked: false,
          });
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('stripeWebhook error:', error.message);
    return Response.json({ error: error.message }, { status: 400 });
  }
});