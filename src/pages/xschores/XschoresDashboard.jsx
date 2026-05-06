import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, AlertTriangle, CheckCircle2, TrendingDown, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RISK_CONFIG = {
  on_track: { label: 'On Track', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  watch: { label: 'Watch', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' },
  concern: { label: 'Concern', color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  at_risk: { label: 'At Risk', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  critical: { label: 'Critical', color: 'bg-red-900 text-red-100', dot: 'bg-red-700' },
};

function StatCard({ label, value, icon: Icon, sub, color = 'text-foreground' }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function XschoresDashboard() {
  const [riskFilter, setRiskFilter] = useState('all');

  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['xschores-students'],
    queryFn: () => base44.entities.XscoresStudent.list('-updated_date', 100),
  });

  const { data: alerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ['xschores-alerts'],
    queryFn: () => base44.entities.XscoresAlert.filter({ status: 'open' }, '-created_date', 50),
  });

  const atRisk = students.filter(s => ['at_risk', 'critical'].includes(s.risk_level));
  const critical = students.filter(s => s.risk_level === 'critical');
  const openAlerts = alerts.filter(a => a.status === 'open');

  const filteredStudents = riskFilter === 'all' ? students : students.filter(s => s.risk_level === riskFilter);
  const riskCounts = ['on_track', 'watch', 'concern', 'at_risk', 'critical'].reduce((acc, r) => {
    acc[r] = students.filter(s => s.risk_level === r).length;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-foreground">Leader Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time student risk and culture overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={students.length} icon={Users} sub="Active enrollment" />
        <StatCard label="Open Alerts" value={openAlerts.length} icon={ShieldAlert} sub="Require follow-up" color={openAlerts.length > 0 ? 'text-red-600' : 'text-foreground'} />
        <StatCard label="At Risk / Critical" value={atRisk.length} icon={AlertTriangle} sub="Need immediate attention" color={atRisk.length > 0 ? 'text-orange-600' : 'text-foreground'} />
        <StatCard label="Critical Status" value={critical.length} icon={TrendingDown} sub="Highest urgency" color={critical.length > 0 ? 'text-red-700' : 'text-foreground'} />
      </div>

      {/* Risk level breakdown */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <h2 className="font-black text-lg mb-4">Risk Level Breakdown</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(RISK_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setRiskFilter(riskFilter === key ? 'all' : key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                riskFilter === key ? 'border-foreground shadow-md scale-105' : 'border-transparent'
              } ${cfg.color}`}
            >
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
              <span className="ml-1 font-black">{riskCounts[key] || 0}</span>
            </button>
          ))}
          {riskFilter !== 'all' && (
            <button onClick={() => setRiskFilter('all')} className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-all">
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Student table */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-black text-lg">
            {riskFilter === 'all' ? 'All Students' : `${RISK_CONFIG[riskFilter]?.label} Students`}
            <span className="ml-2 text-sm font-normal text-muted-foreground">({filteredStudents.length})</span>
          </h2>
          <Link to="/xschores/students" className="text-sm font-bold text-foreground underline underline-offset-2 hover:opacity-70">
            View All
          </Link>
        </div>
        {loadingStudents ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['Student', 'Grade', 'Teacher', 'Attendance %', 'Tardies', 'Alerts', 'Risk Level'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.slice(0, 20).map(s => {
                  const risk = RISK_CONFIG[s.risk_level] || RISK_CONFIG.on_track;
                  return (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/xschores/students/${s.id}`} className="font-bold hover:underline">{s.student_name}</Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{s.grade}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.homeroom_teacher || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={s.attendance_pct < 90 ? 'text-red-600 font-bold' : 'text-foreground'}>
                          {s.attendance_pct != null ? `${s.attendance_pct}%` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={s.tardies_this_week >= 2 ? 'text-orange-600 font-bold' : 'text-foreground'}>
                          {s.tardies_this_week || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {s.active_alerts_count > 0 ? (
                          <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-lg text-xs">{s.active_alerts_count}</span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${risk.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
                          {risk.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Open Alerts Preview */}
      {openAlerts.length > 0 && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-black text-lg">Open Alerts <span className="text-sm font-normal text-muted-foreground">({openAlerts.length})</span></h2>
            <Link to="/xschores/alerts" className="text-sm font-bold underline underline-offset-2 hover:opacity-70">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {openAlerts.slice(0, 5).map(alert => {
              const risk = RISK_CONFIG[alert.risk_level] || RISK_CONFIG.concern;
              return (
                <div key={alert.id} className="px-6 py-4 flex items-start gap-4">
                  <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${risk.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{alert.student_name} <span className="font-normal text-muted-foreground">— {alert.benchmark_name}</span></p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.trigger_description}</p>
                    {alert.recommended_action && <p className="text-xs text-foreground/70 mt-1 italic">→ {alert.recommended_action}</p>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${risk.color}`}>{risk.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}