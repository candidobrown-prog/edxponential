import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, User, ChevronLeft, ChevronRight,
  LogOut, Star, DollarSign, Briefcase, Layers, TrendingUp, CreditCard,
  Sparkles, ShieldCheck, Zap, Target, Building2, BarChart3, Bell,
  School, Play, MessageSquare, ShieldAlert, Search,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import EdxTooltip from '@/components/platform/EdxTooltip';
import { TOOLTIP } from '@/lib/tooltipData';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', tooltip: TOOLTIP.dashboard },
  { path: '/my-xschool', icon: School, label: 'My Xschool™', tooltip: TOOLTIP.myXschool },
  { path: '/matching', icon: Target, label: 'AI Matching', tooltip: TOOLTIP.aiMatching },
  { path: '/courses', icon: BookOpen, label: 'Courses', tooltip: TOOLTIP.courses },
  { path: '/coaching', icon: Star, label: 'Coaching', tooltip: TOOLTIP.coaching },
  { path: '/edvisors', icon: Star, label: 'edVisors', tooltip: TOOLTIP.edVisors },
  { path: '/communities', icon: Users, label: 'Communities', tooltip: TOOLTIP.communities },
  { path: '/edvestors', icon: DollarSign, label: 'edVestors', tooltip: TOOLTIP.edVestors },
  { path: '/deal-room', icon: Briefcase, label: 'Deal Room', tooltip: TOOLTIP.dealRoom },
  { path: '/matched-opportunities', icon: Sparkles, label: 'AI Matches', tooltip: TOOLTIP.aiMatches },
  { path: '/pipeline', icon: Layers, label: 'My Pipeline', tooltip: TOOLTIP.pipeline },
  { path: '/founder-dashboard', icon: TrendingUp, label: 'Raise Capital', tooltip: TOOLTIP.raiseCapital },
  { path: '/matched-edvestors', icon: Users, label: 'Matched Investors', tooltip: TOOLTIP.matchedEdVestors },
  { path: '/investor-profile', icon: DollarSign, label: 'Investor Profile', tooltip: TOOLTIP.investorProfile },
  { path: '/admin-match-control', icon: ShieldCheck, label: 'Match Control', tooltip: TOOLTIP.matchControl },
  { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback Admin', tooltip: TOOLTIP.feedbackAdmin },
  { path: '/admin/payments', icon: CreditCard, label: 'Payment Command', tooltip: TOOLTIP.billing },
  { path: '/xschores', icon: ShieldAlert, label: 'Xschores™', tooltip: TOOLTIP.xschores },
  { path: '/whalledoh', icon: Search, label: 'WhalleDoh™', tooltip: TOOLTIP.whalleDoh },
  { path: '/billing', icon: CreditCard, label: 'Billing', tooltip: TOOLTIP.billing },
  { path: '/identity-verification', icon: ShieldCheck, label: 'Verification', tooltip: TOOLTIP.verification },
  { path: '/notifications', icon: Bell, label: 'Notifications', tooltip: TOOLTIP.notifications },
  { path: '/pricing', icon: Zap, label: 'Pricing', tooltip: TOOLTIP.pricing },
  { path: '/profile', icon: User, label: 'Profile', tooltip: TOOLTIP.profile },
];

const platformTiers = [
  { to: '/tubedx', label: 'TubedX™', badge: 'TX', tooltip: TOOLTIP.tubedX },
  { to: '/twotrx', label: 'TwotrX', badge: '2X', tooltip: TOOLTIP.twotrX },
  { to: '/onejob', label: 'OneJob', badge: '1J', tooltip: TOOLTIP.oneJob },
  { to: '/edxportante', label: 'edXportante', badge: 'eP', tooltip: TOOLTIP.edXportante },
  { to: '/whalledoh', label: 'WhalleDoh™', badge: 'WD', tooltip: TOOLTIP.whalleDoh },
  { to: '/tilii', label: 'TiliiVisxion™', badge: 'TV', tooltip: TOOLTIP.tilii },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-50',
      collapsed ? 'w-20' : 'w-64'
    )}>
      {/* Logo */}
      <div className="px-4 py-5 flex items-center border-b border-sidebar-border/50">
        {collapsed ? (
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-white/10">
            <span className="text-black font-heading font-black text-sm tracking-tight">eX</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-full">
            <span className="text-white font-black text-xl tracking-tight leading-none">edXponential</span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">The Future of Education</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-2">
        {navItems.map(({ path, icon: Icon, label, tooltip }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <EdxTooltip key={path} data={tooltip} delay={500}>
              <Link
                to={path}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-white'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium tracking-wide">{label}</span>}
                {isActive && !collapsed && <div className="ml-auto w-1 h-4 rounded-full bg-white" />}
              </Link>
            </EdxTooltip>
          );
        })}
      </nav>

      {/* Platform Tiers */}
      <div className="mx-3 my-2">
        <div className="h-px bg-sidebar-border" />
      </div>
      <div className="px-3 mb-1 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/30 px-4 mb-1">Platform Tiers</p>
        )}
        {platformTiers.map(({ to, label, badge, tooltip }) => {
          const active = location.pathname.startsWith(to);
          return (
            <EdxTooltip key={to} data={tooltip} delay={500}>
              <Link to={to}
                className={cn('flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200',
                  active ? 'bg-sidebar-accent text-white' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white'
                )}>
                <div className="w-5 h-5 rounded flex items-center justify-center bg-white/20 flex-shrink-0">
                  <span className="text-[8px] font-black leading-none">{badge}</span>
                </div>
                {!collapsed && <span className="text-sm font-medium tracking-wide">{label}</span>}
              </Link>
            </EdxTooltip>
          );
        })}
      </div>

      {/* Sign Out + Collapse */}
      <div className="px-3 pb-6 space-y-1">
        <EdxTooltip data={TOOLTIP.signOut} delay={600}>
          <button
            onClick={() => base44.auth.logout()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sidebar-foreground/50 hover:text-white hover:bg-sidebar-accent/50 transition-all w-full"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </EdxTooltip>
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