import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoachingCalendar from '@/components/coaching/CoachingCalendar';
import AvailabilityManager from '@/components/coaching/AvailabilityManager';
import { Calendar, Clock } from 'lucide-react';

export default function CoachDashboardTab({ user }) {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Availability
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <CoachingCalendar coachEmail={user?.email} />
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <AvailabilityManager coachEmail={user?.email} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}