import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Users, BookOpen, ClipboardList, AlertTriangle,
  TrendingUp, TrendingDown, Minus, Bell, FileText, Sparkles, Brain,
  CheckCircle, XCircle, ArrowRight, BarChart3, Zap, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Area, AreaChart } from 'recharts';

const LETTER = (pct) => {
  if (pct >= 90) return 'A';
  if (pct >= 80) return 'B';
  if (pct >= 70) return 'C';
  if (pct >= 60) return 'D';
  return 'F';
};

const RISK_COLORS = {
  on_track: 'bg-emerald-100 text-emerald-700',
  watch: 'bg-yellow-100 text-yellow-700',
  concern: 'bg-orange-100 text-orange-700',
  at_risk: 'bg-red-100 text-red-700',
  failing: 'bg-red-200 text-red-800',
};

export default function GraiedxDashboard() {
  const [aiInsight, setAiInsight] = useState('');
  const [generating, setGenerating] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: classes = [] } = useQuery({ queryKey: ['gx-classes'], queryFn: () => base44.entities.GraiedxClass.list('-created_date', 100) });
  const { data: students = [] } = useQuery({ queryKey: ['gx-students'], queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 500) });
  const { data: assignments = [] } = useQuery({ queryKey: ['gx-assignments'], queryFn: () => base44.entities.GraiedxAssignment.list('-created_date', 500) });
  const { data: grades = [] } = useQuery({ queryKey: ['gx-grades'], queryFn: () => base44.entities.GraiedxGrade.list('-created_date', 1000) });
  const { data: alerts = [] } = useQuery({ queryKey: ['gx-alerts'], queryFn: () => base44.entities.GraiedxAlert.filter({ resolved: false }, '-created_date', 50) });
  const { data: reports = [] } = useQuery({ queryKey: ['gx-reports'], queryFn: () => base44.entities.GraiedxReport.list('-created_date', 100) });

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalAssignments = assignments.length;
  const ungradedCount = grades.filter(g => g.status === 'not_submitted').length;
  const missingCount = grades.filter(g => g.is_missing).length;
  const failingStudents = students.filter(s => (s.current_average || 0) < 60).length;
  const belowProficiency = students.filter(s => (s.current_average || 0) < 70).length;
  const improvingStudents = students.filter(s => s.trend === 'improving').length;
  const openAlerts = alerts.filter(a => a.status === 'open').length;

  const avgGrade = students.length
    ? Math.round(students.reduce((a, s) => a + (s.current_average || 0), 0) / students.length)
    : 0;

  // Grade distribution data
  const gradeDist = [
    { grade: 'A (90-100)', count: grades.filter(g => (g.percentage || 0) >= 90).length },
    { grade: 'B (80-89)', count: grades.filter(g => (g.percentage || 0) >= 80 && (g.percentage || 0) < 90).length },
    { grade: 'C (70-79)', count: grades.filter(g => (g.percentage || 0) >= 70 && (g.percentage || 0) < 80).length },
    { grade: 'D (60-69)', count: grades.filter(g => (g.percentage || 0) >= 60 && (g.percentage || 0) < 70).length },
    { grade: 'F (<60)', count: grades.filter(g => (g.percentage || 0) < 60 && g.percentage !== undefined).length },
  ];

  // Class averages
  const classAvgData = classes.slice(0, 8).map(c => ({
    name: c.class_name.substring(0, 12),
    avg: c.class_average || 0,
  }));

  // Risk distribution
  const riskDist = [
    { name: 'On Track', value: students.filter(s => s.risk_level === 'on_track').length, color: '#059669' },
    { name: 'Watch', value: students.filter(s => s.risk_level === 'watch').length, color: '#d97706' },
    { name: 'Concern', value: students.filter(s => s.risk_level === 'concern').length, color: '#ea580c' },
    { name: 'At Risk', value: students.filter(s => s.risk_level === 'at_risk').length, color: '#dc2626' },
    { name: 'Failing', value: students.filter(s => s.risk_level === 'failing').length, color: '#7f1d1d' },
  ].filter(d => d.value > 0);

  const generateInsight = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a 3-sentence AI executive briefing for a school's academic performance:
