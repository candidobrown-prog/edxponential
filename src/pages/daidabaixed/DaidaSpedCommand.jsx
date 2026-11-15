import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle, Sparkles, Brain, TrendingUp, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

const SERVICE_COLORS = {
  specialized_instruction: '#000',
  speech_language: '#3b82f6',
  occupational_therapy: '#8b5cf6',
  counseling: '#ec4899',
  behavioral_intervention: '#ef4444',
};

export default function DaidaSpedCommand() {
  const [aiReport, setAiReport] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: students = [] } = useQuery({ queryKey: ['sped-students'], queryFn: () => base44.entities.SpedStudent.list('-created_date', 200) });
  const { data: services = [] } = useQuery({ queryKey: ['sped-services'], queryFn: () => base44.entities.SpedService.list('-created_date', 200) });
  const { data: goals = [] } = useQuery({ queryKey: ['sped-goals'], queryFn: () => base44.entities.SpedGoal.list('-created_date', 200) });
  const { data: meetings = [] } = useQuery({ queryKey: ['sped-meetings'], queryFn: () => base44.entities.SpedMeeting.list('-scheduled_date', 50) });

  const today = new Date().toISOString().split('T')[0];
  const thirtyDays = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const expiredIEPs = students.filter(s => s.iep_end_date && s.iep_end_date < today).length;
  const expiringSoon = students.filter(s => s.iep_end_date && s.iep_end_date <= thirtyDays && s.iep_end_date >= today).length;
  const avgCompliance = services.length ? Math.round(services.reduce((a, s) => a + (s.compliance_pct || 100), 0) / services.length) : 100;
  const onTrackGoals = goals.filter(g => g.progress_status === 'on_track' || g.progress_status === 'mastered').length;
  const lowServices = services.filter(s => (s.compliance_pct || 100) < 80);

  const serviceTypeCounts = services.reduce((acc, s) => {
    acc[s.service_type] = (acc[s.service_type] || 0) + 1;
    return acc;
  }, {});
  const servicePieData = Object.entries(serviceTypeCounts).map(([name, value]) => ({
    name: name.replace(/_/g, ' '), value, color: SERVICE_COLORS[name] || '#9ca3af'
  }));

  const disabilityCounts = students.reduce((acc, s) => {
    if (s.disability_classification) acc[s.disability_classification] = (acc[s.disability_classification] || 0) + 1;
    return acc;
  }, {});
  const disabilityData = Object.entries(disabilityCounts).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').slice(0, 18), value
  }));

  const generateReport = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a Special Education compliance and performance report for school leadership:
- Total students with IEPs: ${students.length}
- Expired IEPs: ${expiredIEPs}
- IEPs expiring in 30 days: ${expiringSoon}
- Average service compliance: ${avgCompliance}%
- Goals on track: ${onTrackGoals}/${goals.length}
- Services below 80% compliance: ${lowServices.length}
- Upcoming IEP meetings: ${meetings.filter(m => m.scheduled_date >= today).length}

