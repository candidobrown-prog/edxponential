import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Brain, TrendingUp, TrendingDown, Users, Shield, AlertTriangle,
  CheckCircle, Clock, Target, BarChart3, Sparkles, RefreshCw,
  ChevronRight, Activity, FileText, Calendar, Zap, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

const MOCK_TREND = [
  { month: 'Sep', reading: 62, math: 58, attendance: 94 },
  { month: 'Oct', reading: 65, math: 60, attendance: 93 },
  { month: 'Nov', reading: 67, math: 63, attendance: 92 },
  { month: 'Dec', reading: 66, math: 62, attendance: 91 },
  { month: 'Jan', reading: 70, math: 65, attendance: 93 },
  { month: 'Feb', reading: 72, math: 68, attendance: 94 },
  { month: 'Mar', reading: 74, math: 71, attendance: 95 },
];

const GRADE_DATA = [
  { grade: 'K', reading: 78, math: 75 },
  { grade: '1st', reading: 72, math: 70 },
  { grade: '2nd', reading: 68, math: 65 },
  { grade: '3rd', reading: 71, math: 68 },
  { grade: '4th', reading: 74, math: 72 },
  { grade: '5th', reading: 76, math: 74 },
];

const PIE_DATA = [
  { name: 'On Track', value: 68, color: '#000000' },
  { name: 'Watch', value: 18, color: '#6b7280' },
  { name: 'At Risk', value: 10, color: '#d97706' },
  { name: 'Critical', value: 4, color: '#dc2626' },
];

function KPICard({ label, value, sub, trend, color = 'bg-white border border-gray-100', textColor = 'text-black' }) {
  const isUp = trend > 0;
  return (
    <div className={`${color} rounded-2xl p-5`}>
      <p className={`text-xs font-black uppercase tracking-widest mb-3 ${textColor === 'text-black' ? 'text-gray-400' : 'text-white/40'}`}>{label}</p>
      <div className={`text-3xl font-black ${textColor}`}>{value}</div>
      <div className="flex items-center gap-2 mt-2">
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
        {sub && <span className={`text-xs ${textColor === 'text-black' ? 'text-gray-400' : 'text-white/40'}`}>{sub}</span>}
      </div>
    </div>
  );
}

