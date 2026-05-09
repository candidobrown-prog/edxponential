import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles, Crown, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';

const ROLES = [
  'School Founder', 'Charter School Founder', 'Principal', 'Assistant Principal',
  'Executive Director', 'Teacher', 'Instructional Coach', 'Consultant',
  'Investor', 'Board Member', 'Tutor', 'Student', 'Parent',
  'District Leader', 'Education Entrepreneur', 'Curriculum Designer',
  'Course Creator', 'Community Builder', 'Recruiter', 'Job Seeker',
  'Nonprofit Leader', 'Other'
];

const GOALS = [
  'Build a school', 'Launch a charter school', 'Hire educators', 'Find a job',
  'Create courses', 'Sell products', 'Raise funding', 'Find investors',
  'Network with leaders', 'Join a leadership community', 'Receive coaching',
  'Offer coaching', 'Find tutors', 'Build influence', 'Access AI tools',
  'Attend events', 'Join masterminds', 'Grow professionally', 'Build a brand',
  'Improve instruction', 'Access school resources'
];

const EXPERIENCE = [
  { id: 'starting', label: 'Just getting started', sub: 'New to education leadership' },
  { id: 'emerging', label: 'Emerging leader', sub: '1–3 years in leadership' },
  { id: 'experienced', label: 'Experienced professional', sub: '4–10 years of experience' },
  { id: 'senior', label: 'Senior executive', sub: '10+ years, C-suite level' },
  { id: 'founder', label: 'Founder / CEO', sub: 'Running or building an organization' },
  { id: 'veteran', label: 'Veteran operator', sub: 'Scaled multiple institutions' },
];

const TEAM_SIZE = [
  { id: 'solo', label: 'Just me', sub: 'Individual access' },
  { id: 'small', label: 'Small team', sub: '2–10 people' },
  { id: 'school', label: 'Entire school', sub: 'School-wide deployment' },
  { id: 'network', label: 'Multi-school network', sub: 'Multiple campuses' },
  { id: 'org', label: 'Organization / Company', sub: 'District or enterprise' },
];

const INVESTMENT = [
  { id: 'free', label: 'Free resources only', sub: 'Just exploring for now' },
  { id: 'budget', label: 'Budget-conscious', sub: 'Practical, affordable options' },
  { id: 'invest', label: 'Ready to invest in growth', sub: 'Serious about results' },
  { id: 'premium', label: 'Looking for premium access', sub: 'Full platform power' },
  { id: 'elite', label: 'Elite concierge support', sub: 'Highest tier, personal service' },
];

const MEMBERSHIP_MAP = {
  free: { name: 'Explorer', price: '$0', path: '/pricing', color: 'border-white/15' },
  principal: { name: 'Principal Park™', price: '$49/mo', path: '/pricing', color: 'border-white/15' },
  founders: { name: 'Founders Sphere™', price: '$149/mo', path: '/pricing', color: 'border-white/25' },
  exec: { name: 'Executive Entourage™', price: '$299/mo', path: '/pricing', color: 'border-white/20' },
};

const STEPS = ['Welcome', 'Your Role', 'Your Goals', 'Experience', 'Team', 'Investment', 'Recommendation'];

