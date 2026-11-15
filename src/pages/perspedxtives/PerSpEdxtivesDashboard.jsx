import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Users, FileText, Target, Clock, Shield, Calendar, Sparkles, AlertTriangle, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function PerSpEdxtivesDashboard() {
  const [aiSummary, setAiSummary] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: students = [] } = useQuery({ queryKey: ['sped-students'], queryFn: () => base44.entities.SpedStudent.list('-created_date', 200) });
  const { data: services = [] } = useQuery({ queryKey: ['sped-services'], queryFn: () => base44.entities.SpedService.list('-created_date', 200) });
  const { data: goals = [] } = useQuery({ queryKey: ['sped-goals'], queryFn: () => base44.entities.SpedGoal.list('-created_date', 200) });
  const { data: meetings = [] } = useQuery({ queryKey: ['sped-meetings'], queryFn: () => base44.entities.SpedMeeting.list('-scheduled_date', 50) });

  const today = new Date().toISOString().split('T')[0];
  const thirtyDays = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const expiredIEPs = students.filter(s => s.iep_end_date && s.iep_end_date < today).length;
  const expiringSoon = students.filter(s => s.iep_end_date && s.iep_end_date >= today && s.iep_end_date <= thirtyDays).length;
  const avgCompliance = services.length ? Math.round(services.reduce((a, s) => a + (s.compliance_pct || 100), 0) / services.length) : 100;
  const onTrackGoals = goals.filter(g => g.progress_status === 'on_track' || g.progress_status === 'mastered').length;
  const upcomingMeetings = meetings.filter(m => m.scheduled_date >= today && m.status === 'scheduled').length;

  const disabilityData = students.reduce((acc, s) => {
    const key = s.disability_classification?.replace(/_/g, ' ') || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(disabilityData).map(([name, value], i) => ({
    name, value, color: ['#000', '#374151', '#6b7280', '#9ca3af', '#d1d5db'][i % 5]
  }));

  const progressData = [
    { status: 'Mastered', count: goals.filter(g => g.progress_status === 'mastered').length },
    { status: 'On Track', count: goals.filter(g => g.progress_status === 'on_track').length },
    { status: 'Some Progress', count: goals.filter(g => g.progress_status === 'some_progress').length },
    { status: 'Minimal', count: goals.filter(g => g.progress_status === 'minimal_progress').length },
    { status: 'Not Started', count: goals.filter(g => g.progress_status === 'not_started').length },
  ].filter(d => d.count > 0);

  const generateSummary = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a 3-sentence SPED department executive briefing:
- ${students.length} students with IEPs
- ${avgCompliance}% service compliance
- ${expiredIEPs} expired IEPs, ${expiringSoon} expiring soon
- ${onTrackGoals}/${goals.length} goals on track
- ${upcomingMeetings} upcoming meetings
Focus on immediate priorities and one win.`,
    });
    setAiSummary(result);
    setGenerating(false);
  };

  const QUICK_LINKS = [
    { to: '/perspedxtives/students', icon: Users, label: 'Students', value: students.length, alert: expiredIEPs > 0 },
    { to: '/perspedxtives/ieps', icon: FileText, label: 'IEPs', value: students.filter(s => s.iep_status === 'active').length },
    { to: '/perspedxtives/goals', icon: Target, label: 'Goals', value: goals.length },
    { to: '/perspedxtives/services', icon: Clock, label: 'Services', value: services.length },
    { to: '/perspedxtives/schedule', icon: Calendar, label: 'Schedule', value: `${services.filter(s => s.schedule_days?.length).length} sched.` },
    { to: '/perspedxtives/meetings', icon: Calendar, label: 'Meetings', value: upcomingMeetings + ' upcoming', alert: upcomingMeetings > 0 },
    { to: '/perspedxtives/compliance', icon: Shield, label: 'Compliance', value: `${avgCompliance}%`, alert: expiredIEPs > 0 },
    { to: '/perspedxtives/ai-generator', icon: Sparkles, label: 'AI IEP', value: 'Generate' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">PerSpEdxtives™ Command</h1>
          <p className="text-gray-400 text-sm mt-0.5">Special Education Operating System</p>
        </div>
        <Button onClick={generateSummary} disabled={generating} className="bg-black text-white rounded-xl font-black gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5" /> {generating ? 'Analyzing...' : 'AI Briefing'}
        </Button>
      </div>

      {/* AI Summary */}
      {(aiSummary || generating) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-[#020205] rounded-2xl p-5 mb-6 flex gap-3">
          <Brain className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
          {generating ? (
            <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /><p className="text-white/40 text-sm">Generating briefing...</p></div>
          ) : (
            <p className="text-white/80 text-sm leading-relaxed">{aiSummary}</p>
          )}
        </motion.div>
      )}

      {/* Alerts */}
      {(expiredIEPs > 0 || expiringSoon > 0) && (
        <div className="space-y-2 mb-6">
          {expiredIEPs > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm font-bold text-red-800">{expiredIEPs} student IEP{expiredIEPs > 1 ? 's have' : ' has'} expired — immediate action required</p>
              <Link to="/perspedxtives/compliance" className="ml-auto text-xs font-black text-red-700 hover:text-red-900 flex items-center gap-1">Fix Now <ArrowRight className="w-3 h-3" /></Link>
            </div>
          )}
          {expiringSoon > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm font-bold text-amber-800">{expiringSoon} IEP{expiringSoon > 1 ? 's expire' : ' expires'} within 30 days</p>
            </div>
          )}
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#020205] text-white rounded-2xl p-5">
          <p className="text-white/40 text-xs font-black uppercase tracking-wider mb-2">Total Students</p>
          <p className="text-3xl font-black">{students.length}</p>
        </div>
        <div className={`rounded-2xl p-5 ${avgCompliance >= 90 ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Service Compliance</p>
          <p className={`text-3xl font-black ${avgCompliance >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>{avgCompliance}%</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Goals On Track</p>
          <p className="text-3xl font-black text-black">{onTrackGoals}<span className="text-lg text-gray-400">/{goals.length}</span></p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Upcoming Meetings</p>
          <p className="text-3xl font-black text-black">{upcomingMeetings}</p>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {QUICK_LINKS.map(({ to, icon: Icon, label, value, alert }) => (
          <Link key={to} to={to} className="group bg-white border border-gray-100 rounded-2xl p-4 hover:border-black/20 hover:shadow-sm transition-all relative">
            {alert && <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            <Icon className="w-4 h-4 text-gray-400 group-hover:text-black mb-2 transition-colors" />
            <p className="font-black text-xs text-black">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{value}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      {(students.length > 0 || goals.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {pieData.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="font-black text-sm text-black mb-4">Disability Classification</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {pieData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-[10px] text-gray-500 truncate">{name}: {value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {progressData.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="font-black text-sm text-black mb-4">Goal Progress Distribution</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={progressData}>
                  <XAxis dataKey="status" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ border: 'none', borderRadius: 12, fontSize: 11 }} />
                  <Bar dataKey="count" fill="#000000" radius={[4, 4, 0, 0]} name="Goals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {students.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
          <Brain className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-black text-black">Get Started with PerSpEdxtives™</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">Add your first SPED student to begin tracking IEPs, services, and compliance.</p>
          <Link to="/perspedxtives/students" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-black text-sm">
            Add Students <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}