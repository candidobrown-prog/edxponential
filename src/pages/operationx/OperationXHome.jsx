import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Zap, Shield, BarChart3, Users, Building2, Package,
  CreditCard, Brain, ChevronRight, CheckCircle, Globe, Star,
  TrendingUp, Lock, Activity, Command, Layers
} from 'lucide-react';

const MODULES = [
  { icon: BarChart3, tag: 'Finance', name: 'FinanceX™', desc: 'Budget, forecasting & fund accounting', path: '/operationx/finance', color: 'from-slate-800 to-slate-900' },
  { icon: Users, tag: 'HR', name: 'PeopleX™', desc: 'Payroll, HR & employee lifecycle', path: '/operationx/hr', color: 'from-slate-800 to-slate-900' },
  { icon: Building2, tag: 'Facilities', name: 'FacilitiesX™', desc: 'Floorplans, maintenance & assets', path: '/operationx/facilities', color: 'from-slate-800 to-slate-900' },
  { icon: Shield, tag: 'Safety', name: 'SafetyX™', desc: 'Compliance, safety & incidents', path: '/operationx/safety', color: 'from-slate-800 to-slate-900' },
  { icon: Globe, tag: 'Vendors', name: 'ProcureX™', desc: 'Procurement & vendor management', path: '/operationx/vendors', color: 'from-slate-800 to-slate-900' },
  { icon: CreditCard, tag: 'Payments', name: 'PayX™', desc: 'Tuition, fees & payment acceptance', path: '/operationx/payments', color: 'from-slate-800 to-slate-900' },
  { icon: Package, tag: 'Inventory', name: 'InvenX™', desc: 'Assets, barcodes & stock tracking', path: '/operationx/inventory', color: 'from-slate-800 to-slate-900' },
  { icon: Brain, tag: 'OpsAI', name: 'OpsAI™', desc: 'Operational intelligence engine', path: '/operationx/opsai', color: 'from-slate-800 to-slate-900' },
];

const STATS = [
  { value: '500+', label: 'Schools Onboarded' },
  { value: '$2.4B', label: 'Managed Annually' },
  { value: '99.98%', label: 'Uptime SLA' },
  { value: '94%', label: 'Ops Cost Reduction' },
];

const FEATURES = [
  { icon: Lock, text: 'SOC 2 Type II Certified' },
  { icon: Globe, text: 'Multi-State Compliance' },
  { icon: Activity, text: 'Real-Time Monitoring' },
  { icon: Command, text: 'AI-Powered Automation' },
  { icon: Layers, text: 'Role-Based Access Control' },
  { icon: Zap, text: 'Instant Deployment' },
];

export default function OperationXHome() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#05050a] text-white font-body overflow-x-hidden">
      {/* Nav */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#05050a]/95 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Command className="w-4 h-4 text-black" />
            </div>
            <span className="font-black text-white tracking-tight">OperationX™</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/40">
            {['Platform', 'Finance', 'HR', 'Safety', 'Pricing'].map(l => (
              <a key={l} href="#modules" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <Link to="/operationx">
            <button className="h-9 px-5 rounded-lg bg-white text-black text-sm font-bold hover:bg-white/90 transition-all active:scale-95">
              Launch Platform →
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.04),transparent)]" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/4 mb-8 text-[10px] text-white/40 font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              School Operations Command Center · Enterprise Grade
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-[-0.04em] leading-[0.9] mb-6 text-balance">
            <span className="text-white">Run Schools Like</span><br />
            <span className="text-white/20">the World's Best</span><br />
            <span className="text-white">Companies.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-white/35 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            OperationX™ is the world's first School Operations Command Center — integrating finance, HR, payroll, facilities, safety, procurement, inventory, and AI into one enterprise platform.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link to="/operationx">
              <button className="group h-12 px-8 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-2">
                Enter Command Center <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <a href="#modules">
              <button className="h-12 px-8 rounded-xl border border-white/10 text-white/60 font-semibold text-sm hover:border-white/20 hover:text-white transition-all">
                Explore Modules
              </button>
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-[11px] text-white/25">
                <Icon className="w-3 h-3 text-white/30" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5 bg-[#08080f]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="text-4xl font-black text-white tracking-[-0.04em] mb-1">{s.value}</p>
              <p className="text-[10px] text-white/25 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-black mb-4">The Full Platform Suite</p>
            <h2 className="text-5xl font-black text-white tracking-[-0.04em] mb-4">
              Every system.<br /><span className="text-white/20">One command center.</span>
            </h2>
            <p className="text-white/30 max-w-lg mx-auto">Eight enterprise-grade modules that cover every operational function of a modern school.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODULES.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={m.path} className="group block p-6 rounded-2xl border border-white/6 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center group-hover:bg-white/12 transition-colors">
                      <m.icon className="w-4.5 h-4.5 text-white/60" />
                    </div>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest border border-white/8 px-2 py-0.5 rounded-full">{m.tag}</span>
                  </div>
                  <p className="font-black text-sm text-white mb-1 tracking-tight">{m.name}</p>
                  <p className="text-[11px] text-white/30 leading-relaxed">{m.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-[10px] text-white/20 group-hover:text-white/40 transition-colors font-bold">
                    Open module <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl font-black text-white tracking-[-0.04em] mb-5">
              The operating system<br /><span className="text-white/20">for elite schools.</span>
            </h2>
            <p className="text-white/30 mb-10">Join hundreds of school leaders who run their entire operation from one platform.</p>
            <Link to="/operationx">
              <button className="group h-12 px-10 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-2 mx-auto">
                Launch OperationX™ <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
              <Command className="w-3 h-3 text-white/50" />
            </div>
            <span className="text-xs text-white/20 font-black">OperationX™ by edXponential</span>
          </div>
          <p className="text-[10px] text-white/15">© 2026 · Enterprise School Operations Platform</p>
        </div>
      </footer>
    </div>
  );
}