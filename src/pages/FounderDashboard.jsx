import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, MessageSquare, FileText, Users, Plus,
  ChevronRight, Clock, CheckCircle, XCircle, ArrowUpRight, Lock
} from 'lucide-react';
import FounderSubmitModal from '../components/dealroom/FounderSubmitModal';

function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const STATUS_CONFIG = {
  pending_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  active: { label: 'Live', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground', icon: XCircle },
  funded: { label: 'Funded', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
};

function FundingProgress({ deal }) {
  const seeking = deal.amount_seeking || 0;
  const committed = deal.committed_capital || 0;
  const pct = seeking > 0 ? Math.min(100, Math.round((committed / seeking) * 100)) : 0;
  const remaining = Math.max(0, seeking - committed);
  const status = STATUS_CONFIG[deal.status] || STATUS_CONFIG.pending_review;
  const StatusIcon = status.icon;

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-foreground/20 transition-all">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`${status.color} text-[9px] uppercase tracking-widest border-0 gap-1`}>
              <StatusIcon className="w-2.5 h-2.5" /> {status.label}
            </Badge>
            {deal.featured && (
              <Badge className="bg-foreground text-background text-[9px] uppercase tracking-widest border-0">Featured</Badge>
            )}
          </div>
          <h3 className="font-heading font-semibold text-base leading-tight">{deal.title}</h3>
          {deal.organization && <p className="text-xs text-muted-foreground mt-0.5">{deal.organization}</p>}
        </div>
        <Link to={`/deal-room/${deal.id}`} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Funding Tracker */}
      {seeking > 0 ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-muted rounded-xl p-3">
              <div className="font-heading text-lg font-bold">{formatAmount(seeking)}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Total Ask</div>
            </div>
            <div className="text-center bg-green-50 rounded-xl p-3">
              <div className="font-heading text-lg font-bold text-green-700">{formatAmount(committed)}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Committed</div>
            </div>
            <div className="text-center bg-muted rounded-xl p-3">
              <div className="font-heading text-lg font-bold">{formatAmount(remaining)}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Remaining</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
              <span className="font-medium text-foreground">{pct}% funded</span>
              <span>{deal.intros_count || 0} intro request{deal.intros_count !== 1 ? 's' : ''} received</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{deal.saves_count || 0} investors watching</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{deal.intros_count || 0} intros</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No funding amount set on this opportunity.</p>
      )}
    </div>
  );
}

function IntroCard({ intro, onAccept, onDecline }) {
  const [actioning, setActioning] = useState(false);
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-heading font-semibold text-sm">{intro.deal_title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Interest: <span className="text-foreground font-medium">
              {intro.investment_interest_range?.replace(/_/g, ' ').replace('k', 'K').replace('m', 'M') || '—'}
            </span>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-800 text-[9px] uppercase tracking-widest border-0 shrink-0">
          Intro Requested
        </Badge>
      </div>
      {intro.why_interested && (
        <p className="text-xs text-muted-foreground italic mb-3 leading-relaxed border-l-2 border-border pl-3">
          "{intro.why_interested}"
        </p>
      )}
      {intro.invest_timeline && (
        <p className="text-[10px] text-muted-foreground mb-3">
          Timeline: {intro.invest_timeline.replace(/_/g, ' ')}
        </p>
      )}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/85 text-xs"
          disabled={actioning}
          onClick={async () => { setActioning(true); await onAccept(intro); setActioning(false); }}
        >
          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-xl text-xs"
          disabled={actioning}
          onClick={async () => { setActioning(true); await onDecline(intro); setActioning(false); }}
        >
          <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
        </Button>
      </div>
    </div>
  );
}