export default function AIOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    role: null,
    goals: [],
    experience: null,
    team: null,
    investment: null,
  });
  const [recommendation, setRecommendation] = useState(null);

  const progress = step / (STEPS.length - 1);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const toggleGoal = (g) => {
    setAnswers(a => ({
      ...a,
      goals: a.goals.includes(g) ? a.goals.filter(x => x !== g) : [...a.goals, g]
    }));
  };

  const generateRecommendation = async () => {
    setLoading(true);
    const prompt = `You are an AI membership advisor for edXponential, an elite education leadership platform.

A user has completed an onboarding quiz. Analyze their profile and recommend the perfect membership tier.

User Profile:
- Role: ${answers.role}
- Goals: ${answers.goals.join(', ')}
- Experience: ${answers.experience}
- Team size: ${answers.team}
- Investment readiness: ${answers.investment}

Available tiers:
1. Explorer (Free) - basic resources, read-only community
2. Principal Park™ ($49/mo) - school leader tools, Xschores, dashboards, community
3. Founders Sphere™ ($149/mo) - charter builder, investor access, board tools, masterminds
4. Executive Entourage™ ($299/mo) - 1:1 coaching, elite community, priority AI, account manager

Return a JSON object with:
{
  "tier": "free" | "principal" | "founders" | "exec",
  "headline": "One sentence recommendation headline (personalized, warm, intelligent)",
  "reason": "2-3 sentences explaining why this tier fits them specifically",
  "topFeatures": ["feature1", "feature2", "feature3"],
  "nextSteps": ["step1", "step2", "step3"],
  "communities": ["community suggestion 1", "community suggestion 2"]
}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          tier: { type: 'string' },
          headline: { type: 'string' },
          reason: { type: 'string' },
          topFeatures: { type: 'array', items: { type: 'string' } },
          nextSteps: { type: 'array', items: { type: 'string' } },
          communities: { type: 'array', items: { type: 'string' } },
        }
      }
    });

    setRecommendation(result);
    setLoading(false);
    next();
  };

  const canProceed = () => {
    if (step === 1) return !!answers.role;
    if (step === 2) return answers.goals.length > 0;
    if (step === 3) return !!answers.experience;
    if (step === 4) return !!answers.team;
    if (step === 5) return !!answers.investment;
    return true;
  };

  const handleStep5Next = async () => {
    await generateRecommendation();
  };

  const membership = recommendation ? MEMBERSHIP_MAP[recommendation.tier] || MEMBERSHIP_MAP.founders : null;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5">
        <Link to="/">
           <img src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
             alt="edXponential" className="h-6 w-auto brightness-0 invert opacity-60 hover:opacity-80 transition-opacity" />
         </Link>
        {step > 0 && step < STEPS.length - 1 && (
          <span className="text-xs text-white/25 font-medium">{step} of {STEPS.length - 2}</span>
        )}
        <Link to="/pricing" className="text-xs text-white/25 hover:text-white/50 transition-colors">Skip to pricing →</Link>
      </div>

      {/* Progress bar */}
      {step > 0 && step < STEPS.length - 1 && (
        <div className="px-6 mb-8">
          <div className="h-0.5 bg-white/6 rounded-full overflow-hidden max-w-md mx-auto">
            <motion.div
              className="h-full bg-white/40 rounded-full"
              animate={{ width: `${((step) / (STEPS.length - 2)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {/* STEP 0 — WELCOME */}
            {step === 0 && (
              <motion.div key="welcome"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/8 flex items-center justify-center mx-auto mb-8">
                  <Sparkles className="w-8 h-8 text-white/60" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em] leading-[0.95] mb-5">
                  Welcome to<br /><span className="text-white/30">edXponential.</span>
                </h1>
                <p className="text-white/40 text-base leading-relaxed mb-4 max-w-sm mx-auto">
                  Let's personalize your experience.
                </p>
                <p className="text-white/25 text-sm leading-relaxed mb-12 max-w-sm mx-auto">
                  We'll ask a few quick questions to recommend the perfect membership and platform experience for you.
                </p>
                <button onClick={next}
                  className="group w-full max-w-xs mx-auto flex items-center justify-center gap-2 h-13 rounded-xl bg-white text-black font-semibold text-base hover:bg-white/90 transition-all active:scale-[0.99]">
                  Personalize My Experience
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-[11px] text-white/15 mt-5">Takes about 90 seconds · No account required</p>
              </motion.div>
            )}

            {/* STEP 1 — ROLE */}
            {step === 1 && (
              <motion.div key="role"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              >
                <h2 className="text-2xl font-black tracking-[-0.03em] mb-2">What best describes you?</h2>
                <p className="text-white/30 text-sm mb-7">Select the role that fits best.</p>
                <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
                  {ROLES.map(r => (
                    <button key={r} onClick={() => setAnswers(a => ({ ...a, role: r }))}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        answers.role === r
                          ? 'border-white/40 bg-white/10 text-white'
                          : 'border-white/8 text-white/45 hover:border-white/20 hover:text-white/70 hover:bg-white/4'
                      }`}>{r}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2 — GOALS */}
            {step === 2 && (
              <motion.div key="goals"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              >
                <h2 className="text-2xl font-black tracking-[-0.03em] mb-2">What are you hoping to accomplish?</h2>
                <p className="text-white/30 text-sm mb-7">Select all that apply.</p>
                <div className="flex flex-wrap gap-2 max-h-[55vh] overflow-y-auto pr-1">
                  {GOALS.map(g => (
                    <button key={g} onClick={() => toggleGoal(g)}
                      className={`px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        answers.goals.includes(g)
                          ? 'border-white/40 bg-white/10 text-white'
                          : 'border-white/8 text-white/40 hover:border-white/18 hover:text-white/60'
                      }`}>{g}</button>
                  ))}
                </div>
                <p className="text-[11px] text-white/20 mt-4">{answers.goals.length} selected</p>
              </motion.div>
            )}

            {/* STEP 3 — EXPERIENCE */}
            {step === 3 && (
              <motion.div key="exp"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              >
                <h2 className="text-2xl font-black tracking-[-0.03em] mb-2">How experienced are you?</h2>
                <p className="text-white/30 text-sm mb-7">In education leadership or entrepreneurship.</p>
                <div className="space-y-2.5">
                  {EXPERIENCE.map(e => (
                    <button key={e.id} onClick={() => setAnswers(a => ({ ...a, experience: e.id }))}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                        answers.experience === e.id
                          ? 'border-white/40 bg-white/8'
                          : 'border-white/8 hover:border-white/18 hover:bg-white/3'
                      }`}>
                      <div className="font-semibold text-sm text-white/80">{e.label}</div>
                      <div className="text-xs text-white/30 mt-0.5">{e.sub}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4 — TEAM */}
            {step === 4 && (
              <motion.div key="team"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              >
                <h2 className="text-2xl font-black tracking-[-0.03em] mb-2">Who are you using edXponential for?</h2>
                <p className="text-white/30 text-sm mb-7">Yourself or a larger team?</p>
                <div className="space-y-2.5">
                  {TEAM_SIZE.map(t => (
                    <button key={t.id} onClick={() => setAnswers(a => ({ ...a, team: t.id }))}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                        answers.team === t.id
                          ? 'border-white/40 bg-white/8'
                          : 'border-white/8 hover:border-white/18 hover:bg-white/3'
                      }`}>
                      <div className="font-semibold text-sm text-white/80">{t.label}</div>
                      <div className="text-xs text-white/30 mt-0.5">{t.sub}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5 — INVESTMENT */}
            {step === 5 && (
              <motion.div key="invest"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              >
                <h2 className="text-2xl font-black tracking-[-0.03em] mb-2">What investment are you comfortable with?</h2>
                <p className="text-white/30 text-sm mb-7">In your growth, network, and tools.</p>
                <div className="space-y-2.5">
                  {INVESTMENT.map(inv => (
                    <button key={inv.id} onClick={() => setAnswers(a => ({ ...a, investment: inv.id }))}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                        answers.investment === inv.id
                          ? 'border-white/40 bg-white/8'
                          : 'border-white/8 hover:border-white/18 hover:bg-white/3'
                      }`}>
                      <div className="font-semibold text-sm text-white/80">{inv.label}</div>
                      <div className="text-xs text-white/30 mt-0.5">{inv.sub}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 6 — RECOMMENDATION */}
            {step === 6 && (
              <motion.div key="rec"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-6 py-12">
                    <div className="w-14 h-14 rounded-2xl bg-white/8 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-white/50 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg mb-2">Analyzing your profile…</p>
                      <p className="text-white/30 text-sm">Our AI is building your personalized recommendation.</p>
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                ) : recommendation && membership ? (
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/8 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-7 h-7 text-white/60" />
                    </div>
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-3 font-bold">Your personalized recommendation</p>
                    <h2 className="text-2xl font-black text-white mb-4 leading-tight">{recommendation.headline}</h2>

                    <div className={`rounded-2xl border ${membership.color} bg-white/[0.025] p-6 text-left mb-6`}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-black text-white text-lg">{membership.name}</p>
                        <span className="text-white/40 text-sm font-semibold">{membership.price}</span>
                      </div>
                      <p className="text-sm text-white/45 leading-relaxed mb-5">{recommendation.reason}</p>

                      <div className="mb-4">
                        <p className="text-[10px] text-white/25 uppercase tracking-widest font-bold mb-2.5">You'll use most</p>
                        <ul className="space-y-1.5">
                          {recommendation.topFeatures?.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                              <CheckCircle className="w-3 h-3 text-white/25 flex-shrink-0" />{f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-[10px] text-white/25 uppercase tracking-widest font-bold mb-2.5">Next steps</p>
                        <ul className="space-y-1.5">
                          {recommendation.nextSteps?.map((s, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                              <span className="w-4 h-4 rounded-full bg-white/8 flex items-center justify-center text-[9px] font-black text-white/30 flex-shrink-0">{i + 1}</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link to="/">
                        <button className="w-full h-12 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                          Get Started with {membership.name} <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link to="/pricing">
                        <button className="w-full h-11 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white/70 transition-all">
                          View all plans
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}

          </AnimatePresence>

          {/* Nav buttons */}
          {step > 0 && step < 6 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center justify-between mt-8"
            >
              <button onClick={back}
                className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={step === 5 ? handleStep5Next : next}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2 h-10 px-6 rounded-xl bg-white text-black text-sm font-semibold disabled:opacity-30 hover:bg-white/90 transition-all active:scale-[0.98]"
              >
                {step === 5 ? (loading ? 'Analyzing…' : 'Get My Recommendation') : 'Continue'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}