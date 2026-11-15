import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart3, Plus, TrendingUp, TrendingDown, DollarSign, Sparkles, Upload, Download, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const CATEGORIES = ['personnel', 'benefits', 'supplies', 'technology', 'facilities', 'transportation', 'food_service', 'professional_development', 'grants', 'other'];

const CASH_FLOW = [
  { month: 'Jan', inflow: 580, outflow: 511 }, { month: 'Feb', inflow: 620, outflow: 528 },
  { month: 'Mar', inflow: 600, outflow: 543 }, { month: 'Apr', inflow: 640, outflow: 561 },
  { month: 'May', inflow: 660, outflow: 572 }, { month: 'Jun', inflow: 590, outflow: 545 },
];

export default function OpxFinance() {
  const [showForm, setShowForm] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [form, setForm] = useState({ fiscal_year: '2025-26', line_item: '', budgeted_amount: '', actual_amount: '', category: 'personnel', department: '', fund_source: '' });
  const qc = useQueryClient();

  const { data: budgets = [] } = useQuery({ queryKey: ['opx-budgets'], queryFn: () => base44.entities.OpxBudget.list('-created_date', 200) });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.OpxBudget.create({ ...data, budgeted_amount: +data.budgeted_amount, actual_amount: +data.actual_amount || 0 }),
    onSuccess: () => { qc.invalidateQueries(['opx-budgets']); setShowForm(false); setForm({ ...form, line_item: '', budgeted_amount: '', actual_amount: '' }); }
  });

  const totalBudgeted = budgets.reduce((a, b) => a + (b.budgeted_amount || 0), 0);
  const totalActual = budgets.reduce((a, b) => a + (b.actual_amount || 0), 0);
  const totalVariance = totalBudgeted - totalActual;
  const overspent = budgets.filter(b => (b.actual_amount || 0) > (b.budgeted_amount || 0)).length;

  const catSpend = CATEGORIES.map(cat => ({
    cat: cat.replace(/_/g, ' '),
    budgeted: budgets.filter(b => b.category === cat).reduce((a, b) => a + (b.budgeted_amount || 0), 0),
    actual: budgets.filter(b => b.category === cat).reduce((a, b) => a + (b.actual_amount || 0), 0),
  })).filter(c => c.budgeted > 0 || c.actual > 0);

  const generateInsight = async () => {
    setGenLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are FinanceX™ AI. Analyze these school budget metrics and provide a 3-sentence financial health assessment with 2 actionable recommendations:
Total Budgeted: $${totalBudgeted.toLocaleString()}
Total Actual: $${totalActual.toLocaleString()}
Variance: $${totalVariance.toLocaleString()} (${totalBudgeted > 0 ? Math.round((totalVariance/totalBudgeted)*100) : 0}%)
Overspent line items: ${overspent}
Top categories: ${catSpend.slice(0,3).map(c => `${c.cat}: $${c.actual.toLocaleString()}`).join(', ')}
Be direct, CFO-level, specific.`,
    });
    setAiInsight(res);
    setGenLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#06060c] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white">FinanceX™</h1>
          <p className="text-xs text-white/25 mt-0.5">Budget management, forecasting & fund accounting</p>
        </div>
        <div className="flex gap-3">
          <button onClick={generateInsight} disabled={genLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 text-xs text-white/40 hover:text-white/70 transition-all">
            <Sparkles className={`w-3 h-3 ${genLoading ? 'animate-pulse' : ''}`} /> AI Insight
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">
            <Plus className="w-3 h-3" /> Add Line Item
          </button>
        </div>
      </div>

      {/* AI Insight */}
      {aiInsight && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#08080f] border border-white/6 rounded-2xl p-5 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/50 leading-relaxed">{aiInsight}</p>
        </motion.div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Budget', value: `$${(totalBudgeted/1000).toFixed(0)}K`, sub: 'FY 2025–26' },
          { label: 'YTD Actual', value: `$${(totalActual/1000).toFixed(0)}K`, sub: `${totalBudgeted>0?Math.round((totalActual/totalBudgeted)*100):0}% utilized` },
          { label: 'Variance', value: `$${Math.abs(totalVariance/1000).toFixed(0)}K`, sub: totalVariance >= 0 ? 'under budget' : 'OVER BUDGET', alert: totalVariance < 0 },
          { label: 'Overspent Items', value: overspent, sub: 'need review', alert: overspent > 0 },
        ].map(({ label, value, sub, alert }) => (
          <div key={label} className={`rounded-2xl p-5 border ${alert ? 'bg-red-500/5 border-red-500/15' : 'bg-[#08080f] border-white/6'}`}>
            <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-2">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className={`text-[10px] mt-1 ${alert ? 'text-red-400' : 'text-white/25'}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#08080f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-4">Add Budget Line Item</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              { key: 'line_item', placeholder: 'Line Item Name *', span: 'col-span-2' },
              { key: 'department', placeholder: 'Department' },
              { key: 'budgeted_amount', placeholder: 'Budgeted Amount *', type: 'number' },
              { key: 'actual_amount', placeholder: 'Actual Amount', type: 'number' },
              { key: 'fund_source', placeholder: 'Fund Source / Grant' },
            ].map(({ key, placeholder, type, span }) => (
              <input key={key} type={type || 'text'} placeholder={placeholder} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className={`${span || ''} bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20`} />
            ))}
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20">
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d0d1a]">{c.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => createMutation.mutate(form)}
              className="px-5 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">
              Save Line Item
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg border border-white/8 text-xs text-white/40 hover:text-white/60 transition-all">Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-[#08080f] border border-white/6 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-1">Cash Flow Analysis</p>
          <p className="text-[10px] text-white/25 mb-4">Monthly inflow vs outflow ($K)</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={CASH_FLOW}>
              <defs>
                <linearGradient id="inflowG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(16,185,129,0.15)" /><stop offset="95%" stopColor="rgba(16,185,129,0)" />
                </linearGradient>
                <linearGradient id="outflowG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255,255,255,0.06)" /><stop offset="95%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11 }} />
              <Area type="monotone" dataKey="inflow" stroke="#10b981" fill="url(#inflowG)" strokeWidth={1.5} name="Revenue $K" />
              <Area type="monotone" dataKey="outflow" stroke="rgba(255,255,255,0.4)" fill="url(#outflowG)" strokeWidth={1.5} name="Expenses $K" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#08080f] border border-white/6 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-1">Budget by Category</p>
          <p className="text-[10px] text-white/25 mb-4">Budgeted vs actual spend</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={catSpend.slice(0, 6)}>
              <XAxis dataKey="cat" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11 }} />
              <Bar dataKey="budgeted" fill="rgba(255,255,255,0.15)" radius={[3, 3, 0, 0]} name="Budgeted" />
              <Bar dataKey="actual" fill="rgba(255,255,255,0.5)" radius={[3, 3, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget table */}
      <div className="bg-[#08080f] border border-white/6 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <p className="text-xs font-black text-white">Budget Line Items</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/4">
                {['Line Item', 'Department', 'Category', 'Budgeted', 'Actual', 'Variance', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-white/25 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {budgets.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-white/20 text-xs">No budget items yet. Add your first line item above.</td></tr>
              ) : budgets.map(b => {
                const variance = (b.budgeted_amount || 0) - (b.actual_amount || 0);
                const over = variance < 0;
                return (
                  <tr key={b.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-bold text-white/70">{b.line_item}</td>
                    <td className="px-4 py-3 text-white/30">{b.department || '—'}</td>
                    <td className="px-4 py-3 text-white/30 capitalize">{b.category?.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 font-bold text-white/60">${(b.budgeted_amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-white/60">${(b.actual_amount || 0).toLocaleString()}</td>
                    <td className={`px-4 py-3 font-black ${over ? 'text-red-400' : 'text-emerald-400'}`}>
                      {over ? '-' : '+'}${Math.abs(variance).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${over ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {over ? 'Over' : 'On Track'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}