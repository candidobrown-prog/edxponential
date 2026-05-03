import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, MessageSquare, UserCheck, BookOpen } from 'lucide-react';

export default function TutorRequests() {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async u => {
      const [profiles, reqs] = await Promise.all([
        base44.entities.TutorProfile.filter({ user_email: u.email }),
        base44.entities.TutorRequest.list('-created_date', 50),
      ]);
      const profile = profiles[0];
      if (profile) {
        const myReqs = reqs.filter(r => r.tutor_id === profile.id);
        setRequests(myReqs);
        const studentIds = [...new Set(myReqs.map(r => r.student_id))];
        const studentsData = await Promise.all(studentIds.map(id =>
          base44.entities.TutoringStudent.list('-created_date', 200).then(all => all.find(s => s.id === id))
        ));
        const map = {};
        studentsData.forEach(s => s && (map[s.id] = s));
        setStudents(map);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleResponse = async (reqId, response) => {
    await base44.entities.TutorRequest.update(reqId, { tutor_response: response, status: response === 'accepted' ? 'accepted' : response === 'declined' ? 'declined' : 'pending' });
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, tutor_response: response } : r));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#059669]/30 border-t-[#059669] rounded-full animate-spin" /></div>;

  const pending = requests.filter(r => r.tutor_response === 'pending');
  const responded = requests.filter(r => r.tutor_response !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Support Requests</h1>
        <p className="text-slate-500 mt-1">Review student needs and accept or decline tutoring requests.</p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Pending Review ({pending.length})</h2>
          {pending.map(r => {
            const student = students[r.student_id];
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-[#f8f9fb] px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Learning Support Request</p>
                    <p className="text-xs text-slate-500 mt-0.5">from {r.requested_by_type === 'school' ? 'School' : 'Parent'}</p>
                  </div>
                  <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Pending Review</span>
                </div>
                <div className="px-6 py-5">
                  <div className="grid md:grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Student Profile</p>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Student</span><span className="font-medium text-slate-800">{r.student_name}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Grade</span><span className="font-medium text-slate-800">{r.grade}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Subject</span><span className="font-medium text-slate-800">{r.subject}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Session Type</span><span className="font-medium text-slate-800 capitalize">{r.session_type?.replace('_', '-')}</span></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Details</p>
                      <div className="space-y-1.5 text-sm">
                        {student && <>
                          {student.learning_gaps && <div><span className="text-slate-500">Learning Gaps: </span><span className="text-slate-700">{student.learning_gaps}</span></div>}
                          {student.goals && <div><span className="text-slate-500">Goals: </span><span className="text-slate-700">{student.goals}</span></div>}
                        </>}
                        {r.preferred_schedule && <div><span className="text-slate-500">Schedule: </span><span className="text-slate-700">{r.preferred_schedule}</span></div>}
                        {r.message && <div><span className="text-slate-500">Message: </span><span className="text-slate-700">{r.message}</span></div>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <Button size="sm" className="bg-[#059669] hover:bg-[#047857] text-white gap-1.5" onClick={() => handleResponse(r.id, 'accepted')}>
                      <CheckCircle className="w-3.5 h-3.5" /> Accept Request
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-slate-600" onClick={() => handleResponse(r.id, 'more_info')}>
                      <MessageSquare className="w-3.5 h-3.5" /> Request More Info
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleResponse(r.id, 'declined')}>
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Responded */}
      {responded.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Previous Responses</h2>
          {responded.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{r.student_name}</p>
                <p className="text-xs text-slate-500">Grade {r.grade} · {r.subject}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${r.tutor_response === 'accepted' ? 'bg-green-100 text-green-700' : r.tutor_response === 'declined' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {r.tutor_response?.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {requests.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No tutoring requests yet.</p>
          <p className="text-slate-400 text-sm mt-1">Once your profile is approved, requests will appear here.</p>
        </div>
      )}
    </div>
  );
}