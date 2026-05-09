import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdCard from './AdCard';
import PremiumUpgradePrompt from './PremiumUpgradePrompt';
import { AnimatePresence } from 'framer-motion';

export default function AdSlot({ placement, position = 'center', className = '' }) {
  const [dismissedAds, setDismissedAds] = useState(new Set());
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  // Check if user is premium (has paid membership)
  const isPremium = user?.membership_tier === 'premium' || user?.membership_tier === 'executive';

  // Fetch ads for this placement
  const { data: ads = [] } = useQuery({
    queryKey: ['ads', placement, user?.email],
    queryFn: async () => {
      if (!user?.email || isPremium) return [];
      const response = await base44.entities.Advertisement.filter({
        placement_type: placement,
        status: 'active'
      });
      return response || [];
    },
    enabled: !!user && !isPremium,
  });

  // Filter out dismissed ads
  const visibleAds = ads.filter(ad => !dismissedAds.has(ad.id));

  const handleDismissAd = (adId) => {
    setDismissedAds(prev => new Set([...prev, adId]));
    // Track dismissal analytics
    base44.functions.invoke('trackAdEvent', {
      adId,
      event: 'dismissed'
    }).catch(() => {});
  };

  const handleViewAd = (adId) => {
    // Track view analytics
    base44.functions.invoke('trackAdEvent', {
      adId,
      event: 'clicked'
    }).catch(() => {});
  };

  // Premium users don't see ads, but show upgrade prompt instead
  if (isPremium) {
    return null;
  }

  // If no ads available, show internal promotion
  if (!visibleAds.length) {
    return (
      <PremiumUpgradePrompt
        position={position}
        className={className}
      />
    );
  }

  // Show the first available ad
  const ad = visibleAds[0];

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {!dismissedAds.has(ad.id) && (
          <AdCard
            key={ad.id}
            ad={ad}
            onDismiss={handleDismissAd}
            onView={handleViewAd}
          />
        )}
      </AnimatePresence>
    </div>
  );
}