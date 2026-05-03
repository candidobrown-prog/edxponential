import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle, XCircle, Star, AlertCircle, RefreshCw, TrendingUp,
  DollarSign, Users, Zap, Eye, Lock, Filter
} from 'lucide-react';

function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const STATUS_COLORS = {
  draft: 'bg-muted text-muted-foreground',
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-muted text-muted-foreground',
  funded: 'bg-sky-50 text-sky-700 border-sky-200',
};

const SCORE_COLORS = {
  'Exceptional Match': 'text-emerald-600',
  'Strong Match': 'text-sky-600',
  'Good Match': 'text-indigo-600',
  'Possible Fit': 'text-amber-600',
  'Low Fit': 'text-muted-foreground',
};

export default function AdminMatchControl() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('');
  const [computing, setComputing] = useState(false);
  const [notesDeal, setNotesDeal] = useState(null);
  const [notesText, setNotesText] = useState('');

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['admin_deals'],
    queryFn: () => base44.entities.DealRoom.list('-created_date', 100),
  });

  const { data: investors = [] } = useQuery({
    queryKey: ['admin_investors'],
    queryFn: () => base44.entities.EdVestor.list('-created_date', 100),
  });

  const { data: matches = [] } = useQuery({
    queryKey: ['admin_matches'],
    queryFn: () => base44.entities.MatchScore.list('-score', 200),
  });

  const { data: pipelines = [] } = useQuery({
    queryKey: ['admin_pipelines'],
    queryFn: () => base44.entities.Pipeline.list('-created_date', 200),
  });

  const updateDealMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.DealRoom.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_deals'] }),
  });

  const handleApprove = (deal) => {
    updateDealMutation.mutate({ id: deal.id, data: { status: 'active' } });
  };

  const handleReject = (deal) => {
    updateDealMutation.mutate({ id: deal.id, data: { status: 'draft' } });
  };

  const handleFeature = (deal) => {
    updateDealMutation.mutate({ id: deal.id, data: { featured: !deal.featured } });
  };

  const handleSaveNotes = () => {
    if (!notesDeal) return;
    updateDealMutation.mutate({ id: notesDeal.id, data: { admin_notes: notesText } });
    setNotesDeal(null);
  };

  const handleComputeAll = async () => {
    setComputing(true);
    await base44.functions.invoke('computeMatchScores', {});
    await queryClient.invalidateQueries({ queryKey: ['admin_matches'] });
    setComputing(false);
  };

  const pendingDeals = deals.filter(d => d.status === 'pending_review');
  const activeDeals = deals.filter(d => d.status === 'active');
  const pendingIntros = pipelines.filter(p => p.stage === 'intro_requested');
  const totalCommitted = deals.reduce((acc, d) => acc + (d.committed_capital || 0), 0);
  const avgMatchScore = matches.length > 0 ? Math.round(matches.reduce((a, m) => a + m.score, 0) / matches.length) : 0;

  const filteredDeals = statusFilter && statusFilter !== '' ? deals.filter(d => d.status === statusFilter) : deals;

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'opportunities', label: `Opportunities (${deals.length})` },
    { id: 'matches', label: `Top Matches (${matches.filter(m => m.score >= 80).length})` },
    { id: 'intros', label: `Intro Requests (${pendingIntros.length})` },
  ];

  if (user?.role !== 'admin') return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h2 className="font-heading font-bold text-xl">Admin Access Required</h2>
        <p className="text-muted-foreground text-sm mt-1">This area is restricted to edXponential administrators.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Capital Match Control</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin intelligence dashboard for deal quality and match oversight.</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 text-xs" onClick={handleComputeAll} disabled={computing}>
          <RefreshCw className={`w-3.5 h-3.5 ${computing ? 'animate-spin' : ''}`} />
          {computing ? 'Computing…' : 'Recompute All Matches'}
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Total Deals', val: deals.length, icon: Eye, color: '' },
          { label: 'Pending Review', val: pendingDeals.length, icon: AlertCircle, color: 'text-amber-600' },
          { label: 'Active Deals', val: activeDeals.length, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Committed Capital', val: formatAmount(totalCommitted), icon: DollarSign, color: 'text-sky-600' },
          { label: 'Avg Match Score', val: `${avgMatchScore}%`, icon: Zap, color: 'text-indigo-600' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/60 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <s.icon className={`w-3.5 h-3.5 ${s.color || 'text-muted-foreground'}`} />
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</span>
            </div>
            <div className="font-heading text-2xl font-bold">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/60 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending approvals */}
          <div className="bg-card border border-border/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h3 className="font-heading font-semibold text-sm">Pending Approval ({pendingDeals.length})</h3>
            </div>
            {pendingDeals.length === 0 ? (
              <p className="text-xs text-muted-foreground">No pending submissions.</p>
            ) : (
              <div className="space-y-3">
                {pendingDeals.slice(0, 5).map(d => (
                  <div key={d.id} className="flex items-center justify-between gap-2 p-3 border border-amber-100 bg-amber-50/50 rounded-xl">
                    <div>
                      <div className="font-medium text-sm">{d.title}</div>
                      <div className="text-xs text-muted-foreground">{d.founder_name} · {formatAmount(d.amount_seeking)}</div>
                      {d.pitch_readiness_score > 0 && (
                        <Badge variant="outline" className="text-[8px] mt-1">Readiness: {d.pitch_readiness_score}%</Badge>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" className="rounded-xl h-7 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1" onClick={() => handleApprove(d)}>
                        <CheckCircle className="w-3 h-3" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1" onClick={() => handleReject(d)}>
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top matched pairs */}
          <div className="bg-card border border-border/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <h3 className="font-heading font-semibold text-sm">Top Matched Pairs</h3>
            </div>
            {matches.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                <div>
                  <div className="text-sm font-medium">{m.deal_title}</div>
                  <div className="text-[10px] text-muted-foreground">{m.edvestor_email}</div>
                </div>
                <span className={`font-heading font-bold text-sm ${SCORE_COLORS[m.label] || ''}`}>{m.score}%</span>
              </div>
            ))}
          </div>

          {/* Pending intros */}
          <div className="bg-card border border-border/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-indigo-600" />
              <h3 className="font-heading font-semibold text-sm">Pending Intro Requests ({pendingIntros.length})</h3>
            </div>
            {pendingIntros.length === 0 ? (
              <p className="text-xs text-muted-foreground">No pending intro requests.</p>
            ) : (
              <div className="space-y-2">
                {pendingIntros.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <div>
                      <div className="text-sm font-medium">{p.deal_title}</div>
                      <div className="text-xs text-muted-foreground">{p.investor_email} → {p.founder_name}</div>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest">{p.stage?.replace('_', ' ')}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Investor stats */}
          <div className="bg-card border border-border/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="font-heading font-semibold text-sm">edVestor Activity</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Total edVestors</span>
                <span className="font-medium">{investors.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Active edVestors</span>
                <span className="font-medium">{investors.filter(i => i.status === 'active').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Total Matches Generated</span>
                <span className="font-medium">{matches.length}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">High-Confidence Matches</span>
                <span className="font-medium text-emerald-600">{matches.filter(m => m.score >= 80).length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opportunities tab */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 rounded-xl text-xs"><SelectValue placeholder="Filter Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Statuses</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="funded">Funded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredDeals.map(deal => {
            const dealMatches = matches.filter(m => m.deal_id === deal.id);
            const topScore = dealMatches.length > 0 ? Math.max(...dealMatches.map(m => m.score)) : null;

            return (
              <div key={deal.id} className="bg-card border border-border/60 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-base">{deal.title}</h3>
                      {deal.featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                      <Badge variant="outline" className={`text-[9px] border uppercase tracking-widest py-0.5 ${STATUS_COLORS[deal.status]}`}>
                        {deal.status?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{deal.founder_name}</span>
                      <span>{formatAmount(deal.amount_seeking)}</span>
                      <span className="capitalize">{deal.stage?.replace('_', ' ')}</span>
                      {deal.pitch_readiness_score > 0 && (
                        <span className={deal.pitch_readiness_score >= 75 ? 'text-emerald-600' : 'text-amber-600'}>
                          Readiness: {deal.pitch_readiness_score}%
                        </span>
                      )}
                      {topScore && <span className="text-sky-600">Top match: {topScore}%</span>}
                    </div>
                    {deal.admin_notes && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mt-2">
                        Admin note: {deal.admin_notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {deal.status === 'pending_review' && (
                      <>
                        <Button size="sm" className="rounded-xl h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1" onClick={() => handleApprove(deal)}>
                          <CheckCircle className="w-3 h-3" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1" onClick={() => handleReject(deal)}>
                          <XCircle className="w-3 h-3" /> Reject
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs gap-1" onClick={() => handleFeature(deal)}>
                      <Star className={`w-3 h-3 ${deal.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      {deal.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs" onClick={() => { setNotesDeal(deal); setNotesText(deal.admin_notes || ''); }}>
                      Notes
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Matches tab */}
      {activeTab === 'matches' && (
        <div className="space-y-3">
          {matches.filter(m => m.score >= 80).map(m => (
            <div key={m.id} className="bg-card border border-border/60 rounded-2xl p-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{m.deal_title}</span>
                  <span className="text-xs text-muted-foreground">←→</span>
                  <span className="text-xs text-muted-foreground">{m.edvestor_email}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 italic">{m.explanation?.slice(0, 120)}…</p>
              </div>
              <div className="shrink-0 text-right">
                <div className={`font-heading font-bold text-lg ${SCORE_COLORS[m.label] || ''}`}>{m.score}%</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-widest">{m.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Intros tab */}
      {activeTab === 'intros' && (
        <div className="space-y-3">
          {pipelines.map(p => (
            <div key={p.id} className="bg-card border border-border/60 rounded-2xl p-4 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="font-medium text-sm">{p.deal_title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {p.investor_email} requested intro with {p.founder_name}
                </div>
                {p.intro_message && <p className="text-xs text-muted-foreground mt-1 italic">"{p.intro_message}"</p>}
              </div>
              <Badge variant="outline" className={`text-[9px] uppercase tracking-widest shrink-0 ${
                p.stage === 'intro_requested' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                p.stage === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                p.stage === 'invested' ? 'bg-sky-50 text-sky-700 border-sky-200' : ''
              }`}>
                {p.stage?.replace(/_/g, ' ')}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Admin notes modal */}
      {notesDeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-heading font-bold text-lg">Admin Notes · {notesDeal.title}</h3>
            <Textarea rows={4} value={notesText} onChange={e => setNotesText(e.target.value)} className="rounded-xl" placeholder="Internal notes visible only to admins..." />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setNotesDeal(null)}>Cancel</Button>
              <Button className="flex-1 rounded-xl bg-foreground text-background" onClick={handleSaveNotes}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}