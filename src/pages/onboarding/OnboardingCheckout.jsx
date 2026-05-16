import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Check, ChevronRight } from 'lucide-react';

const PACKAGE_PRICE_MAP = {
  'Leading Learner':   'subscription_starter_monthly',
  'Entrepreneur Plus': 'subscription_pro_monthly',
  'Junior Pro':        'subscription_pro_monthly',
  'Senior Pro':        'subscription_enterprise_monthly',
};

export default function OnboardingCheckout() {
  const { user } = useOnboarding();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress */}
      <div className="px-8 pt-8 pb-0">
        <div className="h-1 w-full bg-black rounded-full mb-2" />
        <p className="text-sm font-medium text-gray-400">Final step</p>
      </div>

      <div className="flex-1 px-8 pt-10 pb-32 max-w-2xl w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-8 shadow-sm">
            <span className="text-white font-black text-lg tracking-tight">E</span>
          </div>

          <h1 className="text-4xl font-black text-black tracking-tight mb-3">Start your free trial.</h1>
          <p className="text-base text-gray-400 leading-relaxed mb-10">
            Add your card to activate your <strong className="text-black">14-day free trial</strong>. You will not be charged until your trial ends, and you can cancel anytime.
          </p>

          {/* Package summary card */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Package</p>
              <h2 className="text-2xl font-black text-black tracking-tight">{selectedPackage}</h2>
              <p className="text-sm text-orange-500 font-semibold mt-1">14-day free trial, then billed monthly</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[
                'No charge for 14 days',
                'Cancel anytime before trial ends',
                'Secure checkout via Stripe',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        </motion.div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 bg-white border-t border-gray-100 px-8 py-5 flex items-center justify-between" style={{ left: '50%', transform: 'translateX(-50%)', maxWidth: '42rem', width: '100%' }}>
        <button onClick={() => navigate(-1)} className="text-sm font-semibold text-gray-400 hover:text-black transition-colors">
          Back
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex items-center gap-2 h-12 px-8 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Start Free Trial <ChevronRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}