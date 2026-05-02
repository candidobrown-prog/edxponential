import React from 'react';
import { cn } from '@/lib/utils';

const LABEL_COLORS = {
  'Exceptional Match': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Strong Match': 'text-sky-700 bg-sky-50 border-sky-200',
  'Good Match': 'text-indigo-700 bg-indigo-50 border-indigo-200',
  'Possible Fit': 'text-amber-700 bg-amber-50 border-amber-200',
  'Low Fit': 'text-muted-foreground bg-muted border-border',
};

const RING_COLORS = {
  'Exceptional Match': '#059669',
  'Strong Match': '#0ea5e9',
  'Good Match': '#6366f1',
  'Possible Fit': '#d97706',
  'Low Fit': '#9ca3af',
};

export default function MatchScoreRing({ score, label, size = 'md' }) {
  const radius = size === 'sm' ? 18 : size === 'lg' ? 36 : 26;
  const stroke = size === 'sm' ? 3 : size === 'lg' ? 5 : 4;
  const dim = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = RING_COLORS[label] || '#9ca3af';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle cx={dim/2} cy={dim/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
          <circle
            cx={dim/2} cy={dim/2} r={radius}
            fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-heading font-bold', size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-sm')} style={{ color }}>
            {score}%
          </span>
        </div>
      </div>
      {label && (
        <span className={cn('inline-flex items-center border rounded-full font-medium', LABEL_COLORS[label],
          size === 'sm' ? 'text-[8px] px-1.5 py-0.5 tracking-wide' : 'text-[9px] px-2 py-0.5 uppercase tracking-widest'
        )}>
          {label}
        </span>
      )}
    </div>
  );
}