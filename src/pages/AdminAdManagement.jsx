import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Clock, Edit2, Trash2, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminAdManagement() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      // Check if admin
      if (u.role !== 'admin') {
        window.location.href = '/dashboard';
      }
    }).catch(() => {});
  }, []);

  // Fetch all ads
  const { data: allAds = [] } = useQuery({
    queryKey: ['all-ads'],
    queryFn: () => base44.asServiceRole.entities.Advertisement.list(),
    enabled: !!user?.role === 'admin',
  });

  // Fetch advertiser accounts
  const { data: advertisers = [] } = useQuery({
    queryKey: ['advertisers'],
    queryFn: () => base44.asServiceRole.entities.AdvertiserAccount.list(),
  });

  const pendingAds = allAds.filter(ad => ad.status === 'pending_approval');
  const approvedAds = allAds.filter(ad => ad.status === 'approved');
  const activeAds = allAds.filter(ad => ad.status === 'active');
  const rejectedAds = allAds.filter(ad => ad.status === 'rejected');

  const approveMutation = useMutation({
    mutationFn: (adId) =>
      base44.asServiceRole.entities.Advertisement.update(adId, {
        status: 'approved',
        approved_by: user.email
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-ads'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (adId, reason) =>
      base44.asServiceRole.entities.Advertisement.update(adId, {
        status: 'rejected',
        rejection_reason: reason,
        approved_by: user.email
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-ads'] }),
  });

  const activateMutation = useMutation({
    mutationFn: (adId) =>
      base44.asServiceRole.entities.Advertisement.update(adId, {
        status: 'active'
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-ads'] }),
  });

  const getTabData = () => {
    switch (activeTab) {
      case 'pending':
        return pendingAds;
      case 'approved':
        return approvedAds;
      case 'active':
        return activeAds;
      case 'rejected':
        return rejectedAds;
      default:
        return [];
    }
  };

  const tabData = getTabData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-1 mb-1">Ad Management</h1>
              <p className="body-sm text-muted-foreground">Approve, manage, and monitor advertisements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Pending', count: pendingAds.length, color: 'text-yellow-600' },
            { label: 'Approved', count: approvedAds.length, color: 'text-blue-600' },
            { label: 'Active', count: activeAds.length, color: 'text-green-600' },
            { label: 'Advertisers', count: advertisers.length, color: 'text-primary' }
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-lg border border-border bg-card">
              <p className="caption text-muted-foreground mb-2">{stat.label}</p>
              <p className={`title font-bold ${stat.color}`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-border overflow-x-auto">
          {[
            { id: 'pending', label: `Pending (${pendingAds.length})` },
            { id: 'approved', label: `Approved (${approvedAds.length})` },
            { id: 'active', label: `Active (${activeAds.length})` },
            { id: 'rejected', label: `Rejected (${rejectedAds.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ad List */}
        <div className="space-y-3">
          {tabData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No ads in this category</p>
            </div>
          ) : (
            tabData.map(ad => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="title font-semibold">{ad.title}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        ad.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-700' :
                        ad.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                        ad.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {ad.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="body-sm text-muted-foreground mb-3">{ad.description}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="caption text-muted-foreground">Placement</p>
                        <p className="body-sm font-medium">{ad.placement_type}</p>
                      </div>
                      <div>
                        <p className="caption text-muted-foreground">Performance</p>
                        <p className="body-sm font-medium">{ad.impressions || 0} impressions · {ad.ctr || 0}% CTR</p>
                      </div>
                      <div>
                        <p className="caption text-muted-foreground">Budget</p>
                        <p className="body-sm font-medium">${ad.budget_daily || 0}/day</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    {ad.status === 'pending_approval' && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => approveMutation.mutate(ad.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectMutation.mutate(ad.id, 'Admin rejection')}
                          className="border-red-200 text-red-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {ad.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => activateMutation.mutate(ad.id)}
                        className="bg-primary"
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}