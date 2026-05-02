import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const sessionTypeLabels = {
  one_on_one: '1-on-1',
  group: 'Group',
  consultation: 'Consultation',
};

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
      {count > 0 && <span className="text-xs text-gray-400 ml-1">({count})</span>}
    </div>
  );
}

export default function EdVisorCard({ coach }) {
  const initials = coach.coach_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';

  return (
    <Link
      to={`/edvisors/${coach.id}`}
      className="group bg-white rounded-2xl border border-black/8 overflow-hidden hover:shadow-2xl hover:border-black/20 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Top photo area */}
      <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {coach.coach_avatar ? (
          <img src={coach.coach_avatar} alt={coach.coach_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center">
            <span className="text-3xl font-heading font-bold text-white">{initials}</span>
          </div>
        )}
        {coach.status === 'active' && (
          <div className="absolute top-3 right-3 bg-white rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-700">Available</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-black text-white border-0 text-xs">
            {sessionTypeLabels[coach.session_type] || coach.session_type}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-heading text-lg font-semibold text-black">{coach.coach_name}</h3>
          {coach.price > 0 && (
            <span className="text-sm font-bold text-black">${coach.price}<span className="text-xs text-gray-400 font-normal">/session</span></span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-2 truncate">{coach.coach_title}</p>

        {(coach.rating > 0 || coach.review_count > 0) && (
          <div className="mb-3">
            <StarRating rating={coach.rating || 0} count={coach.review_count || 0} />
          </div>
        )}

        {coach.specializations?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {coach.specializations.slice(0, 3).map((spec, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5">{spec}</span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">{coach.bio}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-black/6 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {coach.duration_minutes || 60}m
          </span>
          {coach.total_sessions > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> {coach.total_sessions} sessions
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}