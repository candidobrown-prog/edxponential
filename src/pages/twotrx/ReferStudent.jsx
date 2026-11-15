import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const SUBJECTS = ['Reading', 'Math', 'Writing', 'Science', 'Social Studies', 'ELA', 'Algebra', 'Geometry', 'SAT/ACT Prep', 'Other'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const defaultForm = {
  student_name: '', grade: '', subject_needed: '', performance_level: '', learning_gaps: '',
  strengths: '', goals: '', iep_504: 'none', session_type: 'virtual', preferred_days: [],
  urgency: 'medium', parent_name: '', parent_email: '', parent_phone: '', school_notes: '',
  school_name: '', referral_source: 'school'
};

export default function ReferStudent() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleDay = d => set('preferred_days', form.preferred_days.includes(d) ? form.preferred_days.filter(x => x !== d) : [...form.preferred_days, d]);

  const handleSubmit = async () => {
    setLoading(true);
    const user = await base44.auth.me();
    await base44.entities.TutoringStudent.create({ ...form, grade: Number(form.grade), referred_by_email: user.email });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Referral Submitted</h2>
      <p className="text-slate-500 mb-6">The student has been added to the TwotrX support pipeline. A qualified tutor will be matched based on their needs.</p>
      <Button onClick={() => { setSubmitted(false); setForm(defaultForm); setStep(1); }} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">Refer Another Student</Button>
    </div>
  );

  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5]";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Learning Support Request</h1>
        <p className="text-slate-500 mt-1">Recommend a student for targeted academic support through TwotrX.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <React.Fragment key={i}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? 'bg-[#4f46e5] text-white' : 'bg-slate-100 text-slate-400'}`}>{i}</div>
            {i < 3 && <div className={`flex-1 h-1 rounded-full ${i < step ? 'bg-[#4f46e5]' : 'bg-slate-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-7">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-800 mb-1">Student Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Student Name *</label>
                <input className={inputCls} value={form.student_name} onChange={e => set('student_name', e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className={labelCls}>Grade Level *</label>
                <select className={inputCls} value={form.grade} onChange={e => set('grade', e.target.value)}>
                  <option value="">Select grade</option>
                  {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Grade {i+1}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>School Name</label>
              <input className={inputCls} value={form.school_name} onChange={e => set('school_name', e.target.value)} placeholder="School name" />
            </div>
            <div>
              <label className={labelCls}>Subject Area *</label>
              <select className={inputCls} value={form.subject_needed} onChange={e => set('subject_needed', e.target.value)}>
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Current Performance Level</label>
              <select className={inputCls} value={form.performance_level} onChange={e => set('performance_level', e.target.value)}>
                <option value="">Select level</option>
                <option value="below_grade">Below Grade Level</option>
                <option value="on_grade">On Grade Level</option>
                <option value="above_grade">Above Grade Level</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>IEP / 504 Status</label>
              <select className={inputCls} value={form.iep_504} onChange={e => set('iep_504', e.target.value)}>
                <option value="none">None</option>
                <option value="iep">IEP</option>
                <option value="504">504 Plan</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-800 mb-1">Learning Profile & Schedule</h2>
            <div>
              <label className={labelCls}>Specific Learning Gaps</label>
              <textarea className={inputCls + " min-h-[80px] resize-none"} value={form.learning_gaps} onChange={e => set('learning_gaps', e.target.value)} placeholder="Describe specific gaps or challenges..." />
            </div>
            <div>
              <label className={labelCls}>Student Strengths</label>
              <textarea className={inputCls + " min-h-[70px] resize-none"} value={form.strengths} onChange={e => set('strengths', e.target.value)} placeholder="What does the student do well?" />
            </div>
            <div>
              <label className={labelCls}>Learning Goals</label>
              <textarea className={inputCls + " min-h-[70px] resize-none"} value={form.goals} onChange={e => set('goals', e.target.value)} placeholder="What should the student achieve?" />
            </div>
            <div>
              <label className={labelCls}>Preferred Tutoring Type</label>
              <div className="flex gap-3">
                {['virtual', 'in_person', 'hybrid'].map(t => (
                  <button key={t} onClick={() => set('session_type', t)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all capitalize ${form.session_type === t ? 'bg-[#4f46e5] border-[#4f46e5] text-white' : 'border-slate-200 text-slate-600 hover:border-[#4f46e5]'}`}>
                    {t.replace('_', '-')}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Preferred Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(d => (
                  <button key={d} onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${form.preferred_days.includes(d) ? 'bg-[#4f46e5] border-[#4f46e5] text-white' : 'border-slate-200 text-slate-600 hover:border-[#4f46e5]'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Urgency Level</label>
              <div className="flex gap-3">
                {['low', 'medium', 'high', 'urgent'].map(u => (
                  <button key={u} onClick={() => set('urgency', u)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all capitalize ${form.urgency === u ? 'bg-[#4f46e5] border-[#4f46e5] text-white' : 'border-slate-200 text-slate-600 hover:border-[#4f46e5]'}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-800 mb-1">Parent / Guardian Contact & Notes</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Parent / Guardian Name</label>
                <input className={inputCls} value={form.parent_name} onChange={e => set('parent_name', e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className={labelCls}>Parent Phone</label>
                <input className={inputCls} value={form.parent_phone} onChange={e => set('parent_phone', e.target.value)} placeholder="(555) 000-0000" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Parent Email</label>
              <input className={inputCls} type="email" value={form.parent_email} onChange={e => set('parent_email', e.target.value)} placeholder="parent@email.com" />
            </div>
            <div>
              <label className={labelCls}>Notes from Teacher or School Leader</label>
              <textarea className={inputCls + " min-h-[100px] resize-none"} value={form.school_notes} onChange={e => set('school_notes', e.target.value)} placeholder="Additional context for the tutor..." />
            </div>
            {/* Review */}
            <div className="bg-[#f8f9fb] rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Summary</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[['Student', form.student_name], ['Grade', form.grade && `Grade ${form.grade}`], ['Subject', form.subject_needed], ['Urgency', form.urgency], ['Session Type', form.session_type?.replace('_', '-')], ['Parent', form.parent_name]].map(([k, v]) => v ? (
                  <div key={k}><span className="text-slate-500">{k}: </span><span className="font-medium text-slate-800">{v}</span></div>
                ) : null)}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={step === 1 && (!form.student_name || !form.grade || !form.subject_needed)} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">
              {loading ? 'Submitting...' : 'Submit Referral'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}