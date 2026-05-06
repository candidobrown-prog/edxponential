import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

const RISK_COLORS_MAP = { on_track: '#22c55e', watch: '#eab308', concern: '#f97316', at_risk: '#ef4444', critical: '#7f1d1d' };

export default function XschoresReports() {
  const { data: students = [] } = useQuery({ queryKey: ['xschores-students'], queryFn: () => base44.entities.XscoresStudent.list('-updated_date', 200) });
  const { data: alerts = [] } = useQuery({ queryKey: ['xschores-alerts-reports'], queryFn: () => base44.entities.XscoresAlert.list('-created_date', 200) });
  const { data: culture = [] } = useQuery({ queryKey: ['xschores-culture-reports'], queryFn: () => base44.entities.XscoresCultureEntry.list('-entry_date', 200) });

  const riskData = ['on_track', 'watch', 'concern', 'at_risk', 'critical'].map(r => ({
    name: r.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: students.filter(s => s.risk_level === r).length,
    fill: RISK_COLORS_MAP[r],
  })).filter(d => d.value > 0);

  const alertsByStatus = ['open', 'in_progress', 'resolved', 'escalated'].map(s => ({
    name: s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    count: alerts.filter(a => a.status === s).length,
  }));

  const cultureByCategory = Object.entries(
    culture.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + 1; return acc; }, {})
  ).map(([name, count]) => ({ name: name.replace(/_/g, ' '), count })).sort((a, b) => b.count - a.count).slice(0, 8);

  const avgAttendance = students.length > 0
    ? (students.reduce((s, st) => s + (st.attendance_pct || 0), 0) / students.length).toFixed(1)
    : '—';

  const chronicallyAbsent = students.filter(s => s.attendance_pct < 90).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Schoolwide trends and data summaries</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length },
          { label: 'Avg Attendance', value: `${avgAttendance}%` },
          { label: 'Chronically Absent', value: chronicallyAbsent, highlight: chronicallyAbsent > 0 },
          { label: 'Open Alerts', value: alerts.filter(a => a.status === 'open').length, highlight: true },
        ].map(m => (
          <div key={m.label} className="bg-white border border-border rounded-2xl p-5">
            <p className="text-xs text-muted-foreground font-medium mb-1">{m.label}</p>
            <p className={`text-3xl font-black ${m.highlight && m.value > 0 ? 'text-red-600' : 'text-foreground'}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-black text-lg mb-4">Risk Level Distribution</h2>
          {riskData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No student data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {riskData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Alerts by Status */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-black text-lg mb-4">Alerts by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={alertsByStatus}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0a0f1e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Culture Entries by Category */}
        <div className="bg-white border border-border rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-black text-lg mb-4">Culture Log — Top Categories</h2>
          {cultureByCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No culture entries yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cultureByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0a0f1e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}