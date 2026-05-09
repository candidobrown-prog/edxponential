import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Store, Package, BarChart3, Home, ChevronLeft, ChevronRight,
  Sparkles, ShoppingCart, Users, Zap, MessageSquare, Globe
} from 'lucide-react';

const NAV = [
  { icon: Globe, label: 'Marketplace', path: '/educartx/marketplace' },
  { icon: Store, label: 'My Storefront', path: '/educartx/storefront' },
  { icon: Package, label: 'Products', path: '/educartx/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/educartx/orders' },
  { icon: BarChart3, label: 'Dashboard', path: '/educartx/dashboard' },
  { icon: Sparkles, label: 'AI Coach', path: '/educartx/ai-coach' },
];

export default function EduCartxLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex-shrink-0 flex flex-col border-r border-white/5 transition-all duration-300 ${collapsed ? 'w-14' : 'w-52'}`}>
        <div className="flex items-center gap-2 px-3 py-4 border-b border-white/5">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-4 h-4 text-black" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-black text-white text-xs tracking-tight">EduCartx™</div>
              <div className="text-[9px] text-white/25 font-bold">Education Commerce OS</div>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} className="ml-auto p-1 rounded hover:bg-white/8 transition-all">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-white/30" /> : <ChevronLeft className="w-3.5 h-3.5 text-white/30" />}
          </button>
        </div>

        <Link to="/educartx" className={`flex items-center gap-2 px-3 py-2 mx-2 mt-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <Home className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && <span className="text-xs font-bold">Home</span>}
        </Link>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${collapsed ? 'justify-center' : ''} ${active ? 'bg-white text-black' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {!collapsed && <span className="text-xs font-black">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="p-3 border-t border-white/5">
            <div className="border border-white/8 rounded-xl p-3 bg-white/2">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3 text-white/30" />
                <span className="text-[10px] font-black text-white/40">AI Credits</span>
              </div>
              <div className="h-1 bg-white/8 rounded-full">
                <div className="h-full bg-white/40 rounded-full w-4/5" />
              </div>
              <div className="text-[9px] text-white/20 mt-1">80% remaining</div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        <Outlet />
      </main>
    </div>
  );
}