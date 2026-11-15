import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronDown, ChevronUp, Bookmark, Lightbulb } from 'lucide-react';
import MatchScoreRing from './MatchScoreRing';
import MatchBreakdownBar from './MatchBreakdownBar';

function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const STAGE_LABELS = {
  idea: 'Idea', launch: 'Launch', early_traction: 'Early Traction',
  growth: 'Growth', turnaround: 'Turnaround', acquisition: 'Acquisition',
};

export default function MatchedDealCard({ match, deal, onViewDeal, onRequestIntro, onSave, saved }) {
  const [expanded, setExpanded] = useState(false);

  if (!deal) return null;
  const orgName = deal.organization || deal.title || '?';
  const initials = orgName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-foreground/20 hover:shadow-lg transition-all">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
            {deal.founder_photo ? (
              <img src={deal.founder_photo} alt={orgName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="font-heading font-bold text-background text-sm">{initials}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-heading font-bold text-base leading-tight">{deal.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {deal.founder_name}
                  {deal.geography && <span> · <MapPin className="w-2.5 h-2.5 inline" /> {deal.geography}</span>}
                </p>
              </div>
              <MatchScoreRing score={match.score} label={match.label} size="sm" />
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="outline" className="text-[9px] uppercase tracking-widest py-0.5">
                {STAGE_LABELS[deal.stage] || deal.stage}
              </Badge>
              {deal.education_type && (
                <Badge variant="outline" className="text-[9px] uppercase tracking-widest py-0.5">{deal.education_type}</Badge>
              )}
              <Badge variant="outline" className="text-[9px] uppercase tracking-widest py-0.5">
                {formatAmount(deal.amount_seeking)}
              </Badge>
            </div>

            {/* Match explanation */}
            {match.explanation && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed italic">"{match.explanation}"</p>
            )}

            {/* AI insights */}
            {match.ai_insights?.length > 0 && (
              <div className="mt-2 space-y-1">
                {match.ai_insights.slice(0, 2).map((insight, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[10px] text-foreground/70">
                    <Lightbulb className="w-3 h-3 shrink-0 mt-0.5 text-amber-500" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expandable breakdown */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Match Breakdown</div>
            <MatchBreakdownBar match={match} />
            {match.review_first && (
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Review first: </span>{match.review_first}
              </div>
            )}
            {match.potential_concerns && (
              <div className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Potential concerns: </span>{match.potential_concerns}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            size="sm"
            className="rounded-xl bg-foreground text-background hover:bg-foreground/85 text-xs flex-1"
            onClick={() => onViewDeal(deal.id)}
          >
            Review Opportunity
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs flex-1"
            onClick={() => onRequestIntro(deal)}
          >
            Request Introduction
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl w-8 h-8 p-0 flex items-center justify-center"
            onClick={() => onSave(deal.id)}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-xl w-8 h-8 p-0 flex items-center justify-center"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}