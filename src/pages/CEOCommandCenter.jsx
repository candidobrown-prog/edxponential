import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Crown, Activity, Users, DollarSign, TrendingUp, Shield, Brain, BarChart3,
  Bell, Settings, Eye, Zap, Database, Globe, MessageSquare, AlertTriangle,
  CheckCircle, Clock, ArrowUpRight, ArrowDownRight, Server, Cpu, Wifi,
  Star, BookOpen, Target, ChevronRight, RefreshCw, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const REVENUE_DATA = [
  { month: 'Nov', revenue: 24000, members: 180 },
  { month: 'Dec', revenue: 31000, members: 220 },
  { month: 'Jan', revenue: 28000, members: 260 },
  { month: 'Feb', revenue: 42000, members: 310 },
  { month: 'Mar', revenue: 51000, members: 370 },
  { month: 'Apr', revenue: 63000, members: 440 },
  { month: 'May', revenue: 78000, members: 520 },
];

const PLATFORM_HEALTH = [
  { name: 'API', status: 'operational', latency: '42ms' },
  { name: 'Database', status: 'operational', latency: '8ms' },
  { name: 'AI Engine', status: 'operational', latency: '320ms' },
  { name: 'Auth', status: 'operational', latency: '15ms' },
  { name: 'Storage', status: 'operational', latency: '28ms' },
  { name: 'Email', status: 'degraded', latency: '1.2s' },
];

const TIER_DATA = [
  { name: 'Founders Sphere', value: 28, color: '#ffffff' },
  { name: 'Exec Entourage', value: 42, color: '#cbd5e1' },
  { name: 'Principal Park', value: 85, color: '#94a3b8' },
  { name: 'edVisors', value: 61, color: '#64748b' },
  { name: 'Free', value: 304, color: '#334155' },
];

const RECENT_ACTIVITY = [
  { type: 'join', text: 'New Founders Sphere member — Dr. Marcus Webb', time: '2m ago', icon: Crown },
  { type: 'payment', text: 'Executive Entourage subscription — $299/mo', time: '7m ago', icon: DollarSign },
  { type: 'ai', text: 'AI Charter generated — Horizon Academy', time: '12m ago', icon: Brain },
  { type: 'deal', text: 'New deal room submission — $2.4M raise', time: '18m ago', icon: TrendingUp },
  { type: 'alert', text: 'SPED compliance flag — Lincoln Elementary', time: '24m ago', icon: AlertTriangle },
  { type: 'join', text: 'New edVisor onboarded — Priya Nair', time: '31m ago', icon: Star },
  { type: 'payment', text: 'EduCartx™ sale — $189 course bundle', time: '45m ago', icon: DollarSign },
  { type: 'ai', text: 'AI match scored — 3 new investor pairings', time: '58m ago', icon: Zap },
];

const FEATURE_FLAGS = [
  { name: 'AI Charter Builder v2', enabled: true },
  { name: 'EduCartx Checkout', enabled: true },
  { name: 'CEO Role Switcher', enabled: true },
  { name: 'Real-time Notifications', enabled: true },
  { name: 'Google Calendar Sync', enabled: false },
  { name: 'WonJob™ Rebranding', enabled: false },
  { name: 'Bulk Actions Engine', enabled: false },
  { name: 'News Feed Integration', enabled: false },
];

