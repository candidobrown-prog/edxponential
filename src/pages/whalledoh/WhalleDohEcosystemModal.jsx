import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, Sparkles, ExternalLink } from 'lucide-react';

const EDX_URL = 'https://www.edxponential.org?utm_source=whalledoh';

const BENEFITS = [
  'AI educator discovery with WhallAI',
  'Coaching & mentorship communities',
  'Leadership certifications & courses',
  'Principal & Founder communities',
  'AI-powered school intelligence',
  'Exclusive investor & founder network',
  'Professional growth ecosystem',
  'edVisors™ — Expert coaching on demand',
];

export default function WhalleDohEcosystemModal({ onClose, onSubscribe }) {
  const [phase, setPhase] = useState('main'); // main | retention
  const [discountApplied, setDiscountApplied] = useState(false);

  const handleNotNow = () => setPhase('retention');
  const handleAcceptOffer = () => {
    setDiscountApplied(true);
    onClose();
    onSubscribe(true); // pass discount flag
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">

      <AnimatePresence mode="wait">
        {phase === 'main' && (
          <motion.div key="main"
            initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#0c0d17] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden relative">

            <button onClick={onClose} className="absolute top-5 right-5 text-white/25 hover:text-white/60 transition-colors z-10">
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="px-7 pt-7 pb-5 border-b border-white/[0.07]">
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1 mb-4">
                <Sparkles className="w-3 h-3 text-white/40" />
                <span className="text-white/40 text-[10px] tracking-widest uppercase font-black">edXponential Ecosystem</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Want the full<br />edXponential experience?</h2>
              <p className="text-white/40 text-sm leading-relaxed">WhalleDoh is even more powerful inside the edXponential ecosystem — where educators lead, build, invest, and transform education.</p>
            </div>

            {/* Benefits */}
            <div className="px-7 py-5 border-b border-white/[0.07]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BENEFITS.map(b => (
                  <div key={b} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white/50 flex-shrink-0" strokeWidth={3} />
                    <span className="text-white/55 text-xs font-semibold">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-7 py-5 space-y-3">
              <a href={EDX_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-[#07080f] font-black px-6 py-3.5 rounded-2xl hover:bg-gray-100 transition-all text-sm w-full">
                Yes, Join edXponential <ExternalLink className="w-4 h-4" />
              </a>
              <button onClick={handleNotNow}
                className="w-full border border-white/10 text-white/50 font-bold px-6 py-3.5 rounded-2xl hover:bg-white/5 hover:text-white transition-all text-sm">
                Not Now — Just WhalleDoh
              </button>
              <a href={EDX_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-white/25 text-xs font-bold hover:text-white/50 transition-colors w-full">
                Learn More <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}

        {phase === 'retention' && (
          <motion.div key="retention"
            initial={{ opacity: 0, scale: 0.96, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#0c0d17] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative">

            <button onClick={onClose} className="absolute top-5 right-5 text-white/25 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>

            <div className="px-7 pt-7 pb-5 border-b border-white/[0.07] text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Before you go…</h2>
              <p className="text-white/40 text-sm">Here's a special offer just for you.</p>
            </div>

            <div className="px-7 py-6 text-center border-b border-white/[0.07]">
              <p className="text-white/40 text-sm mb-2">Here's <span className="text-white font-black">$5 off</span> your first month of WhalleDoh.</p>
              <div className="flex items-baseline justify-center gap-3 my-4">
                <span className="text-white/30 text-xl font-black line-through">$7</span>
                <span className="text-white text-5xl font-black">$2</span>
                <span className="text-white/50 text-sm font-semibold">/first month</span>
              </div>
              <p className="text-white/25 text-xs">Then $7/month — cancel anytime</p>
            </div>

            <div className="px-7 py-5 space-y-3">
              <button onClick={handleAcceptOffer}
                className="w-full bg-white text-[#07080f] font-black py-3.5 rounded-2xl hover:bg-gray-100 transition-all text-sm flex items-center justify-center gap-2">
                🎉 Accept Offer — First Month $2
              </button>
              <button onClick={onSubscribe}
                className="w-full border border-white/10 text-white/40 font-bold py-3 rounded-2xl hover:bg-white/5 hover:text-white/60 transition-all text-sm">
                Continue Without Offer ($7/mo)
              </button>
              <button onClick={onClose}
                className="w-full text-white/20 font-bold text-xs hover:text-white/40 transition-colors py-1">
                No thanks, I'll skip WhalleDoh for now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}