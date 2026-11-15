import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Eye, MapPin, TrendingUp } from 'lucide-react';
import TrustBadges from './TrustBadges';
import ScarcityBar from './ScarcityBar';

const STAGE_LABELS = {
  idea: 'Idea', seed: 'Seed', early: 'Early Stage',
  growth: 'Growth', turnaround: 'Turnaround', acquisition: 'Acquisition',
};
const TYPE_LABELS = {
  charter: 'Charter', private: 'Private', public: 'Public',
  higher_ed: 'Higher Ed', edtech: 'EdTech', services: 'Services', other: 'Other',
};

const ORG_COLORS = [
  'bg-slate-900', 'bg-zinc-800', 'bg-stone-800', 'bg-neutral-900',
  'bg-gray-900', 'bg-emerald-900', 'bg-sky-900', 'bg-indigo-900',
];

function getColor(str) {
  if (!str) return ORG_COLORS[0];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % ORG_COLORS.length;
  return ORG_COLORS[h];
}

export function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function DealCard({ deal, onView, onSave, saved }) {
  const orgName = deal.organization || deal.founder_name || '?';
  const initials = orgName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const committed = deal.committed_capital || 0;
  const seeking = deal.amount_seeking || 0;
  const pct = seeking > 0 ? Math.min(100, Math.round((committed / seeking) * 100)) : 0;
  const bgColor = getColor(orgName);

  // Build the key metric callout — reading growth takes priority, then math, then attendance
  let metric = null;
  if (deal.reading_growth) {
    const before = Math.max(0, (deal.reading_proficiency || 50) - deal.reading_growth);
    metric = `${before}% → ${deal.reading_proficiency || before + deal.reading_growth}% reading growth`;
  } else if (deal.math_growth) {
    const before = Math.max(0, (deal.math_proficiency || 50) - deal.math_growth);
    metric = `${before}% → ${deal.math_proficiency || before + deal.math_growth}% math growth`;
  } else if (deal.attendance_rate) {
    metric = `${deal.attendance_rate}% attendance rate`;
  } else if (deal.thesis) {
    metric = `"${deal.thesis}"`;
  }

  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-foreground/20 hover:shadow-lg transition-all group flex flex-col">

      {/* ── IMAGE / LOGO ZONE ── */}
      <div className={`relative ${bgColor} h-36 flex items-center justify-center`}>
        {deal.founder_photo ? (
          <img src={deal.founder_photo} alt={orgName} className="w-full h-full object-cover opacity-60" />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading font-bold text-white/90 text-5xl tracking-tight select-none">
            {initials}
          </span>
        </div>
        {/* Save button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSave(deal.id); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/50 ${saved ? 'text-white' : 'text-white/60'}`}
        >
          <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
        </button>
        {/* Stage badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-black/40 backdrop-blur-sm text-white border-white/10 text-[9px] uppercase tracking-widest">
            {STAGE_LABELS[deal.stage] || deal.stage}
          </Badge>
        </div>
        {deal.education_type && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-black/40 backdrop-blur-sm text-white border-white/10 text-[9px] uppercase tracking-widest">
              {TYPE_LABELS[deal.education_type]}
            </Badge>
          </div>
        )}
      </div>

      {/* ── SCHOOL NAME + FOUNDER ── */}
      <div className="px-5 pt-4 pb-3 border-b border-border/40">
        <h3 className="font-heading font-bold text-base leading-snug">{deal.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">
            By <span className="text-foreground font-medium">{deal.founder_name}</span>
          </p>
          {deal.geography && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="w-3 h-3" />{deal.geography}
            </span>
          )}
        </div>
        <div className="mt-2">
          <TrustBadges show={['verified_founder', ...(deal.featured ? ['reviewed'] : [])]} size="sm" />
        </div>
      </div>

      {/* ── KEY METRIC CALLOUT ── */}
      {metric && (
        <div className="px-5 py-3 bg-muted/50 border-b border-border/40">
          <p className="text-sm font-heading font-semibold text-foreground leading-tight">
            "{metric}"
          </p>
        </div>
      )}

      {/* ── ASK + STAGE + PROGRESS ── */}
      <div className="px-5 py-4 flex-1 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Ask</div>
            <div className="font-heading font-bold text-lg">{formatAmount(seeking)}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Stage</div>
            <div className="font-heading font-semibold text-sm">{STAGE_LABELS[deal.stage] || deal.stage}</div>
          </div>
          {deal.minimum_investment && (
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Min</div>
              <div className="font-heading font-semibold text-sm">{formatAmount(deal.minimum_investment)}</div>
            </div>
          )}
        </div>

        {seeking > 0 && (
          <div>
            <div className="flex justify-between text-[9px] text-muted-foreground mb-1.5">
              <span>{formatAmount(committed)} committed</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-foreground rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* Scarcity signals */}
        <ScarcityBar
          savesCount={deal.saves_count}
          introsCount={deal.intros_count}
          pct={pct}
          recentCommitments={deal.intros_count > 0 ? deal.intros_count : undefined}
          variant="banner"
        />

        <Button
          size="sm"
          className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/85 gap-2 text-xs mt-1"
          onClick={() => onView(deal.id)}
        >
          <Eye className="w-3.5 h-3.5" /> View Opportunity
        </Button>
      </div>
    </div>
  );
}