import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Star, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingModal from '@/components/coaching/BookingModal';
import CoachAvailabilityCalendar from '@/components/coaching/CoachAvailabilityCalendar';

const sessionTypeLabels = {
  one_on_one: '1-on-1 Session',
  group: 'Group Session',
  consultation: 'Consultation',
};

export default function CoachingDetail() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const coachId = window.location.pathname.split('/').pop();

  const { data: coaches = [] } = useQuery({
    queryKey: ['coaches'],
    queryFn: () => base44.entities.CoachingSession.list(),
  });

  const coach = coaches.find(c => c.id === coachId);

  if (!coach) {
    return (
      <div className="text-center py-20">
        <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading coach profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/coaching" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Coaching
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {coach.coach_avatar ? (
                  <img src={coach.coach_avatar} alt={coach.coach_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-heading font-bold text-primary-foreground">{coach.coach_name?.[0]}</span>
                )}
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold">{coach.coach_name}</h1>
                <p className="text-muted-foreground mt-1">{coach.coach_title}</p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className="bg-secondary/10 text-secondary border-0">
                    {sessionTypeLabels[coach.session_type]}
                  </Badge>
                  {coach.rating > 0 && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      {coach.rating?.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {coach.bio && (
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="font-heading text-lg font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{coach.bio}</p>
            </div>
          )}

          {/* Availability Calendar */}
          <CoachAvailabilityCalendar
            coachId={coach.id}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
          />

          {/* Specializations */}
          {coach.specializations?.length > 0 && (
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="font-heading text-lg font-semibold mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {coach.specializations.map((spec, i) => (
                  <Badge key={i} variant="outline" className="bg-accent/50 border-border/50 py-1.5 px-4">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-5 sticky top-8">
            {coach.price > 0 && (
              <div className="text-center">
                <span className="text-3xl font-heading font-bold">${coach.price}</span>
                <span className="text-muted-foreground ml-1">/ session</span>
              </div>
            )}
            <Button onClick={() => setShowBooking(true)} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl h-12 text-base font-semibold">
              {selectedSlot ? `Book ${selectedSlot.time}` : 'Book Session'}
            </Button>
            {selectedSlot && (
              <p className="text-xs text-center text-muted-foreground -mt-2">
                {selectedSlot.date} · {selectedSlot.time}
              </p>
            )}
            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{coach.duration_minutes || 60} minutes</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span>{coach.total_sessions || 0} sessions completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BookingModal coach={coach} open={showBooking} onClose={() => setShowBooking(false)} preselectedSlot={selectedSlot} />
    </div>
  );
}