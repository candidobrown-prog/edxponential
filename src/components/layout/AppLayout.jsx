import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { EdxTooltipRenderer } from '@/components/platform/EdxTooltip';
import NotificaxionsBar from '@/components/platform/NotificaxionsBar';
import RoleSwitcher from '@/components/ceo/RoleSwitcher';
import EddyAssistant from '@/components/eddy/EddyAssistant';

export default function AppLayout() {
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[220px] min-h-screen transition-all duration-300">
        <div className="sticky top-0 z-30 h-14 bg-[#f7f7f7]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.05] px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
              alt="edXponential"
              className="h-6 w-auto opacity-30 hidden sm:block"
            />
          </div>
          <NotificaxionsBar />
        </div>
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
      <EdxTooltipRenderer />
      <RoleSwitcher userEmail={user?.email} />
      <EddyAssistant />
    </div>
  );
}