import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, ArrowLeft, Upload, Sparkles, RefreshCw, Download, Printer,
  TrendingUp, AlertCircle, Target, Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function GoaledScoresPage() {
  const [assessments, setAssessments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [view, setView] = useState('overview'); // overview | grade | teacher | subgroup
  const [chartData, setChartData] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: {
        type: 'object',
        properties: {
          assessments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                grade: { type: 'string' },
                subject: { type: 'string' },
                teacher: { type: 'string' },
                proficiency_pct: { type: 'number' },
                growth: { type: 'number' },
                below_grade: { type: 'number' },
                on_grade: { type: 'number' },
                above_grade: { type: 'number' },
                assessment_name: { type: 'string' },
                assessment_period: { type: 'string' }
              }
            }
          }
        }
      }
    });
    if (result.status === 'success') {
      setAssessments(result.output?.assessments || []);
      buildChartData(result.output?.assessments || []);
    }
    setUploading(false);
  };

  const buildChartData = (data) => {
    const byGrade = data.reduce((acc, d) => {
      const key = `Grade ${d.grade}`;
      if (!acc[key]) acc[key] = { name: key, ela: 0, math: 0, count: 0 };
      if (d.subject?.toLowerCase().includes('ela') || d.subject?.toLowerCase().includes('read')) acc[key].ela = d.proficiency_pct;
      if (d.subject?.toLowerCase().includes('math')) acc[key].math = d.proficiency_pct;
      acc[key].count++;
      return acc;
    }, {});
    setChartData(Object.values(byGrade));
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const dataStr = assessments.map(a => `Grade ${a.grade} ${a.subject}: ${a.proficiency_pct}% proficient, ${a.growth > 0 ? '+' : ''}${a.growth}% growth`).join('\n');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert school data analyst. Analyze this assessment data and provide comprehensive insights:\n\n${dataStr}\n\nProvide: 1) Key findings and trends, 2) Grade levels of concern, 3) Subject areas needing intervention, 4) High-performing classrooms/teachers, 5) Subgroup performance concerns, 6) Specific intervention recommendations, 7) Connection to school goals, 8) Next steps for leadership.`,
      model: 'claude_sonnet_4_6',
    });
    setAnalysis(result);
    setAnalyzing(false);
  };

  const handleGenerateSample = async () => {
    setAnalyzing(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate realistic sample assessment data for a K-8 school. Create data for grades K-8, subjects ELA and Math, showing realistic proficiency percentages and growth scores. Return JSON: { "assessments": [{ "grade":"K","subject":"ELA","teacher":"Ms. Johnson","proficiency_pct":65,"growth":8,"below_grade":20,"on_grade":45,"above_grade":35,"assessment_name":"NWEA MAP","assessment_period":"MOY 2025-26" }, ...] } - include 16 entries total (2 per grade, ELA and Math)`,
      model: 'claude_sonnet_4_6',
      response_json_schema: { type: 'object', properties: { assessments: { type: 'array', items: { type: 'object', properties: { grade:{type:'string'}, subject:{type:'string'}, teacher:{type:'string'}, proficiency_pct:{type:'number'}, growth:{type:'number'}, below_grade:{type:'number'}, on_grade:{type:'number'}, above_grade:{type:'number'}, assessment_name:{type:'string'}, assessment_period:{type:'string'} } } } } }
    });
    setAssessments(result.assessments || []);
    buildChartData(result.assessments || []);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/goaled" className="flex items-center gap-1 text-white/30 text-xs font-black uppercase tracking-widest mb-2 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Goaled Xschool™
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Scores</h1>
              <p className="text-white/40 mt-1 text-sm">Centralized assessment and academic performance intelligence center.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {assessments.length > 0 && (
                <button onClick={handleAnalyze} disabled={analyzing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
                  {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  AI Analysis
                </button>
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white/20 transition-all cursor-pointer">
                {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Data
                <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleUpload} />
              </label>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl font-black text-sm hover:bg-white/20 transition-all">
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* View tabs */}
          {assessments.length > 0 && (
            <div className="mt-6 flex gap-1 overflow-x-auto">
              {['overview', 'grade', 'teacher', 'subgroup'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-black capitalize whitespace-nowrap transition-all ${view === v ? 'bg-white text-[#0a0f1e]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                  {v === 'grade' ? 'By Grade' : v === 'teacher' ? 'By Teacher' : v === 'subgroup' ? 'By Subgroup' : 'Overview'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        {/* AI Analysis */}
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0f1e] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-white/40" />
              <p className="text-white/40 text-xs font-black uppercase tracking-widest">AI Academic Intelligence</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{analysis}</p>
          </motion.div>
        )}

        {assessments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
            <BarChart3 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-black text-[#0a0f1e] mb-2">No Assessment Data Yet</h2>
            <p className="text-gray-400 text-sm mb-6">Upload assessment data from Excel/CSV or generate a sample to see your academic dashboard.</p>
            <div className="flex items-center justify-center gap-3">
              <label className="px-6 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all inline-flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" /> Upload Assessment Data
                <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleUpload} />
              </label>
              <button onClick={handleGenerateSample} disabled={analyzing}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all inline-flex items-center gap-2">
                {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Sample Data
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Proficiency', value: `${Math.round(assessments.reduce((a, b) => a + (b.proficiency_pct || 0), 0) / assessments.length)}%`, Ic: BarChart3, dark: true },
                { label: 'Avg Growth', value: `+${Math.round(assessments.reduce((a, b) => a + (b.growth || 0), 0) / assessments.length)}%`, Ic: TrendingUp },
                { label: 'Assessments', value: assessments.length, Ic: Target },
                { label: 'Subjects', value: [...new Set(assessments.map(a => a.subject))].length, Ic: Users },
              ].map(({ label, value, Ic, dark }) => (
                <div key={label} className={`${dark ? 'bg-[#0a0f1e]' : 'bg-white border border-gray-100'} rounded-2xl p-5`}>
                  <Ic className={`w-4 h-4 mb-3 ${dark ? 'text-white/40' : 'text-gray-400'}`} />
                  <p className={`text-3xl font-black ${dark ? 'text-white' : 'text-[#0a0f1e]'}`}>{value}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>{label}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="font-black text-[#0a0f1e] mb-4">Proficiency by Grade Level</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="ela" name="ELA" fill="#0a0f1e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="math" name="Math" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <p className="font-black text-[#0a0f1e]">Assessment Data</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="bg-gray-50">
                    {['Grade','Subject','Teacher','Proficiency','Growth','Period'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {assessments.map((a, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm font-black text-[#0a0f1e]">Grade {a.grade}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{a.subject}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{a.teacher}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                              <div className={`h-1.5 rounded-full ${(a.proficiency_pct || 0) >= 70 ? 'bg-green-500' : (a.proficiency_pct || 0) >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${a.proficiency_pct || 0}%` }} />
                            </div>
                            <span className="text-sm font-black text-[#0a0f1e]">{a.proficiency_pct}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-sm font-black ${(a.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(a.growth || 0) >= 0 ? '+' : ''}{a.growth}%
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-400">{a.assessment_period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}