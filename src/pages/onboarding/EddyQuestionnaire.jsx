import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

const ROLES = [
  'Assistant Principal','Board Member','CAO','CEO','COO','Consultant',
  'Curriculum Designer','Dean','Director','Education Entrepreneur',
  'Executive Director','Founder','Instructional Coach','Investor',
  'Managing Director','Math Coach','Nonprofit Leader','Operations Director',
  'Parent','Principal','Special Education Leader','Superintendent','Teacher','Tutor',
];

const GOALS = [
  'Build a stronger school','Improve classroom management','Improve instruction',
  'Get leadership coaching','Grow my education business','Build a tutoring business',
  'Access professional courses','Join expert cohorts','Improve school operations',
  'Receive AI support','Find tools for teachers','Find tools for parents',
  'Access executive coaching','Explore investment or advisory opportunities',
];

const DASHBOARD_NEEDS = [
  'Courses','Cohorts','Coaching','AI Assistant','Calendar','Messages',
  'School Improvement Tools','Business Growth Tools','Tutoring Tools',
  'Parent Resources','Billing','Organization Management','Profile Completion','Support',
];

const EXPERIENCE_LEVELS = ['Emerging','Developing','Experienced','Advanced','Executive','Expert'];

const ORG_TYPES = [
  'Individual','School','District','Nonprofit','Tutoring Company',
  'Education Startup','Consulting Firm','Investor Group','Other',
];

const BUDGET_RANGES = [
  'Under $25/month','$25–$75/month','$75–$150/month','$150–$250/month',
  'Quote-based organization account','Application-based exclusive account',
];

const STEPS = [
  { id: 'intro', title: 'Meet Eddy' },
  { id: 'identity', title: 'About You' },
  { id: 'role', title: 'Your Role' },
  { id: 'goals', title: 'Your Goals' },
  { id: 'needs', title: 'Dashboard Needs' },
  { id: 'experience', title: 'Experience' },
  { id: 'budget', title: 'Budget' },
];

const EddyAvatar = () => (
  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center flex-shrink-0 shadow-sm">
    <span className="text-white font-black text-base tracking-tight">E</span>
  </div>
);

