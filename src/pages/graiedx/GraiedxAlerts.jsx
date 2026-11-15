import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Zap, Users, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SEVERITY_CONFIG = {
  info: { color: 'bg-blue-50 border-blue-100', badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-500' },
  warning: { color: 'bg-amber-50 border-amber-100', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' },
  critical: { color: 'bg-red-50 border-red-100', badge: 'bg-red-100 text-red-700', icon: 'text-red-500' },
};

const ALERT_TYPES = [
  'failing','missing_assignments','grade_drop','below_proficiency',
  'chronic_missing','sudden_decline','mastery_gap','intervention_needed','achievement','improvement'
];

export default function GraiedxAlerts() {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('open');
  const [generating, setGenerating] = useState(false);
  const qc = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['gx-alerts-all'],
    queryFn: () => base44.entities.GraiedxAlert.list('-created_date', 200),
  });
  const { data: students = [] } = useQuery({ queryKey: ['gx-students-all'], queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 500) });

  const resolveAlert = useMutation({
    mutationFn: ({ id, notes }) => base44.entities.GraiedxAlert.update(id, { resolved: true, status: 'resolved', resolved_notes: notes }),
    onSuccess: () => qc.invalidateQueries(['gx-alerts-all']),
  });

  const generateAlerts = async () => {
    setGenerating(true);
    const atRisk = students.filter(s => (s.current_average || 0) < 70 || (s.missing_assignments || 0) >= 3 || s.risk_level === 'at_risk' || s.risk_level === 'failing');
    for (const student of atRisk.slice(0, 20)) {
      const existing = alerts.find(a => a.student_id === student.id && !a.resolved);
      if (existing) continue;
      const avg = student.current_average || 0;
      const missing = student.missing_assignments || 0;
      const type = avg < 60 ? 'failing' : avg < 70 ? 'below_proficiency' : missing >= 3 ? 'missing_assignments' : 'grade_drop';
      const severity = avg < 60 ? 'critical' : avg < 70 ? 'warning' : 'warning';
      await base44.entities.GraiedxAlert.create({
        student_id: student.id, student_name: student.student_name,
        class_id: student.class_id, class_name: student.class_name,
        teacher_email: student.teacher_email, alert_type: type, severity,
        current_average: avg, missing_count: missing,
        description: avg < 60 ? `${student.student_name} is failing with a ${avg}% average.`
          : missing >= 3 ? `${student.student_name} has ${missing} missing assignments.`
          : `${student.student_name} is below proficiency at ${avg}%.`,
        recommended_action: avg < 60 ? 'Schedule immediate intervention and parent conference.'
          : missing >= 3 ? 'Contact parent and develop missing work recovery plan.'
          : 'Monitor closely and provide additional support.',
        status: 'open',
      });
    }
    qc.invalidateQueries(['gx-alerts-all']);
    setGenerating(false);
  };

  const filtered = alerts.filter(a => {
    const sevMatch = filterSeverity === 'all' || a.severity === filterSeverity;
    const typeMatch = filterType === 'all' || a.alert_type === filterType;
    const statusMatch = filterStatus === 'all' || a.status === filterStatus;
    return sevMatch && typeMatch && statusMatch;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.resolved).length;
  const openCount = alerts.filter(a => a.status === 'open').length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Alerts & Monitoring</h1>
          <p className="text-gray-400 text-sm mt-0.5">Automated performance alerts & intervention triggers</p>
        </div>
        <Button onClick={generateAlerts} disabled={generating} className="bg-black text-white rounded-xl font-black gap-2">
          <Zap className="w-4 h-4" /> {generating ? 'Scanning...' : 'Scan Students'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open Alerts', value: openCount, color: openCount > 0 ? 'text-black' : 'text-emerald-600' },
          { label: 'Critical', value: criticalCount, color: criticalCount > 0 ? 'text-red-600' : 'text-gray-400' },
          { label: 'Warnings', value: warningCount, color: warningCount > 0 ? 'text-amber-600' : 'text-gray-400' },
          { label: 'Resolved', value: alerts.filter(a => a.resolved).length, color: 'text-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {[
          { value: filterStatus, onChange: setFilterStatus, options: [['all','All Status'],['open','Open'],['in_progress','In Progress'],['resolved','Resolved'],['dismissed','Dismissed']], placeholder: 'Status' },
          { value: filterSeverity, onChange: setFilterSeverity, options: [['all','All Severity'],['critical','Critical'],['warning','Warning'],['info','Info']], placeholder: 'Severity' },
          { value: filterType, onChange: setFilterType, options: [['all','All Types'], ...ALERT_TYPES.map(t => [t, t.replace(/_/g,' ')])], placeholder: 'Type' },
        ].map((f, i) => (
          <Select key={i} value={f.value} onValueChange={f.onChange}>
            <SelectTrigger className="w-40 rounded-xl text-sm"><SelectValue placeholder={f.placeholder} /></SelectTrigger>
            <SelectContent>
              {f.options.map(([v, l]) => <SelectItem key={v} value={v}>{l.replace(/\b\w/g,c=>c.toUpperCase())}</SelectItem>)}
            </SelectContent>
          </Select>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
          <CheckCircle className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
          <p className="font-black text-black text-lg mb-2">{openCount === 0 ? 'All Clear!' : 'No matching alerts'}</p>
          <p className="text-gray-400 text-sm mb-4">
            {openCount === 0 ? 'No open alerts. Run a scan to check for at-risk students.' : 'Try adjusting your filters.'}
          </p>
          {openCount === 0 && (
            <Button onClick={generateAlerts} className="bg-black text-white rounded-xl font-black gap-2">
              <Zap className="w-4 h-4" /> Scan Now
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => {
            const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.warning;
            return (
              <motion.div key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-white border rounded-2xl p-5 ${alert.resolved ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.icon}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-black text-sm text-black">{alert.student_name}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${config.badge}`}>{alert.severity}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-gray-100 text-gray-600">{alert.alert_type?.replace(/_/g,' ')}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{alert.description}</p>
                      {alert.recommended_action && (
                        <p className="text-xs text-gray-400 italic">→ {alert.recommended_action}</p>
                      )}
                      {alert.current_average != null && (
                        <p className="text-xs font-black text-gray-500 mt-1">Current avg: {alert.current_average}% · {alert.missing_count || 0} missing</p>
                      )}
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button size="sm" onClick={() => resolveAlert.mutate({ id: alert.id, notes: 'Resolved via dashboard' })}
                      className="bg-black text-white rounded-lg text-xs font-bold gap-1 flex-shrink-0">
                      <CheckCircle className="w-3 h-3" /> Resolve
                    </Button>
                  )}
                  {alert.resolved && <span className="text-xs font-black text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Resolved</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}