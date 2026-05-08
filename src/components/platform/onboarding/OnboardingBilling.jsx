import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, ArrowRight, Check, Shield } from 'lucide-react';
import OnboardingShell from './OnboardingShell';

const PLAN_LABELS = {
  potentials: 'Potentials',
  principal: 'Principal Park',
  founders: 'Founders Sphere',
  executive: 'Executive Entourage',
  edvisor: 'edVisors™',
  edvestor: 'edVestors™',
};

const PLAN_PRICES = {
  potentials: 29,
  principal: 49,
  founders: 99,
  executive: 129,
  edvisor: 249,
  edvestor: null,
};

const PLAN_TRIALS = {
  potentials: '7-day free trial',
  principal: '7-day free trial',
  founders: '7 days for $19',
  executive: '7-day free trial',
  edvisor: 'Application required',
  edvestor: 'By invitation',
};

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'affirm', label: 'Affirm · Pay Over Time' },
];

export default function OnboardingBilling({ plan, onNext, onBack }) {
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [authorized, setAuthorized] = useState(false);
  const [processing, setProcessing] = useState(false);

  const planLabel = PLAN_LABELS[plan] || 'Selected Plan';
  const planPrice = PLAN_PRICES[plan];
  const planTrial = PLAN_TRIALS[plan] || '7-day free trial';

  const formatNumber = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  const isCardValid = card.name && card.number.replace(/\s/g, '').length === 16 && card.expiry.length === 5 && card.cvv.length >= 3;
  const canSubmit = (method === 'card' ? isCardValid : true) && authorized;

  const handleSubmit = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1600));
    setProcessing(false);
    onNext();
  };

  return (
    <OnboardingShell step={2} totalSteps={5} label="Billing">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white mb-2">Start your free trial.</h2>
          <p className="text-white/35 text-sm">You won't be charged until your trial ends.</p>
        </div>

        {/* Order summary */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-white/30 mb-3">Order Summary</p>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Plan</span>
            <span className="text-white font-bold">{planLabel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Trial Period</span>
            <span className="text-white font-semibold">{planTrial}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">After Trial</span>
            <span className="text-white font-semibold">{planPrice ? `$${planPrice}/mo` : 'Custom pricing'}</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between">
            <span className="text-white font-black">Due Today</span>
            <span className="text-white font-black text-xl">
              {plan === 'founders' ? '$19' : plan === 'edvisor' ? '$99 application fee' : '$0'}
            </span>
          </div>
          {plan !== 'founders' && plan !== 'edvisor' && (
            <p className="text-white/30 text-xs text-center">✓ Your card will not be charged until the trial ends</p>
          )}
        </div>

        {/* Payment method selector */}
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-white/30 mb-2">Payment Method</p>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                  method === m.id ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
                }`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card form */}
        {method === 'card' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-1.5 block">Cardholder Name</label>
              <input placeholder="Jane Smith" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/30" />
            </div>
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-1.5 block">Card Number</label>
              <input placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard({ ...card, number: formatNumber(e.target.value) })}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/30 pr-10" />
              <CreditCard className="absolute right-3 bottom-3.5 w-4 h-4 text-white/20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-1.5 block">Expiry</label>
                <input placeholder="MM/YY" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-1.5 block">CVV</label>
                <input placeholder="123" maxLength={4} value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/30" />
              </div>
            </div>
            {/* Accepted cards */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-white/25 text-[10px] font-bold">Accepted:</span>
              {['Visa', 'Mastercard', 'Amex', 'Discover', 'Debit', 'Apple Pay', 'Google Pay'].map(c => (
                <span key={c} className="text-[10px] text-white/30 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5 font-semibold">{c}</span>
              ))}
            </div>
          </motion.div>
        )}

        {method === 'paypal' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-center">
            <p className="text-white/50 text-sm">You'll be redirected to PayPal to complete authorization.</p>
          </motion.div>
        )}

        {method === 'affirm' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-center">
            <p className="text-white/50 text-sm">Affirm eligibility will be checked. Rates from 0%–36% APR.</p>
          </motion.div>
        )}

        {/* Authorization */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div onClick={() => setAuthorized(!authorized)}
            className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 mt-0.5 transition-all ${authorized ? 'border-white bg-white' : 'border-white/20 bg-transparent'}`}>
            {authorized && <Check className="w-3 h-3 text-[#07080f]" strokeWidth={3} />}
          </div>
          <span className="text-white/40 text-xs leading-relaxed">
            I authorize edXponential to store my payment method and charge it after my trial period ends.
            I understand I can cancel anytime before the trial ends at no charge.
          </span>
        </label>

        {/* Security */}
        <div className="flex items-center justify-center gap-2 text-white/20 text-xs">
          <Lock className="w-3 h-3" /> 256-bit SSL · Tokenized · PCI-DSS compliant
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={onBack}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all font-bold">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit || processing}
            className="flex-1 bg-white text-[#07080f] font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-gray-100 transition-all">
            {processing ? (
              <><span className="w-4 h-4 border-2 border-[#07080f]/30 border-t-[#07080f] rounded-full animate-spin" /> Processing...</>
            ) : (
              <>Start Free Trial <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        <p className="text-center text-white/20 text-[11px]">Cancel anytime before trial ends. No questions asked.</p>
      </div>
    </OnboardingShell>
  );
}