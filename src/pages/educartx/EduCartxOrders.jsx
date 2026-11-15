import React, { useState } from 'react';
import { ShoppingCart, Search, Package, Truck, CheckCircle, Clock, XCircle, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ORDERS = [
  { id: 'ECX-10291', customer: 'Sarah Johnson', product: 'K-5 Reading Bundle', amount: 89, status: 'delivered', date: '2026-05-08', type: 'digital' },
  { id: 'ECX-10290', customer: 'Marcus Lee', product: '30-Day Teacher Bootcamp', amount: 149, status: 'processing', date: '2026-05-08', type: 'course' },
  { id: 'ECX-10289', customer: 'Priya Sharma', product: 'School Leader Hoodie', amount: 65, status: 'shipped', date: '2026-05-07', type: 'physical' },
  { id: 'ECX-10288', customer: 'Kwame Osei', product: 'EdVisor Strategy Session', amount: 299, status: 'delivered', date: '2026-05-07', type: 'service' },
  { id: 'ECX-10287', customer: 'Lisa Chen', product: 'MTSS Intervention Toolkit', amount: 129, status: 'delivered', date: '2026-05-06', type: 'digital' },
  { id: 'ECX-10286', customer: 'James Rivera', product: 'Charter Launch Playbook', amount: 97, status: 'refunded', date: '2026-05-05', type: 'digital' },
  { id: 'ECX-10285', customer: 'Amara Wilson', product: 'Principal Masterclass', amount: 349, status: 'delivered', date: '2026-05-05', type: 'course' },
  { id: 'ECX-10284', customer: 'Derek Thompson', product: 'K-5 Reading Bundle', amount: 89, status: 'processing', date: '2026-05-04', type: 'digital' },
];

const STATUS_CONFIG = {
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-white/60', bg: 'bg-white/8' },
  processing: { label: 'Processing', icon: Clock, color: 'text-yellow-400/60', bg: 'bg-yellow-400/8' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-white/50', bg: 'bg-white/5' },
  refunded: { label: 'Refunded', icon: XCircle, color: 'text-red-400/60', bg: 'bg-red-400/8' },
};

export default function EduCartxOrders() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = ORDERS.filter(o =>
    (filter === 'all' || o.status === filter) &&
    (!search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const totals = {
    revenue: ORDERS.filter(o => o.status !== 'refunded').reduce((s, o) => s + o.amount, 0),
    orders: ORDERS.length,
    pending: ORDERS.filter(o => o.status === 'processing').length,
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-4 h-4 text-white/50" />
            <h1 className="font-black text-lg tracking-tight">Orders & Fulfillment</h1>
          </div>
          <p className="text-xs text-white/30">Track, manage, and fulfill customer orders</p>
        </div>
        <Button variant="outline" className="border-white/10 text-white/40 text-xs h-8 px-3 hover:bg-white/5 gap-1.5 rounded-full">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>

      <div className="px-8 py-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Revenue', value: `$${totals.revenue.toLocaleString()}` },
            { label: 'Total Orders', value: totals.orders },
            { label: 'Pending', value: totals.pending },
          ].map((s, i) => (
            <div key={i} className="border border-white/6 rounded-xl p-4 bg-white/1 text-center">
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-[10px] text-white/25 uppercase tracking-widest font-bold mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders, customers..."
              className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
          </div>
          <div className="flex gap-2">
            {['all', 'processing', 'shipped', 'delivered', 'refunded'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${filter === s ? 'bg-white text-black' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="border border-white/6 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-5 py-3 border-b border-white/5 text-[10px] font-black text-white/25 uppercase tracking-widest">
            <span>Order ID</span><span className="col-span-2">Customer / Product</span><span>Type</span><span>Amount</span><span>Status</span>
          </div>
          {filtered.map(o => {
            const S = STATUS_CONFIG[o.status];
            const StatusIcon = S.icon;
            return (
              <div key={o.id} className="grid grid-cols-6 gap-4 px-5 py-4 border-b border-white/4 hover:bg-white/2 transition-all items-center">
                <span className="text-xs font-black text-white/40">{o.id}</span>
                <div className="col-span-2">
                  <div className="text-sm font-black text-white/70">{o.customer}</div>
                  <div className="text-[10px] text-white/25 mt-0.5 truncate">{o.product}</div>
                </div>
                <span className="text-[10px] bg-white/5 text-white/35 px-2 py-0.5 rounded-full w-fit capitalize">{o.type}</span>
                <span className="font-black text-white/60 text-sm">${o.amount}</span>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full w-fit ${S.bg}`}>
                  <StatusIcon className={`w-3 h-3 ${S.color}`} />
                  <span className={`text-[10px] font-black ${S.color}`}>{S.label}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/20">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-black">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}