export default function DaidaCommandCenter() {
  const [aiInsight, setAiInsight] = useState('');
  const [generating, setGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { data: spedStudents = [] } = useQuery({ queryKey: ['sped-students'], queryFn: () => base44.entities.SpedStudent.list('-created_date', 200) });
  const { data: spedServices = [] } = useQuery({ queryKey: ['sped-services'], queryFn: () => base44.entities.SpedService.list('-created_date', 200) });
  const { data: spedGoals = [] } = useQuery({ queryKey: ['sped-goals'], queryFn: () => base44.entities.SpedGoal.list('-created_date', 200) });
  const { data: xscoresStudents = [] } = useQuery({ queryKey: ['xscores-students'], queryFn: () => base44.entities.XscoresStudent.list('-created_date', 200) });
  const { data: alerts = [] } = useQuery({ queryKey: ['xscores-alerts'], queryFn: () => base44.entities.XscoresAlert.list('-created_date', 50) });
  const { data: meetings = [] } = useQuery({ queryKey: ['sped-meetings'], queryFn: () => base44.entities.SpedMeeting.list('-scheduled_date', 50) });

  // Derived metrics
  const today = new Date().toISOString().split('T')[0];
  const totalStudents = xscoresStudents.length + spedStudents.length;
  const activeAlerts = alerts.filter(a => a.status === 'open').length;
  const spedCompliance = spedServices.length > 0 ? Math.round(spedServices.reduce((a, s) => a + (s.compliance_pct || 100), 0) / spedServices.length) : 100;
  const onTrackGoals = spedGoals.filter(g => g.progress_status === 'on_track' || g.progress_status === 'mastered').length;
  const upcomingMeetings = meetings.filter(m => m.scheduled_date >= today && m.status === 'scheduled').length;
  const avgAttendance = xscoresStudents.length > 0 ? Math.round(xscoresStudents.reduce((a, s) => a + (s.attendance_pct || 95), 0) / xscoresStudents.length) : 94;
  const atRiskStudents = xscoresStudents.filter(s => s.risk_level === 'at_risk' || s.risk_level === 'critical').length;
  const expiredIEPs = spedStudents.filter(s => s.iep_end_date && s.iep_end_date < today).length;

  const generateInsight = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI executive intelligence system for a school. Analyze the following real-time school data and generate a concise but powerful executive briefing (5-7 sentences max) that sounds like a senior education analytics AI speaking to a principal or superintendent:

DATA SNAPSHOT:
- Total students tracked: ${totalStudents}
- Active alerts: ${activeAlerts}
- SPED service compliance: ${spedCompliance}%
- Goals on track: ${onTrackGoals} of ${spedGoals.length}
- Average attendance: ${avgAttendance}%
- At-risk students: ${atRiskStudents}
- Expired IEPs: ${expiredIEPs}
- Upcoming IEP meetings: ${upcomingMeetings}
- Academic trend: Reading up 12%, Math up 13% since September

Be strategic, action-oriented, and specific. Identify the top 2-3 things requiring leadership attention and 1-2 wins to celebrate. Keep it under 150 words.`,
    });
    setAiInsight(result);
    setGenerating(false);
    setLastUpdated(new Date());
  };

  useEffect(() => { generateInsight(); }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Top Header */}
      <div className="bg-[#020205] px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Brain className="w-5 h-5 text-white" />
                <h1 className="text-white font-black text-xl">Command Center</h1>
                <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider">Live</span>
                </div>
              </div>
              <p className="text-white/30 text-xs">Last synced: {lastUpdated.toLocaleTimeString()}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={generateInsight} disabled={generating} variant="outline"
                className="rounded-xl border-white/10 text-white/60 hover:bg-white/10 hover:text-white text-xs font-bold gap-2 bg-transparent">
                <RefreshCw className={`w-3 h-3 ${generating ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <Link to="/daida-baixed/reports">
                <Button className="rounded-xl bg-white text-black text-xs font-black gap-2">
                  <FileText className="w-3 h-3" /> Generate Report
                </Button>
              </Link>
            </div>
          </div>

          {/* AI Insight Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">AI Executive Briefing</p>
                {generating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    <p className="text-white/40 text-sm">Analyzing platform data...</p>
                  </div>
                ) : (
                  <p className="text-white/80 text-sm leading-relaxed">{aiInsight || 'Loading intelligence...'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="col-span-2">
            <KPICard label="Total Students" value={totalStudents || 847} trend={3} sub="enrolled" color="bg-[#020205]" textColor="text-white" />
          </div>
          <div className="col-span-2">
            <KPICard label="Attendance Rate" value={`${avgAttendance || 94}%`} trend={1.2} sub="school avg" />
          </div>
          <div className="col-span-2">
            <KPICard label="SPED Compliance" value={`${spedCompliance}%`} trend={spedCompliance >= 90 ? 2 : -3} sub={`${spedServices.length} services`} />
          </div>
          <div className="col-span-2">
            <KPICard label="Active Alerts" value={activeAlerts || 0} trend={activeAlerts > 5 ? -15 : 0} sub="need action" color={activeAlerts > 0 ? 'bg-amber-50 border border-amber-100' : 'bg-white border border-gray-100'} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPICard label="Reading Proficiency" value="74%" trend={5} sub="school wide" />
          <KPICard label="Math Proficiency" value="71%" trend={4} sub="school wide" />
          <KPICard label="IEP Goals On Track" value={`${onTrackGoals}/${spedGoals.length || 5}`} trend={8} sub="active goals" />
          <KPICard label="At-Risk Students" value={atRiskStudents || 12} trend={atRiskStudents > 10 ? -5 : 2} sub="need support" color={atRiskStudents > 10 ? 'bg-red-50 border border-red-100' : 'bg-white border border-gray-100'} />
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Academic Trend */}
          <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-black text-sm text-black">Academic Performance Trend</p>
                <p className="text-xs text-gray-400">Reading, Math & Attendance — Year to Date</p>
              </div>
              <Link to="/daida-baixed/academic" className="text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1">
                Details <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MOCK_TREND}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="reading" stroke="#000000" strokeWidth={2.5} dot={false} name="Reading %" />
                <Line type="monotone" dataKey="math" stroke="#6b7280" strokeWidth={2.5} dot={false} name="Math %" />
                <Line type="monotone" dataKey="attendance" stroke="#d1d5db" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Attendance %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Student Risk Distribution */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-black text-sm text-black">Student Risk Profile</p>
                <p className="text-xs text-gray-400">Distribution across risk levels</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {PIE_DATA.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-500">{name}</span>
                  </div>
                  <span className="text-xs font-black text-black">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grade Level Performance */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-black text-sm text-black">Grade-Level Performance</p>
              <p className="text-xs text-gray-400">Reading vs Math proficiency by grade</p>
            </div>
            <Link to="/daida-baixed/academic" className="text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1">
              Full Analysis <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={GRADE_DATA} barGap={4}>
              <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="reading" fill="#000000" radius={[4, 4, 0, 0]} name="Reading %" />
              <Bar dataKey="math" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Math %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: '/daida-baixed/sped', icon: Shield, label: 'SPED Command', sub: `${spedStudents.length} students · ${spedCompliance}% compliance`, alert: expiredIEPs > 0 },
            { to: '/daida-baixed/alerts', icon: AlertTriangle, label: 'Active Alerts', sub: `${activeAlerts} open alerts`, alert: activeAlerts > 0 },
            { to: '/daida-baixed/goals', icon: Target, label: 'Goal Intelligence', sub: `${onTrackGoals} goals on track`, alert: false },
            { to: '/daida-baixed/reports', icon: FileText, label: 'Generate Report', sub: 'Executive, board, SPED reports', alert: false },
          ].map(({ to, icon: Icon, label, sub, alert }) => (
            <Link key={to} to={to} className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-black/20 hover:shadow-sm transition-all relative">
              {alert && <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              <Icon className="w-4 h-4 text-gray-400 mb-3 group-hover:text-black transition-colors" />
              <p className="font-black text-sm text-black">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-black mt-3 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Upcoming Meetings + Recent Alerts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-sm text-black">Upcoming IEP Meetings</p>
              <Link to="/perspedxtives/meetings" className="text-xs font-bold text-gray-400 hover:text-black">View All</Link>
            </div>
            {meetings.slice(0, 4).map(m => (
              <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 bg-black/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-black truncate">{m.student_name}</p>
                  <p className="text-[10px] text-gray-400">{m.meeting_type?.replace(/_/g, ' ')} · {m.scheduled_date}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${m.parent_response === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {m.parent_response || 'pending'}
                </span>
              </div>
            ))}
            {meetings.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No upcoming meetings</p>}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-sm text-black">Recent Alerts</p>
              <Link to="/daida-baixed/alerts" className="text-xs font-bold text-gray-400 hover:text-black">View All</Link>
            </div>
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.risk_level === 'critical' ? 'bg-red-500' : a.risk_level === 'at_risk' ? 'bg-orange-500' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-black truncate">{a.student_name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{a.trigger_description}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${a.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                  {a.status}
                </span>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="flex items-center gap-2 justify-center py-4">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <p className="text-xs text-gray-400">No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}