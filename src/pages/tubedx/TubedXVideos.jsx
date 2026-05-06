import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, Play, Eye, Clock, Search, Filter, Grid, List, Plus, X, CheckCircle, Video, BarChart3, Download, Lock, Globe, Users } from 'lucide-react';

const VISIBILITY_ICONS = { public: Globe, private: Lock, password: Lock, invite_only: Users, team_only: Users, school_only: Users };

function UploadModal({ onClose, onSaved, userEmail }) {
  const [form, setForm] = useState({ title: '', description: '', visibility: 'private', video_type: 'upload', category: '', tags: '' });
  const [file, setFile] = useState(null);
  const [thumb, setThumb] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setUploading(true);
    let video_url = '';
    let thumbnail_url = '';
    if (file) {
      const res = await base44.integrations.Core.UploadFile({ file });
      video_url = res.file_url;
    }
    if (thumb) {
      const res = await base44.integrations.Core.UploadFile({ file: thumb });
      thumbnail_url = res.file_url;
    }
    const tagsArr = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const saved = await base44.entities.TubedXVideo.create({
      ...form, video_url, thumbnail_url, owner_email: userEmail, status: video_url ? 'ready' : 'draft', tags: tagsArr
    });
    setDone(true);
    setTimeout(() => { onSaved(saved); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-[#0a0f1e] text-lg">Upload Video</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        {done ? (
          <div className="py-10 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="font-black text-[#0a0f1e]">Video Uploaded!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Video File</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 transition-all" onClick={() => document.getElementById('vfile').click()}>
                {file ? <p className="text-sm font-black text-[#0a0f1e]">{file.name}</p> : <><Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400 font-black">Click to select video</p><p className="text-xs text-gray-300 mt-1">MP4, MOV, AVI · HD/4K</p></>}
              </div>
              <input id="vfile" type="file" accept="video/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Thumbnail</label>
              <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-gray-400" onClick={() => document.getElementById('tfile').click()}>
                {thumb ? <p className="text-xs font-black text-[#0a0f1e]">{thumb.name}</p> : <><Upload className="w-4 h-4 text-gray-300" /><p className="text-xs text-gray-400">Upload thumbnail (optional)</p></>}
              </div>
              <input id="tfile" type="file" accept="image/*" className="hidden" onChange={e => setThumb(e.target.files[0])} />
            </div>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-black placeholder:text-gray-300 focus:outline-none focus:border-[#0a0f1e]" placeholder="Video Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#0a0f1e] h-20 resize-none" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Type</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-black focus:outline-none" value={form.video_type} onChange={e => setForm({ ...form, video_type: e.target.value })}>
                  {['upload', 'recording', 'webinar', 'course_video', 'ott'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Visibility</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-black focus:outline-none" value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })}>
                  {['public', 'private', 'password', 'invite_only', 'team_only', 'school_only'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-black text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSubmit} disabled={!form.title || uploading}
                className="flex-1 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm disabled:opacity-50 hover:bg-[#1a2033] transition-all">
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TubedXVideos() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const vids = await base44.entities.TubedXVideo.filter({ owner_email: u.email }, '-created_date', 50);
      setVideos(vids);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = videos.filter(v => {
    const matchSearch = !search || v.title?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || v.video_type === filterType;
    return matchSearch && matchType;
  });

  const totalStorage = videos.reduce((s, v) => s + (v.file_size_mb || 0), 0);

  if (loading) return <div className="flex justify-center py-32"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#0a0f1e] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSaved={v => setVideos(prev => [v, ...prev])} userEmail={user?.email} />}

      <div className="bg-[#0a0f1e] px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">TubedX™</p>
            <h1 className="text-2xl font-black text-white">My Videos</h1>
            <p className="text-white/30 text-sm mt-1">{videos.length} videos · {totalStorage.toFixed(1)} MB used</p>
          </div>
          <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
            <Upload className="w-4 h-4" /> Upload Video
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-5">
        {/* Search + Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-60 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0a0f1e]" placeholder="Search videos..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm font-black focus:outline-none" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            {['upload', 'recording', 'webinar', 'course_video', 'ott'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex items-center border border-gray-200 bg-white rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-[#0a0f1e] text-white' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-[#0a0f1e] text-white' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
            <Video className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-300">{search ? 'No videos match your search.' : 'Upload your first video to get started.'}</p>
            <button onClick={() => setShowUpload(true)} className="mt-4 px-6 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm">
              <Plus className="w-4 h-4 inline mr-2" />Upload Video
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(v => {
              const VisIcon = VISIBILITY_ICONS[v.visibility] || Globe;
              return (
                <div key={v.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="aspect-video bg-gray-100 relative flex items-center justify-center overflow-hidden">
                    {v.thumbnail_url ? <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" /> : <Play className="w-8 h-8 text-gray-300" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-black ${v.status === 'ready' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'}`}>{v.status}</span>
                  </div>
                  <div className="p-4">
                    <p className="font-black text-[#0a0f1e] text-sm truncate mb-1">{v.title}</p>
                    <p className="text-xs text-gray-400 mb-3">{v.video_type}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{v.views_count || 0}</span>
                      <span className="flex items-center gap-1"><VisIcon className="w-3 h-3" />{v.visibility}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {filtered.map((v, i) => {
              const VisIcon = VISIBILITY_ICONS[v.visibility] || Globe;
              return (
                <div key={v.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <div className="w-14 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {v.thumbnail_url ? <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" /> : <Play className="w-4 h-4 text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-[#0a0f1e] truncate">{v.title}</p>
                    <p className="text-xs text-gray-400">{v.video_type}</p>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{v.views_count || 0}</span>
                    <span className="flex items-center gap-1"><VisIcon className="w-3 h-3" />{v.visibility}</span>
                    <span className={`px-2 py-0.5 rounded-full font-black ${v.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{v.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}