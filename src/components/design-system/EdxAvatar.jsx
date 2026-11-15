/**
 * edXponential Premium Avatar System
 * Consistent, elegant, intelligent — with initials fallback and status ring
 */

import React from 'react';
import { cn } from '@/lib/utils';
import EdxBadge from './EdxBadge';

const SIZE_MAP = {
  xs: { outer: 'w-6 h-6', text: 'text-[9px]', ring: 'ring-1', dot: 'w-1.5 h-1.5 -right-0 -bottom-0' },
  sm: { outer: 'w-8 h-8', text: 'text-[11px]', ring: 'ring-1', dot: 'w-2 h-2 -right-0.5 -bottom-0.5' },
  md: { outer: 'w-10 h-10', text: 'text-xs', ring: 'ring-[1.5px]', dot: 'w-2.5 h-2.5 -right-0.5 -bottom-0.5' },
  lg: { outer: 'w-14 h-14', text: 'text-sm', ring: 'ring-2', dot: 'w-3 h-3 -right-0.5 -bottom-0.5' },
  xl: { outer: 'w-20 h-20', text: 'text-lg', ring: 'ring-2', dot: 'w-3.5 h-3.5 -right-1 -bottom-1' },
};

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

// Deterministic shade from name
function getShade(name = '') {
  const shades = ['bg-zinc-800', 'bg-zinc-700', 'bg-zinc-900', 'bg-zinc-600', 'bg-neutral-800'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return shades[Math.abs(hash) % shades.length];
}

export default function EdxAvatar({
  name = '',
  photoUrl,
  size = 'md',
  online,
  badgeType,
  dark = true,
  className,
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.md;
  const initials = getInitials(name);
  const shade = getShade(name);
  const ringColor = dark ? 'ring-white/10' : 'ring-black/10';

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      <div className={cn(
        'rounded-full overflow-hidden flex items-center justify-center flex-shrink-0',
        s.outer, s.ring, ringColor,
        !photoUrl && shade,
      )}>
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className={cn('font-black text-white select-none', s.text)}>{initials}</span>
        )}
      </div>

      {/* Online indicator */}
      {online !== undefined && (
        <span className={cn(
          'absolute rounded-full border-2 flex-shrink-0',
          s.dot,
          dark ? 'border-[#07080f]' : 'border-white',
          online ? 'bg-emerald-400' : 'bg-zinc-600',
        )} />
      )}

      {/* Badge overlay for xl */}
      {badgeType && size === 'xl' && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          <EdxBadge type={badgeType} size="xs" />
        </div>
      )}
    </div>
  );
}

/** Avatar group — up to 5, +N overflow */
export function EdxAvatarGroup({ people = [], max = 4, size = 'sm', dark = true }) {
  const visible = people.slice(0, max);
  const overflow = people.length - max;
  const s = SIZE_MAP[size] || SIZE_MAP.sm;

  return (
    <div className="flex items-center">
      {visible.map((p, i) => (
        <div key={i} className={i > 0 ? '-ml-2' : ''} style={{ zIndex: max - i }}>
          <EdxAvatar name={p.name} photoUrl={p.photoUrl} size={size} dark={dark} />
        </div>
      ))}
      {overflow > 0 && (
        <div className={cn(
          'rounded-full flex items-center justify-center bg-zinc-700 -ml-2',
          s.outer, s.text, 'font-black text-white/70 border border-white/10 ring-1 ring-white/10'
        )}>
          +{overflow}
        </div>
      )}
    </div>
  );
}