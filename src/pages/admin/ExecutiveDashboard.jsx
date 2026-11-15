import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Shield, Crown, BarChart3, Users, BookOpen, ShoppingBag, DollarSign, Bell, UserCheck, Activity, Download, RefreshCw, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExecOverview from '@/components/executive/ExecOverview';
import ExecUsers from '@/components/executive/ExecUsers';
import ExecCourses from '@/components/executive/ExecCourses';
import ExecSales from '@/components/executive/ExecSales';
import ExecEdVisors from '@/components/executive/ExecEdVisors';
import ExecAlerts from '@/components/executive/ExecAlerts';
import ExecAISummary from '@/components/executive/ExecAISummary';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'sales', label: 'Sales & Revenue', icon: DollarSign },
  { id: 'edvisors', label: 'EdVisors', icon: UserCheck },
  { id: 'alerts', label: 'Alerts', icon: Bell },
];

export default function ExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);

  if (!authChecked) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7 text-white/40" />
          </div>
          <p className="text-white font-black text-xl mb-2">Access Restricted</p>
          <p className="text-white/30 text-sm mb-6">Executive clearance required.</p>
          <Link to="/" className="text-white/50 text-xs hover:text-white transition-colors">← Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const activeIcon = TABS.find(t => t.id === activeTab)?.icon;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/[0.07] bg-black px-6 lg:px-10 py-5 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Crown className="w-4.5 h-4.5 text-black w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg tracking-tight text-white">Executive Master Dashboard</h1>
                <span className="bg-white/10 border border-white/15 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white/60">CLASSIFIED</span>
              </div>
              <p className="text-white/30 text-xs">edXponential Intelligence Center · {user.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[11px] font-bold">Live</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLastRefresh(new Date())}
              className="border-white/20 text-white/70 hover:bg-white/10 rounded-xl gap-1.5 text-xs h-8">
              <RefreshCw className="w-3 h-3" /> Refresh
            </Button>
            <Button variant="outline" size="sm"
              className="border-white/20 text-white/70 hover:bg-white/10 rounded-xl gap-1.5 text-xs h-8">
              <Download className="w-3 h-3" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="border-b border-white/[0.06] bg-black/60 backdrop-blur-sm px-6 lg:px-10 sticky top-[69px] z-30">
        <div className="max-w-[1600px] mx-auto flex gap-0.5 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === id
                  ? 'border-white text-white'
                  : 'border-transparent text-white/35 hover:text-white/70'
              }`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Summary Strip (always visible on overview) */}
      {activeTab === 'overview' && (
        <div className="border-b border-white/[0.06] px-6 lg:px-10 py-4 bg-white/[0.02]">
          <div className="max-w-[1600px] mx-auto">
            <ExecAISummary />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
        {activeTab === 'overview' && <ExecOverview key={lastRefresh} />}
        {activeTab === 'users' && <ExecUsers key={lastRefresh} />}
        {activeTab === 'courses' && <ExecCourses key={lastRefresh} />}
        {activeTab === 'sales' && <ExecSales key={lastRefresh} />}
        {activeTab === 'edvisors' && <ExecEdVisors key={lastRefresh} />}
        {activeTab === 'alerts' && <ExecAlerts key={lastRefresh} />}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.05] px-6 lg:px-10 py-4 mt-12">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-white/20 text-[11px]">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            <span>Executive access · Role-protected · Audit-logged</span>
          </div>
          <span>Last refreshed: {lastRefresh.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}