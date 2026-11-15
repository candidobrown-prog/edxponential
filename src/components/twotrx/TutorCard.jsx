import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Clock, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TutorCard({ tutor }) {
  const initials = tutor.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff] px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          {tutor.photo_url ? (
            <img src={tutor.photo_url} alt={tutor.full_name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-[#4f46e5] flex items-center justify-center border-2 border-white">
              <span className="text-white font-bold text-lg">{initials}</span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-slate-900">{tutor.full_name}</p>
              {tutor.verified && <CheckCircle className="w-4 h-4 text-[#4f46e5] fill-[#4f46e5] fill-opacity-20" />}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-slate-700">{tutor.rating?.toFixed(1) || 'New'}</span>
              <span className="text-xs text-slate-400">({tutor.total_sessions || 0} sessions)</span>
            </div>
            {tutor.city && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{tutor.city}{tutor.state ? `, ${tutor.state}` : ''}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-[#4f46e5] font-bold text-sm">${tutor.hourly_rate || '—'}<span className="text-slate-400 font-normal">/hr</span></p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {tutor.bio && <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">{tutor.bio}</p>}

        {/* Subjects */}
        {tutor.subjects?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tutor.subjects.slice(0, 4).map(s => (
              <span key={s} className="px-2 py-0.5 bg-[#eef2ff] text-[#4f46e5] rounded-full text-xs font-medium">{s}</span>
            ))}
            {tutor.subjects.length > 4 && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">+{tutor.subjects.length - 4}</span>}
          </div>
        )}

        {/* Session Types */}
        {tutor.session_types?.length > 0 && (
          <div className="flex gap-2 mb-4">
            {tutor.session_types.map(t => (
              <span key={t} className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5 capitalize">{t.replace('_', '-')}</span>
            ))}
          </div>
        )}

        {/* Credentials */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          {tutor.teaching_certified && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />Certified</span>}
          {tutor.years_experience && <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{tutor.years_experience}yr exp</span>}
          {tutor.background_check === 'cleared' && <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-3 h-3" />BG Cleared</span>}
        </div>

        <Link to={`/twotrx/tutors/${tutor.id}`}>
          <Button className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm h-9">View Profile & Book</Button>
        </Link>
      </div>
    </div>
  );
}