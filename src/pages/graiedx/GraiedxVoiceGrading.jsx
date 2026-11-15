import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles, CheckCircle, AlertCircle, Volume2, Loader2, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function GraiedxVoiceGrading() {
  const [selectedClass, setSelectedClass] = useState('');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const recognitionRef = useRef(null);
  const qc = useQueryClient();

  const { data: classes = [] } = useQuery({ queryKey: ['gx-classes'], queryFn: () => base44.entities.GraiedxClass.list() });
  const { data: students = [] } = useQuery({ queryKey: ['gx-students-all'], queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 500) });
  const { data: assignments = [] } = useQuery({ queryKey: ['gx-assignments-all'], queryFn: () => base44.entities.GraiedxAssignment.list('-created_date', 500) });
  const { data: grades = [] } = useQuery({ queryKey: ['gx-grades-all'], queryFn: () => base44.entities.GraiedxGrade.list('-created_date', 2000) });

  const classStudents = selectedClass ? students.filter(s => s.class_id === selectedClass) : students;
  const classAssignments = selectedClass ? assignments.filter(a => a.class_id === selectedClass) : assignments;

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const t = Array.from(event.results).map(r => r[0].transcript).join('');
      setTranscript(t);
    };
    recognition.onend = () => {
      setListening(false);
      if (transcript || manualInput) processInput(transcript || manualInput);
    };
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setTranscript('');
    setResult(null);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const processInput = async (text) => {
    if (!text.trim()) return;
    setProcessing(true);

    const studentNames = classStudents.map(s => s.student_name).join(', ');
    const assignmentNames = classAssignments.map(a => `${a.title} (${a.points_possible} pts)`).join(', ');

    const aiResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI grade entry assistant. Parse this voice/text input and extract grade information.

Input: "${text}"

Available students: ${studentNames || 'Not specified'}
Available assignments: ${assignmentNames || 'Not specified'}

Return ONLY a JSON object with:
{
  "student_name": "exact student name match or best guess",
  "assignment_title": "exact assignment title match or best guess",
  "points_earned": number or null,
  "status": "graded" | "missing" | "late" | "excused",
  "confidence": "high" | "medium" | "low",
  "confirmation_needed": true/false,
  "message": "Human readable confirmation of what will be entered"
}

If you cannot determine a student or assignment, set confidence to "low" and confirmation_needed to true.`,
      response_json_schema: {
        type: "object",
        properties: {
          student_name: { type: "string" },
          assignment_title: { type: "string" },
          points_earned: { type: "number" },
          status: { type: "string" },
          confidence: { type: "string" },
          confirmation_needed: { type: "boolean" },
          message: { type: "string" }
        }
      }
    });

    setResult({ ...aiResult, originalText: text });
    setProcessing(false);
  };

  const confirmGrade = async () => {
    if (!result) return;
    const student = classStudents.find(s => s.student_name.toLowerCase().includes(result.student_name?.toLowerCase() || '') || result.student_name?.toLowerCase().includes(s.student_name.toLowerCase()));
    const assignment = classAssignments.find(a => a.title.toLowerCase().includes(result.assignment_title?.toLowerCase() || '') || result.assignment_title?.toLowerCase().includes(a.title.toLowerCase()));

    if (!student || !assignment) {
      setResult(p => ({ ...p, error: 'Could not match student or assignment. Please check names.' }));
      return;
    }

    const pct = assignment.points_possible > 0 ? Math.round(((result.points_earned || 0) / assignment.points_possible) * 100) : 0;
    const existing = grades.find(g => g.student_id === student.id && g.assignment_id === assignment.id);
    const gradeData = {
      student_id: student.id, student_name: student.student_name,
      assignment_id: assignment.id, assignment_title: assignment.title,
      class_id: assignment.class_id, teacher_email: assignment.teacher_email,
      points_earned: result.points_earned, points_possible: assignment.points_possible,
      percentage: pct, letter_grade: pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F',
      status: result.status || 'graded', is_missing: result.status === 'missing',
      is_late: result.status === 'late', voice_entered: true,
      graded_date: new Date().toISOString().split('T')[0],
    };
    if (existing) await base44.entities.GraiedxGrade.update(existing.id, gradeData);
    else await base44.entities.GraiedxGrade.create(gradeData);

    setHistory(h => [{ ...result, student_name: student.student_name, assignment_title: assignment.title, confirmed: true, timestamp: new Date().toLocaleTimeString() }, ...h.slice(0, 9)]);
    qc.invalidateQueries(['gx-grades-all']);
    setResult(null);
    setTranscript('');
    setManualInput('');
  };

  const EXAMPLES = [
    'John Smith scored 85 on the fractions quiz',
    'Maria received a 92 on the essay assignment',
    'Mark the homework assignment missing for Kevin',
    'Sarah got 78 out of 100 on the unit test',
    'Give Alex an excused on today\'s classwork',
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-black">Voice Grading</h1>
        <p className="text-gray-400 text-sm mt-0.5">Speak naturally — AI will parse, match, and enter grades automatically</p>
      </div>

      {/* Class Selector */}
      <div className="mb-6">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Filter by Class (optional)</label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-64 rounded-xl"><SelectValue placeholder="All classes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Classes</SelectItem>
            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.class_name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Voice Interface */}
      <div className="bg-[#020205] rounded-3xl p-8 mb-6 text-center">
        <AnimatePresence mode="wait">
          {listening ? (
            <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute w-24 h-24 bg-red-500/20 rounded-full animate-ping" />
                <div className="absolute w-20 h-20 bg-red-500/30 rounded-full animate-pulse" />
                <button onClick={stopListening} className="relative w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg">
                  <MicOff className="w-6 h-6 text-white" />
                </button>
              </div>
              <p className="text-white font-black mb-2">Listening...</p>
              {transcript && <p className="text-white/60 text-sm max-w-md mx-auto">"{transcript}"</p>}
            </motion.div>
          ) : processing ? (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4">
              <Loader2 className="w-10 h-10 text-white/40 mx-auto mb-3 animate-spin" />
              <p className="text-white font-black">AI is analyzing your input...</p>
              <p className="text-white/30 text-sm mt-1">Matching students and assignments</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={startListening} className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-white/90 transition-all group shadow-xl shadow-white/10">
                <Mic className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
              </button>
              <p className="text-white font-black text-lg mb-1">Tap to Start Voice Grading</p>
              <p className="text-white/30 text-sm mb-6">Or type below</p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input value={manualInput} onChange={e => setManualInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && processInput(manualInput)}
                  placeholder='e.g., "John scored 85 on the quiz"'
                  className="bg-white/5 border-white/10 text-white placeholder-white/20 rounded-xl" />
                <Button onClick={() => processInput(manualInput)} disabled={!manualInput} className="bg-white text-black rounded-xl font-black flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Result Card */}
      {result && !processing && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 mb-6 border-2 ${result.error ? 'bg-red-50 border-red-200' : result.confidence === 'high' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {result.error ? <AlertCircle className="w-5 h-5 text-red-500" /> : result.confidence === 'high' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
              <p className="font-black text-sm text-black">{result.error ? 'Error' : result.confidence === 'high' ? 'Grade Ready to Confirm' : 'Please Verify'}</p>
            </div>
            <button onClick={() => setResult(null)} className="text-gray-400 hover:text-black"><X className="w-4 h-4" /></button>
          </div>
          {result.error ? (
            <p className="text-sm text-red-700">{result.error}</p>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-4">{result.message}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Student', value: result.student_name },
                  { label: 'Assignment', value: result.assignment_title },
                  { label: 'Points', value: result.points_earned != null ? result.points_earned : result.status },
                  { label: 'Status', value: result.status },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-xl p-3 border border-black/5">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="font-black text-sm text-black">{value || '—'}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={confirmGrade} className="bg-black text-white rounded-xl font-black gap-2 flex-1">
                  <CheckCircle className="w-4 h-4" /> Confirm & Save Grade
                </Button>
                <Button variant="outline" onClick={() => setResult(null)} className="rounded-xl">Discard</Button>
              </div>
            </>
          )}
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Examples */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-3">Example Voice Commands</p>
          <div className="space-y-2">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => { setManualInput(ex); processInput(ex); }}
                className="w-full text-left text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2.5 hover:bg-black hover:text-white transition-all font-medium">
                "{ex}"
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-3">Voice Entry History</p>
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
              <Volume2 className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-bold">No entries yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-black truncate">{h.student_name} · {h.assignment_title}</p>
                    <p className="text-[10px] text-gray-500">{h.points_earned != null ? `${h.points_earned} pts` : h.status} · {h.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}