import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, CheckCircle, ArrowRight, Users, Globe, Star, Shield, X } from 'lucide-react';
import WhalleDohPaywall from './WhalleDohPaywall';
import WhalleDohEcosystemModal from './WhalleDohEcosystemModal';

const BLURRED_EDUCATORS = [
  { name: 'Dr. A. Morris', role: 'Superintendent', emoji: '🎓', verified: true },
  { name: 'Marcus Johnson', role: 'Principal', emoji: '🏫', verified: true },
  { name: 'Priya Nair', role: 'Founder', emoji: '📐', verified: false },
  { name: 'Carlos Rivera', role: 'Coach', emoji: '🤝', verified: true },
  { name: 'Sarah Kim', role: 'Special Ed', emoji: '💡', verified: false },
  { name: 'James Okafor', role: 'EdTech Founder', emoji: '🚀', verified: true },
  { name: 'Dr. K. Brown', role: 'Professor', emoji: '📚', verified: true },
  { name: 'Aisha Patel', role: 'Researcher', emoji: '🔬', verified: true },
  { name: 'Thomas White', role: 'Counselor', emoji: '🌱', verified: false },
];

const FEATURES = [
  'Unlimited educator discovery',
  'AI-powered networking with WhallAI',
  'Connect with educators globally',
  'Private community access',
  'Advanced search filters',
  'Personalized AI introductions',
  'Collaboration requests',
  'Mentor & mentee matching',
];

const STATS = [
  { value: '48K+', label: 'Educators' },
  { value: '120+', label: 'Countries' },
  { value: '2,400+', label: 'Communities' },
  { value: '98%', label: 'Satisfied' },
];

export default function WhalleDohLockScreen({ onUnlock }) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);

  return (
    <div className="min-h-screen bg-[#07080f] text-white overflow-hidden relative" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-white/[0.018] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-white/[0.01] rounded-full blur-3xl" />
      </div>

      {/* Blurred educator cards background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="blur-[3px] opacity-20 absolute inset-0 pt-20 px-6">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
            {BLURRED_EDUCATORS.map((e, i) => (
              <div key={i} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg mb-2">{e.emoji}</div>
                <div className="h-2.5 bg-white/20 rounded mb-1 w-3/4" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
        {/* Gradient fade over blurred cards */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080f]/40 via-[#07080f]/70 to-[#07080f]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <span className="text-[#07080f] font-black text-base">W</span>
          </div>
          <span className="font-black text-white text-xl tracking-tight">WhalleDoh</span>
        </motion.div>

        {/* Lock badge */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.06] rounded-full px-4 py-1.5 mb-8">
          <Lock className="w-3 h-3 text-white/50" />
          <span className="text-white/50 text-[11px] tracking-widest uppercase font-black">Premium Members Only</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-4 max-w-4xl">
          Unlock WhalleDoh.
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="text-white/45 text-base md:text-lg max-w-xl mx-auto mb-3">
          Find who and what you're looking for — whenever, wherever.
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-white/25 text-sm max-w-lg mx-auto mb-10">
          The world's first human and AI-powered educator discovery platform. 48,000+ educators. 120+ countries.
        </motion.p>

        {/* Pricing pill */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="flex items-center gap-3 mb-10 flex-wrap justify-center">
          <div className="bg-white text-[#07080f] font-black text-sm px-5 py-2.5 rounded-full">
            Free for 7 Days
          </div>
          <span className="text-white/30 text-sm">then</span>
          <div className="border border-white/15 text-white font-black text-sm px-5 py-2.5 rounded-full">
            Only $7/month
          </div>
          <span className="text-white/25 text-xs font-semibold">· Cancel anytime</span>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-10">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-white/30 text-[11px] font-semibold">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto mb-10 text-left">
          {FEATURES.map(f => (
            <div key={f} className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
              <span className="text-white/55 text-xs font-semibold">{f}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button onClick={() => setShowPaywall(true)}
            className="flex items-center justify-center gap-2 bg-white text-[#07080f] font-black px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all shadow-2xl shadow-white/10 text-sm">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setShowEcosystem(true)}
            className="flex items-center justify-center gap-2 border border-white/15 text-white/60 font-bold px-8 py-4 rounded-2xl hover:bg-white/5 hover:text-white transition-all text-sm">
            Learn More
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
          <button onClick={() => setShowPaywall(true)} className="text-white/25 text-xs font-bold hover:text-white/50 transition-colors">
            Already a member? Sign In
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}
          className="flex items-center gap-4 flex-wrap justify-center mt-10">
          {[
            { icon: Shield, label: 'Secure Checkout' },
            { icon: Lock, label: 'Encrypted Payments' },
            { icon: CheckCircle, label: 'PCI-Compliant' },
            { icon: Star, label: 'Trusted Processing' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-white/20">
              <Icon className="w-3 h-3" />
              <span className="text-[11px] font-semibold">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Mission quote */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}
          className="text-white/15 text-xs mt-10 italic max-w-sm">
          "No educator should have to grow alone."
        </motion.p>
      </div>

      {/* Paywall modal */}
      <AnimatePresence>
        {showPaywall && (
          <WhalleDohPaywall onClose={() => setShowPaywall(false)} onSuccess={onUnlock} discountApplied={discountApplied} />
        )}
      </AnimatePresence>

      {/* Ecosystem upsell modal */}
      <AnimatePresence>
        {showEcosystem && (
          <WhalleDohEcosystemModal
            onClose={() => setShowEcosystem(false)}
            onSubscribe={(withDiscount) => {
              if (withDiscount) setDiscountApplied(true);
              setShowEcosystem(false);
              setShowPaywall(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}