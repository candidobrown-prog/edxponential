import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap, Copy, CheckCircle, RefreshCw, FileText, Video, Mic, BookOpen, Target, Hash } from 'lucide-react';

const TONES = ['Professional', 'Educational', 'Inspirational', 'Conversational', 'Executive', 'Engaging'];
const AUDIENCES = ['Education Leaders', 'Teachers', 'School Founders', 'Parents', 'Investors', 'Students', 'District Leaders'];
const CONTENT_TYPES = [
  { id: 'webinar_script', label: 'Webinar Script', icon: Mic },
  { id: 'video_script', label: 'Video Script', icon: Video },
  { id: 'course_outline', label: 'Course Outline', icon: BookOpen },
  { id: 'sales_script', label: 'Sales Script', icon: Target },
  { id: 'podcast_outline', label: 'Podcast Outline', icon: Mic },
  { id: 'seo_metadata', label: 'SEO Metadata', icon: Hash },
];

export default function TubedXAIStudio() {
  const [form, setForm] = useState({ topic: '', audience: 'Education Leaders', tone: 'Professional', length: '10', goal: '', content_type: 'video_script' });
  const [output, setOutput] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setGenerating(true);
    setOutput(null);

    const prompt = `You are an elite education content creator for a premium platform called TubedX inside edXponential.

Generate a comprehensive ${form.content_type.replace('_', ' ')} on the following topic:

Topic: ${form.topic}
Target Audience: ${form.audience}
Tone: ${form.tone}
Approximate Length: ${form.length} minutes
Goal: ${form.goal || 'Educate and inspire the audience'}

Return a complete, professional, ready-to-use script/outline with:
- Compelling title
- Introduction hook
- Main sections with timestamps
- Key talking points per section
- Transitions
- Strong CTA at the end
- 3 thumbnail title ideas
- 5 SEO keywords
- Short social media description (under 280 chars)

Format it cleanly with clear section headers.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt, model: 'claude_sonnet_4_6' });
    setOutput(result);
    setGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">TubedX™</p>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            AI Studio
          </h1>
          <p className="text-white/30 text-sm mt-1">Generate scripts, outlines, SEO metadata, and more with AI</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="font-black text-[#0a0f1e] mb-5">Content Configuration</p>

              {/* Content Type */}
              <div className="mb-5">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONTENT_TYPES.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setForm({ ...form, content_type: id })}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-black transition-all ${form.content_type === id ? 'bg-[#0a0f1e] text-white border-[#0a0f1e]' : 'border-gray-200 text-gray-500 hover:border-[#0a0f1e]'}`}>
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">Topic *</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a0f1e]" placeholder="e.g. How to Improve Teacher Retention in Charter Schools" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">Audience</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-black focus:outline-none" value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>
                      {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">Tone</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-black focus:outline-none" value={form.tone} onChange={e => setForm({ ...form, tone: e.target.value })}>
                      {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">Length (min)</label>
                    <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-black focus:outline-none" value={form.length} onChange={e => setForm({ ...form, length: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">Goal</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none" placeholder="e.g. Generate leads" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
                  </div>
                </div>

                <button onClick={generate} disabled={!form.topic || generating}
                  className="w-full py-4 bg-[#0a0f1e] text-white rounded-xl font-black text-sm disabled:opacity-50 hover:bg-[#1a2033] transition-all flex items-center justify-center gap-2">
                  {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><Zap className="w-4 h-4" />Generate {form.content_type.replace('_', ' ')}</>}
                </button>
              </div>
            </div>

            {/* AI Tips */}
            <div className="bg-[#0a0f1e] rounded-2xl p-5">
              <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-3">AI Studio Tips</p>
              <div className="space-y-2">
                {[
                  'Be specific with your topic for better output',
                  'Use "Education Leaders" audience for executive content',
                  'Generate SEO Metadata for every video you upload',
                  'Course Outlines can be turned into edXportante lessons',
                ].map(tip => (
                  <div key={tip} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-white/30 mt-2 flex-shrink-0" />
                    <p className="text-white/40 text-xs">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full min-h-[500px]">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-full py-32">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin mb-4" />
                  <p className="font-black text-[#0a0f1e]">Generating {form.content_type.replace('_', ' ')}...</p>
                  <p className="text-xs text-gray-400 mt-1">This may take 15-30 seconds</p>
                </div>
              ) : output ? (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <p className="font-black text-[#0a0f1e]">Generated Output</p>
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-black text-[#0a0f1e] hover:bg-gray-200 transition-all">
                      {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-500" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                    </button>
                  </div>
                  <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{output}</pre>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-32 text-center px-8">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="font-black text-gray-300 text-lg">AI Studio Ready</p>
                  <p className="text-gray-300 text-sm mt-2">Configure your content on the left and click Generate to create professional scripts, outlines, and metadata.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}