import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Star, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import StatCard from '../components/dashboard/StatCard';
import StudentProgressCard from '../components/dashboard/StudentProgressCard';
import EdVisorCard from '../components/coaching/EdVisorCard';

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

  const { data: progressItems = [] } = useQuery({
    queryKey: ['my-progress', user?.email],
    queryFn: () => base44.entities.StudentProgress.filter({ user_email: user.email }, '-updated_date', 10),
    enabled: !!user?.email,
  });

  const completedCourses = progressItems.filter(p => p.status === 'completed').length;
  const inProgressCourses = progressItems.filter(p => p.status === 'in_progress').length;

  return (
    <div className="space-y-8">
      <WelcomeHero userName={user?.full_name} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Courses" value={courses.length} icon={BookOpen} accentColor="bg-black" subtitle="Available to enroll" />
        <StatCard title="edVisors" value={coaches.length} icon={Star} accentColor="bg-black" subtitle="Ready for sessions" />
        <StatCard title="Communities" value={communities.length} icon={Users} accentColor="bg-black" subtitle="Active groups" />
        <StatCard title="Courses Completed" value={completedCourses} icon={CheckCircle} accentColor="bg-black" subtitle={`${inProgressCourses} in progress`} />
      </div>

      {/* My Progress */}
      {progressItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-semibold">My Learning Progress</h2>
            <Link to="/courses" className="text-sm text-muted-foreground hover:text-black transition-colors flex items-center gap-1">
              All Courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressItems.slice(0, 4).map(p => <StudentProgressCard key={p.id} progress={p} />)}
          </div>
        </section>
      )}

      {/* Featured edVisors */}
      {coaches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-semibold">Featured edVisors</h2>
            <Link to="/edvisors" className="text-sm text-muted-foreground hover:text-black transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coaches.map(coach => <EdVisorCard key={coach.id} coach={coach} />)}
          </div>
        </section>
      )}

      {/* Communities */}
      {communities.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-semibold">Active Communities</h2>
            <Link to="/communities" className="text-sm text-muted-foreground hover:text-black transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {communities.map(c => (
              <Link key={c.id} to={`/communities/${c.id}`} className="bg-card border border-border/50 rounded-xl p-5 hover:border-black/20 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-medium text-sm truncate">{c.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                <p className="text-xs text-muted-foreground">{c.member_count || 0} members</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}