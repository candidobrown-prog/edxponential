import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { CalendarDays, DollarSign, Users, ClipboardList, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TutorDashboard() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [profiles, reqs, sess] = await Promise.all([
        base44.entities.TutorProfile.filter({ user_email: u.email }),
        base44.entities.TutorRequest.filter({ tutor_email: u.email }),
        base44.entities.TutoringSession.filter({ tutor_email: u.email }),
      ]);
      setProfile(profiles[0] || null);
      setRequests(reqs);
      setSessions(sess);
    }).finally(() => setLoading(false));
  }, []);

  const pendingRequests = requests.filter(r => r.tutor_response === 'pending');
  const upcomingSessions = sessions.filter(s => s.session_status === 'scheduled' || s.session_status === 'confirmed');
  const completedSessions = sessions.filter(s => s.session_status === 'completed');
  const totalEarnings = completedSessions.reduce((sum, s) => sum + (s.tutor_payout || 0), 0);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#059669]/30 border-t-[#059669] rounded-full animate-spin" /></div>;

  if (!profile) return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <div className="w-20 h-20 bg-[#ecfdf5] rounded-full flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="w-10 h-10 text-[#059669]" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Application</h2>
      <p className="text-slate-500 mb-6">You don't have a tutor profile yet. Apply to join TwotrX and start supporting students.</p>
      <Link to="/twotrx/apply"><Button className="bg-[#059669] hover:bg-[#047857] text-white">Apply as Tutor</Button></Link>
    </div>
  );

  const statusColors = { pending_review: 'amber', approved: 'green', rejected: 'red', paused: 'slate' };
  const sc = statusColors[profile.status] || 'slate';

  const stats = [
    { label: 'Pending Requests', value: pendingRequests.length, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Upcoming Sessions', value: upcomingSessions.length, icon: CalendarDays, color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
    { label: 'Sessions Completed', value: completedSessions.length, icon: CheckCircle, color: 'text-[#0891b2]', bg: 'bg-[#ecfeff]' },
    { label: 'Total Earned', value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {profile.full_name}</h1>
          <p className="text-slate-500 mt-1">Manage your sessions, requests, and student progress.</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-${sc}-100 text-${sc}-700 border border-${sc}-200`}>
          {profile.status?.replace('_', ' ')}
        </div>
      </div>

      {/* Profile Pending Banner */}
      {profile.status === 'pending_review' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
          <Clock className="w-8 h-8 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Application Under Review</p>
            <p className="text-amber-700 text-sm mt-0.5">The TwotrX team is reviewing your application. You'll be notified via email once approved.</p>
          </div>
        </div>
      )}

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

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Incoming Support Requests</h2>
            <Link to="/twotrx/requests" className="text-sm text-[#059669] font-medium flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingRequests.slice(0, 3).map(r => (
              <div key={r.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{r.student_name}</p>
                  <p className="text-xs text-slate-500">Grade {r.grade} · {r.subject} · {r.session_type?.replace('_', '-')}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-[#059669] hover:bg-[#047857] text-white h-8 text-xs">Accept</Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs">Decline</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Upcoming Sessions</h2>
          <Link to="/twotrx/calendar" className="text-sm text-[#059669] font-medium flex items-center gap-1">Calendar <ArrowRight className="w-3 h-3" /></Link>
        </div>
        {upcomingSessions.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">No upcoming sessions scheduled.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {upcomingSessions.slice(0, 5).map(s => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-[#059669]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{s.student_name}</p>
                    <p className="text-xs text-slate-500">{s.session_date} · {s.start_time} · {s.subject}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#059669] bg-[#ecfdf5] px-2.5 py-1 rounded-full capitalize">{s.session_type?.replace('_', '-')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}