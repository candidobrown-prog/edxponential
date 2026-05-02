import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Lock, TrendingUp, DollarSign, Layers, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DealCard from '../components/dealroom/DealCard';
import FeaturedDealCard from '../components/dealroom/FeaturedDealCard';
import RequestIntroModal from '../components/dealroom/RequestIntroModal';
import FounderSubmitModal from '../components/dealroom/FounderSubmitModal';

function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function DealRoom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [savedIds, setSavedIds] = useState([]);
  const [introTarget, setIntroTarget] = useState(null);
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => base44.entities.DealRoom.list('-created_date', 100),
  });

  const activeDeals = deals.filter(d => d.status === 'active');
  const featured = activeDeals.filter(d => d.featured).slice(0, 4);
  const thisWeekCount = activeDeals.filter(d => {
    const created = new Date(d.created_date);
    const diff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const filtered = activeDeals.filter(d => {
    const matchSearch = !search || [d.title, d.founder_name, d.organization, d.thesis]
      .filter(Boolean).some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchStage = filterStage === 'all' || d.stage === filterStage;
    const matchType = filterType === 'all' || d.education_type === filterType;
    const matchSize = filterSize === 'all' ||
      (filterSize === 'small' && (d.amount_seeking || 0) < 500000) ||
      (filterSize === 'mid' && (d.amount_seeking || 0) >= 500000 && (d.amount_seeking || 0) < 2000000) ||
      (filterSize === 'large' && (d.amount_seeking || 0) >= 2000000);
    return matchSearch && matchStage && matchType && matchSize;
  });

  const handleSave = async (id) => {
    setSavedIds(p => [...p, id]);
    const deal = deals.find(d => d.id === id);
    await base44.entities.DealRoom.update(id, { saves_count: (deal?.saves_count || 0) + 1 });
  };

  return (
    <div className="space-y-10">
      {/* Hero Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Private · Members Only</span>
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight">Deal Room</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">Private investment opportunities in education.</p>
          {thisWeekCount > 0 && (
            <div className="inline-flex items-center gap-1.5 mt-3 text-[10px] uppercase tracking-widest font-medium bg-foreground text-background px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
              {thisWeekCount} new opportunit{thisWeekCount > 1 ? 'ies' : 'y'} this week
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            className="rounded-xl gap-2 text-xs"
            onClick={() => navigate('/pipeline')}
          >
            <Layers className="w-4 h-4" /> My Pipeline
          </Button>
          <Button
            className="rounded-xl gap-2 text-xs bg-foreground text-background hover:bg-foreground/85"
            onClick={() => setSubmitOpen(true)}
          >
            Submit Opportunity <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, label: 'Active Opportunities', value: activeDeals.length },
          { icon: DollarSign, label: 'Capital in Room', value: formatAmount(activeDeals.reduce((a, d) => a + (d.amount_seeking || 0), 0)) },
          { icon: Layers, label: 'Intro Requests', value: activeDeals.reduce((a, d) => a + (d.intros_count || 0), 0) },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-card border border-border/60 rounded-xl p-4 text-center">
            <div className="font-heading text-2xl font-bold">{value}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Featured Deals */}
      {featured.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Curated for you</span>
            <div className="h-px flex-1 bg-border/50" />
            <Badge className="bg-foreground text-background text-[9px] uppercase tracking-widest">Featured</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map(deal => (
              <FeaturedDealCard
                key={deal.id}
                deal={deal}
                onView={(id) => navigate(`/deal-room/${id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Filter Bar */}
      <div className="bg-background/90 backdrop-blur-sm border border-border/60 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10 rounded-xl bg-muted border-0"
              placeholder="Search by school, founder, or focus..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="early">Early</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="turnaround">Turnaround</SelectItem>
              <SelectItem value="acquisition">Acquisition</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="charter">Charter</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="edtech">EdTech</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="higher_ed">Higher Ed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSize} onValueChange={setFilterSize}>
            <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Size" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Size</SelectItem>
              <SelectItem value="small">&lt;$500K</SelectItem>
              <SelectItem value="mid">$500K–$2M</SelectItem>
              <SelectItem value="large">$2M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* All Opportunities Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">All Opportunities</span>
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-xs text-muted-foreground">{filtered.length} showing</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <TrendingUp className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="font-heading font-semibold text-muted-foreground">No opportunities match your filters</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                onView={(id) => navigate(`/deal-room/${id}`)}
                onSave={handleSave}
                saved={savedIds.includes(deal.id)}
              />
            ))}
          </div>
        )}
      </div>

      <RequestIntroModal
        deal={introTarget}
        open={!!introTarget}
        onClose={() => setIntroTarget(null)}
        userEmail={user?.email}
      />
      <FounderSubmitModal
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        user={user}
      />
    </div>
  );
}