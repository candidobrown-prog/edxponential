import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, School, Users, ShieldCheck, ArrowRight, Star, BookOpen, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const portals = [
  {
    role: 'School / Leader',
    icon: School,
    color: 'bg-[#4f46e5]',
    light: 'bg-[#eef2ff]',
    text: 'text-[#4f46e5]',
    border: 'border-[#4f46e5]/20',
    desc: 'Refer students, manage support plans, and track academic progress across your school.',
    path: '/twotrx/school',
    cta: 'Enter School Portal',
  },
  {
    role: 'Parent / Guardian',
    icon: Users,
    color: 'bg-[#0891b2]',
    light: 'bg-[#ecfeff]',
    text: 'text-[#0891b2]',
    border: 'border-[#0891b2]/20',
    desc: 'Find qualified tutors, book sessions, and track your child\'s growth plan.',
    path: '/twotrx/parent',
    cta: 'Enter Parent Portal',
  },
  {
    role: 'Tutor / Teacher',
    icon: GraduationCap,
    color: 'bg-[#059669]',
    light: 'bg-[#ecfdf5]',
    text: 'text-[#059669]',
    border: 'border-[#059669]/20',
    desc: 'Apply to tutor, manage your schedule, track sessions, and grow your earnings.',
    path: '/twotrx/tutor',
    cta: 'Enter Tutor Portal',
  },
  {
    role: 'TwotrX Admin',
    icon: ShieldCheck,
    color: 'bg-[#dc2626]',
    light: 'bg-[#fef2f2]',
    text: 'text-[#dc2626]',
    border: 'border-[#dc2626]/20',
    desc: 'Manage applications, approvals, payments, payouts, and platform health.',
    path: '/twotrx/admin',
    cta: 'Enter Admin Dashboard',
  },
];

const features = [
  { icon: BookOpen, label: 'Targeted Academic Support', desc: 'Subject-specific intervention led by certified teachers' },
  { icon: MapPin, label: 'Location-Based Matching', desc: 'Virtual, in-person, and hybrid sessions near you' },
  { icon: Calendar, label: 'Calendly-Style Booking', desc: 'Seamless scheduling with real-time availability' },
  { icon: Star, label: 'Verified Tutor Profiles', desc: 'Background-checked, credentialed educators only' },
];

export default function TwotrXHome() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Hero */}
      <div className="bg-[#0a0f1e] text-white px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#4f46e5]/20 border border-[#4f46e5]/30 rounded-full px-4 py-1.5 mb-6">
            <div className="w-5 h-5 rounded-md bg-[#4f46e5] flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">2X</span>
            </div>
            <span className="text-[#818cf8] text-sm font-medium">by edXponential</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            TwotrX
          </h1>
          <p className="text-xl text-white/60 mb-3">Qualified Teacher-Led Tutoring & Academic Intervention</p>
          <p className="text-white/40 max-w-2xl mx-auto text-base leading-relaxed">
            Connecting schools, parents, and students with certified educators for high-impact, 
            personalized academic support — grades 1 through 12.
          </p>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#4f46e5]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portal Cards */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <p className="text-center text-slate-500 text-sm font-medium mb-2 uppercase tracking-widest">Choose Your Portal</p>
        <h2 className="text-center text-3xl font-bold text-slate-900 mb-10">Who are you?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {portals.map(({ role, icon: Icon, color, light, text, border, desc, path, cta }) => (
            <Link key={role} to={path}
              className={`group block bg-white rounded-2xl border-2 ${border} p-7 hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl ${light} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${text}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-bold uppercase tracking-wider ${text} mb-1`}>{role}</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
              <div className={`mt-5 flex items-center gap-2 ${text} text-sm font-semibold`}>
                {cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}