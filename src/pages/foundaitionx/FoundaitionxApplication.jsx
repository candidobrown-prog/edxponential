import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  FileText, Sparkles, Loader2, Download, Share2, Printer,
  CheckCircle2, AlertTriangle, Zap, ChevronRight, Star,
  BarChart3, Shield, Brain, Eye, RefreshCw, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const APPLICATION_SECTIONS = [
  { id: 'executive_summary', label: 'Executive Summary', required: true },
  { id: 'mission_vision', label: 'Mission & Vision', required: true },
  { id: 'educational_need', label: 'Educational Need & Community Context', required: true },
  { id: 'academic_program', label: 'Academic Program & Curriculum', required: true },
  { id: 'instructional_model', label: 'Instructional Model', required: true },
  { id: 'assessment_plan', label: 'Assessment & Data Systems', required: true },
  { id: 'special_populations', label: 'Special Populations (SPED, MLL, MTSS)', required: true },
  { id: 'culture_climate', label: 'School Culture & Climate', required: true },
  { id: 'discipline_policy', label: 'Student Conduct & Discipline', required: true },
  { id: 'staffing_plan', label: 'Staffing & Human Resources', required: true },
  { id: 'leadership_structure', label: 'Leadership & Management Structure', required: true },
  { id: 'governance_plan', label: 'Board Governance Plan', required: true },
  { id: 'financial_plan', label: 'Multi-Year Financial Plan', required: true },
  { id: 'enrollment_plan', label: 'Enrollment & Outreach Plan', required: true },
  { id: 'facilities_plan', label: 'Facilities & Transportation', required: false },
  { id: 'technology_plan', label: 'Technology Integration Plan', required: false },
  { id: 'family_engagement', label: 'Family & Community Engagement', required: true },
  { id: 'diversity_equity', label: 'Diversity, Equity & Inclusion Plan', required: true },
  { id: 'accountability_plan', label: 'Accountability & Performance Plan', required: true },
  { id: 'professional_development', label: 'Professional Development Plan', required: false },
  { id: 'implementation_timeline', label: 'Implementation Timeline', required: true },
  { id: 'appendices', label: 'Appendices & Supporting Documents', required: false },
];

