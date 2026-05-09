import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  BookOpen, Sparkles, Loader2, Download, Printer,
  CheckCircle2, ChevronRight, FileText, Shield, Users,
  GraduationCap, Layers, Plus, Eye, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DOCUMENT_CATEGORIES = [
  {
    category: 'Handbooks', icon: BookOpen, items: [
      { id: 'family_handbook', label: 'Family & Parent Handbook', pages: '40-60 pages' },
      { id: 'student_handbook', label: 'Student Handbook', pages: '30-50 pages' },
      { id: 'staff_handbook', label: 'Staff Handbook', pages: '50-80 pages' },
      { id: 'teacher_handbook', label: 'Teacher Handbook', pages: '40-60 pages' },
      { id: 'board_handbook', label: 'Board Member Handbook', pages: '30-40 pages' },
      { id: 'leadership_handbook', label: 'Leadership Handbook', pages: '25-40 pages' },
    ]
  },
  {
    category: 'Policies', icon: Shield, items: [
      { id: 'attendance_policy', label: 'Attendance Policy' },
      { id: 'discipline_policy', label: 'Student Conduct & Discipline Policy' },
      { id: 'grading_policy', label: 'Grading & Assessment Policy' },
      { id: 'technology_policy', label: 'Technology Acceptable Use Policy' },
      { id: 'sped_policy', label: 'Special Education Policy' },
      { id: 'equity_policy', label: 'Diversity, Equity & Inclusion Policy' },
      { id: 'hiring_policy', label: 'Hiring & Employment Policy' },
      { id: 'evaluation_policy', label: 'Staff Evaluation Policy' },
      { id: 'safety_policy', label: 'School Safety Policy' },
      { id: 'data_privacy_policy', label: 'Data Privacy & FERPA Policy' },
      { id: 'family_engagement_policy', label: 'Family Engagement Policy' },
      { id: 'complaint_policy', label: 'Grievance & Complaint Policy' },
    ]
  },
  {
    category: 'Procedures', icon: Layers, items: [
      { id: 'emergency_procedures', label: 'Emergency & Safety Procedures' },
      { id: 'arrival_dismissal', label: 'Arrival & Dismissal Procedures' },
      { id: 'observation_procedures', label: 'Classroom Observation Procedures' },
      { id: 'evaluation_procedures', label: 'Staff Evaluation Procedures' },
      { id: 'sped_procedures', label: 'SPED Referral & IEP Procedures' },
      { id: 'hr_procedures', label: 'HR & Personnel Procedures' },
      { id: 'testing_procedures', label: 'Standardized Testing Procedures' },
    ]
  },
  {
    category: 'Plans', icon: GraduationCap, items: [
      { id: 'strategic_plan', label: '5-Year Strategic Plan' },
      { id: 'improvement_plan', label: 'School Improvement Plan' },
      { id: 'professional_development_plan', label: 'Professional Development Plan' },
      { id: 'enrollment_plan', label: 'Enrollment & Marketing Plan' },
      { id: 'implementation_timeline', label: 'Year 1 Implementation Timeline' },
      { id: 'technology_plan', label: 'Technology Integration Plan' },
      { id: 'facilities_plan', label: 'Facilities Acquisition Plan' },
    ]
  },
];

export default function FoundaitionxDocuments() {
  const [generated, setGenerated] = useState({});
  const [loading, setLoading] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [schoolModel, setSchoolModel] = useState('');

  const generateDoc = async (id, label) => {
    setLoading(id);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an elite school operations consultant and policy writer. You have written policies and handbooks for 200+ high-performing charter and independent schools.

Write a comprehensive, professional, implementation-ready "${label}" for:
School Name: ${schoolName || 'Our Charter School'}
School Model: ${schoolModel || 'College-preparatory charter school'}

Requirements:
- Professional, legally-sound language
- Specific to the school type and model
- Clear, actionable, and implementation-ready
- Aligned with best practices and compliance standards
- Include all required sections for this document type
- 600-1200 words of substantive content

Make it executive-quality, thorough, and immediately usable.`,
        model: 'claude_sonnet_4_6'
      });
      setGenerated(prev => ({ ...prev, [id]: res }));
      toast.success(`${label} generated!`);
    } catch {
      toast.error('Generation failed');
    }
    setLoading(null);
  };

  const generateAllInCategory = async (items, categoryName) => {
    toast(`Generating all ${categoryName}...`);
    for (const item of items) {
      setLoading(item.id);
      try {
        const res = await base44.integrations.Core.InvokeLLM({
          prompt: `Write a professional, comprehensive "${item.label}" for ${schoolName || 'a high-performing charter school'} using a ${schoolModel || 'college-preparatory'} model. Include all required sections. 400-700 words.`,
        });
        setGenerated(prev => ({ ...prev, [item.id]: res }));
      } catch {}
    }
    setLoading(null);
    toast.success(`All ${categoryName} generated!`);
  };

  const totalGenerated = Object.keys(generated).length;
  const totalDocs = DOCUMENT_CATEGORIES.reduce((a, c) => a + c.items.length, 0);

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight">Policies, Handbooks & Documents</h1>
          </div>
          <p className="text-xs text-white/30">Complete AI-generated school operational document suite</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30">{totalGenerated}/{totalDocs} generated</span>
          <Button className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
            <Download className="w-3.5 h-3.5" /> Export All
          </Button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="School Name"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
          <input value={schoolModel} onChange={e => setSchoolModel(e.target.value)} placeholder="School Model (e.g. Montessori, STEM)"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
        </div>

        <div className="space-y-8">
          {DOCUMENT_CATEGORIES.map(({ category, icon: Icon, items }) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-white/30" />
                  <h3 className="font-black text-sm text-white">{category}</h3>
                  <span className="text-[10px] text-white/20">{items.filter(i => generated[i.id]).length}/{items.length}</span>
                </div>
                <Button onClick={() => generateAllInCategory(items, category)} variant="outline"
                  className="border-white/12 text-white text-[11px] font-black rounded-full hover:bg-white/5 h-7 px-3">
                  <Sparkles className="w-3 h-3" /> Generate All {category}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {items.map(({ id, label, pages }) => {
                  const isGenerated = !!generated[id];
                  const isLoading = loading === id;
                  return (
                    <div key={id} className={`border rounded-xl p-4 transition-all ${isGenerated ? 'border-white/15 bg-white/3' : 'border-white/6 bg-white/1'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isGenerated ? <CheckCircle2 className="w-3.5 h-3.5 text-white/50 flex-shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-white/12 flex-shrink-0" />}
                          <div>
                            <span className="text-xs font-black text-white/70">{label}</span>
                            {pages && <div className="text-[10px] text-white/20">{pages}</div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isGenerated && (
                            <button onClick={() => setActiveDoc(activeDoc === id ? null : id)}
                              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5">
                              <Eye className="w-3 h-3 text-white/30" />
                            </button>
                          )}
                          <Button onClick={() => generateDoc(id, label)} disabled={isLoading}
                            variant="outline" className="border-white/10 text-white text-[11px] font-black rounded-lg hover:bg-white/5 h-7 px-2.5">
                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : isGenerated ? <RefreshCw className="w-3 h-3" /> : <><Sparkles className="w-3 h-3" /> Generate</>}
                          </Button>
                        </div>
                      </div>
                      {activeDoc === id && generated[id] && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-white/8 max-h-52 overflow-y-auto">
                          <p className="text-sm text-white/45 leading-relaxed whitespace-pre-wrap">{generated[id]}</p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}