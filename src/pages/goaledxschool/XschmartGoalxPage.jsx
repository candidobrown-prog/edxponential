import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, ArrowLeft, ArrowRight, Sparkles, RefreshCw, Save, CheckCircle,
  Users, BookOpen, BarChart3, Calendar, TrendingUp, Award, Plus, Trash2
} from 'lucide-react';

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 bg-white";
const lbl = "block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest";

const STEPS = [
  { id: 'context', label: 'School Context', icon: BookOpen },
  { id: 'calendar', label: 'Calendar Structure', icon: Calendar },
  { id: 'academic', label: 'Academic Goals', icon: BarChart3 },
  { id: 'culture', label: 'Culture Goals', icon: Users },
  { id: 'staff', label: 'Staff Performance', icon: TrendingUp },
  { id: 'ownership', label: 'Goal Ownership', icon: Target },
];

function Field({ label, children }) {
  return <div><label className={lbl}>{label}</label>{children}</div>;
}
function TF({ label, fkey, form, set, placeholder, multi }) {
  return <Field label={label}>{multi
    ? <textarea className={inp + " min-h-[80px] resize-none"} placeholder={placeholder} value={form[fkey] || ''} onChange={e => set(fkey, e.target.value)} />
    : <input className={inp} placeholder={placeholder} value={form[fkey] || ''} onChange={e => set(fkey, e.target.value)} />}
  </Field>;
}
function NF({ label, fkey, form, set, placeholder }) {
  return <Field label={label}><input type="number" className={inp} placeholder={placeholder || '0'} value={form[fkey] || ''} onChange={e => set(fkey, e.target.value ? Number(e.target.value) : '')} /></Field>;
}

