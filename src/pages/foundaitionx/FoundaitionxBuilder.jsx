import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, Loader2, ChevronRight, ChevronLeft,
  CheckCircle2, Mic, Send, Zap, GraduationCap, BookOpen,
  Users, BarChart3, Building2, Target, Globe, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const STEPS = [
  { id: 'school_basics', label: 'School Basics', icon: GraduationCap },
  { id: 'founder_info', label: 'Founder Info', icon: Users },
  { id: 'academic_model', label: 'Academic Model', icon: BookOpen },
  { id: 'culture', label: 'Culture & Climate', icon: Target },
  { id: 'operations', label: 'Operations', icon: Building2 },
  { id: 'finance', label: 'Finance', icon: BarChart3 },
  { id: 'governance', label: 'Governance', icon: Globe },
  { id: 'generate', label: 'Generate School', icon: Sparkles },
];

const SCHOOL_TYPES = ['Charter', 'Independent', 'Private', 'Microschool', 'Nonprofit', 'Online', 'Hybrid', 'Tutoring Academy'];
const SCHOOL_MODELS = ['Traditional', 'Montessori', 'Project-Based', 'STEM', 'Arts-Integrated', 'Classical', 'Expeditionary', 'Competency-Based', 'Dual-Language', 'Trauma-Informed', 'Restorative', 'International Baccalaureate'];
const GRADE_OPTIONS = ['PreK-5', 'K-5', 'K-8', 'K-12', '6-8', '6-12', '9-12', 'PreK-12', 'Other'];

