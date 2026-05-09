import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Users, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function DashboardCalendar({ user }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch coaching sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ['calendar-sessions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.CoachingSession.filter({
        participant_email: user.email
      }) || [];
    },
    enabled: !!user?.email,
  });

  // Fetch community events
  const { data: events = [] } = useQuery({
    queryKey: ['calendar-events', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      // Fetch communities user is member of
      const memberships = await base44.entities.CommunityMember.filter({
        member_email: user.email
      });
      
      if (!memberships || memberships.length === 0) return [];
      
      const communityIds = memberships.map(m => m.community_id);
      // In a real app, you'd have an events entity linked to communities
      return [];
    },
    enabled: !!user?.email,
  });

  // Get all days in month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Filter sessions for current month
  const sessionsByDate = {};
  sessions.forEach(session => {
    if (session.scheduled_date) {
      const dateKey = format(new Date(session.scheduled_date), 'yyyy-MM-dd');
      if (!sessionsByDate[dateKey]) {
        sessionsByDate[dateKey] = [];
      }
      sessionsByDate[dateKey].push({
        ...session,
        type: 'session',
        time: session.scheduled_time || '10:00 AM'
      });
    }
  });

  events.forEach(event => {
    if (event.date) {
      const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
      if (!sessionsByDate[dateKey]) {
        sessionsByDate[dateKey] = [];
      }
      sessionsByDate[dateKey].push({
        ...event,
        type: 'event'
      });
    }
  });

  const hasEvents = Object.keys(sessionsByDate).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="title font-semibold text-black flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Your Calendar
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <span className="text-sm font-semibold min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center py-2 label text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-6">
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEvents = sessionsByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -2 }}
                className={`p-2 rounded-lg min-h-[100px] border transition-all ${
                  isToday
                    ? 'border-primary bg-primary/5'
                    : dayEvents.length > 0
                    ? 'border-primary/20 bg-primary/3'
                    : 'border-border'
                } ${!isCurrentMonth ? 'opacity-30 bg-muted/20' : ''}`}
              >
                <div className="text-xs font-bold text-muted-foreground mb-2">
                  {format(day, 'd')}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event, i) => (
                    <div
                      key={i}
                      className={`text-[10px] font-semibold px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
                        event.type === 'session'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-accent/20 text-accent'
                      }`}
                      title={event.title || event.session_title}
                    >
                      {event.type === 'session' ? '📅' : '👥'} {event.title || event.session_title || 'Event'}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-muted-foreground px-2 py-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upcoming events list */}
      {hasEvents && (
        <div className="border-t border-border p-6 bg-surface/50">
          <h3 className="subtitle font-semibold text-black mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {Object.entries(sessionsByDate)
              .filter(([_, events]) => new Date(events[0]?.scheduled_date || events[0]?.date) >= new Date())
              .sort((a, b) => new Date(a[1][0]?.scheduled_date || a[1][0]?.date) - new Date(b[1][0]?.scheduled_date || b[1][0]?.date))
              .slice(0, 4)
              .map(([dateKey, events]) => (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-card border border-border/50 hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="caption text-muted-foreground mb-1">
                        {format(new Date(dateKey), 'MMM d, yyyy')}
                      </p>
                      {events.map((event, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                          {event.type === 'session' ? (
                            <>
                              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                              <div>
                                <p className="body-xs font-semibold text-black">
                                  {event.session_title || 'Coaching Session'}
                                </p>
                                <p className="body-xs text-muted-foreground">
                                  {event.time} • with {event.coach_name}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Users className="w-4 h-4 text-accent flex-shrink-0" />
                              <div>
                                <p className="body-xs font-semibold text-black">{event.title}</p>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasEvents && (
        <div className="p-12 text-center border-t border-border">
          <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="body-sm text-muted-foreground">
            No upcoming sessions or events. Schedule a coaching session or join a community to see them here.
          </p>
        </div>
      )}
    </motion.div>
  );
}