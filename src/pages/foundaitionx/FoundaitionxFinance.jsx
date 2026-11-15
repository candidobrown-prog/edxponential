import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BarChart3, Sparkles, Loader2, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';

const BUDGET_CATEGORIES = [
  { category: 'Personnel', subcategories: ['Administration', 'Teachers', 'Support Staff', 'Substitutes', 'Benefits & Payroll Taxes'] },
  { category: 'Instruction', subcategories: ['Curriculum Materials', 'Textbooks', 'Instructional Supplies', 'Technology', 'Field Trips'] },
  { category: 'Operations', subcategories: ['Facilities/Rent', 'Utilities', 'Maintenance', 'Security', 'Janitorial'] },
  { category: 'Administration', subcategories: ['Office Supplies', 'Legal', 'Accounting', 'Insurance', 'Marketing'] },
  { category: 'Student Services', subcategories: ['Food Services', 'Transportation', 'Counseling', 'SPED Services', 'Enrichment'] },
];

export default function FoundaitionxFinance() {
  const [loading, setLoading] = useState(false);
  const [financialPlan, setFinancialPlan] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [enrollment, setEnrollment] = useState('200');
  const [gradeSpan, setGradeSpan] = useState('K-8');
  const [state, setState] = useState('');
  const [perPupil, setPerPupil] = useState('10000');
  const [tab, setTab] = useState('overview');

  const CHART_DATA = financialPlan?.projections || [
    { year: 'Year 1', revenue: 2000000, expenses: 1900000, surplus: 100000 },
    { year: 'Year 2', revenue: 2800000, expenses: 2600000, surplus: 200000 },
    { year: 'Year 3', revenue: 3500000, expenses: 3200000, surplus: 300000 },
    { year: 'Year 4', revenue: 4200000, expenses: 3800000, surplus: 400000 },
    { year: 'Year 5', revenue: 5000000, expenses: 4400000, surplus: 600000 },
  ];

  const generateFinancialPlan = async () => {
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert charter school financial planner with 20 years of experience building school budgets, financial projections, and funding models.

Build a comprehensive 5-year financial model for:
School: ${schoolName || 'Charter Academy'}
State: ${state || 'State'}
Grade Span: ${gradeSpan}
Year 1 Enrollment: ${enrollment} students
Per-Pupil Revenue: $${perPupil}

Generate:
- startup_costs (object with category: amount)
- year1_budget_summary (object: revenue, expenses, surplus)
- revenue_sources (array: {source, amount, percentage})
- expense_breakdown (array: {category, amount, percentage})
- projections (array of 5 years: {year, revenue, expenses, surplus})
- financial_risks (array)
- funding_strategies (array)
- break_even_analysis (string)
- executive_financial_summary (string)
- key_financial_assumptions (array)`,
        response_json_schema: {
          type: 'object',
          properties: {
            startup_costs: { type: 'object' },
            year1_budget_summary: { type: 'object' },
            revenue_sources: { type: 'array', items: { type: 'object' } },
            expense_breakdown: { type: 'array', items: { type: 'object' } },
            projections: { type: 'array', items: { type: 'object' } },
            financial_risks: { type: 'array', items: { type: 'string' } },
            funding_strategies: { type: 'array', items: { type: 'string' } },
            break_even_analysis: { type: 'string' },
            executive_financial_summary: { type: 'string' },
            key_financial_assumptions: { type: 'array', items: { type: 'string' } },
          }
        }
      });
      setFinancialPlan(res);
      toast.success('Financial plan generated!');
    } catch { toast.error('Generation failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight">Financial Systems & Budgets</h1>
          </div>
          <p className="text-xs text-white/30">Multi-year projections, startup budgets, and revenue modeling</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateFinancialPlan} disabled={loading} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full">
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating</> : <><Sparkles className="w-3.5 h-3.5" /> Generate Financial Plan</>}
          </Button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { placeholder: 'School Name', value: schoolName, set: setSchoolName },
            { placeholder: 'State', value: state, set: setState },
            { placeholder: 'Grade Span (e.g. K-8)', value: gradeSpan, set: setGradeSpan },
            { placeholder: 'Yr 1 Enrollment', value: enrollment, set: setEnrollment, type: 'number' },
            { placeholder: 'Per-Pupil $ (est.)', value: perPupil, set: setPerPupil, type: 'number' },
          ].map(({ placeholder, value, set, type }, i) => (
            <Input key={i} type={type || 'text'} value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs focus:border-white/30" />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {['overview', 'projections', 'startup', 'risks'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-xs font-black capitalize transition-all ${tab === t ? 'bg-white text-black' : 'border border-white/15 text-white/40 hover:bg-white/5'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-4">
            {financialPlan?.executive_financial_summary && (
              <div className="border border-white/8 rounded-xl p-5 bg-white/2">
                <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-2">Executive Financial Summary</p>
                <p className="text-sm text-white/55 leading-relaxed">{financialPlan.executive_financial_summary}</p>
              </div>
            )}
            <div className="h-64 border border-white/8 rounded-xl p-4 bg-white/2">
              <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3">5-Year Financial Projections</p>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={CHART_DATA}>
                  <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 11 }} formatter={v => [`$${(v / 1000).toFixed(0)}K`]} />
                  <Bar dataKey="revenue" fill="rgba(255,255,255,0.4)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="surplus" fill="rgba(255,255,255,0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {financialPlan?.revenue_sources?.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-white/8 rounded-xl p-4 bg-white/2">
                  <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3">Revenue Sources</p>
                  {financialPlan.revenue_sources.map((r, i) => (
                    <div key={i} className="flex justify-between text-xs mb-2">
                      <span className="text-white/50">{r.source}</span>
                      <span className="font-black text-white/70">{r.percentage}%</span>
                    </div>
                  ))}
                </div>
                <div className="border border-white/8 rounded-xl p-4 bg-white/2">
                  <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3">Expense Breakdown</p>
                  {financialPlan.expense_breakdown?.map((e, i) => (
                    <div key={i} className="flex justify-between text-xs mb-2">
                      <span className="text-white/50">{e.category}</span>
                      <span className="font-black text-white/70">{e.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'projections' && (
          <div className="border border-white/8 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-white/8 bg-white/3">
                {['Year', 'Enrollment', 'Revenue', 'Expenses', 'Surplus/(Deficit)', 'Margin'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-black text-white/30 uppercase tracking-widest text-[10px]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {CHART_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-4 py-3 font-black text-white/70">{row.year}</td>
                    <td className="px-4 py-3 text-white/40">{parseInt(enrollment) + (i * Math.round(parseInt(enrollment) * 0.3))}</td>
                    <td className="px-4 py-3 text-white/60">${(row.revenue / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 text-white/60">${(row.expenses / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 font-black text-white/70">${(row.surplus / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 text-white/40">{((row.surplus / row.revenue) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'startup' && (
          <div className="border border-white/8 rounded-xl p-5 bg-white/2">
            <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-4">Startup Cost Estimate</p>
            {financialPlan?.startup_costs ? (
              Object.entries(financialPlan.startup_costs).map(([k, v], i) => (
                <div key={i} className="flex justify-between py-2 border-b border-white/5 text-sm">
                  <span className="text-white/50 capitalize">{k.replace(/_/g, ' ')}</span>
                  <span className="font-black text-white/70">{typeof v === 'number' ? `$${v.toLocaleString()}` : v}</span>
                </div>
              ))
            ) : (
              <p className="text-white/25 text-sm">Generate financial plan to see startup cost breakdown.</p>
            )}
          </div>
        )}

        {tab === 'risks' && (
          <div className="space-y-3">
            {(financialPlan?.financial_risks || ['Per-pupil funding may be lower than projected', 'Enrollment targets may not be met in Year 1', 'Facility costs may exceed budget', 'Grant funding is not guaranteed']).map((risk, i) => (
              <div key={i} className="flex items-start gap-3 border border-white/8 rounded-xl p-4 bg-white/2">
                <AlertTriangle className="w-4 h-4 text-white/25 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/50">{risk}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}