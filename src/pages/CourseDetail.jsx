import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, Calendar, DollarSign, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const levelColors = {
  foundational: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
  executive: 'bg-amber-100 text-amber-700',
};

export default function CourseDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = window.location.pathname.split('/').pop();

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.list(),
  });

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl h-64 bg-gradient-to-br from-primary/80 to-primary overflow-hidden relative">
            {course.cover_image ? (
              <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-8xl text-white/10 font-bold">{course.title?.[0]}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={levelColors[course.level] || 'bg-muted'}>{course.level}</Badge>
              <Badge variant="outline" className="capitalize">{course.category?.replace(/_/g, ' ')}</Badge>
            </div>
            <h1 className="font-heading text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">{course.description}</p>
          </div>

          {/* Modules */}
          {course.modules?.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">Course Modules</h2>
              <div className="space-y-3">
                {course.modules.map((mod, i) => (
                  <div key={i} className="bg-card border border-border/50 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{mod.title}</h4>
                      {mod.description && <p className="text-sm text-muted-foreground mt-1">{mod.description}</p>}
                      {mod.duration_minutes && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                          <Clock className="w-3 h-3" /> {mod.duration_minutes} min
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-5 sticky top-8">
            {course.price > 0 && (
              <div className="text-center">
                <span className="text-3xl font-heading font-bold">${course.price}</span>
                <span className="text-muted-foreground ml-1">USD</span>
              </div>
            )}
            <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl h-12 text-base font-semibold">
              Enroll Now
            </Button>
            <div className="space-y-3 pt-4 border-t border-border/50">
              {course.duration_weeks && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{course.duration_weeks} weeks</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{course.enrolled_count || 0} / {course.max_enrollment || '∞'} enrolled</span>
              </div>
              {course.start_date && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Starts {format(new Date(course.start_date), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
            {course.instructor_name && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Instructor</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="font-heading font-bold text-primary">{course.instructor_name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{course.instructor_name}</p>
                    <p className="text-xs text-muted-foreground">{course.instructor_title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}