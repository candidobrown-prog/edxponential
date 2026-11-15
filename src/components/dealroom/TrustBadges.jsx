import React from 'react';
import { ShieldCheck, BadgeCheck, Eye, Star } from 'lucide-react';

const BADGES = [
  {
    key: 'verified_founder',
    icon: BadgeCheck,
    label: 'Verified Founder',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    key: 'reviewed',
    icon: ShieldCheck,
    label: 'Reviewed by edXponential',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    key: 'background_check',
    icon: Eye,
    label: 'Background Checked',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  {
    key: 'verified_edvestor',
    icon: Star,
    label: 'Verified edVestor',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
];

/**
 * show: array of keys to show, e.g. ['verified_founder', 'reviewed']
 * size: 'sm' | 'md' (default 'md')
 */
export default function TrustBadges({ show = ['verified_founder', 'reviewed'], size = 'md' }) {
  const visible = BADGES.filter(b => show.includes(b.key));
  if (!visible.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map(b => {
        const Icon = b.icon;
        return (
          <span
            key={b.key}
            className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${b.color} ${
              size === 'sm'
                ? 'text-[9px] px-2 py-0.5 tracking-wide uppercase'
                : 'text-[10px] px-2.5 py-1 tracking-widest uppercase'
            }`}
          >
            <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
            {b.label}
          </span>
        );
      })}
    </div>
  );
}