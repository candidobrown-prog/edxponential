import React from 'react';
import { motion } from 'framer-motion';

export default function OnboardingShell({ children, step, totalSteps = 5, label }) {
  const pct = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#07080f] flex flex-col items-center justify-start px-6 py-10">
      {/* Logo */}
      <div className="mb-8 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-7 w-auto object-contain opacity-80"
          />
          {label && <span className="text-white/25 text-xs font-bold uppercase tracking-widest">{label}</span>}
        </div>
        {/* Progress bar */}
        <div className="h-[2px] bg-white/[0.07] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full transition-all ${i + 1 <= step ? 'bg-white' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}