import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import { formatAmount } from './DealCard';

const STAGE_LABELS = {
  idea: 'Idea', seed: 'Seed', early: 'Early Stage',
  growth: 'Growth', turnaround: 'Turnaround', acquisition: 'Acquisition',
};

export default function FeaturedDealCard({ deal, onView }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-foreground text-background p-7 cursor-pointer group hover:shadow-xl transition-all"
      onClick={() => onView(deal.id)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-foreground/80" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-white/15 text-white border-white/20 text-[9px] uppercase tracking-widest">
                Featured
              </Badge>
              <Badge className="bg-white/10 text-white/80 border-white/10 text-[9px] uppercase tracking-widest">
                {STAGE_LABELS[deal.stage] || deal.stage}
              </Badge>
            </div>
            <h3 className="font-heading text-xl font-bold leading-tight mb-1">{deal.title}</h3>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <span>By <span className="text-white font-medium">{deal.founder_name}</span></span>
              {deal.organization && <span>· {deal.organization}</span>}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <span className="font-heading font-bold text-white text-lg">
              {(deal.organization || deal.founder_name || '?')[0]}
            </span>
          </div>
        </div>

        {deal.thesis && (
          <p className="text-white/80 text-sm leading-relaxed mb-4 font-light italic">
            "{deal.thesis}"
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-white/60 text-xs mb-5">
          {deal.geography && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{deal.geography}</span>}
          {deal.amount_seeking && (
            <span className="flex items-center gap-1 text-white font-semibold">
              <TrendingUp className="w-3 h-3" />Seeking {formatAmount(deal.amount_seeking)}
            </span>
          )}
          {deal.minimum_investment && (
            <span className="text-white/50">Min: {formatAmount(deal.minimum_investment)}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/40 text-[10px] uppercase tracking-widest">
            {deal.intros_count > 0 ? `${deal.intros_count} intro request${deal.intros_count > 1 ? 's' : ''}` : 'New'}
          </span>
          <span className="flex items-center gap-1.5 text-white text-xs font-medium group-hover:gap-2.5 transition-all">
            View Opportunity <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}