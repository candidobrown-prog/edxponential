import React from 'react';
import { cn } from '@/lib/utils';

const TIERS = {
  founders_sphere: {
    label: 'Founders Sphere',
    style: 'bg-[#0a0a0a] text-white border border-white/10',
    dot: 'bg-white',
  },
  executive_entourage: {
    label: 'Executive Entourage',
    style: 'bg-zinc-900 text-white/90 border border-white/[0.12]',
    dot: 'bg-white/70',
  },
  principal_park: {
    label: 'Principal Park',
    style: 'bg-zinc-800 text-white/80 border border-white/[0.1]',
    dot: 'bg-white/50',
  },
  potentials: {
    label: 'Potentials',
    style: 'bg-zinc-700 text-white/70 border border-white/[0.09]',
    dot: 'bg-white/40',
  },
  tutorials: {
    label: 'Tutorials',
    style: 'bg-white text-zinc-900 border border-black/[0.1]',
    dot: 'bg-zinc-900',
  },
  edvestors: {
    label: 'edVestors',
    style: 'bg-[#0a0a0a] text-white border border-white/20',
    dot: 'bg-white',
  },
};

export default function TierBadge({ tier, size = 'sm' }) {
  const config = TIERS[tier] || TIERS.potentials;
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-black tracking-widest uppercase',
      size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1',
      config.style
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      {config.label}
    </span>
  );
}

export { TIERS };