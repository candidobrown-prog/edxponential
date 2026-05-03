import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, CalendarDays, TrendingUp, DollarSign, BookOpen, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ParentDashboard() {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [s, sess] = await Promise.all([
        base44.entities.TutoringStudent.filter({ referred_by_email: u.email }),
        base44.entities.TutoringSession.filter({ booked_by_email: u.email }),
      ]);
      setStudents(s);
      setSessions(sess);
    }).finally(() => setLoading(false));
  }, []);

  const upcoming = sessions.filter(s => s.session_status === 'scheduled' || s.session_status === 'confirmed');
  const completed = sessions.filter(s => s.session_status === 'completed');

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#0891b2]/30 border-t-[#0891b2] rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parent Dashboard</h1>
          <p className="text-slate-500 mt-1">Track your student's growth and manage tutoring sessions.</p>
        </div>
        <Link to="/twotrx/tutors">
          <Button className="bg-[#0891b2] hover:bg-[#0e7490] text-white gap-2">
            <Search className="w-4 h-4" /> Find a Tutor
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Students', value: students.length, icon: BookOpen, color: 'text-[#0891b2]', bg: 'bg-[#ecfeff]' },
          { label: 'Upcoming Sessions', value: upcoming.length, icon: CalendarDays, color: 'text-[#4f46e5]', bg: 'bg-[#eef2ff]' },
          { label: 'Sessions Completed', value: completed.length, icon: TrendingUp, color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
          { label: 'Total Invested', value: `$${sessions.reduce((s, r) => s + (r.session_cost || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* CTA if no students */}
      {students.length === 0 && (
        <div className="bg-[#ecfeff] border border-[#0891b2]/20 rounded-2xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-[#0891b2] mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-2">Get Your Student Started</h3>
          <p className="text-slate-600 text-sm mb-5">Browse our network of verified, qualified teacher-tutors and book your first session.</p>
          <Link to="/twotrx/tutors">
            <Button className="bg-[#0891b2] hover:bg-[#0e7490] text-white">Browse Tutors</Button>
          </Link>
        </div>
      )}

      {/* Upcoming Sessions */}
      {upcoming.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Upcoming Sessions</h2>
            <Link to="/twotrx/sessions" className="text-sm text-[#0891b2] font-medium flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {upcoming.slice(0, 4).map(s => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eef2ff] flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-[#4f46e5]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{s.student_name} with {s.tutor_name}</p>
                    <p className="text-xs text-slate-500">{s.session_date} · {s.start_time} · {s.subject}</p>
                  </div>
                </div>
                <span className="text-xs font-medium capitalize text-[#0891b2] bg-[#ecfeff] px-2.5 py-1 rounded-full">{s.session_type?.replace('_', '-')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}