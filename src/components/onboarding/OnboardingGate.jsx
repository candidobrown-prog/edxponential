import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOnboarding, ONBOARDING_STEPS } from '@/lib/OnboardingContext';
import { useAuth } from '@/lib/AuthContext';

const ONBOARDING_ROUTES = [
  '/onboarding/questionnaire',
  '/onboarding/recommendation',
  '/onboarding/pricing',
  '/onboarding/checkout',
];

export default function OnboardingGate({ children }) {
  const { onboardingStatus, getCurrentStep, isFullyOnboarded } = useOnboarding();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (onboardingStatus === null) return; // still loading
    if (isLoadingAuth || !isAuthenticated) return; // wait for auth — login screen handles this

    const currentPath = location.pathname;
    const onOnboardingRoute = ONBOARDING_ROUTES.some(r => currentPath.startsWith(r));

    if (isFullyOnboarded()) {
      // User is fully onboarded — if they're on an onboarding route, send to dashboard
      if (onOnboardingRoute) {
        navigate('/', { replace: true });
      }
      return;
    }

    // User is NOT fully onboarded — redirect to correct step
    const step = getCurrentStep();
    const stepRoutes = {
      [ONBOARDING_STEPS.QUESTIONNAIRE]: '/onboarding/questionnaire',
      [ONBOARDING_STEPS.RECOMMENDATION]: '/onboarding/recommendation',
      [ONBOARDING_STEPS.CHECKOUT]: '/onboarding/checkout',
    };

    const targetRoute = stepRoutes[step];
    if (targetRoute && currentPath !== targetRoute) {
      navigate(targetRoute, { replace: true });
    }
  }, [onboardingStatus, location.pathname]);

  // Show loading spinner while checking status (only after auth is confirmed)
  if (isAuthenticated && onboardingStatus === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}