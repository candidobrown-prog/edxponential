import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Users, BarChart3, DollarSign, Shield, ArrowRight, Plus, Star, CheckCircle, AlertCircle, Zap, RefreshCw, Sparkles, Award, TrendingUp, Briefcase } from 'lucide-react';
import XschetailsForm from '../components/myxschool/XschetailsForm';
import StaffInvites from '../components/myxschool/StaffInvites';
import XscoresPanel from '../components/myxschool/XscoresPanel';
import EnterpriseQuoteForm from '../components/myxschool/EnterpriseQuoteForm';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Building2 },
  { id: 'xschetails', label: 'Xschetails™', icon: BarChart3 },
  { id: 'xscores', label: 'Xscores™', icon: Star },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'enterprise', label: 'Enterprise', icon: Shield },
];

const GRADE_COLOR = { A: 'text-green-600 bg-green-50', B: 'text-blue-600 bg-blue-50', C: 'text-amber-600 bg-amber-50', D: 'text-orange-600 bg-orange-50', F: 'text-red-600 bg-red-50' };

function DashCard({ label, value, sub, icon: Icon, onClick, dark }) {
  return (
    <button onClick={onClick}
      className={`rounded-2xl p-5 text-left transition-all hover:shadow-lg hover:scale-[1.01] group w-full
        ${dark ? 'bg-[#0a0f1e] border border-[#0a0f1e]' : 'bg-white border border-gray-100 hover:border-[#0a0f1e]'}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
        <Icon className={`w-4 h-4 ${dark ? 'text-white' : 'text-[#0a0f1e]'}`} />
      </div>
      <p className={`text-2xl font-black ${dark ? 'text-white' : 'text-[#0a0f1e]'}`}>{value ?? '—'}</p>
      <p className={`text-xs font-black uppercase tracking-widest mt-0.5 ${dark ? 'text-white/40' : 'text-gray-400'}`}>{label}</p>
      {sub && <p className={`text-xs mt-1 ${dark ? 'text-white/30' : 'text-gray-300'}`}>{sub}</p>}
    </button>
  );
}

export default function MyXschool() {
  const [tab, setTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [school, setSchool] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingAI, setAnalyzingAI] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const schools = await base44.entities.MyXschool.filter({ owner_email: u.email }, '-created_date', 1);
      if (schools.length > 0) {
        setSchool(schools[0]);
        const staffList = await base44.entities.SchoolStaff.filter({ school_id: schools[0].id });
        setStaff(staffList);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSchoolSaved = (s) => setSchool(s);
  const handleStaffUpdate = (list) => setStaff(list);

  const handleRunAI = async () => {
    if (!school) return;
    setAnalyzingAI(true);
    const prompt = `You are an elite education AI analyst. Analyze this school's data and return a JSON intelligence report.

School: ${school.school_name}, ${school.city} ${school.state}
Type: ${school.school_type}, Grades: ${school.grades_served}, Enrollment: ${school.enrollment}
Reading: ${school.reading_proficiency}%, Math: ${school.math_proficiency}%, Writing: ${school.writing_proficiency}%
Attendance: ${school.attendance_rate}%, Chronic Absenteeism: ${school.chronic_absenteeism_pct}%
Teacher Retention: ${school.teacher_retention_pct}%, Vacancies: ${school.vacancies}
Goals: ${school.top_goals}, Challenge: ${school.biggest_challenge}, Urgency: ${school.urgency_level}

Calculate an Xscores grade (A/B/C/D/F) and overall score (0-100), identify key insights, and generate a 90-day plan.
Return:
{
  "grade": "B",
  "overall_score": 72,
  "summary": "2-3 sentence profile summary",
  "strengths": "3 bullet strengths",
  "risks": "3 bullet risks",
  "insights": ["insight 1", "insight 2", "insight 3", "insight 4"],
  "plan_90_day": "detailed week-by-week 90 day plan",
  "reading_rank": "Top 35% in district",
  "math_rank": "Below district average",
  "badges": ["Attendance Leader", "Turnaround Opportunity"]
}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6',
      response_json_schema: {
        type: 'object',
        properties: {
          grade: { type: 'string' },
          overall_score: { type: 'number' },
          summary: { type: 'string' },
          strengths: { type: 'string' },
          risks: { type: 'string' },
          insights: { type: 'array', items: { type: 'string' } },
          plan_90_day: { type: 'string' },
          reading_rank: { type: 'string' },
          math_rank: { type: 'string' },
          badges: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    const updated = {
      ...school,
      xscores_grade: result.grade,
      xscores_overall: result.overall_score,
      ai_summary: result.summary,
      ai_strengths: result.strengths,
      ai_risks: result.risks,
      ai_insights: result.insights || [],
      ai_90_day_plan: result.plan_90_day,
      xscores_reading_rank: result.reading_rank,
      xscores_math_rank: result.math_rank,
      xscores_badges: result.badges || [],
    };
    await base44.entities.MyXschool.update(school.id, updated);
    setSchool(updated);
    setAnalyzingAI(false);
  };

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">edXponential</p>
            <h1 className="text-3xl font-black text-white">My Xschool™</h1>
            <p className="text-white/40 mt-1 text-sm">{school ? school.school_name : 'Your school command center.'}</p>
          </div>
          {school && (
            <div className="flex items-center gap-3">
              {school.xscores_grade && (
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${GRADE_COLOR[school.xscores_grade] || 'bg-gray-100 text-gray-500'}`}>
                  {school.xscores_grade}
                </div>
              )}
              <button onClick={handleRunAI} disabled={analyzingAI}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
                {analyzingAI ? <><RefreshCw className="w-4 h-4 animate-spin" />Analyzing...</> : <><Sparkles className="w-4 h-4" />Run AI Analysis</>}
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-6 flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-all
                  ${tab === t.id ? 'bg-white text-[#0a0f1e]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                <Icon className="w-3.5 h-3.5" />{t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {!school ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
                <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-black text-[#0a0f1e] mb-2">Create Your Xschool Profile</h2>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">Start by building your school profile to unlock AI insights, Xscores, staff management, and enterprise tools.</p>
                <button onClick={() => setTab('xschetails')}
                  className="px-7 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create My Xschool
                </button>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <DashCard label="Xschetails" value={`${school.xschetails_completion_pct || 0}%`} sub="Profile completion" icon={BarChart3} onClick={() => setTab('xschetails')} />
                  <DashCard label="Staff Members" value={staff.filter(s => s.status === 'active').length} sub={`${school.staff_seats_used || 0} seats used`} icon={Users} onClick={() => setTab('staff')} />
                  <DashCard label="Xscores Grade" value={school.xscores_grade || '—'} sub="AI performance grade" icon={Star} onClick={() => setTab('xscores')} dark={!!school.xscores_grade} />
                  <DashCard label="Enterprise" value={school.enterprise_status === 'active' ? 'Active' : school.enterprise_status === 'requested' ? 'Requested' : 'None'} sub="Enterprise status" icon={Shield} onClick={() => setTab('enterprise')} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <DashCard label="Reading Rank" value={school.xscores_reading_rank || '—'} sub="vs. district" icon={TrendingUp} onClick={() => setTab('xscores')} />
                  <DashCard label="Math Rank" value={school.xscores_math_rank || '—'} sub="vs. district" icon={TrendingUp} onClick={() => setTab('xscores')} />
                  <DashCard label="Enrollment" value={school.enrollment?.toLocaleString() || '—'} sub={school.enrollment_trend || ''} icon={Users} onClick={() => setTab('xschetails')} />
                  <DashCard label="Billing" value={school.billing_status || 'Free'} sub="Current plan" icon={DollarSign} onClick={() => setTab('enterprise')} />
                </div>

                {/* Badges */}
                {school.xscores_badges?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Xscores Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {school.xscores_badges.map(b => (
                        <span key={b} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0f1e] text-white rounded-full text-xs font-black">
                          <Award className="w-3 h-3" /> {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Insights */}
                {school.ai_insights?.length > 0 && (
                  <div className="bg-[#0a0f1e] rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-white/40" />
                      <p className="text-white/40 text-xs font-black uppercase tracking-widest">AI Insights</p>
                    </div>
                    {school.ai_insights.map((ins, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-white/30 mt-2 flex-shrink-0" />
                        <p className="text-white/60 text-sm leading-relaxed">{ins}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: 'Complete Xschetails', tab: 'xschetails', icon: BarChart3 },
                    { label: 'Invite Staff', tab: 'staff', icon: Users },
                    { label: 'View Xscores', tab: 'xscores', icon: Star },
                    { label: 'Enterprise Quote', tab: 'enterprise', icon: Shield },
                    { label: 'Run AI Analysis', action: handleRunAI, icon: Sparkles },
                  ].map(({ label, tab: t, action, icon: Icon }) => (
                    <button key={label} onClick={action || (() => setTab(t))}
                      className="flex items-center gap-2 p-4 bg-white border border-gray-100 rounded-2xl text-sm font-black text-[#0a0f1e] hover:border-[#0a0f1e] hover:shadow-md transition-all">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'xschetails' && <XschetailsForm user={user} school={school} onSaved={handleSchoolSaved} />}
        {tab === 'xscores' && <XscoresPanel school={school} onRunAI={handleRunAI} analyzing={analyzingAI} />}
        {tab === 'staff' && <StaffInvites user={user} school={school} staff={staff} onUpdate={handleStaffUpdate} />}
        {tab === 'enterprise' && <EnterpriseQuoteForm user={user} school={school} onSchoolUpdate={setSchool} />}
      </div>
    </div>
  );
}