import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import OnboardingShell from './OnboardingShell';

const PLANS = [
  {
    id: 'potentials',
    name: 'Potentials',
    price_monthly: 29,
    price_annual: 24,
    trial: '7 Days Free',
    badge: null,
    bestFor: 'Aspiring & emerging leaders',
    highlight: false,
    features: ['AI-powered educational tools', 'Community access', 'Weekly live sessions', 'Leadership content', 'Mobile app access'],
  },
  {
    id: 'principal',
    name: 'Principal Park',
    price_monthly: 49,
    price_annual: 39,
    trial: '7 Days Free',
    badge: null,
    bestFor: 'Principals & instructional leaders',
    highlight: false,
    features: ['Everything in Potentials', 'Principal-only community', 'School culture systems', 'Observation frameworks', 'Turnaround playbooks'],
  },
  {
    id: 'founders',
    name: 'Founders Sphere',
    price_monthly: 99,
    price_annual: 79,
    trial: '7 Days for $19',
    badge: 'MOST POPULAR',
    bestFor: 'Founders & school builders',
    highlight: true,
    features: ['Everything in Principal Park', 'Founder-only community', 'Fundraising guidance', 'Investor access', 'AI growth systems', 'Pitch deck templates'],
  },
  {
    id: 'executive',
    name: 'Executive Entourage',
    price_monthly: 129,
    price_annual: 99,
    trial: '7 Days Free',
    badge: null,
    bestFor: 'Executives, chiefs & superintendents',
    highlight: false,
    features: ['Everything in Founders Sphere', 'Executive masterminds', 'Executive coaching', 'Strategic planning', 'VIP event access', 'Concierge support'],
  },
];

const SPECIALTY = [
  {
    id: 'edvisor',
    name: 'edVisors™',
    price: '$249/mo',
    note: '+ $99 one-time application fee',
    trial: 'Application Required',
    bestFor: 'Expert coaches & consultants',
    highlight: false,
    features: ['Monetize your expertise', 'Coaching CRM', 'Course creation tools', 'AI growth systems', 'Revenue dashboards'],
  },
  {
    id: 'edvestor',
    name: 'edVestors™',
    price: 'By invitation',
    note: 'Curated investor network',
    trial: 'Application Required',
    bestFor: 'Investors & strategic partners',
    highlight: false,
    features: ['Founder deal flow', 'Investment opportunities', 'Private investor rooms', 'AI opportunity matching'],
  },
];

function PlanCard({ plan, isSelected, onSelect, billing }) {
  const [expanded, setExpanded] = useState(false);
  const price = billing === 'monthly' ? plan.price_monthly : plan.price_annual;
  const showPrice = typeof price === 'number';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? plan.highlight ? 'border-white bg-white/10' : 'border-white bg-white/[0.06]'
          : plan.highlight ? 'border-white/25 bg-white/[0.04]' : 'border-white/10 bg-white/[0.03] hover:border-white/25'
      }`}
      onClick={() => onSelect(plan.id)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-white font-black text-sm">{plan.name}</span>
              {plan.badge && (
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#07080f]">{plan.badge}</span>
              )}
            </div>
            <p className="text-white/35 text-xs">{plan.bestFor}</p>
            <p className="text-white/50 text-[11px] mt-1 font-semibold">
              {plan.trial}
              {billing === 'annually' && showPrice && (
                <span className="ml-1.5 text-green-400">· Save ${(plan.price_monthly - plan.price_annual) * 12}/yr</span>
              )}
            </p>
          </div>
          <div className="text-right shrink-0">
            {showPrice ? (
              <>
                <span className="text-white font-black text-xl">${price}</span>
                <span className="text-white/30 text-xs">/mo</span>
              </>
            ) : (
              <span className="text-white font-black text-base">{plan.price}</span>
            )}
          </div>
        </div>

        {/* Features toggle */}
        <button onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
          className="flex items-center gap-1 text-white/30 text-[11px] font-bold mt-2 hover:text-white/60 transition-colors">
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide features' : 'See features'}
        </button>

        {expanded && (
          <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 space-y-1">
            {plan.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                <Check className="w-3 h-3 text-white/40 flex-shrink-0" strokeWidth={3} />
                {f}
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      {isSelected && (
        <div className="bg-white/10 border-t border-white/10 px-4 py-2 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-[#07080f]" strokeWidth={3} />
          </div>
          <span className="text-white text-xs font-bold">Selected — Continue to review</span>
        </div>
      )}
    </motion.div>
  );
}

export default function OnboardingTiers({ selected, onSelect, onNext, onBack, onSkip }) {
  const [billing, setBilling] = useState('monthly');
  const [showSpecialty, setShowSpecialty] = useState(false);

  return (
    <OnboardingShell step={4} totalSteps={5} label="Choose Membership">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Choose your membership.</h2>
          <p className="text-white/35 text-sm">Start your free trial. Cancel anytime. No charge today.</p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white/[0.05] border border-white/10 rounded-xl p-1">
            {['monthly', 'annually'].map(b => (
              <button key={b} onClick={() => setBilling(b)}
                className={`px-4 py-2 rounded-lg text-xs font-black capitalize transition-all ${billing === b ? 'bg-white text-[#07080f] shadow-sm' : 'text-white/40 hover:text-white/70'}`}>
                {b === 'annually' ? 'Annual — Save 20%' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>

        {/* Main plans */}
        <div className="space-y-2.5">
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} isSelected={selected === plan.id} onSelect={onSelect} billing={billing} />
          ))}
        </div>

        {/* Specialty plans toggle */}
        <button onClick={() => setShowSpecialty(!showSpecialty)}
          className="w-full flex items-center justify-center gap-2 text-white/30 text-xs font-bold hover:text-white/60 transition-colors py-2">
          {showSpecialty ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {showSpecialty ? 'Hide specialty memberships' : 'View specialty memberships (edVisors™ · edVestors™)'}
        </button>

        {showSpecialty && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
            {SPECIALTY.map(plan => (
              <PlanCard key={plan.id} plan={plan} isSelected={selected === plan.id} onSelect={onSelect} billing={billing} />
            ))}
          </motion.div>
        )}

        {/* Nav */}
        <div className="flex gap-3 pt-1">
          <button onClick={onBack}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all font-bold">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={onNext} disabled={!selected}
            className="flex-1 bg-white text-[#07080f] font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-gray-100 transition-all">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Explore first option */}
        <p className="text-center">
          <button onClick={onSkip} className="text-white/25 text-xs font-bold hover:text-white/50 transition-colors">
            Explore the platform first — I'll choose a plan later
          </button>
        </p>

        <p className="text-center text-white/20 text-[11px]">
          Cancel anytime · No charge until trial ends · All plans include 7-day free access
        </p>
      </div>
    </OnboardingShell>
  );
}