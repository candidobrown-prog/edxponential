import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Outlet } from 'react-router-dom';
import SmartNavigation from '@/components/platform/SmartNavigation';
import { EdxTooltipRenderer } from '@/components/platform/EdxTooltip';
import NotificaxionsBar from '@/components/platform/NotificaxionsBar';
import RoleSwitcher from '@/components/ceo/RoleSwitcher';

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState('Principal Park');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      // In a real app, this would come from user.membership_tier
      setUserTier(u?.membership_tier || 'Principal Park');
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SmartNavigation tier={userTier} />
      
      <main className="transition-all duration-300" style={{ marginLeft: sidebarExpanded ? '220px' : '0' }}>
        {/* Header */}
        <div className="sticky top-0 z-30 h-14 bg-background/95 backdrop-blur-sm border-b border-border px-8 flex items-center justify-between">
          <div className="flex-1" />
          <NotificaxionsBar />
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <Outlet context={{ user, userTier }} />
        </div>
      </main>

      <EdxTooltipRenderer />
      <RoleSwitcher userEmail={user?.email} />
    </div>
  );
}