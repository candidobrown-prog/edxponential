import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingModal from '@/components/coaching/BookingModal';
import CoachAvailabilityCalendar from '@/components/coaching/CoachAvailabilityCalendar';
import EdVisorReviews from '@/components/coaching/EdVisorReviews';

const sessionTypeLabels = {
  one_on_one: '1-on-1 Session',
  group: 'Group Session',
  consultation: 'Consultation',
};

function StarRow({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`} />
      ))}
      <span className="text-sm font-semibold ml-1">{Number(rating).toFixed(1)}</span>
      {count > 0 && <span className="text-sm text-muted-foreground">({count} reviews)</span>}
    </div>
  );
}

export default function EdVisorDetail() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const edvisorId = window.location.pathname.split('/').pop();
  const queryClient = useQueryClient();

  const { data: coaches = [] } = useQuery({
    queryKey: ['coaches'],
    queryFn: () => base44.entities.CoachingSession.list(),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['edvisor-reviews', edvisorId],
    queryFn: () => base44.entities.EdVisorReview.filter({ edvisor_id: edvisorId }, '-created_date', 100),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }) => base44.entities.CoachingSession.update(id, { status: newStatus }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coaches'] }),
  });

  const coach = coaches.find(c => c.id === edvisorId);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : null;

  if (!coach) {
    return (
      <div className="text-center py-20">
        <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading edVisor profile...</p>
      </div>
    );
  }

  const initials = coach.coach_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';

  return (
    <div className="space-y-8">
      <Link to="/edvisors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to edVisors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-black flex items-center justify-center flex-shrink-0 overflow-hidden">
                {coach.coach_avatar ? (
                  <img src={coach.coach_avatar} alt={coach.coach_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-heading font-bold text-white">{initials}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading text-2xl font-bold">{coach.coach_name}</h1>
                  <Badge className={coach.status === 'active' ? 'bg-green-100 text-green-700 border-0' : 'bg-muted text-muted-foreground border-0'}>
                    {coach.status === 'active' ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">{coach.coach_title}</p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <Badge className="bg-black text-white border-0">
                    {sessionTypeLabels[coach.session_type]}
                  </Badge>
                  {avgRating && <StarRow rating={avgRating} count={reviews.length} />}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/50">
              <Switch
                id="status-toggle"
                checked={coach.status === 'active'}
                onCheckedChange={(checked) =>
                  toggleStatusMutation.mutate({ id: coach.id, newStatus: checked ? 'active' : 'paused' })
                }
                disabled={toggleStatusMutation.isPending}
              />
              <Label htmlFor="status-toggle" className="text-sm cursor-pointer">
                {coach.status === 'active' ? 'Mark as Unavailable' : 'Mark as Available'}
              </Label>
            </div>
          </div>

          {/* Bio */}
          {coach.bio && (
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="font-heading text-lg font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{coach.bio}</p>
            </div>
          )}

          {/* Availability */}
          <CoachAvailabilityCalendar coachId={coach.id} onSelectSlot={setSelectedSlot} />

          {/* Specializations */}
          {coach.specializations?.length > 0 && (
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="font-heading text-lg font-semibold mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {coach.specializations.map((spec, i) => (
                  <span key={i} className="bg-muted text-foreground rounded-full px-4 py-1.5 text-sm border border-border/50">{spec}</span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <EdVisorReviews edvisorId={edvisorId} />
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
            <Button
              onClick={() => setShowBooking(true)}
              disabled={coach.status !== 'active'}
              className="w-full bg-black hover:bg-black/85 text-white rounded-xl h-12 text-base font-semibold disabled:opacity-40"
            >
              {coach.status !== 'active' ? 'Currently Unavailable' : selectedSlot ? `Book ${selectedSlot.time}` : 'Book Session'}
            </Button>
            {selectedSlot && (
              <p className="text-xs text-center text-muted-foreground">
                {selectedSlot.date} · {selectedSlot.time}
              </p>
            )}
            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{coach.duration_minutes || 60} minutes per session</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span>{coach.total_sessions || 0} sessions completed</span>
              </div>
              {avgRating && (
                <div className="flex items-center gap-3 text-sm">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span>{Number(avgRating).toFixed(1)} avg. rating</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BookingModal coach={coach} open={showBooking} onClose={() => setShowBooking(false)} preselectedSlot={selectedSlot} />
    </div>
  );
}