Provide: executive summary, top 3 compliance risks, top 2 wins, and 30-day action plan. Keep it concise (150 words max).`,
    });
    setAiReport(result);
    setGenerating(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">SPED Command</h1>
          <p className="text-gray-400 text-sm mt-0.5">Synced from PerSpEdxtives™ — real-time compliance intelligence</p>
        </div>
        <div className="flex gap-3">
          <Link to="/perspedxtives" className="text-xs font-bold text-gray-500 hover:text-black px-4 py-2 border border-gray-200 rounded-xl transition-colors">
            Open PerSpEdxtives™
          </Link>
          <Button onClick={generateReport} disabled={generating} className="bg-black text-white rounded-xl font-black gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5" /> {generating ? 'Generating...' : 'AI SPED Report'}
          </Button>
        </div>
      </div>

      {/* Compliance Score Hero */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-2xl p-6 text-center ${avgCompliance >= 90 ? 'bg-emerald-50 border border-emerald-100' : avgCompliance >= 75 ? 'bg-amber-50 border border-amber-100' : 'bg-red-50 border border-red-100'}`}>
          <Shield className="w-5 h-5 mx-auto mb-2 text-black/40" />
          <div className={`text-4xl font-black ${avgCompliance >= 90 ? 'text-emerald-700' : avgCompliance >= 75 ? 'text-amber-700' : 'text-red-700'}`}>{avgCompliance}%</div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Service Compliance</p>
        </div>
        <div className={`rounded-2xl p-5 ${expiredIEPs > 0 ? 'bg-red-50 border border-red-100' : 'bg-white border border-gray-100'}`}>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Expired IEPs</p>
          <p className={`text-3xl font-black ${expiredIEPs > 0 ? 'text-red-600' : 'text-black'}`}>{expiredIEPs}</p>
          {expiredIEPs > 0 && <p className="text-xs text-red-500 font-bold mt-1">Immediate action required</p>}
        </div>
        <div className={`rounded-2xl p-5 ${expiringSoon > 0 ? 'bg-amber-50 border border-amber-100' : 'bg-white border border-gray-100'}`}>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Expiring in 30 Days</p>
          <p className={`text-3xl font-black ${expiringSoon > 0 ? 'text-amber-700' : 'text-black'}`}>{expiringSoon}</p>
          {expiringSoon > 0 && <p className="text-xs text-amber-600 font-bold mt-1">Schedule IEP meetings</p>}
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Goals On Track</p>
          <p className="text-3xl font-black text-black">{onTrackGoals}/{goals.length || 0}</p>
          <p className="text-xs text-gray-400 mt-1">{goals.length > 0 ? `${Math.round(onTrackGoals / goals.length * 100)}% meeting targets` : 'No goals yet'}</p>
        </div>
      </div>

      {aiReport && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#020205] rounded-2xl p-5 mb-6 flex gap-3">
          <Brain className="w-5 h-5 text-white/50 flex-shrink-0 mt-0.5" />
          <p className="text-white/80 text-sm leading-relaxed">{aiReport}</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Service Type Breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="font-black text-sm text-black mb-4">Service Type Distribution</p>
          {servicePieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={servicePieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {servicePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {servicePieData.slice(0, 4).map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs text-gray-500 capitalize">{name}</span>
                    </div>
                    <span className="text-xs font-black">{value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Shield className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs">No services recorded yet</p>
              <Link to="/perspedxtives/services" className="text-xs font-bold text-black mt-2">Add Services →</Link>
            </div>
          )}
        </div>

        {/* Low Compliance Services */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="font-black text-sm text-black mb-4">Services Below 80% Compliance</p>
          {lowServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
              <p className="text-xs text-gray-400">All services are compliant</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowServices.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-black truncate">{s.student_name}</p>
                    <p className="text-[10px] text-gray-500">{s.service_type?.replace(/_/g, ' ')} · {s.provider_name}</p>
                  </div>
                  <span className="text-xs font-black text-red-600">{s.compliance_pct || 0}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Student IEP Status Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <p className="font-black text-sm text-black">IEP Status by Student</p>
          <Link to="/perspedxtives/students" className="text-xs font-bold text-gray-400 hover:text-black">View in PerSpEdxtives™</Link>
        </div>
        {students.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No students added yet</p>
            <Link to="/perspedxtives/students" className="text-xs font-bold text-black mt-1 inline-block">Add Students →</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {['Student', 'Grade', 'Case Manager', 'IEP End Date', 'Compliance', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const isExpired = s.iep_end_date && s.iep_end_date < today;
                const isExpiring = s.iep_end_date && s.iep_end_date <= thirtyDays && !isExpired;
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-bold text-sm text-black">{s.student_name}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{s.grade}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{s.case_manager || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold ${isExpired ? 'text-red-600' : isExpiring ? 'text-amber-600' : 'text-gray-600'}`}>
                        {s.iep_end_date || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full">
                          <div className="h-1.5 rounded-full" style={{ width: `${s.compliance_pct || 0}%`, background: (s.compliance_pct || 0) >= 90 ? '#059669' : (s.compliance_pct || 0) >= 75 ? '#d97706' : '#dc2626' }} />
                        </div>
                        <span className="text-xs font-black">{s.compliance_pct || 0}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${isExpired ? 'bg-red-100 text-red-700' : isExpiring ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {isExpired ? 'Expired' : isExpiring ? 'Expiring Soon' : s.iep_status || 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}