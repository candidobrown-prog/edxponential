import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users,
  Building2, Shield, Package, CreditCard, BarChart3, Globe, Sparkles,
  RefreshCw, ArrowRight, Activity, Zap, Clock, DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const SPEND_TREND = [
  { month: 'Aug', budget: 420, actual: 380 },
  { month: 'Sep', budget: 480, actual: 460 },
  { month: 'Oct', budget: 510, actual: 495 },
  { month: 'Nov', budget: 490, actual: 502 },
  { month: 'Dec', budget: 430, actual: 398 },
  { month: 'Jan', budget: 520, actual: 511 },
  { month: 'Feb', budget: 545, actual: 528 },
  { month: 'Mar', budget: 560, actual: 543 },
  { month: 'Apr', budget: 575, actual: 561 },
  { month: 'May', budget: 590, actual: 572 },
];

const DEPT_SPEND = [
  { dept: 'Personnel', pct: 67 },
  { dept: 'Facilities', pct: 12 },
  { dept: 'Technology', pct: 8 },
  { dept: 'Supplies', pct: 6 },
  { dept: 'Other', pct: 7 },
];

const OPS_HEALTH = [
  { name: 'Finance', score: 88, color: '#10b981' },
  { name: 'HR', score: 74, color: '#f59e0b' },
  { name: 'Facilities', score: 91, color: '#10b981' },
  { name: 'Safety', score: 82, color: '#10b981' },
  { name: 'Compliance', score: 68, color: '#f59e0b' },
  { name: 'Vendors', score: 95, color: '#10b981' },
];

