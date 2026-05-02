import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColors = {
  completed: 'bg-black text-white',
  in_progress: 'bg-gray-100 text-gray-700',
  not_started: 'bg-gray-50 text-gray-400',
};

export default function StudentProgressCard({ progress }) {
  return (
    <Link to={`/courses/${progress.course_id}`} className="block bg-card border border-border/50 rounded-xl p-5 hover:border-black/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
            {progress.status === 'completed'
              ? <CheckCircle className="w-4 h-4 text-white" />
              : <BookOpen className="w-4 h-4 text-white" />
            }
          </div>
          <div>
            <p className="font-medium text-sm leading-tight">{progress.course_title || 'Course'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {progress.modules_completed || 0}/{progress.total_modules || 0} modules
            </p>
          </div>
        </div>
        <Badge className={`text-xs ${statusColors[progress.status] || statusColors.not_started}`}>
          {progress.status?.replace(/_/g, ' ')}
        </Badge>
      </div>
      <Progress value={progress.progress_percent || 0} className="h-1.5" />
      <p className="text-xs text-muted-foreground mt-1.5 text-right">{progress.progress_percent || 0}%</p>
    </Link>
  );
}