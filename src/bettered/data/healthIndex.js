// The BetterEd School Health Index™ — domain and question bank for the
// front-end diagnostic flow. Scoring is computed client-side for the
// preliminary snapshot only; a full diagnosis requires BetterEd review.

export const DOMAINS = [
  {
    key: 'leadership',
    name: 'Leadership Health',
    system: 'Brain',
    essential: true,
    questions: [
      { id: 'lead-1', text: 'School leaders have a clear, shared instructional vision that staff can articulate.' },
      { id: 'lead-2', text: 'Leaders make decisions using data and evidence rather than instinct alone.' },
      { id: 'lead-3', text: 'Leadership turnover has not disrupted the school’s improvement efforts in the past two years.' },
    ],
  },
  {
    key: 'culture',
    name: 'Culture & Climate Health',
    system: 'Heart',
    essential: true,
    questions: [
      { id: 'cult-1', text: 'Staff believe all students in this school can achieve at high levels.' },
      { id: 'cult-2', text: 'Staff trust leadership to follow through on commitments.' },
      { id: 'cult-3', text: 'Students report feeling safe, known, and valued at school.' },
    ],
  },
  {
    key: 'instruction',
    name: 'Instructional Health',
    system: 'Muscles',
    essential: true,
    questions: [
      { id: 'inst-1', text: 'Teachers receive specific, frequent feedback tied to a shared instructional model.' },
      { id: 'inst-2', text: 'Curriculum and assessments are aligned to the standards being taught.' },
      { id: 'inst-3', text: 'Classroom observation data shows consistent rigor across classrooms.' },
    ],
  },
  {
    key: 'achievement',
    name: 'Student Achievement Health',
    system: 'Vital Signs',
    essential: true,
    questions: [
      { id: 'ach-1', text: 'The majority of students are proficient in reading on the most recent assessment.' },
      { id: 'ach-2', text: 'The majority of students are proficient in mathematics on the most recent assessment.' },
      { id: 'ach-3', text: 'Achievement gaps between student groups are narrowing, not widening.' },
    ],
  },
  {
    key: 'talent',
    name: 'Talent Health',
    system: 'Skeletal System',
    essential: false,
    questions: [
      { id: 'tal-1', text: 'Teacher vacancies are filled quickly with qualified candidates.' },
      { id: 'tal-2', text: 'Teacher retention has been stable or improving over the past two years.' },
      { id: 'tal-3', text: 'New hires receive structured onboarding and first-year support.' },
    ],
  },
  {
    key: 'enrollment',
    name: 'Enrollment Health',
    system: 'Circulatory System',
    essential: false,
    questions: [
      { id: 'enr-1', text: 'Enrollment has been stable or growing over the past three years.' },
      { id: 'enr-2', text: 'The school has a waitlist or consistently meets its enrollment target.' },
      { id: 'enr-3', text: 'Family retention is strong at key transition grades.' },
    ],
  },
  {
    key: 'operations',
    name: 'Operational Health',
    system: 'Circulatory System',
    essential: false,
    questions: [
      { id: 'ops-1', text: 'Schedules, logistics, and resources reliably support instructional time.' },
      { id: 'ops-2', text: 'Operational issues are addressed proactively rather than reactively.' },
      { id: 'ops-3', text: 'Staff have the materials and resources they need when they need them.' },
    ],
  },
  {
    key: 'financial',
    name: 'Financial Health',
    system: 'Circulatory System',
    essential: true,
    questions: [
      { id: 'fin-1', text: 'The school operates within a balanced, sustainable budget.' },
      { id: 'fin-2', text: 'Financial reserves could sustain operations through an unexpected shortfall.' },
      { id: 'fin-3', text: 'The board and leadership have a clear view of financial health at all times.' },
    ],
  },
  {
    key: 'facilities',
    name: 'Facilities Health',
    system: 'Skeletal System',
    essential: false,
    questions: [
      { id: 'fac-1', text: 'The facility is safe, well-maintained, and supports the instructional program.' },
      { id: 'fac-2', text: 'Safety protocols are current and practiced, not just written.' },
      { id: 'fac-3', text: 'There is a multi-year plan for facility needs and capital investment.' },
    ],
  },
  {
    key: 'family',
    name: 'Family & Community Health',
    system: 'Support System',
    essential: false,
    questions: [
      { id: 'fam-1', text: 'Families report trusting the school and feeling welcomed as partners.' },
      { id: 'fam-2', text: 'The school communicates proactively with families, not only when problems arise.' },
      { id: 'fam-3', text: 'Community partnerships meaningfully support students and families.' },
    ],
  },
  {
    key: 'specialed',
    name: 'Special Education Health',
    system: 'Immune System',
    essential: true,
    questions: [
      { id: 'sped-1', text: 'Students receiving special education services are making strong progress toward their goals.' },
      { id: 'sped-2', text: 'Inclusion and co-teaching practices are consistent across classrooms.' },
      { id: 'sped-3', text: 'Compliance requirements are met without consuming the team’s capacity for instruction.' },
    ],
  },
  {
    key: 'strategy',
    name: 'Strategic Planning Health',
    system: 'Nervous System',
    essential: false,
    questions: [
      { id: 'strat-1', text: 'The school has a written strategic plan that staff and board actually reference.' },
      { id: 'strat-2', text: 'Priorities are sequenced, not all pursued simultaneously.' },
      { id: 'strat-3', text: 'Progress toward strategic goals is reviewed on a regular, predictable cadence.' },
    ],
  },
];

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Agree' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export const CLASSIFICATIONS = [
  { min: 85, max: 100, label: 'Thriving', description: 'Strong systems across most domains. Focus on sustaining and refining.' },
  { min: 70, max: 84, label: 'Stable', description: 'Solid foundation with specific areas that need attention before they become risks.' },
  { min: 55, max: 69, label: 'At Risk', description: 'Multiple domains show signs of strain that are likely already affecting outcomes.' },
  { min: 40, max: 54, label: 'Critical', description: 'Significant breakdowns across several domains require urgent, coordinated intervention.' },
  { min: 0, max: 39, label: 'Intervention Required', description: 'The organization is showing signs consistent with organizations in crisis. Immediate expert support is recommended.' },
];

