import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { EdxTooltipRenderer } from '@/components/platform/EdxTooltip';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {/* Premium top bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-8 py-3 flex items-center justify-end">
          <span className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em] hidden sm:block">The Future of Education Leadership</span>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
      <EdxTooltipRenderer />
    </div>
  );
}