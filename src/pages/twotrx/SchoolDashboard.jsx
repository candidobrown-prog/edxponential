import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ClipboardList, Users, CalendarDays, ArrowRight, TrendingUp, BookOpen, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SchoolDashboard() {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      return Promise.all([
        base44.entities.TutoringStudent.filter({ referred_by_email: u.email }),
        base44.entities.TutoringSession.filter({ booked_by_email: u.email })
      ]);
    }).then(([s, sess]) => {
      setStudents(s);
      setSessions(sess);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Students Referred', value: students.length, icon: Users, color: 'text-[#4f46e5]', bg: 'bg-[#eef2ff]' },
    { label: 'Active Sessions', value: sessions.filter(s => s.session_status === 'confirmed' || s.session_status === 'scheduled').length, icon: CalendarDays, color: 'text-[#0891b2]', bg: 'bg-[#ecfeff]' },
    { label: 'Pending Matches', value: students.filter(s => s.status === 'pending' || s.status === 'matching').length, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed Sessions', value: sessions.filter(s => s.session_status === 'completed').length, icon: TrendingUp, color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
  ];

  const urgent = students.filter(s => s.urgency === 'urgent' || s.urgency === 'high');

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Intervention Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage student support referrals and track progress.</p>
        </div>
        <Link to="/twotrx/refer-student">
          <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white gap-2">
            <ClipboardList className="w-4 h-4" />
            Refer a Student
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Urgent Alerts */}
      {urgent.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <p className="font-semibold text-amber-800">{urgent.length} Student{urgent.length > 1 ? 's' : ''} Need Urgent Support</p>
          </div>
          <div className="space-y-2">
            {urgent.slice(0, 3).map(s => (
              <div key={s.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-amber-100">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{s.student_name}</p>
                  <p className="text-xs text-slate-500">Grade {s.grade} · {s.subject_needed}</p>
                </div>
                <span className="text-xs font-bold text-amber-600 uppercase bg-amber-100 px-2 py-0.5 rounded-full">{s.urgency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Referrals */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Student Referrals</h2>
          <Link to="/twotrx/students" className="text-sm text-[#4f46e5] font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {students.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No students referred yet.</p>
            <Link to="/twotrx/refer-student">
              <Button className="mt-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm">Refer Your First Student</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {students.slice(0, 5).map(s => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#eef2ff] flex items-center justify-center">
                    <span className="text-[#4f46e5] font-bold text-sm">{s.student_name?.[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{s.student_name}</p>
                    <p className="text-xs text-slate-500">Grade {s.grade} · {s.subject_needed}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  s.status === 'active' ? 'bg-green-100 text-green-700' :
                  s.status === 'matched' ? 'bg-blue-100 text-blue-700' :
                  s.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                } capitalize`}>{s.status?.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}