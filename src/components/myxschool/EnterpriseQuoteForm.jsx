import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 focus:border-[#0a0f1e] bg-white transition-all";
const lbl = "block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest";

const SERVICES = ['Leadership coaching','Staff access','School dashboards','Xscores','Xschetails','TwotrX tutoring','OneJob hiring','edXportante content','Pitch Park funding','edVestor access','AI matching','Custom reporting','Professional development','Data dashboards','Enterprise integrations'];
const TECH = ['Google Workspace','Microsoft 365','Zoom','Slack','SIS integration','Data upload support','Custom dashboards','SSO / Single Sign-On'];
const BUDGET_RANGES = ['Under $5,000','$5,000–$15,000','$15,000–$50,000','$50,000–$100,000','$100,000+','Prefer not to say'];

export default function EnterpriseQuoteForm({ user, school }) {
  const [form, setForm] = useState({
    full_name: user?.full_name || '', title: '', phone: '', organization_name: school?.school_name || '',
    school_network_name: '', website: school?.website || '', org_type: '', num_schools: '', num_students: '',
    num_staff_users: '', grades_served: school?.grades_served || '', city: school?.city || '', state: school?.state || '',
    services_needed: [], tech_needs: [], budget_range: '', desired_start_date: '', contract_length: '',
    urgency_level: '', problem_statement: '', desired_outcomes: '', additional_notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(f => ({...f,[k]:v}));
  const toggleArr = (k, v) => set(k, form[k].includes(v) ? form[k].filter(x=>x!==v) : [...form[k], v]);

  const handleSubmit = async () => {
    setSubmitting(true);
    await base44.entities.EnterpriseQuote.create({ ...form, submitter_email: user.email, num_schools: Number(form.num_schools)||null, num_students: Number(form.num_students)||null, num_staff_users: Number(form.num_staff_users)||null, status: 'new' });
    await base44.integrations.Core.SendEmail({ to: user.email, subject: 'Enterprise Quote Request Received — edXponential', body: `Thank you ${form.full_name}! We've received your enterprise quote request for ${form.organization_name}. Our team will review and respond within 1-2 business days.\n\nYour account manager will be in touch shortly.\n\n— The edXponential Team` });
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-black text-[#0a0f1e] mb-2">Quote Request Submitted</h2>
      <p className="text-gray-400 text-sm max-w-sm mx-auto">We've received your enterprise request for <strong>{form.organization_name}</strong>. A confirmation was sent to {user?.email}. Our team will respond within 1–2 business days.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#0a0f1e] rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-white/50" />
          <div>
            <p className="text-white font-black">Enterprise Package</p>
            <p className="text-white/40 text-sm">Custom pricing for networks, districts, and multi-site schools needing 10+ users, custom dashboards, and premium support.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-7 space-y-6">
        {/* Contact */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">A. Contact Information</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Full Name *</label><input className={inp} value={form.full_name} onChange={e=>set('full_name',e.target.value)} /></div>
            <div><label className={lbl}>Title</label><input className={inp} placeholder="CEO, Principal, Superintendent" value={form.title} onChange={e=>set('title',e.target.value)} /></div>
            <div><label className={lbl}>Email</label><input className={inp} value={user?.email||''} readOnly /></div>
            <div><label className={lbl}>Phone</label><input className={inp} placeholder="(555) 000-0000" value={form.phone} onChange={e=>set('phone',e.target.value)} /></div>
            <div><label className={lbl}>Organization Name *</label><input className={inp} value={form.organization_name} onChange={e=>set('organization_name',e.target.value)} /></div>
            <div><label className={lbl}>Website</label><input className={inp} value={form.website} onChange={e=>set('website',e.target.value)} /></div>
          </div>
        </div>

        {/* Org Details */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">B. Organization Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={lbl}>Organization Type</label>
              <select className={inp} value={form.org_type} onChange={e=>set('org_type',e.target.value)}>
                <option value="">Select...</option>
                {['single_school','charter_network','district','private_school_network','nonprofit','education_company','other'].map(o=><option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            <div><label className={lbl}>Number of Schools</label><input type="number" className={inp} value={form.num_schools} onChange={e=>set('num_schools',e.target.value)} /></div>
            <div><label className={lbl}>Students Served</label><input type="number" className={inp} value={form.num_students} onChange={e=>set('num_students',e.target.value)} /></div>
            <div><label className={lbl}>Staff Users Needed</label><input type="number" className={inp} value={form.num_staff_users} onChange={e=>set('num_staff_users',e.target.value)} /></div>
            <div><label className={lbl}>Grades Served</label><input className={inp} value={form.grades_served} onChange={e=>set('grades_served',e.target.value)} /></div>
            <div><label className={lbl}>City</label><input className={inp} value={form.city} onChange={e=>set('city',e.target.value)} /></div>
            <div><label className={lbl}>State</label><input className={inp} value={form.state} onChange={e=>set('state',e.target.value)} /></div>
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">C. Services Needed</p>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map(s=>{const a=form.services_needed.includes(s); return(
              <button key={s} onClick={()=>toggleArr('services_needed',s)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${a?'bg-[#0a0f1e] text-white border-[#0a0f1e]':'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{s}</button>
            );})}
          </div>
        </div>

        {/* Tech */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">D. Technical Needs</p>
          <div className="flex flex-wrap gap-2">
            {TECH.map(t=>{const a=form.tech_needs.includes(t); return(
              <button key={t} onClick={()=>toggleArr('tech_needs',t)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${a?'bg-[#0a0f1e] text-white border-[#0a0f1e]':'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{t}</button>
            );})}
          </div>
        </div>

        {/* Budget */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">E. Budget + Timeline</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={lbl}>Estimated Budget</label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_RANGES.map(b=>{const a=form.budget_range===b; return(
                  <button key={b} onClick={()=>set('budget_range',b)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${a?'bg-[#0a0f1e] text-white border-[#0a0f1e]':'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{b}</button>
                );})}
              </div>
            </div>
            <div><label className={lbl}>Desired Start Date</label><input type="date" className={inp} value={form.desired_start_date} onChange={e=>set('desired_start_date',e.target.value)} /></div>
            <div><label className={lbl}>Contract Interest</label>
              <select className={inp} value={form.contract_length} onChange={e=>set('contract_length',e.target.value)}>
                <option value="">Select...</option>
                {['monthly','6_months','12_months','multi_year'].map(o=><option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className={lbl}>Urgency</label>
              <select className={inp} value={form.urgency_level} onChange={e=>set('urgency_level',e.target.value)}>
                <option value="">Select...</option>
                {['low','medium','high','urgent'].map(o=><option key={o} value={o} className="capitalize">{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">F. Notes</p>
          <div className="space-y-4">
            <div><label className={lbl}>What problem are you trying to solve?</label><textarea className={inp+" min-h-[80px] resize-none"} value={form.problem_statement} onChange={e=>set('problem_statement',e.target.value)} /></div>
            <div><label className={lbl}>What outcomes do you need?</label><textarea className={inp+" min-h-[80px] resize-none"} value={form.desired_outcomes} onChange={e=>set('desired_outcomes',e.target.value)} /></div>
            <div><label className={lbl}>Additional Notes</label><textarea className={inp+" min-h-[60px] resize-none"} value={form.additional_notes} onChange={e=>set('additional_notes',e.target.value)} /></div>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={submitting||!form.full_name||!form.organization_name}
          className="w-full py-4 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all flex items-center justify-center gap-2 disabled:opacity-40">
          {submitting?'Submitting...':'Submit Enterprise Quote Request'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}