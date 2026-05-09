import React from 'react';
import { motion } from 'framer-motion';
import { Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function PremiumUpgradePrompt({ position = 'center', className = '' }) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/2 shadow-sm overflow-hidden',
        'group cursor-pointer hover:border-primary/40 transition-all duration-300',
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <Crown className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="title font-semibold text-foreground mb-1">
              Upgrade for an ad-free experience
            </h3>
            <p className="body-xs text-muted-foreground">
              Enjoy distraction-free access with premium features.
            </p>
          </div>
        </div>

        <button
          onClick={handleUpgrade}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/btn mt-3"
        >
          Explore Premium
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}