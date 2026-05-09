import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Loader2, CheckCircle2, AlertTriangle, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const COMPLIANCE_AREAS = [
  { id: 'idea_compliance', label: 'IDEA / Special Education Compliance', category: 'Federal', critical: true },
  { id: 'title1_compliance', label: 'Title I Compliance', category: 'Federal', critical: true },
  { id: 'title3_compliance', label: 'Title III / MLL Compliance', category: 'Federal', critical: false },
  { id: 'ferpa_compliance', label: 'FERPA Data Privacy Compliance', category: 'Federal', critical: true },
  { id: 'civil_rights', label: 'Civil Rights & Section 504', category: 'Federal', critical: true },
  { id: 'charter_law', label: 'State Charter Law Compliance', category: 'State', critical: true },
  { id: 'state_assessments', label: 'State Assessment Requirements', category: 'State', critical: true },
  { id: 'teacher_certification', label: 'Teacher Certification Requirements', category: 'State', critical: true },
  { id: 'finance_compliance', label: 'Financial Reporting & Audit Requirements', category: 'Finance', critical: true },
  { id: 'governance_compliance', label: 'Board Governance & Open Meetings', category: 'Governance', critical: true },
  { id: 'safety_compliance', label: 'School Safety & Emergency Plans', category: 'Safety', critical: true },
  { id: 'food_compliance', label: 'Food Service & USDA Requirements', category: 'Operations', critical: false },
  { id: 'ada_compliance', label: 'ADA / Accessibility Compliance', category: 'Federal', critical: false },
  { id: 'hipaa_compliance', label: 'Health Information Privacy', category: 'Federal', critical: false },
  { id: 'accountability_plan', label: 'State Accountability Plan', category: 'State', critical: true },
];

const CATEGORIES = ['All', 'Federal', 'State', 'Finance', 'Governance', 'Safety', 'Operations'];

