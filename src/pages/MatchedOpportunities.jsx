import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, SlidersHorizontal, TrendingUp, Star, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatchedDealCard from '../components/matching/MatchedDealCard';
import RequestIntroModal from '../components/dealroom/RequestIntroModal';

const STAT_CARDS = [
  { label: 'Total Matches', key: 'total', icon: TrendingUp, color: '' },
  { label: 'Exceptional Matches', key: 'exceptional', icon: Star, color: 'text-emerald-600' },
  { label: 'New This Week', key: 'new_week', icon: Clock, color: 'text-sky-600' },
  { label: 'Intros Pending', key: 'pending', icon: Zap, color: 'text-amber-600' },
];

export default function MatchedOpportunities() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [computing, setComputing] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [savedDeals, setSavedDeals] = useState([]);
  const [filters, setFilters] = useState({ minScore: '', stage: '', capital: '', geography: '' });
  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: matches = [], isLoading: matchLoading, refetch: refetchMatches } = useQuery({
    queryKey: ['my_matches', user?.email],
    queryFn: () => base44.entities.MatchScore.filter({ edvestor_email: user.email }),
    enabled: !!user?.email,
  });

  const dealIds = [...new Set(matches.map(m => m.deal_id))];
  const { data: deals = [] } = useQuery({
    queryKey: ['matched_deals', dealIds.join(',')],
    queryFn: () => base44.entities.DealRoom.filter({ status: 'active' }),
    enabled: dealIds.length > 0,
  });

  const { data: pipeline = [] } = useQuery({
    queryKey: ['pipeline_intro_count', user?.email],
    queryFn: () => base44.entities.Pipeline.filter({ investor_email: user.email }),
    enabled: !!user?.email,
  });

  const dealMap = Object.fromEntries((deals || []).map(d => [d.id, d]));

  const filteredMatches = matches
    .filter(m => m.is_visible !== false)
    .filter(m => !filters.minScore || m.score >= Number(filters.minScore))
    .filter(m => {
      if (!filters.stage) return true;
      const deal = dealMap[m.deal_id];
      return deal?.stage === filters.stage;
    })
    .sort((a, b) => b.score - a.score);

  const stats = {
    total: filteredMatches.length,
    exceptional: filteredMatches.filter(m => m.score >= 90).length,
    new_week: filteredMatches.filter(m => {
      const d = new Date(m.computed_at);
      return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
    }).length,
    pending: pipeline.filter(p => p.stage === 'intro_requested').length,
  };

  const handleCompute = async () => {
    setComputing(true);
    await base44.functions.invoke('computeMatchScores', { edvestor_email: user?.email });
    await refetchMatches();
    setComputing(false);
  };

  const handleRequestIntro = (deal) => {
    setSelectedDeal(deal);
    setIntroOpen(true);
  };

  const toggleSave = (dealId) => {
    setSavedDeals(s => s.includes(dealId) ? s.filter(id => id !== dealId) : [...s, dealId]);
  };

  const topMatches = filteredMatches.filter(m => m.score >= 80).slice(0, 3);
  const closingSoon = filteredMatches.filter(m => dealMap[m.deal_id]?.timeline).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Matched Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1">Curated capital intelligence. Ranked by alignment.</p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl gap-2 text-xs"
          onClick={handleCompute}
          disabled={computing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${computing ? 'animate-spin' : ''}`} />
          {computing ? 'Computing…' : 'Refresh Matches'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STAT_CARDS.map(s => (
          <div key={s.key} className="bg-card border border-border/60 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <s.icon className={`w-3.5 h-3.5 ${s.color || 'text-muted-foreground'}`} />
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</span>
            </div>
            <div className="font-heading text-3xl font-bold">{stats[s.key]}</div>
          </div>
        ))}
      </div>

      {/* AI Insights strip */}
      {matches.length > 0 && (
        <div className="bg-muted/50 border border-border/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Capital Intelligence</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {topMatches.slice(0, 3).map(m => (
              <div key={m.id} className="text-xs text-foreground/80">
                <span className="font-medium">{m.deal_title}: </span>
                <span className="text-muted-foreground">{m.ai_insights?.[0] || m.explanation?.split('.')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
        </div>
        <Select value={filters.minScore} onValueChange={v => setFilter('minScore', v)}>
          <SelectTrigger className="w-36 rounded-xl text-xs"><SelectValue placeholder="Min Score" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Matches</SelectItem>
            <SelectItem value="90">Exceptional (90%+)</SelectItem>
            <SelectItem value="80">Strong (80%+)</SelectItem>
            <SelectItem value="70">Good (70%+)</SelectItem>
            <SelectItem value="60">Possible (60%+)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.stage} onValueChange={v => setFilter('stage', v)}>
          <SelectTrigger className="w-36 rounded-xl text-xs"><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Stages</SelectItem>
            <SelectItem value="idea">Idea</SelectItem>
            <SelectItem value="launch">Launch</SelectItem>
            <SelectItem value="early_traction">Early Traction</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="turnaround">Turnaround</SelectItem>
            <SelectItem value="acquisition">Acquisition</SelectItem>
          </SelectContent>
        </Select>
        {Object.values(filters).some(Boolean) && (
          <Button variant="ghost" size="sm" className="rounded-xl text-xs" onClick={() => setFilters({ minScore: '', stage: '', capital: '', geography: '' })}>
            Clear
          </Button>
        )}
      </div>

      {/* Closing soon strip */}
      {closingSoon.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Closing Soon</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {closingSoon.map(m => {
              const d = dealMap[m.deal_id];
              if (!d) return null;
              return (
                <div key={m.id} className="shrink-0 bg-card border border-red-100 rounded-xl px-3 py-2 text-xs">
                  <span className="font-medium">{d.title}</span>
                  <span className="text-muted-foreground"> · {d.timeline}</span>
                  <Badge className="ml-2 text-[8px] bg-red-50 text-red-700 border-red-200">{m.score}% match</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main matches grid */}
      {matchLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-4 border-muted border-t-foreground rounded-full animate-spin" />
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border/60 rounded-2xl">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg mb-1">No Matches Yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Complete your investor profile to receive curated deal matches.</p>
          <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/85" onClick={() => navigate('/investor-profile')}>
            Complete Profile
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMatches.map(match => (
            <MatchedDealCard
              key={match.id}
              match={match}
              deal={dealMap[match.deal_id]}
              onViewDeal={(id) => navigate(`/deal-room/${id}`)}
              onRequestIntro={handleRequestIntro}
              onSave={toggleSave}
              saved={savedDeals.includes(match.deal_id)}
            />
          ))}
        </div>
      )}

      {selectedDeal && (
        <RequestIntroModal
          deal={selectedDeal}
          open={introOpen}
          onClose={() => setIntroOpen(false)}
          userEmail={user?.email}
        />
      )}
    </div>
  );
}