import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, MessageSquare, FileText, Users, Plus,
  ChevronRight, Clock, CheckCircle, XCircle, ArrowUpRight,
  Activity, DollarSign
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
  active:         { label: 'Live',          color: 'bg-green-100 text-green-800',  icon: CheckCircle },
  closed:         { label: 'Closed',        color: 'bg-muted text-muted-foreground', icon: XCircle },
  funded:         { label: 'Funded',        color: 'bg-blue-100 text-blue-800',   icon: CheckCircle },
};

function IntroCard({ intro, onAccept, onDecline }) {
  const [actioning, setActioning] = useState(false);
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="font-heading font-semibold text-sm">{intro.deal_title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Interest: <span className="text-foreground font-medium">
              {intro.investment_interest_range?.replace(/_/g, ' ').replace('k', 'K').replace('m', 'M') || '—'}
            </span>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-800 text-[9px] uppercase tracking-widest border-0 shrink-0">
          Pending
        </Badge>
      </div>
      {intro.why_interested && (
        <p className="text-xs text-muted-foreground italic mb-3 leading-relaxed border-l-2 border-border pl-3">
          "{intro.why_interested}"
        </p>
      )}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/85 text-xs"
          disabled={actioning}
          onClick={async () => { setActioning(true); await onAccept(intro); setActioning(false); }}
        >
          <CheckCircle className="w-3.5 h-3.5" /> Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-xl text-xs"
          disabled={actioning}
          onClick={async () => { setActioning(true); await onDecline(intro); setActioning(false); }}
        >
          <XCircle className="w-3.5 h-3.5" /> Decline
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

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

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

  const { data: allPipeline = [] } = useQuery({
    queryKey: ['founder-pipeline', myDeals.map(d => d.id)],
    queryFn: async () => {
      const results = await Promise.all(myDeals.map(d => base44.entities.Pipeline.filter({ deal_id: d.id })));
      return results.flat();
    },
    enabled: myDeals.length > 0,
  });

  const totalSeeking   = myDeals.reduce((a, d) => a + (d.amount_seeking || 0), 0);
  const totalCommitted = myDeals.reduce((a, d) => a + (d.committed_capital || 0), 0);
  const totalWatching  = myDeals.reduce((a, d) => a + (d.saves_count || 0), 0);
  const totalIntros    = myDeals.reduce((a, d) => a + (d.intros_count || 0), 0);
  const overallPct     = totalSeeking > 0 ? Math.min(100, Math.round((totalCommitted / totalSeeking) * 100)) : 0;
  const activeInvestors = allPipeline.filter(p => ['in_conversation', 'due_diligence', 'invested'].includes(p.stage)).length;

  // Build a simple activity feed from pipeline records
  const recentActivity = [...allPipeline]
    .sort((a, b) => (b.last_activity || '').localeCompare(a.last_activity || ''))
    .slice(0, 6)
    .map(p => ({
      id: p.id,
      deal: p.deal_title,
      stage: p.stage,
      date: p.last_activity,
      amount: p.investment_interest_range,
    }));

  const STAGE_LABELS = {
    saved: 'saved your deal',
    intro_requested: 'requested an introduction',
    in_conversation: 'moved to in conversation',
    due_diligence: 'entered due diligence',
    invested: 'committed to invest',
    passed: 'passed on this deal',
  };

  const handleAcceptIntro = async (intro) => {
    await base44.entities.Pipeline.update(intro.id, { stage: 'in_conversation', last_activity: new Date().toISOString().split('T')[0] });
    queryClient.invalidateQueries({ queryKey: ['incoming-intros'] });
    queryClient.invalidateQueries({ queryKey: ['founder-pipeline'] });
  };

  const handleDeclineIntro = async (intro) => {
    await base44.entities.Pipeline.update(intro.id, { stage: 'passed', last_activity: new Date().toISOString().split('T')[0] });
    queryClient.invalidateQueries({ queryKey: ['incoming-intros'] });
    queryClient.invalidateQueries({ queryKey: ['founder-pipeline'] });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── HEADER ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Founder Portal</span>
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Raise Capital</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {user?.full_name ? `Welcome, ${user.full_name.split(' ')[0]}.` : ''} Track your raise and manage investor interest.
        </p>
      </div>

      {/* ── PROGRESS HERO ── */}
      <div className="bg-foreground text-background rounded-2xl p-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1">Total Raise Progress</p>
            <h2 className="font-heading text-3xl font-bold">
              {formatAmount(totalCommitted)}
              <span className="text-white/40 font-normal text-xl ml-2">/ {formatAmount(totalSeeking)}</span>
            </h2>
            <p className="text-white/50 text-sm mt-1">{overallPct}% funded · {myDeals.length} active opportunit{myDeals.length === 1 ? 'y' : 'ies'}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-heading text-xl font-bold">{formatAmount(Math.max(0, totalSeeking - totalCommitted))}</div>
            <div className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Remaining</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/40">
          <span>$0</span>
          <span>{formatAmount(totalSeeking)}</span>
        </div>
      </div>

      {/* ── ACTIVE INVESTORS + PENDING REQUESTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Active Investors */}
        <div className="bg-card border border-border/60 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-green-700" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Active Investors</div>
              <div className="font-heading text-2xl font-bold">{activeInvestors}</div>
            </div>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span>In Conversation</span>
              <span className="font-medium text-foreground">{allPipeline.filter(p => p.stage === 'in_conversation').length}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span>Due Diligence</span>
              <span className="font-medium text-foreground">{allPipeline.filter(p => p.stage === 'due_diligence').length}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Committed</span>
              <span className="font-medium text-foreground">{allPipeline.filter(p => p.stage === 'invested').length}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{totalWatching} watching</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{totalIntros} total intros</span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-card border border-border/60 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Pending Requests</div>
              <div className="font-heading text-2xl font-bold">{incomingIntros.length}</div>
            </div>
          </div>

          {incomingIntros.length === 0 ? (
            <p className="text-xs text-muted-foreground">No pending intro requests. When investors request access, they'll appear here.</p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {incomingIntros.map(intro => (
                <IntroCard key={intro.id} intro={intro} onAccept={handleAcceptIntro} onDecline={handleDeclineIntro} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE OPPORTUNITY ── */}
      <div className="border border-dashed border-border/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-semibold text-base">List a New Opportunity</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Submit your school or EdTech venture for investor review.</p>
        </div>
        <Button
          className="rounded-xl gap-2 bg-foreground text-background hover:bg-foreground/85 shrink-0"
          onClick={() => setSubmitOpen(true)}
        >
          <Plus className="w-4 h-4" /> Create Opportunity
        </Button>
      </div>

      {/* ── MY DEALS ── */}
      {myDeals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">My Opportunities</h2>
            <Link to="/deal-room" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              Deal Room <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {myDeals.map(deal => {
            const seeking   = deal.amount_seeking || 0;
            const committed = deal.committed_capital || 0;
            const pct       = seeking > 0 ? Math.min(100, Math.round((committed / seeking) * 100)) : 0;
            const status    = STATUS_CONFIG[deal.status] || STATUS_CONFIG.pending_review;
            const StatusIcon = status.icon;
            return (
              <div key={deal.id} className="bg-card border border-border/60 rounded-2xl p-6 hover:border-foreground/20 transition-all">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${status.color} text-[9px] uppercase tracking-widest border-0 gap-1`}>
                        <StatusIcon className="w-2.5 h-2.5" /> {status.label}
                      </Badge>
                      {deal.featured && <Badge className="bg-foreground text-background text-[9px] uppercase tracking-widest border-0">Featured</Badge>}
                    </div>
                    <h3 className="font-heading font-semibold text-base">{deal.title}</h3>
                    {deal.organization && <p className="text-xs text-muted-foreground mt-0.5">{deal.organization}</p>}
                  </div>
                  <Link to={`/deal-room/${deal.id}`} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                {seeking > 0 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Total Ask', value: formatAmount(seeking) },
                        { label: 'Committed', value: formatAmount(committed), highlight: true },
                        { label: 'Remaining', value: formatAmount(Math.max(0, seeking - committed)) },
                      ].map(m => (
                        <div key={m.label} className={`text-center rounded-xl p-3 ${m.highlight ? 'bg-green-50' : 'bg-muted'}`}>
                          <div className={`font-heading text-base font-bold ${m.highlight ? 'text-green-700' : ''}`}>{m.value}</div>
                          <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
                        <span className="font-medium text-foreground">{pct}% funded</span>
                        <span>{deal.intros_count || 0} intro{deal.intros_count !== 1 ? 's' : ''} received</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── RECENT ACTIVITY ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-heading text-lg font-semibold">Recent Activity</h2>
        </div>

        {recentActivity.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl py-10 text-center">
            <Activity className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No activity yet. Investor interactions will appear here.</p>
          </div>
        ) : (
          <div className="bg-card border border-border/60 rounded-2xl divide-y divide-border/40">
            {recentActivity.map((a, i) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">An investor</span>{' '}
                    <span className="text-muted-foreground">{STAGE_LABELS[a.stage] || a.stage}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.deal}</p>
                </div>
                <div className="text-[10px] text-muted-foreground shrink-0">{a.date || '—'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FounderSubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} user={user} />
    </div>
  );
}