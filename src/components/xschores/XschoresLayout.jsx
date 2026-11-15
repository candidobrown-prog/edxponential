import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, Settings, BarChart3, ClipboardList, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/xschores', icon: LayoutDashboard, label: 'Leader Dashboard', exact: true },
  { path: '/xschores/students', icon: Users, label: 'Students' },
  { path: '/xschores/alerts', icon: ShieldAlert, label: 'Alerts' },
  { path: '/xschores/culture', icon: ClipboardList, label: 'Culture Log' },
  { path: '/xschores/benchmarks', icon: Settings, label: 'Benchmarks' },
  { path: '/xschores/reports', icon: BarChart3, label: 'Reports' },
];

export default function XschoresLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-screen bg-[#0a0f1e] text-white flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-20' : 'w-64'
      )}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
          {collapsed ? (
            <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
              <span className="text-black font-black text-xs">XS</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center flex-shrink-0">
                <span className="text-black font-black text-xs">XS</span>
              </div>
              <div>
                <p className="font-black text-white text-sm leading-none">Xschores™</p>
                <p className="text-white/40 text-[10px]">Student Intelligence</p>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label, exact }) => {
            const isActive = exact ? location.pathname === path : location.pathname.startsWith(path) && path !== '/xschores';
            const isExactActive = exact && location.pathname === path;
            const active = isExactActive || (!exact && isActive);
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Back to main + collapse */}
        <div className="px-3 pb-5 space-y-1 border-t border-white/10 pt-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Back to Platform</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-xl text-white/30 hover:text-white transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn('flex-1 overflow-y-auto transition-all duration-300', collapsed ? 'ml-20' : 'ml-64')}>
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}