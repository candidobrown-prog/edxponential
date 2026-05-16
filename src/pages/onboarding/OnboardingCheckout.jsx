import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useOnboarding } from '@/lib/OnboardingContext';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';

const PACKAGE_PRICE_MAP = {
  'Leading Learner': 'subscription_starter_monthly',
  'Entrepreneur Plus': 'subscription_pro_monthly',
  'Junior Pro': 'subscription_pro_monthly',
  'Senior Pro': 'subscription_enterprise_monthly',
};

export default function OnboardingCheckout() {
  const { user, refresh } = useOnboarding();
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

        {/* Eddy message */}
        <div className="flex items-start gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              Almost there, {user?.first_name || 'friend'}! Add your card to start your <strong>14-day free trial</strong>. You won't be charged until your trial ends — and you can cancel anytime.
            </p>
          </div>
        </div>

        {/* Package summary */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-black px-6 py-5">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Your Selected Package</p>
            <h2 className="text-xl font-black text-white">{selectedPackage}</h2>
            <p className="text-orange-400 text-sm font-semibold mt-1">14-day free trial · then billed monthly</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              No charge for 14 days
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              Cancel anytime before trial ends
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              Secure checkout via Stripe
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full h-13 py-3.5 rounded-xl bg-orange-500 text-white font-bold text-base hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (<><CreditCard className="w-5 h-5" /> Start My Free Trial</>)}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Powered by Stripe · Your card info is never stored by us
        </p>
      </motion.div>
    </div>
  );
}