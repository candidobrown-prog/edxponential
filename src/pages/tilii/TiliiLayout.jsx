import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Play, Search, Radio, Video, BarChart3, Zap, Home } from 'lucide-react';

const NAV = [
  { path: '/tilii', icon: Home, label: 'Home', exact: true },
  { path: '/tilii/discover', icon: Search, label: 'Discover' },
  { path: '/tilii/watch', icon: Play, label: 'Watch' },
  { path: '/tilii/studio', icon: Video, label: 'Studio' },
];

export default function TiliiLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[#080808]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.05] h-14">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/tilii" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-black fill-black ml-0.5" />
            </div>
            <span className="font-black text-white text-base tracking-tight hidden sm:block">TiliiVisxion</span>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV.map(({ path, icon: Icon, label, exact }) => {
              const active = exact ? pathname === path : pathname.startsWith(path) && path !== '/tilii';
              return (
                <Link key={path} to={path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${active ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/[0.06]'}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/tilii/studio" className="text-white/40 text-xs font-black hover:text-white transition-colors hidden sm:block">Studio</Link>
            <Link to="/tilii/discover" className="bg-white text-black font-black text-xs px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-all">
              Upgrade
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}