import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Zap } from 'lucide-react';

export default function StarterPlanCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    // Block checkout inside iframe
    if (window.self !== window.top) {
      alert('Checkout is only available from the published app.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('createCheckout', {
        product_type: 'subscription_starter_monthly',
        product_name: 'Starter Plan',
        description: 'edXponential Starter Plan — $20/month',
        brand: 'edxponential_core',
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError('Could not start checkout. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-6 py-8 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-orange-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Subscription</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight">Starter Plan</h2>
        <div className="mt-2 flex items-end gap-1">
          <span className="text-4xl font-black">$20</span>
          <span className="text-blue-300 mb-1 text-sm">/ month</span>
        </div>
      </div>

      {/* Features */}
      <ul className="px-6 py-5 space-y-2 text-sm text-gray-700">
        {['Access to core platform tools', 'AI-personalized dashboard', 'Community access', 'Basic analytics'].map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="px-6 pb-6">
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full h-11 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe — $20/mo'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">Cancel anytime. Test card: 4242 4242 4242 4242</p>
      </div>
    </div>
  );
}