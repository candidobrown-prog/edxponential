import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

const PLAN_LABELS = {
  potentials: 'Potentials',
  principal: 'Principal Park',
  founders: 'Founders Sphere',
  executive: 'Executive Entourage',
  edvisor: 'edVisors™',
  edvestor: 'edVestors™',
};

const NEXT_STEPS = [
  { label: 'Explore your dashboard', sub: 'Your command center is ready' },
  { label: 'Join a community', sub: 'Connect with leaders like you' },
  { label: 'Book your first edVisor', sub: 'Get strategic coaching from day one' },
  { label: 'Ask Eddy anything', sub: 'Your AI assistant is ready' },
];

export default function OnboardingSuccess({ onEnter, plan }) {
  const [visible, setVisible] = useState(false);
  const planLabel = PLAN_LABELS[plan] || 'edXponential';

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080f] flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/[0.025] rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
        <img
          src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
          alt="edXponential"
          className="h-8 w-auto object-contain mx-auto opacity-80"
        />
      </motion.div>

      {/* Check icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 18 }}
        className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-8">
        <CheckCircle className="w-8 h-8 text-white" />
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-white/30 text-xs font-black uppercase tracking-widest mb-3">Welcome to {planLabel}</motion.p>

      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-5xl md:text-6xl font-black text-white leading-none tracking-tight mb-5">
        Your Future<br />Starts Now.
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
        className="text-white/40 text-base leading-relaxed max-w-sm mx-auto mb-12">
        Your journey into the world's most intelligent education leadership ecosystem starts now.
      </motion.p>

      {/* Next steps */}
      {visible && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="grid grid-cols-2 gap-3 w-full max-w-sm mb-10">
          {NEXT_STEPS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.07 }}
              className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 text-left">
              <div className="w-7 h-7 rounded-lg bg-white/10 mb-2" />
              <p className="text-white text-xs font-black mb-0.5">{s.label}</p>
              <p className="text-white/30 text-[11px]">{s.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
        onClick={onEnter}
        className="flex items-center gap-2 bg-white text-[#07080f] font-black px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all shadow-2xl shadow-white/10 text-sm">
        Enter the Platform <ArrowRight className="w-4 h-4" />
      </motion.button>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
        className="text-white/20 text-xs mt-8">Your dashboard is ready and waiting.</motion.p>
    </div>
  );
}