/**
 * edXponential Custom Reaction System
 * Premium community reactions — no standard emoji 👍
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const REACTIONS = [
  {
    id: 'inspired',
    label: 'Inspired',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v4M10 14v4M2 10h4M14 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M4.93 4.93l2.83 2.83M12.24 12.24l2.83 2.83" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'brilliant',
    label: 'Brilliant',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="8" r="5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7.5 14h5v1.5a2.5 2.5 0 0 1-5 0V14z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M8.5 8a1.5 1.5 0 0 1 3 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'transformative',
    label: 'Transformative',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M3 17L7.5 9 10 12 14 6 17 17H3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
        <circle cx="14" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'powerful',
    label: 'Powerful',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M11 2l-5 9h8l-5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'innovative',
    label: 'Innovative',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.4"/>
        <path d="M10 3a7 7 0 0 1 7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M10 17a7 7 0 0 1-7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M3 10h4M13 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
  {
    id: 'visionary',
    label: 'Visionary',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="10" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'impactful',
    label: 'Impactful',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
        <circle cx="10" cy="10" r="1.2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'enlightened',
    label: 'Enlightened',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 4l1.5 3.5 3.5.5-2.5 2.5.5 3.5L10 12.5l-3 1.5.5-3.5L5 8l3.5-.5L10 4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function EdxReactions({ counts = {}, onReact, dark = true, compact = false }) {
  const [hovering, setHovering] = useState(null);
  const [active, setActive] = useState({});

  const handleReact = (id) => {
    const next = { ...active, [id]: !active[id] };
    setActive(next);
    onReact?.(id, !active[id]);
  };

  const fg = dark ? 'text-white/40' : 'text-black/40';
  const fgActive = dark ? 'text-white' : 'text-black';
  const bg = dark ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08]' : 'bg-black/[0.04] hover:bg-black/[0.07] border-black/[0.08]';
  const bgActive = dark ? 'bg-white/[0.1] border-white/20' : 'bg-black/[0.08] border-black/20';

  return (
    <div className={cn('flex flex-wrap gap-1.5', compact && 'gap-1')}>
      {REACTIONS.map(r => {
        const count = (counts[r.id] || 0) + (active[r.id] ? 1 : 0);
        const isActive = !!active[r.id];

        return (
          <div key={r.id} className="relative">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleReact(r.id)}
              onMouseEnter={() => setHovering(r.id)}
              onMouseLeave={() => setHovering(null)}
              className={cn(
                'flex items-center gap-1 rounded-full border px-2 py-1 transition-all',
                compact ? 'px-1.5' : 'px-2',
                isActive ? bgActive : bg,
                isActive ? fgActive : fg,
              )}
            >
              {r.icon}
              {!compact && count > 0 && (
                <span className="text-[10px] font-black">{count}</span>
              )}
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {hovering === r.id && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-lg whitespace-nowrap pointer-events-none z-50 border border-white/10"
                >
                  {r.label}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/** Reaction summary bar — shows top 3 reactions with count */
export function EdxReactionSummary({ counts = {}, dark = true }) {
  const sorted = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (!sorted.length) return null;

  const total = sorted.reduce((s, [, v]) => s + v, 0);
  const fg = dark ? 'text-white/30' : 'text-black/30';

  return (
    <div className="flex items-center gap-1.5">
      {sorted.map(([id]) => {
        const r = REACTIONS.find(x => x.id === id);
        return r ? (
          <span key={id} className={cn('opacity-50', dark ? 'text-white' : 'text-black')}>{r.icon}</span>
        ) : null;
      })}
      <span className={cn('text-[11px] font-semibold', fg)}>{total}</span>
    </div>
  );
}