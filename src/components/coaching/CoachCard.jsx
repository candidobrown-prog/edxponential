import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const sessionTypeLabels = {
  one_on_one: '1-on-1',
  group: 'Group',
  consultation: 'Consultation',
};

export default function CoachCard({ coach }) {
  return (
    <Link
      to={`/coaching/${coach.id}`}
      className="group bg-card rounded-2xl border border-border/50 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {coach.coach_avatar ? (
            <img src={coach.coach_avatar} alt={coach.coach_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-heading font-bold text-primary-foreground">
              {coach.coach_name?.[0]}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {coach.coach_name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{coach.coach_title}</p>
        </div>
      </div>

      {coach.specializations?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {coach.specializations.slice(0, 3).map((spec, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-accent/50 border-border/50">
              {spec}
            </Badge>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
        {coach.bio}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Badge className="bg-secondary/10 text-secondary border-0 text-xs">
            {sessionTypeLabels[coach.session_type] || coach.session_type}
          </Badge>
          {coach.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
              {coach.rating?.toFixed(1)}
            </span>
          )}
          {coach.duration_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {coach.duration_minutes}m
            </span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}