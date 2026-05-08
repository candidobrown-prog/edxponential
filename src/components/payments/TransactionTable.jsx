import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Search, Filter, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const STATUS_CONFIG = {
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
  refunded: { icon: RotateCcw, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Refunded' },
  partially_refunded: { icon: RotateCcw, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Partial Refund' },
  disputed: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Disputed' },
};

export default function TransactionTable({ transactions, loading, onRefund }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [refundModal, setRefundModal] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);
  const queryClient = useQueryClient();

  const filtered = transactions.filter(t => {
    const matchSearch = !search || t.user_email?.includes(search) || t.product_name?.includes(search) || t.stripe_session_id?.includes(search);
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchBrand = brandFilter === 'all' || t.brand === brandFilter;
    return matchSearch && matchStatus && matchBrand;
  });

  const handleRefund = async () => {
    if (!refundModal) return;
    setIsRefunding(true);
    try {
      await base44.functions.invoke('adminIssueRefund', {
        transaction_id: refundModal.id,
        amount: refundAmount ? parseFloat(refundAmount) : undefined,
        reason: refundReason || undefined,
      });
      toast.success('Refund issued successfully');
      setRefundModal(null);
      setRefundAmount('');
      setRefundReason('');
      onRefund?.();
    } catch (e) {
      toast.error('Refund failed: ' + e.message);
    }
    setIsRefunding(false);
  };

  const brands = [...new Set(transactions.map(t => t.brand).filter(Boolean))];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9 rounded-xl" placeholder="Search by email, product, ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.keys(STATUS_CONFIG).map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="w-44 rounded-xl"><SelectValue placeholder="All Brands" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map(b => <SelectItem key={b} value={b}>{b.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground ml-auto">{filtered.length} records</div>
      </div>

      <div className="border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {['Date', 'User', 'Product', 'Brand', 'Amount', 'Status', 'Payout', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-black text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">No transactions found</td></tr>
              ) : filtered.map(tx => {
                const s = STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending;
                const Icon = s.icon;
                return (
                  <tr key={tx.id} className={`hover:bg-muted/20 transition-colors ${tx.flagged ? 'bg-orange-50/50' : ''}`}>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(tx.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-xs">{tx.user_name || '—'}</p>
                      <p className="text-[11px] text-muted-foreground">{tx.user_email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium max-w-[140px] truncate">{tx.product_name || tx.product_type?.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded-full capitalize">
                        {(tx.brand || 'core').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-sm">${(tx.amount_usd || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1.5 ${s.bg} ${s.color} px-2.5 py-1 rounded-full text-[11px] font-bold`}>
                        <Icon className="w-3 h-3" />{s.label}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold ${tx.payout_status === 'paid' ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {tx.payout_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {tx.status === 'completed' && (
                        <Button size="sm" variant="outline" className="h-7 text-[11px] rounded-lg px-2 gap-1"
                          onClick={() => setRefundModal(tx)}>
                          <RotateCcw className="w-3 h-3" /> Refund
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Dialog */}
      <Dialog open={!!refundModal} onOpenChange={v => !v && setRefundModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black">Issue Refund</DialogTitle>
          </DialogHeader>
          {refundModal && (
            <div className="space-y-4 mt-2">
              <div className="bg-muted/40 rounded-xl p-4 space-y-1 text-sm">
                <p><span className="font-bold">Customer:</span> {refundModal.user_email}</p>
                <p><span className="font-bold">Product:</span> {refundModal.product_name}</p>
                <p><span className="font-bold">Charged:</span> ${refundModal.amount_usd?.toFixed(2)}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Refund Amount (leave blank for full refund)</label>
                <Input type="number" placeholder={`Up to $${refundModal.amount_usd?.toFixed(2)}`} value={refundAmount} onChange={e => setRefundAmount(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Reason</label>
                <Input placeholder="e.g. Customer request, duplicate charge..." value={refundReason} onChange={e => setRefundReason(e.target.value)} className="rounded-xl" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setRefundModal(null)}>Cancel</Button>
                <Button className="flex-1 rounded-xl" onClick={handleRefund} disabled={isRefunding}>
                  {isRefunding ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing…</> : 'Confirm Refund'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}