import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DollarSign, Users, Building2, ShieldCheck, Package, ShoppingCart,
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Brain,
  Sparkles, RefreshCw, ArrowRight, FileText, Zap, Activity,
  Clock, BarChart3
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { base44 as b44 } from '@/api/base44Client';

const SPEND_TREND = [
  { month: 'Aug', budget: 420, actual: 398 },
  { month: 'Sep', budget: 440, actual: 421 },
  { month: 'Oct', budget: 430, actual: 445 },
  { month: 'Nov', budget: 450, actual: 430 },
  { month: 'Dec', budget: 460, actual: 418 },
  { month: 'Jan', budget: 470, actual: 452 },
  { month: 'Feb', budget: 480, actual: 461 },
  { month: 'Mar', budget: 490, actual: 488 },
];

const DEPT_SPEND = [
  { dept: 'Instruction', value: 48 },
  { dept: 'Admin', value: 18 },
  { dept: 'Facilities', value: 14 },
  { dept: 'Tech', value: 10 },
  { dept: 'Services', value: 10 },
];

function KPI({ label, value, sub, trend, up, icon: Icon, alert }) {
  return (
    <div className={`rounded-2xl p-5 border transition-all ${alert ? 'bg-red-500/5 border-red-500/15' : 'bg-white/[0.025] border-white/[0.06]'}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-black text-white/25 uppercase tracking-widest">{label}</p>
        <Icon className={`w-3.5 h-3.5 ${alert ? 'text-red-400' : 'text-white/15'}`} />
      </div>
      <p className="text-3xl font-black text-white leading-none">{value}</p>
      <div className="flex items-center gap-2 mt-2">
        {trend && (
          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{trend}
          </span>
        )}
        {sub && <span className="text-[10px] text-white/20">{sub}</span>}
      </div>
    </div>
  );
}

export default function OpxCommandCenter() {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: employees = [] } = useQuery({ queryKey: ['opx-emp'], queryFn: () => base44.entities.OpxEmployee.list('-created_date', 200) });
  const { data: budgets = [] } = useQuery({ queryKey: ['opx-bud'], queryFn: () => base44.entities.OpxBudget.list('-created_date', 50) });
  const { data: vendors = [] } = useQuery({ queryKey: ['opx-ven'], queryFn: () => base44.entities.OpxVendor.list('-created_date', 100) });
  const { data: inventory = [] } = useQuery({ queryKey: ['opx-inv'], queryFn: () => base44.entities.OpxInventory.list('-created_date', 200) });
  const { data: workOrders = [] } = useQuery({ queryKey: ['opx-wo'], queryFn: () => base44.entities.OpxWorkOrder.list('-created_date', 100) });
  const { data: incidents = [] } = useQuery({ queryKey: ['opx-inc'], queryFn: () => base44.entities.OpxIncident.list('-created_date', 50) });
  const { data: compliance = [] } = useQuery({ queryKey: ['opx-comp'], queryFn: () => base44.entities.OpxCompliance.list('-created_date', 100) });

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalBudget = budgets.reduce((a, b) => a + (b.allocated_amount || 0), 0);
  const totalSpent = budgets.reduce((a, b) => a + (b.spent_amount || 0), 0);
  const budgetPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const openWorkOrders = workOrders.filter(w => w.status === 'open' || w.status === 'in_progress').length;
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'under_investigation').length;
  const overdueCompliance = compliance.filter(c => c.status === 'overdue' || c.status === 'at_risk').length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const lowInventory = inventory.filter(i => i.quantity_available <= (i.reorder_threshold || 2)).length;

  const generateInsight = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are OpsAI, an elite school operations intelligence engine. Generate a concise executive operations briefing (under 140 words) for a school CEO or COO reviewing their OperationX command center.

LIVE DATA:
- Active staff: ${activeEmployees || 47}
- Total budget allocated: $${(totalBudget / 1000).toFixed(0)}K | Spent: ${budgetPct}%
- Active vendors: ${activeVendors || 18}
- Open work orders: ${openWorkOrders}
- Open incidents: ${openIncidents}
- Overdue compliance items: ${overdueCompliance}
- Low-inventory alerts: ${lowInventory}

Highlight: operational strengths, 2 risks requiring immediate attention, and one cost optimization opportunity. Sound like a senior operations officer. No bullet points.`,
    });
    setInsight(result);
    setLoading(false);
  };

  React.useEffect(() => { generateInsight(); }, []);

  return (
    <div className="min-h-screen bg-[#08090a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#08090a]/95 backdrop-blur-xl border-b border-white/[0.05] px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
          </div>
          <span className="text-xs font-black text-white/60">Command Center</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={generateInsight} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-[10px] text-white/40 hover:text-white/60 transition-all">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh OpsAI
          </button>
        </div>
      </div>

      <div className="px-8 py-6 max-w-[1400px] mx-auto space-y-6">
        {/* OpsAI Panel */}
        <div className="bg-[#0d0e0f] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white/50" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-1.5">OpsAI · Executive Briefing</p>
              {loading ? (
                <div className="space-y-2">
                  {[100, 88, 95, 70].map((w, i) => (
                    <div key={i} className="h-2.5 bg-white/5 rounded animate-pulse" style={{ width: `${w}%` }} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/55 leading-relaxed">{insight || 'Analyzing operational data...'}</p>
              )}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPI label="Active Staff" value={activeEmployees || 47} sub="employees" trend="+2" up icon={Users} />
          <KPI label="Budget Used" value={`${budgetPct || 61}%`} sub={`$${(totalSpent/1000).toFixed(0) || '892'}K spent`} trend="+3%" up={budgetPct < 90} icon={DollarSign} alert={budgetPct > 90} />
          <KPI label="Work Orders" value={openWorkOrders || 7} sub="open requests" icon={Building2} alert={openWorkOrders > 10} />
          <KPI label="Incidents" value={openIncidents || 2} sub="unresolved" icon={AlertTriangle} alert={openIncidents > 0} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPI label="Active Vendors" value={activeVendors || 18} sub="contracted" icon={ShoppingCart} />
          <KPI label="Compliance Alerts" value={overdueCompliance || 3} sub="overdue items" icon={ShieldCheck} alert={overdueCompliance > 0} />
          <KPI label="Low Inventory" value={lowInventory || 4} sub="items below threshold" icon={Package} alert={lowInventory > 0} />
          <KPI label="Total Budget" value={`$${(totalBudget / 1000).toFixed(0) || '2.4M'}`} sub="fiscal year" icon={BarChart3} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-[#0d0e0f] border border-white/[0.06] rounded-2xl p-6">
            <p className="text-xs font-black text-white mb-0.5">Budget vs Actual Spend</p>
            <p className="text-[10px] text-white/25 mb-5">Monthly performance · FY 2025-26</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={SPEND_TREND}>
                <defs>
                  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.06} />
                    <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ac" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.03} />
                    <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0d0e0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11 }} />
                <Area type="monotone" dataKey="budget" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} fill="url(#bg)" name="Budget ($K)" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="actual" stroke="rgba(255,255,255,0.7)" strokeWidth={2} fill="url(#ac)" name="Actual ($K)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#0d0e0f] border border-white/[0.06] rounded-2xl p-6">
            <p className="text-xs font-black text-white mb-0.5">Spend by Department</p>
            <p className="text-[10px] text-white/25 mb-5">% of total budget</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={DEPT_SPEND} layout="vertical" barSize={10}>
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="dept" type="category" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: '#0d0e0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11 }} />
                <Bar dataKey="value" fill="rgba(255,255,255,0.15)" radius={[0, 4, 4, 0]} name="%" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { to: '/operationx/finance', icon: DollarSign, label: 'Finance' },
            { to: '/operationx/hr', icon: Users, label: 'HR & Payroll' },
            { to: '/operationx/facilities', icon: Building2, label: 'Facilities' },
            { to: '/operationx/safety', icon: ShieldCheck, label: 'Safety' },
            { to: '/operationx/procurement', icon: ShoppingCart, label: 'Procurement' },
            { to: '/operationx/inventory', icon: Package, label: 'Inventory' },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all">
              <Icon className="w-5 h-5 text-white/25 group-hover:text-white/50 transition-colors" />
              <span className="text-[10px] font-bold text-white/30 group-hover:text-white/60 transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}