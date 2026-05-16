import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Leading Learner',
    price: '$19',
    period: '/month',
    trial: '14-day free trial',
    target: 'Best for teachers, parents, and emerging educators.',
    features: ['AI-personalized dashboard','Core platform tools','Community access','Basic analytics','Eddy AI support'],
    key: 'leading_learner',
    hasStripe: true,
  },
  {
    name: 'Entrepreneur Plus',
    price: '$49',
    period: '/month',
    trial: '14-day free trial',
    target: 'Best for tutors, education entrepreneurs, and business owners.',
    features: ['Everything in Leading Learner','Business growth tools','Tutoring marketplace','Advanced analytics','Priority Eddy support'],
    key: 'entrepreneur_plus',
    hasStripe: true,
  },
  {
    name: 'Junior Pro',
    price: '$79',
    period: '/month',
    trial: '14-day free trial',
    target: 'Best for assistant principals, deans, and instructional coaches.',
    features: ['Everything in Entrepreneur Plus','Leadership coaching tools','School improvement modules','Cohort access','Team features'],
    key: 'junior_pro',
    hasStripe: true,
    highlighted: true,
  },
  {
    name: 'Senior Pro',
    price: '$199',
    period: '/month',
    trial: '14-day free trial',
    target: 'Best for principals and senior school leaders.',
    features: ['Everything in Junior Pro','Executive coaching','Advanced school ops','Board tools','Custom reporting'],
    key: 'senior_pro',
    hasStripe: true,
  },
  {
    name: 'Executive Gold',
    price: 'Contact Us',
    period: '',
    trial: '14-day free trial if approved',
    target: 'Best for CEOs, C-suite, executive directors, and managing directors.',
    features: ['Full platform access','White-glove onboarding','Executive advisory','Custom integrations','Dedicated support'],
    key: 'executive_gold',
    hasStripe: false,
  },
  {
    name: 'Enterprise Global',
    price: 'Quote-Based',
    period: '',
    trial: 'Contact for trial terms',
    target: 'Best for schools, districts, nonprofits, and organizations.',
    features: ['Unlimited seats','Custom branding','Admin dashboard','SSO/SAML','SLA & compliance'],
    key: 'enterprise_global',
    hasStripe: false,
  },
];

export default function OnboardingPricing() {
  const { refresh } = useOnboarding();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handleSelect = async (plan) => {
    if (!plan.hasStripe) {
      window.location.href = 'mailto:hello@edxponential.com?subject=edXponential ' + plan.name;
      return;
    }
    setLoading(plan.key);
    try {
      await base44.auth.updateMe({ selected_package: plan.name, pricing_selected: true });
      await refresh();
      navigate('/onboarding/checkout');
    } catch (e) { console.error(e); }
    finally { setLoading(null); }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-black tracking-tight mb-3">Choose Your Package</h1>
          <p className="text-gray-500">All plans include a 14-day free trial. No charge until your trial ends.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border-2 overflow-hidden flex flex-col ${plan.highlighted ? 'border-orange-500' : 'border-gray-200'}`}
            >
              {plan.highlighted && (
                <div className="bg-orange-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className={`px-6 py-6 ${plan.highlighted ? 'bg-orange-50' : 'bg-white'}`}>
                <h3 className="text-lg font-black text-black mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-black text-black">{plan.price}</span>
                  <span className="text-gray-500 text-sm mb-0.5">{plan.period}</span>
                </div>
                <p className="text-xs text-orange-600 font-semibold mb-3">{plan.trial}</p>
                <p className="text-xs text-gray-500 mb-5">{plan.target}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 pb-6 mt-auto">
                <button
                  onClick={() => handleSelect(plan)}
                  disabled={loading === plan.key}
                  className={`w-full h-11 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40 ${plan.highlighted ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-black text-white hover:bg-gray-900'}`}
                >
                  {loading === plan.key ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.hasStripe ? 'Start Free Trial' : 'Contact Us'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}