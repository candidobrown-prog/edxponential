import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Sparkles, Mic, Play, Wand2, Upload, Globe, Loader2,
  User, Sliders, Layers, ChevronRight, Download, Share2,
  Camera, Paintbrush, Volume2, Subtitles, Languages, Zap,
  Monitor, FileVideo, Plus, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AVATARS = [
  { id: 'educator_f', label: 'Dr. Maya', role: 'Educator', initials: 'DM', color: 'bg-white/10' },
  { id: 'educator_m', label: 'Prof. James', role: 'Professor', initials: 'PJ', color: 'bg-white/8' },
  { id: 'coach_f', label: 'Coach Elena', role: 'Coach', initials: 'CE', color: 'bg-white/10' },
  { id: 'exec_m', label: 'Director Marcus', role: 'Executive', initials: 'DM', color: 'bg-white/8' },
  { id: 'youth_f', label: 'Ms. Rivera', role: 'Youth Educator', initials: 'MR', color: 'bg-white/10' },
  { id: 'custom', label: 'Custom Avatar', role: 'Upload yours', initials: '+', color: 'bg-white/5 border-dashed' },
];

const VIDEO_STYLES = [
  { value: 'professional', label: 'Professional Studio' },
  { value: 'classroom', label: 'Classroom Setting' },
  { value: 'cinematic', label: 'Cinematic Dark' },
  { value: 'whiteboard', label: 'Whiteboard Explainer' },
  { value: 'animated', label: 'Animated Lesson' },
  { value: 'documentary', label: 'Documentary Style' },
];

const LANGUAGES = ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Portuguese', 'German', 'Japanese', 'Hindi', 'Korean'];

const VIDEO_TYPES = [
  { icon: Video, label: 'Lecture Video', desc: 'Full lesson delivery' },
  { icon: Wand2, label: 'AI Explainer', desc: 'Concept breakdown' },
  { icon: User, label: 'Avatar Presentation', desc: 'Avatar-led teaching' },
  { icon: Monitor, label: 'Screen Tutorial', desc: 'How-to walkthrough' },
  { icon: Camera, label: 'Scenario-Based', desc: 'Role-play learning' },
  { icon: FileVideo, label: 'Prompt-to-Video', desc: 'Full generation' },
];

