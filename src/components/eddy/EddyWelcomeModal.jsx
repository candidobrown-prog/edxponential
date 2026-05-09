import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import EddyCharacter from './EddyCharacter';

export default function EddyWelcomeModal({ user, onDismiss }) {
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState('idle');

  useEffect(() => {
    if (step === 0) {
      setAnimate('wave');
      setTimeout(() => setAnimate('idle'), 1000);
    }
  }, [step]);

  const steps = [
    {
      title: `Welcome to edXponential, ${user?.full_name?.split(' ')[0]}.`,
      subtitle: "I'm Eddy — your AI guide to building, growing, and transforming education exponentially.",
      action: 'Let\'s get started',
    },
    {
      title: 'How Can I Help?',
      subtitle: 'I can guide you through onboarding, explain features, recommend tools, and help you succeed on the platform.',
      action: 'Show me the platform',
    },
    {
      title: 'You\'re All Set!',
      subtitle: 'Ask me anything anytime. Just click the floating button in the bottom right corner.',
      action: 'Explore edXponential',
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 rounded-3xl max-w-lg w-full p-8 text-center space-y-6"
      >
        {/* Eddy */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <EddyCharacter
            size="lg"
            expression={step === 0 ? 'excited' : 'friendly'}
            animateEmotion={animate}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-3xl font-black text-white tracking-[-0.04em] leading-tight">
            {current.title}
          </h2>
          <p className="text-white/50 text-base leading-relaxed">
            {current.subtitle}
          </p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full"
              animate={{
                width: i === step ? 24 : 8,
                backgroundColor: i <= step ? '#ffffff' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 rounded-xl border border-white/20 text-white font-semibold hover:border-white/40 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) onDismiss();
              else setStep(step + 1);
            }}
            className="flex-1 px-4 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {current.action}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={onDismiss}
          className="text-white/30 text-sm hover:text-white/60 transition-colors"
        >
          Skip
        </button>
      </motion.div>
    </motion.div>
  );
}