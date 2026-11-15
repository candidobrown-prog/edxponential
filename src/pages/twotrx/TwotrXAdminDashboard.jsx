import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Users, GraduationCap, CalendarDays, DollarSign, CheckCircle, Clock, XCircle, ArrowRight, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TwotrXAdminDashboard() {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.TutorProfile.list('-created_date', 200),
      base44.entities.TutoringStudent.list('-created_date', 200),
      base44.entities.TutoringSession.list('-created_date', 200),
    ]).then(([t, s, sess]) => { setTutors(t); setStudents(s); setSessions(sess); }).finally(() => setLoading(false));
  }, []);

  const pendingTutors = tutors.filter(t => t.status === 'pending_review');
  const approvedTutors = tutors.filter(t => t.status === 'approved');
  const activeStudents = students.filter(s => s.status === 'active' || s.status === 'matched');
  const completedSessions = sessions.filter(s => s.session_status === 'completed');
  const totalRevenue = completedSessions.reduce((sum, s) => sum + (s.session_cost || 0), 0);

  const stats = [
    { label: 'Tutor Applications', value: pendingTutors.length, sub: 'Pending Review', icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Tutors', value: approvedTutors.length, sub: 'Approved', icon: CheckCircle, color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
    { label: 'Students Enrolled', value: activeStudents.length, sub: 'Active students', icon: Users, color: 'text-[#4f46e5]', bg: 'bg-[#eef2ff]' },
    { label: 'Sessions Completed', value: completedSessions.length, sub: 'All time', icon: CalendarDays, color: 'text-[#0891b2]', bg: 'bg-[#ecfeff]' },
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'Platform earnings', icon: DollarSign, color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
    { label: 'Student Referrals', value: students.filter(s => s.status === 'pending').length, sub: 'Awaiting match', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const handleTutorAction = async (tutorId, status) => {
    await base44.entities.TutorProfile.update(tutorId, { status });
    setTutors(prev => prev.map(t => t.id === tutorId ? { ...t, status } : t));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-[#4f46e5]" />
            <span className="text-xs font-bold text-[#4f46e5] uppercase tracking-widest">Admin</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">TwotrX Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage tutors, students, sessions, and platform health.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">{label}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Pending Tutor Applications */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Tutor Applications</h2>
            <p className="text-xs text-slate-400 mt-0.5">{pendingTutors.length} pending review</p>
          </div>
          <Link to="/twotrx/admin/tutors" className="text-sm text-[#4f46e5] font-medium flex items-center gap-1">Manage all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        {pendingTutors.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">No pending tutor applications.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {pendingTutors.slice(0, 5).map(t => (
              <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#eef2ff] flex items-center justify-center">
                    <span className="text-[#4f46e5] font-bold text-sm">{t.full_name?.[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.full_name}</p>
                    <p className="text-xs text-slate-500">{t.subjects?.slice(0, 3).join(', ')} · {t.years_experience || 0} yrs exp · {t.city}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-[#059669] hover:bg-[#047857] text-white h-8 text-xs gap-1" onClick={() => handleTutorAction(t.id, 'approved')}>
                    <CheckCircle className="w-3 h-3" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleTutorAction(t.id, 'rejected')}>
                    <XCircle className="w-3 h-3" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Student Referrals */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Student Referrals</h2>
          <Link to="/twotrx/admin/referrals" className="text-sm text-[#4f46e5] font-medium flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        {students.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">No student referrals yet.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {students.slice(0, 5).map(s => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{s.student_name}</p>
                  <p className="text-xs text-slate-500">Grade {s.grade} · {s.subject_needed} · {s.school_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    s.status === 'active' ? 'bg-green-100 text-green-700' :
                    s.status === 'matched' ? 'bg-blue-100 text-blue-700' :
                    s.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{s.urgency === 'urgent' ? 'URGENT' : s.status?.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}