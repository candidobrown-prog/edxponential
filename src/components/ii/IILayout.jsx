import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, ClipboardList, PlusCircle, Upload, FileText, BarChart3, Users, MessageSquare, ListChecks, Settings, Home, ChevronLeft, ChevronRight, ShieldCheck, BookOpen, Activity } from 'lucide-react';
import { ii } from '@/api/ii';
import { cn } from '@/lib/utils';
import { C, State, Btn } from './ui';

export function useIIMe() {
  return useQuery({ queryKey: ['ii-me'], queryFn: ii.me, retry: false, staleTime: 60_000 });
}

export default function IILayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { data: me, isLoading, error } = useIIMe();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: C.paper }}><State kind="loading" title="Loading Instructional Intelligence…" /></div>;
  if (error?.status === 404) return <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.paper }}><State kind="empty" title="Instructional Intelligence is not enabled" detail="This deployment has the module turned off (FEATURE_INSTRUCTIONAL_INTELLIGENCE). Ask your BetterEd administrator." action={<Btn as={Link} to="/" variant="secondary" size="sm">Back to platform</Btn>} /></div>;
  if (error?.status === 401) return <Navigate to="/" replace />;
  if (error) return <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.paper }}><State kind="error" title="Could not load your access" detail={error.message} /></div>;

  const cap = me?.capabilities || {};
  const noAccess = !me?.platform_admin && (me?.memberships || []).length === 0;
  const nav = [
    { to: '/ii', icon: LayoutDashboard, label: 'Overview', exact: true, show: true },
    { to: '/ii/observations', icon: ClipboardList, label: 'Observations', show: !noAccess },
    { to: '/ii/observations/new', icon: PlusCircle, label: 'New Observation', show: cap.create_observation },
    { to: '/ii/upload', icon: Upload, label: 'Audio & Video Uploads', show: cap.create_observation },
    { to: '/ii/reflections', icon: BookOpen, label: 'Teacher Reflection', show: !noAccess },
    { to: '/ii/coaching', icon: MessageSquare, label: 'Coaching Conferences', show: !noAccess },
    { to: '/ii/action-plans', icon: ListChecks, label: 'Action Plans & Reassessment', show: !noAccess },
    { to: '/ii/plc', icon: Users, label: 'PLC Collaboration', show: cap.plc },
    { to: '/ii/trends', icon: BarChart3, label: 'Trends', show: cap.school_aggregates || cap.district_aggregates },
    { to: '/ii/reports', icon: FileText, label: 'Reports & Exports', show: !noAccess },
    { to: '/ii/admin', icon: Settings, label: 'Administration', show: cap.admin },
    { to: '/ii/admin/privacy', icon: ShieldCheck, label: 'Privacy, Consent & Retention', show: cap.admin },
    { to: '/ii/admin/system', icon: Activity, label: 'Audit & System Health', show: cap.admin },
  ].filter((n) => n.show);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: C.paper }}>
      <a href="#ii-main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2">Skip to content</a>
      <aside aria-label="Instructional Intelligence navigation" className={cn('flex-shrink-0 text-white flex flex-col transition-all duration-200 z-10', collapsed ? 'w-16' : 'w-64')} style={{ background: C.navy }}>
        <div className={cn('p-4 border-b border-white/10 flex items-center gap-3', collapsed && 'justify-center p-3')}>
          <div className="w-8 h-8 rounded-md flex items-center justify-center font-black text-sm flex-shrink-0" style={{ background: C.yellow, color: C.navy }} aria-hidden>II</div>
          {!collapsed && <div><p className="font-bold text-sm leading-tight">Instructional Intelligence</p><p className="text-[10px] text-white/50 uppercase tracking-widest">EDXPONTENTIAL</p></div>}
        </div>
        <Link to="/" className={cn('flex items-center gap-2.5 mx-2 mt-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 text-xs font-semibold', collapsed && 'justify-center px-0')}><Home className="w-3.5 h-3.5" aria-hidden />{!collapsed && 'Back to Platform'}</Link>
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to) && !(to === '/ii/observations' && location.pathname.startsWith('/ii/observations/new')) && !(to === '/ii/admin' && location.pathname.startsWith('/ii/admin/'));
            return (<Link key={to} to={to} aria-current={active ? 'page' : undefined} className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors', collapsed && 'justify-center px-0', active ? 'text-[#0B1F3A]' : 'text-white/70 hover:bg-white/10 hover:text-white')} style={active ? { background: C.yellow } : {}}><Icon className="w-4 h-4 flex-shrink-0" aria-hidden />{!collapsed && <span className="truncate">{label}</span>}</Link>);
          })}
        </nav>
        {!collapsed && me && (
          <div className="px-4 py-3 border-t border-white/10 text-[11px] text-white/60">
            <p className="truncate text-white/90 font-semibold">{me.user.full_name || me.user.email}</p>
            <p className="truncate">{[...new Set((me.memberships || []).map((m) => m.role.replace('_', ' ')))].join(', ') || (me.platform_admin ? 'platform administrator' : 'no role assigned')}</p>
            {me.schools?.length > 0 && <p className="truncate mt-0.5">{me.schools.map((s) => s.name).join(' · ')}</p>}
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'} className="h-9 text-white/40 hover:text-white flex items-center justify-center border-t border-white/10">{collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}</button>
      </aside>
      <main id="ii-main" className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          {noAccess && location.pathname !== '/ii' ? <State kind="denied" title="No school role assigned" detail="Ask your school or district administrator to add you to a school in Instructional Intelligence." /> : <Outlet context={{ me }} />}
        </div>
      </main>
    </div>
  );
}
