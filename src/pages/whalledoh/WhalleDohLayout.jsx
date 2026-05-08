import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Zap, Users, Compass, User, Home, ChevronLeft } from 'lucide-react';

const NAV = [
  { path: '/whalledoh', icon: Home, label: 'Home' },
  { path: '/whalledoh/discover', icon: Compass, label: 'Discover' },
  { path: '/whalledoh/ai', icon: Zap, label: 'WhallAI' },
  { path: '/whalledoh/communities', icon: Users, label: 'Communities' },
  { path: '/whalledoh/profiles', icon: User, label: 'My Profile' },
];

export default function WhalleDohLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#07080f] text-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07080f]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/whalledoh" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#07080f] font-black text-xs">W</span>
            </div>
            <span className="font-black text-white text-base tracking-tight hidden sm:block">WhalleDoh</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV.map(({ path, icon: Icon, label }) => {
              const isActive = path === '/whalledoh' ? location.pathname === '/whalledoh' : location.pathname.startsWith(path);
              return (
                <Link key={path} to={path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white hover:bg-white/[0.05]'}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </Link>
              );
            })}
          </div>

          {/* Back to edXponential */}
          <Link to="/" className="ml-auto flex items-center gap-1.5 text-white/25 text-xs font-bold hover:text-white/50 transition-colors flex-shrink-0">
            <ChevronLeft className="w-3.5 h-3.5" />
            edXponential
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-14">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-[#07080f]/95 backdrop-blur-xl border-t border-white/[0.06] z-50">
        <div className="grid grid-cols-5">
          {NAV.map(({ path, icon: Icon, label }) => {
            const isActive = path === '/whalledoh' ? location.pathname === '/whalledoh' : location.pathname.startsWith(path);
            return (
              <Link key={path} to={path}
                className={`flex flex-col items-center gap-1 py-3 text-[10px] font-bold transition-colors ${isActive ? 'text-white' : 'text-white/30'}`}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}