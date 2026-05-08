/**
 * edXponential Premium Badge System
 * Luxury-tech aesthetic — minimal, prestigious, collectible
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const BADGES = {
  verified: {
    label: 'Verified Educator',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1z" fill="currentColor"/>
        <polyline points="4,6 5.5,7.5 8,4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    style: 'bg-[#0a0a0a] text-white border-white/10',
    glow: false,
  },
  founder: {
    label: 'Founder',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M6 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L6 9.5 3 11l.5-3.5L1 5l3.5-.5L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    style: 'bg-zinc-900 text-white/90 border-white/[0.12]',
    glow: false,
  },
  edvisor: {
    label: 'edVisor™',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2 10.5c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    style: 'bg-white text-black border-black/10',
    glow: false,
  },
  edvestor: {
    label: 'edVestor™',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <polyline points="2,9 5,5 7.5,7 10,3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="8,3 10,3 10,5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    style: 'bg-zinc-800 text-white/80 border-white/[0.08]',
    glow: false,
  },
  principal: {
    label: 'Principal',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M6 1L2 5v6h8V5L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <rect x="4.5" y="7" width="3" height="4" stroke="currentColor" strokeWidth="1.1"/>
      </svg>
    ),
    style: 'bg-zinc-100 text-zinc-900 border-zinc-200',
    glow: false,
  },
  top_contributor: {
    label: 'Top Contributor',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M6 2v8M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="2" y1="10" x2="10" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    style: 'bg-[#0a0a0a] text-white/80 border-white/[0.1]',
    glow: false,
  },
  ai_pioneer: {
    label: 'AI Pioneer',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="2"/>
        <path d="M6 1v2M6 9v2M1 6h2M9 6h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M2.93 2.93l1.41 1.41M7.66 7.66l1.41 1.41M2.93 9.07l1.41-1.41M7.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
    style: 'bg-gradient-to-r from-zinc-900 to-zinc-700 text-white border-white/[0.15]',
    glow: true,
  },
  mentor: {
    label: 'Mentor',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <circle cx="5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1 10c0-2.2 1.8-4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M9 7l-2 2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 9H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    style: 'bg-zinc-900 text-white/75 border-white/[0.09]',
    glow: false,
  },
  certified: {
    label: 'Certified',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
        <polyline points="3.5,6 5.5,8 8.5,4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    style: 'bg-white text-black border-black/[0.12]',
    glow: false,
  },
  featured_creator: {
    label: 'Featured Creator',
    icon: (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 9l2.5-2.5 1.5 1.5L9 5l1 4H2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" fill="none"/>
        <circle cx="8.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
      </svg>
    ),
    style: 'bg-[#0a0a0a] text-white/85 border-white/[0.12]',
    glow: false,
  },
};

export default function EdxBadge({ type = 'verified', size = 'sm', animated = false, className }) {
  const config = BADGES[type] || BADGES.verified;

  const inner = (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full border font-black tracking-wide uppercase leading-none',
      size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : size === 'sm' ? 'text-[10px] px-2 py-1' : 'text-xs px-2.5 py-1.5',
      config.glow && 'shadow-[0_0_12px_rgba(255,255,255,0.08)]',
      config.style,
      className
    )}>
      <span className="opacity-70">{config.icon}</span>
      {config.label}
    </span>
  );

  if (animated) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {inner}
      </motion.span>
    );
  }

  return inner;
}

export { BADGES };