- ${totalClasses} classes, ${totalStudents} students
- School average: ${avgGrade}% (${LETTER(avgGrade)})
- ${failingStudents} failing students, ${belowProficiency} below proficiency
- ${missingCount} missing assignments, ${ungradedCount} ungraded
- ${openAlerts} open alerts, ${improvingStudents} improving
- ${reports.filter(r => r.status === 'published').length} reports published
Focus on 1 priority action, 1 win, and 1 risk. Be executive-level and data-driven.`,
    });
    setAiInsight(result);
    setGenerating(false);
  };

  const KPI = ({ label, value, sub, color = 'default', to }) => (
    <Link to={to || '#'} className={`block bg-white border rounded-2xl p-5 hover:shadow-sm transition-all ${color === 'danger' ? 'border-red-100 bg-red-50' : color === 'warn' ? 'border-amber-100 bg-amber-50' : color === 'success' ? 'border-emerald-100 bg-emerald-50' : 'border-gray-100'}`}>
      <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-black ${color === 'danger' ? 'text-red-700' : color === 'warn' ? 'text-amber-700' : color === 'success' ? 'text-emerald-700' : 'text-black'}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </Link>
  );

  return (
    <div className="p-6 max-w-8xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-black" />
            <h1 className="text-2xl font-black text-black">Graiedx™ Command Center</h1>
          </div>
          <p className="text-gray-400 text-sm">AI-Powered Grading & Academic Performance OS</p>
        </div>
        <div className="flex items-center gap-3">
          {openAlerts > 0 && (
            <Link to="/graiedx/alerts" className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
              <Bell className="w-3.5 h-3.5" /> {openAlerts} Alerts
            </Link>
          )}
          <Button onClick={generateInsight} disabled={generating} className="bg-black text-white rounded-xl font-black gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5" /> {generating ? 'Analyzing...' : 'AI Briefing'}
          </Button>
        </div>
      </div>

      {/* AI Insight */}
      {(aiInsight || generating) && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#020205] rounded-2xl p-5 mb-6 flex gap-3">
          <Brain className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
          {generating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              <p className="text-white/40 text-sm">Analyzing academic performance...</p>
            </div>
          ) : (
            <p className="text-white/80 text-sm leading-relaxed">{aiInsight}</p>
          )}
        </motion.div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <KPI label="Classes" value={totalClasses} to="/graiedx/gradebook" />
        <KPI label="Students" value={totalStudents} to="/graiedx/students" />
        <KPI label="Assignments" value={totalAssignments} to="/graiedx/assignments" />
        <KPI label="School Avg" value={`${avgGrade}%`} sub={LETTER(avgGrade)} color={avgGrade >= 70 ? 'success' : 'danger'} />
        <KPI label="Ungraded" value={ungradedCount} color={ungradedCount > 10 ? 'warn' : 'default'} to="/graiedx/gradebook" />
        <KPI label="Missing" value={missingCount} color={missingCount > 5 ? 'danger' : 'default'} to="/graiedx/alerts" />
        <KPI label="Failing" value={failingStudents} color={failingStudents > 0 ? 'danger' : 'success'} to="/graiedx/students" />
        <KPI label="Alerts" value={openAlerts} color={openAlerts > 0 ? 'danger' : 'success'} to="/graiedx/alerts" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { to: '/graiedx/gradebook', icon: ClipboardList, label: 'Open Gradebook', sub: 'Enter & manage grades' },
          { to: '/graiedx/voice', icon: Zap, label: 'Voice Grade', sub: 'Speak to grade students' },
          { to: '/graiedx/reports', icon: FileText, label: 'Generate Reports', sub: 'AI progress reports' },
          { to: '/graiedx/analytics', icon: BarChart3, label: 'AI Analytics', sub: 'Forecasts & insights' },
        ].map(({ to, icon: Icon, label, sub }) => (
          <Link key={to} to={to} className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-black/20 hover:shadow-sm transition-all group">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-black text-xs text-black">{label}</p>
              <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Grade Distribution */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-4">Grade Distribution</p>
          {gradeDist.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={gradeDist} barSize={18}>
                <XAxis dataKey="grade" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="count" fill="#000" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm font-bold">No grade data yet</div>
          )}
        </div>

        {/* Class Averages */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-4">Class Averages</p>
          {classAvgData.some(d => d.avg > 0) ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={classAvgData} barSize={14}>
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="avg" fill="#374151" radius={[4, 4, 0, 0]} name="Avg %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm font-bold">Add classes to see averages</div>
          )}
        </div>

        {/* Risk Distribution */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-4">Student Risk Levels</p>
          {riskDist.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={riskDist} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                    {riskDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {riskDist.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[10px] text-gray-500">{name}: {value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm font-bold">Add students to see risk data</div>
          )}
        </div>
      </div>

      {/* Bottom Row: Alerts + At-Risk Students */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Open Alerts */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-sm text-black">Active Alerts</p>
            <Link to="/graiedx/alerts" className="text-xs font-black text-gray-400 hover:text-black flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {alerts.slice(0, 5).length === 0 ? (
            <div className="flex items-center gap-3 py-6 justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-200" />
              <p className="text-gray-400 text-sm font-bold">No open alerts — great job!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-xl ${alert.severity === 'critical' ? 'bg-red-50' : alert.severity === 'warning' ? 'bg-amber-50' : 'bg-gray-50'}`}>
                  <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                  <div>
                    <p className="font-bold text-xs text-black">{alert.student_name}</p>
                    <p className="text-[10px] text-gray-500">{alert.alert_type?.replace(/_/g, ' ')} · {alert.class_name}</p>
                  </div>
                  <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* At-Risk Students */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-sm text-black">Students Needing Attention</p>
            <Link to="/graiedx/students" className="text-xs font-black text-gray-400 hover:text-black flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {students.filter(s => s.risk_level !== 'on_track').slice(0, 5).length === 0 ? (
            <div className="flex items-center gap-3 py-6 justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-200" />
              <p className="text-gray-400 text-sm font-bold">All students on track!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.filter(s => s.risk_level !== 'on_track').slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[9px] font-black">{s.student_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-black truncate">{s.student_name}</p>
                    <p className="text-[10px] text-gray-500">{s.class_name} · {s.missing_assignments || 0} missing</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-black">{s.current_average || 0}%</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${RISK_COLORS[s.risk_level] || 'bg-gray-100 text-gray-600'}`}>
                      {s.risk_level?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty State CTA */}
      {totalClasses === 0 && (
        <div className="mt-6 bg-[#020205] rounded-2xl p-8 text-center">
          <GraduationCap className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="font-black text-white text-lg mb-2">Welcome to Graiedx™</p>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6">Start by creating your first class, then add students and assignments to unlock the full intelligence system.</p>
          <Link to="/graiedx/gradebook" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-white/90">
            Create Your First Class <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}