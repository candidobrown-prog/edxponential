/**
 * edXponential Premium Empty States
 * Elegant, minimal, emotionally intelligent
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const STATES = {
  discover: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="32" y1="32" x2="42" y2="42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="22" cy="22" r="6" stroke="currentColor" strokeWidth="1.2" opacity="0.4"/>
        <circle cx="22" cy="22" r="1.5" fill="currentColor"/>
      </svg>
    ),
    title: 'Nothing to discover yet.',
    subtitle: 'The network is growing. Check back soon.',
  },
  messages: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M8 10h32a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H14L6 42V12a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M16 22h16M16 28h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    title: 'No conversations yet.',
    subtitle: 'Start a connection to begin collaborating.',
  },
  notifications: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 8a6 6 0 0 0-6 6v3c0 4-3 7-3 7h18s-3-3-3-7v-3a6 6 0 0 0-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M21 35a3 3 0 0 0 6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="36" cy="12" r="5" fill="currentColor" opacity="0.2"/>
      </svg>
    ),
    title: 'You\'re all caught up.',
    subtitle: 'No new notifications at the moment.',
  },
  communities: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="16" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="10" cy="22" r="5" stroke="currentColor" strokeWidth="1.3" opacity="0.5"/>
        <circle cx="38" cy="22" r="5" stroke="currentColor" strokeWidth="1.3" opacity="0.5"/>
        <path d="M4 38c0-5 2.7-9 6-9M44 38c0-5-2.7-9-6-9M14 38c0-6 4.5-10 10-10s10 4 10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    title: 'No communities yet.',
    subtitle: 'Create or join a community to get started.',
  },
  results: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 20h16M16 26h10M16 32h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.35"/>
        <circle cx="34" cy="34" r="9" fill="currentColor" opacity="0.06"/>
        <line x1="29" y1="34" x2="39" y2="34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'No results found.',
    subtitle: 'Try adjusting your filters or search terms.',
  },
  ai: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M24 12v4M24 32v4M12 24h4M32 24h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4"/>
        <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="24" cy="24" r="1.5" fill="currentColor"/>
      </svg>
    ),
    title: 'Ready when you are.',
    subtitle: 'Ask anything — WhallAI is standing by.',
  },
};

export default function EdxEmptyState({
  type = 'results',
  title,
  subtitle,
  action,
  actionLabel,
  dark = true,
  className,
}) {
  const config = STATES[type] || STATES.results;
  const fg = dark ? 'text-white/25' : 'text-black/25';
  const fgStrong = dark ? 'text-white/50' : 'text-black/50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col items-center justify-center text-center py-16 px-6 gap-4', className)}
    >
      <div className={fg}>{config.icon}</div>
      <div className="space-y-1.5">
        <p className={`font-black text-sm ${fgStrong}`}>{title || config.title}</p>
        <p className={`text-xs font-medium max-w-xs ${fg}`}>{subtitle || config.subtitle}</p>
      </div>
      {action && (
        <button
          onClick={action}
          className={`mt-2 text-xs font-black px-4 py-2 rounded-xl border transition-all ${
            dark ? 'border-white/15 text-white/50 hover:bg-white/5 hover:text-white' : 'border-black/15 text-black/50 hover:bg-black/5 hover:text-black'
          }`}
        >
          {actionLabel || 'Get Started'}
        </button>
      )}
    </motion.div>
  );
}