export default function FounderDashboard() {
  const [user, setUser] = useState(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: myDeals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['my-deals', user?.email],
    queryFn: () => base44.entities.DealRoom.filter({ founder_email: user.email }),
    enabled: !!user?.email,
  });

  const { data: incomingIntros = [] } = useQuery({
    queryKey: ['incoming-intros', myDeals.map(d => d.id)],
    queryFn: async () => {
      const results = await Promise.all(
        myDeals.map(d => base44.entities.Pipeline.filter({ deal_id: d.id, stage: 'intro_requested' }))
      );
      return results.flat();
    },
    enabled: myDeals.length > 0,
  });

  const totalSeeking = myDeals.reduce((a, d) => a + (d.amount_seeking || 0), 0);
  const totalCommitted = myDeals.reduce((a, d) => a + (d.committed_capital || 0), 0);
  const totalIntros = myDeals.reduce((a, d) => a + (d.intros_count || 0), 0);
  const totalWatching = myDeals.reduce((a, d) => a + (d.saves_count || 0), 0);
  const overallPct = totalSeeking > 0 ? Math.min(100, Math.round((totalCommitted / totalSeeking) * 100)) : 0;

  const handleAcceptIntro = async (intro) => {
    await base44.entities.Pipeline.update(intro.id, {
      stage: 'in_conversation',
      last_activity: new Date().toISOString().split('T')[0],
    });
    queryClient.invalidateQueries({ queryKey: ['incoming-intros'] });
  };

  const handleDeclineIntro = async (intro) => {
    await base44.entities.Pipeline.update(intro.id, {
      stage: 'passed',
      last_activity: new Date().toISOString().split('T')[0],
    });
    queryClient.invalidateQueries({ queryKey: ['incoming-intros'] });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Founder Portal</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Raise Capital</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {user?.full_name ? `Welcome, ${user.full_name.split(' ')[0]}.` : ''} Manage your active raise and incoming investor interest.
          </p>
        </div>
        <Button
          className="rounded-xl gap-2 bg-foreground text-background hover:bg-foreground/85 shrink-0"
          onClick={() => setSubmitOpen(true)}
        >
          <Plus className="w-4 h-4" /> Create Opportunity
        </Button>
      </div>

      {/* Overall Funding Summary */}
      {myDeals.length > 0 && (
        <div className="bg-foreground text-background rounded-2xl p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1">Portfolio Overview</p>
              <h2 className="font-heading text-2xl font-bold">
                {formatAmount(totalCommitted)} raised
              </h2>
              <p className="text-white/50 text-sm mt-0.5">of {formatAmount(totalSeeking)} total ask · {overallPct}% funded</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Active Raises', value: myDeals.filter(d => d.status === 'active').length },
                { label: 'Investors Watching', value: totalWatching },
                { label: 'Pending Intros', value: incomingIntros.length },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3">
                  <div className="font-heading text-xl font-bold">{s.value}</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/50 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Main 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: My Opportunities */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">My Opportunities</h2>
            <Link to="/deal-room" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              View Deal Room <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {dealsLoading ? (
            <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />)}</div>
          ) : myDeals.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl py-16 text-center">
              <FileText className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="font-heading font-semibold text-muted-foreground mb-1">No opportunities yet</p>
              <p className="text-xs text-muted-foreground mb-4">Submit your first opportunity to start raising capital.</p>
              <Button onClick={() => setSubmitOpen(true)} className="rounded-xl gap-2">
                <Plus className="w-4 h-4" /> Create Opportunity
              </Button>
            </div>
          ) : (
            myDeals.map(deal => <FundingProgress key={deal.id} deal={deal} />)
          )}
        </div>

        {/* Right: Incoming Intros */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Pending Intros</h2>
            {incomingIntros.length > 0 && (
              <Badge className="bg-foreground text-background text-[9px] uppercase tracking-widest">
                {incomingIntros.length} new
              </Badge>
            )}
          </div>

          {incomingIntros.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl py-10 text-center">
              <Users className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No pending intros</p>
              <p className="text-xs text-muted-foreground mt-1">When investors request introductions, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingIntros.map(intro => (
                <IntroCard
                  key={intro.id}
                  intro={intro}
                  onAccept={handleAcceptIntro}
                  onDecline={handleDeclineIntro}
                />
              ))}
            </div>
          )}

          {/* Docs panel */}
          <div className="bg-card border border-border/60 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-sm font-semibold">Documents Shared</h3>
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {['Pitch Deck', 'Financials', 'Growth Plan'].map(doc => (
                <div key={doc} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <span className="text-xs font-medium">{doc}</span>
                  <span className="text-[10px] text-muted-foreground">Private</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full rounded-xl mt-3 text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Upload Document
            </Button>
          </div>
        </div>
      </div>

      <FounderSubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} user={user} />
    </div>
  );
}