import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    key: 'standard',
    icon: Zap,
    label: 'Standard',
    price: 199,
    per: 'per post',
    days: 30,
    features: [
      '30-day job listing',
      'Standard visibility',
      'Applicant collection',
      'Basic employer dashboard',
      'Email notifications',
      'Direct apply feature',
    ],
  },
  {
    key: 'featured',
    icon: Star,
    label: 'Featured',
    price: 499,
    per: 'per post',
    days: 45,
    highlight: true,
    features: [
      '45-day job listing',
      'Featured placement on OneJob',
      'Highlighted job card',
      'Priority search placement',
      'Applicant tracking',
      'Email promotion to relevant users',
      'Enhanced analytics',
    ],
  },
  {
    key: 'executive',
    icon: Shield,
    label: 'Executive Search',
    price: 999,
    per: 'per post',
    days: 60,
    features: [
      '60-day premium listing',
      'Top placement on OneJob',
      'Featured in executive talent searches',
      'Candidate recommendations',
      'Priority support',
      'Social media promotion',
      'Full applicant tracking',
      'Request candidate introductions',
    ],
  },
];

const packages = [
  { label: 'Bulk — 3 Standard Posts', price: 497, savings: '$100 savings' },
  { label: 'Bulk — 5 Standard Posts', price: 795, savings: '$200 savings' },
  { label: 'School Network Subscription', price: 1499, per: '/month', desc: 'Unlimited posts for your network' },
  { label: 'District / CMO Annual Plan', price: 4999, per: '/year', desc: 'Full platform access + dedicated support' },
];

export default function OneJobPricing() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0a0f1e] px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">OneJob Pricing</p>
          <h1 className="text-4xl font-black text-white mb-3">Post Jobs. Find Leaders. Build Schools.</h1>
          <p className="text-white/50 text-lg">Simple, transparent pricing. No hidden fees. Cancel or pause anytime.</p>
        </div>
      </div>

      {/* Tiers */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {tiers.map(({ key, icon: Icon, label, price, per, days, features, highlight }) => (
            <div key={key} className={`rounded-2xl border-2 p-7 ${highlight ? 'border-[#0a0f1e] bg-[#0a0f1e] text-white' : 'border-gray-100 bg-white'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${highlight ? 'bg-white/20' : 'bg-gray-100'}`}>
                <Icon className={`w-5 h-5 ${highlight ? 'text-white' : 'text-[#0a0f1e]'}`} />
              </div>
              {highlight && <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-1">Most Popular</p>}
              <p className={`font-black text-lg ${highlight ? 'text-white' : 'text-[#0a0f1e]'}`}>{label}</p>
              <div className="mt-2 mb-1">
                <span className={`text-4xl font-black ${highlight ? 'text-white' : 'text-[#0a0f1e]'}`}>${price}</span>
              </div>
              <p className={`text-xs ${highlight ? 'text-white/50' : 'text-gray-400'}`}>{per} · {days}-day listing</p>
              <ul className="mt-6 space-y-2.5">
                {features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${highlight ? 'text-white/80' : 'text-gray-600'}`}>
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? 'text-white/60' : 'text-gray-400'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/onejob/post">
                <Button className={`w-full mt-7 font-black ${highlight ? 'bg-white text-[#0a0f1e] hover:bg-gray-100' : 'bg-[#0a0f1e] text-white hover:bg-[#1a2540]'}`}>
                  Post {label} Job
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bulk / Subscriptions */}
        <div>
          <h2 className="text-2xl font-black text-[#0a0f1e] mb-6">Bulk & Organization Plans</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {packages.map(({ label, price, per, desc, savings }) => (
              <div key={label} className="bg-white rounded-2xl border-2 border-gray-100 hover:border-[#0a0f1e] p-6 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-black text-[#0a0f1e]">{label}</p>
                    {desc && <p className="text-sm text-gray-500 mt-0.5">{desc}</p>}
                    {savings && <span className="inline-block mt-2 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{savings}</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#0a0f1e]">${price.toLocaleString()}</p>
                    {per && <p className="text-xs text-gray-400">{per}</p>}
                  </div>
                </div>
                <Button className="w-full mt-4 bg-[#0a0f1e] text-white font-bold text-sm h-9">Get Started</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-12 bg-[#f8f8f8] rounded-2xl p-6 border border-gray-100">
          <h3 className="font-black text-[#0a0f1e] mb-3">Accepted Payment Methods</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {['Credit / Debit Card', 'ACH / Bank Transfer', 'Invoice Billing', 'School / District PO'].map(m => (
              <div key={m} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <p className="text-xs font-bold text-gray-600">{m}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">All payments secured by Stripe. Card data is never stored. Invoice billing available for schools and organizations.</p>
        </div>
      </div>
    </div>
  );
}