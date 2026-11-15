import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Building2, Sparkles, Loader2, CheckCircle2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const OPS_SECTIONS = [
  { id: 'staffing_plan', label: 'Staffing Structure & Org Chart', desc: 'Full staffing model and organizational design' },
  { id: 'daily_schedule', label: 'Master School Schedule', desc: 'Bell schedule, instructional minutes, rotations' },
  { id: 'school_calendar', label: 'Annual School Calendar', desc: '180-day calendar with PD, testing, events' },
  { id: 'hr_systems', label: 'HR & Talent Systems', desc: 'Hiring, onboarding, retention, exit procedures' },
  { id: 'facilities_plan', label: 'Facilities Acquisition Plan', desc: 'Site selection, lease/purchase, renovation' },
  { id: 'transportation_plan', label: 'Transportation Plan', desc: 'Bus routes, safety, vendor management' },
  { id: 'food_service_plan', label: 'Food Service Plan', desc: 'Meal program, USDA, nutrition requirements' },
  { id: 'safety_plan', label: 'School Safety & Emergency Plan', desc: 'Safety protocols, drills, crisis management' },
  { id: 'technology_ops', label: 'Technology Operations Plan', desc: 'Infrastructure, devices, support systems' },
  { id: 'vendor_management', label: 'Vendor & Contract Management', desc: 'Procurement, contracts, vendor oversight' },
  { id: 'communications_plan', label: 'School Communications Plan', desc: 'Parent communication, media, branding' },
  { id: 'implementation_timeline', label: 'Year 1 Launch Timeline', desc: 'Month-by-month pre-opening implementation' },
];

export default function FoundaitionxOperations() {
  const [generated, setGenerated] = useState({});
  const [loading, setLoading] = useState(null);
  const [active, setActive] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [state, setState] = useState('');

  const generate = async (id, label) => {
    setLoading(id);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert charter school operations director and management consultant.

Write a comprehensive "${label}" for ${schoolName || 'a charter school'} in ${state || 'the United States'}.

Include all critical operational elements, timelines, responsibilities, and systems. 600-900 words.`
      });
      setGenerated(prev => ({ ...prev, [id]: res }));
      toast.success(`${label} generated!`);
    } catch { toast.error('Failed'); }
    setLoading(null);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight">Operations Builder</h1>
          </div>
          <p className="text-xs text-white/30">Staffing, facilities, safety, schedules, and operational systems</p>
        </div>
        <div className="flex gap-2">
          <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="School Name"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 w-36" />
          <input value={state} onChange={e => setState(e.target.value)} placeholder="State"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 w-24" />
          <Button onClick={() => OPS_SECTIONS.forEach(s => generate(s.id, s.label))} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Generate All
          </Button>
        </div>
      </div>
      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {OPS_SECTIONS.map(({ id, label, desc }) => {
          const isDone = !!generated[id];
          return (
            <div key={id} className={`border rounded-xl p-4 transition-all ${isDone ? 'border-white/15 bg-white/3' : 'border-white/6'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-white/50 mt-0.5 flex-shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-white/12 mt-0.5 flex-shrink-0" />}
                  <div>
                    <div className="text-xs font-black text-white/70">{label}</div>
                    <div className="text-[10px] text-white/25">{desc}</div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {isDone && <button onClick={() => setActive(active === id ? null : id)} className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"><Eye className="w-3 h-3 text-white/30" /></button>}
                  <Button onClick={() => generate(id, label)} disabled={loading === id} variant="outline"
                    className="border-white/10 text-white text-[11px] font-black rounded-lg hover:bg-white/5 h-7 px-2.5">
                    {loading === id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles className="w-3 h-3" /> {isDone ? 'Regen' : 'Build'}</>}
                  </Button>
                </div>
              </div>
              {active === id && generated[id] && (
                <div className="mt-3 pt-3 border-t border-white/8 max-h-48 overflow-y-auto">
                  <p className="text-sm text-white/45 leading-relaxed whitespace-pre-wrap">{generated[id]}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}