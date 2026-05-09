import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CoachDirectoryCard({ coach }) {
  const starArray = Array.from({ length: 5 }, (_, i) => i < Math.floor(coach.rating || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Coach Image/Header */}
      <div className="h-32 bg-gradient-to-br from-black via-gray-800 to-gray-600 relative overflow-hidden">
        {coach.photo_url ? (
          <img src={coach.photo_url} alt={coach.name} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-4xl font-bold text-white/30">{coach.name?.[0] || '?'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name & Title */}
        <h3 className="font-bold text-lg text-black mb-1">{coach.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{coach.title || 'Coach'}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {starArray.map((filled, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({coach.reviews_count || 0} reviews)</span>
        </div>

        {/* Specializations */}
        {coach.specializations && coach.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {coach.specializations.slice(0, 2).map((spec, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
            {coach.specializations.length > 2 && (
              <Badge variant="outline" className="text-xs">+{coach.specializations.length - 2}</Badge>
            )}
          </div>
        )}

        {/* Availability Status */}
        <div className="flex items-center gap-2 mb-4">
          {coach.is_available ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Available Now</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Next: {coach.next_available || 'Soon'}</span>
            </>
          )}
        </div>

        {/* Rate */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Session Rate</p>
          <p className="text-lg font-bold text-black">${coach.rate_per_session || '0'}</p>
        </div>

        {/* Book Button */}
        <Link to={`/coaching/${coach.id}`} className="w-full">
          <Button className="w-full bg-black text-white hover:bg-black/85 rounded-xl gap-2 group/btn">
            Book Session
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}