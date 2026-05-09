import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText, Upload, Plus, Search, Eye,
  Clock, Brain, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-600',
  pending_review: 'bg-amber-100 text-amber-700',
  archived: 'bg-gray-100 text-gray-500',
};

export default function SpedIEPManager() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedIEP, setSelectedIEP] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const qc = useQueryClient();

  const { data: ieps = [], isLoading } = useQuery({
    queryKey: ['sped-ieps'],
    queryFn: () => base44.entities.SpedIEP.list('-created_date', 200),
  });
  const { data: students = [] } = useQuery({
    queryKey: ['sped-students'],
    queryFn: () => base44.entities.SpedStudent.list('-created_date', 200),
  });

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file: uploadFile });
    const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: {
        type: 'object',
        properties: {
          student_name: { type: 'string' },
          grade: { type: 'string' },
          disability_classification: { type: 'string' },
          iep_start_date: { type: 'string' },
          iep_end_date: { type: 'string' },
          services: { type: 'array', items: { type: 'object' } },
          goals: { type: 'array', items: { type: 'object' } },
          accommodations: { type: 'array', items: { type: 'string' } },
          case_manager: { type: 'string' },
        }
      }
    });
    if (extracted.status === 'success') {
      await base44.entities.SpedIEP.create({
        ...extracted.output,
        document_url: file_url,
        ai_generated: false,
        iep_type: 'annual',
        status: 'draft',
        student_id: 'uploaded',
        student_name: extracted.output?.student_name || 'Unknown Student',
        ai_summary: 'Document uploaded and parsed by PerSpEdxtives™ AI',
      });
      qc.invalidateQueries(['sped-ieps']);
    }
    setUploading(false);
    setShowUpload(false);
    setUploadFile(null);
  };

  const analyzeIEP = async (iep) => {
    setSelectedIEP(iep);
    setAnalyzing(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Special Education compliance expert. Analyze this IEP data and provide:
1. Compliance summary (IDEA alignment)
2. Goal quality assessment
3. Service adequacy review
4. Missing components
5. Top 3 recommendations

IEP Data: ${JSON.stringify(iep, null, 2)}

Respond in clear, professional language appropriate for school leaders.`,
    });
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  const filtered = ieps.filter(iep => {
    const matchSearch = !search || iep.student_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || iep.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">IEP Manager</h1>
          <p className="text-gray-400 text-sm mt-1">{ieps.length} IEP documents</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowUpload(true)} variant="outline" className="rounded-xl font-black gap-2">
            <Upload className="w-4 h-4" /> Upload IEP
          </Button>
          <Link to="/perspedxtives/ai-generator">
            <Button className="bg-black text-white rounded-xl font-black gap-2">
              <Brain className="w-4 h-4" /> Generate AI IEP
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total', value: ieps.length, color: 'bg-white' },
          { label: 'Active', value: ieps.filter(i => i.status === 'active').length, color: 'bg-emerald-50' },
          { label: 'Draft', value: ieps.filter(i => i.status === 'draft').length, color: 'bg-gray-50' },
          { label: 'Expired', value: ieps.filter(i => i.status === 'expired').length, color: 'bg-red-50' },
          { label: 'AI Generated', value: ieps.filter(i => i.ai_generated).length, color: 'bg-blue-50' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} border border-gray-100 rounded-2xl p-4 text-center`}>
            <div className="text-2xl font-black text-black">{value}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student name..." className="pl-9 rounded-xl" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* IEP Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-bold">No IEPs found</p>
          <p className="text-gray-300 text-sm mt-1">Upload existing IEPs or generate new ones with AI</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(iep => (
            <motion.div key={iep.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase ${STATUS_COLORS[iep.status] || 'bg-gray-100 text-gray-600'}`}>
                  {iep.status}
                </span>
              </div>
              <h3 className="font-black text-sm text-black">{iep.student_name}</h3>
              <p className="text-xs text-gray-400 mt-1">{iep.iep_type?.replace(/_/g, ' ')} IEP · Grade {iep.grade || 'N/A'}</p>
              {iep.disability_classification && (
                <p className="text-xs text-gray-400">{iep.disability_classification.replace(/_/g, ' ')}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {iep.iep_start_date ? `${iep.iep_start_date} → ${iep.iep_end_date || 'TBD'}` : 'Dates not set'}
              </div>
              {iep.ai_generated && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-blue-600 font-bold">
                  <Sparkles className="w-3 h-3" /> AI Generated
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => analyzeIEP(iep)}
                  className="rounded-lg text-xs font-bold flex-1 gap-1">
                  <Brain className="w-3 h-3" /> AI Review
                </Button>
                {iep.document_url && (
                  <a href={iep.document_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="rounded-lg text-xs font-bold gap-1">
                      <Eye className="w-3 h-3" /> View
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">Upload IEP Document</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Upload a PDF, Word, or image file. PerSpEdxtives™ AI will automatically extract student information, goals, services, and compliance data.</p>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mt-2">
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx" className="hidden" id="iep-upload"
              onChange={e => setUploadFile(e.target.files[0])} />
            <label htmlFor="iep-upload" className="cursor-pointer text-sm font-bold text-black hover:underline">
              {uploadFile ? uploadFile.name : 'Choose file to upload'}
            </label>
            <p className="text-xs text-gray-400 mt-1">PDF, Word, Images, Excel supported</p>
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowUpload(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button onClick={handleUpload} disabled={!uploadFile || uploading}
              className="flex-1 bg-black text-white rounded-xl font-black gap-2">
              {uploading ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</> : <><Sparkles className="w-3 h-3" /> Upload & Analyze</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Analysis Dialog */}
      <Dialog open={!!selectedIEP} onOpenChange={() => { setSelectedIEP(null); setAiAnalysis(''); }}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black text-xl flex items-center gap-2">
              <Brain className="w-5 h-5" /> AI IEP Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
              <span className="font-black">{selectedIEP?.student_name}</span> · {selectedIEP?.iep_type?.replace(/_/g, ' ')} IEP
            </div>
            {analyzing ? (
              <div className="flex items-center gap-3 py-8 justify-center">
                <div className="w-6 h-6 border-4 border-black/10 border-t-black rounded-full animate-spin" />
                <p className="text-gray-500 font-bold">PerSpEdxtives™ AI analyzing IEP...</p>
              </div>
            ) : aiAnalysis ? (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white border border-gray-100 rounded-xl p-4">
                {aiAnalysis}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}