import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BookOpen, Star, Users, TrendingUp, TrendingDown, Archive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExecCourses() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: courses = [], isLoading } = useQuery({ queryKey: ['exec_courses_full'], queryFn: () => base44.entities.Course.list('-created_date', 300) });
  const { data: progress = [] } = useQuery({ queryKey: ['exec_progress'], queryFn: () => base44.entities.StudentProgress.list('-created_date', 500) });
  const { data: transactions = [] } = useQuery({ queryKey: ['exec_txns'], queryFn: () => base44.entities.Transaction.list('-created_date', 500) });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today - 7 * 86400000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);

  const published = courses.filter(c => c.status === 'published');
  const drafts = courses.filter(c => c.status === 'draft');
  const archived = courses.filter(c => c.status === 'archived');
  const createdToday = courses.filter(c => new Date(c.created_date) >= today);
  const createdWeek = courses.filter(c => new Date(c.created_date) >= weekAgo);
  const createdMonth = courses.filter(c => new Date(c.created_date) >= monthAgo);

  // Enrollment counts per course
  const enrollmentMap = {};
  progress.forEach(p => {
    enrollmentMap[p.course_id] = (enrollmentMap[p.course_id] || 0) + 1;
  });

  // Revenue per course
  const courseRevenueMap = {};
  transactions.filter(t => t.status === 'completed' && t.product_type === 'course_purchase').forEach(t => {
    if (t.product_id) courseRevenueMap[t.product_id] = (courseRevenueMap[t.product_id] || 0) + (t.amount_usd || 0);
  });

  const enriched = courses.map(c => ({
    ...c,
    enrollments: enrollmentMap[c.id] || 0,
    revenue: courseRevenueMap[c.id] || 0,
  })).sort((a, b) => b.enrollments - a.enrollments);

  const topCourses = [...enriched].sort((a, b) => b.enrollments - a.enrollments).slice(0, 5);
  const chartData = topCourses.map(c => ({ name: (c.title || '').slice(0, 20), enrollments: c.enrollments, revenue: c.revenue }));

  const filtered = enriched.filter(c => {
    const ms = !search || (c.title || '').toLowerCase().includes(search.toLowerCase()) || (c.creator_name || '').toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || c.status === statusFilter;
    return ms && mst;
  });

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Courses', value: courses.length, icon: BookOpen },
          { label: 'Published', value: published.length, icon: TrendingUp },
          { label: 'Drafts', value: drafts.length, icon: Star },
          { label: 'Archived', value: archived.length, icon: Archive },
          { label: 'Created Today', value: createdToday.length, icon: TrendingUp },
          { label: 'Created This Month', value: createdMonth.length, icon: Users },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <s.icon className="w-4 h-4 text-white/30 mb-2" />
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-white/35 text-[11px] font-bold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Top courses chart */}
      {chartData.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="font-black text-sm text-white mb-4">Top Courses by Enrollment</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }} />
              <Bar dataKey="enrollments" fill="rgba(255,255,255,0.8)" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Input className="h-8 text-xs bg-white/[0.05] border-white/10 text-white placeholder:text-white/25 rounded-xl pl-3"
            placeholder="Search courses or creators..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-8 text-xs bg-white/[0.05] border-white/10 text-white/70 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-white/25 text-xs ml-auto self-center">{filtered.length} courses</span>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Course', 'Creator', 'Status', 'Students', 'Revenue', 'Rating', 'Created'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black text-white/25 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                [...Array(6)].map((_, i) => <tr key={i}><td colSpan={7} className="px-5 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-white/25">No courses found</td></tr>
              ) : filtered.slice(0, 50).map(c => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-white/80 max-w-[180px] truncate">{c.title || '—'}</p>
                    <p className="text-white/30 text-[10px]">{c.subject || c.category || ''}</p>
                  </td>
                  <td className="px-5 py-3.5 text-white/45">{c.creator_name || c.created_by || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      c.status === 'published' ? 'bg-green-400/15 text-green-400' :
                      c.status === 'draft' ? 'bg-white/10 text-white/50' : 'bg-white/5 text-white/25'
                    }`}>{c.status || 'draft'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-white font-bold">{c.enrollments}</td>
                  <td className="px-5 py-3.5 text-white font-black">${c.revenue.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-white/50">{c.rating ? `${c.rating.toFixed(1)}★` : '—'}</td>
                  <td className="px-5 py-3.5 text-white/30">{new Date(c.created_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}