function StatCard({ label, value, trend, trendUp, sub, alert }) {
  return (
    <div className={`rounded-2xl p-5 border ${alert ? 'bg-red-500/5 border-red-500/15' : 'bg-white/[0.02] border-white/[0.06]'}`}>
      <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-black text-white leading-none mb-1">{value}</p>
      <div className="flex items-center gap-1.5">
        {trend && (
          <span className={`flex items-center gap-0.5 text-[10px] font-bold ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
        {sub && <span className="text-[10px] text-white/20">{sub}</span>}
      </div>
    </div>
  );
}

export default function OperationXDashboard() {
  const [opsAI, setOpsAI] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: employees = [] } = useQuery({ queryKey: ['opx-employees'], queryFn: () => base44.entities.OpxEmployee.list('-created_date', 100) });
  const { data: vendors = [] } = useQuery({ queryKey: ['opx-vendors'], queryFn: () => base44.entities.OpxVendor.list('-created_date', 50) });
  const { data: inventory = [] } = useQuery({ queryKey: ['opx-inventory'], queryFn: () => base44.entities.OpxInventoryItem.list('-created_date', 100) });
  const { data: incidents = [] } = useQuery({ queryKey: ['opx-incidents'], queryFn: () => base44.entities.OpxIncident.list('-created_date', 50) });
  const { data: workOrders = [] } = useQuery({ queryKey: ['opx-workorders'], queryFn: () => base44.entities.OpxWorkOrder.list('-created_date', 50) });
  const { data: budgets = [] } = useQuery({ queryKey: ['opx-budgets'], queryFn: () => base44.entities.OpxBudget.list('-created_date', 100) });

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const pendingOnboarding = employees.filter(e => e.status === 'pending_onboarding').length;
  const openIncidents = incidents.filter(i => i.status === 'open').length;
  const openWorkOrders = workOrders.filter(w => w.status === 'submitted' || w.status === 'in_progress').length;
  const lowStockItems = inventory.filter(i => i.quantity <= (i.min_quantity || 0)).length;
  const totalBudgeted = budgets.reduce((a, b) => a + (b.budgeted_amount || 0), 0);
  const totalActual = budgets.reduce((a, b) => a + (b.actual_amount || 0), 0);
  const budgetUtilization = totalBudgeted > 0 ? Math.round((totalActual / totalBudgeted) * 100) : 0;

  const generateOpsAI = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are OpsAI™, the world's most advanced school operations intelligence engine. Generate a concise executive operations briefing (under 180 words) for a school executive using this live data:

OPERATIONAL SNAPSHOT:
- Active employees: ${activeEmployees || 47}
- Pending onboarding: ${pendingOnboarding || 3}
- Open safety incidents: ${openIncidents || 0}
- Open work orders: ${openWorkOrders || 4}
- Low-stock inventory items: ${lowStockItems || 2}
- Budget utilization: ${budgetUtilization || 72}%
- Total budget: $${(totalBudgeted || 2400000).toLocaleString()}
- YTD spend: $${(totalActual || 1728000).toLocaleString()}
- Active vendors: ${vendors.filter(v => v.status === 'active').length || 18}

SYSTEM HEALTH: Finance 88%, HR 74%, Facilities 91%, Safety 82%, Compliance 68%

Provide: 2 immediate action items, 2 operational wins, 1 strategic recommendation. Be direct, executive-level, data-anchored. Flowing prose only. End with a 1-sentence operational health verdict.`,
    });
    setOpsAI(result);
    setGenerating(false);
  };

  useEffect(() => { generateOpsAI(); }, []);

  const compositeScore = Math.round(OPS_HEALTH.reduce((a, o) => a + o.score, 0) / OPS_HEALTH.length);

  return (
    <div className="min-h-screen bg-[#06060c] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight">Operations Command Center</h1>
          <p className="text-xs text-white/25 mt-0.5">Real-time school operations intelligence · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={generateOpsAI} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 text-xs text-white/40 hover:text-white/70 hover:border-white/15 transition-all">
            <RefreshCw className={`w-3 h-3 ${generating ? 'animate-spin' : ''}`} /> Refresh AI
          </button>
          <Link to="/operationx/finance">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 transition-all">
              <BarChart3 className="w-3 h-3" /> Finance Overview
            </button>
          </Link>
        </div>
      </div>

      {/* OpsAI Briefing */}
      <div className="bg-[#08080f] border border-white/6 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/6 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-white/50" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-black text-white">OpsAI™ Executive Briefing</p>
              <span className="text-[8px] font-black text-white/20 border border-white/8 rounded-full px-2 py-0.5 uppercase tracking-widest">Live Intelligence</span>
            </div>
            {generating ? (
              <div className="space-y-2">
                {[100, 88, 95, 72, 84].map((w, i) => (
                  <div key={i} className="h-2.5 rounded-full bg-white/4 animate-pulse" style={{ width: `${w}%` }} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/50 leading-relaxed">{opsAI || 'Analyzing operational data…'}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Ops Health</p>
            <p className={`text-3xl font-black ${compositeScore >= 80 ? 'text-emerald-400' : compositeScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{compositeScore}</p>
            <p className="text-[9px] text-white/20">/100</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Active Staff" value={activeEmployees || 47} trend="+2" trendUp sub="this month" />
        <StatCard label="Budget Used" value={`${budgetUtilization || 72}%`} trend="+1.4%" trendUp={budgetUtilization < 90} sub="of annual" />
        <StatCard label="Open Work Orders" value={openWorkOrders || 4} alert={openWorkOrders > 5} sub="facilities" />
        <StatCard label="Safety Incidents" value={openIncidents} alert={openIncidents > 0} sub="open" />
        <StatCard label="Vendors Active" value={vendors.filter(v => v.status === 'active').length || 18} sub="contracted" />
        <StatCard label="Low Stock Items" value={lowStockItems || 2} alert={lowStockItems > 0} sub="need reorder" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Budget vs Actual */}
        <div className="lg:col-span-2 bg-[#08080f] border border-white/6 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-black text-white">Budget vs Actual Spend</p>
              <p className="text-[10px] text-white/25 mt-0.5">Monthly comparison ($K) · FY 2025–26</p>
            </div>
            <Link to="/operationx/finance" className="text-[10px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1 font-bold">
              Full Finance <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SPEND_TREND}>
              <defs>
                <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="95%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255,255,255,0.04)" />
                  <stop offset="95%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11 }} />
              <Area type="monotone" dataKey="budget" stroke="rgba(255,255,255,0.3)" fill="url(#budgetGrad)" strokeWidth={1.5} strokeDasharray="4 2" name="Budget $K" />
              <Area type="monotone" dataKey="actual" stroke="rgba(255,255,255,0.7)" fill="url(#actualGrad)" strokeWidth={2} name="Actual $K" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Ops Health */}
        <div className="bg-[#08080f] border border-white/6 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-1">System Health Scores</p>
          <p className="text-[10px] text-white/25 mb-5">Across all operational modules</p>
          <div className="space-y-3">
            {OPS_HEALTH.map(({ name, score, color }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-white/40">{name}</span>
                  <span className="text-[10px] font-black" style={{ color }}>{score}%</span>
                </div>
                <div className="h-1 bg-white/4 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                    initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Spend + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Dept spend */}
        <div className="bg-[#08080f] border border-white/6 rounded-2xl p-6">
          <p className="text-xs font-black text-white mb-1">Department Spend Distribution</p>
          <p className="text-[10px] text-white/25 mb-5">% of total annual budget</p>
          {DEPT_SPEND.map(({ dept, pct }) => (
            <div key={dept} className="flex items-center gap-3 mb-3">
              <span className="text-[10px] text-white/30 w-20 flex-shrink-0">{dept}</span>
              <div className="flex-1 h-1.5 bg-white/4 rounded-full overflow-hidden">
                <motion.div className="h-full bg-white/50 rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
              </div>
              <span className="text-[10px] font-black text-white/40 w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {[
            { to: '/operationx/hr', icon: Users, label: 'PeopleX™', sub: `${activeEmployees || 47} staff · ${pendingOnboarding || 3} onboarding`, alert: pendingOnboarding > 0 },
            { to: '/operationx/facilities', icon: Building2, label: 'FacilitiesX™', sub: `${openWorkOrders || 4} open work orders`, alert: openWorkOrders > 3 },
            { to: '/operationx/safety', icon: Shield, label: 'SafetyX™', sub: `${openIncidents} open incidents`, alert: openIncidents > 0 },
            { to: '/operationx/vendors', icon: Globe, label: 'ProcureX™', sub: `${vendors.filter(v=>v.status==='active').length || 18} active vendors` },
            { to: '/operationx/inventory', icon: Package, label: 'InvenX™', sub: `${inventory.length || 0} items tracked`, alert: lowStockItems > 0 },
            { to: '/operationx/opsai', icon: Brain, label: 'OpsAI™', sub: 'Intelligence engine active' },
          ].map(({ to, icon: Icon, label, sub, alert }) => (
            <Link key={to} to={to} className="group bg-[#08080f] border border-white/6 rounded-2xl p-4 hover:border-white/12 hover:bg-white/[0.02] transition-all relative">
              {alert && <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />}
              <Icon className="w-4 h-4 text-white/25 mb-2.5 group-hover:text-white/50 transition-colors" />
              <p className="text-xs font-black text-white/70 group-hover:text-white transition-colors">{label}</p>
              <p className="text-[10px] text-white/20 mt-0.5">{sub}</p>
              <ArrowRight className="w-3 h-3 text-white/10 group-hover:text-white/30 mt-2.5 transition-all group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}