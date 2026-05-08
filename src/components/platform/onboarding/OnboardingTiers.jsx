/**
 * OnboardingTiers — Step 1 of mandatory onboarding
 * Full-screen cinematic tier selection. No skip allowed.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ChevronDown, ChevronUp, Zap, Users, TrendingUp, Crown, Star, Briefcase, BookOpen } from 'lucide-react';

const PLAN_ICONS = {
  potentials: BookOpen,
  principal: Star,
  founders: TrendingUp,
  executive: Crown,
  edvisor: Zap,
  edvestor: Briefcase,
  tutor: Users,
};

const PLANS = [
  {
    id: 'potentials',
    name: 'Potentials',
    price_monthly: 29, price_annual: 24,
    trial: '7 Days Free',
    badge: null,
    bestFor: 'Aspiring & emerging education leaders',
    highlight: false,
    features: [
      'AI-powered educational tools', 'Community access', 'Weekly live sessions',
      'Leadership development content', 'Selected courses', 'Mobile app',
    ],
  },
  {
    id: 'principal',
    name: 'Principal Park',
    price_monthly: 49, price_annual: 39,
    trial: '7 Days Free',
    badge: null,
    bestFor: 'Principals & instructional leaders',
    highlight: false,
    features: [
      'Everything in Potentials', 'Principal-only community', 'School culture systems',
      'Observation frameworks', 'Turnaround playbooks', 'Staff coaching systems',
    ],
  },
  {
    id: 'founders',
    name: 'Founders Sphere',
    price_monthly: 99, price_annual: 79,
    trial: '7 Days for $19',
    badge: 'MOST POPULAR',
    bestFor: 'Founders, school builders & entrepreneurs',
    highlight: true,
    features: [
      'Everything in Principal Park', 'Founder-only community', 'Fundraising guidance',
      'Investor access', 'AI growth systems', 'Pitch deck templates', 'Revenue generation',
    ],
  },
  {
    id: 'executive',
    name: 'Executive Entourage',
    price_monthly: 129, price_annual: 99,
    trial: '7 Days Free',
    badge: null,
    bestFor: 'Executives, chiefs & superintendents',
    highlight: false,
    features: [
      'Everything in Founders Sphere', 'Executive-only masterminds', 'District transformation strategy',
      'Executive coaching', 'VIP event access', 'Premium concierge support',
    ],
  },
];

const SPECIALTY = [
  {
    id: 'edvisor', name: 'edVisors™',
    price: '$249/mo', note: '+ $99 one-time application fee',
    trial: 'Application Required', bestFor: 'Expert coaches & consultants who monetize their expertise',
    features: ['Monetize coaching', 'Course creation', 'AI business tools', 'Revenue dashboards', 'Client CRM'],
  },
  {
    id: 'edvestor', name: 'edVestors™',
    price: 'By Invitation', note: 'Curated private investor network',
    trial: 'Application Required', bestFor: 'Investors & strategic partners in education',
    features: ['Founder deal flow', 'Investment opportunities', 'Private investor rooms', 'AI matching'],
  },
  {
    id: 'tutor', name: 'Tutors',
    price: '$49/mo', note: '+ $99 one-time application fee',
    trial: 'Application Required', bestFor: 'Elite tutors & academic coaches',
    features: ['Student matching', 'Scheduling tools', 'AI lesson support', 'Session analytics'],
  },
];

function PlanCard({ plan, isSelected, onSelect, billing, specialty }) {
  const [expanded, setExpanded] = useState(false);
  const price = !specialty ? (billing === 'monthly' ? plan.price_monthly : plan.price_annual) : null;
  const Icon = PLAN_ICONS[plan.id] || Star;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? plan.highlight
            ? 'border-white bg-white/[0.08] shadow-2xl shadow-white/10'
            : 'border-white bg-white/[0.06] shadow-xl shadow-white/5'
          : plan.highlight
            ? 'border-white/30 bg-white/[0.04] hover:border-white/50'
            : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
      }`}
      onClick={() => onSelect(plan.id)}
    >
      {plan.badge && (
        <div className="absolute top-3 right-3">
          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white text-[#07080f]">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white' : 'bg-white/[0.07]'}`}>
            <Icon className={`w-4.5 h-4.5 ${isSelected ? 'text-[#07080f]' : 'text-white/50'}`} style={{ width: 18, height: 18 }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-black text-sm leading-tight">{plan.name}</h3>
            <p className="text-white/35 text-[11px] mt-0.5 leading-snug">{plan.bestFor}</p>
          </div>
          <div className="text-right flex-shrink-0">
            {price !== null && price !== undefined ? (
              <div>
                <span className="text-white font-black text-xl">${price}</span>
                <span className="text-white/30 text-xs">/mo</span>
              </div>
            ) : (
              <span className="text-white font-black text-sm">{plan.price}</span>
            )}
            <p className="text-white/30 text-[10px] mt-0.5">{plan.trial}</p>
          </div>
        </div>

        {billing === 'annually' && price && (
          <p className="text-green-400 text-[11px] font-bold mb-3">
            💚 Save ${(plan.price_monthly - plan.price_annual) * 12}/year
          </p>
        )}

        <button onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
          className="flex items-center gap-1 text-white/25 text-[11px] font-bold hover:text-white/50 transition-colors">
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide' : 'View'} features
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-1.5 overflow-hidden">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                  <Check className="w-3 h-3 text-white/35 flex-shrink-0" strokeWidth={3} /> {f}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {isSelected && (
        <div className="border-t border-white/10 px-5 py-2.5 bg-white/[0.04] flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Check className="w-2.5 h-2.5 text-[#07080f]" strokeWidth={3} />
          </div>
          <span className="text-white/80 text-xs font-black">Selected — continue to billing</span>
        </div>
      )}
    </motion.div>
  );
}

export default function OnboardingTiers({ selected, onSelect, onNext }) {
  const [billing, setBilling] = useState('monthly');
  const [showSpecialty, setShowSpecialty] = useState(false);

  return (
    <div className="min-h-screen bg-[#07080f] flex flex-col" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Fixed top bar */}
      <div className="sticky top-0 z-20 bg-[#07080f]/90 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <img
          src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
          alt="edXponential" className="h-8 w-auto object-contain"
        />
        <div className="flex items-center gap-2">
          {['Tier', 'Billing', 'Profile', 'Tour', 'Launch'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1 ${i === 0 ? 'text-white' : 'text-white/20'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/20'}`} />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block">{s}</span>
              </div>
              {i < 4 && <div className="w-4 h-px bg-white/10 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>
        <div className="w-24 hidden sm:block" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-12 pb-24">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.25em] mb-4">Step 1 of 5 · Membership</p>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tight mb-4">
              Choose Your<br />Future.
            </h1>
            <p className="text-white/40 text-base leading-relaxed max-w-md mx-auto">
              Select the experience built for your goals, growth, leadership, and impact.
            </p>
            <p className="text-white/20 text-sm mt-2 font-semibold">Your journey starts here.</p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center mb-8">
            <div className="inline-flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
              {['monthly', 'annually'].map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${billing === b ? 'bg-white text-[#07080f]' : 'text-white/35 hover:text-white/60'}`}>
                  {b === 'annually' ? 'Annual — Save 20%' : 'Monthly'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Plans */}
          <div className="space-y-3 mb-5">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                <PlanCard plan={plan} isSelected={selected === plan.id} onSelect={onSelect} billing={billing} />
              </motion.div>
            ))}
          </div>

          {/* Specialty toggle */}
          <button onClick={() => setShowSpecialty(!showSpecialty)}
            className="w-full flex items-center justify-center gap-2 text-white/25 text-xs font-bold hover:text-white/50 transition-colors py-3 border border-white/[0.06] rounded-2xl mb-3">
            {showSpecialty ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showSpecialty ? 'Hide' : 'View'} specialty memberships — edVisors™ · edVestors™ · Tutors
          </button>

          <AnimatePresence>
            {showSpecialty && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden mb-5">
                {SPECIALTY.map(plan => (
                  <PlanCard key={plan.id} plan={plan} isSelected={selected === plan.id} onSelect={onSelect} billing={billing} specialty />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
            <button onClick={onNext} disabled={!selected}
              className="w-full bg-white text-[#07080f] font-black py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all text-sm shadow-2xl shadow-white/10">
              {selected ? 'Continue to Billing' : 'Select a Membership to Continue'}
              {selected && <ArrowRight className="w-4 h-4" />}
            </button>
            <p className="text-center text-white/20 text-[11px]">
              Cancel anytime · No charge until trial ends · All plans include free trial access
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}