export default function ClassifiedxStudio() {
  const [script, setScript] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('educator_f');
  const [videoStyle, setVideoStyle] = useState('professional');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [videoType, setVideoType] = useState('Lecture Video');

  const handleGenerateScript = async () => {
    if (!script.trim()) { toast.error('Please enter a topic or prompt.'); return; }
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an elite educational video scriptwriter and instructional designer. Create a professional, engaging video script for an educational lesson.

VIDEO TOPIC / PROMPT: ${script}
VIDEO TYPE: ${videoType}
STYLE: ${videoStyle}
LANGUAGE: ${language}

Create a complete, production-ready video script with:
- Hook opening
- Clear learning objectives stated verbally
- Well-structured lesson delivery
- Engaging examples and analogies
- Visual cues and B-roll suggestions in brackets [like this]
- Clear transitions between sections
- Knowledge check moments
- Strong closing and call-to-action

Make it feel cinematic, professional, and highly educational.`,
        response_json_schema: {
          type: 'object',
          properties: {
            video_title: { type: 'string' },
            duration_estimate: { type: 'string' },
            learning_objectives: { type: 'array', items: { type: 'string' } },
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  section_name: { type: 'string' },
                  duration: { type: 'string' },
                  script: { type: 'string' },
                  visual_direction: { type: 'string' },
                  b_roll_suggestions: { type: 'array', items: { type: 'string' } },
                  on_screen_text: { type: 'array', items: { type: 'string' } },
                }
              }
            },
            production_notes: { type: 'string' },
            engagement_moments: { type: 'array', items: { type: 'string' } },
          }
        }
      });
      setGeneratedScript(res);
      toast.success('Script generated!');
    } catch (e) {
      toast.error('Script generation failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight text-white">AI Video Studio</h1>
          </div>
          <p className="text-xs text-white/30">Generate cinematic educational videos with AI avatars</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5">
            <Upload className="w-3.5 h-3.5" /> Upload Script
          </Button>
          <Button className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
            <Play className="w-3.5 h-3.5" /> Generate Video
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Video Type */}
            <div>
              <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-3 block">Video Type</label>
              <div className="grid grid-cols-3 gap-2">
                {VIDEO_TYPES.map(({ icon: Icon, label, desc }) => (
                  <button key={label} onClick={() => setVideoType(label)}
                    className={`p-3 rounded-xl border text-left transition-all ${videoType === label ? 'border-white bg-white/8 text-white' : 'border-white/8 text-white/40 hover:border-white/20 hover:bg-white/4'}`}>
                    <Icon className="w-4 h-4 mb-1.5" />
                    <div className="text-xs font-black">{label}</div>
                    <div className="text-[10px] opacity-60 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Script Input */}
            <div>
              <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Topic / Script / Prompt</label>
              <Textarea
                value={script}
                onChange={e => setScript(e.target.value)}
                placeholder="e.g. Create a 5-minute video explaining the causes and effects of the Civil Rights Movement for high school students, using a professional educator avatar with cinematic visuals..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[130px] text-sm resize-none focus:border-white/30 rounded-xl"
              />
            </div>

            {/* Config */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Style</label>
                <Select value={videoStyle} onValueChange={setVideoStyle}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white">
                    {VIDEO_STYLES.map(s => (
                      <SelectItem key={s.value} value={s.value} className="text-xs focus:bg-white/10 focus:text-white">{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white">
                    {LANGUAGES.map(l => (
                      <SelectItem key={l} value={l} className="text-xs focus:bg-white/10 focus:text-white">{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Duration</label>
                <Select defaultValue="5min">
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white">
                    {['2 min', '5 min', '10 min', '15 min', '20 min', '30 min', 'Auto'].map(d => (
                      <SelectItem key={d} value={d} className="text-xs focus:bg-white/10 focus:text-white">{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AI Features */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Subtitles, label: 'Auto Subtitles' },
                { icon: Languages, label: 'AI Dubbing' },
                { icon: Volume2, label: 'Voice Clone' },
                { icon: Zap, label: 'AI B-Roll' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 p-2.5 border border-white/8 rounded-xl bg-white/3 cursor-pointer hover:bg-white/5 transition-all">
                  <Icon className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-[11px] font-bold text-white/40">{label}</span>
                </div>
              ))}
            </div>

            <Button onClick={handleGenerateScript} disabled={loading || !script.trim()}
              className="w-full bg-white text-black font-black h-12 rounded-xl text-sm hover:bg-white/90">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Script...</> : <><Sparkles className="w-4 h-4" /> Generate Video Script & Production Plan</>}
            </Button>

            {/* Generated Script */}
            <AnimatePresence>
              {generatedScript && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="border border-white/10 rounded-2xl p-5 bg-white/3">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-black text-white">{generatedScript.video_title}</h3>
                        <p className="text-xs text-white/30 mt-0.5">Estimated duration: {generatedScript.duration_estimate}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5 h-8 px-3">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5 h-8 px-3">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    {generatedScript.sections?.map((section, i) => (
                      <div key={i} className="border-t border-white/5 pt-4 mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-black text-sm text-white/80">{section.section_name}</div>
                          <div className="text-[10px] text-white/25 border border-white/10 rounded-full px-2 py-0.5">{section.duration}</div>
                        </div>
                        {section.visual_direction && (
                          <div className="text-[11px] text-white/25 italic mb-2 flex items-start gap-1.5"><Camera className="w-3 h-3 mt-0.5 flex-shrink-0" />{section.visual_direction}</div>
                        )}
                        <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{section.script}</p>
                        {section.b_roll_suggestions?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {section.b_roll_suggestions.map((b, j) => (
                              <span key={j} className="text-[10px] bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-white/30">[B-roll: {b}]</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {generatedScript.production_notes && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-1.5">Production Notes</p>
                        <p className="text-xs text-white/40">{generatedScript.production_notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel — Avatar Selector */}
          <div className="space-y-5">
            <div>
              <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-3 block">Select Avatar</label>
              <div className="grid grid-cols-2 gap-2">
                {AVATARS.map(av => (
                  <button key={av.id} onClick={() => setSelectedAvatar(av.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${selectedAvatar === av.id ? 'border-white bg-white/8' : 'border-white/8 hover:border-white/20 hover:bg-white/4'}`}>
                    <div className={`w-10 h-10 rounded-full ${av.color} border border-white/10 flex items-center justify-center text-sm font-black text-white/60 mx-auto mb-2`}>
                      {av.initials}
                    </div>
                    <div className="text-[11px] font-black text-white/70">{av.label}</div>
                    <div className="text-[10px] text-white/25">{av.role}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Customization */}
            <div className="border border-white/8 rounded-2xl p-4 space-y-3">
              <p className="text-[11px] font-black text-white/30 uppercase tracking-widest">Customize Avatar</p>
              {[
                { icon: Paintbrush, label: 'Appearance' },
                { icon: Volume2, label: 'Voice & Tone' },
                { icon: Sliders, label: 'Personality' },
                { icon: Zap, label: 'Gestures' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="w-full flex items-center justify-between p-2.5 rounded-lg border border-white/5 hover:bg-white/4 hover:border-white/15 transition-all">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-xs font-bold text-white/50">{label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="border border-white/8 rounded-2xl overflow-hidden bg-white/2">
              <div className="aspect-video flex items-center justify-center bg-white/3">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/8 flex items-center justify-center mx-auto mb-3">
                    <User className="w-7 h-7 text-white/30" />
                  </div>
                  <p className="text-xs text-white/20 font-bold">Avatar Preview</p>
                  <p className="text-[10px] text-white/15">Generate script to preview</p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-[11px] text-white/30 font-bold">{AVATARS.find(a => a.id === selectedAvatar)?.label}</span>
                <Button className="bg-white text-black font-black text-[10px] h-7 px-3 rounded-full hover:bg-white/90">
                  <Play className="w-3 h-3" /> Preview
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[['0', 'Videos Created'], ['0 min', 'Total Runtime'], ['0', 'Languages'], ['0', 'Published']].map(([val, lbl]) => (
                <div key={lbl} className="border border-white/8 rounded-xl p-3 text-center bg-white/2">
                  <div className="font-black text-white text-sm">{val}</div>
                  <div className="text-[10px] text-white/25 mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}