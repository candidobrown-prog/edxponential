import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight, Upload } from 'lucide-react';

const SUBJECTS = ['Reading', 'Math', 'Writing', 'Science', 'Social Studies', 'ELA', 'Algebra', 'Geometry', 'Chemistry', 'Biology', 'SAT/ACT Prep', 'AP Courses'];
const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SPECIALIZATIONS = ['Reading Intervention', 'Math Intervention', 'Special Education', 'English Language Learners', 'Test Prep', 'Executive Functioning', 'Homework Support'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultForm = {
  full_name: '', bio: '', location: '', city: '', state: '', subjects: [], grade_levels: [],
  teaching_certified: false, years_experience: '', degree: '', credentials: '',
  hourly_rate: '', session_types: [], travel_radius_miles: '', languages: ['English'],
  specializations: [], user_email: ''
};

export default function TutorApply() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (k, v) => set(k, form[k].includes(v) ? form[k].filter(x => x !== v) : [...form[k], v]);

  const handleSubmit = async () => {
    setLoading(true);
    const user = await base44.auth.me();
    await base44.entities.TutorProfile.create({
      ...form,
      years_experience: Number(form.years_experience),
      hourly_rate: Number(form.hourly_rate),
      travel_radius_miles: Number(form.travel_radius_miles) || 0,
      user_email: user.email,
      status: 'pending_review'
    });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
      <p className="text-slate-500 mb-2">Your tutor application has been received and is under review by the TwotrX team.</p>
      <p className="text-sm text-slate-400">You'll receive an email notification once your profile is approved. Background check information will be requested separately.</p>
    </div>
  );

  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5]";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const pillBtn = (arr, k, v) => (
    <button key={v} onClick={() => toggleArr(k, v)}
      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${arr.includes(v) ? 'bg-[#4f46e5] border-[#4f46e5] text-white' : 'border-slate-200 text-slate-600 hover:border-[#4f46e5]'}`}>
      {v}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tutor Application</h1>
        <p className="text-slate-500 mt-1">Apply to join TwotrX as a qualified teacher-tutor.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map(i => (
          <React.Fragment key={i}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? 'bg-[#4f46e5] text-white' : 'bg-slate-100 text-slate-400'}`}>{i}</div>
            {i < 4 && <div className={`flex-1 h-1 rounded-full ${i < step ? 'bg-[#4f46e5]' : 'bg-slate-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-7">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-800">Personal Information</h2>
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>City</label>
                <input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" />
              </div>
              <div>
                <label className={labelCls}>State</label>
                <input className={inputCls} value={form.state} onChange={e => set('state', e.target.value)} placeholder="State" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Bio</label>
              <textarea className={inputCls + " min-h-[90px] resize-none"} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell students and schools about yourself and your teaching philosophy..." />
            </div>
            <div>
              <label className={labelCls}>Degree / Credentials</label>
              <input className={inputCls} value={form.degree} onChange={e => set('degree', e.target.value)} placeholder="e.g. B.Ed., M.A. Education, State Teaching License" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Years of Experience</label>
                <input className={inputCls} type="number" value={form.years_experience} onChange={e => set('years_experience', e.target.value)} placeholder="Years" />
              </div>
              <div>
                <label className={labelCls}>Teaching Certified?</label>
                <select className={inputCls} value={form.teaching_certified} onChange={e => set('teaching_certified', e.target.value === 'true')}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-800">Teaching Expertise</h2>
            <div>
              <label className={labelCls}>Subjects You Teach *</label>
              <div className="flex flex-wrap gap-2 mt-1">{SUBJECTS.map(s => pillBtn(form.subjects, 'subjects', s))}</div>
            </div>
            <div>
              <label className={labelCls}>Grade Levels You Serve *</label>
              <div className="flex flex-wrap gap-2 mt-1">{GRADES.map(g => pillBtn(form.grade_levels, 'grade_levels', g))}</div>
            </div>
            <div>
              <label className={labelCls}>Specializations</label>
              <div className="flex flex-wrap gap-2 mt-1">{SPECIALIZATIONS.map(s => pillBtn(form.specializations, 'specializations', s))}</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-800">Session Preferences & Rates</h2>
            <div>
              <label className={labelCls}>Session Types Offered *</label>
              <div className="flex gap-3">
                {['virtual', 'in_person', 'hybrid'].map(t => (
                  <button key={t} onClick={() => toggleArr('session_types', t)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${form.session_types.includes(t) ? 'bg-[#4f46e5] border-[#4f46e5] text-white' : 'border-slate-200 text-slate-600 hover:border-[#4f46e5]'}`}>
                    {t.replace('_', '-')}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Hourly Rate ($)</label>
                <input className={inputCls} type="number" value={form.hourly_rate} onChange={e => set('hourly_rate', e.target.value)} placeholder="e.g. 65" />
              </div>
              <div>
                <label className={labelCls}>Travel Radius (miles)</label>
                <input className={inputCls} type="number" value={form.travel_radius_miles} onChange={e => set('travel_radius_miles', e.target.value)} placeholder="0 if virtual only" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Available Days</label>
              <div className="flex flex-wrap gap-2">{DAYS.map(d => pillBtn(form.grade_levels, 'preferred_days', d))}</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-slate-800">Final Review & Submission</h2>
            <div className="bg-[#f8f9fb] rounded-xl p-5 border border-slate-100 space-y-3 text-sm">
              {[
                ['Name', form.full_name],
                ['Location', [form.city, form.state].filter(Boolean).join(', ')],
                ['Subjects', form.subjects.join(', ')],
                ['Grade Levels', form.grade_levels.join(', ')],
                ['Session Types', form.session_types.map(t => t.replace('_', '-')).join(', ')],
                ['Hourly Rate', form.hourly_rate ? `$${form.hourly_rate}/hr` : ''],
                ['Experience', form.years_experience ? `${form.years_experience} years` : ''],
                ['Certified', form.teaching_certified ? 'Yes' : 'No'],
              ].map(([k, v]) => v ? (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-slate-800 text-right max-w-[60%]">{v}</span>
                </div>
              ) : null)}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">What happens next?</p>
              <ul className="space-y-1 text-amber-700 list-disc list-inside">
                <li>TwotrX admin will review your application</li>
                <li>A background check request will be sent to you</li>
                <li>Once approved, your profile goes live in the marketplace</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep(s => s + 1)} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}