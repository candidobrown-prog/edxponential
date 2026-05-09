import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Globe, DollarSign, Users, Award, Sparkles, Loader2,
  CheckCircle2, ChevronRight, Plus, Share2, Zap, Target,
  BarChart3, Star, Lock, Unlock, ArrowUpRight, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const PRICING_MODELS = [
  { icon: DollarSign, label: 'One-Time Purchase', desc: 'Set a fixed course price', selected: true },
  { icon: Crown, label: 'Subscription Access', desc: 'Monthly or annual membership' },
  { icon: Award, label: 'Certification Bundle', desc: 'Course + certificate package' },
  { icon: Users, label: 'Team / Enterprise', desc: 'Bulk licensing for organizations' },
  { icon: Zap, label: 'Free + Upsell', desc: 'Free intro, paid advanced content' },
  { icon: Star, label: 'Coaching Add-On', desc: 'Course + 1:1 coaching sessions' },
];

const INTEGRATIONS = [
  { label: 'LMS Export (SCORM)', connected: false },
  { label: 'Google Classroom', connected: false },
  { label: 'Canvas LMS', connected: false },
  { label: 'Zapier / Webhooks', connected: false },
  { label: 'Email Marketing', connected: false },
  { label: 'Paiy Graiedx™', connected: true },
];

export default function ClassifiedxPublish() {
  const [selectedModel, setSelectedModel] = useState(0);
  const [price, setPrice] = useState('197');
  const [loading, setLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState('');

  const handleAIDescription = async () => {
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a compelling, high-converting course sales page description for a course called "Classroom Management Masterclass for Educators". 

Write a professional, persuasive sales copy that:
- Has a powerful hook
- Addresses pain points
- Lists key benefits and outcomes
- Creates urgency
- Has a strong CTA
- Targets educators and teachers
- Is appropriate for a premium $197 course

Keep it under 300 words. Make it feel premium and authoritative.`,
      });
      setAiDescription(res);
      toast.success('Sales copy generated!');
    } catch (e) {
      toast.error('Generation failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight text-white">Publish & Monetize</h1>
          </div>
          <p className="text-xs text-white/30">Publish, price, and distribute your educational content globally</p>
        </div>
        <Button className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
          <Globe className="w-3.5 h-3.5" /> Publish Course
        </Button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Revenue Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Revenue', value: '$27,500', sub: 'All time' },
            { label: 'This Month', value: '$4,200', sub: '+18% vs last' },
            { label: 'Avg Course Price', value: '$147', sub: 'Across portfolio' },
            { label: 'Conversion Rate', value: '4.8%', sub: 'Page visitors' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="border border-white/8 rounded-2xl p-4 bg-white/2">
              <p className="text-[11px] text-white/30 font-bold mb-1">{label}</p>
              <p className="font-black text-xl text-white">{value}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Pricing Models */}
        <div>
          <h3 className="font-black text-sm text-white mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-white/40" /> Pricing Model</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PRICING_MODELS.map(({ icon: Icon, label, desc }, i) => (
              <button key={label} onClick={() => setSelectedModel(i)}
                className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-left transition-all ${selectedModel === i ? 'border-white bg-white/8' : 'border-white/8 hover:border-white/20 hover:bg-white/4'}`}>
                <Icon className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/50" />
                <div>
                  <div className="text-xs font-black text-white/80">{label}</div>
                  <div className="text-[10px] text-white/30 mt-0.5">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Config */}
        <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
          <h3 className="font-black text-sm text-white mb-4">Pricing Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Course Price (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <Input value={price} onChange={e => setPrice(e.target.value)}
                  className="pl-8 bg-white/5 border-white/10 text-white focus:border-white/30" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Currency</label>
              <Select defaultValue="usd">
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  {['USD', 'EUR', 'GBP', 'CAD', 'AUD'].map(c => <SelectItem key={c} value={c.toLowerCase()} className="text-xs focus:bg-white/10 focus:text-white">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Discount / Promo</label>
              <Input placeholder="e.g. LAUNCH50" className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30" />
            </div>
          </div>
        </div>

        {/* AI Sales Copy */}
        <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-sm text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-white/40" /> AI Sales Page Copy</h3>
            <Button onClick={handleAIDescription} disabled={loading}
              variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5 h-8 px-3">
              {loading ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating</> : <><Sparkles className="w-3 h-3" /> Generate</>}
            </Button>
          </div>
          {aiDescription ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{aiDescription}</p>
            </motion.div>
          ) : (
            <p className="text-xs text-white/25 italic">Click "Generate" to create AI-powered sales copy for your course...</p>
          )}
        </div>

        {/* Integrations */}
        <div>
          <h3 className="font-black text-sm text-white mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-white/40" /> Distribution & Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {INTEGRATIONS.map(({ label, connected }) => (
              <div key={label} className="flex items-center justify-between p-3.5 border border-white/8 rounded-xl bg-white/2">
                <span className="text-xs font-bold text-white/60">{label}</span>
                <Button variant="outline" className={`text-xs font-black rounded-full h-7 px-3 transition-all ${connected ? 'border-white/20 text-white/60 hover:bg-white/5' : 'border-white/10 text-white/30 hover:bg-white/4'}`}>
                  {connected ? <><CheckCircle2 className="w-3 h-3" /> Connected</> : <>Connect</>}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Controls */}
        <div className="border border-white/10 rounded-2xl p-5 bg-white/3">
          <h3 className="font-black text-sm text-white mb-4">Publication Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Globe, label: 'Publish Publicly', action: 'primary' },
              { icon: Lock, label: 'Private Link', action: 'outline' },
              { icon: Share2, label: 'Share to Community', action: 'outline' },
              { icon: ArrowUpRight, label: 'Export to LMS', action: 'outline' },
            ].map(({ icon: Icon, label, action }) => (
              <Button key={label} variant={action === 'primary' ? 'default' : 'outline'}
                className={action === 'primary'
                  ? 'bg-white text-black font-black text-xs rounded-xl hover:bg-white/90'
                  : 'border-white/15 text-white text-xs font-black rounded-xl hover:bg-white/5'}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}