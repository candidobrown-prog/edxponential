import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Bell, FileText, CheckCircle, AlertTriangle, Send, Shield, Eye, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function GraiedxFamily() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyStudent, setNotifyStudent] = useState(null);
  const [sending, setSending] = useState(false);
  const [notifyForm, setNotifyForm] = useState({ subject: '', message: '', type: 'general' });

  const { data: students = [] } = useQuery({ queryKey: ['gx-students-all'], queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 500) });
  const { data: reports = [] } = useQuery({ queryKey: ['gx-reports'], queryFn: () => base44.entities.GraiedxReport.filter({ published: true }, '-created_date', 100) });
  const { data: alerts = [] } = useQuery({ queryKey: ['gx-alerts-all'], queryFn: () => base44.entities.GraiedxAlert.list('-created_date', 100) });

  const studentsWithEmail = students.filter(s => s.parent_email);
  const notNotified = students.filter(s => s.parent_email && !s.parent_notified).length;
  const publishedReports = reports.length;

  const sendNotification = async () => {
    if (!notifyStudent?.parent_email) return;
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: notifyStudent.parent_email,
      subject: `[Graiedx™] ${notifyForm.subject || `Update for ${notifyStudent.student_name}`}`,
      body: `Dear ${notifyStudent.parent_name || 'Parent/Guardian'},\n\n${notifyForm.message}\n\nStudent: ${notifyStudent.student_name}\nCurrent Average: ${notifyStudent.current_average || 'N/A'}%\nMissing Assignments: ${notifyStudent.missing_assignments || 0}\n\nThis message was sent via Graiedx™ Academic Management System.\n\nBest regards,\nYour School Team`,
    });
    await base44.entities.GraiedxStudent.update(notifyStudent.id, { parent_notified: true });
    setSending(false);
    setShowNotify(false);
    setNotifyForm({ subject: '', message: '', type: 'general' });
  };

  const sendBulkAlerts = async () => {
    setSending(true);
    const atRisk = students.filter(s => s.parent_email && ((s.current_average || 0) < 70 || (s.missing_assignments || 0) >= 2));
    for (const s of atRisk.slice(0, 20)) {
      await base44.integrations.Core.SendEmail({
        to: s.parent_email,
        subject: `[Academic Alert] ${s.student_name} Needs Attention`,
        body: `Dear ${s.parent_name || 'Parent/Guardian'},\n\nThis is an automated academic alert from Graiedx™.\n\nStudent: ${s.student_name}\nCurrent Average: ${s.current_average || 'N/A'}%\nMissing Assignments: ${s.missing_assignments || 0}\n\nPlease contact the school to discuss how we can support ${s.student_name}'s academic progress.\n\nBest regards,\nSchool Academic Team`,
      });
    }
    setSending(false);
    alert(`Alerts sent to ${atRisk.slice(0, 20).length} families.`);
  };

  const NOTIFY_TYPES = [
    { value: 'general', label: 'General Update' },
    { value: 'missing_work', label: 'Missing Work Alert' },
    { value: 'grade_concern', label: 'Grade Concern' },
    { value: 'progress_report', label: 'Progress Report Available' },
    { value: 'achievement', label: 'Academic Achievement' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Family Portal & Communication</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage parent access, notifications, and family communication</p>
        </div>
        <Button onClick={sendBulkAlerts} disabled={sending} className="bg-black text-white rounded-xl font-black gap-2 text-xs">
          <Bell className="w-3.5 h-3.5" /> {sending ? 'Sending...' : 'Send Bulk Alerts'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Students w/ Parent Email', value: studentsWithEmail.length, color: 'text-black' },
          { label: 'Awaiting Notification', value: notNotified, color: notNotified > 0 ? 'text-amber-600' : 'text-emerald-600' },
          { label: 'Published Reports', value: publishedReports, color: 'text-emerald-600' },
          { label: 'Open Academic Alerts', value: alerts.filter(a => !a.resolved).length, color: alerts.filter(a => !a.resolved).length > 0 ? 'text-red-600' : 'text-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Students with Family Info */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <p className="font-black text-sm text-black">Family Contacts & Communication Status</p>
          <span className="text-xs text-gray-400">{studentsWithEmail.length} students with parent email</span>
        </div>
        {studentsWithEmail.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 font-bold text-sm">No family contact info yet</p>
            <p className="text-gray-300 text-xs mt-1">Add parent emails when creating students in the Gradebook</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {['Student', 'Parent/Guardian', 'Contact', 'Grade', 'Missing', 'Notified', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentsWithEmail.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[9px] font-black">{s.student_name[0]}</span>
                      </div>
                      <p className="font-bold text-sm text-black">{s.student_name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-600">{s.parent_name || '—'}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{s.parent_email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-black ${(s.current_average || 0) >= 70 ? 'text-black' : 'text-red-600'}`}>
                      {s.current_average || 0}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {(s.missing_assignments || 0) > 0 ? (
                      <span className="text-xs font-black text-red-600">{s.missing_assignments}</span>
                    ) : <span className="text-xs text-gray-400">0</span>}
                  </td>
                  <td className="px-5 py-3">
                    {s.parent_notified ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold"><CheckCircle className="w-3 h-3" />Notified</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-bold"><AlertTriangle className="w-3 h-3" />Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Button size="sm" variant="outline" onClick={() => { setNotifyStudent(s); setShowNotify(true); }}
                      className="rounded-lg text-xs font-bold gap-1">
                      <Mail className="w-3 h-3" /> Notify
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Published Reports */}
      {reports.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-4">Published Reports (Family-Visible)</p>
          <div className="grid md:grid-cols-2 gap-3">
            {reports.slice(0, 8).map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-xs text-black">{r.student_name}</p>
                  <p className="text-[10px] text-gray-400">{r.report_type?.replace(/_/g,' ')} · {r.grading_period} · {r.current_average}%</p>
                </div>
                <span className="ml-auto text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Published</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notify Dialog */}
      <Dialog open={showNotify} onOpenChange={setShowNotify}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-black text-xl flex items-center gap-2">
              <Mail className="w-5 h-5" /> Notify Family
            </DialogTitle>
            {notifyStudent && <p className="text-sm text-gray-400">→ {notifyStudent.parent_name || 'Parent'} · {notifyStudent.parent_email}</p>}
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Type</label>
              <Select value={notifyForm.type} onValueChange={v => setNotifyForm(p => ({ ...p, type: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{NOTIFY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Subject</label>
              <Input value={notifyForm.subject} onChange={e => setNotifyForm(p => ({ ...p, subject: e.target.value }))}
                placeholder={`Academic update for ${notifyStudent?.student_name}`} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Message</label>
              <textarea value={notifyForm.message} onChange={e => setNotifyForm(p => ({ ...p, message: e.target.value }))}
                className="w-full border border-input rounded-xl p-3 text-sm min-h-[80px] resize-y focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Write your message to the parent..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowNotify(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={sendNotification} disabled={!notifyForm.message || sending || !notifyStudent?.parent_email}
              className="bg-black text-white rounded-xl font-black gap-2">
              {sending ? 'Sending...' : <><Send className="w-4 h-4" />Send Email</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}