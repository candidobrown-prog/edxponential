import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import EddyCharacter from './EddyCharacter';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to edXponential',
    questions: [
      { id: 'role', label: 'What is your primary role?', options: ['Founder', 'Principal', 'Coach', 'Tutor', 'Investor', 'Creator', 'Admin'] },
    ],
  },
  {
    id: 'goals',
    title: 'What are your main goals?',
    questions: [
      { id: 'goals', label: 'Select all that apply', options: ['Build a School', 'Improve Student Outcomes', 'Find Funding', 'Grow a Team', 'Access Expertise', 'Build Community', 'Scale EdTech'], multi: true },
    ],
  },
  {
    id: 'membership',
    title: 'Choose Your Membership',
    questions: [
      { id: 'tier', label: 'Which tier interests you?', options: ['Essential', 'Professional', 'Enterprise'] },
    ],
  },
  {
    id: 'profile',
    title: 'Quick Profile Setup',
    questions: [
      { id: 'organization', label: 'Organization/School Name', input: true },
      { id: 'challenge', label: 'Your biggest challenge right now', textarea: true },
    ],
  },
];

export default function EddyOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const handleAnswer = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const canProceed = currentStep.questions.every(q => responses[q.id]);

  const handleNext = async () => {
    if (!canProceed) return;

    if (isLastStep) {
      setLoading(true);
      await base44.auth.updateMe({
        eddy_onboarding_complete: true,
        eddy_role: responses.role,
        eddy_goals: responses.goals,
        eddy_tier: responses.tier,
        eddy_organization: responses.organization,
        eddy_challenge: responses.challenge,
      }).catch(() => {});
      setLoading(false);
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0a0a] to-[#050505] flex flex-col items-center justify-center px-6 py-12"
      >
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.04] blur-[120px]" />
        </div>

        <div className="relative max-w-2xl w-full flex flex-col items-center gap-8">
          {/* Progress bar */}
          <div className="w-full flex gap-2">
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                className="h-1 flex-1 rounded-full bg-white/10"
                animate={{
                  backgroundColor: i < step ? 'rgba(255,255,255,0.3)' : i === step ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>

          {/* Eddy Character */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EddyCharacter
              size="lg"
              expression={step === 0 ? 'excited' : 'friendly'}
              animateEmotion={step === 0 ? 'wave' : 'nod'}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2 mb-2"
          >
            {step === 0 ? (
              <h1 className="text-4xl font-black text-white tracking-[-0.04em]">
                Welcome to edXponential, {user?.full_name?.split(' ')[0]}.
              </h1>
            ) : (
              <h2 className="text-3xl font-black text-white tracking-[-0.04em]">
                {currentStep.title}
              </h2>
            )}
            {step === 0 && (
              <p className="text-white/40 text-lg">I'm Eddy — your AI guide to building, growing, and transforming education exponentially.</p>
            )}
          </motion.div>

          {/* Questions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full space-y-6"
          >
            {currentStep.questions.map(question => (
              <div key={question.id} className="space-y-3">
                <label className="text-white/70 font-semibold text-sm block">
                  {question.label}
                </label>

                {/* Multiple choice */}
                {question.options && !question.input && !question.textarea && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map(option => (
                      <motion.button
                        key={option}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (question.multi) {
                            const current = responses[question.id] || [];
                            if (current.includes(option)) {
                              handleAnswer(question.id, current.filter(o => o !== option));
                            } else {
                              handleAnswer(question.id, [...current, option]);
                            }
                          } else {
                            handleAnswer(question.id, option);
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm ${
                          (question.multi ? (responses[question.id] || []).includes(option) : responses[question.id] === option)
                            ? 'border-white bg-white/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          {(question.multi ? (responses[question.id] || []).includes(option) : responses[question.id] === option) && (
                            <Check className="w-4 h-4" />
                          )}
                          {option}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Text input */}
                {question.input && (
                  <input
                    type="text"
                    placeholder={question.label}
                    value={responses[question.id] || ''}
                    onChange={e => handleAnswer(question.id, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                )}

                {/* Textarea */}
                {question.textarea && (
                  <textarea
                    placeholder={question.label}
                    value={responses[question.id] || ''}
                    onChange={e => handleAnswer(question.id, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                )}
              </div>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full flex gap-3 mt-8"
          >
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:border-white/40 transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed || loading}
              className="flex-1 px-6 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? 'Setting up...' : isLastStep ? 'Complete' : 'Next'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>

          {/* Skip option */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onComplete}
            className="text-white/30 text-sm hover:text-white/60 transition-colors"
          >
            Skip for now
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}