import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PUBLIC_PATHS = ['/', '/welcome', '/pricing', '/onboarding'];
import {
  LayoutDashboard, BookOpen, Users, User, ChevronLeft, ChevronRight,
  LogOut, Star, DollarSign, Briefcase, Layers, TrendingUp, CreditCard,
  Sparkles, ShieldCheck, Zap, Target, BarChart3, Bell,
  School, MessageSquare, ShieldAlert, Search, Crown, Brain, Database, GraduationCap,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import EdxTooltip from '@/components/platform/EdxTooltip';
import { TOOLTIP } from '@/lib/tooltipData';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', tooltip: TOOLTIP.dashboard },
  { path: '/graiedx', icon: GraduationCap, label: 'Graiedx™', tooltip: TOOLTIP.dashboard },
  { path: '/daida-baixed', icon: Database, label: 'Daida Baixed™', tooltip: TOOLTIP.dashboard },
  { path: '/goaled', icon: School, label: 'Goaled Xschool™', tooltip: TOOLTIP.myXschool },
  { path: '/perspedxtives', icon: Brain, label: 'PerSpEdxtives™', tooltip: TOOLTIP.dashboard },
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
  { path: '/xschy', icon: Sparkles, label: 'Xschy Xschraiper™', tooltip: TOOLTIP.aiMatching },
  { path: '/admin/executive', icon: Crown, label: 'Executive Dashboard', tooltip: TOOLTIP.matchControl },
  { path: '/xschores', icon: ShieldAlert, label: 'Xschores™', tooltip: TOOLTIP.xschores },
  { path: '/whalledoh', icon: Search, label: 'WhalleDoh™', tooltip: TOOLTIP.whalleDoh },
  { path: '/billing', icon: CreditCard, label: 'Billing', tooltip: TOOLTIP.billing },
  { path: '/identity-verification', icon: ShieldCheck, label: 'Verification', tooltip: TOOLTIP.verification },
  { path: '/notifications', icon: Bell, label: 'Notifications', tooltip: TOOLTIP.notifications },
  { path: '/pricing', icon: Zap, label: 'Pricing', tooltip: TOOLTIP.pricing },
  { path: '/profile', icon: User, label: 'Profile', tooltip: TOOLTIP.profile },
];

const platformTiers = [
  { to: '/operationx', label: 'OperationX™', badge: 'OX', tooltip: TOOLTIP.tubedX },
  { to: '/educartx', label: 'EduCartx™', badge: 'EC', tooltip: TOOLTIP.tubedX },
  { to: '/tubedx', label: 'TubedX™', badge: 'TX', tooltip: TOOLTIP.tubedX },
  { to: '/twotrx', label: 'TwotrX', badge: '2X', tooltip: TOOLTIP.twotrX },
  { to: '/onejob', label: 'WonJob™', badge: 'WJ', tooltip: TOOLTIP.oneJob },
  { to: '/edxportante', label: 'edXportante', badge: 'eP', tooltip: TOOLTIP.edXportante },
  { to: '/whalledoh', label: 'WhalleDoh™', badge: 'WD', tooltip: TOOLTIP.whalleDoh },
  { to: '/tilii', label: 'TiliiVisxion™', badge: 'TV', tooltip: TOOLTIP.tilii },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Don't render sidebar on public pages
  if (PUBLIC_PATHS.includes(location.pathname)) {
    return null;
  }

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50 overflow-hidden',
      'bg-[#090909] border-r border-white/[0.05]',
      collapsed ? 'w-[60px]' : 'w-[220px]'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center border-b border-white/[0.05] flex-shrink-0', collapsed ? 'h-14 justify-center' : 'h-14 px-4')}>
        {collapsed ? (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-white/10 flex-shrink-0">
            <span className="text-black font-black text-[11px] tracking-tighter">eX</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <img
              src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
              alt="edXponential"
              className="h-7 w-auto brightness-0 invert"
            />
            <span className="text-white/20 text-[8px] font-bold uppercase tracking-[0.18em]">Education. Exponentially.</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ path, icon: Icon, label, tooltip }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <EdxTooltip key={path} data={tooltip} delay={500}>
              <Link
                to={path}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg transition-all duration-150',
                  collapsed ? 'h-9 w-9 justify-center mx-auto' : 'h-8 px-3',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/35 hover:bg-white/5 hover:text-white/70'
                )}
              >
                <Icon className={cn('flex-shrink-0', collapsed ? 'w-4 h-4' : 'w-3.5 h-3.5')} />
                {!collapsed && (
                  <span className="text-xs font-medium tracking-[-0.01em] truncate">{label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1 h-3 rounded-full bg-white/50 flex-shrink-0" />
                )}
              </Link>
            </EdxTooltip>
          );
        })}
      </nav>

      {/* Platform Tiers */}
      <div className="px-2 pb-1">
        <div className="h-px bg-white/[0.05] mb-2" />
        {!collapsed && (
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/20 px-3 mb-1.5">Platform Tiers</p>
        )}
        <div className="space-y-0.5">
          {platformTiers.map(({ to, label, badge, tooltip }) => {
            const active = location.pathname.startsWith(to);
            return (
              <EdxTooltip key={to} data={tooltip} delay={500}>
                <Link to={to}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg transition-all duration-150',
                    collapsed ? 'h-9 w-9 justify-center mx-auto' : 'h-8 px-3',
                    active ? 'bg-white/10 text-white' : 'text-white/35 hover:bg-white/5 hover:text-white/70'
                  )}>
                  <div className={cn('flex items-center justify-center rounded-md flex-shrink-0', collapsed ? 'w-4 h-4' : 'w-4 h-4', 'bg-white/12')}>
                    <span className="text-[7px] font-black text-white/70 leading-none">{badge}</span>
                  </div>
                  {!collapsed && <span className="text-xs font-medium tracking-[-0.01em] truncate">{label}</span>}
                </Link>
              </EdxTooltip>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-2 pb-4 pt-2 space-y-0.5">
        <div className="h-px bg-white/[0.05] mb-2" />
        <EdxTooltip data={TOOLTIP.signOut} delay={600}>
          <button
            onClick={() => base44.auth.logout()}
            className={cn(
              'flex items-center gap-2.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/5 transition-all w-full',
              collapsed ? 'h-9 w-9 justify-center mx-auto' : 'h-8 px-3'
            )}
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            {!collapsed && <span className="text-xs font-medium">Sign Out</span>}
          </button>
        </EdxTooltip>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-7 rounded-lg text-white/15 hover:text-white/40 transition-all"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
}