export default function FoundaitionxCompliance() {
  const [checklist, setChecklist] = useState({});
  const [generated, setGenerated] = useState({});
  const [loading, setLoading] = useState(null);
  const [filterCat, setFilterCat] = useState('All');
  const [active, setActive] = useState(null);
  const [state, setState] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditReport, setAuditReport] = useState(null);

  const filtered = COMPLIANCE_AREAS.filter(a => filterCat === 'All' || a.category === filterCat);

  const toggle = (id) => setChecklist(c => ({ ...c, [id]: !c[id] }));

  const generate = async (id, label) => {
    setLoading(id);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a charter school compliance attorney and education law expert.

Write a comprehensive "${label}" compliance guide for a charter school in ${state || 'the United States'}.

Include:
- Legal requirements and statute citations
- Required documentation and records
- Compliance monitoring procedures
- Common compliance violations and how to avoid them
- Staff training requirements
- Reporting requirements and deadlines
- Consequences of non-compliance

Write 600-900 words of actionable, legally accurate compliance guidance.`
      });
      setGenerated(prev => ({ ...prev, [id]: res }));
      toast.success('Compliance guide generated!');
    } catch { toast.error('Failed'); }
    setLoading(null);
  };

  const runAudit = async () => {
    setAuditLoading(true);
    try {
      const completed = Object.keys(checklist).filter(k => checklist[k]);
      const missing = COMPLIANCE_AREAS.filter(a => a.critical && !checklist[a.id]).map(a => a.label);
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a charter school compliance auditor. Analyze this school's compliance status:

State: ${state || 'Not specified'}
Compliance areas addressed: ${completed.length} of ${COMPLIANCE_AREAS.length}
Critical missing areas: ${missing.join(', ') || 'None'}

Provide:
- compliance_score (0-100)
- risk_level: "low" | "medium" | "high" | "critical"  
- critical_gaps (array)
- immediate_actions (array of 5)
- audit_summary (paragraph)
- timeline_recommendations (array)`,
        response_json_schema: {
          type: 'object',
          properties: {
            compliance_score: { type: 'number' },
            risk_level: { type: 'string' },
            critical_gaps: { type: 'array', items: { type: 'string' } },
            immediate_actions: { type: 'array', items: { type: 'string' } },
            audit_summary: { type: 'string' },
            timeline_recommendations: { type: 'array', items: { type: 'string' } },
          }
        }
      });
      setAuditReport(res);
      toast.success('Compliance audit complete!');
    } catch { toast.error('Audit failed'); }
    setAuditLoading(false);
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight">Compliance Engine</h1>
          </div>
          <p className="text-xs text-white/30">Federal, state, and charter compliance management</p>
        </div>
        <div className="flex gap-2 items-center">
          <input value={state} onChange={e => setState(e.target.value)} placeholder="State"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 w-28" />
          <Button onClick={runAudit} disabled={auditLoading} variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5">
            {auditLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Zap className="w-3.5 h-3.5" /> Run Compliance Audit</>}
          </Button>
        </div>
      </div>
      <div className="px-6 py-6">
        {/* Score */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="border border-white/8 rounded-2xl p-4 bg-white/2">
            <div className="text-[11px] text-white/25 font-black mb-1">Completed</div>
            <div className="font-black text-2xl text-white">{completedCount}<span className="text-white/20 text-sm">/{COMPLIANCE_AREAS.length}</span></div>
          </div>
          <div className="border border-white/8 rounded-2xl p-4 bg-white/2">
            <div className="text-[11px] text-white/25 font-black mb-1">Critical Items</div>
            <div className="font-black text-2xl text-white">{COMPLIANCE_AREAS.filter(a => a.critical && !checklist[a.id]).length} <span className="text-white/20 text-sm">remaining</span></div>
          </div>
          {auditReport && (
            <div className="border border-white/8 rounded-2xl p-4 bg-white/2">
              <div className="text-[11px] text-white/25 font-black mb-1">Audit Score</div>
              <div className="font-black text-2xl text-white">{auditReport.compliance_score}<span className="text-white/30 text-sm">/100</span></div>
            </div>
          )}
        </div>

        {auditReport && (
          <div className="border border-white/10 rounded-xl p-5 bg-white/3 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-black text-sm text-white">Compliance Audit Report</span>
              <span className={`text-xs font-black border px-2 py-0.5 rounded-full ${auditReport.risk_level === 'low' ? 'border-white/20 text-white/50' : auditReport.risk_level === 'medium' ? 'border-white/15 text-white/40' : 'border-white/10 text-white/30'}`}>
                {auditReport.risk_level?.toUpperCase()} RISK
              </span>
            </div>
            <p className="text-sm text-white/50 mb-3">{auditReport.audit_summary}</p>
            {auditReport.immediate_actions?.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-2">Immediate Actions</p>
                {auditReport.immediate_actions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1">
                    <span className="text-[10px] text-white/20 font-black w-4">{i + 1}.</span>
                    <span className="text-xs text-white/45">{a}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${filterCat === c ? 'bg-white text-black' : 'border border-white/12 text-white/30 hover:bg-white/5'}`}>{c}</button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(({ id, label, category, critical }, i) => (
            <div key={id} className={`border rounded-xl p-4 transition-all ${checklist[id] ? 'border-white/15 bg-white/3' : 'border-white/6'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => toggle(id)} className="flex-shrink-0">
                  {checklist[id] ? <CheckCircle2 className="w-5 h-5 text-white/60" /> : <div className="w-5 h-5 rounded-full border-2 border-white/15" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white/70">{label}</span>
                    {critical && <span className="text-[9px] font-black text-white/20 border border-white/10 px-1 py-0.5 rounded-full">CRITICAL</span>}
                    <span className="text-[9px] text-white/15 border border-white/8 px-1 py-0.5 rounded-full">{category}</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {generated[id] && <button onClick={() => setActive(active === id ? null : id)} className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"><Eye className="w-3 h-3 text-white/30" /></button>}
                  <Button onClick={() => generate(id, label)} disabled={loading === id} variant="outline"
                    className="border-white/10 text-white text-[11px] font-black rounded-lg hover:bg-white/5 h-7 px-2.5">
                    {loading === id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles className="w-3 h-3" /> Guide</>}
                  </Button>
                </div>
              </div>
              {active === id && generated[id] && (
                <div className="mt-3 pt-3 border-t border-white/8 max-h-48 overflow-y-auto">
                  <p className="text-sm text-white/45 leading-relaxed whitespace-pre-wrap">{generated[id]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}