import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────

const ROLES = [
  'School Principal / Leader',
  'Classroom Teacher',
  'School Founder / Entrepreneur',
  'Tutor / Educational Consultant',
  'District Administrator',
  'Investor / Philanthropist',
  'Nonprofit Leader',
  'Executive / C-Suite',
  'Instructional Coach',
  'Parent',
  'Other',
];

const GOALS = [
  'Build a stronger school',
  'Improve instruction',
  'Get leadership coaching',
  'Grow my education business',
  'Build a tutoring business',
  'Access professional courses',
  'Join expert cohorts',
  'Improve school operations',
  'Receive AI support',
  'Find tools for teachers',
  'Find tools for parents',
  'Explore investment opportunities',
];

const DASHBOARD_NEEDS = [
  'Courses',
  'Coaching',
  'AI Assistant',
  'School Improvement Tools',
  'Business Growth Tools',
  'Tutoring Tools',
  'Parent Resources',
  'Analytics',
  'Community',
  'Calendar',
  'Billing',
  'Support',
];

const EXPERIENCE_LEVELS = [
  'Emerging (0–2 years)',
  'Developing (3–5 years)',
  'Experienced (6–10 years)',
  'Advanced (11–15 years)',
  'Executive (16–20 years)',
  'Expert (20+ years)',
];

const ORG_TYPES = [
  'Individual',
  'School',
  'District',
  'Nonprofit',
  'Tutoring Company',
  'Education Startup',
  'Consulting Firm',
  'Investor Group',
  'Other',
];

const BUDGET_RANGES = [
  'Under $25 / month',
  '$25 – $75 / month',
  '$75 – $150 / month',
  '$150 – $250 / month',
  'Organization account (quote-based)',
  'Exclusive application-based account',
];

const STEPS = [
  { id: 'intro',      label: 'Welcome' },
  { id: 'identity',   label: 'About You' },
  { id: 'role',       label: 'Your Role' },
  { id: 'goals',      label: 'Goals' },
  { id: 'needs',      label: 'Dashboard' },
  { id: 'experience', label: 'Experience' },
  { id: 'budget',     label: 'Budget' },
];

// ── Option card (single / multi select) ───────────────────────────────────────

