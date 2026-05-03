import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Zap, Users, TrendingUp, CheckCircle, Clock, Target, ArrowRight, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MATCH_CATEGORIES = [
  { key: 'edvestor', label: 'edVestor ↔ Founder', desc: 'Capital intelligence matching', path: '/matched-opportunities', color: 'bg-[#0a0f1e]', text: 'text-white' },
  { key: 'edvisor', label: 'edVisor ↔ Leader', desc: 'Coaching & advisory matching', path: '/edvisors', color: 'bg-gray-100', text: 'text-[#0a0f1e]' },
  { key: 'tutor', label: 'Tutor ↔ Student', desc: 'TwotrX academic intervention', path: '/twotrx/tutors', color: 'bg-gray-100', text: 'text-[#0a0f1e]' },
  { key: 'jobs', label: 'Talent ↔ Employer', desc: 'OneJob career placement', path: '/onejob/jobs', color: 'bg-gray-100', text: 'text-[#0a0f1e]' },
];

export default function MatchingDashboard() {
  const [matchScores, setMatchScores] = useState([]);
  const [tutorStudents, setTutorStudents] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [computing, setComputing] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [scores, students, jobs] = await Promise.all([
        base44.entities.MatchScore.filter({ edvestor_email: u.email }),
        base44.entities.TutoringStudent.filter({ referred_by_email: u.email }),
        base44.entities.JobPost.filter({ employer_email: u.email }),
      ]);
      setMatchScores(scores);
      setTutorStudents(students);
      setJobMatches(jobs);
    }).finally(() => setLoading(false));
  }, []);

  const handleRecompute = async () => {
    setComputing(true);
    try {
      await base44.functions.invoke('computeMatchScores', {});
      const scores = await base44.entities.MatchScore.filter({ edvestor_email: user?.email });
      setMatchScores(scores);
    } catch (e) {}
    setComputing(false);
  };

  const topMatches = matchScores.filter(m => m.score >= 70).sort((a, b) => b.score - a.score).slice(0, 5);
  const pendingMatches = tutorStudents.filter(s => s.status === 'pending' || s.status === 'matching');

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-white/50" />
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
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
        {/* Match Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MATCH_CATEGORIES.map(({ key, label, desc, path, color, text }) => (
            <Link key={key} to={path} className={`${color} rounded-2xl p-5 hover:opacity-90 transition-all`}>
              <Target className={`w-5 h-5 ${text} mb-3 opacity-60`} />
              <p className={`font-black text-sm ${text}`}>{label}</p>
              <p className={`text-xs ${text} opacity-50 mt-0.5`}>{desc}</p>
              <div className={`flex items-center gap-1 mt-3 ${text} text-xs font-bold opacity-70`}>
                View <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top edVestor Matches */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-[#0a0f1e]">Top Capital Matches</h2>
              <Link to="/matched-opportunities" className="text-xs font-black text-[#0a0f1e] flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            {topMatches.length === 0 ? (
              <div className="py-12 text-center">
                <Zap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-semibold">No matches yet.</p>
                <Button onClick={handleRecompute} disabled={computing} className="mt-4 bg-[#0a0f1e] text-white font-bold text-sm">
                  {computing ? 'Computing...' : 'Run AI Matching'}
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {topMatches.map(m => (
                  <div key={m.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-black text-[#0a0f1e] text-sm">{m.deal_title}</p>
                      <p className="text-xs text-gray-400">{m.founder_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${m.score >= 85 ? 'bg-green-100 text-green-700' : m.score >= 70 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {m.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TwotrX Pending Matches */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-[#0a0f1e]">TwotrX Pending Matches</h2>
              <Link to="/twotrx/students" className="text-xs font-black text-[#0a0f1e] flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            {pendingMatches.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-semibold">No pending student matches.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingMatches.slice(0, 5).map(s => (
                  <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-black text-[#0a0f1e] text-sm">{s.student_name}</p>
                      <p className="text-xs text-gray-400">Grade {s.grade} · {s.subject_needed}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full capitalize">{s.urgency}</span>
                      <Link to="/twotrx/tutors">
                        <Button size="sm" className="bg-[#0a0f1e] text-white font-bold h-7 text-xs gap-1">Match <ArrowRight className="w-3 h-3" /></Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Job Posts needing candidates */}
        {jobMatches.filter(j => j.status === 'active').length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="font-black text-[#0a0f1e]">OneJob — Active Posts Seeking Talent</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {jobMatches.filter(j => j.status === 'active').map(j => (
                <div key={j.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-black text-[#0a0f1e] text-sm">{j.job_title}</p>
                    <p className="text-xs text-gray-400">{j.organization_name} · {j.applicants_count || 0} applicants</p>
                  </div>
                  <Link to="/onejob/jobs">
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1">View Applicants <ArrowRight className="w-3 h-3" /></Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}