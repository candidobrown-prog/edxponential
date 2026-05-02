import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, XCircle, Lightbulb } from 'lucide-react';

const LABEL_CONFIG = {
  'Investor Ready': { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle, iconColor: 'text-emerald-600' },
  'Nearly Ready': { color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', icon: CheckCircle, iconColor: 'text-sky-600' },
  'Needs Strengthening': { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: AlertCircle, iconColor: 'text-amber-600' },
  'Not Ready for Deal Room': { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle, iconColor: 'text-red-600' },
};

export default function PitchReadinessCard({ score, label, suggestions = [] }) {
  const config = LABEL_CONFIG[label] || LABEL_CONFIG['Not Ready for Deal Room'];
  const Icon = config.icon;

  return (
    <div className={cn('rounded-2xl border p-5', config.bg)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={cn('w-4 h-4', config.iconColor)} />
          <span className={cn('font-heading font-bold text-sm', config.color)}>Pitch Readiness</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('font-heading font-bold text-2xl', config.color)}>{score}</span>
          <span className={cn('text-xs', config.color)}>/100</span>
        </div>
      </div>

      <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            backgroundColor: label === 'Investor Ready' ? '#059669' :
              label === 'Nearly Ready' ? '#0ea5e9' :
              label === 'Needs Strengthening' ? '#d97706' : '#ef4444'
          }}
        />
      </div>

      <div className={cn('inline-flex items-center border rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-medium mb-4', config.bg, config.color)}>
        {label}
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">
            <Lightbulb className="w-3 h-3" /> Improvements
          </div>
          {suggestions.slice(0, 4).map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
              <span className="text-muted-foreground mt-0.5">→</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}