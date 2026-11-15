import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText, Upload, Sparkles, ArrowLeft, Save, Printer, Download,
  RefreshCw, FolderOpen, CheckCircle, Eye, Trash2, Search,
  BookOpen, Shield, Users, BarChart3, TrendingUp, Plus
} from 'lucide-react';

const DOC_CATEGORIES = [
  { id: 'policies', label: 'Policies & Handbooks', icon: Shield },
  { id: 'curriculum', label: 'Curriculum & Assessment', icon: BookOpen },
  { id: 'governance', label: 'Board & Governance', icon: Users },
  { id: 'improvement', label: 'School Improvement', icon: TrendingUp },
  { id: 'data', label: 'Data & Reports', icon: BarChart3 },
  { id: 'operations', label: 'Operations & Safety', icon: Shield },
  { id: 'pd', label: 'Professional Development', icon: Users },
  { id: 'compliance', label: 'Compliance & Accreditation', icon: CheckCircle },
];

const DOC_TYPES = [
  'Employee Handbook', 'Family Handbook', 'School Policy Manual', 'Curriculum Map',
  'Assessment Calendar', 'Board Minutes', 'Charter Documents', 'School Improvement Plan',
  'Accreditation Report', 'Strategic Plan', 'Data Report', 'Staffing Plan',
  'Coaching Notes', 'Observation Reports', 'MTSS Documentation', 'SPED Documentation',
  'PD Plan', 'Safety Plan', 'Emergency Procedures', 'Instructional Framework',
];

export default function XschInfoPage() {
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', type: '', notes: '' });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleFileUpload = async (e, category) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setDocs(prev => [...prev, {
      id: Date.now(), title: file.name, file_url, category: category || 'general',
      type: 'Upload', uploaded_at: new Date().toISOString(), status: 'uploaded'
    }]);
    setUploading(false);
  };

  const handleAnalyzeDoc = async (doc) => {
    setAnalyzing(doc.id);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert school intelligence analyst. Analyze this document titled "${doc.title}" of type "${doc.type}" and provide: 1) A 2-3 sentence executive summary, 2) 3 key insights, 3) Any compliance flags or missing information, 4) Recommendations for improvement. Be concise and actionable.`,
      model: 'claude_sonnet_4_6',
    });
    setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, ai_summary: result, status: 'analyzed' } : d));
    setAnalyzing(null);
  };

  const handleGenerateExecutiveSummary = async () => {
    setAiSummary('generating');
    const docList = docs.map(d => `- ${d.title} (${d.type})`).join('\n');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a school intelligence analyst. Based on these uploaded documents:\n${docList}\n\nGenerate an executive intelligence summary covering: 1) Overall documentation completeness, 2) Key themes and priorities, 3) Missing critical documents, 4) Strategic recommendations for school leadership.`,
      model: 'claude_sonnet_4_6',
    });
    setAiSummary(result);
  };

  const handleAddDoc = () => {
    if (!newDoc.title) return;
    setDocs(prev => [...prev, {
      id: Date.now(), ...newDoc, uploaded_at: new Date().toISOString(), status: 'manual'
    }]);
    setNewDoc({ title: '', type: '', notes: '' });
    setShowAddDoc(false);
  };

  const filtered = docs.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/goaled" className="flex items-center gap-1 text-white/30 text-xs font-black uppercase tracking-widest mb-2 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Goaled Xschool™
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Xschinfo</h1>
              <p className="text-white/40 mt-1 text-sm">AI-powered school information and intelligence hub.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={handleGenerateExecutiveSummary}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
                <Sparkles className="w-4 h-4" /> Generate Executive Summary
              </button>
              <button onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white/20 transition-all">
                <Printer className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white/20 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        {/* AI Summary */}
        {aiSummary && aiSummary !== 'generating' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0f1e] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-white/40" />
              <p className="text-white/40 text-xs font-black uppercase tracking-widest">AI Executive Summary</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{aiSummary}</p>
          </motion.div>
        )}
        {aiSummary === 'generating' && (
          <div className="bg-[#0a0f1e] rounded-2xl p-6 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-white/40 animate-spin" />
            <p className="text-white/40 text-sm">Generating executive intelligence summary...</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 bg-white"
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setShowAddDoc(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all">
            <Plus className="w-4 h-4" /> Add Document
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all cursor-pointer">
            <Upload className="w-4 h-4" /> Upload File
            <input type="file" className="hidden" onChange={e => handleFileUpload(e, activeCategory)} />
          </label>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-[#0a0f1e] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'}`}>
            All Documents
          </button>
          {DOC_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-[#0a0f1e] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'}`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Add Document Form */}
        <AnimatePresence>
          {showAddDoc && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <p className="font-black text-[#0a0f1e]">Add Document</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Document Title</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20"
                    placeholder="e.g. Employee Handbook 2024-25" value={newDoc.title} onChange={e => setNewDoc(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Document Type</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20"
                    value={newDoc.type} onChange={e => setNewDoc(p => ({ ...p, type: e.target.value }))}>
                    <option value="">Select type...</option>
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Notes</label>
                  <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 min-h-[60px] resize-none"
                    placeholder="Optional notes..." value={newDoc.notes} onChange={e => setNewDoc(p => ({ ...p, notes: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddDoc}
                  className="px-5 py-2.5 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all">Save</button>
                <button onClick={() => setShowAddDoc(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
            <FolderOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-black text-[#0a0f1e] mb-2">No documents yet</p>
            <p className="text-gray-400 text-sm">Upload documents or add entries to build your school intelligence hub.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(doc => (
              <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-[#0a0f1e] text-sm">{doc.title}</p>
                      {doc.type && <p className="text-xs text-gray-400 mt-0.5">{doc.type}</p>}
                      {doc.ai_summary && <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{doc.ai_summary}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {doc.status === 'analyzed' && <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black"><CheckCircle className="w-3 h-3" />Analyzed</span>}
                      {doc.file_url && <a href={doc.file_url} target="_blank" rel="noopener noreferrer"><button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"><Eye className="w-3.5 h-3.5 text-gray-500" /></button></a>}
                      <button onClick={() => handleAnalyzeDoc(doc)} disabled={analyzing === doc.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0a0f1e] text-white rounded-xl text-[10px] font-black hover:bg-[#1a2033] transition-all">
                        {analyzing === doc.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {analyzing === doc.id ? '...' : 'AI Analyze'}
                      </button>
                      <button onClick={() => setDocs(prev => prev.filter(d => d.id !== doc.id))}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all">
                        <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}