import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import EddyCharacter from '@/components/eddy/EddyCharacter';

export default function OnboardingWelcome({ userName, onContinue }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,255,255,0.04),transparent)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl w-full text-center space-y-8"
      >
        {/* Eddy Character */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <EddyCharacter mood="welcoming" size="lg" />
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-tight">
            Welcome to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
              edXponential
            </span>
          </h1>
          <p className="text-lg text-white/40 leading-relaxed">
            I'm Eddy, your AI guide.
            <br />
            I'll create your personalized experience based on your goals.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="pt-4"
        >
          <Button
            onClick={onContinue}
            className="h-14 px-8 bg-white text-black text-lg font-semibold hover:bg-white/90 transition-all rounded-xl group"
          >
            <span>Let's get started</span>
            <Sparkles className="w-5 h-5 ml-2 group-hover:animate-spin" />
          </Button>
          <p className="text-xs text-white/20 mt-6">Takes about 2 minutes</p>
        </motion.div>
      </motion.div>
    </div>
  );
}