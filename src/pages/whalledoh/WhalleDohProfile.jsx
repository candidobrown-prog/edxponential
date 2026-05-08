import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Globe, Edit2, Camera, Star, Users, BookOpen, Zap, Award, Plus } from 'lucide-react';
import WhalleDohLayout from './WhalleDohLayout';

const EXPERTISE = ['Literacy Leadership', 'Instructional Coaching', 'Data-Driven Instruction', 'School Culture', 'PLC Facilitation'];
const CERTS = ['National Board Certified', 'Google Certified Educator', 'Harvard Leadership Certificate'];

export default function WhalleDohProfile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Your Name',
    role: 'Educator',
    school: 'Your School',
    location: 'City, State',
    bio: 'Share your story, your teaching philosophy, and what drives you as an educator. What do you believe about learning? What are you building?',
    years: 0,
    subjects: [],
    grades: [],
    goals: '',
  });

  const STATS = [
    { value: '0', label: 'Connections' },
    { value: '0', label: 'Communities' },
    { value: '0', label: 'Posts' },
    { value: '100%', label: 'Response Rate' },
  ];

  return (
    <WhalleDohLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 mb-5 relative">
          <button onClick={() => setEditing(!editing)}
            className="absolute top-5 right-5 flex items-center gap-1.5 border border-white/10 text-white/40 text-xs font-bold px-3 py-2 rounded-xl hover:bg-white/[0.05] hover:text-white transition-all">
            <Edit2 className="w-3.5 h-3.5" /> {editing ? 'Save' : 'Edit Profile'}
          </button>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/10 flex items-center justify-center text-3xl">👤</div>
              <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all">
                <Camera className="w-3.5 h-3.5 text-[#07080f]" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              {editing ? (
                <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="text-white font-black text-xl bg-transparent border-b border-white/20 focus:outline-none focus:border-white/50 mb-1 w-full" />
              ) : (
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-white font-black text-xl">{profile.name}</h1>
                  <CheckCircle className="w-4 h-4 text-white/50" />
                  <span className="text-[10px] font-black bg-white/10 text-white/60 rounded px-2 py-0.5">EDUCATOR</span>
                </div>
              )}

              {editing ? (
                <input value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })}
                  className="text-white/50 text-sm bg-transparent border-b border-white/10 focus:outline-none w-full mb-2" />
              ) : (
                <p className="text-white/50 text-sm mb-1">{profile.role}</p>
              )}

              <div className="flex items-center gap-3 flex-wrap text-white/30 text-xs">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{profile.school}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/[0.07]">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-white font-black text-lg">{s.value}</div>
                <div className="text-white/30 text-[11px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="space-y-4">
            {/* Bio */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> About</h3>
              {editing ? (
                <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={4}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white/70 text-xs resize-none focus:outline-none" />
              ) : (
                <p className="text-white/45 text-xs leading-relaxed">{profile.bio}</p>
              )}
            </div>

            {/* Expertise */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2"><Star className="w-4 h-4" /> Expertise</h3>
              <div className="flex flex-wrap gap-1.5">
                {EXPERTISE.map(e => (
                  <span key={e} className="text-[11px] text-white/50 border border-white/[0.1] rounded-full px-2.5 py-1 font-semibold">{e}</span>
                ))}
                {editing && (
                  <button className="text-[11px] text-white/30 border border-dashed border-white/20 rounded-full px-2.5 py-1 font-bold hover:text-white/50 transition-colors flex items-center gap-1">
                    <Plus className="w-2.5 h-2.5" /> Add
                  </button>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2"><Award className="w-4 h-4" /> Certifications</h3>
              <div className="space-y-2">
                {CERTS.map(c => (
                  <div key={c} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-white/40 flex-shrink-0" />
                    <span className="text-white/50 text-xs font-semibold">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Main content */}
          <div className="md:col-span-2 space-y-4">
            {/* Availability */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Collaboration Status</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Open to Mentoring', active: true },
                  { label: 'Open to Co-authoring', active: false },
                  { label: 'Available for Speaking', active: true },
                  { label: 'Open to Consulting', active: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.active ? 'bg-green-400' : 'bg-white/15'}`} />
                    <span className={`text-xs font-semibold ${item.active ? 'text-white/70' : 'text-white/30'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhallAI profile boost */}
            <div className="bg-white/[0.04] border border-white/[0.1] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-white/60" />
                <h3 className="text-white font-black text-sm">WhallAI Profile Boost</h3>
              </div>
              <p className="text-white/40 text-xs leading-relaxed mb-4">Let WhallAI generate a powerful professional bio, identify your top 5 expertise areas, and optimize your profile for discovery.</p>
              <button className="flex items-center gap-2 bg-white text-[#07080f] font-black text-xs px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
                <Zap className="w-3.5 h-3.5" /> Generate with WhallAI
              </button>
            </div>

            {/* Empty feed state */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">✍️</div>
              <p className="text-white/40 text-sm font-black mb-1">Share your first post</p>
              <p className="text-white/25 text-xs mb-4">Share insights, resources, strategies, or just say hello to the WhalleDoh community.</p>
              <button className="flex items-center gap-2 bg-white text-[#07080f] font-black text-xs px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all mx-auto">
                <Plus className="w-3.5 h-3.5" /> Create Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </WhalleDohLayout>
  );
}