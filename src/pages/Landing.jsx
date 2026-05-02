import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Users, BookOpen, CheckCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '500+', label: 'edVisors Worldwide' },
  { value: '$2B+', label: 'Capital in Network' },
  { value: '1,200+', label: 'Schools Impacted' },
  { value: '98%', label: 'Member Retention' },
];

const features = [
  { icon: BookOpen, title: 'Execution Curriculum', desc: 'Deep content built by leaders who have scaled institutions — not studied them.' },
  { icon: Users, title: 'edVisor Network', desc: 'Private access to vetted operators who have built, scaled, and exited.' },
  { icon: Star, title: 'Capital Network', desc: 'A dedicated lane connecting founders with high-conviction education investors.' },
];

const testimonials = [
  { name: 'Dr. Amara Osei', title: 'Founder, Horizon Academy', quote: 'edXponential gave me the frameworks and mentorship I needed to triple our enrollment in 18 months.', stars: 5 },
  { name: 'Marcus Webb', title: 'Superintendent, Eastside USD', quote: 'The edVisor sessions were transformative. My advisor pushed me in ways that no consulting firm ever had.', stars: 5 },
  { name: 'Priya Nair', title: 'CEO, BridgeEd Charter', quote: 'The community alone is worth it. I found my co-founder in a discussion thread.', stars: 5 },
];

export default function Landing() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCapture = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await base44.entities.EmailCapture.create({ email, full_name: name, source: 'landing_page' });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-black/8">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-7 w-auto invert"
          />
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">Sign In</Link>
            <Link to="/">
              <Button className="bg-black text-white hover:bg-black/85 rounded-lg h-9 px-5 text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-white/10 text-white/80 border-white/20 mb-6 px-4 py-1.5 text-xs uppercase tracking-widest">
            Invite Only · Private Ecosystem
          </Badge>
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Where power<br />
            <span className="text-white/40">meets education.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            edXponential is a private operating system for elite education founders, executives, and investors. Access. Execution. Capital. Results.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="bg-white text-black hover:bg-white/90 rounded-lg h-12 px-8 text-base font-semibold gap-2">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-lg h-12 px-8 text-base gap-2">
                See How It Works <ChevronDown className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-black border-t border-white/8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-heading font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-white/40 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4">Everything you need to lead at scale</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three pillars that compound on each other — learning, mentorship, and community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="border border-black/8 rounded-xl p-8 hover:border-black/20 transition-colors">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl font-bold text-center mb-16">What leaders say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-black/6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-black text-black" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold mb-4">Ready to lead exponentially?</h2>
          <p className="text-white/50 mb-10 text-base">Join 500+ education leaders already on the platform.</p>
          {submitted ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-12 h-12 text-white" />
              <p className="text-white/70">You're on the list. We'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={handleCapture} className="space-y-3">
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-white/8 border-white/15 text-white placeholder:text-white/30 rounded-lg h-12"
              />
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-white/8 border-white/15 text-white placeholder:text-white/30 rounded-lg h-12"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-white/90 rounded-lg h-12 text-base font-semibold"
              >
                {loading ? 'Joining...' : 'Join edXponential →'}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-black border-t border-white/8 text-center">
        <img
          src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
          alt="edXponential"
          className="h-6 w-auto mx-auto mb-4 opacity-50"
        />
        <p className="text-white/25 text-xs">© 2026 edXponential. Built for education leaders.</p>
      </footer>
    </div>
  );
}