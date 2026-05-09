import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CoachingCalendar({ coachEmail }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    loadSessions();
  }, [currentDate, coachEmail]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const allSessions = await base44.entities.CoachingSession?.filter?.(
        { coach_email: coachEmail, status: 'scheduled' },
        'scheduled_date',
        100
      );
      setSessions(allSessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getSessionsForDay = (day) => {
    const dayStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return sessions.filter(s => s.scheduled_date?.split('T')[0] === dayStr);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center bg-gray-50 font-semibold text-gray-700 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, idx) => {
            const daySessions = day ? getSessionsForDay(day) : [];
            const isToday =
              day &&
              new Date().toDateString() ===
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`min-h-32 p-3 border-r border-b border-gray-200 cursor-pointer transition-colors ${
                  day && !isToday ? 'hover:bg-gray-50' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => day && setSelectedDay(day)}
              >
                {day ? (
                  <div className="h-full flex flex-col">
                    <span
                      className={`text-sm font-semibold mb-2 ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {day}
                    </span>
                    <div className="space-y-1 flex-1">
                      {daySessions.slice(0, 2).map(session => (
                        <motion.div
                          key={session.id}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-xs bg-blue-100 text-blue-700 p-1 rounded truncate font-medium"
                          title={session.title}
                        >
                          {session.title}
                        </motion.div>
                      ))}
                      {daySessions.length > 2 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{daySessions.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay).toLocaleDateString(
                  'default',
                  { weekday: 'long', month: 'long', day: 'numeric' }
                )}
              </h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedDay(null)}>
                Close
              </Button>
            </div>

            {getSessionsForDay(selectedDay).length > 0 ? (
              <div className="space-y-4">
                {getSessionsForDay(selectedDay).map(session => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h4 className="font-bold text-gray-900 mb-2">{session.title}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(session.scheduled_date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {session.executive_name || session.executive_email}
                      </div>
                      {session.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {session.location}
                        </div>
                      )}
                    </div>
                    {session.notes && (
                      <p className="text-xs text-gray-500 mt-3 italic">{session.notes}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No sessions scheduled for this day</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-semibold">This Month</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            {sessions.filter(
              s =>
                new Date(s.scheduled_date).getMonth() === currentDate.getMonth() &&
                new Date(s.scheduled_date).getFullYear() === currentDate.getFullYear()
            ).length}
          </p>
          <p className="text-xs text-blue-600 mt-1">Sessions</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-semibold">This Week</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {sessions.filter(s => {
              const sessionDate = new Date(s.scheduled_date);
              const now = new Date();
              const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              return sessionDate >= now && sessionDate <= nextWeek;
            }).length}
          </p>
          <p className="text-xs text-green-600 mt-1">Upcoming</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-700 font-semibold">Total</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">{sessions.length}</p>
          <p className="text-xs text-purple-600 mt-1">All Sessions</p>
        </motion.div>
      </div>
    </div>
  );
}