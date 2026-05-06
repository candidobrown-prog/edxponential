import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Upload, Sparkles, RefreshCw, Building2 } from 'lucide-react';

const STEPS = [
  'School Info', 'Community', 'Academic', 'Culture', 'Talent', 'Operations', 'Strategy', 'Funding', 'Documents'
];

const SUPPORT_OPTIONS = ['Coaching','Consulting','Tutoring','Hiring','Capital','Curriculum','Data support','Culture reset','Academic intervention'];

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 focus:border-[#0a0f1e] bg-white transition-all";
const lbl = "block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest";

function F({ label, children }) { return <div><label className={lbl}>{label}</label>{children}</div>; }
function TF({ label, field, form, set, placeholder, multi }) {
  return <F label={label}>{multi
    ? <textarea className={inp+" min-h-[72px] resize-none"} placeholder={placeholder} value={form[field]||''} onChange={e=>set(field,e.target.value)} />
    : <input className={inp} placeholder={placeholder} value={form[field]||''} onChange={e=>set(field,e.target.value)} />}
  </F>;
}
function NF({ label, field, form, set, placeholder }) {
  return <F label={label}><input type="number" className={inp} placeholder={placeholder||'0'} value={form[field]||''} onChange={e=>set(field,e.target.value?Number(e.target.value):'')} /></F>;
}
function SF({ label, field, form, set, options }) {
  return <F label={label}><select className={inp} value={form[field]||''} onChange={e=>set(field,e.target.value)}>
    <option value="">Select...</option>
    {options.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
  </select></F>;
}

export default function XschetailsForm({ user, school, onSaved }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(school || {});
  const [saving, setSaving] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);

  useEffect(() => { if (school) setForm(school); }, [school]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calcCompletion = (f) => {
    const fields = ['school_name','city','state','school_type','grades_served','enrollment','reading_proficiency','math_proficiency','attendance_rate','teacher_retention_pct','top_goals','biggest_challenge'];
    const filled = fields.filter(k => f[k] !== undefined && f[k] !== '' && f[k] !== null).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleAutoFill = async () => {
    if (!form.school_name) return;
    setAutoFilling(true);
    const prompt = `You are a school data researcher. For the school named "${form.school_name}"${form.city ? ` in ${form.city}` : ''}${form.state ? `, ${form.state}` : ''}, attempt to provide publicly available information. Return a JSON object with fields: address, city, state, zip, district, school_type, grades_served, enrollment, website, phone, year_founded, public_school_id (if known). Use null for unknown fields. School types: charter, traditional_public, private, private_religious, magnet, virtual, other.`;
    const result = await base44.integrations.Core.InvokeLLM({
      prompt, add_context_from_internet: true,
      response_json_schema: { type: 'object', properties: { address:{type:'string'}, city:{type:'string'}, state:{type:'string'}, zip:{type:'string'}, district:{type:'string'}, school_type:{type:'string'}, grades_served:{type:'string'}, enrollment:{type:'number'}, website:{type:'string'}, phone:{type:'string'}, year_founded:{type:'number'}, public_school_id:{type:'string'} } }
    });
    setForm(f => ({ ...f, ...Object.fromEntries(Object.entries(result).filter(([,v]) => v !== null && v !== undefined && v !== '')) }));
    setAutoFilling(false);
  };

  const handleSave = async (goNext = true) => {
    setSaving(true);
    const pct = calcCompletion(form);
    const data = { ...form, owner_email: user.email, xschetails_completion_pct: pct };
    let saved;
    if (school?.id) {
      saved = await base44.entities.MyXschool.update(school.id, data);
      saved = { ...data, id: school.id };
    } else {
      saved = await base44.entities.MyXschool.create({ ...data, status: 'active' });
    }
    onSaved(saved);
    setSaving(false);
    if (goNext && step < STEPS.length - 1) setStep(s => s + 1);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {/* Step pills */}
        <div className="flex gap-1 flex-wrap mb-6">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => setStep(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all
                ${i===step?'bg-[#0a0f1e] text-white':i<step?'bg-green-50 text-green-700 border border-green-100':'text-gray-400 hover:bg-gray-50'}`}>
              {i<step?<Check className="w-3 h-3 inline mr-1" strokeWidth={3}/>:null}{s}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.2}}
            className="bg-white rounded-2xl border border-gray-100 p-7 space-y-5">

            {step === 0 && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1"><TF label="School Name *" field="school_name" form={form} set={set} placeholder="e.g. Bright Futures Academy" /></div>
                  <button onClick={handleAutoFill} disabled={!form.school_name||autoFilling}
                    className="mt-5 flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 disabled:opacity-40 whitespace-nowrap transition-all">
                    {autoFilling?<><RefreshCw className="w-3 h-3 animate-spin"/>Auto-filling...</>:<><Sparkles className="w-3 h-3"/>Auto-Fill</>}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TF label="Address" field="address" form={form} set={set} placeholder="123 Main St" />
                  <TF label="City" field="city" form={form} set={set} placeholder="Chicago" />
                  <TF label="State" field="state" form={form} set={set} placeholder="IL" />
                  <TF label="ZIP" field="zip" form={form} set={set} placeholder="60601" />
                  <TF label="District" field="district" form={form} set={set} placeholder="Chicago Public Schools" />
                  <TF label="Website" field="website" form={form} set={set} placeholder="https://..." />
                  <TF label="Phone" field="phone" form={form} set={set} placeholder="(555) 000-0000" />
                  <NF label="Year Founded" field="year_founded" form={form} set={set} placeholder="2018" />
                  <SF label="School Type" field="school_type" form={form} set={set} options={[{v:'charter',l:'Charter'},{v:'traditional_public',l:'Traditional Public'},{v:'private',l:'Private'},{v:'magnet',l:'Magnet'},{v:'virtual',l:'Virtual'},{v:'other',l:'Other'}]} />
                  <TF label="Grades Served" field="grades_served" form={form} set={set} placeholder="K-8" />
                  <NF label="Enrollment" field="enrollment" form={form} set={set} placeholder="450" />
                  <TF label="Public School ID" field="public_school_id" form={form} set={set} placeholder="Optional" />
                  <div className="col-span-2"><TF label="Authorizer / Charter Authorizer" field="authorizer" form={form} set={set} placeholder="e.g. Illinois State Board" /></div>
                  <div className="col-span-2"><TF label="Leadership Team" field="leadership_team" form={form} set={set} placeholder="Principal, Dean of Instruction, etc." multi /></div>
                </div>
              </>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <NF label="% Economically Disadvantaged" field="pct_economically_disadvantaged" form={form} set={set} placeholder="78" />
                <NF label="% Students with IEPs" field="pct_iep" form={form} set={set} placeholder="15" />
                <NF label="% Multilingual Learners" field="pct_multilingual" form={form} set={set} placeholder="22" />
                <SF label="Family Engagement Level" field="family_engagement_level" form={form} set={set} options={['low','medium','high']} />
                <div className="col-span-2"><TF label="Community Strengths" field="community_strengths" form={form} set={set} placeholder="What does this community do well?" multi /></div>
                <div className="col-span-2"><TF label="Community Challenges" field="community_challenges" form={form} set={set} placeholder="Key challenges..." multi /></div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <NF label="Reading Proficiency %" field="reading_proficiency" form={form} set={set} placeholder="42" />
                <NF label="Math Proficiency %" field="math_proficiency" form={form} set={set} placeholder="38" />
                <NF label="Writing Proficiency %" field="writing_proficiency" form={form} set={set} placeholder="45" />
                <NF label="Science Proficiency %" field="science_proficiency" form={form} set={set} placeholder="50" />
                <TF label="Assessment Platform" field="assessment_platform" form={form} set={set} placeholder="NWEA MAP, DIBELS..." />
                <TF label="Curriculum Used" field="curriculum_used" form={form} set={set} placeholder="EL Education, Eureka..." />
                <div className="col-span-2"><TF label="Intervention Programs" field="intervention_programs" form={form} set={set} placeholder="RTI, MTSS, Wilson Reading..." /></div>
                <div className="col-span-2"><TF label="Priority Academic Gaps" field="priority_gaps" form={form} set={set} placeholder="Biggest instructional gaps..." multi /></div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-4">
                <NF label="Attendance Rate %" field="attendance_rate" form={form} set={set} placeholder="92" />
                <NF label="Chronic Absenteeism %" field="chronic_absenteeism_pct" form={form} set={set} placeholder="18" />
                <NF label="Suspension Rate %" field="suspension_rate" form={form} set={set} placeholder="3" />
                <NF label="Student Culture (1-10)" field="student_culture_rating" form={form} set={set} placeholder="7" />
                <NF label="Staff Culture (1-10)" field="staff_culture_rating" form={form} set={set} placeholder="6" />
                <NF label="Family Satisfaction (1-10)" field="family_satisfaction_rating" form={form} set={set} placeholder="7" />
                <div className="col-span-2"><TF label="Safety Concerns" field="safety_concerns" form={form} set={set} placeholder="Any safety issues..." multi /></div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-2 gap-4">
                <NF label="Number of Teachers" field="num_teachers" form={form} set={set} placeholder="28" />
                <NF label="Teacher Retention %" field="teacher_retention_pct" form={form} set={set} placeholder="74" />
                <div className="col-span-2"><TF label="Current Vacancies" field="vacancies" form={form} set={set} placeholder="List open roles..." multi /></div>
                <div className="col-span-2"><TF label="Coaching Needs" field="coaching_needs" form={form} set={set} placeholder="Staff coaching needs..." multi /></div>
                <div className="col-span-2"><TF label="Professional Development Needs" field="pd_needs" form={form} set={set} placeholder="PD priorities..." multi /></div>
              </div>
            )}

            {step === 5 && (
              <div className="grid grid-cols-2 gap-4">
                <NF label="Annual Budget ($)" field="budget_size" form={form} set={set} placeholder="3500000" />
                <SF label="Enrollment Trend" field="enrollment_trend" form={form} set={set} options={['growing','stable','declining']} />
                <div className="col-span-2"><TF label="Technology Needs" field="technology_needs" form={form} set={set} placeholder="Devices, software, infrastructure..." multi /></div>
                <div className="col-span-2"><TF label="Operations Pain Points" field="operations_pain_points" form={form} set={set} placeholder="Biggest operational bottlenecks..." multi /></div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <TF label="Top 3 Goals" field="top_goals" form={form} set={set} placeholder="1. Increase reading by 15 points..." multi />
                <TF label="Biggest Challenge" field="biggest_challenge" form={form} set={set} placeholder="The single most pressing challenge..." multi />
                <SF label="Urgency Level" field="urgency_level" form={form} set={set} options={['low','medium','high','urgent']} />
                <div>
                  <label className={lbl}>Support Areas Needed</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {SUPPORT_OPTIONS.map(opt => {
                      const active = (form.support_areas || []).includes(opt);
                      return (
                        <button key={opt} onClick={() => set('support_areas', active ? (form.support_areas||[]).filter(x=>x!==opt) : [...(form.support_areas||[]), opt])}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${active?'bg-[#0a0f1e] text-white border-[#0a0f1e]':'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                <div>
                  <label className={lbl}>Are you seeking funding?</label>
                  <div className="flex gap-3">
                    {['Yes','No'].map(opt => (
                      <button key={opt} onClick={() => set('funding_requested', opt==='Yes')}
                        className={`px-6 py-3 rounded-xl border font-black text-sm transition-all ${(form.funding_requested===true&&opt==='Yes')||(form.funding_requested===false&&opt==='No')?'bg-[#0a0f1e] text-white border-[#0a0f1e]':'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                {form.funding_requested && (
                  <div className="grid grid-cols-2 gap-4">
                    <NF label="Capital Needed ($)" field="capital_amount_needed" form={form} set={set} placeholder="500000" />
                    <TF label="Funding Timeline" field="funding_timeline" form={form} set={set} placeholder="Within 6 months" />
                    <div className="col-span-2"><TF label="Use of Funds" field="use_of_funds" form={form} set={set} placeholder="How will capital be deployed?" multi /></div>
                  </div>
                )}
              </div>
            )}

            {step === 8 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Upload key documents to strengthen your profile and AI analysis.</p>
                {[['Pitch Deck','pitch_deck_url'],['Financials','financials_url'],['Strategic Plan','strategic_plan_url'],['School Improvement Plan','school_improvement_plan_url'],['Staffing Plan','staffing_plan_url']].map(([label, field]) => (
                  <div key={field} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <p className="font-bold text-sm text-[#0a0f1e]">{label}</p>
                      {form[field]?<p className="text-xs text-green-600 font-semibold mt-0.5">✓ Uploaded</p>:<p className="text-xs text-gray-400 mt-0.5">Not uploaded</p>}
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" className="hidden" onChange={async e=>{
                        const f=e.target.files[0]; if(!f)return;
                        const {file_url}=await base44.integrations.Core.UploadFile({file:f});
                        set(field,file_url);
                      }} />
                      <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        <Upload className="w-3.5 h-3.5" />{form[field]?'Replace':'Upload'}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button onClick={() => step>0&&setStep(s=>s-1)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all ${step===0?'opacity-0 pointer-events-none':''}`}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-3">
                <button onClick={()=>handleSave(false)} disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all">
                  {saving?'Saving...':'Save'}
                </button>
                {step < STEPS.length-1
                  ? <button onClick={()=>handleSave(true)} disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#0a0f1e] text-white rounded-xl text-sm font-black hover:bg-[#1a2033] transition-all">
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  : <button onClick={()=>handleSave(false)} disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-black hover:bg-green-700 transition-all">
                      <Check className="w-4 h-4" /> Complete
                    </button>
                }
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Completion</p>
          <div className="h-2 bg-gray-100 rounded-full mb-2">
            <div className="h-2 bg-[#0a0f1e] rounded-full transition-all" style={{width:`${school?.xschetails_completion_pct||0}%`}} />
          </div>
          <p className="text-2xl font-black text-[#0a0f1e]">{school?.xschetails_completion_pct||0}%</p>
        </div>
        {school?.ai_summary && (
          <div className="bg-[#0a0f1e] rounded-2xl p-5">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">AI Summary</p>
            <p className="text-white/70 text-xs leading-relaxed">{school.ai_summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}