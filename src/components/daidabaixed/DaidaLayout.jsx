import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Brain, BarChart3, Database, AlertTriangle, FileText, Settings,
  Users, Shield, TrendingUp, Target, Calendar, Sparkles, Home,
  ChevronLeft, ChevronRight, Activity, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { path: '/daida-baixed', label: 'Command Center', icon: Brain, exact: true },
  { path: '/daida-baixed/academic', label: 'Academic Intelligence', icon: BarChart3 },
  { path: '/daida-baixed/sped', label: 'SPED Command', icon: Shield },
  { path: '/daida-baixed/culture', label: 'Culture & Climate', icon: Activity },
  { path: '/daida-baixed/staff', label: 'Staff Performance', icon: Users },
  { path: '/daida-baixed/goals', label: 'Goal Intelligence', icon: Target },
  { path: '/daida-baixed/calendar', label: 'Calendar Intel', icon: Calendar },
  { path: '/daida-baixed/alerts', label: 'Alerts & Actions', icon: AlertTriangle },
  { path: '/daida-baixed/reports', label: 'Report Engine', icon: FileText },
  { path: '/daida-baixed/ai-forecast', label: 'AI Forecasting', icon: TrendingUp },
  { path: '/daida-baixed/warehouse', label: 'Data Warehouse', icon: Database },
];

export default function DaidaLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-screen bg-[#020205] flex flex-col transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-60'
      )}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/5">
          {collapsed ? (
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mx-auto">
              <Brain className="w-4 h-4 text-black" />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-3.5 h-3.5 text-black" />
                </div>
                <div>
                  <p className="text-white font-black text-sm leading-none">Daida Baixed™</p>
                  <p className="text-white/25 text-[9px] font-black uppercase tracking-widest">Intelligence Center</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ path, label, icon: Icon, exact }) => {
            const active = exact ? pathname === path : pathname.startsWith(path);
            return (
              <Link key={path} to={path}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                  active ? 'bg-white text-black' : 'text-white/40 hover:bg-white/8 hover:text-white'
                )}>
                <Icon className={cn('flex-shrink-0', collapsed ? 'w-4 h-4 mx-auto' : 'w-3.5 h-3.5')} />
                {!collapsed && <span className="text-xs font-bold">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Back + Collapse */}
        <div className="px-2 pb-4 space-y-1">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/25 hover:text-white/60 transition-colors text-xs font-bold">
              <Home className="w-3.5 h-3.5" /> Back to Platform
            </Link>
          )}
          <button onClick={() => setCollapsed(c => !c)}
            className="flex items-center justify-center w-full py-2 rounded-xl text-white/20 hover:text-white/50 transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={cn('flex-1 min-h-screen transition-all duration-300', collapsed ? 'ml-16' : 'ml-60')}>
        <Outlet />
      </main>
    </div>
  );
}