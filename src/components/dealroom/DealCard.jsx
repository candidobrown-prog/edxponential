import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Eye, MapPin, TrendingUp } from 'lucide-react';

const STAGE_LABELS = {
  idea: 'Idea', seed: 'Seed', early: 'Early Stage',
  growth: 'Growth', turnaround: 'Turnaround', acquisition: 'Acquisition',
};
const TYPE_LABELS = {
  charter: 'Charter', private: 'Private', public: 'Public',
  higher_ed: 'Higher Ed', edtech: 'EdTech', services: 'Services', other: 'Other',
};

export function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function DealCard({ deal, onView, onSave, saved }) {
  const committed = deal.committed_capital || 0;
  const seeking = deal.amount_seeking || 0;
  const pct = seeking > 0 ? Math.min(100, Math.round((committed / seeking) * 100)) : 0;

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-foreground/20 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
            <span className="text-background font-heading font-bold text-sm">
              {(deal.organization || deal.founder_name || '?')[0]}
            </span>
          </div>
          <div>
            <div className="flex flex-wrap gap-1.5 mb-1">
              <Badge className="bg-foreground text-background text-[9px] uppercase tracking-widest py-0 px-2">
                {STAGE_LABELS[deal.stage] || deal.stage}
              </Badge>
              {deal.education_type && (
                <Badge variant="outline" className="text-[9px] uppercase tracking-widest py-0 px-2">
                  {TYPE_LABELS[deal.education_type]}
                </Badge>
              )}
            </div>
            <h3 className="font-heading font-semibold text-sm leading-tight">{deal.title}</h3>
          </div>
        </div>
        <button
          onClick={() => onSave(deal.id)}
          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${saved ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {deal.thesis && (
        <p className="text-xs text-muted-foreground italic mb-3 leading-relaxed border-l-2 border-border pl-3">
          "{deal.thesis}"
        </p>
      )}

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
        {deal.description}
      </p>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
        <span>By <strong className="text-foreground">{deal.founder_name}</strong></span>
        {deal.geography && (
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{deal.geography}</span>
        )}
        {deal.amount_seeking && (
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <TrendingUp className="w-3 h-3" />Seeking {formatAmount(deal.amount_seeking)}
          </span>
        )}
      </div>

      {seeking > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{formatAmount(committed)} committed</span>
            <span>{pct}% funded</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <Button
        size="sm"
        className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/85 gap-2 text-xs"
        onClick={() => onView(deal.id)}
      >
        <Eye className="w-3.5 h-3.5" /> View Opportunity
      </Button>
    </div>
  );
}