import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command, BarChart3, Users, Building2, Shield, Globe, CreditCard,
  Package, Brain, LayoutDashboard, ChevronLeft, ChevronRight,
  Bell, Search, Settings, Activity
} from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/operationx', exact: true },
  { icon: BarChart3, label: 'FinanceX™', path: '/operationx/finance' },
  { icon: Users, label: 'PeopleX™', path: '/operationx/hr' },
  { icon: Building2, label: 'FacilitiesX™', path: '/operationx/facilities' },
  { icon: Shield, label: 'SafetyX™', path: '/operationx/safety' },
  { icon: Globe, label: 'ProcureX™', path: '/operationx/vendors' },
  { icon: CreditCard, label: 'PayX™', path: '/operationx/payments' },
  { icon: Package, label: 'InvenX™', path: '/operationx/inventory' },
  { icon: Brain, label: 'OpsAI™', path: '/operationx/opsai' },
];

export default function OpxLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#06060c] flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-screen bg-[#08080f] border-r border-white/[0.05] flex flex-col z-40 overflow-hidden"
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-white/[0.04] flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <Command className="w-3.5 h-3.5 text-black" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="ml-2.5 font-black text-white text-sm tracking-tight whitespace-nowrap">
                OperationX™
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ icon: Icon, label, path, exact }) => {
            const active = isActive(path, exact);
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150 group ${active ? 'bg-white/8 text-white' : 'text-white/30 hover:text-white/70 hover:bg-white/4'}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-xs font-bold whitespace-nowrap">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-white/[0.04] flex-shrink-0">
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center h-8 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/4 transition-all">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? 'ml-16' : 'ml-[220px]'}`}>
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.04] bg-[#06060c]/95 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 h-8 px-3 rounded-lg bg-white/4 border border-white/6 text-white/25 text-xs">
              <Search className="w-3 h-3" />
              <span>Search OperationX…</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/15 rounded-full px-2.5 py-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">All Systems Operational</span>
            </div>
            <button className="w-8 h-8 rounded-lg bg-white/4 border border-white/6 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors relative">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-white/4 border border-white/6 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white/60">ED</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}