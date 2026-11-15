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
import { Plus, Search, DollarSign, MapPin, Briefcase, TrendingUp } from 'lucide-react';

const STAGE_LABELS = { seed: 'Seed', early: 'Early', growth: 'Growth', late: 'Late', all_stages: 'All Stages' };
const CAPITAL_LABELS = {
  under_100k: '<$100K',
  '100k_500k': '$100K–$500K',
  '500k_1m': '$500K–$1M',
  '1m_5m': '$1M–$5M',
  '5m_plus': '$5M+',
};

function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function EdVestors() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [form, setForm] = useState({
    full_name: '', title: '', bio: '', geography: '',
    investment_stage: 'all_stages', available_capital_range: '1m_5m',
    contact_preference: 'platform_only', total_invested: '',
  });
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: vestors = [], isLoading } = useQuery({
    queryKey: ['edvestors'],
    queryFn: () => base44.entities.EdVestor.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.EdVestor.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edvestors'] });
      setOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      user_email: user?.email,
      total_invested: form.total_invested ? Number(form.total_invested) : undefined,
      status: 'active',
    });
  };

  const filtered = vestors.filter(v => {
    const matchSearch = !search || v.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.bio?.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'all' || v.investment_stage === filterStage;
    return matchSearch && matchStage && v.status === 'active';
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Capital Network</span>
          </div>
          <h1 className="font-heading text-3xl font-bold">edVestors</h1>
          <p className="text-muted-foreground mt-1">High-conviction investors funding the next generation of education institutions.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl gap-2 shrink-0">
              <Plus className="w-4 h-4" /> Add edVestor Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">edVestor Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Title / Firm</Label>
                  <Input placeholder="Managing Partner, Apex Capital" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea placeholder="Investment philosophy and focus areas..." value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Investment Stage</Label>
                  <Select value={form.investment_stage} onValueChange={v => setForm({...form, investment_stage: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Available Capital</Label>
                  <Select value={form.available_capital_range} onValueChange={v => setForm({...form, available_capital_range: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CAPITAL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Geography</Label>
                  <Input placeholder="Northeast US, National..." value={form.geography} onChange={e => setForm({...form, geography: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Total Deployed ($)</Label>
                  <Input type="number" placeholder="5000000" value={form.total_invested} onChange={e => setForm({...form, total_invested: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Contact Preference</Label>
                <Select value={form.contact_preference} onValueChange={v => setForm({...form, contact_preference: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform_only">Platform Only</SelectItem>
                    <SelectItem value="email">Email Direct</SelectItem>
                    <SelectItem value="intro_required">Warm Intro Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving...' : 'Create edVestor Profile'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10 rounded-xl" placeholder="Search investors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-44 rounded-xl"><SelectValue placeholder="Stage Focus" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-60 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <DollarSign className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-muted-foreground">No edVestors yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Add the first edVestor profile to start building the capital network.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(v => (
            <div key={v.id} className="bg-card border border-border/50 rounded-2xl p-6 hover:border-black/20 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4 mb-4">
                {v.avatar_url ? (
                  <img src={v.avatar_url} alt={v.full_name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-heading font-bold text-lg">{v.full_name?.[0]}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-heading font-semibold truncate">{v.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{v.title}</div>
                  <Badge className="mt-1 bg-black text-white text-[9px] uppercase tracking-wider">edVestor</Badge>
                </div>
              </div>
              {v.bio && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{v.bio}</p>}
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {v.geography && (
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {v.geography}</div>
                )}
                {v.investment_stage && (
                  <div className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> {STAGE_LABELS[v.investment_stage]} focus</div>
                )}
                {v.available_capital_range && (
                  <div className="flex items-center gap-1.5 font-semibold text-black"><DollarSign className="w-3 h-3" /> {CAPITAL_LABELS[v.available_capital_range]} available</div>
                )}
                {v.total_invested && (
                  <div className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> {formatAmount(v.total_invested)} deployed</div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {v.contact_preference === 'platform_only' ? '📨 Platform only' : v.contact_preference === 'intro_required' ? '🤝 Warm intro required' : '✉️ Email direct'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}