import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import EddyOnboarding from '@/components/eddy/EddyOnboarding';
import { generatePersonalizedDashboard } from '@/lib/personalizationEngine';

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState('eddy');

  const handleEddyComplete = async (aiRecommendation) => {
    // Get current user to extract profile
    const user = await base44.auth.me();
    const userProfile = {
      role: user?.role_type || 'teacher',
      organization: user?.organization_type || 'public',
      teamSize: user?.team_size || 'small',
      priorities: user?.priorities || [],
      timeline: user?.timeline || 'medium',
    };

    // Generate personalized dashboard
    await generatePersonalizedDashboard(userProfile, aiRecommendation);

    onComplete();
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'eddy' && (
        <EddyOnboarding onComplete={handleEddyComplete} />
      )}
    </AnimatePresence>
  );
}