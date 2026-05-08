import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import OnboardingTiers from './onboarding/OnboardingTiers';
import OnboardingBilling from './onboarding/OnboardingBilling';
import OnboardingProfile from './onboarding/OnboardingProfile';
import OnboardingTour from './onboarding/OnboardingTour';
import OnboardingSuccess from './onboarding/OnboardingSuccess';

// MANDATORY FLOW: tiers → billing → profile → tour → success
// Users CANNOT skip tier selection or billing
const STEPS = ['tiers', 'billing', 'profile', 'tour', 'success'];

export default function OnboardingFlow({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState({ selectedPlan: null, profile: {} });

  const step = STEPS[stepIndex];
  const next = () => setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIndex(i => Math.max(i - 1, 0));

  const handleFinish = async () => {
    try {
      await base44.auth.updateMe({
        selected_plan: data.selectedPlan,
        onboarding_complete: true,
        ...data.profile,
      });
    } catch (_) {}
    onComplete();
  };

  const slideProps = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07080f] overflow-y-auto" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <AnimatePresence mode="wait">
        {step === 'tiers' && (
          <motion.div key="tiers" {...slideProps}>
            <OnboardingTiers
              selected={data.selectedPlan}
              onSelect={v => setData(d => ({ ...d, selectedPlan: v }))}
              onNext={next}
            />
          </motion.div>
        )}
        {step === 'billing' && (
          <motion.div key="billing" {...slideProps}>
            <OnboardingBilling plan={data.selectedPlan} onNext={next} onBack={back} />
          </motion.div>
        )}
        {step === 'profile' && (
          <motion.div key="profile" {...slideProps}>
            <OnboardingProfile
              data={data.profile}
              onUpdate={p => setData(d => ({ ...d, profile: { ...d.profile, ...p } }))}
              onNext={next}
              onBack={back}
            />
          </motion.div>
        )}
        {step === 'tour' && (
          <motion.div key="tour" {...slideProps}>
            <OnboardingTour onNext={next} onSkip={next} />
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