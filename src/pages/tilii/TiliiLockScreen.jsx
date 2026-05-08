import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Lock, CheckCircle, ArrowRight, Shield, Star, X, CreditCard, Check, Zap, ExternalLink } from 'lucide-react';

const FEATURES = [
  'Unlimited video streaming', 'AI-curated content', 'Exclusive creator channels',
  'Live sessions & events', 'Premium documentaries', 'Ad-free viewing',
  'AI learning recommendations', 'Community access',
];

const BLURRED_VIDEOS = [
  { title: 'Leadership Through Crisis', type: 'Masterclass', thumb: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=60&auto=format' },
  { title: 'The AI Classroom', type: 'Series', thumb: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=60&auto=format' },
  { title: 'Building Culture', type: 'Documentary', thumb: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=60&auto=format' },
  { title: 'Founder\'s Blueprint', type: 'Masterclass', thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=60&auto=format' },
  { title: 'Mindful Leadership', type: 'Series', thumb: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=60&auto=format' },
  { title: 'Literacy Revolution', type: 'Talk', thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=60&auto=format' },
];

const METHODS = ['Credit / Debit Card', 'PayPal', 'Apple Pay', 'Google Pay', 'Affirm'];

function PaywallModal({ onClose, onSuccess, discountApplied }) {
  const [method, setMethod] = useState(0);
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [authorized, setAuthorized] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fmt = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d; };
  const isCardOk = card.name && card.number.replace(/\s/g, '').length === 16 && card.expiry.length === 5 && card.cvv.length >= 3;
  const canSubmit = (method !== 0 || isCardOk) && authorized;
  const price = discountApplied ? 2 : 7;

  const handleSubmit = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    onSuccess();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#0d0d0d] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative max-h-[92vh] overflow-y-auto">

        <div className="px-6 pt-6 pb-4 border-b border-white/[0.07] relative">
          <button onClick={onClose} className="absolute top-5 right-5 text-white/25 hover:text-white/60 transition-colors"><X className="w-4 h-4" /></button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-black fill-black ml-0.5" />
            </div>
            <span className="text-white font-black text-base">TiliiVisxion Premium</span>
          </div>
          {discountApplied && (
            <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-3 py-1 text-[11px] font-black mb-2">
              🎉 $5 discount applied — First month only $2
            </div>
          )}
          <p className="text-white/35 text-xs">Start your free trial. No charge for 7 days.</p>
        </div>

        <div className="px-6 py-4 border-b border-white/[0.07] bg-white/[0.02]">
          <p className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-3">Order Summary</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-white/45">Plan</span><span className="text-white font-bold">TiliiVisxion Premium</span></div>
            <div className="flex justify-between"><span className="text-white/45">Trial Period</span><span className="text-white font-semibold">7 days free</span></div>
            <div className="flex justify-between"><span className="text-white/45">After Trial</span><span className="text-white font-semibold">${price}/month{discountApplied ? ' (then $7/mo)' : ''}</span></div>
            <div className="border-t border-white/[0.08] pt-2 flex justify-between">
              <span className="text-white font-black text-sm">Due Today</span>
              <span className="text-white font-black text-xl">$0.00</span>
            </div>
          </div>
          <p className="text-white/30 text-[11px] text-center mt-2">✓ You will not be charged until your 7-day free trial ends</p>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-2">Payment Method</p>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.slice(0, 4).map((m, i) => (
                <button key={m} onClick={() => setMethod(i)}
                  className={`py-2.5 px-3 rounded-xl border-2 text-[11px] font-bold transition-all text-center ${method === i ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/40 hover:border-white/25'}`}>
                  {m}
                </button>
              ))}
            </div>
            <button onClick={() => setMethod(4)} className={`w-full mt-2 py-2.5 rounded-xl border-2 text-[11px] font-bold transition-all ${method === 4 ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/40 hover:border-white/25'}`}>
              Affirm — Pay Over Time
            </button>
          </div>

          {method === 0 && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {[
                { label: 'Cardholder Name', placeholder: 'Jane Smith', value: card.name, onChange: e => setCard({ ...card, name: e.target.value }) },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-1 block">{f.label}</label>
                  <input placeholder={f.placeholder} value={f.value} onChange={f.onChange}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25" />
                </div>
              ))}
              <div className="relative">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-1 block">Card Number</label>
                <input placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard({ ...card, number: fmt(e.target.value) })}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 pr-9" />
                <CreditCard className="absolute right-3 bottom-2.5 w-4 h-4 text-white/15" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-1 block">Expiry</label>
                  <input placeholder="MM/YY" value={card.expiry} onChange={e => setCard({ ...card, expiry: fmtExp(e.target.value) })}
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

          {method > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-center">
              <p className="text-white/45 text-sm">You'll be securely redirected to {METHODS[method]} to complete authorization.</p>
            </motion.div>
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <div onClick={() => setAuthorized(!authorized)}
              className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 mt-0.5 transition-all ${authorized ? 'border-white bg-white' : 'border-white/20'}`}>
              {authorized && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
            </div>
            <span className="text-white/35 text-[11px] leading-relaxed">
              I authorize edXponential to charge <strong className="text-white/55">${price}/month</strong> after my 7-day free trial. Cancel anytime.
            </span>
          </label>

          <div className="flex items-center justify-center gap-4 text-white/20">
            {[Shield, Lock, Check].map((Icon, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px]"><Icon className="w-3 h-3" /> {['Secure', 'Encrypted', 'PCI'][i]}</span>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit || processing}
            className="w-full bg-white text-black font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all text-sm">
            {processing ? (
              <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Activating…</>
            ) : (
              <><Play className="w-4 h-4 fill-current" /> Unlock TiliiVisxion — Free for 7 Days</>
            )}
          </button>
          <p className="text-center text-white/20 text-[11px]">Cancel anytime before trial ends</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EcosystemModal({ onClose, onSubscribe }) {
  const [phase, setPhase] = useState('main');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {phase === 'main' && (
          <motion.div key="main" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }} className="bg-[#0d0d0d] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden relative">
            <button onClick={onClose} className="absolute top-5 right-5 text-white/25 hover:text-white/60"><X className="w-4 h-4" /></button>
            <div className="px-7 pt-7 pb-5 border-b border-white/[0.07]">
              <h2 className="text-2xl font-black text-white mb-2">Want the full edXponential experience?</h2>
              <p className="text-white/40 text-sm">TiliiVisxion is even more powerful inside the edXponential ecosystem.</p>
            </div>
            <div className="px-7 py-5 grid grid-cols-2 gap-2 border-b border-white/[0.07]">
              {['AI video discovery', 'Creator channels', 'Coaching communities', 'Leadership masterclasses', 'AI learning playlists', 'Educator networking', 'Investor & founder network', 'edVisors™ coaching'].map(b => (
                <div key={b} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white/40 flex-shrink-0" strokeWidth={3} /><span className="text-white/55 text-xs font-semibold">{b}</span></div>
              ))}
            </div>
            <div className="px-7 py-5 space-y-3">
              <a href="https://www.edxponential.org?utm_source=tilii" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-black font-black px-6 py-3.5 rounded-2xl hover:bg-zinc-100 transition-all text-sm w-full">
                Yes, Join edXponential <ExternalLink className="w-4 h-4" />
              </a>
              <button onClick={() => setPhase('retention')} className="w-full border border-white/10 text-white/50 font-bold px-6 py-3.5 rounded-2xl hover:bg-white/5 hover:text-white transition-all text-sm">
                Not Now — Just TiliiVisxion
              </button>
              <a href="https://www.edxponential.org?utm_source=tilii" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-white/25 text-xs font-bold hover:text-white/50 transition-colors w-full">
                Learn More <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
        {phase === 'retention' && (
          <motion.div key="ret" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} className="bg-[#0d0d0d] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative">
            <button onClick={onClose} className="absolute top-5 right-5 text-white/25 hover:text-white/60"><X className="w-4 h-4" /></button>
            <div className="px-7 pt-7 pb-5 border-b border-white/[0.07] text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h2 className="text-2xl font-black text-white mb-1">Before you go…</h2>
              <p className="text-white/40 text-sm">Here's $5 off your first month.</p>
            </div>
            <div className="px-7 py-6 text-center border-b border-white/[0.07]">
              <div className="flex items-baseline justify-center gap-3 my-3">
                <span className="text-white/30 text-xl font-black line-through">$7</span>
                <span className="text-white text-5xl font-black">$2</span>
                <span className="text-white/50 text-sm font-semibold">/first month</span>
              </div>
              <p className="text-white/25 text-xs">Then $7/month — cancel anytime</p>
            </div>
            <div className="px-7 py-5 space-y-3">
              <button onClick={() => onSubscribe(true)} className="w-full bg-white text-black font-black py-3.5 rounded-2xl hover:bg-zinc-100 transition-all text-sm">🎉 Accept Offer — First Month $2</button>
              <button onClick={() => onSubscribe(false)} className="w-full border border-white/10 text-white/40 font-bold py-3 rounded-2xl hover:bg-white/5 hover:text-white/60 transition-all text-sm">Continue Without Offer ($7/mo)</button>
              <button onClick={onClose} className="w-full text-white/20 text-xs hover:text-white/40 transition-colors py-1">No thanks</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TiliiLockScreen({ onUnlock }) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [discount, setDiscount] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-hidden relative" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Blurred video grid background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="blur-md opacity-15 absolute inset-0 pt-16 px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {BLURRED_VIDEOS.map((v, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900">
                <img src={v.thumb} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-[#080808]/80 to-[#080808]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
          </div>
          <span className="font-black text-xl tracking-tight">TiliiVisxion</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.06] rounded-full px-4 py-1.5 mb-8">
          <Lock className="w-3 h-3 text-white/50" />
          <span className="text-white/50 text-[11px] tracking-widest uppercase font-black">Premium Access Only</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-4">
          Unlock TiliiVisxion.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="text-white/45 text-base md:text-lg max-w-xl mx-auto mb-3">
          Access the future of intelligent video.
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-white/25 text-sm max-w-lg mx-auto mb-10">
          The world's first human and AI-powered video platform for learning, leadership, storytelling, and human potential.
        </motion.p>

        {/* Pricing */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="flex items-center gap-3 mb-10 flex-wrap justify-center">
          <div className="bg-white text-black font-black text-sm px-5 py-2.5 rounded-full">Free for 7 Days</div>
          <span className="text-white/30 text-sm">then</span>
          <div className="border border-white/15 text-white font-black text-sm px-5 py-2.5 rounded-full">Only $7/month</div>
          <span className="text-white/25 text-xs font-semibold">· Cancel anytime</span>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-2 max-w-lg mx-auto mb-10 text-left">
          {FEATURES.map(f => (
            <div key={f} className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
              <span className="text-white/55 text-xs font-semibold">{f}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
          <button onClick={() => setShowPaywall(true)}
            className="flex items-center justify-center gap-2 bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-zinc-100 transition-all shadow-2xl shadow-white/10 text-sm">
            <Play className="w-4 h-4 fill-current" /> Start Free Trial <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setShowEcosystem(true)}
            className="flex items-center justify-center gap-2 border border-white/15 text-white/60 font-bold px-8 py-4 rounded-2xl hover:bg-white/5 hover:text-white transition-all text-sm">
            Join edXponential
          </button>
          <button onClick={() => setShowEcosystem(true)}
            className="flex items-center justify-center gap-2 border border-white/10 text-white/35 font-bold px-6 py-4 rounded-2xl hover:bg-white/5 hover:text-white/60 transition-all text-sm">
            Learn More
          </button>
        </motion.div>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          onClick={() => setShowPaywall(true)} className="text-white/25 text-xs font-bold hover:text-white/50 transition-colors">
          Already a member? Sign In
        </motion.button>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="flex items-center gap-5 flex-wrap justify-center mt-10">
          {[[Shield, 'Secure Checkout'], [Lock, 'Encrypted'], [CheckCircle, 'PCI-Compliant'], [Star, 'Trusted']].map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-white/20">
              <Icon className="w-3 h-3" /><span className="text-[11px] font-semibold">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-white/12 text-xs mt-10 italic">
          "Don't just watch content. Watch your future unfold."
        </motion.p>
      </div>

      <AnimatePresence>
        {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onSuccess={onUnlock} discountApplied={discount} />}
      </AnimatePresence>
      <AnimatePresence>
        {showEcosystem && (
          <EcosystemModal onClose={() => setShowEcosystem(false)} onSubscribe={(withDiscount) => {
            setDiscount(withDiscount);
            setShowEcosystem(false);
            setShowPaywall(true);
          }} />
        )}
      </AnimatePresence>
    </div>
  );
}