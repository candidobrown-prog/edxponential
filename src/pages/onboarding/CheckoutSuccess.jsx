import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ChevronRight, Loader2 } from 'lucide-react';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Mark dashboard as unlocked immediately, then navigate
    const timer = setTimeout(async () => {
      try {
        await base44.auth.updateMe({ dashboard_unlocked: true, payment_method_added: true });
      } catch (e) { /* ignore */ }
      setReady(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md text-center"
      >
        {/* Eddy avatar */}
        <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mx-auto mb-8 shadow-sm">
          <span className="text-white font-black text-lg tracking-tight">E</span>
        </div>

        <h1 className="text-4xl font-black text-black tracking-tight mb-4">
          You're in.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed mb-2">
          Your edXponential dashboard is ready.
        </p>
        <p className="text-sm text-gray-400 mb-10">
          Your 14-day free trial has started. A confirmation email is on its way.
        </p>

        {/* Trial summary */}
        <div className="rounded-2xl border border-gray-200 px-6 py-5 mb-10 text-left space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Charged today</span>
            <span className="font-black text-black text-lg">$0.00</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Free trial</span>
            <span className="font-semibold text-black">14 days</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Cancel anytime</span>
            <span className="font-semibold text-black">Before trial ends</span>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.setItem('edx_onboarding_complete', 'true');
            navigate('/', { replace: true });
          }}
          disabled={!ready}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-40"
        >
          {!ready ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Setting up your dashboard...</>
          ) : (
            <>Go to Dashboard <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </motion.div>
    </div>
  );
}