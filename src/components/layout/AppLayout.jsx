import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { EdxTooltipRenderer } from '@/components/platform/EdxTooltip';
import NotificaxionsBar from '@/components/platform/NotificaxionsBar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {/* Premium top bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-8 py-3 flex items-center justify-between">
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-8 w-auto hidden sm:block"
          />
          <NotificaxionsBar />
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
      <EdxTooltipRenderer />
    </div>
  );
}