import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import MatchScoreRing from './MatchScoreRing';
import MatchBreakdownBar from './MatchBreakdownBar';

function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function MatchedInvestorCard({ match, investor, canViewFull = false, onRequestIntro, onSave, saved }) {
  const [expanded, setExpanded] = useState(false);
  if (!investor) return null;

  const isPrivate = !canViewFull && investor.visibility !== 'public';

  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-foreground/20 hover:shadow-lg transition-all">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0 overflow-hidden">
            {investor.avatar_url && !isPrivate ? (
              <img src={investor.avatar_url} alt={investor.full_name} className="w-full h-full object-cover" />
            ) : (
              <Lock className="w-5 h-5 text-background/50" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                {isPrivate ? (
                  <>
                    <h3 className="font-heading font-bold text-base">Verified edVestor</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Profile private · Request intro to reveal</p>
                  </>
                ) : (
                  <>
                    <h3 className="font-heading font-bold text-base">{investor.full_name}</h3>
                    {investor.title && <p className="text-xs text-muted-foreground mt-0.5">{investor.title}</p>}
                  </>
                )}
              </div>
              <MatchScoreRing score={match.score} label={match.label} size="sm" />
            </div>

            {/* Thesis */}
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed italic">
              {isPrivate
                ? `"Verified edVestor interested in ${(investor.preferred_education_focus || ['education']).slice(0, 2).join(' and ')} opportunities."`
                : investor.thesis_statement || `"${(investor.preferred_education_focus || []).slice(0,3).join(', ')} investor."`
              }
            </p>

            {/* Check size — show even for private */}
            {(investor.min_check_size || investor.max_check_size) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="outline" className="text-[9px] uppercase tracking-widest py-0.5">
                  {formatAmount(investor.min_check_size)}–{formatAmount(investor.max_check_size)}
                </Badge>
                {investor.risk_appetite && !isPrivate && (
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest py-0.5 capitalize">{investor.risk_appetite}</Badge>
                )}
              </div>
            )}

            {/* Why they match */}
            {match.explanation && (
              <p className="text-[10px] text-muted-foreground mt-2 italic">"{match.explanation}"</p>
            )}
          </div>
        </div>

        {/* Expandable */}
        {expanded && !isPrivate && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Match Breakdown</div>
            <MatchBreakdownBar match={match} />
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <Button
            size="sm"
            className="rounded-xl bg-foreground text-background hover:bg-foreground/85 text-xs flex-1"
            onClick={() => onRequestIntro(investor)}
          >
            Request Introduction
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl w-8 h-8 p-0 flex items-center justify-center"
            onClick={() => onSave(investor.id)}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
          </Button>
          {!isPrivate && (
            <Button
              size="sm"
              variant="ghost"
              className="rounded-xl w-8 h-8 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}