import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Save, Mail, Briefcase, MapPin } from 'lucide-react';
import TierBadge, { TIERS } from '../components/shared/TierBadge';
import { toast } from 'sonner';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    organization: '',
    location: '',
    bio: '',
    membership_tier: 'potentials',
    role_type: 'founder',
    years_experience: '',
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setForm({
        title: u.title || '',
        organization: u.organization || '',
        location: u.location || '',
        bio: u.bio || '',
        membership_tier: u.membership_tier || 'potentials',
        role_type: u.role_type || 'founder',
        years_experience: u.years_experience || '',
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe(form);
    toast.success('Profile updated successfully');
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your professional information</p>
      </div>

      {/* Profile Header */}
      <div className="bg-card border border-border/50 rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-3xl font-heading font-bold text-primary-foreground">
              {user?.full_name?.[0] || 'U'}
            </span>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold">{user?.full_name || 'User'}</h2>
            <p className="text-muted-foreground flex items-center gap-1.5 mt-1 mb-2">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
            <TierBadge tier={form.membership_tier} size="md" />
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-6">
        <h3 className="font-heading text-lg font-semibold">Professional Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> Title
            </Label>
            <Input
              placeholder="e.g., CEO, Principal, Executive Director"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Organization</Label>
            <Input
              placeholder="e.g., Horizon Academy"
              value={form.organization}
              onChange={e => setForm({...form, organization: e.target.value})}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Location
            </Label>
            <Input
              placeholder="City, State"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={form.role_type} onValueChange={v => setForm({...form, role_type: v})}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="founder">Founder</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="principal">Principal</SelectItem>
                <SelectItem value="superintendent">Superintendent</SelectItem>
                <SelectItem value="board_member">Board Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Membership Tier</Label>
            <Select value={form.membership_tier} onValueChange={v => setForm({...form, membership_tier: v})}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TIERS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Years of Experience</Label>
          <Input
            type="number"
            placeholder="15"
            value={form.years_experience}
            onChange={e => setForm({...form, years_experience: e.target.value})}
            className="rounded-xl max-w-xs"
          />
        </div>

        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea
            placeholder="Share your professional journey and mission in education..."
            value={form.bio}
            onChange={e => setForm({...form, bio: e.target.value})}
            className="rounded-xl min-h-[120px]"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 rounded-xl gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}