import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useOnboarding } from '@/lib/OnboardingContext';
import { Loader2, Check } from 'lucide-react';

const PACKAGE_PRICE_MAP = {
  'Leading Learner': 'subscription_starter_monthly',
  'Entrepreneur Plus': 'subscription_pro_monthly',
  'Junior Pro': 'subscription_pro_monthly',
  'Senior Pro': 'subscription_enterprise_monthly',
};

export default function OnboardingCheckout() {
  const { user } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedPackage = user?.selected_package || 'Junior Pro';
  const productType = PACKAGE_PRICE_MAP[selectedPackage] || 'subscription_pro_monthly';

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert('Checkout is only available from the published app.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('createCheckout', {
        product_type: productType,
        product_name: `${selectedPackage} Package`,
        description: `edXponential ${selectedPackage} — 14-day free trial`,
        brand: 'edxponential_core',
        metadata: { onboarding: 'true', package: selectedPackage },
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError('Could not start checkout. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-md">

        {/* Eddy header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-black text-base tracking-tight">E</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Almost there</p>
            <h1 className="text-2xl font-black text-black tracking-tight">Start Your Free Trial</h1>
          </div>
        </div>

        <p className="text-base text-gray-500 leading-relaxed mb-8">
          Add your card to activate your <strong className="text-black">14-day free trial</strong>. You will not be charged until your trial ends, and you can cancel anytime.
        </p>

        {/* Package summary */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Selected Package</p>
            <h2 className="text-xl font-black text-black tracking-tight">{selectedPackage}</h2>
            <p className="text-sm text-orange-500 font-semibold mt-1">14-day free trial, then billed monthly</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            {[
              'No charge for 14 days',
              'Cancel anytime before trial ends',
              'Secure checkout via Stripe',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-orange-500" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start My Free Trial'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Powered by Stripe. Your card info is never stored by us.
        </p>
      </motion.div>
    </div>
  );
}