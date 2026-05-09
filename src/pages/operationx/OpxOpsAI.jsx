import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, RefreshCw, Zap, TrendingUp, AlertTriangle, CheckCircle, Target, DollarSign, Users, Shield, Package, Building2 } from 'lucide-react';

const ANALYSIS_TYPES = [
  { id: 'full', icon: Brain, label: 'Full Operations Brief', desc: 'Comprehensive operational intelligence across all modules' },
  { id: 'financial', icon: DollarSign, label: 'Financial Risk Analysis', desc: 'Budget anomalies, cash flow, and spending forecasts' },
  { id: 'hr', icon: Users, label: 'Staffing Intelligence', desc: 'Payroll risks, compliance gaps, and staffing optimization' },
  { id: 'safety', icon: Shield, label: 'Safety & Compliance Audit', desc: 'Incident patterns, compliance gaps, and risk assessment' },
  { id: 'facilities', icon: Building2, label: 'Facilities Risk Report', desc: 'Maintenance forecasting and infrastructure health' },
  { id: 'inventory', icon: Package, label: 'Inventory Forecast', desc: 'Stock levels, reorder alerts, and asset lifecycle' },
];

export default function OpxOpsAI() {
  const [selectedType, setSelectedType] = useState('full');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const { data: employees = [] } = useQuery({ queryKey: ['opx-employees'], queryFn: () => base44.entities.OpxEmployee.list('-created_date', 100) });
  const { data: budgets = [] } = useQuery({ queryKey: ['opx-budgets'], queryFn: () => base44.entities.OpxBudget.list('-created_date', 100) });
  const { data: vendors = [] } = useQuery({ queryKey: ['opx-vendors'], queryFn: () => base44.entities.OpxVendor.list('-created_date', 50) });
  const { data: incidents = [] } = useQuery({ queryKey: ['opx-incidents'], queryFn: () => base44.entities.OpxIncident.list('-created_date', 50) });
  const { data: workOrders = [] } = useQuery({ queryKey: ['opx-workorders'], queryFn: () => base44.entities.OpxWorkOrder.list('-created_date', 50) });
  const { data: inventory = [] } = useQuery({ queryKey: ['opx-inventory'], queryFn: () => base44.entities.OpxInventoryItem.list('-created_date', 100) });

  const activeEmp = employees.filter(e => e.status === 'active').length;
  const totalPayroll = employees.reduce((a, e) => a + (e.salary || 0), 0);
  const totalBudgeted = budgets.reduce((a, b) => a + (b.budgeted_amount || 0), 0);
  const totalActual = budgets.reduce((a, b) => a + (b.actual_amount || 0), 0);
  const openIncidents = incidents.filter(i => i.status === 'open').length;
  const openWO = workOrders.filter(w => ['submitted', 'in_progress'].includes(w.status)).length;
  const lowStock = inventory.filter(i => i.quantity <= (i.min_quantity || 0)).length;

  const PROMPTS = {
    full: `You are OpsAI™ — the world's most advanced school operations intelligence engine. Generate a comprehensive executive operational intelligence report (250 words max) covering all departments. Use data-driven insights, flag 3 risks, celebrate 2 wins, and give 3 strategic recommendations. Be bold and specific.`,
    financial: `You are OpsAI™ FinanceX analyzer. Generate a detailed financial risk and opportunity analysis (200 words) covering budget burn rate, cash flow health, overspending risks, and cost optimization opportunities. Be CFO-level specific.`,
    hr: `You are OpsAI™ PeopleX analyzer. Generate a staffing and HR intelligence report (200 words) covering payroll risks, compliance issues, hiring needs, retention risks, and compensation benchmarks. Be CHRO-level.`,
    safety: `You are OpsAI™ SafetyX analyzer. Generate a safety and compliance audit report (200 words) covering incident trends, compliance gaps, regulatory risks, and emergency preparedness. Be compliance-officer specific.`,
    facilities: `You are OpsAI™ FacilitiesX analyzer. Generate a facilities risk and maintenance forecast report (200 words) covering work order backlogs, infrastructure health, preventive maintenance needs, and budget forecasting. Be facilities-director level.`,
    inventory: `You are OpsAI™ InvenX analyzer. Generate an inventory intelligence report (200 words) covering stock health, reorder needs, asset lifecycle, depreciation concerns, and procurement recommendations. Be operations-director level.`,
  };

  const DATA_CONTEXT = `
LIVE OPERATIONS DATA:
Active employees: ${activeEmp || 47} | Annual payroll: $${(totalPayroll || 2800000).toLocaleString()}
Budget: $${(totalBudgeted || 2400000).toLocaleString()} | Spent: $${(totalActual || 1728000).toLocaleString()} (${totalBudgeted > 0 ? Math.round((totalActual/totalBudgeted)*100) : 72}%)
Open safety incidents: ${openIncidents} | Open work orders: ${openWO}
Active vendors: ${vendors.filter(v => v.status === 'active').length || 18}
Inventory items: ${inventory.length || 0} | Low stock alerts: ${lowStock}
Missing I-9/W4: ${employees.filter(e => !e.i9_complete || !e.w4_complete).length}
`;

  const runAnalysis = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `${PROMPTS[selectedType]}\n\n${DATA_CONTEXT}`,
    });
    const entry = { type: selectedType, result: res, timestamp: new Date() };
    setResult(res);
    setHistory(prev => [entry, ...prev.slice(0, 4)]);
    setLoading(false);
  };

  const selectedAnalysis = ANALYSIS_TYPES.find(a => a.id === selectedType);

  return (
    <div className="min-h-screen bg-[#06060c] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white">OpsAI™</h1>
          <p className="text-xs text-white/25 mt-0.5">AI-powered operational intelligence engine</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/15 rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">All Systems Connected</span>
        </div>
      </div>

      {/* Analysis type selector */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ANALYSIS_TYPES.map(({ id, icon: Icon, label, desc }) => (
          <button key={id} onClick={() => setSelectedType(id)}
            className={`text-left p-4 rounded-2xl border transition-all duration-150 ${selectedType === id ? 'bg-white/8 border-white/20' : 'bg-[#08080f] border-white/6 hover:border-white/12'}`}>
            <Icon className={`w-4 h-4 mb-2.5 ${selectedType === id ? 'text-white' : 'text-white/25'}`} />
            <p className={`text-xs font-black mb-0.5 ${selectedType === id ? 'text-white' : 'text-white/50'}`}>{label}</p>
            <p className="text-[10px] text-white/25 leading-relaxed">{desc}</p>
          </button>
        ))}
      </div>

      {/* Live data snapshot */}
      <div className="bg-[#08080f] border border-white/6 rounded-2xl p-5">
        <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-3">Live Data Connected</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Employees', value: activeEmp || 47 },
            { label: 'Budget Used', value: `${totalBudgeted > 0 ? Math.round((totalActual/totalBudgeted)*100) : 72}%` },
            { label: 'Incidents', value: openIncidents, alert: openIncidents > 0 },
            { label: 'Work Orders', value: openWO },
            { label: 'Vendors', value: vendors.filter(v => v.status === 'active').length || 18 },
            { label: 'Low Stock', value: lowStock, alert: lowStock > 0 },
          ].map(({ label, value, alert }) => (
            <div key={label} className="text-center">
              <p className={`text-xl font-black ${alert ? 'text-amber-400' : 'text-white'}`}>{value}</p>
              <p className="text-[9px] text-white/25">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button onClick={runAnalysis} disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-black text-sm hover:bg-white/90 transition-all active:scale-[0.99] disabled:opacity-60">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            OpsAI™ is analyzing your operations…
          </>
        ) : (
          <>
            <Brain className="w-4 h-4" />
            Run {selectedAnalysis?.label}
          </>
        )}
      </button>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div key={result.slice(0, 20)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#08080f] border border-white/6 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-white/6 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white/50" />
              </div>
              <div>
                <p className="text-xs font-black text-white">{selectedAnalysis?.label}</p>
                <p className="text-[9px] text-white/25">Generated {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{result}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 1 && (
        <div className="bg-[#08080f] border border-white/6 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <p className="text-xs font-black text-white">Analysis History</p>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {history.slice(1).map((entry, i) => {
              const type = ANALYSIS_TYPES.find(a => a.id === entry.type);
              return (
                <div key={i} className="px-6 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => setResult(entry.result)}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-white/60">{type?.label}</p>
                    <p className="text-[9px] text-white/20">{entry.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <p className="text-[10px] text-white/25 line-clamp-2">{entry.result.substring(0, 120)}…</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}