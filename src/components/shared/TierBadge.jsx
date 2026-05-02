import React from 'react';
import { cn } from '@/lib/utils';

const TIERS = {
  founders_sphere: { label: 'Founders Sphere', style: 'bg-black text-white' },
  executive_entourage: { label: 'Executive Entourage', style: 'bg-zinc-800 text-white' },
  principal_park: { label: 'Principal Park', style: 'bg-zinc-700 text-white' },
  potentials: { label: 'Potentials', style: 'bg-zinc-500 text-white' },
  tutorials: { label: 'Tutorials', style: 'bg-zinc-300 text-black' },
  edvestors: { label: 'edVestors', style: 'bg-black text-white border border-white/30' },
};

export default function TierBadge({ tier, size = 'sm' }) {
  const config = TIERS[tier] || TIERS.potentials;
  return (
    <span className={cn(
      'inline-flex items-center rounded-md font-medium tracking-wide uppercase',
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1',
      config.style
    )}>
      {config.label}
    </span>
  );
}

export { TIERS };