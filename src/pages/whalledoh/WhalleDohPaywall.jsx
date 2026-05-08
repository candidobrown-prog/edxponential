import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Lock, Check, ArrowRight, Shield, Zap } from 'lucide-react';

const PLAN = { name: 'WhalleDoh Premium', trial: '7-Day Free Trial', price: 7, trialPrice: 0 };

const METHODS = [
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'apple', label: 'Apple Pay' },
  { id: 'google', label: 'Google Pay' },
  { id: 'affirm', label: 'Affirm — Pay Later' },
];

export default function WhalleDohPaywall({ onClose, onSuccess, discountApplied = false }) {
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [authorized, setAuthorized] = useState(false);
  const [processing, setProcessing] = useState(false);

  const formatNumber = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d; };
  const isCardValid = card.name && card.number.replace(/\s/g, '').length === 16 && card.expiry.length === 5 && card.cvv.length >= 3;
  const canSubmit = (method !== 'card' || isCardValid) && authorized;

  const effectiveMonthly = discountApplied ? 2 : PLAN.price;

  const handleSubmit = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    onSuccess();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#0c0d17] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.07] relative">
          <button onClick={onClose} className="absolute top-5 right-5 text-white/25 hover:text-white/60 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[#07080f] font-black text-sm">W</span>
            </div>
            <span className="text-white font-black text-base">WhalleDoh Premium</span>
          </div>
          {discountApplied && (
            <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-3 py-1 text-[11px] font-black mb-3">
              🎉 $5 discount applied — First month only $2
            </div>
          )}
          <p className="text-white/35 text-xs">Start your free trial. No charge for 7 days.</p>
        </div>

        {/* Order summary */}
        <div className="px-6 py-4 border-b border-white/[0.07] bg-white/[0.02]">
          <p className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-3">Order Summary</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Plan</span>
              <span className="text-white font-bold">WhalleDoh Premium</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Trial Period</span>
              <span className="text-white font-semibold">7 days free</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">After Trial</span>
              <span className="text-white font-semibold">${effectiveMonthly}/month{discountApplied ? ' (then $7/mo)' : ''}</span>
            </div>
            <div className="border-t border-white/[0.08] pt-2 flex justify-between">
              <span className="text-white font-black text-sm">Due Today</span>
              <span className="text-white font-black text-xl">$0.00</span>
            </div>
          </div>
          <p className="text-white/30 text-[11px] text-center mt-2">✓ You will not be charged until your 7-day free trial ends</p>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Payment method */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-2">Payment Method</p>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.slice(0, 4).map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`py-2.5 px-3 rounded-xl border-2 text-[11px] font-bold transition-all text-center leading-tight ${method === m.id ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'}`}>
                  {m.label}
                </button>
              ))}
            </div>
            <button onClick={() => setMethod('affirm')}
              className={`w-full mt-2 py-2.5 px-3 rounded-xl border-2 text-[11px] font-bold transition-all ${method === 'affirm' ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/40 hover:border-white/25'}`}>
              Affirm — Pay Over Time
            </button>
          </div>

          {/* Card form */}
          {method === 'card' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-1 block">Cardholder Name</label>
                <input placeholder="Jane Smith" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25" />
              </div>
              <div className="relative">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-1 block">Card Number</label>
                <input placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard({ ...card, number: formatNumber(e.target.value) })}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 pr-9" />
                <CreditCard className="absolute right-3 bottom-2.5 w-4 h-4 text-white/15" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-1 block">Expiry</label>
                  <input placeholder="MM/YY" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-1 block">CVV</label>
                  <input placeholder="123" maxLength={4} value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Visa', 'Mastercard', 'Amex', 'Discover', 'Debit'].map(c => (
                  <span key={c} className="text-[10px] text-white/25 bg-white/[0.03] border border-white/[0.06] rounded px-1.5 py-0.5 font-semibold">{c}</span>
                ))}
              </div>
            </motion.div>
          )}

          {(method === 'paypal' || method === 'apple' || method === 'google') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 text-center">
              <p className="text-white/45 text-sm">You'll be securely redirected to {method === 'paypal' ? 'PayPal' : method === 'apple' ? 'Apple Pay' : 'Google Pay'} to complete authorization.</p>
            </motion.div>
          )}

          {method === 'affirm' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 text-center">
              <p className="text-white/45 text-sm">Affirm eligibility check — rates from 0–36% APR based on creditworthiness.</p>
            </motion.div>
          )}

          {/* Authorization */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div onClick={() => setAuthorized(!authorized)}
              className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 mt-0.5 transition-all ${authorized ? 'border-white bg-white' : 'border-white/20'}`}>
              {authorized && <Check className="w-3 h-3 text-[#07080f]" strokeWidth={3} />}
            </div>
            <span className="text-white/35 text-[11px] leading-relaxed">
              I authorize edXponential to store my payment method and charge <strong className="text-white/55">${effectiveMonthly}/month</strong> after my 7-day free trial ends. I can cancel anytime before the trial ends at no charge.
            </span>
          </label>

          {/* Security */}
          <div className="flex items-center justify-center gap-3 flex-wrap text-white/20">
            <span className="flex items-center gap-1 text-[10px]"><Shield className="w-3 h-3" /> Secure</span>
            <span className="flex items-center gap-1 text-[10px]"><Lock className="w-3 h-3" /> Encrypted</span>
            <span className="flex items-center gap-1 text-[10px]"><Check className="w-3 h-3" /> PCI-Compliant</span>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={!canSubmit || processing}
            className="w-full bg-white text-[#07080f] font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-gray-100 transition-all text-sm">
            {processing ? (
              <><span className="w-4 h-4 border-2 border-[#07080f]/30 border-t-[#07080f] rounded-full animate-spin" /> Activating Trial...</>
            ) : (
              <><Zap className="w-4 h-4" /> Unlock WhalleDoh — Free for 7 Days</>
            )}
          </button>

          <p className="text-center text-white/20 text-[11px]">Cancel anytime before trial ends · No questions asked</p>
        </div>
      </motion.div>
    </motion.div>
  );
}