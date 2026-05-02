import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Bookmark, MessageSquare, TrendingUp, Lock, DollarSign } from 'lucide-react';

const STAGE_LABELS = {
  seed: 'Seed',
  early: 'Early Stage',
  growth: 'Growth',
  late: 'Late Stage',
};

const EDU_LABELS = {
  charter: 'Charter',
  private: 'Private School',
  public: 'Public School',
  higher_ed: 'Higher Ed',
  edtech: 'EdTech',
  other: 'Other',
};

function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function DealRoom() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', stage: 'seed', education_type: 'charter', amount_seeking: '', geography: '' });
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => base44.entities.DealRoom.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.DealRoom.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setOpen(false);
      setForm({ title: '', description: '', stage: 'seed', education_type: 'charter', amount_seeking: '', geography: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      founder_email: user?.email,
      founder_name: user?.full_name || 'Anonymous',
      amount_seeking: form.amount_seeking ? Number(form.amount_seeking) : undefined,
      status: 'active',
    });
  };

  const saveDeal = (id) => {
    base44.entities.DealRoom.update(id, { saves_count: (deals.find(d => d.id === id)?.saves_count || 0) + 1 });
    queryClient.invalidateQueries({ queryKey: ['deals'] });
  };

  const requestIntro = (id) => {
    base44.entities.DealRoom.update(id, { intros_count: (deals.find(d => d.id === id)?.intros_count || 0) + 1 });
    queryClient.invalidateQueries({ queryKey: ['deals'] });
  };

  const filtered = deals.filter(d => {
    const matchSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.founder_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.organization?.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'all' || d.stage === filterStage;
    const matchType = filterType === 'all' || d.education_type === filterType;
    return matchSearch && matchStage && matchType && d.status === 'active';
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Private · Members Only</span>
          </div>
          <h1 className="font-heading text-3xl font-bold">Deal Room</h1>
          <p className="text-muted-foreground mt-1">Where capital meets education operators. Private opportunities for members only.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl gap-2 shrink-0">
              <Plus className="w-4 h-4" /> Submit Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Submit an Opportunity</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Opportunity Title</Label>
                <Input placeholder="e.g. Scaling Charter Network, Series A Round" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Description / Pitch</Label>
                <Textarea placeholder="Describe your vision, traction, and what you're looking for..." className="min-h-[100px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select value={form.stage} onValueChange={v => setForm({...form, stage: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Education Type</Label>
                  <Select value={form.education_type} onValueChange={v => setForm({...form, education_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(EDU_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount Seeking ($)</Label>
                  <Input type="number" placeholder="500000" value={form.amount_seeking} onChange={e => setForm({...form, amount_seeking: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Geography</Label>
                  <Input placeholder="e.g. Northeast US" value={form.geography} onChange={e => setForm({...form, geography: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Submitting...' : 'Submit to Deal Room'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10 rounded-xl" placeholder="Search opportunities..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(EDU_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Opportunities', value: deals.filter(d => d.status === 'active').length, icon: TrendingUp },
          { label: 'Total Seeking', value: formatAmount(deals.reduce((acc, d) => acc + (d.amount_seeking || 0), 0)), icon: DollarSign },
          { label: 'Intro Requests', value: deals.reduce((acc, d) => acc + (d.intros_count || 0), 0), icon: MessageSquare },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <div className="font-heading text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      {/* Deal Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <TrendingUp className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-muted-foreground">No active opportunities</h3>
          <p className="text-sm text-muted-foreground mt-1">Be the first to submit an opportunity to the Deal Room.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(deal => (
            <div key={deal.id} className="bg-card border border-border/50 rounded-2xl p-6 hover:border-black/20 hover:shadow-sm transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className="bg-black text-white text-[10px] uppercase tracking-wider">{STAGE_LABELS[deal.stage]}</Badge>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{EDU_LABELS[deal.education_type]}</Badge>
                    {deal.geography && <Badge variant="outline" className="text-[10px]">{deal.geography}</Badge>}
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-1">{deal.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{deal.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>By <strong className="text-foreground">{deal.founder_name}</strong></span>
                    {deal.organization && <span>{deal.organization}</span>}
                    {deal.amount_seeking && <span className="text-black font-semibold">Seeking {formatAmount(deal.amount_seeking)}</span>}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs" onClick={() => saveDeal(deal.id)}>
                    <Bookmark className="w-3.5 h-3.5" /> Save {deal.saves_count > 0 && `(${deal.saves_count})`}
                  </Button>
                  <Button size="sm" className="rounded-xl gap-1.5 text-xs bg-black text-white hover:bg-black/85" onClick={() => requestIntro(deal.id)}>
                    <MessageSquare className="w-3.5 h-3.5" /> Request Intro {deal.intros_count > 0 && `(${deal.intros_count})`}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}