function MetricCard({ icon: Icon, label, value, change, changeType, suffix = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-5 hover:border-white/10 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 rounded-xl bg-white/6 flex items-center justify-center">
          <Icon className="w-4 h-4 text-white/50" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${changeType === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {changeType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-white tracking-[-0.04em]">{value}{suffix}</div>
      <div className="text-xs text-white/30 mt-1 font-medium uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

export default function CEOCommandCenter() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('overview');
  const [flags, setFlags] = useState(FEATURE_FLAGS);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: communities = [] } = useQuery({ queryKey: ['communities-ceo'], queryFn: () => base44.entities.Community.list() });
  const { data: courses = [] } = useQuery({ queryKey: ['courses-ceo'], queryFn: () => base44.entities.Course.list() });
  const { data: deals = [] } = useQuery({ queryKey: ['deals-ceo'], queryFn: () => base44.entities.DealRoom.list() });
  const { data: spedStudents = [] } = useQuery({ queryKey: ['sped-ceo'], queryFn: () => base44.entities.SpedStudent.list() });

  const TABS = ['overview', 'analytics', 'platform', 'flags', 'activity'];

  const toggleFlag = (i) => {
    setFlags(f => f.map((flag, idx) => idx === i ? { ...flag, enabled: !flag.enabled } : flag));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
            <Crown className="w-4.5 h-4.5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white tracking-tight">CEO Command Center</h1>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-white/8 text-white/40 uppercase tracking-widest">CLASSIFIED</span>
            </div>
            <p className="text-[10px] text-white/25">edXponential · Founder Access Only</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400">All Systems Operational</span>
          </div>
          <Link to="/" className="text-xs text-white/25 hover:text-white/60 transition-colors">← Back to Platform</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 px-8 flex gap-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-semibold capitalize tracking-wide transition-all border-b-2 -mb-px ${tab === t ? 'text-white border-white/50' : 'text-white/25 border-transparent hover:text-white/50'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-8 max-w-[1400px] mx-auto space-y-8">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <>
            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard icon={Users} label="Total Members" value="520" change="+18%" changeType="up" />
              <MetricCard icon={DollarSign} label="MRR" value="$78K" change="+24%" changeType="up" suffix="" />
              <MetricCard icon={TrendingUp} label="ARR Run Rate" value="$936K" change="+31%" changeType="up" />
              <MetricCard icon={Activity} label="DAU" value="284" change="+12%" changeType="up" />
              <MetricCard icon={Brain} label="AI Calls Today" value="1,847" change="+8%" changeType="up" />
              <MetricCard icon={BookOpen} label="Active Courses" value={courses.length || 24} change="+3" changeType="up" />
              <MetricCard icon={Target} label="Deal Room Active" value={deals.length || 12} change="+2" changeType="up" />
              <MetricCard icon={Shield} label="SPED Students" value={spedStudents.length || 147} />
            </div>

            {/* Revenue Chart */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/6 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">Revenue & Growth</p>
                    <p className="text-2xl font-black text-white">$78,000 <span className="text-white/25 text-sm font-medium">this month</span></p>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +24% MoM
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 11 }}
                      formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Membership Pie */}
              <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6">
                <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-4">Members by Tier</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={TIER_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                      {TIER_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {TIER_DATA.map((t, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                        <span className="text-[10px] text-white/40">{t.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/60">{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <p className="text-xs font-black text-white uppercase tracking-widest">Live Activity Feed</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </div>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.015] transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <a.icon className="w-3.5 h-3.5 text-white/40" />
                    </div>
                    <p className="text-xs text-white/50 flex-1">{a.text}</p>
                    <span className="text-[10px] text-white/20 font-medium flex-shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6">
                <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-5">Member Growth</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={REVENUE_DATA} barSize={14}>
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11 }} />
                    <Bar dataKey="members" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6">
                <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-5">Revenue Trend</p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={REVENUE_DATA}>
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 11 }}
                      formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Platform module stats */}
            <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6">
              <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-5">Module Usage (This Month)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'AI Generations', value: '12,847', icon: Brain },
                  { label: 'Community Posts', value: '3,291', icon: MessageSquare },
                  { label: 'Course Enrollments', value: '892', icon: BookOpen },
                  { label: 'IEPs Managed', value: `${spedStudents.length || 147}`, icon: Shield },
                  { label: 'Deal Views', value: '4,102', icon: Eye },
                  { label: 'edVisor Sessions', value: '281', icon: Star },
                  { label: 'Grades Entered', value: '28,491', icon: BarChart3 },
                  { label: 'Reports Generated', value: '1,047', icon: Activity },
                ].map((m, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <m.icon className="w-4 h-4 text-white/25 mb-2" />
                    <p className="text-xl font-black text-white">{m.value}</p>
                    <p className="text-[10px] text-white/25 uppercase tracking-wide mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PLATFORM HEALTH */}
        {tab === 'platform' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORM_HEALTH.map((s, i) => (
                <div key={i} className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-white">{s.name}</p>
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${s.status === 'operational' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'operational' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {s.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-xs text-white/40">Latency: <span className="text-white/70 font-mono">{s.latency}</span></span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6">
              <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-4">Platform Modules</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Graiedx™', path: '/graiedx', status: true },
                  { label: 'Daida Baixed™', path: '/daida-baixed', status: true },
                  { label: 'PerSpEdxtives™', path: '/perspedxtives', status: true },
                  { label: 'Foundationx™', path: '/foundaitionx', status: true },
                  { label: 'EduCartx™', path: '/educartx', status: true },
                  { label: 'Classifiedx™', path: '/classifiedx', status: true },
                  { label: 'Xschores™', path: '/xschores', status: true },
                  { label: 'WonJob™', path: '/onejob', status: true },
                  { label: 'TubedX™', path: '/tubedx', status: true },
                ].map((m, i) => (
                  <Link key={i} to={m.path}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all group">
                    <span className="text-xs text-white/50 font-medium">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEATURE FLAGS */}
        {tab === 'flags' && (
          <div className="space-y-4">
            <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <p className="text-xs font-black text-white uppercase tracking-widest">Feature Flags</p>
                <p className="text-[10px] text-white/25 mt-0.5">Toggle platform features in real-time</p>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {flags.map((flag, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${flag.enabled ? 'bg-emerald-400' : 'bg-white/15'}`} />
                      <div>
                        <p className="text-sm text-white/70 font-medium">{flag.name}</p>
                        <p className="text-[10px] text-white/25 mt-0.5">{flag.enabled ? 'Active · Live for all users' : 'Inactive · Hidden from users'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFlag(i)}
                      className={`w-10 h-5 rounded-full transition-all duration-200 relative ${flag.enabled ? 'bg-white/70' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all duration-200 ${flag.enabled ? 'left-5.5 translate-x-0' : 'left-0.5'}`} style={{ left: flag.enabled ? '22px' : '2px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {tab === 'activity' && (
          <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <p className="text-xs font-black text-white uppercase tracking-widest">Platform Activity Log</p>
              <button className="text-white/25 hover:text-white/60 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {[...RECENT_ACTIVITY, ...RECENT_ACTIVITY].map((a, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.015] transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <a.icon className="w-3.5 h-3.5 text-white/40" />
                  </div>
                  <p className="text-xs text-white/50 flex-1">{a.text}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-white/20">{a.time}</span>
                    <CheckCircle className="w-3 h-3 text-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}