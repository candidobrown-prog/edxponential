import React from 'react';
import { Flame, Clock, Users, TrendingUp } from 'lucide-react';

/**
 * Displays scarcity + capital momentum signals for a deal.
 * Props:
 *   savesCount     — number of investors watching
 *   introsCount    — number of intro requests
 *   pct            — % funded (0-100)
 *   committed      — dollar amount committed
 *   closingDays    — optional: "Closing in X days" (number)
 *   slotsLeft      — optional: "Only X opportunities this month" (number)
 *   recentCommitments — optional: "X investors already committed" (number)
 *   variant        — 'banner' (full-width) | 'sidebar' (stacked)
 */
export default function ScarcityBar({
  savesCount = 0,
  introsCount = 0,
  pct = 0,
  committed = 0,
  closingDays,
  slotsLeft,
  recentCommitments,
  variant = 'banner',
}) {
  const signals = [
    recentCommitments && {
      icon: Users,
      text: `${recentCommitments} investor${recentCommitments > 1 ? 's' : ''} already committed`,
      heat: true,
    },
    closingDays && {
      icon: Clock,
      text: `Closing in ${closingDays} day${closingDays > 1 ? 's' : ''}`,
      heat: closingDays <= 7,
    },
    slotsLeft && {
      icon: Flame,
      text: `Only ${slotsLeft} opportunit${slotsLeft > 1 ? 'ies' : 'y'} this month`,
      heat: slotsLeft <= 3,
    },
    savesCount > 0 && {
      icon: TrendingUp,
      text: `${savesCount} investor${savesCount > 1 ? 's' : ''} watching`,
      heat: false,
    },
    introsCount > 0 && {
      icon: Users,
      text: `${introsCount} intro request${introsCount > 1 ? 's' : ''} sent`,
      heat: false,
    },
  ].filter(Boolean);

  if (!signals.length) return null;

  if (variant === 'sidebar') {
    return (
      <div className="space-y-2">
        {signals.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${s.heat ? 'bg-red-50 text-red-700' : 'bg-muted text-muted-foreground'}`}>
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{s.text}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {signals.map((s, i) => {
        const Icon = s.icon;
        return (
          <span
            key={i}
            className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium rounded-full px-2.5 py-1 border ${
              s.heat
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            <Icon className="w-3 h-3" />
            {s.text}
          </span>
        );
      })}
    </div>
  );
}