export default function FoundaitionxBuilder() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const [data, setData] = useState({
    school_name: '', school_type: '', school_model: '', grade_levels: '',
    location_city: '', location_state: '', district: '', authorizer: '',
    academic_focus: '', enrollment_year1: '', enrollment_year3: '', enrollment_year5: '',
    founder_name: '', founder_background: '', philosophy: '', community_need: '', vision: '', mission: '',
    curriculum_model: '', instructional_model: '', assessment_approach: '', sped_approach: '',
    culture_system: '', discipline_model: '', family_engagement: '',
    staffing_approach: '', leadership_structure: '', facilities: '', transportation: '',
    startup_budget: '', revenue_model: '', fundraising_strategy: '',
    board_size: '', governance_model: '',
  });

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const handleVoiceBuild = async () => {
    if (!voiceInput.trim()) return;
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Foundaitionx™, the world's most advanced AI-powered school creation platform.
        
A founder has provided the following description for their school:
"${voiceInput}"

Extract and return a structured JSON school plan with:
- school_name, school_type, school_model, grade_levels, location_city, location_state
- mission, vision, academic_focus
- founder_background, philosophy, community_need
- curriculum_approach, culture_model
- enrollment_year1, enrollment_year3, enrollment_year5
- key_strengths (array), key_needs (array), approval_likelihood (0-100)
- executive_summary (2-3 paragraphs)`,
        response_json_schema: {
          type: 'object',
          properties: {
            school_name: { type: 'string' },
            school_type: { type: 'string' },
            school_model: { type: 'string' },
            grade_levels: { type: 'string' },
            location_city: { type: 'string' },
            location_state: { type: 'string' },
            mission: { type: 'string' },
            vision: { type: 'string' },
            academic_focus: { type: 'string' },
            founder_background: { type: 'string' },
            philosophy: { type: 'string' },
            community_need: { type: 'string' },
            curriculum_approach: { type: 'string' },
            culture_model: { type: 'string' },
            enrollment_year1: { type: 'number' },
            enrollment_year3: { type: 'number' },
            enrollment_year5: { type: 'number' },
            key_strengths: { type: 'array', items: { type: 'string' } },
            key_needs: { type: 'array', items: { type: 'string' } },
            approval_likelihood: { type: 'number' },
            executive_summary: { type: 'string' },
          }
        }
      });
      setGeneratedPlan(res);
      Object.entries(res).forEach(([k, v]) => { if (data[k] !== undefined) update(k, v); });
      toast.success('AI school plan generated!');
      setStep(7);
    } catch (e) {
      toast.error('Generation failed');
    }
    setLoading(false);
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Foundaitionx™ — the world's most advanced AI school creation platform.

Generate a complete, executive-level school creation plan for:

School: ${data.school_name || 'Charter School'}
Type: ${data.school_type}
Model: ${data.school_model}
Grades: ${data.grade_levels}
Location: ${data.location_city}, ${data.location_state}
District/Authorizer: ${data.district} / ${data.authorizer}
Academic Focus: ${data.academic_focus}
Mission: ${data.mission}
Vision: ${data.vision}
Community Need: ${data.community_need}
Founder Background: ${data.founder_background}
Educational Philosophy: ${data.philosophy}
Enrollment Goals: Year 1: ${data.enrollment_year1}, Year 3: ${data.enrollment_year3}, Year 5: ${data.enrollment_year5}
Curriculum: ${data.curriculum_model}
Culture: ${data.culture_system}
Governance: ${data.governance_model} with ${data.board_size} board members

Generate a comprehensive school plan with:
- executive_summary
- vision_mission_statement
- academic_plan_summary
- culture_plan_summary
- operations_plan_summary
- financial_overview
- governance_plan_summary
- key_strengths (array)
- gaps_to_address (array)
- approval_likelihood (0-100)
- recommended_next_steps (array)
- charter_application_outline (array of sections)`,
        response_json_schema: {
          type: 'object',
          properties: {
            executive_summary: { type: 'string' },
            vision_mission_statement: { type: 'string' },
            academic_plan_summary: { type: 'string' },
            culture_plan_summary: { type: 'string' },
            operations_plan_summary: { type: 'string' },
            financial_overview: { type: 'string' },
            governance_plan_summary: { type: 'string' },
            key_strengths: { type: 'array', items: { type: 'string' } },
            gaps_to_address: { type: 'array', items: { type: 'string' } },
            approval_likelihood: { type: 'number' },
            recommended_next_steps: { type: 'array', items: { type: 'string' } },
            charter_application_outline: { type: 'array', items: { type: 'string' } },
          }
        },
        model: 'claude_sonnet_4_6'
      });
      setGeneratedPlan(res);
      toast.success('Complete school plan generated!');
    } catch (e) {
      toast.error('Generation failed');
    }
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="space-y-4">
          <h3 className="font-black text-white mb-4">Tell Us About Your School</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label-style">School Name</label>
              <Input value={data.school_name} onChange={e => update('school_name', e.target.value)} placeholder="e.g. North Star Academy" className="input-style" />
            </div>
            <div>
              <label className="label-style">School Type</label>
              <Select value={data.school_type} onValueChange={v => update('school_type', v)}>
                <SelectTrigger className="input-style"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {SCHOOL_TYPES.map(t => <SelectItem key={t} value={t.toLowerCase()} className="text-xs focus:bg-white/10 focus:text-white">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label-style">School Model</label>
              <Select value={data.school_model} onValueChange={v => update('school_model', v)}>
                <SelectTrigger className="input-style"><SelectValue placeholder="Select model" /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {SCHOOL_MODELS.map(m => <SelectItem key={m} value={m.toLowerCase()} className="text-xs focus:bg-white/10 focus:text-white">{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label-style">Grade Levels</label>
              <Select value={data.grade_levels} onValueChange={v => update('grade_levels', v)}>
                <SelectTrigger className="input-style"><SelectValue placeholder="Select grades" /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {GRADE_OPTIONS.map(g => <SelectItem key={g} value={g} className="text-xs focus:bg-white/10 focus:text-white">{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label-style">Academic Focus</label>
              <Input value={data.academic_focus} onChange={e => update('academic_focus', e.target.value)} placeholder="e.g. STEM, Arts, Literacy" className="input-style" />
            </div>
            <div>
              <label className="label-style">City</label>
              <Input value={data.location_city} onChange={e => update('location_city', e.target.value)} placeholder="City" className="input-style" />
            </div>
            <div>
              <label className="label-style">State</label>
              <Input value={data.location_state} onChange={e => update('location_state', e.target.value)} placeholder="State" className="input-style" />
            </div>
            <div>
              <label className="label-style">District</label>
              <Input value={data.district} onChange={e => update('district', e.target.value)} placeholder="School district" className="input-style" />
            </div>
            <div>
              <label className="label-style">Charter Authorizer</label>
              <Input value={data.authorizer} onChange={e => update('authorizer', e.target.value)} placeholder="Authorizing entity" className="input-style" />
            </div>
          </div>
        </div>
      );

      case 1: return (
        <div className="space-y-4">
          <h3 className="font-black text-white mb-4">Founder Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label-style">Founder Name</label>
              <Input value={data.founder_name} onChange={e => update('founder_name', e.target.value)} placeholder="Your full name" className="input-style" />
            </div>
            <div className="col-span-2">
              <label className="label-style">Professional Background</label>
              <textarea value={data.founder_background} onChange={e => update('founder_background', e.target.value)}
                placeholder="Education, leadership experience, years in field..." rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="label-style">Educational Philosophy</label>
              <textarea value={data.philosophy} onChange={e => update('philosophy', e.target.value)}
                placeholder="What do you believe about how children learn?" rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="label-style">Community Need</label>
              <textarea value={data.community_need} onChange={e => update('community_need', e.target.value)}
                placeholder="What gap does your school fill in the community?" rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="label-style">School Vision</label>
              <textarea value={data.vision} onChange={e => update('vision', e.target.value)}
                placeholder="What will your school look like in 10 years?" rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="label-style">School Mission</label>
              <textarea value={data.mission} onChange={e => update('mission', e.target.value)}
                placeholder="What is your school's core purpose?" rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
            </div>
          </div>
        </div>
      );

      case 2: return (
        <div className="space-y-4">
          <h3 className="font-black text-white mb-4">Academic Model</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'curriculum_model', label: 'Curriculum Model', ph: 'e.g. Core Knowledge, EL Education, CKLA' },
              { key: 'instructional_model', label: 'Instructional Model', ph: 'e.g. Workshop Model, Blended, Flipped' },
              { key: 'assessment_approach', label: 'Assessment Approach', ph: 'e.g. Standards-based, Portfolio, Performance' },
              { key: 'sped_approach', label: 'SPED Approach', ph: 'e.g. Inclusion model, Resource room, Co-teaching' },
            ].map(({ key, label, ph }) => (
              <div key={key} className="col-span-2 md:col-span-1">
                <label className="label-style">{label}</label>
                <Input value={data[key]} onChange={e => update(key, e.target.value)} placeholder={ph} className="input-style" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="label-style">Enrollment Projections</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ key: 'enrollment_year1', label: 'Year 1' }, { key: 'enrollment_year3', label: 'Year 3' }, { key: 'enrollment_year5', label: 'Year 5' }].map(({ key, label }) => (
                  <div key={key}>
                    <div className="text-[10px] text-white/25 mb-1">{label}</div>
                    <Input type="number" value={data[key]} onChange={e => update(key, e.target.value)} placeholder="Students" className="input-style" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

      case 3: return (
        <div className="space-y-4">
          <h3 className="font-black text-white mb-4">Culture & Climate</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { key: 'culture_system', label: 'Culture System', ph: 'e.g. PBIS, Restorative Practices, RULER' },
              { key: 'discipline_model', label: 'Discipline Model', ph: 'e.g. Restorative justice, Progressive discipline' },
              { key: 'family_engagement', label: 'Family Engagement Strategy', ph: 'Describe how you will engage families...' },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <label className="label-style">{label}</label>
                <textarea value={data[key]} onChange={e => update(key, e.target.value)} placeholder={ph} rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
              </div>
            ))}
          </div>
        </div>
      );

      case 4: return (
        <div className="space-y-4">
          <h3 className="font-black text-white mb-4">Operations & Facilities</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'staffing_approach', label: 'Staffing Approach' },
              { key: 'leadership_structure', label: 'Leadership Structure' },
              { key: 'facilities', label: 'Facilities Plan' },
              { key: 'transportation', label: 'Transportation Plan' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="label-style">{label}</label>
                <Input value={data[key]} onChange={e => update(key, e.target.value)} className="input-style" />
              </div>
            ))}
          </div>
        </div>
      );

      case 5: return (
        <div className="space-y-4">
          <h3 className="font-black text-white mb-4">Financial Systems</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { key: 'startup_budget', label: 'Startup Budget Estimate', ph: 'e.g. $500,000' },
              { key: 'revenue_model', label: 'Revenue Model', ph: 'Per-pupil funding, grants, philanthropy...' },
              { key: 'fundraising_strategy', label: 'Fundraising Strategy', ph: 'Major donors, grants, community campaigns...' },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <label className="label-style">{label}</label>
                <textarea value={data[key]} onChange={e => update(key, e.target.value)} placeholder={ph} rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
              </div>
            ))}
          </div>
        </div>
      );

      case 6: return (
        <div className="space-y-4">
          <h3 className="font-black text-white mb-4">Governance Structure</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-style">Board Size</label>
              <Select value={data.board_size} onValueChange={v => update('board_size', v)}>
                <SelectTrigger className="input-style"><SelectValue placeholder="# of board members" /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {['5', '7', '9', '11', '13'].map(n => <SelectItem key={n} value={n} className="text-xs focus:bg-white/10 focus:text-white">{n} Members</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label-style">Governance Model</label>
              <Input value={data.governance_model} onChange={e => update('governance_model', e.target.value)} placeholder="e.g. Policy governance, Management governance" className="input-style" />
            </div>
          </div>
        </div>
      );

      case 7: return (
        <div className="space-y-4">
          {generatedPlan ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <h3 className="font-black text-white text-lg">Your School Plan is Ready</h3>
              </div>
              <div className="border border-white/8 rounded-xl p-5 bg-white/2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-white/50 uppercase tracking-widest">Approval Likelihood</span>
                  <span className="font-black text-2xl text-white">{generatedPlan.approval_likelihood || 78}%</span>
                </div>
                <div className="h-2 bg-white/8 rounded-full">
                  <div className="h-full bg-white/60 rounded-full" style={{ width: `${generatedPlan.approval_likelihood || 78}%` }} />
                </div>
              </div>
              {generatedPlan.executive_summary && (
                <div className="border border-white/8 rounded-xl p-5 bg-white/2">
                  <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">Executive Summary</p>
                  <p className="text-sm text-white/60 leading-relaxed">{generatedPlan.executive_summary}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {generatedPlan.key_strengths?.length > 0 && (
                  <div className="border border-white/8 rounded-xl p-4 bg-white/2">
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">Strengths</p>
                    {generatedPlan.key_strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-1.5 mb-1">
                        <CheckCircle2 className="w-3 h-3 text-white/40 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-white/50">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                {generatedPlan.gaps_to_address?.length > 0 && (
                  <div className="border border-white/8 rounded-xl p-4 bg-white/2">
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">Gaps to Address</p>
                    {generatedPlan.gaps_to_address.map((g, i) => (
                      <div key={i} className="flex items-start gap-1.5 mb-1">
                        <Zap className="w-3 h-3 text-white/30 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-white/40">{g}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {generatedPlan.recommended_next_steps?.length > 0 && (
                <div className="border border-white/8 rounded-xl p-4 bg-white/2">
                  <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">Recommended Next Steps</p>
                  {generatedPlan.recommended_next_steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-black text-white/20 w-4">{i + 1}.</span>
                      <span className="text-xs text-white/50">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <Sparkles className="w-10 h-10 text-white/20 mx-auto mb-4" />
              <h3 className="font-black text-white text-xl mb-2">Generate Your Complete School Plan</h3>
              <p className="text-white/30 text-sm mb-6">AI will analyze all your inputs and generate a comprehensive school creation plan</p>
              <Button onClick={handleGeneratePlan} disabled={loading} className="bg-white text-black font-black hover:bg-white/90 rounded-full px-8">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate School Plan</>}
              </Button>
            </div>
          )}
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight">AI School Builder</h1>
          </div>
          <p className="text-xs text-white/30">Build your entire school concept with AI guidance</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Voice Input */}
        <div className="border border-white/8 rounded-2xl p-5 bg-white/2 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Mic className="w-4 h-4 text-white/40" />
            <span className="text-xs font-black text-white/50">AI Voice Builder — Describe your school in plain language</span>
          </div>
          <div className="flex gap-2">
            <textarea value={voiceInput} onChange={e => setVoiceInput(e.target.value)}
              placeholder='e.g. "Build a K-8 Montessori charter school in Atlanta, Georgia focused on underserved Black and Latino students..."'
              rows={2} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
            <Button onClick={handleVoiceBuild} disabled={loading || !voiceInput.trim()} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-xl px-4 flex-shrink-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> Build</>}
            </Button>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map(({ id, label, icon: Icon }, i) => (
            <button key={id} onClick={() => setStep(i)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all flex-shrink-0 ${i === step ? 'bg-white text-black' : i < step ? 'border border-white/20 text-white/40' : 'border border-white/8 text-white/20'}`}>
              {i < step ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
              {label}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="border border-white/8 rounded-2xl p-6 bg-white/2 mb-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="border-white/15 text-white font-black text-xs rounded-full hover:bg-white/5">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          ) : !generatedPlan ? (
            <Button onClick={handleGeneratePlan} disabled={loading} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full">
              {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating</> : <><Sparkles className="w-3.5 h-3.5" /> Generate Plan</>}
            </Button>
          ) : null}
        </div>
      </div>

      <style>{`.label-style { display: block; font-size: 11px; font-weight: 900; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; } .input-style { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: white; font-size: 13px; } .input-style:focus { border-color: rgba(255,255,255,0.3); }`}</style>
    </div>
  );
}