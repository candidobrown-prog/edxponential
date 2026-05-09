import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Brain, BarChart3, Users, FileText, Target, Clock, Calendar, Shield, Sparkles, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { path: '/perspedxtives', label: 'Dashboard', icon: BarChart3, exact: true },
  { path: '/perspedxtives/students', label: 'Students', icon: Users },
  { path: '/perspedxtives/ieps', label: 'IEPs', icon: FileText },
  { path: '/perspedxtives/goals', label: 'Goals', icon: Target },
  { path: '/perspedxtives/services', label: 'Services', icon: Clock },
  { path: '/perspedxtives/schedule', label: 'Schedule', icon: Calendar },
  { path: '/perspedxtives/meetings', label: 'Meetings', icon: Calendar },
  { path: '/perspedxtives/compliance', label: 'Compliance', icon: Shield },
  { path: '/perspedxtives/ai-generator', label: 'AI IEP', icon: Sparkles },
];

export default function PerSpEdxtivesLayout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Top Nav Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 h-14 overflow-x-auto">
          <Link to="/perspedxtives/home" className="flex items-center gap-2 mr-4 flex-shrink-0">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-sm text-black whitespace-nowrap">PerSpEdxtives™</span>
          </Link>
          {NAV.map(({ path, label, icon: Icon, exact }) => {
            const active = exact ? pathname === path : pathname.startsWith(path);
            return (
              <Link key={path} to={path}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0',
                  active ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-100'
                )}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}