import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Zap, Building2, Users, BookOpen, BarChart3, DollarSign, FileText, Target, Briefcase, Upload, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const STEPS = [
  { id: 'basic', label: 'School Info', icon: Building2 },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'academic', label: 'Academic', icon: BookOpen },
  { id: 'culture', label: 'Culture & Climate', icon: BarChart3 },
  { id: 'talent', label: 'Talent & Staff', icon: Briefcase },
  { id: 'operations', label: 'Operations', icon: Target },
  { id: 'strategy', label: 'Strategic Priorities', icon: Target },
  { id: 'funding', label: 'Funding Needs', icon: DollarSign },
  { id: 'documents', label: 'Documents', icon: FileText },
];

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 focus:border-[#0a0f1e] bg-white transition-all";
const lbl = "block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest";
const sel = inp;

function Field({ label, children }) {
  return (
    <div>
      <label className={lbl}>{label}</label>
      {children}
    </div>
  );
}

function NumField({ label, field, form, set, placeholder }) {
  return (
    <Field label={label}>
      <input type="number" className={inp} placeholder={placeholder || '0'}
        value={form[field] || ''} onChange={e => set(field, e.target.value ? Number(e.target.value) : '')} />
    </Field>
  );
}

function TextField({ label, field, form, set, placeholder, multiline }) {
  return (
    <Field label={label}>
      {multiline
        ? <textarea className={inp + " min-h-[80px] resize-none"} placeholder={placeholder}
            value={form[field] || ''} onChange={e => set(field, e.target.value)} />
        : <input className={inp} placeholder={placeholder}
            value={form[field] || ''} onChange={e => set(field, e.target.value)} />
      }
    </Field>
  );
}

function SelField({ label, field, form, set, options }) {
  return (
    <Field label={label}>
      <select className={sel} value={form[field] || ''} onChange={e => set(field, e.target.value)}>
        <option value="">Select...</option>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </Field>
  );
}

export default function Xschetails() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [step, setStep] = useState(0);
  const [record, setRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(true);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const existing = await base44.entities.Xschetails.filter({ user_email: u.email }, '-created_date', 1);
      if (existing.length > 0) {
        setRecord(existing[0]);
        setForm(existing[0]);
        if (existing[0].status === 'ai_analyzed') setAnalyzed(true);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (next = true) => {
    setSaving(true);
    const pct = Math.round((Object.values(form).filter(v => v !== '' && v !== null && v !== undefined).length / 40) * 100);
    const data = { ...form, user_email: user.email, completion_pct: Math.min(pct, 100) };
    if (record) {
      await base44.entities.Xschetails.update(record.id, data);
    } else {
      const created = await base44.entities.Xschetails.create(data);
      setRecord(created);
    }
    setSaving(false);
    if (next && step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    await handleSave(false);
    const prompt = `You are an elite education strategy expert and AI analyst for the edXponential platform. Analyze this school's Xschetails profile and generate a comprehensive intelligence report.

School: ${form.school_name}
Type: ${form.school_type}
Grades: ${form.grades_served}
Enrollment: ${form.enrollment}
Location: ${form.city}, ${form.state}
Reading Proficiency: ${form.reading_proficiency}%
Math Proficiency: ${form.math_proficiency}%
Attendance: ${form.attendance_rate}%
Teacher Retention: ${form.teacher_retention_pct}%
Budget: $${form.budget_size?.toLocaleString()}
Enrollment Trend: ${form.enrollment_trend}
Top Goals: ${form.top_goals}
Biggest Challenge: ${form.biggest_challenge}
Urgency: ${form.urgency_level}
Coaching Needs: ${form.coaching_needs}
Academic Gaps: ${form.priority_academic_gaps}
Staffing Vacancies: ${form.vacancies}
Operations Pain Points: ${form.operations_pain_points}
Use of Funds: ${form.use_of_funds}

Generate a JSON response with:
{
  "summary": "2-3 sentence executive school profile summary",
  "strengths": "3-4 key institutional strengths (bullet format)",
  "risks": "3-4 key risks and challenges (bullet format)",
  "recommendations": "Top 5 specific actionable recommendations for edVisors, courses, communities, tutoring, and hiring",
  "plan_90_day": "Detailed 90-day execution plan with specific actions for weeks 1-4, 5-8, and 9-12",
  "pitch_readiness": 65
}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6',
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          strengths: { type: 'string' },
          risks: { type: 'string' },
          recommendations: { type: 'string' },
          plan_90_day: { type: 'string' },
          pitch_readiness: { type: 'number' }
        }
      }
    });

    const updateData = {
      ...form,
      user_email: user.email,
      ai_summary: result.summary,
      ai_strengths: result.strengths,
      ai_risks: result.risks,
      ai_recommendations: result.recommendations,
      ai_90_day_plan: result.plan_90_day,
      pitch_readiness_score: result.pitch_readiness || 0,
      status: 'ai_analyzed',
    };

    if (record) {
      await base44.entities.Xschetails.update(record.id, updateData);
    } else {
      const created = await base44.entities.Xschetails.create(updateData);
      setRecord(created);
    }
    setForm(f => ({ ...f, ...updateData }));
    setAnalyzing(false);
    setAnalyzed(true);
  };

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" />
    </div>
  );

  const currentStep = STEPS[step];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0a0f1e] px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">edXponential Intelligence</p>
          <h1 className="text-3xl font-black text-white">Xschetails™</h1>
          <p className="text-white/40 mt-1 text-sm">Your school's comprehensive operating intelligence profile.</p>
        </div>
      </div>

      {/* Step Nav */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 overflow-x-auto">
        <div className="max-w-5xl mx-auto flex gap-1 min-w-max">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap
                  ${i === step ? 'bg-[#0a0f1e] text-white' : i < step ? 'bg-green-50 text-green-700 border border-green-100' : 'text-gray-400 hover:bg-gray-50'}`}>
                {i < step ? <Check className="w-3 h-3" strokeWidth={3} /> : <Icon className="w-3 h-3" />}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial="hidden" animate="visible" exit="hidden" variants={fadeUp}
                className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#0a0f1e] rounded-xl flex items-center justify-center">
                    <StepIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-[#0a0f1e]">{currentStep.label}</p>
                    <p className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</p>
                  </div>
                </div>

                {step === 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><TextField label="School Name *" field="school_name" form={form} set={set} placeholder="e.g. Bright Futures Academy" /></div>
                    <TextField label="Website" field="website" form={form} set={set} placeholder="https://..." />
                    <SelField label="School Type" field="school_type" form={form} set={set} options={[
                      {value:'charter',label:'Charter'},
                      {value:'traditional_public',label:'Traditional Public'},
                      {value:'private',label:'Private'},
                      {value:'private_religious',label:'Private Religious'},
                      {value:'magnet',label:'Magnet'},
                      {value:'virtual',label:'Virtual'},
                      {value:'higher_ed',label:'Higher Ed'},
                      {value:'other',label:'Other'},
                    ]} />
                    <TextField label="Grades Served" field="grades_served" form={form} set={set} placeholder="e.g. K-8" />
                    <NumField label="Enrollment" field="enrollment" form={form} set={set} placeholder="e.g. 450" />
                    <TextField label="City" field="city" form={form} set={set} placeholder="Chicago" />
                    <TextField label="State" field="state" form={form} set={set} placeholder="IL" />
                    <NumField label="Year Founded" field="year_founded" form={form} set={set} placeholder="2018" />
                    <div className="col-span-2"><TextField label="Authorizer / District" field="authorizer_district" form={form} set={set} placeholder="e.g. Chicago Public Schools" /></div>
                    <div className="col-span-2"><TextField label="Leadership Team" field="leadership_team" form={form} set={set} placeholder="Principal, Dean, etc." multiline /></div>
                    <TextField label="Contact Email" field="contact_email" form={form} set={set} placeholder="admin@school.org" />
                    <TextField label="Contact Phone" field="contact_phone" form={form} set={set} placeholder="(555) 000-0000" />
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    <NumField label="% Economically Disadvantaged" field="pct_economically_disadvantaged" form={form} set={set} placeholder="e.g. 78" />
                    <NumField label="% Students with IEPs" field="pct_iep" form={form} set={set} placeholder="e.g. 15" />
                    <NumField label="% Multilingual Learners" field="pct_multilingual" form={form} set={set} placeholder="e.g. 22" />
                    <SelField label="Family Engagement Level" field="family_engagement_level" form={form} set={set} options={['low','medium','high']} />
                    <div className="col-span-2"><TextField label="Community Partnerships" field="community_partnerships" form={form} set={set} placeholder="List key community partners..." multiline /></div>
                    <div className="col-span-2"><TextField label="Neighborhood Context" field="neighborhood_context" form={form} set={set} placeholder="Describe the neighborhood..." multiline /></div>
                    <div className="col-span-2"><TextField label="Community Strengths" field="community_strengths" form={form} set={set} placeholder="What does this community do well?" multiline /></div>
                    <div className="col-span-2"><TextField label="Community Challenges" field="community_challenges" form={form} set={set} placeholder="Key challenges the community faces..." multiline /></div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-2 gap-4">
                    <NumField label="Reading Proficiency %" field="reading_proficiency" form={form} set={set} placeholder="e.g. 42" />
                    <NumField label="Math Proficiency %" field="math_proficiency" form={form} set={set} placeholder="e.g. 38" />
                    <NumField label="Science Proficiency %" field="science_proficiency" form={form} set={set} placeholder="e.g. 45" />
                    <div className="col-span-2"><TextField label="Student Growth Data" field="student_growth_data" form={form} set={set} placeholder="Describe growth trends..." multiline /></div>
                    <TextField label="Assessment Platforms Used" field="assessment_platforms" form={form} set={set} placeholder="e.g. NWEA MAP, DIBELS..." />
                    <TextField label="Curriculum Used" field="curriculum_used" form={form} set={set} placeholder="e.g. EL Education, Eureka..." />
                    <div className="col-span-2"><TextField label="Intervention Systems" field="intervention_systems" form={form} set={set} placeholder="e.g. RTI, MTSS, Wilson Reading..." multiline /></div>
                    <div className="col-span-2"><TextField label="Priority Academic Gaps" field="priority_academic_gaps" form={form} set={set} placeholder="What are the biggest instructional gaps?" multiline /></div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-2 gap-4">
                    <NumField label="Attendance Rate %" field="attendance_rate" form={form} set={set} placeholder="e.g. 92" />
                    <NumField label="Chronic Absenteeism %" field="chronic_absenteeism_pct" form={form} set={set} placeholder="e.g. 18" />
                    <NumField label="Suspension Rate %" field="suspension_rate" form={form} set={set} placeholder="e.g. 3" />
                    <NumField label="Student Culture Rating (1-10)" field="student_culture_rating" form={form} set={set} placeholder="e.g. 7" />
                    <NumField label="Staff Culture Rating (1-10)" field="staff_culture_rating" form={form} set={set} placeholder="e.g. 6" />
                    <NumField label="Family Satisfaction Rating (1-10)" field="family_satisfaction_rating" form={form} set={set} placeholder="e.g. 7" />
                    <div className="col-span-2"><TextField label="Safety Concerns" field="safety_concerns" form={form} set={set} placeholder="Any safety issues to note..." multiline /></div>
                    <div className="col-span-2"><TextField label="Classroom Management Needs" field="classroom_management_needs" form={form} set={set} placeholder="Describe classroom management challenges..." multiline /></div>
                  </div>
                )}

                {step === 4 && (
                  <div className="grid grid-cols-2 gap-4">
                    <NumField label="Number of Teachers" field="num_teachers" form={form} set={set} placeholder="e.g. 28" />
                    <NumField label="Teacher Retention %" field="teacher_retention_pct" form={form} set={set} placeholder="e.g. 74" />
                    <div className="col-span-2"><TextField label="Current Vacancies" field="vacancies" form={form} set={set} placeholder="List open positions..." multiline /></div>
                    <div className="col-span-2"><TextField label="Hard-to-Fill Roles" field="hard_to_fill_roles" form={form} set={set} placeholder="e.g. Special Ed, Math, Science..." /></div>
                    <div className="col-span-2"><TextField label="Leadership Vacancies" field="leadership_vacancies" form={form} set={set} placeholder="e.g. Dean of Instruction..." /></div>
                    <div className="col-span-2"><TextField label="Coaching Needs" field="coaching_needs" form={form} set={set} placeholder="What coaching support does staff need?" multiline /></div>
                    <div className="col-span-2"><TextField label="Professional Development Needs" field="pd_needs" form={form} set={set} placeholder="Key PD priorities..." multiline /></div>
                  </div>
                )}

                {step === 5 && (
                  <div className="grid grid-cols-2 gap-4">
                    <NumField label="Annual Budget ($)" field="budget_size" form={form} set={set} placeholder="e.g. 3500000" />
                    <SelField label="Enrollment Trend" field="enrollment_trend" form={form} set={set} options={['growing','stable','declining']} />
                    <div className="col-span-2"><TextField label="Facilities Needs" field="facilities_needs" form={form} set={set} placeholder="Capital improvements, space needs..." multiline /></div>
                    <div className="col-span-2"><TextField label="Technology Needs" field="technology_needs" form={form} set={set} placeholder="Devices, infrastructure, software..." multiline /></div>
                    <div className="col-span-2"><TextField label="Compliance Needs" field="compliance_needs" form={form} set={set} placeholder="State, federal, charter compliance areas..." /></div>
                    <div className="col-span-2"><TextField label="Data Systems Used" field="data_systems_used" form={form} set={set} placeholder="e.g. Illuminate, PowerSchool, Salesforce..." /></div>
                    <div className="col-span-2"><TextField label="Operations Pain Points" field="operations_pain_points" form={form} set={set} placeholder="Biggest operational bottlenecks..." multiline /></div>
                  </div>
                )}

                {step === 6 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><TextField label="Top 3 School Goals" field="top_goals" form={form} set={set} placeholder="1. Increase reading proficiency by 15 points..." multiline /></div>
                    <div className="col-span-2"><TextField label="Biggest Challenge" field="biggest_challenge" form={form} set={set} placeholder="The single most pressing challenge right now..." multiline /></div>
                    <SelField label="Urgency Level" field="urgency_level" form={form} set={set} options={['low','medium','high','urgent']} />
                    <TextField label="Improvement Timeline" field="improvement_timeline" form={form} set={set} placeholder="e.g. 12 months" />
                    <div className="col-span-2"><TextField label="Desired Outcomes" field="desired_outcomes" form={form} set={set} placeholder="What does success look like in 1 year?" multiline /></div>
                  </div>
                )}

                {step === 7 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Field label="Are you seeking funding?">
                        <div className="flex gap-3">
                          {['Yes', 'No'].map(opt => (
                            <button key={opt} onClick={() => set('funding_requested', opt === 'Yes')}
                              className={`px-6 py-3 rounded-xl border font-black text-sm transition-all
                                ${(form.funding_requested === true && opt === 'Yes') || (form.funding_requested === false && opt === 'No')
                                  ? 'bg-[#0a0f1e] text-white border-[#0a0f1e]' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </Field>
                    </div>
                    {form.funding_requested && (
                      <>
                        <NumField label="Capital Amount Needed ($)" field="capital_amount_needed" form={form} set={set} placeholder="e.g. 500000" />
                        <TextField label="Funding Timeline" field="funding_timeline" form={form} set={set} placeholder="e.g. Within 6 months" />
                        <div className="col-span-2"><TextField label="Use of Funds" field="use_of_funds" form={form} set={set} placeholder="How will the capital be deployed?" multiline /></div>
                      </>
                    )}
                  </div>
                )}

                {step === 8 && (
                  <div className="space-y-5">
                    <p className="text-sm text-gray-500 leading-relaxed">Upload key documents to strengthen your Xschetails profile and improve AI recommendations.</p>
                    {[
                      ['Pitch Deck', 'pitch_deck_url'],
                      ['Financials', 'financials_url'],
                      ['Strategic Plan', 'strategic_plan_url'],
                      ['School Improvement Plan', 'school_improvement_plan_url'],
                      ['Staffing Plan', 'staffing_plan_url'],
                      ['Curriculum Plan', 'curriculum_plan_url'],
                    ].map(([label, field]) => (
                      <div key={field} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <p className="font-bold text-sm text-[#0a0f1e]">{label}</p>
                          {form[field] ? <p className="text-xs text-green-600 font-semibold mt-0.5">✓ Uploaded</p> : <p className="text-xs text-gray-400 mt-0.5">Not uploaded</p>}
                        </div>
                        <label className="cursor-pointer">
                          <input type="file" className="hidden" onChange={async e => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const { file_url } = await base44.integrations.Core.UploadFile({ file });
                            set(field, file_url);
                          }} />
                          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            {form[field] ? 'Replace' : 'Upload'}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nav Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button onClick={() => step > 0 && setStep(s => s - 1)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => handleSave(false)} disabled={saving}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    {step < STEPS.length - 1 ? (
                      <button onClick={() => handleSave(true)} disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#0a0f1e] text-white rounded-xl text-sm font-black hover:bg-[#1a2033] transition-all">
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={handleAnalyze} disabled={analyzing}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#0a0f1e] text-white rounded-xl text-sm font-black hover:bg-[#1a2033] transition-all">
                        {analyzing ? <><RefreshCw className="w-4 h-4 animate-spin" />Analyzing...</> : <><Sparkles className="w-4 h-4" />Generate AI Analysis</>}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar — AI Analysis */}
          <div className="space-y-4">
            {/* Progress */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Profile Completion</p>
              <div className="h-2 bg-gray-100 rounded-full mb-2">
                <div className="h-2 bg-[#0a0f1e] rounded-full transition-all" style={{ width: `${form.completion_pct || 0}%` }} />
              </div>
              <p className="text-2xl font-black text-[#0a0f1e]">{form.completion_pct || 0}%</p>
              {form.pitch_readiness_score > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold">Pitch Park Readiness</p>
                  <p className="text-xl font-black text-[#0a0f1e]">{form.pitch_readiness_score}/100</p>
                </div>
              )}
            </div>

            {/* AI Summary */}
            {analyzed && form.ai_summary && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0f1e] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white/50" />
                  <p className="text-white/50 text-xs font-black uppercase tracking-widest">AI Analysis</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Summary</p>
                  <p className="text-white/70 text-xs leading-relaxed">{form.ai_summary}</p>
                </div>
                {form.ai_strengths && (
                  <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Strengths</p>
                    <p className="text-white/70 text-xs leading-relaxed whitespace-pre-line">{form.ai_strengths}</p>
                  </div>
                )}
                {form.ai_risks && (
                  <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Key Risks</p>
                    <p className="text-white/70 text-xs leading-relaxed whitespace-pre-line">{form.ai_risks}</p>
                  </div>
                )}
                {form.ai_recommendations && (
                  <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Recommendations</p>
                    <p className="text-white/70 text-xs leading-relaxed whitespace-pre-line">{form.ai_recommendations}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* 90 Day Plan */}
            {analyzed && form.ai_90_day_plan && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-[#0a0f1e]" />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">90-Day Execution Plan</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{form.ai_90_day_plan}</p>
              </motion.div>
            )}

            {!analyzed && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 text-center">
                <Sparkles className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-400">Complete all steps to unlock AI analysis, recommendations, and your 90-day plan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}