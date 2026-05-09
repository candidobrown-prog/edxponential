import React, { useState } from 'react';
import { Store, Sparkles, Loader2, Palette, Type, Layout, Image, Globe, Copy, Eye, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const THEMES = [
  { id: 'minimal', label: 'Minimal', desc: 'Clean, white-space focused', preview: 'bg-white' },
  { id: 'bold', label: 'Bold', desc: 'High-contrast, impactful', preview: 'bg-black' },
  { id: 'warm', label: 'Warm', desc: 'Earthy tones, inviting', preview: 'bg-amber-50' },
  { id: 'academic', label: 'Academic', desc: 'Professional, scholarly', preview: 'bg-slate-800' },
];

const LAYOUTS = [
  { id: 'grid', label: 'Grid', icon: '⊞' },
  { id: 'list', label: 'List', icon: '≡' },
  { id: 'magazine', label: 'Magazine', icon: '❏' },
  { id: 'showcase', label: 'Showcase', icon: '◈' },
];

export default function EduCartxStorefront() {
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('minimal');
  const [layout, setLayout] = useState('grid');
  const [aiLoading, setAiLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [activeTab, setActiveTab] = useState('branding');

  const generateWithAI = async () => {
    if (!storeName) { toast.error('Enter your store name first'); return; }
    setAiLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an elite brand strategist for EduCartx™, an education marketplace. Create a complete storefront brand package for "${storeName}".

Return JSON with: { tagline, bio (2 sentences), hero_headline, hero_subtext, featured_collections: [string x3], seo_description, brand_promise, call_to_action }`,
        response_json_schema: {
          type: 'object',
          properties: {
            tagline: { type: 'string' }, bio: { type: 'string' },
            hero_headline: { type: 'string' }, hero_subtext: { type: 'string' },
            featured_collections: { type: 'array', items: { type: 'string' } },
            seo_description: { type: 'string' }, brand_promise: { type: 'string' },
            call_to_action: { type: 'string' }
          }
        },
        model: 'claude_sonnet_4_6'
      });
      setGenerated(res);
      if (res.tagline) setTagline(res.tagline);
      if (res.bio) setBio(res.bio);
      toast.success('Storefront brand generated!');
    } catch { toast.error('Generation failed'); }
    setAiLoading(false);
  };

  const TABS = [
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'design', label: 'Design', icon: Layout },
    { id: 'content', label: 'Content', icon: Type },
    { id: 'publish', label: 'Publish', icon: Globe },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-white/50" />
            <h1 className="font-black text-lg tracking-tight">AI Storefront Builder</h1>
          </div>
          <p className="text-xs text-white/30">Build a premium branded storefront with AI in minutes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white/50 text-xs h-8 px-3 hover:bg-white/5 gap-1.5 rounded-full">
            <Eye className="w-3.5 h-3.5" /> Preview
          </Button>
          <Button className="bg-white text-black font-black text-xs h-8 px-4 hover:bg-white/90 rounded-full gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Publish Store
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 px-8 flex gap-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-black transition-all border-b-2 -mb-px ${activeTab === id ? 'border-white text-white' : 'border-transparent text-white/30 hover:text-white/60'}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      <div className="px-8 py-6 max-w-4xl">
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="border border-white/8 rounded-2xl p-6 bg-white/2">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-4 h-4 text-white/40" />
                <span className="text-xs font-black text-white/50 uppercase tracking-widest">AI Brand Generator</span>
              </div>
              <div className="flex gap-3">
                <input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="Enter your store name..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25" />
                <Button onClick={generateWithAI} disabled={aiLoading} className="bg-white text-black font-black text-xs h-10 px-5 rounded-xl hover:bg-white/90">
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> Generate Brand</>}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Store Name</label>
                <input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="e.g. TeachStrong Academy"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Tagline</label>
                <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="e.g. Empowering teachers worldwide"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Store Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell your story..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 resize-none" />
              </div>
            </div>

            {generated && (
              <div className="border border-white/8 rounded-2xl p-5 bg-white/2 space-y-3">
                <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-3">AI Generated Brand Package</div>
                {[
                  { label: 'Hero Headline', val: generated.hero_headline },
                  { label: 'Hero Subtext', val: generated.hero_subtext },
                  { label: 'Brand Promise', val: generated.brand_promise },
                  { label: 'Call to Action', val: generated.call_to_action },
                  { label: 'SEO Description', val: generated.seo_description },
                ].filter(f => f.val).map((f, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-white/25 font-black uppercase tracking-widest">{f.label}</div>
                      <div className="text-xs text-white/60 mt-0.5">{f.val}</div>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(f.val); toast.success('Copied!'); }}
                      className="p-1.5 rounded-lg hover:bg-white/8 flex-shrink-0">
                      <Copy className="w-3 h-3 text-white/20" />
                    </button>
                  </div>
                ))}
                {generated.featured_collections && (
                  <div>
                    <div className="text-[10px] text-white/25 font-black uppercase tracking-widest mb-1">Featured Collections</div>
                    <div className="flex gap-2 flex-wrap">
                      {generated.featured_collections.map((c, i) => (
                        <span key={i} className="text-[10px] bg-white/8 text-white/50 px-2 py-1 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {THEMES.map(t => (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    className={`border rounded-xl p-4 text-left transition-all ${theme === t.id ? 'border-white/40 bg-white/8' : 'border-white/8 bg-white/2 hover:border-white/15'}`}>
                    <div className={`w-full h-12 rounded-lg mb-3 ${t.preview}`} />
                    <div className="text-xs font-black text-white/70">{t.label}</div>
                    <div className="text-[10px] text-white/25">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Product Layout</label>
              <div className="flex gap-3">
                {LAYOUTS.map(l => (
                  <button key={l.id} onClick={() => setLayout(l.id)}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-all ${layout === l.id ? 'border-white/40 bg-white/8' : 'border-white/8 bg-white/2 hover:border-white/15'}`}>
                    <span className="text-2xl">{l.icon}</span>
                    <span className="text-xs font-black text-white/50">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            <p className="text-xs text-white/30">Manage your storefront sections, banners, and featured content.</p>
            {['Hero Banner', 'Featured Products Section', 'About Section', 'Testimonials', 'Newsletter Signup'].map((s, i) => (
              <div key={i} className="flex items-center justify-between border border-white/6 rounded-xl px-4 py-3 bg-white/2">
                <div>
                  <div className="text-sm font-black text-white/70">{s}</div>
                  <div className="text-[10px] text-white/25">Section {i + 1}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-white/10 text-white/40 text-[11px] font-black h-7 px-2.5 hover:bg-white/5 rounded-lg">Edit</Button>
                  <Button variant="ghost" className="text-white/20 text-[11px] h-7 px-2 hover:text-white/50 rounded-lg">Hide</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="space-y-5">
            <div className="border border-white/8 rounded-2xl p-6 bg-white/2">
              <Globe className="w-8 h-8 text-white/30 mb-4" />
              <h3 className="font-black text-white/80 mb-2">Ready to go live?</h3>
              <p className="text-xs text-white/30 mb-5 leading-relaxed">Your storefront will be published to the EduCartx™ marketplace and accessible at your custom URL.</p>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 mb-4">
                <span className="text-xs text-white/30">educartx.com/store/</span>
                <input defaultValue={storeName.toLowerCase().replace(/\s+/g, '-') || 'your-store'}
                  className="flex-1 bg-transparent text-sm text-white/70 focus:outline-none" />
              </div>
              <Button className="bg-white text-black font-black text-sm h-10 px-6 rounded-full hover:bg-white/90 gap-2">
                <Globe className="w-4 h-4" /> Publish Storefront
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}