// Teacher / student talk-time analysis from timestamped transcript segments.
// A segment: { start, end, speaker: 'teacher'|'student'|'group'|'unknown', speaker_label?, excluded?: boolean }
// Times are seconds. Overlapping intervals are never double-counted.

const SPEAKER_KINDS = ['teacher', 'student', 'group', 'unknown'];

function normalise(segments) {
  return segments
    .filter((s) => s && Number.isFinite(s.start) && Number.isFinite(s.end) && s.end > s.start && !s.excluded)
    .map((s) => ({ start: s.start, end: s.end, kind: SPEAKER_KINDS.includes(s.speaker) ? s.speaker : 'unknown', label: s.speaker_label || null }));
}

// Union length of a set of intervals
function unionLength(intervals) {
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  let total = 0, curS = null, curE = null;
  for (const { start, end } of sorted) {
    if (curS === null) { curS = start; curE = end; continue; }
    if (start <= curE) curE = Math.max(curE, end);
    else { total += curE - curS; curS = start; curE = end; }
  }
  if (curS !== null) total += curE - curS;
  return total;
}

// Time where speakers of *different* kinds talk at once: Σ union(kind) − union(all)
function crossOverlap(groups) {
  const perGroup = groups.reduce((a, g) => a + unionLength(g), 0);
  return Math.max(0, perGroup - unionLength(groups.flat()));
}

export const STUDENT_TALK_BANDS = [
  { rating: 5, min: 70 }, { rating: 4, min: 60 }, { rating: 3, min: 50 }, { rating: 2, min: 35 }, { rating: 1, min: 0 },
];
export function studentTalkBand(pct) {
  if (pct === null || pct === undefined || Number.isNaN(pct)) return null;
  return STUDENT_TALK_BANDS.find((b) => pct >= b.min).rating;
}

/**
 * @param {Array} segments transcript segments
 * @param {object} opts { observationDuration?: seconds, excludedIntervals?: [{start,end,reason}] (silence / independent work) }
 */
export function computeTalkTime(segments, opts = {}) {
  const segs = normalise(segments);
  const byKind = Object.fromEntries(SPEAKER_KINDS.map((k) => [k, segs.filter((s) => s.kind === k)]));
  const teacher = unionLength(byKind.teacher);
  const student = unionLength([...byKind.student, ...byKind.group]);
  const unknown = unionLength(byKind.unknown);
  const overlap = crossOverlap([byKind.teacher, [...byKind.student, ...byKind.group], byKind.unknown]);
  const anySpeech = unionLength(segs);
  // Attributable, non-overlapping teacher+student speech is the denominator for discourse percentages.
  // Time where teacher and students overlap is split evenly so neither side is credited twice.
  const teacherStudentOverlap = crossOverlap([byKind.teacher, [...byKind.student, ...byKind.group]]);
  const attributable = Math.max(0, teacher + student - teacherStudentOverlap);
  const teacherPct = attributable > 0 ? Math.max(0, teacher - teacherStudentOverlap / 2) / attributable * 100 : null;
  const studentPct = attributable > 0 ? Math.max(0, student - teacherStudentOverlap / 2) / attributable * 100 : null;

  const studentSpeakers = new Set(byKind.student.map((s) => s.label).filter(Boolean));
  const perSpeaker = {};
  for (const s of byKind.student) if (s.label) perSpeaker[s.label] = (perSpeaker[s.label] || 0) + (s.end - s.start);
  const totalLabelled = Object.values(perSpeaker).reduce((a, b) => a + b, 0);
  const shares = Object.entries(perSpeaker).map(([label, secs]) => ({ label, seconds: round(secs), share: totalLabelled ? round(secs / totalLabelled * 100) : null }))
    .sort((a, b) => b.seconds - a.seconds);
  const topShare = shares[0]?.share ?? null;

  const duration = opts.observationDuration ?? (segs.length ? Math.max(...segs.map((s) => s.end)) : 0);
  const excluded = unionLength((opts.excludedIntervals || []).filter((i) => Number.isFinite(i.start) && Number.isFinite(i.end) && i.end > i.start));
  const silence = Math.max(0, duration - anySpeech - excluded);

  return {
    teacher_seconds: round(teacher),
    student_seconds: round(student),
    unknown_seconds: round(unknown),
    overlap_seconds: round(overlap),
    total_duration_seconds: round(duration),
    analyzable_speech_seconds: round(attributable),
    excluded_seconds: round(excluded),
    silence_or_independent_seconds: round(silence),
    teacher_pct: teacherPct === null ? null : round(teacherPct),
    student_pct: studentPct === null ? null : round(studentPct),
    unique_student_speakers: studentSpeakers.size,
    participation: shares,
    participation_concentration: topShare,                       // % of labelled student talk held by the top speaker
    dominated: topShare !== null && shares.length >= 3 && topShare >= 50,
    provisional_student_talk_band: studentTalkBand(studentPct),
    evidence_sufficient: attributable >= 120,                     // < 2 min of attributable speech is too little to band
  };
}

const round = (n) => Math.round(n * 10) / 10;
