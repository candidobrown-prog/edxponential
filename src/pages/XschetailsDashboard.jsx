import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { BookOpen, Users, Briefcase, TrendingUp, Target, DollarSign, Zap, ArrowRight, Sparkles, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i=0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i*0.07, ease: [0.22,1,0.36,1] } }) };

function StatTile({ label, value, sub, color = 'bg-gray-100', textColor = 'text-[#0a0f1e]' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{label}</p>
      <p className={`text-3xl font-black ${textColor}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function XschetailsDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async u => {
      const records = await base44.entities.Xschetails.filter({ user_email: u.email }, '-created_date', 1);
      if (records.length > 0) setProfile(records[0]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md">
        <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-black text-[#0a0f1e] mb-2">No Xschetails Yet</h2>
        <p className="text-gray-400 text-sm mb-6">Complete your school intelligence profile to unlock dashboards, AI insights, and recommendations.</p>
        <Link to="/xschetails">
          <button className="px-6 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all flex items-center gap-2 mx-auto">
            Build Your Xschetails <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );

  const academicData = [
    { subject: 'Reading', score: profile.reading_proficiency || 0 },
    { subject: 'Math', score: profile.math_proficiency || 0 },
    { subject: 'Science', score: profile.science_proficiency || 0 },
    { subject: 'Attendance', score: profile.attendance_rate || 0 },
  ];

  const cultureData = [
    { area: 'Student Culture', value: (profile.student_culture_rating || 0) * 10 },
    { area: 'Staff Culture', value: (profile.staff_culture_rating || 0) * 10 },
    { area: 'Family Satisfaction', value: (profile.family_satisfaction_rating || 0) * 10 },
    { area: 'Attendance', value: profile.attendance_rate || 0 },
    { area: 'Teacher Retention', value: profile.teacher_retention_pct || 0 },
  ];

  const SECTIONS = [
    { label: 'Academic Performance', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Staffing', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Operations', icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Funding Readiness', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Community Health', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Investor Readiness', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Hiring Readiness', icon: Briefcase, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'AI Insights', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">edXponential Intelligence</p>
            <h1 className="text-3xl font-black text-white">Xschetails Dashboard™</h1>
            <p className="text-white/40 mt-1 text-sm">{profile.school_name} · {profile.city}, {profile.state}</p>
          </div>
          <div className="text-right">
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">Completion</p>
            <p className="text-3xl font-black text-white">{profile.completion_pct || 0}%</p>
            {profile.pitch_readiness_score > 0 && (
              <p className="text-white/40 text-xs mt-1">Pitch Readiness: {profile.pitch_readiness_score}/100</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile label="Enrollment" value={profile.enrollment?.toLocaleString()} sub={profile.grades_served} />
          <StatTile label="Reading %" value={profile.reading_proficiency ? `${profile.reading_proficiency}%` : null} sub="Proficiency" textColor={profile.reading_proficiency >= 50 ? 'text-green-600' : 'text-red-600'} />
          <StatTile label="Math %" value={profile.math_proficiency ? `${profile.math_proficiency}%` : null} sub="Proficiency" textColor={profile.math_proficiency >= 50 ? 'text-green-600' : 'text-red-600'} />
          <StatTile label="Attendance" value={profile.attendance_rate ? `${profile.attendance_rate}%` : null} sub="Rate" textColor={profile.attendance_rate >= 90 ? 'text-green-600' : 'text-amber-600'} />
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Academic Performance Chart */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">Academic Performance</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={academicData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fontFamily: 'Arial', fontWeight: 700 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="score" fill="#0a0f1e" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Culture / Climate Radar */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">Culture & Climate Indicators</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={cultureData}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="area" tick={{ fontSize: 10, fontFamily: 'Arial', fontWeight: 700 }} />
                <Radar dataKey="value" stroke="#0a0f1e" fill="#0a0f1e" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SECTIONS.map(({ label, icon: Icon, color, bg }) => (
            <Link key={label} to="/xschetails">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#0a0f1e] hover:shadow-lg transition-all cursor-pointer group">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="font-black text-[#0a0f1e] text-sm">{label}</p>
                <ArrowRight className="w-3 h-3 text-gray-300 mt-2 group-hover:text-[#0a0f1e] transition-all" />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* AI Analysis */}
        {profile.ai_summary && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0a0f1e] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/40" />
                <p className="text-white/40 text-xs font-black uppercase tracking-widest">AI Summary</p>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{profile.ai_summary}</p>
              {profile.ai_strengths && (
                <div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Strengths</p>
                  <p className="text-white/60 text-xs whitespace-pre-line">{profile.ai_strengths}</p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Key Risks</p>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{profile.ai_risks}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Recommendations</p>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{profile.ai_recommendations}</p>
            </div>
          </div>
        )}

        {/* 90-Day Plan */}
        {profile.ai_90_day_plan && (
          <div className="bg-white rounded-2xl border border-gray-100 p-7">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[#0a0f1e]" />
              <p className="font-black text-[#0a0f1e]">AI-Generated 90-Day Execution Plan</p>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{profile.ai_90_day_plan}</p>
          </div>
        )}

        {/* No AI yet */}
        {!profile.ai_summary && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
            <Sparkles className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-400 mb-2">AI Analysis Not Yet Generated</p>
            <p className="text-sm text-gray-300 mb-5">Complete your Xschetails and run the AI analysis to unlock full dashboard insights.</p>
            <Link to="/xschetails">
              <button className="px-6 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Complete Xschetails
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}