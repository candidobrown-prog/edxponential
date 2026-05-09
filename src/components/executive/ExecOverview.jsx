import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, BookOpen, DollarSign, TrendingUp, Activity, Star, Briefcase, GraduationCap, Building2, CreditCard, UserCheck, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import ExecKPICard from './ExecKPICard';

const TIER_COLORS = ['#fff', '#ccc', '#999', '#666', '#444'];

export default function ExecOverview() {
  const { data: users = [], isLoading: uLoad } = useQuery({ queryKey: ['exec_users'], queryFn: () => base44.entities.User.list('-created_date', 500) });
  const { data: courses = [], isLoading: cLoad } = useQuery({ queryKey: ['exec_courses'], queryFn: () => base44.entities.Course.list('-created_date', 200) });
  const { data: transactions = [], isLoading: tLoad } = useQuery({ queryKey: ['exec_txns'], queryFn: () => base44.entities.Transaction.list('-created_date', 500) });
  const { data: communities = [] } = useQuery({ queryKey: ['exec_communities'], queryFn: () => base44.entities.Community.list() });
  const { data: dealRooms = [] } = useQuery({ queryKey: ['exec_deals'], queryFn: () => base44.entities.DealRoom.list() });
  const { data: tutors = [] } = useQuery({ queryKey: ['exec_tutors'], queryFn: () => base44.entities.TutorProfile.list() });
  const { data: jobPosts = [] } = useQuery({ queryKey: ['exec_jobs'], queryFn: () => base44.entities.JobPost.list() });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today - 7 * 86400000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);

  const newToday = users.filter(u => new Date(u.created_date) >= today).length;
  const newWeek = users.filter(u => new Date(u.created_date) >= weekAgo).length;
  const newMonth = users.filter(u => new Date(u.created_date) >= monthAgo).length;

  const completed = transactions.filter(t => t.status === 'completed');
  const grossRevenue = completed.reduce((s, t) => s + (t.amount_usd || 0), 0);
  const dailySales = completed.filter(t => new Date(t.created_date) >= today).reduce((s, t) => s + (t.amount_usd || 0), 0);
  const weeklySales = completed.filter(t => new Date(t.created_date) >= weekAgo).reduce((s, t) => s + (t.amount_usd || 0), 0);
  const monthlySales = completed.filter(t => new Date(t.created_date) >= monthAgo).reduce((s, t) => s + (t.amount_usd || 0), 0);
  const ytdSales = completed.filter(t => new Date(t.created_date) >= yearStart).reduce((s, t) => s + (t.amount_usd || 0), 0);
  const avgRevPerUser = users.length > 0 ? grossRevenue / users.length : 0;

  // Monthly chart data (6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const key = d.toLocaleString('default', { month: 'short' });
    const rev = completed.filter(t => { const td = new Date(t.created_date); return td >= d && td < end; }).reduce((s, t) => s + (t.amount_usd || 0), 0);
    const newU = users.filter(u => { const ud = new Date(u.created_date); return ud >= d && ud < end; }).length;
    monthlyData.push({ month: key, revenue: parseFloat(rev.toFixed(2)), users: newU });
  }

  // Role breakdown
  const roleMap = {};
  users.forEach(u => { roleMap[u.role || 'user'] = (roleMap[u.role || 'user'] || 0) + 1; });
  const roleData = Object.entries(roleMap).map(([name, value], i) => ({ name, value, color: TIER_COLORS[i % TIER_COLORS.length] }));

  // Brand revenue
  const brandMap = {};
  completed.forEach(t => { brandMap[t.brand || 'core'] = (brandMap[t.brand || 'core'] || 0) + (t.amount_usd || 0); });
  const brandData = Object.entries(brandMap).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value: parseFloat(value.toFixed(2)) })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8">
      {/* Top KPIs — dark */}
      <div>
        <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-4">Platform Pulse</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Users', value: users.length, icon: Users, loading: uLoad },
            { label: 'New Today', value: newToday, icon: Activity },
            { label: 'New This Week', value: newWeek, icon: TrendingUp },
            { label: 'New This Month', value: newMonth, icon: Users },
            { label: 'Total Courses', value: courses.length, icon: BookOpen, loading: cLoad },
            { label: 'Communities', value: communities.length, icon: Users },
            { label: 'Active Tutors', value: tutors.filter(t => t.status === 'approved').length, icon: GraduationCap },
            { label: 'Deal Rooms', value: dealRooms.filter(d => d.status === 'active').length, icon: Briefcase },
            { label: 'Job Posts', value: jobPosts.filter(j => j.status === 'active').length, icon: Building2 },
            { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: UserCheck },
            { label: 'Failed Payments', value: transactions.filter(t => t.status === 'failed').length, icon: AlertTriangle },
            { label: 'Avg Rev/User', value: `$${avgRevPerUser.toFixed(2)}`, icon: CreditCard },
          ].map((card, i) => (
            <ExecKPICard key={i} {...card} dark size="sm" />
          ))}
        </div>
      </div>

      {/* Revenue KPIs */}
      <div>
        <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-4">Revenue Intelligence</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Gross Revenue', value: `$${grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, size: 'md' },
            { label: 'Daily Sales', value: `$${dailySales.toFixed(2)}`, icon: TrendingUp },
            { label: 'Weekly Sales', value: `$${weeklySales.toFixed(2)}`, icon: TrendingUp },
            { label: 'Monthly Sales', value: `$${monthlySales.toFixed(2)}`, icon: DollarSign },
            { label: 'YTD Sales', value: `$${ytdSales.toFixed(2)}`, icon: ArrowUpRight },
          ].map((card, i) => (
            <ExecKPICard key={i} {...card} dark loading={tLoad} />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue + Users trend */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <p className="font-black text-sm text-white">Revenue & User Growth</p>
            <span className="text-white/25 text-[10px] font-bold">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={v => [`$${v}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#fff" strokeWidth={2} fill="url(#rg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Role breakdown */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="font-black text-sm text-white mb-5">Users by Role</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                {roleData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {roleData.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                  <span className="text-white/50 capitalize">{r.name}</span>
                </div>
                <span className="text-white font-bold">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Brand */}
      {brandData.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="font-black text-sm text-white mb-5">Revenue by Brand</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={brandData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 700 }} width={100} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }} formatter={v => [`$${v}`, 'Revenue']} />
              <Bar dataKey="value" fill="rgba(255,255,255,0.8)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Users Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <p className="font-black text-sm text-white">Recently Joined Users</p>
          <span className="text-white/25 text-[10px] font-bold">Latest 10</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-white/[0.05]">
              {['Name', 'Email', 'Role', 'Joined', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-black text-white/25 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.slice(0, 10).map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 font-bold text-white/80">{u.full_name || '—'}</td>
                  <td className="px-5 py-3 text-white/45">{u.email}</td>
                  <td className="px-5 py-3"><span className="bg-white/10 text-white/60 px-2 py-0.5 rounded-full text-[10px] font-black capitalize">{u.role || 'user'}</span></td>
                  <td className="px-5 py-3 text-white/35">{new Date(u.created_date).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><span className="w-2 h-2 inline-block rounded-full bg-green-400 mr-1.5" />Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}