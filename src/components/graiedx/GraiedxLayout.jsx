import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, BarChart3,
  FileText, Bell, ChevronLeft, ChevronRight,
  Mic, Star, Users, GraduationCap, MessageSquare, Home,
  DollarSign, Shield, UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { path: '/graiedx', icon: LayoutDashboard, label: 'Command Center', exact: true },
  { path: '/graiedx/gradebook', icon: ClipboardList, label: 'Gradebook' },
  { path: '/graiedx/assignments', icon: BookOpen, label: 'Assignments' },
  { path: '/graiedx/students', icon: Users, label: 'Students' },
  { path: '/graiedx/voice', icon: Mic, label: 'Voice Grading' },
  { path: '/graiedx/reports', icon: FileText, label: 'Reports' },
  { path: '/graiedx/analytics', icon: BarChart3, label: 'AI Analytics' },
  { path: '/graiedx/alerts', icon: Bell, label: 'Alerts' },
  { path: '/graiedx/standards', icon: Star, label: 'Standards' },
  { path: '/graiedx/family', icon: MessageSquare, label: 'Family Portal' },
];

const PAIY_NAV = [
  { path: '/graiedx/paiy', icon: DollarSign, label: 'Parent Hub' },
  { path: '/graiedx/paiy-student', icon: UserCheck, label: 'Student View' },
  { path: '/graiedx/paiy-teacher', icon: Shield, label: 'Teacher View' },
];

export default function GraiedxLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const renderLink = ({ path, icon: Icon, label, exact }) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path) && path !== '/graiedx';
    const isExactActive = path === '/graiedx' && location.pathname === '/graiedx';
    const active = isActive || isExactActive;
    return (
      <Link key={path} to={path} className={cn(
        'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all',
        collapsed && 'justify-center px-0',
        active ? 'bg-white text-black' : 'text-white/50 hover:bg-white/5 hover:text-white'
      )}>
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        {!collapsed && <span className="text-xs font-bold">{label}</span>}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        'flex-shrink-0 bg-[#020205] text-white flex flex-col transition-all duration-300 z-10',
        collapsed ? 'w-16' : 'w-56'
      )}>
        {/* Logo */}
        <div className={cn('p-4 border-b border-white/5 flex items-center gap-3', collapsed && 'justify-center p-3')}>
          {!collapsed && (
            <div>
              <p className="font-black text-sm leading-none text-white">Graiedx™</p>
              <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-0.5">AI Gradebook OS</p>
            </div>
          )}
          {collapsed && <GraduationCap className="w-5 h-5 text-white" />}
        </div>

        {/* Back to Main */}
        <Link to="/" className={cn(
          'flex items-center gap-2.5 mx-2 mt-2 px-3 py-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all text-xs font-bold',
          collapsed && 'justify-center px-0'
        )}>
          <Home className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && 'Back to Platform'}
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(renderLink)}

          {/* Paiy Section */}
          <div className={cn('pt-3 mt-2 border-t border-white/5', collapsed && 'flex flex-col items-center')}>
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 pb-1.5">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Paiy Graiedx™</span>
              </div>
            )}
            {PAIY_NAV.map(renderLink)}
          </div>
        </nav>

        {/* Collapse */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 text-white/20 hover:text-white transition-all border-t border-white/5">
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}