import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Users, Brain, Lock } from 'lucide-react';

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <img
          src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
          alt="edXponential"
          className="h-6 w-auto"
        />
        <Link to="/signin" className="text-sm font-semibold text-black hover:text-slate-600">
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 mb-6">
              <Lock className="w-4 h-4 text-black" />
              <span className="text-xs font-semibold text-black">Application & Invite Only</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-black tracking-tight mb-4">
              The AI Operating System for Education Leaders
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              edXponential is an exclusive platform for founders, executives, principals, and educators building the future of education. Access requires application approval or invitation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/apply"
                className="h-10 px-8 rounded-lg bg-black text-white text-sm font-semibold hover:bg-slate-900 transition-all flex items-center gap-2"
              >
                Apply for Access
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="h-10 px-8 rounded-lg border border-slate-300 bg-white text-black text-sm font-semibold hover:bg-slate-50 transition-all">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Brain, title: 'AI-Powered', desc: 'Intelligent dashboards tailored to your role' },
              { icon: Users, title: 'Elite Community', desc: 'Connect with top education leaders' },
              { icon: Zap, title: 'Enterprise Tools', desc: 'Everything you need to lead transformation' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
              >
                <Icon className="w-6 h-6 text-black mb-3" />
                <h3 className="font-bold text-black mb-2">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>© 2026 edXponential. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-black">Terms</Link>
            <Link to="/privacy" className="hover:text-black">Privacy</Link>
            <Link to="/contact" className="hover:text-black">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}