export default function XschmartGoalxPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [goals, setGoals] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // simulate save
    setSaving(false);
  };

  const handleGeneratePerformintx = async () => {
    setGenerating(true);
    const prompt = `You are an elite school transformation strategist. Based on this comprehensive school context, generate a full set of SMART goals for every area.

SCHOOL CONTEXT:
Name: ${form.school_name} | Grades: ${form.grades_served} | Enrollment: ${form.enrollment}
Mission: ${form.school_mission} | Vision: ${form.school_vision}
Model: ${form.school_model} | Academic Priorities: ${form.academic_priorities}

CALENDAR: First Day: ${form.first_day} | Last Day: ${form.last_day} | Assessment Windows: ${form.assessment_windows}

ACADEMIC GOALS:
Reading: ${form.reading_goal} | Math: ${form.math_goal} | Writing: ${form.writing_goal}
Intervention: ${form.intervention_goal} | Growth: ${form.growth_goal}

CULTURE GOALS:
Attendance: ${form.attendance_goal} | Behavior: ${form.behavior_goal}
Family Engagement: ${form.family_engagement_goal}

STAFF GOALS:
Teacher Goals: ${form.teacher_goals} | Leader Goals: ${form.leader_goals}
Retention: ${form.retention_goal} | Coaching: ${form.coaching_goal}

GOAL OWNERSHIP:
${form.goal_owners} | Evidence: ${form.evidence_required} | Deadlines: ${form.deadlines}

Generate 8-12 SMART goals in JSON format. Each goal must be:
- Specific, Measurable, Achievable, Relevant, Time-bound
- Include: title, category, owner, baseline, target, deadline, evidence_source, checkpoints (array of 3), status (not_started), priority (high/medium/low), coaching_recommendations

Return JSON: { "goals": [ { "title":"...", "category":"academic|culture|staff|operations", "owner":"...", "baseline":"...", "target":"...", "deadline":"...", "evidence_source":"...", "checkpoints":["...","...","..."], "status":"not_started", "priority":"high", "coaching_recommendations":"..." } ] }`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt, model: 'claude_sonnet_4_6',
      response_json_schema: {
        type: 'object',
        properties: {
          goals: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' }, category: { type: 'string' }, owner: { type: 'string' },
                baseline: { type: 'string' }, target: { type: 'string' }, deadline: { type: 'string' },
                evidence_source: { type: 'string' }, checkpoints: { type: 'array', items: { type: 'string' } },
                status: { type: 'string' }, priority: { type: 'string' }, coaching_recommendations: { type: 'string' }
              }
            }
          }
        }
      }
    });
    setGoals(result.goals || []);
    setComplete(true);
    setGenerating(false);
  };

  const currentStep = STEPS[step];

  if (complete) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="bg-[#0a0f1e] px-8 py-10">
          <div className="max-w-6xl mx-auto">
            <Link to="/goaled" className="flex items-center gap-1 text-white/30 text-xs font-black uppercase tracking-widest mb-2 hover:text-white/60 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Goaled Xschool™
            </Link>
            <h1 className="text-3xl font-black text-white">Xschmart Goalx — Goals Ready</h1>
            <p className="text-white/40 mt-1 text-sm">{goals.length} SMART goals generated for your school.</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
          {/* Produce Performintx CTA */}
          <div className="bg-[#0a0f1e] rounded-2xl p-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">Next Step</p>
              <h2 className="text-2xl font-black text-white">Produce Performintx™</h2>
              <p className="text-white/40 text-sm mt-1">Transform these goals into a full People Performance Intelligence Dashboard.</p>
            </div>
            <button onClick={() => navigate('/goaled/performintx', { state: { goals, schoolContext: form } })}
              className="flex items-center gap-3 px-8 py-4 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all whitespace-nowrap shadow-2xl shadow-white/20">
              <Sparkles className="w-5 h-5" /> Produce Performintx™
            </button>
          </div>

          {/* Goals */}
          <div className="grid md:grid-cols-2 gap-4">
            {goals.map((goal, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    goal.priority === 'high' ? 'bg-red-50 text-red-600' : goal.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                  }`}>{goal.priority}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{goal.category}</span>
                </div>
                <h3 className="font-black text-[#0a0f1e] text-sm mb-2">{goal.title}</h3>
                <div className="space-y-1 text-xs text-gray-500">
                  <p><span className="font-black text-gray-700">Owner:</span> {goal.owner}</p>
                  <p><span className="font-black text-gray-700">Target:</span> {goal.target}</p>
                  <p><span className="font-black text-gray-700">Deadline:</span> {goal.deadline}</p>
                  <p><span className="font-black text-gray-700">Evidence:</span> {goal.evidence_source}</p>
                </div>
                {goal.checkpoints?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Checkpoints</p>
                    {goal.checkpoints.map((cp, j) => (
                      <div key={j} className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                        <p className="text-xs text-gray-400">{cp}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <Link to="/goaled" className="flex items-center gap-1 text-white/30 text-xs font-black uppercase tracking-widest mb-2 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Goaled Xschool™
          </Link>
          <h1 className="text-3xl font-black text-white">Xschmart Goalx</h1>
          <p className="text-white/40 mt-1 text-sm">AI-powered SMART goal interview for your school leadership team.</p>
        </div>
        {/* Step Nav */}
        <div className="max-w-5xl mx-auto mt-6 flex gap-1 overflow-x-auto">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all
                  ${i === step ? 'bg-white text-[#0a0f1e]' : i < step ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'text-white/40 hover:bg-white/10 hover:text-white'}`}>
                {i < step ? <CheckCircle className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0a0f1e] rounded-xl flex items-center justify-center">
                {React.createElement(STEPS[step].icon, { className: 'w-5 h-5 text-white' })}
              </div>
              <div>
                <p className="font-black text-[#0a0f1e]">{currentStep.label}</p>
                <p className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</p>
              </div>
            </div>

            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><TF label="School Name" fkey="school_name" form={form} set={set} placeholder="e.g. Bright Futures Academy" /></div>
                <TF label="Grades Served" fkey="grades_served" form={form} set={set} placeholder="e.g. K-8" />
                <NF label="Student Enrollment" fkey="enrollment" form={form} set={set} placeholder="450" />
                <TF label="School Model" fkey="school_model" form={form} set={set} placeholder="e.g. Charter, Montessori, Traditional" />
                <TF label="Academic Priorities" fkey="academic_priorities" form={form} set={set} placeholder="e.g. Literacy, Math, STEM" />
                <div className="col-span-2"><TF label="School Mission" fkey="school_mission" form={form} set={set} placeholder="Our school's mission is..." multi /></div>
                <div className="col-span-2"><TF label="School Vision" fkey="school_vision" form={form} set={set} placeholder="We envision..." multi /></div>
                <TF label="Leadership Structure" fkey="leadership_structure" form={form} set={set} placeholder="e.g. Principal, 2 Deans, Coaches" />
                <NF label="Number of Staff" fkey="num_staff" form={form} set={set} placeholder="45" />
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <TF label="First Day of School" fkey="first_day" form={form} set={set} placeholder="e.g. August 12, 2025" />
                <TF label="Last Day of School" fkey="last_day" form={form} set={set} placeholder="e.g. June 10, 2026" />
                <NF label="Number of Instructional Days" fkey="instructional_days" form={form} set={set} placeholder="180" />
                <TF label="Grading Structure" fkey="grading_structure" form={form} set={set} placeholder="e.g. Quarters, Semesters, Trimesters" />
                <div className="col-span-2"><TF label="Assessment Windows" fkey="assessment_windows" form={form} set={set} placeholder="e.g. Sept BOY, Jan MOY, May EOY..." multi /></div>
                <div className="col-span-2"><TF label="PD Days & Key Dates" fkey="pd_days" form={form} set={set} placeholder="List PD days, parent conferences, reporting windows..." multi /></div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><TF label="Reading/ELA Goal" fkey="reading_goal" form={form} set={set} placeholder="e.g. Increase reading proficiency from 42% to 60% by EOY..." multi /></div>
                <div className="col-span-2"><TF label="Math Goal" fkey="math_goal" form={form} set={set} placeholder="e.g. Increase math proficiency from 38% to 55% by EOY..." multi /></div>
                <div className="col-span-2"><TF label="Writing Goal" fkey="writing_goal" form={form} set={set} placeholder="e.g. 70% of students demonstrate grade-level writing..." multi /></div>
                <div className="col-span-2"><TF label="Intervention/Growth Goal" fkey="intervention_goal" form={form} set={set} placeholder="e.g. 80% of Tier 2/3 students show 1.5x growth..." multi /></div>
                <div className="col-span-2"><TF label="Growth Goal" fkey="growth_goal" form={form} set={set} placeholder="e.g. All students show minimum 1 grade level growth in ELA and Math..." multi /></div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><TF label="Attendance Goal" fkey="attendance_goal" form={form} set={set} placeholder="e.g. Maintain 95%+ average daily attendance..." multi /></div>
                <div className="col-span-2"><TF label="Behavior/Culture Goal" fkey="behavior_goal" form={form} set={set} placeholder="e.g. Reduce office referrals by 30%..." multi /></div>
                <div className="col-span-2"><TF label="Family Engagement Goal" fkey="family_engagement_goal" form={form} set={set} placeholder="e.g. 80% family participation in at least one school event..." multi /></div>
                <div className="col-span-2"><TF label="Staff Culture Goal" fkey="staff_culture_goal" form={form} set={set} placeholder="e.g. Staff satisfaction score of 8+/10..." multi /></div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><TF label="Teacher Performance Goals" fkey="teacher_goals" form={form} set={set} placeholder="e.g. 85% of teachers rated effective or highly effective..." multi /></div>
                <div className="col-span-2"><TF label="Leader Performance Goals" fkey="leader_goals" form={form} set={set} placeholder="e.g. Principal completes 3 observations per teacher..." multi /></div>
                <div className="col-span-2"><TF label="Coaching Goal" fkey="coaching_goal" form={form} set={set} placeholder="e.g. Each teacher receives bi-weekly coaching..." multi /></div>
                <div className="col-span-2"><TF label="Staff Retention Goal" fkey="retention_goal" form={form} set={set} placeholder="e.g. 85% teacher retention year-over-year..." multi /></div>
                <div className="col-span-2"><TF label="Hiring Goal" fkey="hiring_goal" form={form} set={set} placeholder="e.g. Fill all vacancies by August 1..." multi /></div>
              </div>
            )}

            {step === 5 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><TF label="Who Owns Each Goal?" fkey="goal_owners" form={form} set={set} placeholder="e.g. Principal owns reading goals, Dean of Culture owns attendance..." multi /></div>
                <div className="col-span-2"><TF label="What Evidence is Required?" fkey="evidence_required" form={form} set={set} placeholder="e.g. Assessment scores, observation data, attendance reports..." multi /></div>
                <div className="col-span-2"><TF label="Key Deadlines" fkey="deadlines" form={form} set={set} placeholder="e.g. Q1 check: Oct 15, Mid-year: Jan 30, EOY: June 1..." multi /></div>
                <div className="col-span-2"><TF label="Progress Monitoring Cadence" fkey="monitoring_cadence" form={form} set={set} placeholder="e.g. Weekly data team meetings, monthly leadership reviews..." multi /></div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
              <button onClick={() => step > 0 && setStep(s => s - 1)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all">
                  {saving ? 'Saving...' : <><Save className="w-3.5 h-3.5 inline mr-1.5" />Save</>}
                </button>
                {step < STEPS.length - 1 ? (
                  <button onClick={() => { handleSave(); setStep(s => s + 1); }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0a0f1e] text-white rounded-xl text-sm font-black hover:bg-[#1a2033] transition-all">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleGeneratePerformintx} disabled={generating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0a0f1e] text-white rounded-xl text-sm font-black hover:bg-[#1a2033] transition-all">
                    {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate Goals</>}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}