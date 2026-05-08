import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const transactions = await base44.asServiceRole.entities.Transaction.list('-created_date', 500);

    const completed = transactions.filter(t => t.status === 'completed');
    const failed = transactions.filter(t => t.status === 'failed');
    const refunded = transactions.filter(t => ['refunded', 'partially_refunded'].includes(t.status));
    const pending = transactions.filter(t => t.status === 'pending');

    const gross = completed.reduce((s, t) => s + (t.amount_usd || 0), 0);
    const refundTotal = refunded.reduce((s, t) => s + (t.refund_amount || 0), 0);
    const net = gross - refundTotal;

    // Revenue by brand
    const byBrand = {};
    completed.forEach(t => {
      const b = t.brand || 'edxponential_core';
      byBrand[b] = (byBrand[b] || 0) + (t.amount_usd || 0);
    });

    // Revenue by product type
    const byType = {};
    completed.forEach(t => {
      const type = t.product_type || 'other';
      byType[type] = (byType[type] || 0) + (t.amount_usd || 0);
    });

    // Monthly breakdown (last 6 months)
    const monthly = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthly[key] = 0;
    }
    completed.forEach(t => {
      const d = new Date(t.created_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthly[key] !== undefined) monthly[key] += (t.amount_usd || 0);
    });

    // MRR estimate — subscriptions in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSubs = completed.filter(t =>
      t.product_type?.includes('subscription') && new Date(t.created_date) >= thirtyDaysAgo
    );
    const mrr = recentSubs.reduce((s, t) => s + (t.amount_usd || 0), 0);

    return Response.json({
      gross_revenue: gross,
      net_revenue: net,
      refund_total: refundTotal,
      total_transactions: completed.length,
      failed_transactions: failed.length,
      pending_transactions: pending.length,
      mrr,
      arr: mrr * 12,
      revenue_by_brand: byBrand,
      revenue_by_type: byType,
      monthly_revenue: monthly,
      flagged_transactions: transactions.filter(t => t.flagged).length,
    });
  } catch (error) {
    console.error('getFinancialSummary error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});