import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, RefreshCw, SlidersHorizontal, AlertCircle, Lightbulb, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatchedInvestorCard from '../components/matching/MatchedInvestorCard';
import PitchReadinessCard from '../components/matching/PitchReadinessCard';
import RequestIntroModal from '../components/dealroom/RequestIntroModal';

export default function MatchedEdVestors() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [computing, setComputing] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [savedInvestors, setSavedInvestors] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [minScore, setMinScore] = useState('');

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: myDeals = [] } = useQuery({
    queryKey: ['founder_deals', user?.email],
    queryFn: () => base44.entities.DealRoom.filter({ founder_email: user.email }),
    enabled: !!user?.email,
  });

  const activeDeal = myDeals.find(d => d.id === selectedDealId) || myDeals[0];

  useEffect(() => {
    if (myDeals.length > 0 && !selectedDealId) setSelectedDealId(myDeals[0].id);
  }, [myDeals]);

  const { data: matches = [], isLoading: matchLoading, refetch: refetchMatches } = useQuery({
    queryKey: ['founder_matches', activeDeal?.id],
    queryFn: () => base44.entities.MatchScore.filter({ deal_id: activeDeal.id }),
    enabled: !!activeDeal?.id,
  });

  const investorIds = [...new Set(matches.map(m => m.edvestor_email))];
  const { data: investors = [] } = useQuery({
    queryKey: ['matched_investors', investorIds.join(',')],
    queryFn: () => base44.entities.EdVestor.filter({ status: 'active' }),
    enabled: investorIds.length > 0,
  });

  const investorMap = Object.fromEntries((investors || []).map(inv => [inv.user_email, inv]));

  const filteredMatches = matches
    .filter(m => !minScore || m.score >= Number(minScore))
    .sort((a, b) => b.score - a.score);

  const handleCompute = async () => {
    if (!activeDeal?.id) return;
    setComputing(true);
    await base44.functions.invoke('computeMatchScores', { deal_id: activeDeal.id });
    await refetchMatches();
    setComputing(false);
  };

  const handleComputeReadiness = async () => {
    if (!activeDeal?.id) return;
    setComputing(true);
    await base44.functions.invoke('computePitchReadiness', { deal_id: activeDeal.id });
    await refetchMatches();
    setComputing(false);
  };

  const handleRequestIntro = (investor) => {
    setSelectedInvestor(investor);
    setIntroOpen(true);
  };

  const toggleSave = (id) => {
    setSavedInvestors(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  // AI suggestions for the founder
  const founderInsights = [];
  const topFocus = filteredMatches.slice(0, 5).flatMap(m => {
    const inv = investorMap[m.edvestor_email];
    return inv?.preferred_education_focus || [];
  });
  const focusCounts = topFocus.reduce((acc, f) => { acc[f] = (acc[f] || 0) + 1; return acc; }, {});
  const topFocusArea = Object.entries(focusCounts).sort((a,b) => b[1]-a[1])[0]?.[0];
  if (topFocusArea) founderInsights.push(`Your strongest investor matches prefer ${topFocusArea.replace('_', ' ')} outcomes. Lead with this in your materials.`);
  if (activeDeal && !activeDeal.financials_url) founderInsights.push('Upload financials to significantly improve investor readiness and match quality.');
  if (activeDeal && !activeDeal.pitch_deck_url) founderInsights.push('Upload your pitch deck — this is the #1 factor in investor confidence.');
  if (activeDeal && !activeDeal.founder_track_record) founderInsights.push('Your profile is missing founder track record evidence. Add prior results.');
  if (activeDeal && (activeDeal.amount_seeking || 0) > 2000000) founderInsights.push('Your funding ask may be broad. Consider separating expansion capital from intervention funding.');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Matched edVestors</h1>
          <p className="text-sm text-muted-foreground mt-1">Investors aligned with your opportunity. Ranked by capital fit.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2 text-xs" onClick={handleComputeReadiness} disabled={computing}>
            <CheckCircle className="w-3.5 h-3.5" />
            Score Readiness
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 text-xs" onClick={handleCompute} disabled={computing}>
            <RefreshCw className={`w-3.5 h-3.5 ${computing ? 'animate-spin' : ''}`} />
            {computing ? 'Computing…' : 'Refresh Matches'}
          </Button>
        </div>
      </div>

      {/* Opportunity selector */}
      {myDeals.length > 1 && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Viewing matches for:</span>
          <Select value={selectedDealId} onValueChange={setSelectedDealId}>
            <SelectTrigger className="w-64 rounded-xl text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {myDeals.map(d => <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      {activeDeal && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: main column */}
          <div className="lg:col-span-2 space-y-6">

            {/* AI Founder Insights */}
            {founderInsights.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] uppercase tracking-widest font-medium text-amber-700">AI Insights for Your Opportunity</span>
                </div>
                <div className="space-y-2">
                  {founderInsights.map((ins, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-800">
                      <span className="mt-0.5">→</span>
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <Select value={minScore} onValueChange={setMinScore}>
                <SelectTrigger className="w-36 rounded-xl text-xs"><SelectValue placeholder="Min Score" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Matches</SelectItem>
                  <SelectItem value="90">Exceptional (90%+)</SelectItem>
                  <SelectItem value="80">Strong (80%+)</SelectItem>
                  <SelectItem value="70">Good (70%+)</SelectItem>
                </SelectContent>
              </Select>
              {minScore && (
                <Button variant="ghost" size="sm" className="rounded-xl text-xs" onClick={() => setMinScore('')}>Clear</Button>
              )}
            </div>

            {/* Matched investors */}
            {matchLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-4 border-muted border-t-foreground rounded-full animate-spin" />
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border/60 rounded-2xl">
                <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-heading font-bold text-lg mb-1">No Matches Yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {myDeals.length === 0 ? 'Create an opportunity to see matched investors.' : 'Click Refresh Matches to compute your investor alignment scores.'}
                </p>
                {myDeals.length === 0 && (
                  <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/85" onClick={() => navigate('/founder-dashboard')}>
                    Create Opportunity
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{filteredMatches.length} aligned investors</div>
                {filteredMatches.map(match => {
                  const investor = investorMap[match.edvestor_email];
                  if (!investor) return null;
                  return (
                    <MatchedInvestorCard
                      key={match.id}
                      match={match}
                      investor={investor}
                      canViewFull={match.score >= 70}
                      onRequestIntro={handleRequestIntro}
                      onSave={toggleSave}
                      saved={savedInvestors.includes(investor.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: pitch readiness */}
          <div className="space-y-4">
            {activeDeal.pitch_readiness_score > 0 && (
              <PitchReadinessCard
                score={activeDeal.pitch_readiness_score}
                label={activeDeal.pitch_readiness_label}
                suggestions={activeDeal.ai_suggestions || []}
              />
            )}

            {/* Deal summary */}
            <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Your Opportunity</div>
              <div>
                <div className="font-heading font-bold text-sm">{activeDeal.title}</div>
                {activeDeal.opportunity_thesis && (
                  <p className="text-xs text-muted-foreground mt-1 italic">"{activeDeal.opportunity_thesis}"</p>
                )}
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                {activeDeal.amount_seeking && <div>Ask: <span className="text-foreground font-medium">${activeDeal.amount_seeking.toLocaleString()}</span></div>}
                {activeDeal.stage && <div>Stage: <span className="text-foreground font-medium capitalize">{activeDeal.stage.replace('_', ' ')}</span></div>}
                <div>Status: <span className={`font-medium ${activeDeal.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>{activeDeal.status?.replace('_', ' ')}</span></div>
              </div>
              {activeDeal.status !== 'active' && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Your opportunity is pending admin review before investors can see it.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No deals state */}
      {myDeals.length === 0 && (
        <div className="text-center py-20 bg-card border border-border/60 rounded-2xl">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-heading font-bold text-xl mb-2">Create Your Opportunity First</h3>
          <p className="text-muted-foreground text-sm mb-6">Submit a funding opportunity to see which edVestors align with your goals.</p>
          <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/85" onClick={() => navigate('/founder-dashboard')}>
            Create Opportunity
          </Button>
        </div>
      )}

      {selectedInvestor && (
        <RequestIntroModal
          deal={activeDeal}
          open={introOpen}
          onClose={() => setIntroOpen(false)}
          userEmail={user?.email}
        />
      )}
    </div>
  );
}