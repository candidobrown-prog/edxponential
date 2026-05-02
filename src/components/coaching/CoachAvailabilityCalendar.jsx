import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns';

// Generate deterministic but realistic-looking availability for a coach
// based on their coach id so it's stable across renders
function generateAvailability(coachId, month) {
  const slots = {};
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // seed from coachId chars
  const seed = (coachId || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  days.forEach((day, idx) => {
    const dayOfWeek = day.getDay();
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) return;
    // Skip past days
    if (isBefore(day, startOfDay(new Date()))) return;

    // Pseudo-random availability based on seed + index
    const rand = (seed + idx * 37) % 10;
    if (rand < 3) return; // ~30% of weekdays fully blocked

    const available = times.filter((_, ti) => ((seed + idx + ti * 13) % 5) !== 0);
    if (available.length > 0) {
      slots[format(day, 'yyyy-MM-dd')] = available;
    }
  });

  return slots;
}

export default function CoachAvailabilityCalendar({ coachId, onSelectSlot }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const availability = useMemo(
    () => generateAvailability(coachId, currentMonth),
    [coachId, currentMonth]
  );

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleDayClick = (day) => {
    const key = format(day, 'yyyy-MM-dd');
    if (!availability[key]) return;
    setSelectedDate(day);
    setSelectedTime(null);
    onSelectSlot(null);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    onSelectSlot({ date: format(selectedDate, 'yyyy-MM-dd'), time });
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-6">
      <h2 className="font-heading text-lg font-semibold">Availability</h2>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setCurrentMonth(m => subMonths(m, 1)); setSelectedDate(null); setSelectedTime(null); }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-semibold text-sm">{format(currentMonth, 'MMMM yyyy')}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setCurrentMonth(m => addMonths(m, 1)); setSelectedDate(null); setSelectedTime(null); }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground font-medium mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const isAvailable = !!availability[key];
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPast = isBefore(day, startOfDay(new Date()));
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={key}
              disabled={!isAvailable || isPast}
              onClick={() => handleDayClick(day)}
              className={cn(
                'relative h-9 w-full rounded-lg text-sm transition-colors flex items-center justify-center',
                !inMonth && 'opacity-0 pointer-events-none',
                isPast && 'text-muted-foreground/30 cursor-not-allowed',
                isAvailable && !isPast && !isSelected && 'bg-accent/60 text-accent-foreground hover:bg-primary/20 cursor-pointer font-medium',
                isSelected && 'bg-primary text-primary-foreground font-semibold',
                !isAvailable && inMonth && !isPast && 'text-muted-foreground/50 cursor-not-allowed',
                isToday(day) && !isSelected && 'ring-2 ring-secondary ring-offset-1',
              )}
            >
              {format(day, 'd')}
              {isAvailable && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {selectedDate && availability[format(selectedDate, 'yyyy-MM-dd')] && (
        <div className="pt-4 border-t border-border/50 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Available times on <span className="text-foreground">{format(selectedDate, 'MMMM d')}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {availability[format(selectedDate, 'yyyy-MM-dd')].map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm border transition-colors',
                  selectedTime === time
                    ? 'bg-primary text-primary-foreground border-primary font-medium'
                    : 'border-border/70 bg-accent/30 hover:bg-primary/10 hover:border-primary/40'
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-accent/60 inline-block" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" /> Open slot</span>
      </div>
    </div>
  );
}