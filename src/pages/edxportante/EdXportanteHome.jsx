import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Zap, Globe, ShoppingBag, Layers, Users, ArrowRight, Star, FileText, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Brain, title: 'AI Content Generation', desc: 'Generate full lesson plans, assessments, and activities in seconds — aligned to your standards.' },
  { icon: Globe, title: 'Standards Aligned', desc: 'Common Core, state standards, and custom frameworks. Every piece of content is mapped to learning outcomes.' },
  { icon: ShoppingBag, title: 'Content Marketplace', desc: 'Purchase individual lessons, full units, or subscribe for unlimited access to the entire library.' },
  { icon: Layers, title: 'Build Your Own App', desc: 'Package your curriculum into a branded internal platform for your school or network.' },
];

const contentTypes = [
  { label: 'Lesson Plans', icon: '📚' },
  { label: 'Unit Plans', icon: '🗂️' },
  { label: 'Assessments', icon: '✏️' },
  { label: 'Worksheets', icon: '📄' },
  { label: 'Intervention Plans', icon: '🎯' },
  { label: 'Curriculum Maps', icon: '🗺️' },
  { label: 'Teacher Scripts', icon: '🎭' },
  { label: 'Student Activities', icon: '🎲' },
];

export default function EdXportanteHome() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Hero */}
      <div className="bg-[#0a0f1e] text-white px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <BookOpen className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-sm">by edXponential</span>
          </div>
          <h1 className="text-6xl font-black mb-3 tracking-tight">edXportante</h1>
          <p className="text-xl text-white/60 mb-3 font-light">The Premium Curriculum & Content Engine</p>
          <p className="text-white/40 max-w-2xl mx-auto text-base leading-relaxed">
            Human-created and AI-generated instructional materials aligned to standards. 
            Built for serious education leaders, teachers, and curriculum teams.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link to="/edxportante/generate">
              <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-black px-6 h-11 gap-2">
                <Zap className="w-4 h-4" /> Generate Content
              </Button>
            </Link>
            <Link to="/edxportante/marketplace">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-black px-6 h-11">Browse Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Types */}
      <div className="bg-[#f8f8f8] border-b border-gray-100 px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest text-gray-400 mb-5">Content Types Available</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {contentTypes.map(({ label, icon }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 text-center hover:border-[#0a0f1e] transition-all cursor-pointer">
                <p className="text-2xl mb-1">{icon}</p>
                <p className="text-xs font-bold text-gray-600 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-black text-[#0a0f1e] text-center mb-10">Everything your curriculum team needs</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border-2 border-gray-100 hover:border-[#0a0f1e] p-7 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-[#0a0f1e] flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-black text-[#0a0f1e] text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing teaser */}
      <div className="bg-[#0a0f1e] text-white px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Flexible pricing for every team</h2>
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            {[['Single Lesson', '$5–$25'], ['Unit Bundle', '$50–$200'], ['Full Curriculum', '$500+'], ['Subscription', 'Monthly / Annual']].map(([l, p]) => (
              <div key={l} className="bg-white/10 border border-white/10 rounded-2xl p-5">
                <p className="font-black text-white text-sm">{l}</p>
                <p className="text-white/50 text-xs mt-1">{p}</p>
              </div>
            ))}
          </div>
          <Link to="/edxportante/pricing" className="inline-block mt-8">
            <Button className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-black px-6">View Pricing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}