export default function FoundaitionxApplication() {
  const [generatedSections, setGeneratedSections] = useState({});
  const [loadingSection, setLoadingSection] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewReport, setReviewReport] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [schoolState, setSchoolState] = useState('');
  const [schoolModel, setSchoolModel] = useState('');
  const [activeSection, setActiveSection] = useState(null);

  const generateSection = async (sectionId, label) => {
    setLoadingSection(sectionId);
    setActiveSection(sectionId);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an elite charter school application writer with 20 years of experience helping schools get approved. You write at the level of McKinsey, Harvard Graduate School of Education, and the National Alliance for Public Charter Schools.

Write a comprehensive, professional, board-ready charter application section for:

Section: ${label}
School Name: ${schoolName || 'Charter Academy'}
School Model: ${schoolModel || 'High-performing academic model'}
State: ${schoolState || 'State'}

Write 600-1000 words of professional, evidence-based, narrative content appropriate for a charter application review panel.

Include:
- Strong opening that establishes credibility and need
- Research-backed frameworks and approaches
- Specific implementation details
- Measurable outcomes and benchmarks
- Professional, executive-quality language
- Clear alignment to educational best practices

Make it compelling, specific, and approval-optimized.`,
        model: 'claude_sonnet_4_6'
      });
      setGeneratedSections(prev => ({ ...prev, [sectionId]: res }));
      toast.success(`${label} generated!`);
    } catch (e) {
      toast.error('Generation failed');
    }
    setLoadingSection(null);
  };

  const generateAll = async () => {
    for (const section of APPLICATION_SECTIONS.filter(s => s.required)) {
      await generateSection(section.id, section.label);
    }
    toast.success('All required sections generated!');
  };

  const reviewApplication = async () => {
    setReviewLoading(true);
    try {
      const completedSections = Object.keys(generatedSections);
      const missingSections = APPLICATION_SECTIONS.filter(s => s.required && !generatedSections[s.id]).map(s => s.label);
      
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a charter school application reviewer on an elite review panel. You have reviewed 500+ charter applications and approved schools that now serve 100,000+ students.

Review this charter application:
School: ${schoolName || 'Charter Academy'}
Model: ${schoolModel || 'Academic model'}
State: ${schoolState}
Sections Completed: ${completedSections.length} of ${APPLICATION_SECTIONS.length}
Missing Required Sections: ${missingSections.join(', ') || 'None'}

Sample content from Executive Summary:
${generatedSections['executive_summary'] ? generatedSections['executive_summary'].substring(0, 500) : 'Not yet written'}

Provide a comprehensive application review with:
- approval_likelihood (0-100)
- overall_score (0-100)
- strengths (array of 4-6 items)
- weaknesses (array of 4-6 items)
- missing_components (array)
- compliance_concerns (array)
- financial_concerns (array)
- governance_concerns (array)
- academic_concerns (array)
- equity_concerns (array)
- executive_review_summary (2 paragraphs)
- critical_recommendations (array of 5 items)
- risk_level: "low" | "medium" | "high"`,
        response_json_schema: {
          type: 'object',
          properties: {
            approval_likelihood: { type: 'number' },
            overall_score: { type: 'number' },
            strengths: { type: 'array', items: { type: 'string' } },
            weaknesses: { type: 'array', items: { type: 'string' } },
            missing_components: { type: 'array', items: { type: 'string' } },
            compliance_concerns: { type: 'array', items: { type: 'string' } },
            financial_concerns: { type: 'array', items: { type: 'string' } },
            governance_concerns: { type: 'array', items: { type: 'string' } },
            academic_concerns: { type: 'array', items: { type: 'string' } },
            equity_concerns: { type: 'array', items: { type: 'string' } },
            executive_review_summary: { type: 'string' },
            critical_recommendations: { type: 'array', items: { type: 'string' } },
            risk_level: { type: 'string' },
          }
        },
        model: 'claude_sonnet_4_6'
      });
      setReviewReport(res);
      toast.success('Application review complete!');
    } catch (e) {
      toast.error('Review failed');
    }
    setReviewLoading(false);
  };

  const completedCount = Object.keys(generatedSections).length;
  const totalRequired = APPLICATION_SECTIONS.filter(s => s.required).length;

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight">Charter Application Generator</h1>
          </div>
          <p className="text-xs text-white/30">AI-powered complete charter application — from executive summary to appendices</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={reviewApplication} disabled={reviewLoading || completedCount === 0} variant="outline"
            className="border-white/15 text-white font-black text-xs rounded-full hover:bg-white/5">
            {reviewLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Reviewing</> : <><Eye className="w-3.5 h-3.5" /> Review My Application</>}
          </Button>
          <Button className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto">
        {/* School Config */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="School Name"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
          <input value={schoolState} onChange={e => setSchoolState(e.target.value)} placeholder="State"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
          <input value={schoolModel} onChange={e => setSchoolModel(e.target.value)} placeholder="School Model (e.g. STEM Charter)"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
        </div>

        {/* Progress + Generate All */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="font-black text-2xl text-white">{completedCount}<span className="text-white/20 text-base font-bold">/{APPLICATION_SECTIONS.length}</span></div>
            <div>
              <div className="text-xs font-black text-white/50">Sections Generated</div>
              <div className="w-40 h-1.5 bg-white/8 rounded-full mt-1">
                <div className="h-full bg-white/50 rounded-full transition-all" style={{ width: `${(completedCount / APPLICATION_SECTIONS.length) * 100}%` }} />
              </div>
            </div>
          </div>
          <Button onClick={generateAll} className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Generate All Required Sections
          </Button>
        </div>

        {/* Review Report */}
        {reviewReport && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-white/15 rounded-2xl p-6 bg-white/3 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-white flex items-center gap-2"><Star className="w-4 h-4" /> Application Review Report</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-black text-2xl text-white">{reviewReport.approval_likelihood}%</div>
                  <div className="text-[10px] text-white/25">Approval Likelihood</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-black border ${reviewReport.risk_level === 'low' ? 'border-white/20 text-white/60' : reviewReport.risk_level === 'medium' ? 'border-white/15 text-white/40' : 'border-white/10 text-white/30'}`}>
                  {reviewReport.risk_level?.toUpperCase()} RISK
                </div>
              </div>
            </div>
            {reviewReport.executive_review_summary && (
              <p className="text-sm text-white/50 leading-relaxed mb-4">{reviewReport.executive_review_summary}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Strengths', items: reviewReport.strengths, icon: CheckCircle2 },
                { label: 'Weaknesses', items: reviewReport.weaknesses, icon: AlertTriangle },
                { label: 'Critical Recommendations', items: reviewReport.critical_recommendations, icon: Zap },
              ].map(({ label, items, icon: Icon }) => items?.length > 0 && (
                <div key={label} className="border border-white/8 rounded-xl p-3 bg-white/2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{label}</p>
                  {items.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5 mb-1">
                      <Icon className="w-3 h-3 text-white/25 mt-0.5 flex-shrink-0" />
                      <span className="text-[11px] text-white/40">{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {APPLICATION_SECTIONS.map(({ id, label, required }, i) => {
            const isGenerated = !!generatedSections[id];
            const isLoading = loadingSection === id;
            return (
              <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className={`border rounded-xl p-4 transition-all ${isGenerated ? 'border-white/15 bg-white/3' : 'border-white/6 bg-white/1'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isGenerated ? <CheckCircle2 className="w-3.5 h-3.5 text-white/50" /> : <div className="w-3.5 h-3.5 rounded-full border border-white/15" />}
                      <span className="text-xs font-black text-white/70">{label}</span>
                      {required && <span className="text-[9px] font-black text-white/20 border border-white/10 px-1 py-0.5 rounded-full">REQ</span>}
                    </div>
                    {isGenerated && (
                      <p className="text-[11px] text-white/30 ml-5 line-clamp-2">{generatedSections[id].substring(0, 120)}...</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isGenerated && (
                      <button onClick={() => setActiveSection(activeSection === id ? null : id)}
                        className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all">
                        <Eye className="w-3 h-3 text-white/30" />
                      </button>
                    )}
                    <Button onClick={() => generateSection(id, label)} disabled={isLoading}
                      variant="outline" className="border-white/12 text-white text-[11px] font-black rounded-lg hover:bg-white/5 h-7 px-2.5">
                      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : isGenerated ? <><RefreshCw className="w-3 h-3" /> Regen</> : <><Sparkles className="w-3 h-3" /> Generate</>}
                    </Button>
                  </div>
                </div>
                {activeSection === id && generatedSections[id] && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-white/8">
                    <div className="max-h-48 overflow-y-auto text-sm text-white/50 leading-relaxed whitespace-pre-wrap">
                      {generatedSections[id]}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}