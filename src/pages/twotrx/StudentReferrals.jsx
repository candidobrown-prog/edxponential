import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Users, ClipboardList, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  matching: 'bg-blue-100 text-blue-700',
  matched: 'bg-purple-100 text-purple-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function StudentReferrals() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    base44.auth.me().then(u =>
      base44.entities.TutoringStudent.filter({ referred_by_email: u.email })
    ).then(setStudents).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => {
    const matchSearch = !search || s.student_name?.toLowerCase().includes(search.toLowerCase()) || s.subject_needed?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Support Pipeline</h1>
          <p className="text-slate-500 mt-1">{students.length} total referrals in the TwotrX system.</p>
        </div>
        <Link to="/twotrx/refer-student">
          <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white gap-2">
            <Plus className="w-4 h-4" /> Refer Student
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="matching">Matching</option>
          <option value="matched">Matched</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No students found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Student', 'Grade', 'Subject', 'Urgency', 'Session Type', 'Status', 'Parent Contact'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#eef2ff] flex items-center justify-center">
                        <span className="text-[#4f46e5] font-bold text-xs">{s.student_name?.[0]}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{s.student_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{s.grade}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{s.subject_needed}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${s.urgency === 'urgent' ? 'bg-red-100 text-red-700' : s.urgency === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>{s.urgency}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 capitalize">{s.session_type?.replace('_', '-')}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[s.status] || 'bg-slate-100 text-slate-600'}`}>{s.status?.replace('_', ' ')}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{s.parent_email || s.parent_phone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}