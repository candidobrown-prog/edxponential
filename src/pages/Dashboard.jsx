import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PersonalizedDashboard from '../components/platform/PersonalizedDashboard';
import { AnimatePresence } from 'framer-motion';

const ONBOARD_KEY = 'edx_onboarding_dismissed';
const COMPLETED_KEY = 'edx_onboarding_completed';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [xschetails, setXschetails] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const records = await base44.entities.Xschetails.filter({ user_email: u.email }, '-created_date', 1);
      if (records.length > 0) setXschetails(records[0]);
      // Show onboarding if not dismissed/completed
      if (!localStorage.getItem(COMPLETED_KEY) && !localStorage.getItem(ONBOARD_KEY)) {
        setTimeout(() => setShowOnboarding(true), 1000);
      }
    }).catch(() => {});
  }, []);

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.list('-created_date', 4),
  });

  const { data: coaches = [] } = useQuery({
    queryKey: ['coaches'],
    queryFn: () => base44.entities.CoachingSession.list('-created_date', 4),
  });

  const { data: communities = [] } = useQuery({
    queryKey: ['communities'],
    queryFn: () => base44.entities.Community.list('-created_date', 4),
  });

  const { data: progressItems = [] } = useQuery({
    queryKey: ['my-progress', user?.email],
    queryFn: () => base44.entities.StudentProgress.filter({ user_email: user.email }, '-updated_date', 10),
    enabled: !!user?.email,
  });

  const completedCourses = progressItems.filter(p => p.status === 'completed').length;
  const inProgressCourses = progressItems.filter(p => p.status === 'in_progress').length;

  return (
    <div className="space-y-12">
      <PersonalizedDashboard 
        tier={user?.membership_tier || 'Principal Park'}
        userName={user?.full_name || 'User'}
      />
    </div>
  );
}