function OptionCard({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-between w-full px-5 py-4 rounded-2xl border text-left transition-all duration-150 focus:outline-none
        ${selected
          ? 'border-black bg-white shadow-[0_0_0_2px_black]'
          : 'border-gray-200 bg-white hover:border-gray-400'
        }`}
    >
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      {selected && (
        <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 ml-3">
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 9" fill="none">
            <path d="M1 4.5l3.5 3.5 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function EddyQuestionnaire() {
  const [stepIdx, setStepIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const { refresh } = useOnboarding();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '', last_name: '', organization: '', country: '', state_region: '',
    role: '',
    goals: [],
    dashboard_needs: [],
    experience_level: '',
    organization_type: '',
    budget_range: '',
  });

  const step = STEPS[stepIdx];

  const toggle = (field, value) =>
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter(v => v !== value) : [...f[field], value],
    }));

  const setSingle = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const canAdvance = () => {
    if (step.id === 'identity')   return form.first_name.trim() && form.last_name.trim();
    if (step.id === 'role')       return !!form.role;
    if (step.id === 'goals')      return form.goals.length > 0;
    if (step.id === 'needs')      return form.dashboard_needs.length > 0;
    if (step.id === 'experience') return !!form.experience_level && !!form.organization_type;
    if (step.id === 'budget')     return !!form.budget_range;
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

  const isLast = stepIdx === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Progress bar ── */}
      <div className="px-8 pt-8 pb-0">
        <div className="flex gap-1.5 mb-2">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= stepIdx ? 'bg-black' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-gray-400">{stepIdx + 1} of {STEPS.length}</p>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-8 pt-10 pb-32 max-w-2xl w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {/* ── Intro ── */}
            {step.id === 'intro' && (
              <div className="text-center pt-8">
                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <span className="text-white font-black text-lg tracking-tight">E</span>
                </div>
                <h1 className="text-4xl font-black text-black tracking-tight mb-5">Hi, I'm Eddy.</h1>
                <p className="text-lg text-gray-500 leading-relaxed max-w-sm mx-auto">
                  Welcome to edXponential. I'm your AI learning and leadership guide. I'll ask a few quick questions to understand your goals, recommend the right membership, and build a dashboard tailored to you.
                </p>
              </div>
            )}

            {/* ── Identity ── */}
            {step.id === 'identity' && (
              <div>
                <h2 className="text-4xl font-black text-black tracking-tight mb-2">Tell us about yourself.</h2>
                <p className="text-base text-gray-400 mb-8">We'll use this to personalize your experience.</p>
                <div className="space-y-4">
                  {[
                    ['first_name', 'First Name'],
                    ['last_name', 'Last Name'],
                    ['organization', 'Organization'],
                    ['country', 'Country'],
                    ['state_region', 'State / Region'],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
                      <input
                        value={form[field]}
                        onChange={e => setSingle(field, e.target.value)}
                        placeholder={label}
                        className="w-full h-12 px-4 rounded-2xl border border-gray-200 text-sm font-medium text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Role ── */}
            {step.id === 'role' && (
              <div>
                <h2 className="text-4xl font-black text-black tracking-tight mb-2">What best describes your role?</h2>
                <p className="text-base text-gray-400 mb-8">Select one that fits best.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map(r => (
                    <OptionCard key={r} label={r} selected={form.role === r} onClick={() => setSingle('role', r)} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Goals ── */}
            {step.id === 'goals' && (
              <div>
                <h2 className="text-4xl font-black text-black tracking-tight mb-2">What are your goals?</h2>
                <p className="text-base text-gray-400 mb-8">Select all that apply.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOALS.map(g => (
                    <OptionCard key={g} label={g} selected={form.goals.includes(g)} onClick={() => toggle('goals', g)} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Dashboard Needs ── */}
            {step.id === 'needs' && (
              <div>
                <h2 className="text-4xl font-black text-black tracking-tight mb-2">What do you need on your dashboard?</h2>
                <p className="text-base text-gray-400 mb-8">Select all that apply.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DASHBOARD_NEEDS.map(n => (
                    <OptionCard key={n} label={n} selected={form.dashboard_needs.includes(n)} onClick={() => toggle('dashboard_needs', n)} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Experience ── */}
            {step.id === 'experience' && (
              <div>
                <h2 className="text-4xl font-black text-black tracking-tight mb-2">Your experience level.</h2>
                <p className="text-base text-gray-400 mb-8">Help us calibrate your learning path.</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Experience Level</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {EXPERIENCE_LEVELS.map(l => (
                        <OptionCard key={l} label={l} selected={form.experience_level === l} onClick={() => setSingle('experience_level', l)} />
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Organization Type</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ORG_TYPES.map(t => (
                        <OptionCard key={t} label={t} selected={form.organization_type === t} onClick={() => setSingle('organization_type', t)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Budget ── */}
            {step.id === 'budget' && (
              <div>
                <h2 className="text-4xl font-black text-black tracking-tight mb-2">What is your monthly budget?</h2>
                <p className="text-base text-gray-400 mb-8">Your comfortable investment in professional growth.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUDGET_RANGES.map(b => (
                    <OptionCard key={b} label={b} selected={form.budget_range === b} onClick={() => setSingle('budget_range', b)} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Fixed bottom nav ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-5 flex items-center justify-between max-w-2xl mx-auto w-full" style={{ left: '50%', transform: 'translateX(-50%)', maxWidth: '42rem' }}>
        {stepIdx > 0 ? (
          <button
            onClick={() => setStepIdx(i => i - 1)}
            className="text-sm font-semibold text-gray-400 hover:text-black transition-colors"
          >
            Back
          </button>
        ) : <div />}

        <button
          disabled={!canAdvance() || saving}
          onClick={isLast ? handleFinish : () => setStepIdx(i => i + 1)}
          className="flex items-center gap-2 h-12 px-8 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>{isLast ? 'See My Recommendation' : 'Next'} <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}