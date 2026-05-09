import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, QrCode, Smartphone, CheckCircle, TrendingUp, Users, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PAYMENT_TYPES = [
  { label: 'Tuition Payments', amount: 284000, count: 142, trend: '+8%' },
  { label: 'Fees & Activities', amount: 12400, count: 87, trend: '+3%' },
  { label: 'Donations', amount: 34800, count: 203, trend: '+22%' },
  { label: 'Fundraiser Proceeds', amount: 18600, count: 56, trend: '+15%' },
  { label: 'Event Tickets', amount: 4200, count: 34, trend: '+5%' },
  { label: 'Merchandise', amount: 2800, count: 28, trend: '-2%' },
];

const MONTHLY = [
  { month: 'Aug', tuition: 180, fees: 8, other: 12 },
  { month: 'Sep', tuition: 195, fees: 9, other: 18 },
  { month: 'Oct', tuition: 210, fees: 11, other: 22 },
  { month: 'Nov', tuition: 200, fees: 10, other: 15 },
  { month: 'Dec', tuition: 185, fees: 8, other: 10 },
  { month: 'Jan', tuition: 220, fees: 12, other: 24 },
  { month: 'Feb', tuition: 230, fees: 13, other: 28 },
  { month: 'Mar', tuition: 245, fees: 14, other: 30 },
  { month: 'Apr', tuition: 255, fees: 15, other: 32 },
  { month: 'May', tuition: 260, fees: 16, other: 35 },
];

const PAYMENT_METHODS = [
  { method: 'ACH / Bank Transfer', pct: 48, icon: '🏦' },
  { method: 'Credit Card', pct: 28, icon: '💳' },
  { method: 'Apple Pay', pct: 12, icon: '🍎' },
  { method: 'Google Pay', pct: 8, icon: '🔵' },
  { method: 'QR Code / Mobile', pct: 4, icon: '📱' },
];

const RECENT = [
  { name: 'Johnson Family', type: 'Tuition - Q4', amount: 2400, method: 'ACH', status: 'completed', date: '2026-05-08' },
  { name: 'Smith Family', type: 'Activity Fee', amount: 120, method: 'Apple Pay', status: 'completed', date: '2026-05-08' },
  { name: 'Rodriguez Family', type: 'Tuition - Q4', amount: 2400, method: 'Credit Card', status: 'pending', date: '2026-05-07' },
  { name: 'Anonymous Donor', type: 'Capital Campaign', amount: 5000, method: 'ACH', status: 'completed', date: '2026-05-07' },
  { name: 'Williams Family', type: 'Spring Fundraiser', amount: 250, method: 'Credit Card', status: 'completed', date: '2026-05-06' },
];

export default function OpxPayments() {
  const [activePortal, setActivePortal] = useState(null);

  const totalRevenue = PAYMENT_TYPES.reduce((a, p) => a + p.amount, 0);

  return (
    <div className="min-h-screen bg-[#06060c] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white">PayX™</h1>
          <p className="text-xs text-white/25 mt-0.5">School payment acceptance, tuition & billing</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">
          <Plus className="w-3 h-3" /> Create Payment Link
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue YTD', value: `$${(totalRevenue / 1000).toFixed(0)}K` },
          { label: 'Transactions (30d)', value: '548', trend: '+12%' },
          { label: 'Collection Rate', value: '94.2%', trend: '+1.8%' },
          { label: 'Outstanding', value: '$48.2K' },
        ].map(({ label, value, trend }) => (
          <div key={label} className="bg-[#08080f] border border-white/6 rounded-2xl p-5">
            <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-2">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
            {trend && <p className="text-[10px] text-emerald-400 mt-1 font-bold">{trend}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-[#08080f] border border-white/6 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-1">Monthly Revenue Breakdown</p>
          <p className="text-[10px] text-white/25 mb-4">Tuition, fees & other income ($K)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255,255,255,0.12)" /><stop offset="95%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11 }} />
              <Area type="monotone" dataKey="tuition" stroke="rgba(255,255,255,0.6)" fill="url(#tGrad)" strokeWidth={1.5} name="Tuition $K" stackId="1" />
              <Area type="monotone" dataKey="fees" stroke="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.03)" strokeWidth={1} name="Fees $K" stackId="1" />
              <Area type="monotone" dataKey="other" stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.02)" strokeWidth={1} name="Other $K" stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment methods */}
        <div className="bg-[#08080f] border border-white/6 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-1">Payment Methods</p>
          <p className="text-[10px] text-white/25 mb-4">Distribution by volume</p>
          {PAYMENT_METHODS.map(({ method, pct, icon }) => (
            <div key={method} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-white/40 flex items-center gap-1.5">{icon} {method}</span>
                <span className="text-[10px] font-black text-white/50">{pct}%</span>
              </div>
              <div className="h-1 bg-white/4 rounded-full">
                <motion.div className="h-full bg-white/40 rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment type cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PAYMENT_TYPES.map(({ label, amount, count, trend }) => (
          <div key={label} className="bg-[#08080f] border border-white/6 rounded-2xl p-5 hover:border-white/12 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-black text-white/70 group-hover:text-white transition-colors">{label}</p>
              <span className={`text-[9px] font-bold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{trend}</span>
            </div>
            <p className="text-2xl font-black text-white">${(amount / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-white/25 mt-1">{count} transactions</p>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="bg-[#08080f] border border-white/6 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <p className="text-xs font-black text-white">Recent Transactions</p>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {RECENT.map((tx, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-[10px] font-black text-white/50 flex-shrink-0">
                {tx.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-white/70 truncate">{tx.name}</p>
                <p className="text-[10px] text-white/25">{tx.type} · {tx.method} · {tx.date}</p>
              </div>
              <p className="font-black text-sm text-white">${tx.amount.toLocaleString()}</p>
              <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {tx.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}