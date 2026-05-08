/**
 * edXponential Premium Loading & Wait States
 * Philosophy: "Beautiful enough to wait for."
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Minimal orbital spinner — default for most uses */
export function EdxSpinner({ size = 28, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="animate-spin">
      <circle cx="14" cy="14" r="11" stroke={`${color === 'white' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`} strokeWidth="1.5"/>
      <path d="M14 3a11 11 0 0 1 11 11" stroke={color === 'white' ? 'white' : '#0a0a0a'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/** AI neural pulse — for AI-generating states */
export function EdxAIPulse({ label = 'AI is thinking…' }) {
  const dots = [0, 1, 2, 3, 4];
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        {dots.map(i => (
          <motion.div key={i}
            className="absolute inset-0 rounded-full border border-white/20"
            animate={{ scale: [1, 1.8 + i * 0.3], opacity: [0.4, 0] }}
            transition={{ duration: 2, delay: i * 0.35, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-white/90" />
        </div>
      </div>
      {label && <p className="text-white/35 text-xs font-semibold tracking-wider uppercase">{label}</p>}
    </div>
  );
}

/** Progress bar — for multi-step flows */
export function EdxProgressBar({ progress = 0, label, color = 'white' }) {
  return (
    <div className="w-full space-y-1.5">
      {label && <p className="text-white/35 text-[10px] font-black uppercase tracking-widest">{label}</p>}
      <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color === 'white' ? 'bg-white' : 'bg-black'}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, progress)}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/** Full-screen premium loader — for route transitions / page loads */
export function EdxPageLoader({ message = 'Loading…', dark = true }) {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 ${dark ? 'bg-[#07080f]' : 'bg-white'}`}
    >
      <div className="relative">
        <EdxAIPulse label="" />
      </div>
      <div className="text-center space-y-1">
        <div className={`text-sm font-black tracking-widest uppercase ${dark ? 'text-white/40' : 'text-black/30'}`}>
          {message}{dots}
        </div>
        <div className={`w-24 h-px mx-auto ${dark ? 'bg-white/10' : 'bg-black/10'}`} />
      </div>
      <motion.div
        className={`text-[10px] font-black tracking-widest uppercase ${dark ? 'text-white/15' : 'text-black/15'}`}
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
      >
        edXponential
      </motion.div>
    </motion.div>
  );
}

/** Skeleton shimmer block */
export function EdxSkeleton({ className = '' }) {
  return (
    <motion.div
      className={`rounded-xl bg-white/[0.04] relative overflow-hidden ${className}`}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/** Card skeleton */
export function EdxCardSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-3">
      <div className="flex gap-3 items-center">
        <EdxSkeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <EdxSkeleton className="h-3 w-3/4" />
          <EdxSkeleton className="h-2.5 w-1/2" />
        </div>
      </div>
      <EdxSkeleton className="h-2.5 w-full" />
      <EdxSkeleton className="h-2.5 w-5/6" />
    </div>
  );
}

/** Inline button spinner */
export function EdxButtonLoader({ dark = false }) {
  return (
    <EdxSpinner size={16} color={dark ? 'black' : 'white'} />
  );
}