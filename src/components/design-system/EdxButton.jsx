/**
 * edXponential Premium Button System
 * Consistent, elegant, intelligent — replaces ad-hoc button styling across the platform
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EdxButtonLoader } from './EdxLoader';

const VARIANTS = {
  // Primary — white on dark bg
  primary: 'bg-white text-[#0a0a0a] hover:bg-zinc-100 shadow-[0_2px_20px_rgba(255,255,255,0.06)]',
  // Secondary — ghost bordered
  secondary: 'border border-white/15 text-white/70 hover:bg-white/[0.06] hover:text-white',
  // Ghost
  ghost: 'text-white/50 hover:text-white hover:bg-white/[0.04]',
  // Destructive
  danger: 'bg-red-950 text-red-300 border border-red-900/50 hover:bg-red-900',
  // Inverse (for light backgrounds)
  dark: 'bg-[#0a0a0a] text-white hover:bg-zinc-900',
  // Premium / CTA
  premium: 'bg-gradient-to-r from-zinc-900 to-zinc-800 text-white border border-white/10 hover:border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
};

const SIZES = {
  xs: 'h-7 px-3 text-[11px] rounded-lg gap-1',
  sm: 'h-8 px-3.5 text-xs rounded-xl gap-1.5',
  md: 'h-10 px-5 text-sm rounded-xl gap-2',
  lg: 'h-12 px-7 text-sm rounded-2xl gap-2',
  xl: 'h-14 px-9 text-base rounded-2xl gap-2.5',
};

export default function EdxButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  disabled,
  onClick,
  className,
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.01 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'inline-flex items-center justify-center font-black tracking-wide transition-all duration-200 select-none',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth && 'w-full',
        isDisabled && 'opacity-30 cursor-not-allowed pointer-events-none',
        className,
      )}
      {...props}
    >
      {loading && <EdxButtonLoader dark={variant === 'primary'} />}
      {!loading && icon && <span className="opacity-70">{icon}</span>}
      {children}
      {!loading && iconRight && <span className="opacity-60">{iconRight}</span>}
    </motion.button>
  );
}

/** Icon-only button */
export function EdxIconButton({ icon, size = 'md', variant = 'ghost', onClick, className, ...props }) {
  const sz = { xs: 'w-6 h-6', sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-11 h-11' };
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn(
        'flex items-center justify-center rounded-full transition-all',
        sz[size] || sz.md,
        VARIANTS[variant] || VARIANTS.ghost,
        className,
      )}
      {...props}
    >
      {icon}
    </motion.button>
  );
}