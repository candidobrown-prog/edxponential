import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, Trash2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export default function AvailabilityManager({ coachEmail }) {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, [coachEmail]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      // Initialize with default availability (9am-6pm, all weekdays)
      const defaultAvailability = DAYS_OF_WEEK.reduce((acc, day, idx) => {
        if (idx < 5) {
          acc[day] = { enabled: true, startTime: '09:00', endTime: '18:00' };
        } else {
          acc[day] = { enabled: false, startTime: '09:00', endTime: '17:00' };
        }
        return acc;
      }, {});

      // Try to load saved availability
      try {
        const saved = await base44.auth.updateMe({ coach_availability: defaultAvailability });
        if (saved?.coach_availability) {
          setAvailability(saved.coach_availability);
        } else {
          setAvailability(defaultAvailability);
        }
      } catch {
        setAvailability(defaultAvailability);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateDayAvailability = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const saveAvailability = async () => {
    try {
      setSaving(true);
      await base44.auth.updateMe({ coach_availability: availability });
    } catch (error) {
      console.error('Failed to save availability:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
          <p className="text-sm text-gray-600 mt-1">Set your working hours for coaching sessions</p>
        </div>
        <Button
          onClick={saveAvailability}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 mr-2"
              >
                <Clock className="w-4 h-4" />
              </motion.div>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      {/* Availability Grid */}
      <div className="space-y-3">
        {DAYS_OF_WEEK.map((day, idx) => {
          const dayAvail = availability[day];
          if (!dayAvail) return null;

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                {/* Day toggle */}
                <div className="min-w-28">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dayAvail.enabled}
                      onChange={e => updateDayAvailability(day, 'enabled', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className={`font-semibold ${dayAvail.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      {day}
                    </span>
                  </label>
                </div>

                {/* Time range */}
                {dayAvail.enabled && (
                  <div className="flex items-center gap-2 flex-1">
                    <select
                      value={dayAvail.startTime}
                      onChange={e => updateDayAvailability(day, 'startTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {HOURS.map(hour => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-500 font-semibold">—</span>
                    <select
                      value={dayAvail.endTime}
                      onChange={e => updateDayAvailability(day, 'endTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {HOURS.map(hour => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!dayAvail.enabled && (
                  <div className="text-sm text-gray-400">Not available</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex gap-3"
      >
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Pro tip:</p>
          <p>Students can only book sessions during your available hours. Update your availability regularly to maintain a full calendar.</p>
        </div>
      </motion.div>
    </div>
  );
}