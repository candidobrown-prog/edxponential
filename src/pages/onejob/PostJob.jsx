import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, Upload } from 'lucide-react';

const STEPS = ['Job Details', 'Description', 'Requirements', 'Pricing & Publish'];

const defaultForm = {
  job_title: '', organization_name: '', school_name: '', location: '', city: '', state: '',
  work_type: 'in_person', employment_type: 'full_time', salary_min: '', salary_max: '',
  salary_display: '', description: '', responsibilities: '', required_qualifications: '',
  preferred_qualifications: '', application_deadline: '', start_date: '', how_to_apply: '',
  contact_person: '', contact_email: '', role_category: 'teaching', tier: 'standard', grade_levels: [], subjects: []
};

const TIERS = [
  { key: 'standard', label: 'Standard', price: 199, days: 30, features: ['30-day listing', 'Standard visibility', 'Applicant collection', 'Basic dashboard', 'Email notifications'] },
  { key: 'featured', label: 'Featured', price: 499, days: 45, features: ['45-day listing', 'Featured placement', 'Highlighted card', 'Priority search', 'Applicant tracking', 'Email promotion'], highlight: true },
  { key: 'executive', label: 'Executive', price: 999, days: 60, features: ['60-day premium listing', 'Top placement', 'Executive talent search', 'Candidate recommendations', 'Priority support', 'Social media promotion', 'Intro requests'] },
];

