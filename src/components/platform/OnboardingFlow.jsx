import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { School, Building2, TrendingUp, BookOpen, ArrowRight, ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ACCOUNT_TYPES = [
  {
    id: 'principal_leader',
    icon: School,
    title: 'Principal / Leader',
    description: 'I lead or manage a school or educational organization.',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    activeColor: 'bg-blue-600 border-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'founder_school_owner',
    icon: Building2,
    title: 'Founder / School Owner',
    description: 'I founded or own an educational institution or edtech company.',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    activeColor: 'bg-purple-600 border-purple-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'investor',
    icon: TrendingUp,
    title: 'Investor',
    description: 'I invest in or fund educational organizations and initiatives.',
    color: 'bg-green-50 border-green-200 hover:border-green-400',
    activeColor: 'bg-green-600 border-green-600',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'educator_teacher',
    icon: BookOpen,
    title: 'Educator / Teacher',
    description: 'I teach, tutor, or work directly with students.',
    color: 'bg-orange-50 border-orange-200 hover:border-orange-400',
    activeColor: 'bg-orange-600 border-orange-600',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

function AccountTypeStep({ selected, onSelect, onNext }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white mb-2">What best describes you?</h2>
        <p className="text-white/50 text-sm">Select your account type to personalize your experience.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACCOUNT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-white border-white scale-[1.02] shadow-xl'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                isSelected ? type.iconBg : 'bg-white/10'
              }`}>
                <Icon className={`w-5 h-5 ${isSelected ? type.iconColor : 'text-white/60'}`} />
              </div>
              <h3 className={`font-black text-sm mb-1 ${isSelected ? 'text-[#0a0f1e]' : 'text-white'}`}>
                {type.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isSelected ? 'text-gray-500' : 'text-white/40'}`}>
                {type.description}
              </p>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full bg-white text-[#0a0f1e] font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
      >
        Continue <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function PaymentStep({ onNext, onBack }) {
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const isValid = card.name && card.number.replace(/\s/g, '').length === 16 && card.expiry.length === 5 && card.cvv.length >= 3;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white mb-2">Billing Information</h2>
        <p className="text-white/50 text-sm">Your payment details are encrypted and secure.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <div>
          <label className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1.5 block">Cardholder Name</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={card.name}
            onChange={e => setCard({ ...card, name: e.target.value })}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1.5 block">Card Number</label>
          <div className="relative">
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={card.number}
              onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 pr-10"
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1.5 block">Expiry</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={card.expiry}
              onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1.5 block">CVV</label>
            <input
              type="text"
              placeholder="123"
              maxLength={4}
              value={card.cvv}
              onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-white/30 text-xs justify-center">
        <Lock className="w-3 h-3" /> 256-bit SSL encrypted — your info is never stored in plain text
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 bg-white text-[#0a0f1e] font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
        >
          Complete Setup <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1); // 1 = account type, 2 = payment
  const [accountType, setAccountType] = useState(null);

  const handleFinish = async () => {
    try {
      await base44.auth.updateMe({ account_type: accountType, onboarding_complete: true });
    } catch (_) {}
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1e] flex items-center justify-center p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg w-full"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-white' : s < step ? 'w-4 bg-white/50' : 'w-4 bg-white/15'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <AccountTypeStep selected={accountType} onSelect={setAccountType} onNext={() => setStep(2)} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <PaymentStep onNext={handleFinish} onBack={() => setStep(1)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}