import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Sparkles, RefreshCw, Award, TrendingUp, AlertCircle } from 'lucide-react';

const GRADE_STYLE = { A:'bg-green-50 border-green-200 text-green-700', B:'bg-blue-50 border-blue-200 text-blue-700', C:'bg-amber-50 border-amber-200 text-amber-700', D:'bg-orange-50 border-orange-200 text-orange-700', F:'bg-red-50 border-red-200 text-red-700' };

export default function XscoresPanel({ school, onRunAI, analyzing }) {
  if (!school) return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
      <TrendingUp className="w-10 h-10 text-gray-200 mx-auto mb-3" />
      <p className="font-black text-gray-400">Complete your Xschetails first to generate Xscores.</p>
    </div>
  );

  const chartData = [
    { name: 'Reading', score: school.reading_proficiency || 0, avg: 55 },
    { name: 'Math', score: school.math_proficiency || 0, avg: 52 },
    { name: 'Writing', score: school.writing_proficiency || 0, avg: 50 },
    { name: 'Science', score: school.science_proficiency || 0, avg: 54 },
    { name: 'Attendance', score: school.attendance_rate || 0, avg: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Grade + Score */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-2xl border-2 p-6 text-center col-span-1 ${school.xscores_grade ? GRADE_STYLE[school.xscores_grade] : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
          <p className="text-6xl font-black">{school.xscores_grade || '—'}</p>
          <p className="text-xs font-black uppercase tracking-widest mt-1">Xscores Grade</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-black text-[#0a0f1e]">{school.xscores_overall || '—'}</p>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">Overall Score</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-lg font-black text-[#0a0f1e]">{school.xscores_reading_rank || '—'}</p>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">Reading Rank</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-lg font-black text-[#0a0f1e]">{school.xscores_math_rank || '—'}</p>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">Math Rank</p>
        </div>
      </div>

      {/* Badges */}
      {school.xscores_badges?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Xscores Badges</p>
          <div className="flex flex-wrap gap-2">
            {school.xscores_badges.map(b => (
              <span key={b} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0f1e] text-white rounded-full text-xs font-black">
                <Award className="w-3 h-3" /> {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Performance Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">School vs. District Average</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={28} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Arial', fontWeight: 700 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, n) => [`${v}%`, n === 'score' ? 'Your School' : 'District Avg']} />
            <Bar dataKey="score" fill="#0a0f1e" radius={[6,6,0,0]} name="score" />
            <Bar dataKey="avg" fill="#e5e7eb" radius={[6,6,0,0]} name="avg" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#0a0f1e] rounded" /><span className="text-xs text-gray-500">Your School</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 rounded" /><span className="text-xs text-gray-500">District Avg (est.)</span></div>
        </div>
      </div>

      {/* AI Insights */}
      {school.ai_insights?.length > 0 && (
        <div className="bg-[#0a0f1e] rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-white/40" />
            <p className="text-white/40 text-xs font-black uppercase tracking-widest">AI Insights</p>
          </div>
          {school.ai_insights.map((ins, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 flex-shrink-0" />
              <p className="text-white/60 text-sm leading-relaxed">{ins}</p>
            </div>
          ))}
        </div>
      )}

      {/* AI Strengths / Risks */}
      {(school.ai_strengths || school.ai_risks) && (
        <div className="grid md:grid-cols-2 gap-4">
          {school.ai_strengths && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Strengths</p>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{school.ai_strengths}</p>
            </div>
          )}
          {school.ai_risks && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Risks</p>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{school.ai_risks}</p>
            </div>
          )}
        </div>
      )}

      {/* 90-Day Plan */}
      {school.ai_90_day_plan && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">AI 90-Day Execution Plan</p>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{school.ai_90_day_plan}</p>
        </div>
      )}

      {!school.xscores_grade && (
        <div className="text-center">
          <button onClick={onRunAI} disabled={analyzing}
            className="px-7 py-3 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all inline-flex items-center gap-2">
            {analyzing ? <><RefreshCw className="w-4 h-4 animate-spin" />Analyzing...</> : <><Sparkles className="w-4 h-4" />Generate Xscores</>}
          </button>
        </div>
      )}
    </div>
  );
}