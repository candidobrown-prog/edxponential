import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const levelColors = {
  foundational: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
  executive: 'bg-amber-100 text-amber-700',
};

const categoryLabels = {
  leadership: 'Leadership',
  operations: 'Operations',
  curriculum: 'Curriculum',
  finance: 'Finance',
  culture: 'Culture',
  innovation: 'Innovation',
  governance: 'Governance',
  fundraising: 'Fundraising',
};

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
    >
      <div className="h-44 bg-gradient-to-br from-primary/80 to-primary overflow-hidden relative">
        {course.cover_image ? (
          <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-5xl text-white/20 font-bold">{course.title?.[0]}</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge className={cn("text-xs font-medium", levelColors[course.level] || 'bg-muted text-muted-foreground')}>
            {course.level || 'General'}
          </Badge>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
          {categoryLabels[course.category] || course.category}
        </span>
        <h3 className="font-heading text-lg font-semibold mt-2 mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {course.duration_weeks && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.duration_weeks}w
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.enrolled_count || 0} enrolled
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}