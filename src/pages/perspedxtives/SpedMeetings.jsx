import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Plus, Sparkles, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  rescheduled: 'bg-amber-100 text-amber-700',
};

const MEETING_TYPES = [
  'annual_iep', 'initial_iep', 'reevaluation', 'amendment', 'progress_review',
  'transition_planning', 'manifestation_determination', '504_review', 'team_meeting', 'parent_conference',
];

export default function SpedMeetings() {
  const [showAdd, setShowAdd] = useState(false);
  const [showAgenda, setShowAgenda] = useState(null);
  const [generatingAgenda, setGeneratingAgenda] = useState(false);
  const [form, setForm] = useState({ student_name: '', meeting_type: 'annual_iep', scheduled_date: '', scheduled_time: '', location: '', duration_minutes: 60 });
  const qc = useQueryClient();

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['sped-meetings'],
    queryFn: () => base44.entities.SpedMeeting.list('-scheduled_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: d => base44.entities.SpedMeeting.create({ ...d, student_id: 'manual', status: 'scheduled', parent_invited: true }),
    onSuccess: () => { qc.invalidateQueries(['sped-meetings']); setShowAdd(false); setForm({ student_name: '', meeting_type: 'annual_iep', scheduled_date: '', scheduled_time: '', location: '', duration_minutes: 60 }); },
  });

  const generateAgenda = async (meeting) => {
    setShowAgenda(meeting);
    setGeneratingAgenda(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a professional IDEA-compliant IEP meeting agenda for:
Student: ${meeting.student_name}
Meeting Type: ${meeting.meeting_type?.replace(/_/g, ' ')}
Date: ${meeting.scheduled_date}
Duration: ${meeting.duration_minutes || 60} minutes

Create a structured agenda with time allocations, required IDEA components, and participant roles. Format as a professional meeting agenda.`,
    });
    await base44.entities.SpedMeeting.update(meeting.id, { ai_agenda: result });
    qc.invalidateQueries(['sped-meetings']);
    setGeneratingAgenda(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const upcoming = meetings.filter(m => m.scheduled_date >= today && m.status === 'scheduled');
  const past = meetings.filter(m => m.scheduled_date < today || m.status !== 'scheduled');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Meetings</h1>
          <p className="text-gray-400 text-sm mt-0.5">{upcoming.length} upcoming · {past.length} past</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-black text-white rounded-xl font-black gap-2">
          <Plus className="w-4 h-4" /> Schedule Meeting
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#020205] text-white rounded-2xl p-5">
          <p className="text-white/40 text-xs font-black uppercase tracking-wider mb-2">Upcoming</p>
          <p className="text-3xl font-black">{upcoming.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">This Month</p>
          <p className="text-3xl font-black text-black">{meetings.filter(m => m.scheduled_date?.startsWith(today.substring(0, 7))).length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Completed</p>
          <p className="text-3xl font-black text-emerald-600">{meetings.filter(m => m.status === 'completed').length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-black text-black mb-1">No meetings scheduled</p>
          <p className="text-gray-400 text-sm mb-4">Schedule IEP meetings and generate AI-powered IDEA-compliant agendas.</p>
          <Button onClick={() => setShowAdd(true)} className="bg-black text-white rounded-xl font-black gap-2">
            <Plus className="w-4 h-4" /> Schedule First Meeting
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {[...upcoming, ...past].map(m => (
            <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-black/40" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-sm text-black">{m.student_name}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${STATUS_COLORS[m.status] || 'bg-gray-100 text-gray-600'}`}>{m.status}</span>
                    </div>
                    <p className="text-xs text-gray-500">{m.meeting_type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{m.scheduled_date} {m.scheduled_time && `· ${m.scheduled_time}`} {m.location && `· ${m.location}`}
                    </p>
                    {m.ai_agenda && (
                      <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" />AI Agenda Generated</p>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => generateAgenda(m)} className="rounded-lg text-xs font-bold gap-1 flex-shrink-0">
                  <Sparkles className="w-3 h-3" /> {m.ai_agenda ? 'View Agenda' : 'AI Agenda'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Meeting */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl">Schedule Meeting</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Student Name *</label>
              <Input value={form.student_name} onChange={e => setForm(p => ({ ...p, student_name: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Meeting Type</label>
              <Select value={form.meeting_type} onValueChange={v => setForm(p => ({ ...p, meeting_type: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MEETING_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Date</label>
              <Input type="date" value={form.scheduled_date} onChange={e => setForm(p => ({ ...p, scheduled_date: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Time</label>
              <Input type="time" value={form.scheduled_time} onChange={e => setForm(p => ({ ...p, scheduled_time: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Location</label>
              <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Room / Virtual" className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Duration (min)</label>
              <Input type="number" value={form.duration_minutes} onChange={e => setForm(p => ({ ...p, duration_minutes: parseInt(e.target.value) }))} className="rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.student_name || createMutation.isPending}
              className="bg-black text-white rounded-xl font-black">
              {createMutation.isPending ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Agenda Dialog */}
      <Dialog open={!!showAgenda} onOpenChange={() => { setShowAgenda(null); }}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          {showAgenda && (
            <>
              <DialogHeader>
                <DialogTitle className="font-black text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> AI Meeting Agenda
                </DialogTitle>
                <p className="text-sm text-gray-400">{showAgenda.student_name} · {showAgenda.meeting_type?.replace(/_/g, ' ')}</p>
              </DialogHeader>
              {generatingAgenda ? (
                <div className="flex items-center justify-center py-8 gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  <p className="text-gray-500 text-sm font-bold">Generating IDEA-compliant agenda...</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 mt-2">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {showAgenda.ai_agenda || meetings.find(m => m.id === showAgenda.id)?.ai_agenda}
                  </p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}