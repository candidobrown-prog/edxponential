import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Users } from 'lucide-react';
import CommunityCard from '../components/communities/CommunityCard';
import EdxTooltip from '@/components/platform/EdxTooltip';
import { TOOLTIP } from '@/lib/tooltipData';

const communityCategories = [
  { value: 'charter_schools', label: 'Charter Schools' },
  { value: 'public_schools', label: 'Public Schools' },
  { value: 'private_schools', label: 'Private Schools' },
  { value: 'higher_ed', label: 'Higher Ed' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'policy', label: 'Policy' },
  { value: 'general', label: 'General' },
];

export default function Communities() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [form, setForm] = useState({ name: '', description: '', category: 'general', visibility: 'public' });
  const queryClient = useQueryClient();

  const { data: communities = [], isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: () => base44.entities.Community.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.Community.create({
        ...data,
        moderator_name: user.full_name,
        moderator_email: user.email,
        status: 'active',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      setOpen(false);
      setForm({ name: '', description: '', category: 'general', visibility: 'public' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const filtered = communities.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || c.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground mt-1">Connect with fellow education leaders and share insights</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <EdxTooltip data={TOOLTIP.communityCreate} delay={400}>
              <Button className="bg-primary hover:bg-primary/90 rounded-xl gap-2">
                <Plus className="w-4 h-4" /> Create Community
              </Button>
            </EdxTooltip>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Create New Community</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Community Name</Label>
                <Input placeholder="e.g., Charter School Founders Network" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="What is this community about?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {communityCategories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select value={form.visibility} onValueChange={v => setForm({...form, visibility: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="invite_only">Invite Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-xl" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Community'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10 rounded-xl" placeholder="Search communities..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-44 rounded-xl"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {communityCategories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-muted-foreground">No communities yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create the first community for education leaders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(community => <CommunityCard key={community.id} community={community} />)}
        </div>
      )}
    </div>
  );
}