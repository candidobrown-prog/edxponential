import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight, Check } from 'lucide-react';

const PACKAGES = {
  'Leading Learner':   { price: '$19/mo',     target: 'Teachers, parents, and emerging educators',               priceId: 'subscription_starter_monthly' },
  'Entrepreneur Plus': { price: '$49/mo',     target: 'Tutors, education entrepreneurs, and business owners',   priceId: 'subscription_pro_monthly' },
  'Junior Pro':        { price: '$79/mo',     target: 'Assistant principals, deans, and instructional coaches', priceId: 'subscription_pro_monthly' },
  'Senior Pro':        { price: '$199/mo',    target: 'Principals and senior school leaders',                   priceId: 'subscription_enterprise_monthly' },
  'Executive Gold':    { price: 'Contact Us', target: 'CEOs, C-suite, executive directors, managing directors', priceId: null },
  'Enterprise Global': { price: 'Quote',      target: 'Schools, districts, nonprofits, and organizations',     priceId: null },
};

const ROLE_MAP = {
  'Classroom Teacher': 'Leading Learner', 'Parent': 'Leading Learner',
  'Tutor / Educational Consultant': 'Entrepreneur Plus', 'School Founder / Entrepreneur': 'Entrepreneur Plus',
  'School Principal / Leader': 'Junior Pro', 'Instructional Coach': 'Junior Pro',
  'District Administrator': 'Senior Pro', 'Nonprofit Leader': 'Senior Pro', 'Superintendent': 'Senior Pro',
  'Executive / C-Suite': 'Executive Gold',
  'Investor / Philanthropist': 'Enterprise Global',
};

function getRecommendation(user) {
  const budget = user?.budget_range || '';
  if (budget === 'Under $25 / month') return 'Leading Learner';
  if (budget === '$25 – $75 / month') return 'Entrepreneur Plus';
  if (budget === '$75 – $150 / month') return 'Junior Pro';
  if (budget === '$150 – $250 / month') return 'Senior Pro';
  if (budget === 'Organization account (quote-based)') return 'Enterprise Global';
  if (budget === 'Exclusive application-based account') return 'Executive Gold';
  return ROLE_MAP[user?.role_type || ''] || 'Junior Pro';
}

export default function EddyRecommendation() {
  const { user, refresh } = useOnboarding();
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) setRecommended(getRecommendation(user)); }, [user]);

  const handleContinue = async (packageName) => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ recommended_package: recommended, selected_package: packageName, pricing_selected: true });
      await refresh();
      navigate('/onboarding/checkout');
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (!recommended) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>;
  }

  const pkg = PACKAGES[recommended];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress */}
      <div className="px-8 pt-8 pb-0">
        <div className="h-1 w-full bg-black rounded-full mb-2" />
        <p className="text-sm font-medium text-gray-400">Complete</p>
      </div>

      <div className="flex-1 px-8 pt-10 pb-32 max-w-2xl w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-8 shadow-sm">
            <span className="text-white font-black text-lg tracking-tight">E</span>
          </div>

          <h1 className="text-4xl font-black text-black tracking-tight mb-3">
            Here is your recommendation.
          </h1>
          <p className="text-base text-gray-400 leading-relaxed mb-10">
            Based on your role, goals, and budget, the <strong className="text-black">{recommended} Package</strong> is the best fit for you. It is built for {pkg.target.toLowerCase()}.
          </p>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden mb-4">
            <div className="px-6 py-6 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{recommended} Package</p>
              <p className="text-5xl font-black text-black tracking-tight">{pkg.price}</p>
              <p className="text-sm text-gray-400 mt-2">14-day free trial · Cancel anytime</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              {['No charge for 14 days', 'Cancel before trial ends — pay nothing', 'Secure checkout via Stripe'].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 bg-white border-t border-gray-100 px-8 py-5 flex items-center justify-between" style={{ left: '50%', transform: 'translateX(-50%)', maxWidth: '42rem', width: '100%' }}>
        <button onClick={() => navigate('/onboarding/questionnaire')} className="text-sm font-semibold text-gray-400 hover:text-black transition-colors">
          Back
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/onboarding/pricing')} className="text-sm font-semibold text-gray-400 hover:text-black transition-colors">
            Compare all packages
          </button>
          <button
            disabled={saving}
            onClick={() => pkg.priceId ? handleContinue(recommended) : (window.location.href = 'mailto:hello@edxponential.com')}
            className="flex items-center gap-2 h-12 px-8 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-30"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{pkg.priceId ? 'Continue' : 'Contact Us'} <ChevronRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}