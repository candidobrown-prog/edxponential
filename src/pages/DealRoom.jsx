import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search, Lock, TrendingUp, DollarSign, Layers,
  ChevronRight, ChevronLeft, User, LayoutDashboard, Briefcase, Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

function DealRoomNav({ onSubmit }) {
  const NAV = [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Deal Room', to: '/deal-room', icon: Briefcase },
    { label: 'Network', to: '/edvestors', icon: Users },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <span className="text-background font-heading font-bold text-xs">eX</span>
          </div>
          <span className="font-heading font-bold text-sm hidden sm:block">edXponential</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {NAV.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                window.location.pathname === to || (to === '/deal-room' && window.location.pathname.startsWith('/deal-room'))
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Button
          size="sm"
          className="rounded-lg gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/85 shrink-0"
          onClick={onSubmit}
        >
          Submit Opportunity <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </nav>
  );
}

function FilterBar({ search, setSearch, filterStage, setFilterStage, filterType, setFilterType, filterGeo, setFilterGeo, filterSize, setFilterSize }) {
  return (
    <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-sm border-b border-border/60 py-3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              className="pl-9 h-9 rounded-xl bg-muted border-0 text-xs placeholder:text-muted-foreground"
              placeholder="Search by school, founder, focus..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-32 h-9 rounded-xl text-xs bg-muted border-0">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
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
            <SelectTrigger className="w-32 h-9 rounded-xl text-xs bg-muted border-0">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="charter">Charter</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="edtech">EdTech</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="higher_ed">Higher Ed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterGeo} onValueChange={setFilterGeo}>
            <SelectTrigger className="w-36 h-9 rounded-xl text-xs bg-muted border-0">
              <SelectValue placeholder="Geography" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Geographies</SelectItem>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="southeast">Southeast</SelectItem>
              <SelectItem value="midwest">Midwest</SelectItem>
              <SelectItem value="southwest">Southwest</SelectItem>
              <SelectItem value="west">West</SelectItem>
              <SelectItem value="national">National</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSize} onValueChange={setFilterSize}>
            <SelectTrigger className="w-32 h-9 rounded-xl text-xs bg-muted border-0">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Size</SelectItem>
              <SelectItem value="small">&lt;$500K</SelectItem>
              <SelectItem value="mid">$500K–$2M</SelectItem>
              <SelectItem value="large">$2M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function FeaturedScroller({ deals, onView }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 380, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {deals.map(deal => (
          <div key={deal.id} className="flex-shrink-0 w-[360px]">
            <FeaturedDealCard deal={deal} onView={onView} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DealRoom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterGeo, setFilterGeo] = useState('all');
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
  const featured = activeDeals.filter(d => d.featured);

  const thisWeekCount = activeDeals.filter(d => {
    const diff = (Date.now() - new Date(d.created_date).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const filtered = activeDeals.filter(d => {
    const matchSearch = !search || [d.title, d.founder_name, d.organization, d.thesis]
      .filter(Boolean).some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchStage = filterStage === 'all' || d.stage === filterStage;
    const matchType = filterType === 'all' || d.education_type === filterType;
    const matchGeo = filterGeo === 'all' || (d.geography || '').toLowerCase().includes(filterGeo);
    const matchSize = filterSize === 'all' ||
      (filterSize === 'small' && (d.amount_seeking || 0) < 500000) ||
      (filterSize === 'mid' && (d.amount_seeking || 0) >= 500000 && (d.amount_seeking || 0) < 2000000) ||
      (filterSize === 'large' && (d.amount_seeking || 0) >= 2000000);
    return matchSearch && matchStage && matchType && matchGeo && matchSize;
  });

  const handleSave = async (id) => {
    setSavedIds(p => [...p, id]);
    const deal = deals.find(d => d.id === id);
    await base44.entities.DealRoom.update(id, { saves_count: (deal?.saves_count || 0) + 1 });
  };

  return (
    <div className="min-h-screen bg-background -mx-8 -mt-8">
      {/* Top Nav */}
      <DealRoomNav onSubmit={() => setSubmitOpen(true)} />

      {/* Filter Bar */}
      <FilterBar
        search={search} setSearch={setSearch}
        filterStage={filterStage} setFilterStage={setFilterStage}
        filterType={filterType} setFilterType={setFilterType}
        filterGeo={filterGeo} setFilterGeo={setFilterGeo}
        filterSize={filterSize} setFilterSize={setFilterSize}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Private · Members Only</span>
              {thisWeekCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-medium bg-foreground text-background px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                  {thisWeekCount} new this week
                </span>
              )}
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Deal Room</h1>
            <p className="text-muted-foreground mt-1 text-sm">Private investment opportunities in education.</p>
          </div>

          {/* Stats inline */}
          <div className="flex gap-4 shrink-0">
            {[
              { label: 'Active', value: activeDeals.length },
              { label: 'Capital', value: formatAmount(activeDeals.reduce((a, d) => a + (d.amount_seeking || 0), 0)) },
              { label: 'Intros', value: activeDeals.reduce((a, d) => a + (d.intros_count || 0), 0) },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-heading text-xl font-bold">{s.value}</div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Deals — Horizontal Scroll */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Featured Deals</span>
              <div className="h-px flex-1 bg-border/50" />
              <Badge className="bg-foreground text-background text-[9px] uppercase tracking-widest">{featured.length} curated</Badge>
            </div>
            <FeaturedScroller deals={featured} onView={(id) => navigate(`/deal-room/${id}`)} />
          </section>
        )}

        {/* All Opportunities — 3-col Grid */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">All Opportunities</span>
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-[10px] text-muted-foreground">{filtered.length} showing</span>
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
        </section>
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