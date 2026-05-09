import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, ChevronRight, ChevronLeft, Cpu, Users, Settings } from 'lucide-react';

export default function PublicLandingPage() {
  const [panelOpen, setPanelOpen] = useState(true);

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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-24 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
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
                { icon: Cpu, title: 'AI-Powered', desc: 'Intelligent dashboards tailored to your role' },
                { icon: Users, title: 'Elite Community', desc: 'Connect with top education leaders' },
                { icon: Settings, title: 'Enterprise Tools', desc: 'Everything you need to lead transformation' },
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

        {/* Right Side - Brand Panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-80 bg-black border-l border-slate-800 flex flex-col items-center justify-center p-8 relative"
            >
              <div className="text-center">
                <img
                  src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
                  alt="edXponential"
                  className="h-12 w-auto brightness-0 invert mb-8 mx-auto"
                />
                <h2 className="text-5xl font-black text-white tracking-tight leading-tight">
                  edXponential
                </h2>
                <p className="text-white/60 text-sm mt-6 leading-relaxed">
                  The AI Operating System for Education Leaders
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black border border-slate-700 rounded-l-lg text-white flex items-center justify-center hover:bg-slate-900 transition-all z-10"
        >
          {panelOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
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