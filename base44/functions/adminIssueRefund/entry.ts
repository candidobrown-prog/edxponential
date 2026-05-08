import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { transaction_id, amount, reason } = await req.json();
    if (!transaction_id) return Response.json({ error: 'transaction_id required' }, { status: 400 });

    const transactions = await base44.asServiceRole.entities.Transaction.filter({ id: transaction_id });
    if (!transactions.length) return Response.json({ error: 'Transaction not found' }, { status: 404 });

    const tx = transactions[0];
    if (!tx.stripe_payment_intent_id) return Response.json({ error: 'No payment intent found' }, { status: 400 });

    const refundParams = { payment_intent: tx.stripe_payment_intent_id };
    if (amount) refundParams.amount = Math.round(amount * 100);
    if (reason) refundParams.reason = reason;

    const refund = await stripe.refunds.create(refundParams);

    const refundUsd = refund.amount / 100;
    const isFullRefund = refund.amount >= tx.amount;

    await base44.asServiceRole.entities.Transaction.update(tx.id, {
      status: isFullRefund ? 'refunded' : 'partially_refunded',
      refund_amount: refundUsd,
      stripe_refund_id: refund.id,
      refund_reason: reason || '',
      refunded_at: new Date().toISOString(),
      admin_notes: `Refund issued by admin ${user.email} on ${new Date().toLocaleDateString()}`,
    });

    return Response.json({ success: true, refund_id: refund.id, amount_refunded: refundUsd });
  } catch (error) {
    console.error('adminIssueRefund error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});