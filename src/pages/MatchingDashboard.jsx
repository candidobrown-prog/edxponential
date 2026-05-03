import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Zap, Users, TrendingUp, CheckCircle, Clock, Target, ArrowRight,
  RefreshCw, Shield, Briefcase, GraduationCap, DollarSign,
  Star, BarChart3, Activity, AlertCircle, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'capital', label: 'edVestor ↔ Founder' },
  { key: 'tutor', label: 'Tutor ↔ Student' },
  { key: 'jobs', label: 'Talent ↔ Employer' },
  { key: 'advisor', label: 'edVisor ↔ Leader' },
];

function ScoreBadge({ score }) {
  const color = score >= 85 ? 'bg-green-100 text-green-700' : score >= 70 ? 'bg-blue-100 text-blue-700' : score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500';
  return <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm ${color}`}>{score}</div>;
}

function StatCard({ label, value, sub, icon: Icon, color = 'text-[#0a0f1e]', bg = 'bg-gray-100' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-black text-[#0a0f1e]">{value}</p>
      <p className="text-sm font-bold text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function MatchingDashboard() {
  const [tab, setTab] = useState('overview');
  const [matchScores, setMatchScores] = useState([]);
  const [tutorStudents, setTutorStudents] = useState([]);
  const [tutorProfiles, setTutorProfiles] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [computing, setComputing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [scores, students, tutors, jobs, apps, sess] = await Promise.all([
        base44.entities.MatchScore.list('-score', 100),
        base44.entities.TutoringStudent.list('-created_date', 100),
        base44.entities.TutorProfile.filter({ status: 'approved' }),
        base44.entities.JobPost.list('-created_date', 100),
        base44.entities.JobApplication.list('-created_date', 100),
        base44.entities.TutoringSession.list('-created_date', 100),
      ]);
      setMatchScores(scores);
      setTutorStudents(students);
      setTutorProfiles(tutors);
      setJobPosts(jobs);
      setJobApplications(apps);
      setSessions(sess);
    }).finally(() => setLoading(false));
  }, []);

  const handleRecompute = async () => {
    setComputing(true);
    try {
      await base44.functions.invoke('computeMatchScores', {});
      const scores = await base44.entities.MatchScore.list('-score', 100);
      setMatchScores(scores);
    } catch (e) {}
    setComputing(false);
  };

  const handleTutorMatch = async (studentId, tutorId, tutorName) => {
    await base44.entities.TutoringStudent.update(studentId, { assigned_tutor_id: tutorId, status: 'matched' });
    setTutorStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'matched', assigned_tutor_id: tutorId } : s));
  };

  const handleAppStatus = async (appId, status) => {
    await base44.entities.JobApplication.update(appId, { status });
    setJobApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  const topMatches = matchScores.filter(m => m.score >= 70).sort((a, b) => b.score - a.score);
  const pendingStudents = tutorStudents.filter(s => s.status === 'pending' || s.status === 'matching');
  const matchedStudents = tutorStudents.filter(s => s.status === 'matched' || s.status === 'active');
  const activeJobs = jobPosts.filter(j => j.status === 'active');
  const pendingApps = jobApplications.filter(a => a.status === 'submitted' || a.status === 'under_review');
  const shortlistedApps = jobApplications.filter(a => a.status === 'shortlisted');

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-white/40" />
              <p className="text-white/40 text-xs font-black uppercase tracking-widest">AI Matching Engine</p>
            </div>
            <h1 className="text-3xl font-black text-white">Matching Dashboard</h1>
            <p className="text-white/50 mt-1">Intelligent connections across all edXponential systems.</p>
          </div>
          <Button onClick={handleRecompute} disabled={computing} className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-black gap-2 h-11">
            <RefreshCw className={`w-4 h-4 ${computing ? 'animate-spin' : ''}`} />
            {computing ? 'Computing...' : 'Recompute Matches'}
          </Button>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-6 flex gap-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-black transition-all ${tab === t.key ? 'bg-white text-[#0a0f1e]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <>
            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Capital Matches" value={topMatches.length} sub="Score ≥ 70" icon={DollarSign} color="text-[#0a0f1e]" bg="bg-gray-100" />
              <StatCard label="Students Pending" value={pendingStudents.length} sub="Awaiting tutor" icon={GraduationCap} color="text-amber-600" bg="bg-amber-50" />
              <StatCard label="Job Applications" value={pendingApps.length} sub="Under review" icon={Briefcase} color="text-blue-600" bg="bg-blue-50" />
              <StatCard label="Active Tutors" value={tutorProfiles.length} sub="Verified & approved" icon={Users} color="text-green-600" bg="bg-green-50" />
            </div>

            {/* 4 Match Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'edVestor ↔ Founder', desc: 'Capital intelligence', count: topMatches.length, path: '/matched-opportunities', icon: DollarSign, key: 'capital' },
                { label: 'edVisor ↔ Leader', desc: 'Advisory matching', count: 0, path: '/edvisors', icon: Star, key: 'advisor' },
                { label: 'Tutor ↔ Student', desc: 'TwotrX intervention', count: pendingStudents.length, path: '/twotrx/tutors', icon: GraduationCap, key: 'tutor' },
                { label: 'Talent ↔ Employer', desc: 'OneJob placement', count: pendingApps.length, path: '/onejob/jobs', icon: Briefcase, key: 'jobs' },
              ].map(({ label, desc, count, path, icon: Icon, key }) => (
                <button key={key} onClick={() => setTab(key)}
                  className="bg-white rounded-2xl border-2 border-gray-100 hover:border-[#0a0f1e] p-5 text-left transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0f1e] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-black text-[#0a0f1e] text-sm">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-2xl font-black text-[#0a0f1e]">{count}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0a0f1e] group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Capital Matches */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-black text-[#0a0f1e]">Top Capital Matches</h2>
                  <button onClick={() => setTab('capital')} className="text-xs font-black text-[#0a0f1e] flex items-center gap-1 hover:opacity-70">View all <ArrowRight className="w-3 h-3" /></button>
                </div>
                {topMatches.length === 0 ? (
                  <div className="py-12 text-center">
                    <Zap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm font-semibold">No matches yet.</p>
                    <Button onClick={handleRecompute} disabled={computing} className="mt-4 bg-[#0a0f1e] text-white font-bold text-sm h-9">
                      {computing ? 'Computing...' : 'Run AI Matching'}
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {topMatches.slice(0, 5).map(m => (
                      <div key={m.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <p className="font-black text-[#0a0f1e] text-sm">{m.deal_title}</p>
                          <p className="text-xs text-gray-400">{m.founder_name} · {m.label}</p>
                        </div>
                        <ScoreBadge score={m.score} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TwotrX Pending */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-black text-[#0a0f1e]">Students Needing Tutors</h2>
                  <button onClick={() => setTab('tutor')} className="text-xs font-black text-[#0a0f1e] flex items-center gap-1 hover:opacity-70">View all <ArrowRight className="w-3 h-3" /></button>
                </div>
                {pendingStudents.length === 0 ? (
                  <div className="py-12 text-center">
                    <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm font-semibold">No pending student matches.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {pendingStudents.slice(0, 5).map(s => (
                      <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <p className="font-black text-[#0a0f1e] text-sm">{s.student_name}</p>
                          <p className="text-xs text-gray-400">Grade {s.grade} · {s.subject_needed} · {s.session_type?.replace('_', '-')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${s.urgency === 'urgent' ? 'bg-red-100 text-red-700' : s.urgency === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{s.urgency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Job Pipeline Overview */}
            {activeJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-black text-[#0a0f1e]">OneJob — Hiring Pipeline</h2>
                  <button onClick={() => setTab('jobs')} className="text-xs font-black text-[#0a0f1e] flex items-center gap-1 hover:opacity-70">View details <ArrowRight className="w-3 h-3" /></button>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                  {[
                    { label: 'Active Posts', value: activeJobs.length, color: 'text-[#0a0f1e]' },
                    { label: 'Applications', value: jobApplications.length, color: 'text-blue-600' },
                    { label: 'Shortlisted', value: shortlistedApps.length, color: 'text-green-600' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="px-6 py-5 text-center">
                      <p className={`text-2xl font-black ${color}`}>{value}</p>
                      <p className="text-xs text-gray-400 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* CAPITAL MATCHING TAB */}
        {tab === 'capital' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#0a0f1e]">edVestor ↔ Founder Matches</h2>
                <p className="text-gray-500 text-sm mt-1">AI-ranked capital intelligence matches based on investment thesis alignment.</p>
              </div>
              <Button onClick={handleRecompute} disabled={computing} className="bg-[#0a0f1e] text-white font-black gap-2 h-10">
                <RefreshCw className={`w-4 h-4 ${computing ? 'animate-spin' : ''}`} />
                {computing ? 'Computing...' : 'Recompute'}
              </Button>
            </div>

            {/* Score Legend */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Match Score Legend</p>
              <div className="flex gap-4 flex-wrap">
                {[['85–100', 'Exceptional', 'bg-green-100 text-green-700'], ['70–84', 'Strong', 'bg-blue-100 text-blue-700'], ['50–69', 'Possible Fit', 'bg-amber-100 text-amber-700'], ['0–49', 'Low Fit', 'bg-gray-100 text-gray-500']].map(([range, label, cls]) => (
                  <div key={range} className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${cls}`}>{range}</span>
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {matchScores.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
                <Zap className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="font-black text-gray-400 text-lg">No match scores computed yet.</p>
                <p className="text-gray-300 text-sm mt-1 mb-5">Run the AI engine to generate intelligent capital matches.</p>
                <Button onClick={handleRecompute} disabled={computing} className="bg-[#0a0f1e] text-white font-bold">
                  {computing ? 'Computing...' : 'Run AI Matching Now'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {matchScores.sort((a, b) => b.score - a.score).map(m => (
                  <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#0a0f1e] transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-black text-[#0a0f1e]">{m.deal_title}</p>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${m.score >= 85 ? 'bg-green-100 text-green-700' : m.score >= 70 ? 'bg-blue-100 text-blue-700' : m.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{m.label}</span>
                        </div>
                        <p className="text-sm text-gray-500">{m.founder_name}</p>
                        {m.explanation && <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">{m.explanation}</p>}
                      </div>
                      <ScoreBadge score={m.score} />
                    </div>
                    {/* Breakdown bars */}
                    {(m.capital_fit || m.stage_fit || m.sector_fit) && (
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {[['Capital Fit', m.capital_fit], ['Stage Fit', m.stage_fit], ['Sector Fit', m.sector_fit]].map(([label, val]) => val != null && (
                          <div key={label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">{label}</span>
                              <span className="font-black text-[#0a0f1e]">{val}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-gray-100">
                              <div className="h-1.5 rounded-full bg-[#0a0f1e]" style={{ width: `${val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TUTOR MATCHING TAB */}
        {tab === 'tutor' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0a0f1e]">Tutor ↔ Student Matching</h2>
              <p className="text-gray-500 text-sm mt-1">Match students to qualified tutors based on subject, grade, location, and availability.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Pending Students" value={pendingStudents.length} sub="Awaiting match" icon={Clock} color="text-amber-600" bg="bg-amber-50" />
              <StatCard label="Active Matches" value={matchedStudents.length} sub="Currently matched" icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
              <StatCard label="Approved Tutors" value={tutorProfiles.length} sub="Available" icon={GraduationCap} color="text-[#4f46e5]" bg="bg-[#eef2ff]" />
              <StatCard label="Sessions Done" value={sessions.filter(s => s.session_status === 'completed').length} sub="Completed" icon={Activity} color="text-[#0891b2]" bg="bg-[#ecfeff]" />
            </div>

            {/* Students awaiting match */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="font-black text-[#0a0f1e]">Students Awaiting Match ({pendingStudents.length})</h3>
              </div>
              {pendingStudents.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckCircle className="w-10 h-10 text-green-300 mx-auto mb-3" />
                  <p className="font-black text-gray-400">All students have been matched!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {pendingStudents.map(s => (
                    <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#4f46e5] font-black text-sm">{s.student_name?.[0]}</span>
                        </div>
                        <div>
                          <p className="font-black text-[#0a0f1e] text-sm">{s.student_name}</p>
                          <p className="text-xs text-gray-400">Grade {s.grade} · {s.subject_needed} · {s.session_type?.replace('_', '-')} · {s.location || s.school_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full capitalize ${s.urgency === 'urgent' ? 'bg-red-100 text-red-700' : s.urgency === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{s.urgency}</span>
                        <Link to="/twotrx/tutors">
                          <Button size="sm" className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold h-8 text-xs gap-1">
                            Find Match <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Tutors */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-[#0a0f1e]">Available Tutors ({tutorProfiles.length})</h3>
                <Link to="/twotrx/tutors" className="text-xs font-black text-[#0a0f1e] flex items-center gap-1 hover:opacity-70">Browse all <ArrowRight className="w-3 h-3" /></Link>
              </div>
              {tutorProfiles.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm font-semibold">No approved tutors yet.</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {tutorProfiles.slice(0, 5).map(t => (
                    <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ecfdf5] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#059669] font-black text-sm">{t.full_name?.[0]}</span>
                        </div>
                        <div>
                          <p className="font-black text-[#0a0f1e] text-sm">{t.full_name}</p>
                          <p className="text-xs text-gray-400">{t.subjects?.slice(0, 3).join(', ')} · {t.city}{t.state ? `, ${t.state}` : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-black text-gray-600">{t.rating?.toFixed(1) || 'New'}</span>
                        </div>
                        <span className="text-xs font-black text-[#0a0f1e]">${t.hourly_rate}/hr</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* JOBS MATCHING TAB */}
        {tab === 'jobs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0a0f1e]">Talent ↔ Employer Matching</h2>
              <p className="text-gray-500 text-sm mt-1">Track job applications and advance candidates through the hiring pipeline.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Active Jobs" value={activeJobs.length} sub="Open positions" icon={Briefcase} color="text-[#0a0f1e]" bg="bg-gray-100" />
              <StatCard label="Total Applications" value={jobApplications.length} sub="All time" icon={Users} color="text-blue-600" bg="bg-blue-50" />
              <StatCard label="Under Review" value={pendingApps.length} sub="Pending decision" icon={Clock} color="text-amber-600" bg="bg-amber-50" />
              <StatCard label="Shortlisted" value={shortlistedApps.length} sub="Advanced" icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
            </div>

            {/* Applications by job */}
            {activeJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="font-black text-gray-400">No active job posts.</p>
                <Link to="/onejob/post"><Button className="mt-4 bg-[#0a0f1e] text-white font-bold">Post a Job</Button></Link>
              </div>
            ) : (
              activeJobs.map(job => {
                const apps = jobApplications.filter(a => a.job_id === job.id);
                return (
                  <div key={job.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                      <div>
                        <p className="font-black text-[#0a0f1e]">{job.job_title}</p>
                        <p className="text-xs text-gray-400">{job.organization_name} · {apps.length} applicants</p>
                      </div>
                      <Link to="/onejob/employer">
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold">View All</Button>
                      </Link>
                    </div>
                    {apps.length === 0 ? (
                      <div className="px-6 py-6 text-center text-gray-400 text-sm">No applications yet.</div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {apps.slice(0, 4).map(a => (
                          <div key={a.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                              <p className="font-black text-[#0a0f1e] text-sm">{a.applicant_name}</p>
                              <p className="text-xs text-gray-400">{a.current_title} · {a.current_organization}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-black px-2 py-0.5 rounded-full capitalize ${a.status === 'shortlisted' ? 'bg-green-100 text-green-700' : a.status === 'submitted' ? 'bg-blue-100 text-blue-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>{a.status?.replace('_', ' ')}</span>
                              {(a.status === 'submitted' || a.status === 'under_review') && (
                                <div className="flex gap-1">
                                  <Button size="sm" className="bg-green-600 text-white h-7 text-xs font-bold" onClick={() => handleAppStatus(a.id, 'shortlisted')}>Shortlist</Button>
                                  <Button size="sm" variant="outline" className="h-7 text-xs font-bold text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAppStatus(a.id, 'rejected')}>Reject</Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ADVISOR TAB */}
        {tab === 'advisor' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0a0f1e]">edVisor ↔ Leader Matching</h2>
              <p className="text-gray-500 text-sm mt-1">Connect education leaders with expert advisors and coaches.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <Star className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-black text-[#0a0f1e] text-lg mb-2">edVisor Matching Engine</p>
              <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">Browse our network of expert edVisors and find your perfect match based on your role, goals, and leadership stage.</p>
              <Link to="/edvisors">
                <Button className="bg-[#0a0f1e] text-white font-black gap-2">
                  <Star className="w-4 h-4" /> Browse edVisors
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}