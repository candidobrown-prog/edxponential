import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';

const WELCOME_KEY = 'edx_welcome_shown';

export default function WelcomeScreen({ onChoice }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1e] flex items-center justify-center p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg w-full text-center">

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 mb-8">
          <Sparkles className="w-3 h-3 text-white/40" />
          <span className="text-white/40 text-xs tracking-widest uppercase font-black">Welcome to edXponential</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
          Welcome.<br />You've arrived.
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-white/40 text-base leading-relaxed mb-12 max-w-sm mx-auto">
          This is the world's most intelligent operating system for education leaders. How would you like to begin?
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Guided */}
          <button onClick={() => onChoice('guided')}
            className="group bg-white rounded-2xl p-7 text-left hover:bg-gray-50 transition-all hover:shadow-2xl hover:scale-[1.02]">
            <div className="w-11 h-11 bg-[#0a0f1e] rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-black text-[#0a0f1e] text-lg mb-2">Absolutely.</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Walk me through the platform step-by-step. I want the full guided experience.</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#0a0f1e] border-b border-[#0a0f1e] pb-0.5">
              Start Guided Tour
            </div>
          </button>

          {/* Self-guided */}
          <button onClick={() => onChoice('explore')}
            className="group bg-white/5 border border-white/10 rounded-2xl p-7 text-left hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-black text-white text-lg mb-2">Let me EdXplore.</h3>
            <p className="text-white/40 text-sm leading-relaxed">I'm ready to explore on my own. I'll ask for help when I need it.</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-black text-white/60 border-b border-white/20 pb-0.5">
              Enter Platform
            </div>
          </button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="text-white/20 text-xs mt-8">You can always access tutorials and the edX Assistant from your dashboard.</motion.p>
      </motion.div>
    </div>
  );
}