import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const steps = [
  {
    title: 'Welcome to edXponential',
    desc: 'The operating system for education leaders.',
    cta: 'Let\'s get started',
  },
  {
    title: 'Tell us your role',
    desc: 'This helps us customize your experience.',
    options: ['Founder', 'Principal', 'Executive', 'edVisor', 'Investor'],
  },
  {
    title: 'What are your goals?',
    desc: 'We\'ll recommend the best tools for you.',
    options: ['Build a school', 'Improve my district', 'Scale my network', 'Find capital'],
  },
  {
    title: 'You\'re all set!',
    desc: 'Explore your personalized dashboard.',
    cta: 'Go to Dashboard',
  },
];

export default function SmartOnboarding({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (step === steps.length - 1) {
      setSaving(true);
      try {
        await base44.auth.updateMe({ onboarding_complete: true, ...selections });
      } catch (err) {
        console.error('Onboarding save error:', err);
      } finally {
        setSaving(false);
        onComplete();
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSelect = (value) => {
    setSelections(prev => ({ ...prev, [step]: value }));
  };

  const current = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl max-w-md w-full p-8 space-y-6"
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i <= step ? 'bg-black w-6' : 'bg-border w-2'
                }`}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-black">{current.title}</h2>
          <p className="text-sm text-muted-foreground">{current.desc}</p>
        </div>

        {/* Content */}
        {current.options ? (
          <div className="space-y-2">
            {current.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`w-full p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  selections[step] === opt
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-border hover:border-black'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : null}

        {/* CTA */}
        <button
          onClick={handleNext}
          disabled={current.options && !selections[step]}
          className="w-full h-10 rounded-xl bg-black text-white text-sm font-semibold hover:bg-black/85 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLastStep ? (
            <>
              <Check className="w-4 h-4" />
              Get Started
            </>
          ) : (
            <>
              {current.cta || 'Next'}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Skip */}
        {!isLastStep && (
          <button
            onClick={onComplete}
            className="w-full text-sm text-muted-foreground hover:text-black transition-colors"
          >
            Skip for now
          </button>
        )}
      </motion.div>
    </div>
  );
}