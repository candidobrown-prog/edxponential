import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Users, AlertCircle } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];

export default function SpedSchedule() {
  const { data: services = [] } = useQuery({
    queryKey: ['sped-services'],
    queryFn: () => base44.entities.SpedService.list('-created_date', 200),
  });

  const scheduledServices = services.filter(s => s.schedule_days?.length > 0);
  const unscheduled = services.filter(s => !s.schedule_days?.length);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-black">Service Schedule</h1>
        <p className="text-gray-400 text-sm mt-0.5">{scheduledServices.length} services scheduled · {unscheduled.length} unscheduled</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#020205] text-white rounded-2xl p-5">
          <p className="text-white/40 text-xs font-black uppercase tracking-wider mb-2">Total Services</p>
          <p className="text-3xl font-black">{services.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Scheduled</p>
          <p className="text-3xl font-black text-black">{scheduledServices.length}</p>
        </div>
        <div className={`rounded-2xl p-5 ${unscheduled.length > 0 ? 'bg-amber-50 border border-amber-100' : 'bg-white border border-gray-100'}`}>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Needs Scheduling</p>
          <p className={`text-3xl font-black ${unscheduled.length > 0 ? 'text-amber-700' : 'text-black'}`}>{unscheduled.length}</p>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-6">
        <div className="grid grid-cols-6 border-b border-gray-100">
          <div className="p-3 bg-gray-50 border-r border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Time</p>
          </div>
          {DAYS.map(day => (
            <div key={day} className="p-3 bg-gray-50 border-r border-gray-100 last:border-r-0">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-wider">{day}</p>
            </div>
          ))}
        </div>
        {TIMES.map(time => (
          <div key={time} className="grid grid-cols-6 border-b border-gray-50 last:border-b-0">
            <div className="p-3 border-r border-gray-100 flex items-center">
              <p className="text-[10px] text-gray-400 font-bold">{time}</p>
            </div>
            {DAYS.map(day => {
              const slotServices = scheduledServices.filter(s =>
                s.schedule_days?.includes(day) && s.schedule_time === time
              );
              return (
                <div key={day} className="p-1 border-r border-gray-50 last:border-r-0 min-h-[48px]">
                  {slotServices.map(s => (
                    <div key={s.id} className="bg-black text-white rounded-lg px-2 py-1 mb-1">
                      <p className="text-[9px] font-black truncate">{s.student_name}</p>
                      <p className="text-[8px] text-white/50 truncate">{s.service_type?.replace(/_/g, ' ')}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Unscheduled Services */}
      {unscheduled.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <p className="font-black text-sm text-black">Services Needing Scheduling</p>
          </div>
          <div className="space-y-2">
            {unscheduled.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-black">{s.student_name}</p>
                  <p className="text-xs text-gray-500">{s.service_type?.replace(/_/g, ' ')} · {s.required_minutes_weekly || 0} min/week · {s.provider_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-black text-black mb-1">No services to schedule</p>
          <p className="text-gray-400 text-sm">Add services in the Service Delivery section to manage scheduling.</p>
        </div>
      )}
    </div>
  );
}