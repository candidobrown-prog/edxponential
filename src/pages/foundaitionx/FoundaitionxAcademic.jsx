import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Target, Sparkles, Loader2, BookOpen, CheckCircle2, ChevronRight, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ACADEMIC_SECTIONS = [
  { id: 'curriculum_plan', label: 'Curriculum Design & Scope', desc: 'K-12 scope and sequence, curriculum alignment' },
  { id: 'instructional_model', label: 'Instructional Model', desc: 'Teaching frameworks, lesson design, delivery' },
  { id: 'assessment_system', label: 'Assessment System', desc: 'Formative, summative, benchmark assessments' },
  { id: 'mtss_plan', label: 'MTSS Framework', desc: 'Multi-tiered system of support, tiers 1-3' },
  { id: 'intervention_system', label: 'Intervention Systems', desc: 'Academic intervention, progress monitoring' },
  { id: 'sped_program', label: 'Special Education Program', desc: 'IEP process, service delivery, compliance' },
  { id: 'mll_program', label: 'MLL/ELL Program', desc: 'English language learner support systems' },
  { id: 'enrichment_program', label: 'Enrichment & Extensions', desc: 'Gifted, advanced, extracurricular' },
  { id: 'technology_integration', label: 'Technology Integration', desc: 'EdTech, 1:1 devices, digital learning' },
  { id: 'professional_development', label: 'Professional Development', desc: 'PD calendar, coaching, training systems' },
  { id: 'grading_system', label: 'Grading & Promotion', desc: 'Grading philosophy, report cards, promotion' },
  { id: 'data_systems', label: 'Data & Analytics Systems', desc: 'Data collection, analysis, decision-making' },
];

export default function FoundaitionxAcademic() {
  const [generated, setGenerated] = useState({});
  const [loading, setLoading] = useState(null);
  const [active, setActive] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [model, setModel] = useState('');
  const [grades, setGrades] = useState('');

  const generate = async (id, label) => {
    setLoading(id);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a Harvard Graduate School of Education-trained academic systems designer with expertise in charter school academic program development.

Write a comprehensive, research-based "${label}" for:
School: ${schoolName || 'Charter Academy'}
Model: ${model || 'High-performing college-preparatory'}
Grades: ${grades || 'K-8'}

Include:
- Theoretical framework and research base
- Implementation components and structures
- Key roles and responsibilities
- Data monitoring and accountability systems
- Professional development connections
- Equity and access considerations

Write 700-1000 words of expert-level, implementation-ready content.`,
        model: 'claude_sonnet_4_6'
      });
      setGenerated(prev => ({ ...prev, [id]: res }));
      toast.success(`${label} generated!`);
    } catch { toast.error('Failed'); }
    setLoading(null);
  };

  const generateAll = async () => {
    for (const s of ACADEMIC_SECTIONS) await generate(s.id, s.label);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight">Academic Model Builder</h1>
          </div>
          <p className="text-xs text-white/30">Curriculum, assessment, intervention, SPED, and instructional systems</p>
        </div>
        <Button onClick={generateAll} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> Generate All Systems
        </Button>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { ph: 'School Name', v: schoolName, s: setSchoolName },
            { ph: 'Academic Model', v: model, s: setModel },
            { ph: 'Grade Levels', v: grades, s: setGrades },
          ].map(({ ph, v, s }, i) => (
            <input key={i} value={v} onChange={e => s(e.target.value)} placeholder={ph}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACADEMIC_SECTIONS.map(({ id, label, desc }, i) => {
            const isDone = !!generated[id];
            const isLoad = loading === id;
            return (
              <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className={`border rounded-xl p-4 transition-all ${isDone ? 'border-white/15 bg-white/3' : 'border-white/6 bg-white/1'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-white/50 flex-shrink-0 mt-0.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-white/12 flex-shrink-0 mt-0.5" />}
                    <div>
                      <div className="text-xs font-black text-white/70">{label}</div>
                      <div className="text-[10px] text-white/25">{desc}</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {isDone && <button onClick={() => setActive(active === id ? null : id)} className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"><Eye className="w-3 h-3 text-white/30" /></button>}
                    <Button onClick={() => generate(id, label)} disabled={isLoad} variant="outline"
                      className="border-white/10 text-white text-[11px] font-black rounded-lg hover:bg-white/5 h-7 px-2.5">
                      {isLoad ? <Loader2 className="w-3 h-3 animate-spin" /> : isDone ? <RefreshCw className="w-3 h-3" /> : <><Sparkles className="w-3 h-3" /> Build</>}
                    </Button>
                  </div>
                </div>
                {active === id && generated[id] && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-white/8 max-h-52 overflow-y-auto">
                    <p className="text-sm text-white/45 leading-relaxed whitespace-pre-wrap">{generated[id]}</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}