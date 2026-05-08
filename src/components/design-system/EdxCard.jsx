/**
 * edXponential Premium Card System
 * Consistent glassmorphism and surface styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const VARIANTS = {
  // Standard dark card
  default: 'bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.05]',
  // Elevated dark card
  elevated: 'bg-white/[0.05] border border-white/[0.1] shadow-[0_4px_32px_rgba(0,0,0,0.4)]',
  // Flat dark card (no hover)
  flat: 'bg-white/[0.03] border border-white/[0.07]',
  // Glass highlight
  glass: 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
  // Light variant (for light bg contexts)
  light: 'bg-white border border-black/[0.07] hover:border-black/[0.14] shadow-sm',
  // Premium feature card
  premium: 'bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
};

export default function EdxCard({
  children,
  variant = 'default',
  hover = true,
  animate = true,
  radius = '2xl',
  padding = 'default',
  className,
  onClick,
  ...props
}) {
  const r = { sm: 'rounded-xl', md: 'rounded-2xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl' }[radius] || 'rounded-2xl';
  const p = { none: '', sm: 'p-4', default: 'p-5', lg: 'p-6', xl: 'p-8' }[padding] || 'p-5';

  const inner = (
    <div
      className={cn(
        'transition-all duration-200',
        r, p,
        VARIANTS[variant] || VARIANTS.default,
        hover && onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {inner}
      </motion.div>
    );
  }

  return inner;
}

/** Stat card */
export function EdxStatCard({ label, value, sub, icon, trend, dark = true }) {
  const fg = dark ? 'text-white' : 'text-black';
  const fg2 = dark ? 'text-white/40' : 'text-black/40';
  const fg3 = dark ? 'text-white/25' : 'text-black/25';

  return (
    <EdxCard variant={dark ? 'flat' : 'light'} padding="default" animate>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={cn('text-[11px] font-black uppercase tracking-widest mb-2', fg3)}>{label}</p>
          <p className={cn('text-3xl font-black leading-none tracking-tight', fg)}>{value}</p>
          {sub && <p className={cn('text-xs font-semibold mt-1', fg2)}>{sub}</p>}
          {trend !== undefined && (
            <p className={cn('text-xs font-bold mt-1', trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && <div className={cn('opacity-20', fg)}>{icon}</div>}
      </div>
    </EdxCard>
  );
}