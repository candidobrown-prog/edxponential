import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import EddyCharacter from '@/components/eddy/EddyCharacter';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to edXponential',
    subtitle: 'Your AI-Powered Operating System for Education',
    eddyMood: 'happy',
    message: "I'm Eddy, your AI concierge. Let's build something extraordinary together.",
  },
  {
    id: 'profile',
    title: 'Build Your Profile',
    subtitle: 'Tell us about your vision',
    eddyMood: 'neutral',
    message: 'Help me understand your role and goals so I can personalize your experience.',
  },
  {
    id: 'tier',
    title: 'Choose Your Path',
    subtitle: 'Select the membership that fits your needs',
    eddyMood: 'thinking',
    message: 'Based on your goals, I recommend the tier that will unlock the most value for you.',
  },
  {
    id: 'explore',
    title: 'Explore the Platform',
    subtitle: 'Discover powerful tools and community',
    eddyMood: 'excited',
    message: 'You now have access to everything. Let me show you what\'s possible.',
  },
];

export default function EddyOnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      base44.auth.updateMe({ eddy_onboarding_complete: true });
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
        className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0f0f1e] overflow-hidden z-[9999]"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-blue-500"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Glowing background orbs */}
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-br from-blue-600/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-tl from-purple-600/20 to-transparent blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />

        {/* Content */}
        <div className="relative z-10 h-screen flex flex-col items-center justify-center px-6">
          {/* Eddy Character */}
          <motion.div
            key={`character-${step}`}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12"
          >
            <EddyCharacter size="xl" mood={current.eddyMood} />
          </motion.div>

          {/* Text Content */}
          <motion.div
            key={`text-${step}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center max-w-2xl mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-300 tracking-widest uppercase">
                Step {step + 1} of {STEPS.length}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-tight mb-4">
              {current.title}
            </h1>

            <p className="text-white/40 text-lg md:text-xl leading-relaxed mb-8">
              {current.subtitle}
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 italic text-base md:text-lg"
            >
              "{current.message}"
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-full max-w-xs mb-8">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: `${(step / STEPS.length) * 100}%` }}
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-sm"
          >
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Back
              </button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2 group"
            >
              {isLast ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Let's Go
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Skip for now - only show on first step */}
          {step === 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={onComplete}
              className="mt-6 text-white/40 hover:text-white/60 transition-colors text-sm font-medium"
            >
              Skip for now
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}