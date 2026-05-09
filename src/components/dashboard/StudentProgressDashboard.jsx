import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Clock, BookOpen, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export default function StudentProgressDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: progressData = [], isLoading } = useQuery({
    queryKey: ['studentProgress', user?.email],
    queryFn: () => user?.email ? base44.entities.StudentProgress.filter({ user_email: user.email }) : [],
    enabled: !!user?.email,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.list(),
  });

  // Combine progress data with course details
  const enrichedProgress = progressData.map(progress => {
    const course = courses.find(c => c.id === progress.course_id);
    return { ...progress, courseDetails: course };
  }).sort((a, b) => new Date(b.last_accessed) - new Date(a.last_accessed));

  // Get upcoming deadlines
  const upcomingDeadlines = enrichedProgress
    .filter(p => p.courseDetails?.start_date)
    .map(p => ({
      ...p,
      daysUntilStart: Math.ceil((new Date(p.courseDetails.start_date) - new Date()) / (1000 * 60 * 60 * 24))
    }))
    .filter(p => p.daysUntilStart > 0 && p.daysUntilStart <= 30)
    .sort((a, b) => a.daysUntilStart - b.daysUntilStart)
    .slice(0, 3);

  // Calculate overall stats
  const totalCourses = enrichedProgress.length;
  const completedCourses = enrichedProgress.filter(p => p.status === 'completed').length;
  const avgProgress = totalCourses > 0 ? Math.round(enrichedProgress.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / totalCourses) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: 'Active Courses', value: totalCourses, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
          { label: 'Completed', value: completedCourses, icon: CheckCircle, color: 'from-green-500 to-green-600' },
          { label: 'Avg Progress', value: `${avgProgress}%`, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              className="rounded-xl border border-border bg-gradient-to-br from-white to-surface p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-black">{stat.value}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Active Courses */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <div className="mb-6">
          <h2 className="heading-2 text-black">Active Courses</h2>
          <p className="text-muted-foreground text-sm mt-1">Track your learning progress</p>
        </div>

        {enrichedProgress.length === 0 ? (
          <motion.div variants={itemVariants} className="rounded-xl border border-border bg-surface p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No active courses yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Enroll in courses to start learning</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {enrichedProgress.map((progress, i) => {
              const isComplete = progress.status === 'completed';
              const daysAgo = progress.last_accessed ? Math.floor((new Date() - new Date(progress.last_accessed)) / (1000 * 60 * 60 * 24)) : null;

              return (
                <motion.div
                  key={progress.id}
                  variants={itemVariants}
                  className={`rounded-xl border ${isComplete ? 'border-green-200 bg-gradient-to-br from-green-50 to-white' : 'border-border bg-white'} p-6 hover:shadow-lg transition-all cursor-pointer group`}
                >
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-black group-hover:text-primary transition-colors truncate">
                          {progress.courseDetails?.title || progress.course_title || 'Untitled Course'}
                        </h3>
                        {isComplete && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                      </div>
                      {daysAgo !== null && (
                        <p className="text-xs text-muted-foreground">
                          {daysAgo === 0 ? 'Accessed today' : daysAgo === 1 ? 'Accessed yesterday' : `Accessed ${daysAgo} days ago`}
                        </p>
                      )}
                    </div>
                    <span className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-primary'}`}>
                      {progress.progress_percent || 0}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.progress_percent || 0}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
                      />
                    </div>
                  </div>

                  {/* Module Progress */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Modules Completed</p>
                      <p className="text-lg font-bold text-black">
                        {progress.modules_completed || 0}/{progress.total_modules || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <p className="text-xs font-semibold capitalize">
                        <span className={`px-2 py-1 rounded-full ${
                          isComplete ? 'bg-green-100 text-green-700' :
                          progress.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {progress.status?.replace('_', ' ') || 'Not Started'}
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <div className="mb-6">
            <h2 className="heading-2 text-black">Upcoming Deadlines</h2>
            <p className="text-muted-foreground text-sm mt-1">Next course starts coming up</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {upcomingDeadlines.map((deadline, i) => (
              <motion.div
                key={deadline.id}
                variants={itemVariants}
                className="flex items-center gap-4 p-4 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-blue-500 text-white">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black truncate">
                    {deadline.courseDetails?.title || deadline.course_title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Starts in {deadline.daysUntilStart} {deadline.daysUntilStart === 1 ? 'day' : 'days'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{deadline.daysUntilStart}d</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}