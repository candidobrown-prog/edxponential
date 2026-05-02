import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, User, ChevronLeft, ChevronRight, LogOut, Star, DollarSign, Briefcase, Layers, TrendingUp, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/courses', icon: BookOpen, label: 'Courses' },
  { path: '/edvisors', icon: Star, label: 'edVisors' },
  { path: '/communities', icon: Users, label: 'Communities' },
  { path: '/edvestors', icon: DollarSign, label: 'edVestors' },
  { path: '/deal-room', icon: Briefcase, label: 'Deal Room' },
  { path: '/matched-opportunities', icon: Sparkles, label: 'AI Matches' },
  { path: '/pipeline', icon: Layers, label: 'My Pipeline' },
  { path: '/founder-dashboard', icon: TrendingUp, label: 'Raise Capital' },
  { path: '/matched-edvestors', icon: Users, label: 'Matched Investors' },
  { path: '/investor-profile', icon: DollarSign, label: 'Investor Profile' },
  { path: '/admin-match-control', icon: ShieldCheck, label: 'Match Control' },
  { path: '/pricing', icon: CreditCard, label: 'Pricing' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-50",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="px-5 py-6 flex items-center">
        {collapsed ? (
          <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
            <span className="text-black font-heading font-bold text-sm tracking-tight">eX</span>
          </div>
        ) : (
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-8 w-auto object-contain"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium tracking-wide">{label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1 h-4 rounded-full bg-white" />}
            </Link>
          );
        })}
      </nav>

      {/* Collapse & Logout */}
      <div className="px-3 pb-6 space-y-1">
        <button
          onClick={() => base44.auth.logout()}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sidebar-foreground/50 hover:text-white hover:bg-sidebar-accent/50 transition-all w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-xl text-sidebar-foreground/40 hover:text-white transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}