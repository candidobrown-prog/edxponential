import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Sparkles } from 'lucide-react';
import CoachCard from '../components/coaching/CoachCard';

export default function Coaching() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({
    coach_name: '', coach_title: '', bio: '', session_type: 'one_on_one',
    duration_minutes: '60', price: '', specializations_text: ''
  });
  const queryClient = useQueryClient();

  const { data: coaches = [], isLoading } = useQuery({
    queryKey: ['coaches'],
    queryFn: () => base44.entities.CoachingSession.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CoachingSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      setOpen(false);
      setForm({ coach_name: '', coach_title: '', bio: '', session_type: 'one_on_one', duration_minutes: '60', price: '', specializations_text: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const specializations = form.specializations_text.split(',').map(s => s.trim()).filter(Boolean);
    createMutation.mutate({
      coach_name: form.coach_name,
      coach_title: form.coach_title,
      bio: form.bio,
      session_type: form.session_type,
      duration_minutes: Number(form.duration_minutes),
      price: form.price ? Number(form.price) : undefined,
      specializations,
      status: 'active',
    });
  };

  const filtered = coaches.filter(c => {
    const matchSearch = !search || c.coach_name?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || c.session_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Coaching & Consultation</h1>
          <p className="text-muted-foreground mt-1">Connect with expert education leaders for personalized guidance</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Add Coach Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Create Coach Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="Dr. Jane Smith" value={form.coach_name} onChange={e => setForm({...form, coach_name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="CEO, XYZ Academy" value={form.coach_title} onChange={e => setForm({...form, coach_title: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea placeholder="Share your experience and approach..." value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Specializations (comma-separated)</Label>
                <Input placeholder="Leadership, Fundraising, Scaling" value={form.specializations_text} onChange={e => setForm({...form, specializations_text: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Session Type</Label>
                  <Select value={form.session_type} onValueChange={v => setForm({...form, session_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_on_one">1-on-1</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input type="number" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input type="number" placeholder="250" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-xl" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Profile'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10 rounded-xl" placeholder="Search coaches..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-44 rounded-xl"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="one_on_one">1-on-1</SelectItem>
            <SelectItem value="group">Group</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-56 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-muted-foreground">No coaches yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Add a coaching profile to start offering sessions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(coach => <CoachCard key={coach.id} coach={coach} />)}
        </div>
      )}
    </div>
  );
}