import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import OnboardingWelcome from './onboarding/OnboardingWelcome';
import OnboardingAccountType from './onboarding/OnboardingAccountType';
import OnboardingTour from './onboarding/OnboardingTour';
import OnboardingTiers from './onboarding/OnboardingTiers';
import OnboardingBilling from './onboarding/OnboardingBilling';
import OnboardingSuccess from './onboarding/OnboardingSuccess';

// FLOW: welcome → account type → feature tour → tier selection → billing → success
const STEPS = ['welcome', 'account', 'tour', 'tiers', 'billing', 'success'];

export default function OnboardingFlow({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState({ accountType: null, selectedPlan: null });

  const step = STEPS[stepIndex];
  const next = () => setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIndex(i => Math.max(i - 1, 0));

  const handleFinish = async () => {
    try {
      await base44.auth.updateMe({
        account_type: data.accountType,
        selected_plan: data.selectedPlan,
        onboarding_complete: true,
      });
    } catch (_) {}
    onComplete();
  };

  // Skip to dashboard (no billing) — used from WelcomeScreen "explore" path
  const handleSkip = async () => {
    try {
      await base44.auth.updateMe({ onboarding_skipped: true });
    } catch (_) {}
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07080f] overflow-y-auto" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <OnboardingWelcome onNext={next} onSkip={handleSkip} />
          </motion.div>
        )}
        {step === 'account' && (
          <motion.div key="account" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <OnboardingAccountType
              selected={data.accountType}
              onSelect={v => setData(d => ({ ...d, accountType: v }))}
              onNext={next}
              onBack={back}
            />
          </motion.div>
        )}
        {step === 'tour' && (
          <motion.div key="tour" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <OnboardingTour onNext={next} onSkip={next} accountType={data.accountType} />
          </motion.div>
        )}
        {step === 'tiers' && (
          <motion.div key="tiers" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <OnboardingTiers
              selected={data.selectedPlan}
              onSelect={v => setData(d => ({ ...d, selectedPlan: v }))}
              onNext={next}
              onBack={back}
              onSkip={handleSkip}
            />
          </motion.div>
        )}
        {step === 'billing' && (
          <motion.div key="billing" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <OnboardingBilling
              plan={data.selectedPlan}
              onNext={next}
              onBack={back}
            />
          </motion.div>
        )}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <OnboardingSuccess onEnter={handleFinish} plan={data.selectedPlan} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}