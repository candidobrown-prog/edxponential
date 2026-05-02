import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`w-6 h-6 ${i <= (hovered || value) ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`} />
        </button>
      ))}
    </div>
  );
}

export default function EdVisorReviews({ edvisorId }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: reviews = [] } = useQuery({
    queryKey: ['edvisor-reviews', edvisorId],
    queryFn: () => base44.entities.EdVisorReview.filter({ edvisor_id: edvisorId }, '-created_date', 50),
  });

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.EdVisorReview.create({
        ...data,
        reviewer_name: user?.full_name || 'Anonymous',
        reviewer_email: user?.email || '',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edvisor-reviews', edvisorId] });
      setRating(0);
      setText('');
      setShowForm(false);
      toast.success('Review submitted!');
    },
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a rating');
    submitMutation.mutate({ edvisor_id: edvisorId, rating, review_text: text });
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-lg font-semibold">Reviews</h2>
          {avgRating && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(avgRating) ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm font-semibold">{avgRating}</span>
              <span className="text-sm text-muted-foreground">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl text-sm gap-2"
        >
          <Star className="w-4 h-4" />
          Write a Review
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted/40 rounded-xl p-5 mb-6 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Your Rating</p>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <Textarea
            placeholder="Share your experience with this edVisor..."
            value={text}
            onChange={e => setText(e.target.value)}
            className="rounded-xl min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={submitMutation.isPending} className="rounded-xl">
              {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl">
              Cancel
            </Button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map(review => (
            <div key={review.id} className="flex gap-4 pb-5 border-b border-border/50 last:border-0 last:pb-0">
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{review.reviewer_name?.[0] || '?'}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{review.reviewer_name}</span>
                  <span className="text-xs text-muted-foreground">{review.created_date ? format(new Date(review.created_date), 'MMM d, yyyy') : ''}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`} />
                  ))}
                </div>
                {review.review_text && <p className="text-sm text-muted-foreground leading-relaxed">{review.review_text}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}