import { useEffect } from 'react';

export default function OnboardingFlow({ onComplete }) {
  useEffect(() => {
    onComplete();
  }, []);
  return null;
}