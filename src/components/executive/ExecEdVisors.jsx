import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Star, TrendingUp, TrendingDown, UserCheck, BookOpen, DollarSign, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ExecEdVisors() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('rating');

  const { data: edvisors = [], isLoading } = useQuery({ queryKey: ['exec_edvisors'], queryFn: () => base44.entities.CoachingSession.list('-created_date', 200) });
  const { data: transactions = [] } = useQuery({ queryKey: ['exec_txns'], queryFn: () => base44.entities.Transaction.list('-created_date', 500) });
  const { data: courses = [] } = useQuery({ queryKey: ['exec_courses_full'], queryFn: () => base44.entities.Course.list('-created_date', 300) });

  const enriched = edvisors.map(ev => {
    const evTxns = transactions.filter(t => t.status === 'completed' && t.product_type === 'coaching_session' && t.user_email === ev.coach_email);
    const evCourses = courses.filter(c => c.created_by === ev.coach_email || c.creator_name === ev.coach_name);
    const totalRevenue = evTxns.reduce((s, t) => s + (t.amount_usd || 0), 0);
    const platform_commission = totalRevenue * 0.20;
    const engagementLabel = ev.total_sessions > 20 ? 'High Growth' : ev.total_sessions > 10 ? 'Active' : ev.total_sessions > 3 ? 'Growing' : 'New';
    return { ...ev, totalRevenue, platform_commission, sessionCount: ev.total_sessions || 0, courseCount: evCourses.length, engagementLabel };
  }).sort((a, b) => {
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'revenue') return b.totalRevenue - a.totalRevenue;
    if (sort === 'sessions') return b.sessionCount - a.sessionCount;
    return 0;
  });

  const filtered = enriched.filter(ev => {
    const ms = !search || (ev.coach_name || '').toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || ev.status === statusFilter;
    return ms && mst;
  });

  const totalRevenue = enriched.reduce((s, ev) => s + ev.totalRevenue, 0);
  const topEdVisors = [...enriched].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 3);
  const inactiveCount = enriched.filter(ev => ev.status !== 'active' || ev.sessionCount === 0).length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total EdVisors', value: edvisors.length, icon: UserCheck },
          { label: 'Active', value: enriched.filter(e => e.status === 'active').length, icon: Activity },
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
          { label: 'Inactive', value: inactiveCount, icon: TrendingDown },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <s.icon className="w-4 h-4 text-white/30 mb-2" />
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-white/35 text-[11px] font-bold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Top Performers */}
      {topEdVisors.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="font-black text-sm text-white mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Top EdVisors</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topEdVisors.map((ev, i) => (
              <div key={ev.id} className="bg-white/[0.04] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                    {(ev.coach_name || '?')[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white/85 text-sm truncate">{ev.coach_name}</p>
                    <p className="text-white/35 text-[10px]">{ev.coach_title || 'EdVisor'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><p className="text-white font-black">${ev.totalRevenue.toFixed(0)}</p><p className="text-white/35">Revenue</p></div>
                  <div><p className="text-white font-black">{ev.sessionCount}</p><p className="text-white/35">Sessions</p></div>
                  <div><p className="text-white font-black">{ev.rating ? `${ev.rating.toFixed(1)}★` : '—'}</p><p className="text-white/35">Rating</p></div>
                  <div><p className="text-white font-black">{ev.courseCount}</p><p className="text-white/35">Courses</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input className="flex-1 min-w-[180px] max-w-xs h-8 text-xs bg-white/[0.05] border-white/10 text-white placeholder:text-white/25 rounded-xl"
          placeholder="Search EdVisors..." value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-8 text-xs bg-white/[0.05] border-white/10 text-white/70 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40 h-8 text-xs bg-white/[0.05] border-white/10 text-white/70 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">By Rating</SelectItem>
            <SelectItem value="revenue">By Revenue</SelectItem>
            <SelectItem value="sessions">By Sessions</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-white/25 text-xs ml-auto self-center">{filtered.length} edvisors</span>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-white/[0.06]">
              {['EdVisor', 'Status', 'Sessions', 'Courses', 'Revenue', 'Commission', 'Rating', 'Engagement'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black text-white/25 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={8} className="px-5 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-white/25">No EdVisors found</td></tr>
              ) : filtered.map(ev => (
                <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-white/80">{ev.coach_name || '—'}</p>
                    <p className="text-white/30 text-[10px]">{ev.coach_email || ''}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${ev.status === 'active' ? 'bg-green-400/15 text-green-400' : 'bg-white/5 text-white/30'}`}>{ev.status || 'active'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-white font-bold">{ev.sessionCount}</td>
                  <td className="px-5 py-3.5 text-white/60">{ev.courseCount}</td>
                  <td className="px-5 py-3.5 text-white font-black">${ev.totalRevenue.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-white/50">${ev.platform_commission.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-white/60">{ev.rating ? `${ev.rating.toFixed(1)}★` : '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${ev.engagementLabel === 'High Growth' ? 'bg-green-400/15 text-green-400' : ev.engagementLabel === 'Active' ? 'bg-blue-400/15 text-blue-400' : 'bg-white/5 text-white/35'}`}>{ev.engagementLabel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}