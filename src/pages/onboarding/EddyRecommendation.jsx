import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';

const PACKAGES = {
  'Leading Learner': { price: '$19/mo', target: 'Teachers, parents, and emerging educators', priceId: 'subscription_starter_monthly' },
  'Entrepreneur Plus': { price: '$49/mo', target: 'Tutors, education entrepreneurs, and business owners', priceId: 'subscription_pro_monthly' },
  'Junior Pro': { price: '$79/mo', target: 'Assistant principals, deans, and instructional coaches', priceId: 'subscription_pro_monthly' },
  'Senior Pro': { price: '$199/mo', target: 'Principals and senior school leaders', priceId: 'subscription_enterprise_monthly' },
  'Executive Gold': { price: 'Contact Us', target: 'CEOs, C-suite, executive directors, managing directors', priceId: null },
  'Enterprise Global': { price: 'Quote-Based', target: 'Schools, districts, nonprofits, and organizations', priceId: null },
};

const ROLE_MAP = {
  'Teacher': 'Leading Learner', 'Parent': 'Leading Learner',
  'Tutor': 'Entrepreneur Plus', 'Education Entrepreneur': 'Entrepreneur Plus', 'Founder': 'Entrepreneur Plus',
  'Assistant Principal': 'Junior Pro', 'Dean': 'Junior Pro', 'Instructional Coach': 'Junior Pro', 'Math Coach': 'Junior Pro', 'Curriculum Designer': 'Junior Pro', 'Consultant': 'Junior Pro',
  'Principal': 'Senior Pro', 'Director': 'Senior Pro', 'Nonprofit Leader': 'Senior Pro', 'Special Education Leader': 'Senior Pro', 'Superintendent': 'Senior Pro',
  'CEO': 'Executive Gold', 'CAO': 'Executive Gold', 'COO': 'Executive Gold', 'Executive Director': 'Executive Gold', 'Managing Director': 'Executive Gold',
  'Board Member': 'Enterprise Global', 'Investor': 'Enterprise Global',
};

function getRecommendation(user) {
  const role = user?.role_type || '';
  const budget = user?.budget_range || '';
  if (budget === 'Under $25/month') return 'Leading Learner';
  if (budget === '$25–$75/month') return 'Entrepreneur Plus';
  if (budget === '$75–$150/month') return 'Junior Pro';
  if (budget === '$150–$250/month') return 'Senior Pro';
  if (budget === 'Quote-based organization account') return 'Enterprise Global';
  if (budget === 'Application-based exclusive account') return 'Executive Gold';
  return ROLE_MAP[role] || 'Junior Pro';
}

export default function EddyRecommendation() {
  const { user, refresh } = useOnboarding();
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setRecommended(getRecommendation(user));
  }, [user]);

  const handleContinue = async (packageName) => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        recommended_package: recommended,
        selected_package: packageName,
        pricing_selected: true,
      });
      await refresh();
      navigate('/onboarding/checkout');
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (!recommended) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const pkg = PACKAGES[recommended];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-md">

        {/* Eddy header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-black text-base tracking-tight">E</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Eddy recommends</p>
            <h1 className="text-2xl font-black text-black tracking-tight">Your Package</h1>
          </div>
        </div>

        {/* Message */}
        <p className="text-base text-gray-500 leading-relaxed mb-8">
          Based on your role, goals, and budget, the <strong className="text-black">{recommended} Package</strong> is the best fit for you. It is built for {pkg.target.toLowerCase()}.
        </p>

        {/* Package card */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden mb-4">
          <div className="px-6 py-6 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{recommended} Package</p>
            <p className="text-4xl font-black text-black tracking-tight">{pkg.price}</p>
            <p className="text-sm text-gray-400 mt-1">14-day free trial · Cancel anytime</p>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-gray-500">{pkg.target}</p>
          </div>
        </div>

        <button
          disabled={saving}
          onClick={() => pkg.priceId ? handleContinue(recommended) : (window.location.href = 'mailto:hello@edxponential.com')}
          className="w-full h-12 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-30 mb-3"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : pkg.priceId ? <>Continue <ChevronRight className="w-4 h-4" /></> : 'Contact Us'}
        </button>

        <button
          onClick={() => navigate('/onboarding/pricing')}
          className="w-full h-12 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          Compare All Packages
        </button>
      </motion.div>
    </div>
  );
}