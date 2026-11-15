import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DollarSign, TrendingUp, XCircle, RefreshCw, CreditCard, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const STATUS_COLORS = {
  completed: 'text-green-400 bg-green-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  failed: 'text-red-400 bg-red-400/10',
  refunded: 'text-blue-400 bg-blue-400/10',
  partially_refunded: 'text-purple-400 bg-purple-400/10',
};

export default function ExecSales() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: transactions = [], isLoading } = useQuery({ queryKey: ['exec_txns_sales'], queryFn: () => base44.entities.Transaction.list('-created_date', 500) });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today - 7 * 86400000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);

  const completed = transactions.filter(t => t.status === 'completed');
  const failed = transactions.filter(t => t.status === 'failed');
  const refunded = transactions.filter(t => ['refunded', 'partially_refunded'].includes(t.status));
  const pending = transactions.filter(t => t.status === 'pending');

  const gross = completed.reduce((s, t) => s + (t.amount_usd || 0), 0);
  const refundTotal = refunded.reduce((s, t) => s + (t.refund_amount || t.amount_usd || 0), 0);
  const net = gross - refundTotal;
  const daily = completed.filter(t => new Date(t.created_date) >= today).reduce((s, t) => s + (t.amount_usd || 0), 0);
  const weekly = completed.filter(t => new Date(t.created_date) >= weekAgo).reduce((s, t) => s + (t.amount_usd || 0), 0);
  const monthly = completed.filter(t => new Date(t.created_date) >= monthAgo).reduce((s, t) => s + (t.amount_usd || 0), 0);
  const ytd = completed.filter(t => new Date(t.created_date) >= yearStart).reduce((s, t) => s + (t.amount_usd || 0), 0);
  const avgPurchase = completed.length > 0 ? gross / completed.length : 0;

  // Monthly chart
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const rev = completed.filter(t => { const td = new Date(t.created_date); return td >= d && td < end; }).reduce((s, t) => s + (t.amount_usd || 0), 0);
    monthlyData.push({ month: d.toLocaleString('default', { month: 'short' }), revenue: parseFloat(rev.toFixed(2)) });
  }

  // Product type pie
  const typeMap = {};
  completed.forEach(t => { typeMap[t.product_type || 'other'] = (typeMap[t.product_type || 'other'] || 0) + (t.amount_usd || 0); });
  const typeData = Object.entries(typeMap).map(([name, value], i) => ({
    name: name.replace(/_/g, ' '),
    value: parseFloat(value.toFixed(2)),
    color: ['#fff', '#ccc', '#999', '#777', '#555', '#333', '#888', '#aaa'][i % 8],
  }));

  const brands = [...new Set(transactions.map(t => t.brand).filter(Boolean))];
  const types = [...new Set(transactions.map(t => t.product_type).filter(Boolean))];

  const filtered = transactions.filter(t => {
    const ms = statusFilter === 'all' || t.status === statusFilter;
    const mb = brandFilter === 'all' || t.brand === brandFilter;
    const mt = typeFilter === 'all' || t.product_type === typeFilter;
    return ms && mb && mt;
  });

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { label: 'Gross Revenue', value: `$${gross.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign },
          { label: 'Net Revenue', value: `$${net.toFixed(2)}`, icon: TrendingUp },
          { label: 'Daily Sales', value: `$${daily.toFixed(2)}`, icon: DollarSign },
          { label: 'Weekly Sales', value: `$${weekly.toFixed(2)}`, icon: TrendingUp },
          { label: 'Monthly Sales', value: `$${monthly.toFixed(2)}`, icon: DollarSign },
          { label: 'YTD Revenue', value: `$${ytd.toFixed(2)}`, icon: TrendingUp },
          { label: 'Avg Purchase', value: `$${avgPurchase.toFixed(2)}`, icon: CreditCard },
          { label: 'Refund Total', value: `$${refundTotal.toFixed(2)}`, icon: RefreshCw },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <s.icon className="w-4 h-4 text-white/30 mb-2" />
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-white/35 text-[11px] font-bold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Status counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Completed', value: completed.length, color: 'text-green-400', icon: CheckCircle },
          { label: 'Pending', value: pending.length, color: 'text-yellow-400', icon: CreditCard },
          { label: 'Failed', value: failed.length, color: 'text-red-400', icon: XCircle },
          { label: 'Refunded', value: refunded.length, color: 'text-blue-400', icon: RefreshCw },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
            <s.icon className={`w-5 h-5 ${s.color} flex-shrink-0`} />
            <div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-white/35 text-[11px] font-bold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="font-black text-sm text-white mb-4">Monthly Revenue Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }} formatter={v => [`$${v}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="rgba(255,255,255,0.8)" strokeWidth={2} fill="url(#sg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="font-black text-sm text-white mb-4">Revenue by Type</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} paddingAngle={3} dataKey="value">
                {typeData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }} formatter={v => `$${v}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {typeData.slice(0, 4).map((t, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: t.color }} /><span className="text-white/45 capitalize">{t.name}</span></div>
                <span className="text-white font-bold">${t.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Transaction Table */}
      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-8 text-xs bg-white/[0.05] border-white/10 text-white/70 rounded-xl"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {['completed', 'pending', 'failed', 'refunded'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="w-40 h-8 text-xs bg-white/[0.05] border-white/10 text-white/70 rounded-xl"><SelectValue placeholder="All Brands" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map(b => <SelectItem key={b} value={b}>{b.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-8 text-xs bg-white/[0.05] border-white/10 text-white/70 rounded-xl"><SelectValue placeholder="All Product Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-white/25 text-xs ml-auto self-center">{filtered.length} transactions</span>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-white/[0.06]">
              {['Date', 'Customer', 'Product', 'Brand', 'Amount', 'Status'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black text-white/25 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                [...Array(6)].map((_, i) => <tr key={i}><td colSpan={6} className="px-5 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>)
              ) : filtered.slice(0, 50).map(t => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white/35">{new Date(t.created_date).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-white/70">{t.user_name || '—'}</p>
                    <p className="text-white/30 text-[10px]">{t.user_email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-white/50 max-w-[160px] truncate">{t.product_name || (t.product_type || '').replace(/_/g, ' ')}</td>
                  <td className="px-5 py-3.5"><span className="bg-white/10 text-white/50 px-2 py-0.5 rounded-full text-[10px] font-black capitalize">{(t.brand || 'core').replace(/_/g, ' ')}</span></td>
                  <td className="px-5 py-3.5 font-black text-white">${(t.amount_usd || 0).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${STATUS_COLORS[t.status] || 'bg-white/5 text-white/30'}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}