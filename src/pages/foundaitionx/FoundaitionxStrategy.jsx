import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Globe, Sparkles, Loader2, CheckCircle2, Eye, TrendingUp, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const STRATEGY_SECTIONS = [
  { id: 'five_year_plan', label: '5-Year Strategic Plan', desc: 'Vision, goals, milestones, and growth trajectory' },
  { id: 'enrollment_strategy', label: 'Enrollment & Marketing Plan', desc: 'Outreach, recruitment, retention strategies' },
  { id: 'community_engagement', label: 'Community Engagement Plan', desc: 'Family, community, and partnership strategy' },
  { id: 'fundraising_plan', label: 'Fundraising & Development Plan', desc: 'Grants, philanthropy, donor engagement' },
  { id: 'growth_plan', label: 'School Growth Plan', desc: 'Replication, expansion, and scale strategy' },
  { id: 'equity_plan', label: 'Diversity, Equity & Inclusion Plan', desc: 'Equity strategy across all school systems' },
  { id: 'accountability_framework', label: 'Accountability Framework', desc: 'KPIs, data reviews, performance targets' },
  { id: 'partnership_plan', label: 'Strategic Partnerships Plan', desc: 'University, nonprofit, business partnerships' },
  { id: 'branding_plan', label: 'School Brand & Identity', desc: 'Brand strategy, marketing materials, voice' },
];

export default function FoundaitionxStrategy() {
  const [generated, setGenerated] = useState({});
  const [loading, setLoading] = useState(null);
  const [active, setActive] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [strategySummary, setStrategySummary] = useState(null);

  const generate = async (id, label) => {
    setLoading(id);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a McKinsey-trained education strategy consultant and Y Combinator-style school startup advisor.

Write a comprehensive "${label}" for ${schoolName || 'a high-performing charter school'}.

Include strategic frameworks, measurable goals, implementation phases, resource requirements, and accountability metrics. 700-1000 words of elite strategic planning content.`,
        model: 'claude_sonnet_4_6'
      });
      setGenerated(prev => ({ ...prev, [id]: res }));
      toast.success(`${label} generated!`);
    } catch { toast.error('Failed'); }
    setLoading(null);
  };

  const generateStrategicOverview = async () => {
    setAiLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a concise executive strategic overview for ${schoolName || 'a new charter school'} with:
- strategic_vision (2 sentences)
- three_year_milestones (array of 6)
- critical_success_factors (array of 5)
- approval_readiness_score (0-100)
- strategic_priorities (array of 4)`,
        response_json_schema: {
          type: 'object',
          properties: {
            strategic_vision: { type: 'string' },
            three_year_milestones: { type: 'array', items: { type: 'string' } },
            critical_success_factors: { type: 'array', items: { type: 'string' } },
            approval_readiness_score: { type: 'number' },
            strategic_priorities: { type: 'array', items: { type: 'string' } },
          }
        }
      });
      setStrategySummary(res);
      toast.success('Strategic overview generated!');
    } catch { toast.error('Failed'); }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight">Strategic Planning</h1>
          </div>
          <p className="text-xs text-white/30">5-year plans, enrollment strategy, equity, and growth systems</p>
        </div>
        <div className="flex gap-2">
          <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="School Name"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 w-48" />
          <Button onClick={generateStrategicOverview} disabled={aiLoading} variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5">
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><TrendingUp className="w-3.5 h-3.5" /> Strategic Overview</>}
          </Button>
          <Button onClick={() => STRATEGY_SECTIONS.forEach(s => generate(s.id, s.label))} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Generate All
          </Button>
        </div>
      </div>
      <div className="px-6 py-6">
        {strategySummary && (
          <div className="border border-white/10 rounded-2xl p-5 bg-white/3 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-black text-sm text-white">Strategic Overview</span>
              <div className="font-black text-xl text-white">{strategySummary.approval_readiness_score}<span className="text-white/25 text-sm">/100</span></div>
            </div>
            {strategySummary.strategic_vision && <p className="text-sm text-white/50 mb-3">{strategySummary.strategic_vision}</p>}
            <div className="grid grid-cols-2 gap-3">
              {strategySummary.strategic_priorities?.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-2">Strategic Priorities</p>
                  {strategySummary.strategic_priorities.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5 mb-1">
                      <Target className="w-3 h-3 text-white/20" />
                      <span className="text-xs text-white/45">{p}</span>
                    </div>
                  ))}
                </div>
              )}
              {strategySummary.critical_success_factors?.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-2">Critical Success Factors</p>
                  {strategySummary.critical_success_factors.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3 h-3 text-white/20" />
                      <span className="text-xs text-white/45">{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STRATEGY_SECTIONS.map(({ id, label, desc }) => {
            const isDone = !!generated[id];
            return (
              <div key={id} className={`border rounded-xl p-4 transition-all ${isDone ? 'border-white/15 bg-white/3' : 'border-white/6'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-white/50 mt-0.5 flex-shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-white/12 mt-0.5 flex-shrink-0" />}
                    <div>
                      <div className="text-xs font-black text-white/70">{label}</div>
                      <div className="text-[10px] text-white/25">{desc}</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {isDone && <button onClick={() => setActive(active === id ? null : id)} className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"><Eye className="w-3 h-3 text-white/30" /></button>}
                    <Button onClick={() => generate(id, label)} disabled={loading === id} variant="outline"
                      className="border-white/10 text-white text-[11px] font-black rounded-lg hover:bg-white/5 h-7 px-2.5">
                      {loading === id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles className="w-3 h-3" /> {isDone ? 'Regen' : 'Build'}</>}
                    </Button>
                  </div>
                </div>
                {active === id && generated[id] && (
                  <div className="mt-3 pt-3 border-t border-white/8 max-h-48 overflow-y-auto">
                    <p className="text-sm text-white/45 leading-relaxed whitespace-pre-wrap">{generated[id]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}