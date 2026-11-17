// BetterEd Insights — original launch essays. No fabricated data, quotes,
// or outside sources are attributed; these are original perspective pieces
// from BetterEd's own team.

export const articles = [
  {
    slug: 'root-cause-vs-symptom',
    title: 'Why Schools Treat Symptoms Instead of Root Causes',
    subtitle: 'The habit of relabeling a problem instead of diagnosing it — and what it costs students.',
    category: 'School Turnaround',
    author: 'Candido Brown',
    date: '2026-01-12',
    readingTime: '5 min read',
    body: [
      'When a school’s results decline, the first explanation offered is rarely the right one. The student is called unmotivated. The family is described as uninvolved. The teacher is blamed. The principal is replaced. Each of these is a label, not a diagnosis — and labels are easy to apply precisely because they require no evidence and change nothing structural.',
      'In medicine, a practitioner who relabeled a patient’s symptom instead of investigating its cause would be committing malpractice. In education, it has become routine. A school with a reading proficiency problem gets a new reading program. A school with a culture problem gets a new slogan. A school with a leadership-capacity problem gets a new org chart. None of these responses are necessarily wrong on their own — but none of them are diagnoses, and a treatment chosen before a diagnosis is a guess.',
      'The habit persists because real diagnosis is slower and more uncomfortable than relabeling. It requires sitting with evidence that may implicate leadership decisions, not just classroom practice. It requires acknowledging that multiple systems — talent, culture, operations, finance — are usually involved at once, not just the one that is easiest to see.',
      'BetterEd was built around the discipline of doing this work anyway: gathering history, examining evidence directly, and naming root causes before prescribing anything. It is slower at the start. It is faster, and far more durable, by the end.',
    ],
  },
  {
    slug: 'ninety-day-leadership-plan',
    title: 'The First Ninety Days of a Turnaround Principalship',
    subtitle: 'Why sequencing — not effort — is usually what separates a recovery from another failed attempt.',
    category: 'Leadership',
    author: 'Candido Brown',
    date: '2026-02-03',
    readingTime: '6 min read',
    body: [
      'Most principals who step into a turnaround school are not short on effort. They work long hours, visit classrooms constantly, and genuinely want things to improve. What usually goes wrong is sequencing: trying to fix culture, instruction, staffing, and operations all at once, with no plan for which problem has to be stabilized first.',
      'The first ninety days of a turnaround principalship should be organized around a single question: what has to be true by day ninety for everything else to be possible? Almost always, the answer starts with staff trust and a small number of non-negotiable routines — not a full instructional overhaul.',
      'This is counterintuitive to leaders who feel pressure to show instructional results immediately. But instructional change that is introduced into an unstable, low-trust building rarely survives contact with the staff. Stabilize first. Raise expectations second. Both have to happen quickly — but not in the wrong order.',
      'A credible ninety-day plan names the two or three priorities that will actually move first, assigns an owner to each, and sets a visible, predictable rhythm for checking progress. Everything else waits its turn — not because it doesn’t matter, but because a leader who tries to fix everything in month one usually ends up fixing nothing by month twelve.',
    ],
  },
  {
    slug: 'ai-literacy-for-school-leaders',
    title: 'What School Leaders Actually Need to Know About AI',
    subtitle: 'Not how the models work — what to decide, and when to say no.',
    category: 'AI in Education',
    author: 'Candido Brown',
    date: '2026-03-18',
    readingTime: '5 min read',
    body: [
      'Most AI training aimed at school leaders focuses on tools: which chatbot to try, which grading assistant to pilot. That is the wrong starting point. The more urgent question for a superintendent or principal is not which tool to use, but which decisions now require a governance answer that didn’t exist two years ago.',
      'Staff are already using AI tools informally — drafting communications, generating lesson materials, summarizing documents that may contain student information. Most of this happens without a policy, because most schools have not yet written one. The leadership task is not to ban this activity, which is both unenforceable and often genuinely useful, but to set clear boundaries around student data, instructional accuracy, and academic integrity before an incident forces the conversation.',
      'A workable AI governance approach for a school rests on a short list of decisions: what categories of data may never be entered into a public AI tool, which instructional uses require teacher review before reaching students, how academic integrity expectations change for student-facing work, and who owns updating the policy as tools change.',
      'None of this requires a leader to understand how a language model works. It requires the same thing every other organizational risk requires: a clear decision, communicated early, revisited on a schedule — not after something goes wrong.',
    ],
  },
];

export const getArticleBySlug = (slug) => articles.find((a) => a.slug === slug);