export default function EddyQuestionnaire() {
  const [stepIdx, setStepIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const { refresh } = useOnboarding();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '', last_name: '', role: '', organization: '',
    country: '', state_region: '',
    goals: [], dashboard_needs: [], experience_level: '', organization_type: '', budget_range: '',
  });

  const step = STEPS[stepIdx];

  const toggleMulti = (field, value) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter(v => v !== value) : [...f[field], value],
    }));
  };

  const canAdvance = () => {
    if (step.id === 'identity') return form.first_name && form.last_name;
    if (step.id === 'role') return form.role;
    if (step.id === 'goals') return form.goals.length > 0;
    if (step.id === 'needs') return form.dashboard_needs.length > 0;
    if (step.id === 'experience') return form.experience_level && form.organization_type;
    if (step.id === 'budget') return form.budget_range;
    return true;
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        first_name: form.first_name,
        last_name: form.last_name,
        role_type: form.role,
        organization_name: form.organization,
        country: form.country,
        state_region: form.state_region,
        goals: form.goals,
        dashboard_needs: form.dashboard_needs,
        experience_level: form.experience_level,
        organization_type: form.organization_type,
        budget_range: form.budget_range,
        questionnaire_completed: true,
      });
      await refresh();
      navigate('/onboarding/recommendation');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {/* Progress bar */}
      <div className="w-full max-w-md mb-10">
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= stepIdx ? 'bg-black' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 font-medium">{stepIdx + 1} of {STEPS.length}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Eddy intro */}
          {step.id === 'intro' && (
            <div className="text-center">
              <EddyAvatar />
              <h1 className="text-3xl font-black text-black mt-6 mb-4 tracking-tight">Hi, I'm Eddy.</h1>
              <p className="text-base text-gray-500 leading-relaxed">
                Welcome to edXponential. I'm your AI learning and leadership guide. I'll ask a few quick questions to understand your goals, recommend the right membership, and build a dashboard tailored to you.
              </p>
            </div>
          )}

          {/* Identity */}
          {step.id === 'identity' && (
            <div>
              <h2 className="text-3xl font-black text-black mb-2 tracking-tight">About You</h2>
              <p className="text-base text-gray-500 mb-8">Let's start with the basics.</p>
              <div className="space-y-5">
                {[['first_name','First Name'],['last_name','Last Name'],['organization','Organization'],['country','Country'],['state_region','State / Region']].map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
                    <input
                      value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder={label}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role */}
          {step.id === 'role' && (
            <div>
              <h2 className="text-3xl font-black text-black mb-2 tracking-tight">Your Role</h2>
              <p className="text-base text-gray-500 mb-8">What best describes your professional role?</p>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white transition-all"
              >
                <option value="">Select your role</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          {/* Goals */}
          {step.id === 'goals' && (
            <div>
              <h2 className="text-3xl font-black text-black mb-2 tracking-tight">Your Goals</h2>
              <p className="text-base text-gray-500 mb-8">Select all that apply.</p>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {GOALS.map(g => (
                  <label key={g} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${form.goals.includes(g) ? 'border-orange-500 bg-orange-50 text-black' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
                    <input type="checkbox" className="hidden" checked={form.goals.includes(g)} onChange={() => toggleMulti('goals', g)} />
                    <div className={`w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all ${form.goals.includes(g) ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                      {form.goals.includes(g) && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="text-sm font-medium">{g}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Dashboard Needs */}
          {step.id === 'needs' && (
            <div>
              <h2 className="text-3xl font-black text-black mb-2 tracking-tight">Dashboard Needs</h2>
              <p className="text-base text-gray-500 mb-8">What tools do you want on your dashboard?</p>
              <div className="grid grid-cols-2 gap-2">
                {DASHBOARD_NEEDS.map(n => (
                  <label key={n} className={`flex items-center gap-2 px-3 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${form.dashboard_needs.includes(n) ? 'border-orange-500 bg-orange-50 text-black' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
                    <input type="checkbox" className="hidden" checked={form.dashboard_needs.includes(n)} onChange={() => toggleMulti('dashboard_needs', n)} />
                    <div className={`w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all ${form.dashboard_needs.includes(n) ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                      {form.dashboard_needs.includes(n) && <svg className="w-2 h-2 text-white" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="text-xs font-medium">{n}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Experience + Org Type */}
          {step.id === 'experience' && (
            <div>
              <h2 className="text-3xl font-black text-black mb-2 tracking-tight">Your Experience</h2>
              <p className="text-base text-gray-500 mb-8">Help us calibrate your experience level.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Experience Level</label>
                  <select value={form.experience_level} onChange={e => setForm(f => ({ ...f, experience_level: e.target.value }))} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white transition-all">
                    <option value="">Select level</option>
                    {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Organization Type</label>
                  <select value={form.organization_type} onChange={e => setForm(f => ({ ...f, organization_type: e.target.value }))} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white transition-all">
                    <option value="">Select type</option>
                    {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Budget */}
          {step.id === 'budget' && (
            <div>
              <h2 className="text-3xl font-black text-black mb-2 tracking-tight">Your Budget</h2>
              <p className="text-base text-gray-500 mb-8">What is your comfortable monthly investment in professional growth?</p>
              <div className="space-y-2">
                {BUDGET_RANGES.map(b => (
                  <label key={b} className={`flex items-center gap-3 px-4 py-4 rounded-xl border cursor-pointer transition-all duration-150 ${form.budget_range === b ? 'border-orange-500 bg-orange-50 text-black' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
                    <input type="radio" className="hidden" checked={form.budget_range === b} onChange={() => setForm(f => ({ ...f, budget_range: b }))} />
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${form.budget_range === b ? 'border-orange-500' : 'border-gray-300'}`}>
                      {form.budget_range === b && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                    </div>
                    <span className="text-sm font-medium">{b}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="w-full max-w-md mt-10 flex gap-3">
        {stepIdx > 0 && (
          <button onClick={() => setStepIdx(i => i - 1)} className="flex items-center gap-2 h-12 px-6 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          disabled={!canAdvance() || saving}
          onClick={stepIdx === STEPS.length - 1 ? handleFinish : () => setStepIdx(i => i + 1)}
          className="flex-1 h-12 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : stepIdx === STEPS.length - 1 ? 'See My Recommendation' : (<>Continue <ChevronRight className="w-4 h-4" /></>)}
        </button>
      </div>
    </div>
  );
}