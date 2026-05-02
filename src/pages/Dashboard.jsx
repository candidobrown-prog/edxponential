import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Sparkles, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import StatCard from '../components/dashboard/StatCard';
import CourseCard from '../components/courses/CourseCard';
import CoachCard from '../components/coaching/CoachCard';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
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

  return (
    <div className="space-y-8">
      <WelcomeHero userName={user?.full_name} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Courses" value={courses.length} icon={BookOpen} accentColor="bg-accent" subtitle="Available to enroll" />
        <StatCard title="Expert Coaches" value={coaches.length} icon={Sparkles} accentColor="bg-secondary/10" subtitle="Ready for sessions" />
        <StatCard title="Communities" value={communities.length} icon={Users} accentColor="bg-green-50" subtitle="Active groups" />
        <StatCard title="Leaders Served" value="1.2k+" icon={TrendingUp} accentColor="bg-purple-50" subtitle="And growing" />
      </div>

      {/* Recent Courses */}
      {courses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-semibold">Latest Courses</h2>
            <Link to="/courses" className="text-sm text-secondary font-medium hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        </section>
      )}

      {/* Featured Coaches */}
      {coaches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-semibold">Featured Coaches</h2>
            <Link to="/coaching" className="text-sm text-secondary font-medium hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {coaches.map(coach => <CoachCard key={coach.id} coach={coach} />)}
          </div>
        </section>
      )}
    </div>
  );
}