import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const OnboardingContext = createContext();

export const ONBOARDING_STEPS = {
  QUESTIONNAIRE: 'questionnaire',
  RECOMMENDATION: 'recommendation',
  PRICING: 'pricing',
  CHECKOUT: 'checkout',
  COMPLETE: 'complete',
};

export const OnboardingProvider = ({ children }) => {
  const [onboardingStatus, setOnboardingStatus] = useState(null); // null = loading
  const [user, setUser] = useState(null);

  const refresh = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
      setOnboardingStatus({
        questionnaireCompleted: !!u?.questionnaire_completed,
        pricingSelected: !!u?.pricing_selected,
        paymentMethodAdded: !!u?.payment_method_added,
        subscriptionStatus: u?.subscription_status || null,
        dashboardUnlocked: !!u?.dashboard_unlocked,
      });
    } catch {
      setOnboardingStatus({ questionnaireCompleted: false, pricingSelected: false, paymentMethodAdded: false, subscriptionStatus: null, dashboardUnlocked: false });
    }
  };

  useEffect(() => { refresh(); }, []);

  // Determine which step the user should be on
  const getCurrentStep = () => {
    if (!onboardingStatus) return null;
    if (!onboardingStatus.questionnaireCompleted) return ONBOARDING_STEPS.QUESTIONNAIRE;
    if (!onboardingStatus.pricingSelected) return ONBOARDING_STEPS.RECOMMENDATION;
    if (!onboardingStatus.paymentMethodAdded && !onboardingStatus.dashboardUnlocked) return ONBOARDING_STEPS.CHECKOUT;
    if (onboardingStatus.dashboardUnlocked) return ONBOARDING_STEPS.COMPLETE;
    return ONBOARDING_STEPS.CHECKOUT;
  };

  const isFullyOnboarded = () => {
    if (localStorage.getItem('edx_onboarding_complete')) return true;
    if (!onboardingStatus) return false;
    return onboardingStatus.dashboardUnlocked ||
      onboardingStatus.paymentMethodAdded ||
      onboardingStatus.subscriptionStatus === 'trialing' ||
      onboardingStatus.subscriptionStatus === 'active';
  };

  return (
    <OnboardingContext.Provider value={{ onboardingStatus, user, refresh, getCurrentStep, isFullyOnboarded }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
};