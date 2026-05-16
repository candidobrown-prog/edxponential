import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, ChevronRight } from 'lucide-react';

const PACKAGES = {
  'Leading Learner': { price: '$19/mo', target: 'Teachers, parents, and emerging educators', key: 'leading_learner', priceId: 'subscription_starter_monthly' },
  'Entrepreneur Plus': { price: '$49/mo', target: 'Tutors, education entrepreneurs, and business owners', key: 'entrepreneur_plus', priceId: 'subscription_pro_monthly' },
  'Junior Pro': { price: '$79/mo', target: 'Assistant principals, deans, and instructional coaches', key: 'junior_pro', priceId: 'subscription_pro_monthly' },
  'Senior Pro': { price: '$199/mo', target: 'Principals and senior school leaders', key: 'senior_pro', priceId: 'subscription_enterprise_monthly' },
  'Executive Gold': { price: 'Contact Us', target: 'CEOs, C-suite, executive directors, managing directors', key: 'executive_gold', priceId: null },
  'Enterprise Global': { price: 'Quote-Based', target: 'Schools, districts, nonprofits, and organizations', key: 'enterprise_global', priceId: null },
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
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const pkg = PACKAGES[recommended];
  const firstName = user?.first_name || 'there';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {/* Eddy badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3 flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              Based on your role, goals, and dashboard needs, I recommend the <strong>{recommended} Package</strong>. {pkg.target ? `This package is built for ${pkg.target.toLowerCase()}.` : ''}
            </p>
          </div>
        </div>

        {/* Recommended card */}
        <div className="rounded-2xl border-2 border-black overflow-hidden mb-6">
          <div className="bg-black px-6 py-5 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Eddy Recommends</span>
            </div>
            <h2 className="text-2xl font-black">{recommended} Package</h2>
            <p className="text-3xl font-black mt-1">{pkg.price}</p>
            <p className="text-gray-400 text-xs mt-1">14-day free trial · Cancel anytime</p>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-gray-600 mb-5">Best for: {pkg.target}</p>
            <button
              disabled={saving || !pkg.priceId}
              onClick={() => pkg.priceId ? handleContinue(recommended) : window.location.href = 'mailto:hello@edxponential.com'}
              className="w-full h-12 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : pkg.priceId ? <>Continue With This Package <ChevronRight className="w-4 h-4" /></> : 'Contact Us'}
            </button>
          </div>
        </div>

        {/* Compare all */}
        <button onClick={() => navigate('/onboarding/pricing')} className="w-full h-11 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
          Compare All Packages
        </button>
      </motion.div>
    </div>
  );
}