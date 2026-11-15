import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Sparkles, Brain, Video, BookOpen, Layers, Zap, BarChart3,
  Users, Globe, ChevronLeft, ChevronRight, Home, Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { path: '/classifiedx/builder', icon: Brain, label: 'AI Course Builder' },
  { path: '/classifiedx/studio', icon: Video, label: 'Video Studio' },
  { path: '/classifiedx/syllabus', icon: BookOpen, label: 'Syllabus Builder' },
  { path: '/classifiedx/courses', icon: Layers, label: 'Course Library' },
  { path: '/classifiedx/assessments', icon: Zap, label: 'Assessments' },
  { path: '/classifiedx/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/classifiedx/lms', icon: Users, label: 'Students & LMS' },
  { path: '/classifiedx/publish', icon: Globe, label: 'Publish & Monetize' },
];

export default function ClassifiedxLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#080808] overflow-hidden">
      <aside className={cn(
        'flex-shrink-0 bg-black text-white flex flex-col border-r border-white/5 transition-all duration-300 z-10',
        collapsed ? 'w-14' : 'w-56'
      )}>
        {/* Logo */}
        <div className={cn('p-4 border-b border-white/5 flex items-center gap-2.5', collapsed && 'justify-center p-3')}>
          <Sparkles className="w-4 h-4 text-white flex-shrink-0" />
          {!collapsed && (
            <div>
              <p className="font-black text-sm text-white leading-none">Classifiedx™</p>
              <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-0.5">AI Course OS</p>
            </div>
          )}
        </div>

        {/* Back */}
        <Link to="/classifiedx/home" className={cn(
          'flex items-center gap-2 mx-2 mt-2 px-2.5 py-2 rounded-lg text-white/25 hover:text-white hover:bg-white/5 transition-all text-xs font-bold',
          collapsed && 'justify-center'
        )}>
          <Home className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && 'Home'}
        </Link>

        {/* Quick Create */}
        <Link to="/classifiedx/builder" className={cn(
          'flex items-center gap-2 mx-2 mt-1 px-2.5 py-2 rounded-lg bg-white text-black text-xs font-black hover:bg-white/90 transition-all',
          collapsed && 'justify-center px-0'
        )}>
          <Wand2 className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && 'Quick Create'}
        </Link>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Link key={path} to={path} className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all',
                collapsed && 'justify-center px-0',
                active ? 'bg-white text-black' : 'text-white/40 hover:bg-white/5 hover:text-white'
              )}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {!collapsed && <span className="text-xs font-bold">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <button onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 text-white/20 hover:text-white transition-all border-t border-white/5">
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        <Outlet />
      </main>
    </div>
  );
}