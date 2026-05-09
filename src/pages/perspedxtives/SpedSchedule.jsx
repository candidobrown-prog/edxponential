import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, Brain, Sparkles, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM'];

const COLORS = {
  speech_language: 'bg-blue-100 text-blue-800 border-blue-200',
  occupational_therapy: 'bg-purple-100 text-purple-800 border-purple-200',
  physical_therapy: 'bg-green-100 text-green-800 border-green-200',
  specialized_instruction: 'bg-gray-900 text-white border-gray-900',
  counseling: 'bg-pink-100 text-pink-800 border-pink-200',
  reading_intervention: 'bg-amber-100 text-amber-800 border-amber-200',
  math_intervention: 'bg-orange-100 text-orange-800 border-orange-200',
  behavioral_intervention: 'bg-red-100 text-red-800 border-red-200',
};

export default function SpedSchedule() {
  const [showAIGen, setShowAIGen] = useState(false);
  const [schedulePrompt, setSchedulePrompt] = useState('');
  const [generatedSchedule, setGeneratedSchedule] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: services = [] } = useQuery({
    queryKey: ['sped-services'],
    queryFn: () => base44.entities.SpedService.list('-created_date', 200),
  });

  const generateSchedule = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Special Education scheduling expert. Generate a detailed master Special Education service schedule for the following school context:

${schedulePrompt}

Also include these existing services:
${services.slice(0, 10).map(s => `- ${s.student_name}: ${s.service_type?.replace(/_/g, ' ')} (${s.required_minutes_weekly} min/week, ${s.delivery_model?.replace(/_/g, ' ')}, provider: ${s.provider_name})`).join('\n')}

Create a comprehensive weekly schedule that:
1. Ensures all required service minutes are met
2. Avoids scheduling conflicts for students
3. Groups students for efficiency where appropriate
4. Protects core instructional time (reading/math blocks)
5. Considers provider capacity and travel time
6. Flags any scheduling conflicts or compliance risks

Format as a daily schedule by provider, then by student, showing times and locations.`,
    });
    setGeneratedSchedule(result);
    setGenerating(false);
  };

  // Build calendar data from services
  const calendarEvents = services.filter(s => s.schedule_days?.length > 0 && s.schedule_time).flatMap(s =>
    (s.schedule_days || []).map(day => ({
      day, time: s.schedule_time, student: s.student_name,
      service: s.service_type, provider: s.provider_name,
      model: s.delivery_model, minutes: s.minutes_per_session,
    }))
  );

  // Group events by day
  const eventsByDay = DAYS.reduce((acc, day) => {
    acc[day] = calendarEvents.filter(e => e.day === day);
    return acc;
  }, {});

  const totalScheduled = services.filter(s => s.schedule_days?.length > 0).length;
  const unscheduled = services.filter(s => !s.schedule_days?.length).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Master Special Education Schedule</h1>
          <p className="text-gray-400 text-sm mt-1">AI-powered service scheduling engine</p>
        </div>
        <Button onClick={() => setShowAIGen(true)} className="bg-black text-white rounded-xl font-black gap-2">
          <Sparkles className="w-4 h-4" /> AI Schedule Builder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Services', value: services.length, color: 'bg-black text-white' },
          { label: 'Scheduled', value: totalScheduled, color: 'bg-emerald-50 border border-emerald-100' },
          { label: 'Unscheduled', value: unscheduled, color: unscheduled > 0 ? 'bg-amber-50 border border-amber-100' : 'bg-white border border-gray-100' },
          { label: 'Providers', value: new Set(services.map(s => s.provider_name).filter(Boolean)).size, color: 'bg-white border border-gray-100' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-2xl p-4`}>
            <div className={`text-2xl font-black ${color.includes('text-white') ? 'text-white' : 'text-black'}`}>{value}</div>
            <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${color.includes('text-white') ? 'text-white/60' : 'text-gray-400'}`}>{label}</div>
          </div>
        ))}
      </div>

      {unscheduled > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm text-amber-800">{unscheduled} services have no schedule assigned</p>
            <p className="text-xs text-amber-600">Use the AI Schedule Builder to generate an optimized weekly schedule</p>
          </div>
        </div>
      )}

      {/* Weekly Calendar Grid */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-6">
        <div className="grid grid-cols-6 border-b border-gray-100">
          <div className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">Time</div>
          {DAYS.map(d => (
            <div key={d} className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider border-l border-gray-100">
              {d}
            </div>
          ))}
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {TIME_SLOTS.map(time => (
            <div key={time} className="grid grid-cols-6 border-b border-gray-50 min-h-[40px]">
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 flex items-center">{time}</div>
              {DAYS.map(day => {
                const events = (eventsByDay[day] || []).filter(e => e.time === time);
                return (
                  <div key={day} className="px-1 py-1 border-l border-gray-50 space-y-1">
                    {events.map((ev, i) => (
                      <div key={i} className={`text-[9px] font-bold px-2 py-1 rounded-lg border ${COLORS[ev.service] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        <div className="truncate">{ev.student}</div>
                        <div className="opacity-70 truncate">{ev.service?.replace(/_/g, ' ').slice(0, 12)}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Provider Summary */}
      <div>
        <h2 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-3">Provider Caseloads</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Set(services.map(s => s.provider_name).filter(Boolean))).map(provider => {
            const providerServices = services.filter(s => s.provider_name === provider);
            const totalMinutes = providerServices.reduce((a, s) => a + (s.required_minutes_weekly || 0), 0);
            return (
              <div key={provider} className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-black/5 rounded-xl flex items-center justify-center">
                    <Users className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-black">{provider}</p>
                    <p className="text-xs text-gray-400">{providerServices.length} students · {totalMinutes} min/week</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {providerServices.slice(0, 3).map(s => (
                    <div key={s.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate">{s.student_name}</span>
                      <span className="text-gray-400 flex-shrink-0 ml-2">{s.required_minutes_weekly || 0} min/wk</span>
                    </div>
                  ))}
                  {providerServices.length > 3 && (
                    <p className="text-[10px] text-gray-400">+{providerServices.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Generator Dialog */}
      <Dialog open={showAIGen} onOpenChange={setShowAIGen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-black text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> AI Schedule Builder
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mt-2">
            Describe your school schedule constraints and PerSpEdxtives™ AI will build an optimized Special Education service schedule.
          </p>
          <textarea value={schedulePrompt} onChange={e => setSchedulePrompt(e.target.value)}
            placeholder="Example: We have 3 special education teachers, 1 speech pathologist, and 1 occupational therapist. School hours are 8am-3pm. Reading and math blocks are 9-10am and 1-2pm (no pull-outs during these times). We have 45 students with IEPs across grades K-5..."
            className="w-full border border-input rounded-xl p-3 text-sm min-h-[120px] resize-y mt-3 focus:outline-none focus:ring-1 focus:ring-ring" />
          <Button onClick={generateSchedule} disabled={!schedulePrompt || generating}
            className="w-full bg-black text-white rounded-xl font-black mt-3 gap-2">
            {generating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Building Schedule...</> : <><Sparkles className="w-4 h-4" /> Generate Master Schedule</>}
          </Button>
          {generatedSchedule && (
            <div className="bg-gray-50 rounded-xl p-4 mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
              {generatedSchedule}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}