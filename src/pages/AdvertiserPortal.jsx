import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, BarChart3, Settings, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdvertiserPortal() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  // Fetch advertiser account
  const { data: advertiser } = useQuery({
    queryKey: ['advertiser', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const accounts = await base44.entities.AdvertiserAccount.filter({
        email: user.email
      });
      return accounts?.[0] || null;
    },
    enabled: !!user,
  });

  // Fetch campaigns
  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns', advertiser?.id],
    queryFn: async () => {
      if (!advertiser?.id) return [];
      return base44.entities.AdvertiserCampaign.filter({
        advertiser_id: advertiser.id
      });
    },
    enabled: !!advertiser?.id,
  });

  // Fetch analytics
  const { data: analytics = [] } = useQuery({
    queryKey: ['analytics', advertiser?.id],
    queryFn: async () => {
      if (!advertiser?.id) return [];
      return base44.entities.AdAnalytics.filter({
        advertiser_id: advertiser.id
      });
    },
    enabled: !!advertiser?.id,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to access advertiser portal</p>
        </div>
      </div>
    );
  }

  if (!advertiser) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="heading-1 mb-4">Advertise on edXponential</h1>
          <p className="body text-muted-foreground mb-8">
            Reach 500+ education leaders across our platform. Apply to become an advertiser partner.
          </p>
          <Button
            onClick={() => {
              base44.functions.invoke('createAdvertiserAccount', {
                userEmail: user.email
              }).then(() => {
                queryClient.invalidateQueries({ queryKey: ['advertiser'] });
              });
            }}
            className="bg-primary text-primary-foreground"
          >
            Apply to Advertise
          </Button>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalSpend = analytics.reduce((sum, a) => sum + a.spend, 0);
  const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
  const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-1 mb-1">Advertiser Portal</h1>
              <p className="body-sm text-muted-foreground">{advertiser.company_name}</p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Spend', value: `$${totalSpend.toFixed(2)}` },
            { label: 'Total Impressions', value: totalImpressions.toLocaleString() },
            { label: 'Total Clicks', value: totalClicks.toLocaleString() },
            { label: 'Avg CTR', value: `${avgCTR}%` }
          ].map((kpi, i) => (
            <div key={i} className="p-4 rounded-lg border border-border bg-card">
              <p className="caption text-muted-foreground mb-2">{kpi.label}</p>
              <p className="title font-bold text-black">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-border">
          {[
            { id: 'campaigns', label: 'Campaigns', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'campaigns' && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {showCreateForm && (
                <CreateCampaignForm
                  advertiser={advertiser}
                  onSuccess={() => {
                    setShowCreateForm(false);
                    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
                  }}
                />
              )}

              <div className="grid gap-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No campaigns yet. Create one to get started!</p>
                  </div>
                ) : (
                  campaigns.map(campaign => (
                    <div key={campaign.id} className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="title font-semibold">{campaign.name}</h3>
                          <p className="body-sm text-muted-foreground mt-1">{campaign.ads_count} ads</p>
                        </div>
                        <div className="text-right">
                          <p className="label text-muted-foreground">Status</p>
                          <p className="title font-semibold">{campaign.status}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center py-12">
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid gap-4 max-w-2xl">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <h3 className="title font-semibold mb-2">Company Info</h3>
                  <p className="body-sm text-muted-foreground">{advertiser.company_name}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <h3 className="title font-semibold mb-2">Account Status</h3>
                  <p className="body-sm text-muted-foreground">{advertiser.status}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CreateCampaignForm({ advertiser, onSuccess }) {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.AdvertiserCampaign.create({
        advertiser_id: advertiser.id,
        name,
        budget_total: parseFloat(budget),
        status: 'draft'
      });
      onSuccess();
    } catch (err) {
      console.error('Failed to create campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg border border-border bg-card mb-8">
      <h3 className="title font-semibold mb-4">Create New Campaign</h3>
      <div className="space-y-4">
        <div>
          <label className="label text-muted-foreground mb-2 block">Campaign Name</label>
          <Input
            placeholder="My Ad Campaign"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label text-muted-foreground mb-2 block">Budget (USD)</label>
          <Input
            type="number"
            placeholder="1000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </div>
    </form>
  );
}