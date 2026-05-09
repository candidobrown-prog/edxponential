import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCalendar from '../dashboard/DashboardCalendar';

export default function PersonalizedDashboard({ tier, userName }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  const { data: courses = [] } = useQuery({
    queryKey: ['dashboard-courses'],
    queryFn: () => base44.entities.Course.list('-created_date', 4),
  });

  const { data: communities = [] } = useQuery({
    queryKey: ['dashboard-communities'],
    queryFn: () => base44.entities.Community.list('-created_date', 4),
  });

  const { data: progressItems = [] } = useQuery({
    queryKey: ['dashboard-progress', user?.email],
    queryFn: () => base44.entities.StudentProgress.filter({ user_email: user?.email }, '-updated_date', 5),
    enabled: !!user?.email,
  });

  const completedCourses = progressItems.filter(p => p.status === 'completed').length;
  const inProgressCourses = progressItems.filter(p => p.status === 'in_progress').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-card shadow-sm p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="display-2 mb-2">Welcome back, {userName}</h1>
            <p className="subtitle text-muted-foreground">
              You're in <span className="font-semibold text-foreground">{tier}</span>. Ready to keep growing?
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold">Premium Access</span>
          </div>
        </div>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content - 2 cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Calendar */}
          {user && <DashboardCalendar user={user} />}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: 'In Progress', value: inProgressCourses, icon: '📚', color: 'text-blue-600' },
              { label: 'Completed', value: completedCourses, icon: '✓', color: 'text-green-600' }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all">
                <p className="caption text-muted-foreground mb-2">{stat.label}</p>
                <p className={`display-2 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-xl border border-border bg-card shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="title font-semibold text-black">Featured Courses</h2>
              <Link to="/courses" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid gap-3">
              {courses.slice(0, 3).map((course, i) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="p-3 rounded-lg border border-border hover:border-primary/20 hover:shadow-sm transition-all group"
                >
                  <p className="body-sm font-semibold text-black group-hover:text-primary">{course.title}</p>
                  <p className="caption text-muted-foreground mt-1">{course.instructor_name}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-8">
          {/* Communities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="rounded-xl border border-border bg-card shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="title font-semibold text-black">Communities</h3>
              <Link to="/communities" className="text-primary hover:text-primary/80">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-2">
              {communities.slice(0, 3).map(community => (
                <Link
                  key={community.id}
                  to={`/communities/${community.id}`}
                  className="block p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="body-xs font-semibold text-black hover:text-primary">{community.name}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Upgrade Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="title font-semibold text-black">Ready for more?</h3>
            </div>
            <p className="body-xs text-muted-foreground mb-4">
              Unlock premium features and exclusive content with an upgrade.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Explore Premium <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}