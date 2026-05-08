/**
 * OnboardingProfile — Step 3 of mandatory onboarding
 * Profile creation after tier + billing. Required fields enforced.
 */
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload, User, Zap } from 'lucide-react';
import OnboardingShell from './OnboardingShell';
import { base44 } from '@/api/base44Client';

const ROLES = [
  'Principal', 'Assistant Principal', 'Superintendent / Executive', 'Instructional Coach',
  'School Founder', 'EdTech Founder', 'Educator / Teacher', 'Tutor', 'Investor', 'Consultant / Advisor', 'Other',
];

const GOALS = [
  'Improve school culture', 'Raise capital', 'Scale my school network', 'Find a coach or mentor',
  'Build a business', 'Connect with investors', 'Improve student outcomes', 'Grow my expertise',
  'Build a team', 'Monetize my knowledge',
];

export default function OnboardingProfile({ data, onUpdate, onNext, onBack }) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    full_name: data.full_name || '',
    role: data.role || '',
    bio: data.bio || '',
    organization: data.organization || '',
    city: data.city || '',
    goals: data.goals || [],
    photo_url: data.photo_url || '',
  });
  const fileRef = useRef();

  const set = (key, val) => {
    const next = { ...form, [key]: val };
    setForm(next);
    onUpdate(next);
  };

  const toggleGoal = (g) => {
    const current = form.goals || [];
    const updated = current.includes(g) ? current.filter(x => x !== g) : [...current, g];
    set('goals', updated);
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set('photo_url', file_url);
    } catch (_) {}
    setUploading(false);
  };

  const generateBio = async () => {
    if (!form.role || !form.full_name) return;
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a short, powerful, 2-sentence professional bio for ${form.full_name}, who is a ${form.role} in education${form.organization ? ` at ${form.organization}` : ''}. Make it confident, inspiring, and professional. No hashtags.`,
      });
      set('bio', typeof result === 'string' ? result : result?.text || result);
    } catch (_) {}
    setGenerating(false);
  };

  const canContinue = form.role && form.full_name && (form.photo_url || photoPreview);

  return (
    <OnboardingShell step={3} totalSteps={5} label="Profile">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Let's Build Your Presence.</h2>
          <p className="text-white/35 text-sm">Tell the world who you are and what you're building.</p>
        </div>

        {/* Photo upload */}
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-24 h-24 rounded-full bg-white/[0.07] border-2 border-white/15 border-dashed flex items-center justify-center cursor-pointer hover:border-white/35 hover:bg-white/10 transition-all relative overflow-hidden group">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <Upload className="w-5 h-5 text-white/30 mx-auto mb-1 group-hover:text-white/60 transition-colors" />
                <p className="text-[10px] text-white/25 font-bold">Photo</p>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          <p className="text-white/25 text-[11px] font-semibold">Required · Click to upload profile photo</p>
        </div>

        {/* Name */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-1.5 block">Full Name *</label>
          <input value={form.full_name} onChange={e => set('full_name', e.target.value)}
            placeholder="Your full name"
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25" />
        </div>

        {/* Role */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-1.5 block">Your Role *</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map(r => (
              <button key={r} onClick={() => set('role', r)}
                className={`text-left px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${form.role === r ? 'border-white bg-white/10 text-white' : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Organization */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-1.5 block">School / Organization</label>
          <input value={form.organization} onChange={e => set('organization', e.target.value)}
            placeholder="School, district, or company name"
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25" />
        </div>

        {/* City */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-1.5 block">City / Location</label>
          <input value={form.city} onChange={e => set('city', e.target.value)}
            placeholder="Chicago, IL"
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25" />
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-white/30">Your Bio</label>
            <button onClick={generateBio} disabled={generating || !form.role || !form.full_name}
              className="flex items-center gap-1 text-white/30 text-[10px] font-black hover:text-white/60 transition-colors disabled:opacity-25">
              <Zap className="w-3 h-3" />
              {generating ? 'Generating…' : 'AI Generate'}
            </button>
          </div>
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3}
            placeholder="Tell the edXponential community who you are and what you're building…"
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 resize-none" />
        </div>

        {/* Goals */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-2 block">Your Goals (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => (
              <button key={g} onClick={() => toggleGoal(g)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all ${(form.goals || []).includes(g) ? 'border-white bg-white/10 text-white' : 'border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/55'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="flex gap-3 pt-2">
          <button onClick={onBack}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all font-bold">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={onNext} disabled={!canContinue}
            className="flex-1 bg-white text-[#07080f] font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all text-sm">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-white/20 text-[11px]">Profile photo, name, and role are required to continue</p>
      </div>
    </OnboardingShell>
  );
}