import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Shield, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SpedCompliance() {
  const { data: students = [] } = useQuery({ queryKey: ['sped-students'], queryFn: () => base44.entities.SpedStudent.list('-created_date', 200) });
  const { data: services = [] } = useQuery({ queryKey: ['sped-services'], queryFn: () => base44.entities.SpedService.list('-created_date', 200) });
  const { data: meetings = [] } = useQuery({ queryKey: ['sped-meetings'], queryFn: () => base44.entities.SpedMeeting.list('-scheduled_date', 100) });

  const today = new Date().toISOString().split('T')[0];
  const thirtyDays = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const expiredIEPs = students.filter(s => s.iep_end_date && s.iep_end_date < today);
  const expiringSoon = students.filter(s => s.iep_end_date && s.iep_end_date >= today && s.iep_end_date <= thirtyDays);
  const activeStudents = students.filter(s => s.status === 'active' || !s.status);

  const avgServiceCompliance = services.length
    ? Math.round(services.reduce((a, s) => a + (s.compliance_pct || 100), 0) / services.length)
    : 100;
  const lowComplianceServices = services.filter(s => (s.compliance_pct || 100) < 80);

  const overallScore = Math.max(0, Math.min(100,
    avgServiceCompliance
    - (expiredIEPs.length * 10)
    - (lowComplianceServices.length * 5)
  ));

  const complianceItems = [
    { label: 'Active IEPs', value: activeStudents.length, status: 'ok', detail: `${activeStudents.length} students with active plans` },
    { label: 'Expired IEPs', value: expiredIEPs.length, status: expiredIEPs.length > 0 ? 'critical' : 'ok', detail: expiredIEPs.length > 0 ? expiredIEPs.map(s => s.student_name).join(', ') : 'All IEPs current' },
    { label: 'Expiring in 30 Days', value: expiringSoon.length, status: expiringSoon.length > 0 ? 'warning' : 'ok', detail: expiringSoon.length > 0 ? expiringSoon.map(s => s.student_name).join(', ') : 'None expiring soon' },
    { label: 'Avg Service Compliance', value: `${avgServiceCompliance}%`, status: avgServiceCompliance >= 90 ? 'ok' : avgServiceCompliance >= 75 ? 'warning' : 'critical', detail: `${lowComplianceServices.length} services below 80%` },
    { label: 'Low Compliance Services', value: lowComplianceServices.length, status: lowComplianceServices.length > 0 ? 'warning' : 'ok', detail: lowComplianceServices.map(s => `${s.student_name}: ${s.compliance_pct}%`).join(', ') || 'All services compliant' },
    { label: 'Upcoming Meetings', value: meetings.filter(m => m.scheduled_date >= today && m.status === 'scheduled').length, status: 'ok', detail: 'IEP meetings scheduled' },
  ];

  const serviceComplianceData = services.slice(0, 10).map(s => ({
    name: s.student_name.split(' ')[0],
    compliance: s.compliance_pct || 100,
  }));

  const STATUS_ICONS = {
    ok: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    critical: <AlertCircle className="w-4 h-4 text-red-500" />,
  };
  const STATUS_BG = { ok: 'bg-white border-gray-100', warning: 'bg-amber-50 border-amber-100', critical: 'bg-red-50 border-red-100' };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-black">Compliance Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">IDEA compliance monitoring and risk management</p>
      </div>

      {/* Overall Score */}
      <div className={`rounded-2xl p-6 mb-6 flex items-center gap-6 ${overallScore >= 90 ? 'bg-emerald-50 border border-emerald-100' : overallScore >= 70 ? 'bg-amber-50 border border-amber-100' : 'bg-red-50 border border-red-100'}`}>
        <div className="text-center">
          <p className={`text-5xl font-black ${overallScore >= 90 ? 'text-emerald-700' : overallScore >= 70 ? 'text-amber-700' : 'text-red-700'}`}>{overallScore}</p>
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider mt-1">Compliance Score</p>
        </div>
        <div className="flex-1">
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div className={`h-3 rounded-full transition-all ${overallScore >= 90 ? 'bg-emerald-500' : overallScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${overallScore}%` }} />
          </div>
          <p className="text-sm font-black mt-2 text-gray-700">
            {overallScore >= 90 ? '✓ Strong compliance — keep monitoring' : overallScore >= 70 ? '⚠ Moderate compliance — action needed' : '✗ Critical compliance issues — immediate action required'}
          </p>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {complianceItems.map(({ label, value, status, detail }) => (
          <div key={label} className={`border rounded-2xl p-4 ${STATUS_BG[status]}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {STATUS_ICONS[status]}
                <p className="font-black text-sm text-black">{label}</p>
              </div>
              <span className="text-lg font-black text-black">{value}</span>
            </div>
            <p className="text-[10px] text-gray-500 ml-6 truncate">{detail}</p>
          </div>
        ))}
      </div>

      {/* Service Compliance Chart */}
      {serviceComplianceData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
          <p className="font-black text-sm text-black mb-4">Service Compliance by Student</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviceComplianceData} barSize={24}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} formatter={v => [`${v}%`, 'Compliance']} />
              <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
                {serviceComplianceData.map((d, i) => (
                  <Cell key={i} fill={d.compliance >= 90 ? '#059669' : d.compliance >= 75 ? '#d97706' : '#dc2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Expired IEPs List */}
      {expiredIEPs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="font-black text-sm text-red-800">Expired IEPs — Immediate Action Required</p>
          </div>
          <div className="space-y-2">
            {expiredIEPs.map(s => (
              <div key={s.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3">
                <div>
                  <p className="font-bold text-sm text-black">{s.student_name}</p>
                  <p className="text-xs text-gray-500">{s.disability_classification?.replace(/_/g, ' ')} · Grade {s.grade}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-red-600">Expired: {s.iep_end_date}</p>
                  <p className="text-[10px] text-gray-400">Case Manager: {s.case_manager || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}