export function classify(score) {
  return CLASSIFICATIONS.find((c) => score >= c.min && score <= c.max) || CLASSIFICATIONS[CLASSIFICATIONS.length - 1];
}

// Compute a 0-100 score per domain from Likert responses (1-5), plus an overall
// average and an escalation flag if any essential domain falls below the
// critical minimum even when the overall average looks acceptable.
export function scoreAssessment(responses) {
  const ESSENTIAL_MIN = 50;
  const domainScores = DOMAINS.map((domain) => {
    const values = domain.questions.map((q) => responses[q.id]).filter((v) => typeof v === 'number');
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const score = Math.round(((avg - 1) / 4) * 100); // map 1-5 -> 0-100
    return { ...domain, score, answered: values.length, total: domain.questions.length };
  });

  const scored = domainScores.filter((d) => d.answered > 0);
  const overall = scored.length
    ? Math.round(scored.reduce((sum, d) => sum + d.score, 0) / scored.length)
    : 0;

  const escalated = domainScores.some((d) => d.essential && d.answered > 0 && d.score < ESSENTIAL_MIN);
  const classification = escalated && overall >= 55
    ? { label: 'Intervention Required', description: 'One or more essential domains fell below the critical threshold, even though the overall average score is higher. BetterEd recommends urgent review regardless of the average.' }
    : classify(overall);

  const ranked = [...domainScores].sort((a, b) => b.score - a.score);
  const strengths = ranked.slice(0, 3);
  const risks = [...ranked].reverse().slice(0, 3);

  return { domainScores, overall, classification, escalated, strengths, risks };
}
