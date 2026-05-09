import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import EdxEmoji from '@/components/design-system/EdxEmoji';

const HEADLINES = [
  'Lead Differently.',
  'Build Boldly.',
  'Scale Exponentially.',
  'Invest Strategically.',
  'Transform Education.',
];

const FEATURES = [
  { emojiName: 'brain', label: 'AI Coaching & Strategy' },
  { emojiName: 'spark', label: 'School Intelligence' },
  { emojiName: 'rocket', label: 'Founder Deal Room' },
  { emojiName: 'grad', label: 'Elite Courses' },
  { emojiName: 'handshake', label: 'Private Communities' },
  { emojiName: 'zap', label: 'Xschores™ Analytics' },
  { emojiName: 'crown', label: 'Expert edVisors' },
  { emojiName: 'grow', label: 'Investor Network' },
  { emojiName: 'trophy', label: 'Leadership Masterminds' },
  { emojiName: 'orb', label: 'TubedX™ Video' },
];

const SOCIAL = ['Charter School Leaders', 'Founders', 'Superintendents', 'Turnaround Leaders', 'EdTech Builders', 'Education Investors'];

export default function OnboardingWelcome({ onNext, onSkip }) {
  const [hlIndex, setHlIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHlIndex(i => (i + 1) % HEADLINES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080f] flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
        className="mb-10 flex flex-col items-center gap-2">
        <img
          src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
          alt="edXponential"
          className="h-14 w-auto object-contain mx-auto"
        />
        <div className="w-16 h-px bg-white/10" />
      </motion.div>

      {/* Eyebrow */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] rounded-full px-4 py-1.5 mb-8">
        <Sparkles className="w-3 h-3 text-white/40" />
        <span className="text-white/40 text-[11px] tracking-widest uppercase font-black">The Future of Education Leadership</span>
      </motion.div>

      {/* Animated headline */}
      <div className="h-[80px] flex items-center justify-center mb-4">
        <AnimatePresence mode="wait">
          <motion.h1
            key={hlIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight"
          >
            {HEADLINES[hlIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="text-white/40 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
        edXponential is the world's first human- and AI-powered operating system built exclusively for education founders, principals, executives, tutors, and transformational leaders.
      </motion.p>

      {/* Feature chips */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-14">
        {FEATURES.map((f, i) => (
          <motion.div key={f.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.04 }}
            className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1.5 text-xs text-white/60 font-semibold">
            <EdxEmoji name={f.emojiName} size={16} /> {f.label}
          </motion.div>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        <button onClick={onNext}
          className="flex items-center justify-center gap-2 bg-white text-[#07080f] font-black px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all text-sm shadow-2xl shadow-white/10">
          Show Me Everything <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={onSkip}
          className="flex items-center justify-center gap-2 border border-white/10 text-white/50 font-bold px-8 py-4 rounded-2xl hover:bg-white/5 hover:text-white/80 transition-all text-sm">
          I'll Explore on My Own
        </button>
      </motion.div>

      {/* Social proof */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <p className="text-white/20 text-[10px] uppercase tracking-widest font-black mb-3">Trusted by</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SOCIAL.map(s => (
            <span key={s} className="text-[11px] text-white/30 border border-white/[0.06] rounded-full px-3 py-1 font-semibold">{s}</span>
          ))}
        </div>
      </motion.div>

      {/* No-billing promise */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
        className="text-white/20 text-xs mt-10">
        No credit card required to explore · Billing only after you choose a plan
      </motion.p>
    </div>
  );
}