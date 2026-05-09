import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import EddyCharacter from '@/components/eddy/EddyCharacter';

const TIER_RECOMMENDATIONS = {
  founder: { tier: 'Founders Sphere', color: 'from-white to-white/60', tools: ['Charter Builder', 'AI Planning', 'Board Tools', 'Investor Network'] },
  principal: { tier: 'Principal Park', color: 'from-blue-300 to-blue-500', tools: ['School Leadership', 'Coaching', 'Assessment Tools', 'Team Development'] },
  executive: { tier: 'Executive Entourage', color: 'from-purple-300 to-purple-500', tools: ['Executive Dashboard', 'Data Analytics', 'Operations', 'Strategy'] },
  coach: { tier: 'edVisors', color: 'from-emerald-300 to-emerald-500', tools: ['Coaching Clients', 'Community', 'Course Creation', 'Earnings'] },
  investor: { tier: 'Deal Room', color: 'from-amber-300 to-amber-500', tools: ['Deal Sourcing', 'Pitch Analysis', 'Cap Table Tracking', 'Portfolio'] },
};

export default function OnboardingRecommendation({ responses, onComplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      const rec = TIER_RECOMMENDATIONS[responses.role] || TIER_RECOMMENDATIONS.principal;
      setRecommendation(rec);
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [responses]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808] flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="w-12 h-12 text-white/40" />
        </motion.div>
        <p className="text-white/50 mt-6 text-sm">Analyzing your profile...</p>
      </div>
    );
  }

  if (!recommendation) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808] flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,255,255,0.02),transparent)]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl w-full text-center space-y-12"
      >
        {/* Eddy */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center"
        >
          <EddyCharacter mood="excited" size="lg" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-4xl font-black text-white tracking-[-0.03em]">
            Here's your personalized experience.
          </h2>
          <p className="text-white/40 text-lg">
            Based on your goals, I've prepared this for you.
          </p>
        </motion.div>

        {/* Recommendation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className={`bg-gradient-to-br ${recommendation.color} p-px rounded-3xl`}
        >
          <div className="bg-[#0a0a0a] rounded-3xl p-8 space-y-6">
            <div>
              <p className="text-white/50 text-sm uppercase tracking-widest font-bold mb-2">Your Membership</p>
              <h3 className="text-3xl font-black text-white">
                {recommendation.tier}
              </h3>
            </div>

            <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

            <div>
              <p className="text-white/50 text-sm uppercase tracking-widest font-bold mb-4">You get access to:</p>
              <div className="space-y-2">
                {recommendation.tools.map((tool, i) => (
                  <motion.div
                    key={tool}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Check className="w-5 h-5 text-white/70 flex-shrink-0" />
                    <span className="text-white/70 font-medium">{tool}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="pt-4"
        >
          <Button
            onClick={onComplete}
            className="h-14 px-8 bg-white text-black text-lg font-semibold hover:bg-white/90 transition-all rounded-xl group"
          >
            <span>Enter edXponential</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}