export default function PostJob() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 focus:border-[#0a0f1e]";
  const lbl = "block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest";
  const textarea = inp + " min-h-[100px] resize-none";

  const handleSubmit = async () => {
    setLoading(true);
    const user = await base44.auth.me();
    const tierInfo = TIERS.find(t => t.key === form.tier);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + tierInfo.days);
    await base44.entities.JobPost.create({
      ...form,
      salary_min: form.salary_min ? Number(form.salary_min) : undefined,
      salary_max: form.salary_max ? Number(form.salary_max) : undefined,
      salary_display: form.salary_display || (form.salary_min && form.salary_max ? `$${Number(form.salary_min).toLocaleString()} – $${Number(form.salary_max).toLocaleString()}` : ''),
      employer_email: user.email,
      payment_amount: tierInfo.price,
      status: 'pending_payment',
      payment_status: 'unpaid',
      expires_at: expiresAt.toISOString().split('T')[0],
      featured: form.tier === 'featured' || form.tier === 'executive',
    });
    setDone(true);
    setLoading(false);
  };

  if (done) return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="max-w-md text-center bg-white rounded-2xl border border-gray-100 p-10">
        <div className="w-16 h-16 bg-[#0a0f1e] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-[#0a0f1e] mb-2">Job Submitted!</h2>
        <p className="text-gray-500 mb-2">Your job post has been submitted and is pending payment review.</p>
        <p className="text-sm text-gray-400 mb-6">Once payment is confirmed, your listing will go live within 24 hours.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate('/onejob/employer')} className="bg-[#0a0f1e] text-white font-bold">Go to Dashboard</Button>
          <Button variant="outline" onClick={() => { setDone(false); setStep(0); setForm(defaultForm); }}>Post Another</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">OneJob</p>
          <h1 className="text-3xl font-black text-white">Post a Job</h1>
          <div className="flex items-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${i <= step ? 'text-white' : 'text-white/30'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${i < step ? 'bg-white text-[#0a0f1e]' : i === step ? 'bg-white/20 text-white border border-white/30' : 'bg-white/10'}`}>
                    {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-xs font-bold hidden md:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-white/40' : 'bg-white/10'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-black text-xl text-[#0a0f1e] mb-1">Job Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className={lbl}>Job Title *</label><input className={inp} value={form.job_title} onChange={e => set('job_title', e.target.value)} placeholder="e.g. Principal, 5th Grade Math Teacher" /></div>
                <div><label className={lbl}>Organization Name *</label><input className={inp} value={form.organization_name} onChange={e => set('organization_name', e.target.value)} placeholder="Organization" /></div>
                <div><label className={lbl}>School Name</label><input className={inp} value={form.school_name} onChange={e => set('school_name', e.target.value)} placeholder="School name (if applicable)" /></div>
                <div><label className={lbl}>City</label><input className={inp} value={form.city} onChange={e => set('city', e.target.value)} /></div>
                <div><label className={lbl}>State</label><input className={inp} value={form.state} onChange={e => set('state', e.target.value)} /></div>
                <div>
                  <label className={lbl}>Work Type</label>
                  <select className={inp} value={form.work_type} onChange={e => set('work_type', e.target.value)}>
                    <option value="in_person">In Person</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Employment Type</label>
                  <select className={inp} value={form.employment_type} onChange={e => set('employment_type', e.target.value)}>
                    <option value="full_time">Full Time</option><option value="part_time">Part Time</option><option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Role Category</label>
                  <select className={inp} value={form.role_category} onChange={e => set('role_category', e.target.value)}>
                    {['teaching', 'leadership', 'executive', 'operations', 'edtech', 'special_ed', 'counseling', 'other'].map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Salary Display</label>
                  <input className={inp} value={form.salary_display} onChange={e => set('salary_display', e.target.value)} placeholder="e.g. $65,000 – $85,000 / yr" />
                </div>
                <div><label className={lbl}>Application Deadline</label><input type="date" className={inp} value={form.application_deadline} onChange={e => set('application_deadline', e.target.value)} /></div>
                <div><label className={lbl}>Start Date</label><input type="date" className={inp} value={form.start_date} onChange={e => set('start_date', e.target.value)} /></div>
                <div><label className={lbl}>Contact Person</label><input className={inp} value={form.contact_person} onChange={e => set('contact_person', e.target.value)} /></div>
                <div><label className={lbl}>Contact Email</label><input type="email" className={inp} value={form.contact_email} onChange={e => set('contact_email', e.target.value)} /></div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-black text-xl text-[#0a0f1e] mb-1">Job Description</h2>
              <div><label className={lbl}>Job Description *</label><textarea className={textarea + " min-h-[150px]"} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe this opportunity, the organization, and what makes it exciting..." /></div>
              <div><label className={lbl}>Responsibilities</label><textarea className={textarea} value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)} placeholder="List the key responsibilities of this role..." /></div>
              <div><label className={lbl}>How to Apply</label><textarea className={inp + " min-h-[80px] resize-none"} value={form.how_to_apply} onChange={e => set('how_to_apply', e.target.value)} placeholder="Instructions for applicants..." /></div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-black text-xl text-[#0a0f1e] mb-1">Qualifications</h2>
              <div><label className={lbl}>Required Qualifications</label><textarea className={textarea} value={form.required_qualifications} onChange={e => set('required_qualifications', e.target.value)} placeholder="Must-have qualifications..." /></div>
              <div><label className={lbl}>Preferred Qualifications</label><textarea className={textarea} value={form.preferred_qualifications} onChange={e => set('preferred_qualifications', e.target.value)} placeholder="Nice-to-have qualifications..." /></div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-black text-xl text-[#0a0f1e]">Select a Pricing Tier</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {TIERS.map(tier => (
                  <div key={tier.key} onClick={() => set('tier', tier.key)}
                    className={`rounded-2xl border-2 p-5 cursor-pointer transition-all ${form.tier === tier.key ? 'border-[#0a0f1e] bg-[#0a0f1e] text-white' : tier.highlight ? 'border-gray-300 hover:border-[#0a0f1e]' : 'border-gray-100 hover:border-gray-300'}`}>
                    <p className={`font-black text-sm uppercase tracking-wider ${form.tier === tier.key ? 'text-white/60' : 'text-gray-400'}`}>{tier.label}</p>
                    <p className={`text-3xl font-black mt-1 ${form.tier === tier.key ? 'text-white' : 'text-[#0a0f1e]'}`}>${tier.price}</p>
                    <p className={`text-xs mt-0.5 ${form.tier === tier.key ? 'text-white/50' : 'text-gray-400'}`}>{tier.days}-day listing</p>
                    <ul className="mt-4 space-y-1.5">
                      {tier.features.map(f => <li key={f} className={`text-xs flex items-start gap-1.5 ${form.tier === tier.key ? 'text-white/80' : 'text-gray-500'}`}><CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Payment</p>
                <p className="text-sm text-gray-600">Payment is processed securely via Stripe. Your job post will go live within 24 hours of payment confirmation.</p>
                <p className="text-xs text-gray-400 mt-1">Accepts: Visa, Mastercard, Amex, ACH / Bank Transfer, Invoice billing for organizations.</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-2 font-bold">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.job_title} className="bg-[#0a0f1e] text-white font-black gap-2">
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="bg-[#0a0f1e] text-white font-black px-8">
                {loading ? 'Submitting...' : `Submit & Pay $${TIERS.find(t => t.key === form.tier)?.price}`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}