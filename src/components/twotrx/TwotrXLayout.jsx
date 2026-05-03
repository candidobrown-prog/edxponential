import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, BookOpen, CalendarDays, DollarSign,
  BarChart3, ChevronLeft, ChevronRight, LogOut, UserCheck,
  ClipboardList, Search, Wallet, FileText, ShieldCheck, GraduationCap
} from 'lucide-react';

const schoolNav = [
  { path: '/twotrx/school', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/twotrx/refer-student', icon: ClipboardList, label: 'Refer Student' },
  { path: '/twotrx/students', icon: Users, label: 'Students' },
  { path: '/twotrx/tutors', icon: GraduationCap, label: 'Find Tutors' },
  { path: '/twotrx/sessions', icon: CalendarDays, label: 'Sessions' },
  { path: '/twotrx/billing', icon: DollarSign, label: 'Billing' },
  { path: '/twotrx/reports', icon: BarChart3, label: 'Reports' },
];

const parentNav = [
  { path: '/twotrx/parent', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/twotrx/tutors', icon: Search, label: 'Find Tutor' },
  { path: '/twotrx/my-student', icon: Users, label: 'My Student' },
  { path: '/twotrx/sessions', icon: CalendarDays, label: 'Sessions' },
  { path: '/twotrx/payments', icon: Wallet, label: 'Payments' },
  { path: '/twotrx/progress', icon: BarChart3, label: 'Progress' },
];

const tutorNav = [
  { path: '/twotrx/tutor', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/twotrx/requests', icon: BookOpen, label: 'Requests' },
  { path: '/twotrx/calendar', icon: CalendarDays, label: 'Calendar' },
  { path: '/twotrx/my-students', icon: Users, label: 'My Students' },
  { path: '/twotrx/session-notes', icon: FileText, label: 'Session Notes' },
  { path: '/twotrx/earnings', icon: DollarSign, label: 'Earnings' },
];

const adminNav = [
  { path: '/twotrx/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/twotrx/admin/tutors', icon: UserCheck, label: 'Tutor Applications' },
  { path: '/twotrx/admin/referrals', icon: ClipboardList, label: 'Student Referrals' },
  { path: '/twotrx/admin/sessions', icon: CalendarDays, label: 'Sessions' },
  { path: '/twotrx/admin/payments', icon: Wallet, label: 'Payments' },
  { path: '/twotrx/admin/reports', icon: BarChart3, label: 'Reports' },
];

export default function TwotrXLayout({ userRole = 'school' }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navMap = { school: schoolNav, parent: parentNav, tutor: tutorNav, admin: adminNav };
  const nav = navMap[userRole] || schoolNav;

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50",
        "bg-[#0a0f1e] text-white",
        collapsed ? "w-20" : "w-64"
      )}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          {collapsed ? (
            <div className="w-10 h-10 rounded-xl bg-[#4f46e5] flex items-center justify-center">
              <span className="text-white font-bold text-sm">2X</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">2X</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">TwotrX</p>
                  <p className="text-white/40 text-[10px] leading-none mt-0.5">by edXponential</p>
                </div>
              </div>
              <div className="mt-3 px-2 py-1 bg-[#4f46e5]/20 rounded-lg">
                <p className="text-[#818cf8] text-xs font-medium capitalize">{userRole} Portal</p>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Link key={path} to={path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium",
                  isActive
                    ? "bg-[#4f46e5] text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 space-y-1 border-t border-white/10 pt-3">
          <Link to="/" className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm w-full"
          )}>
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Back to edXponential</span>}
          </Link>
          <button onClick={() => base44.auth.logout()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all w-full text-sm">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-xl text-white/30 hover:text-white transition-all">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={cn("flex-1 min-h-screen transition-all duration-300", collapsed ? "ml-20" : "ml-64")}>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}