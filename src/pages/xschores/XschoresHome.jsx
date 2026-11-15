import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Settings, BarChart3, ClipboardList, ArrowRight } from 'lucide-react';

export default function XschoresHome() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="max-w-2xl w-full text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-[#0a0f1e] font-black text-xl">XS</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Xschores™</h1>
        <p className="text-white/50 text-lg mb-10">Real-time student risk intelligence, culture data, and early-warning alerts for school leaders.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { to: '/xschores', icon: BarChart3, label: 'Leader Dashboard', desc: 'Schoolwide risk overview and open alerts' },
            { to: '/xschores/students', icon: Users, label: 'Students', desc: 'Individual student risk profiles' },
            { to: '/xschores/alerts', icon: ShieldAlert, label: 'Alerts', desc: 'Open alerts and follow-up tracking' },
            { to: '/xschores/benchmarks', icon: Settings, label: 'Benchmarks', desc: 'Configure thresholds and triggers' },
          ].map(({ to, icon: Icon, label, desc }) => (
            <Link key={to} to={to} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-all group">
              <Icon className="w-6 h-6 text-white/40 mb-3 group-hover:text-white transition-colors" />
              <h3 className="font-black text-white text-sm mb-1">{label}</h3>
              <p className="text-white/40 text-xs">{desc}</p>
              <ArrowRight className="w-4 h-4 text-white/20 mt-3 group-hover:text-white/60 transition-colors" />
            </Link>
          ))}
        </div>
        <Link to="/xschores" className="inline-flex items-center gap-2 bg-white text-[#0a0f1e] font-black px-8 py-3.5 rounded-2xl hover:bg-gray-100 transition-all">
          Enter Xschores <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}