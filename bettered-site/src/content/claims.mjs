// Claims registry. Pages never print a claim's number directly: they call claim(id).
// The build FAILS if a page requests a claim whose status is not publishable.
// Last full review: 2026-11-08.

export const PUBLISHABLE = new Set([
  'VERIFIED + APPROVED',
  'PUBLIC DATA',
  'OWNER STATED',
  'CLIENT REPORTED · PREVIOUSLY PUBLISHED', // publishable with limitations; listed as a launch CONDITION
]);

export const claims = {
  'CL-01': {
    wording: 'Reading proficiency rose 15 percentage points',
    value: 15, prefix: '+', unit: 'pts', label: 'Reading proficiency',
    organization: 'Shining Stars Montessori Academy PCS',
    metric: 'Change in reading proficiency, in percentage points',
    definition: 'Percentage-point change in the share of students scoring proficient in reading. Not a percent change.',
    baseline: 'Not publicly disclosed', endValue: 'Not publicly disclosed',
    dates: '2025–26 school year', population: 'Not publicly specified',
    source: 'School-reported during the engagement; assessment not publicly named',
    sourceLocation: 'Internal engagement records (BetterEd)',
    type: 'Client reported',
    percentVsPoints: 'Percentage points',
    role: 'Multi-year engagement across leadership, instruction, talent, culture, enrollment, family engagement and facilities',
    attribution: 'Shared. Reported during the engagement; not a causal estimate.',
    verification: 'Calculation reproduced internally by BetterEd. Not an independent audit.',
    clientApproval: 'Stated as approved on the current website; written approval to be located (launch condition)',
    status: 'CLIENT REPORTED · PREVIOUSLY PUBLISHED',
    lastReview: '2026-11-08',
    pages: ['/', '/results', '/results/shining-stars-montessori', '/solutions/whole-school-turnaround'],
  },
  'CL-02': {
    wording: 'Math proficiency rose 14 percentage points',
    value: 14, prefix: '+', unit: 'pts', label: 'Math proficiency',
    organization: 'Shining Stars Montessori Academy PCS',
    metric: 'Change in math proficiency, in percentage points',
    definition: 'Percentage-point change in the share of students scoring proficient in math. Not a percent change.',
    baseline: 'Not publicly disclosed', endValue: 'Not publicly disclosed',
    dates: '2025–26 school year', population: 'Not publicly specified',
    source: 'School-reported during the engagement; assessment not publicly named',
    sourceLocation: 'Internal engagement records (BetterEd)',
    type: 'Client reported', percentVsPoints: 'Percentage points',
    role: 'As CL-01', attribution: 'Shared. Reported during the engagement; not a causal estimate.',
    verification: 'Calculation reproduced internally by BetterEd. Not an independent audit.',
    clientApproval: 'As CL-01',
    status: 'CLIENT REPORTED · PREVIOUSLY PUBLISHED',
    lastReview: '2026-11-08',
    pages: ['/', '/results', '/results/shining-stars-montessori', '/solutions/whole-school-turnaround'],
  },
  'CL-03': {
    wording: '+406 ranking positions gained, Beginning With Children 2 Middle School, 2025–26',
    status: 'DO NOT PUBLISH',
    reason: 'Ranking source, starting and ending positions not named. Fails BetterEd methodology §A.',
    lastReview: '2026-11-08', pages: [],
  },
  'CL-04': {
    wording: 'Their team sees what others often overlook and translates those insights into practical action.',
    person: 'Shawn Hardnett', title: 'Founder & CEO', organization: 'Statesmen College Preparatory Academy for Boys PCS',
    type: 'Testimonial', status: 'CLIENT REPORTED · PREVIOUSLY PUBLISHED',
    clientApproval: 'Published on current site; confirm written permission (launch condition)',
    lastReview: '2026-11-08', pages: ['/', '/results'],
  },
  'CL-05': { wording: 'Aliss Williams and Eloise Cummings testimonials', status: 'INTERNAL ONLY', reason: 'Generic; one has no organization.', lastReview: '2026-11-08', pages: [] },
  'CL-06': { wording: 'Client logo list (10 organizations)', status: 'UNVERIFIED', reason: 'Per-client logo permission not on file.', lastReview: '2026-11-08', pages: [] },
  'CL-07': { wording: 'Partner logos incl. Louisiana DOE, DC OSSE, Amplify', status: 'DO NOT PUBLISH', reason: 'Relationship and permission unconfirmed; government marks.', lastReview: '2026-11-08', pages: [] },
  'CL-08': { wording: 'Founded in 2019 in New Jersey', status: 'OWNER STATED', lastReview: '2026-11-08', pages: ['/about', '/procurement'] },
  'CL-09': { wording: 'Founder education: Baltimore City College; BA in Sociology, Johns Hopkins University; master\'s in Education Policy and Management, Harvard Graduate School of Education', status: 'OWNER STATED', note: 'No institutional endorsement implied.', lastReview: '2026-11-08', pages: ['/', '/about'] },
  'CL-10': { wording: 'Founder career: ten years at Success Academy Charter Schools as teacher, principal, principal director, network director and managing director of schools, joining when the network had three schools', status: 'OWNER STATED', lastReview: '2026-11-08', pages: ['/', '/about'] },
  'CL-11': { wording: 'School Health Index: 12 domains, score 0–100, five health bands, expert review within 48 hours', status: 'PUBLIC DATA', note: 'Stated on current site. 48-hour commitment must remain operationally true.', lastReview: '2026-11-08', pages: ['/school-health-index', '/'] },
  'CL-12': { wording: 'Team of 14 named practitioners and staff', status: 'OWNER STATED', note: 'Carried from current site. Confirm spellings (Furan/Fearon, Jhay/Jay) and titles before launch.', lastReview: '2026-11-08', pages: ['/about'] },
};

export function claim(id) {
  const c = claims[id];
  if (!c) throw new Error(`Unknown claim ${id}`);
  if (!PUBLISHABLE.has(c.status)) throw new Error(`Claim ${id} has status "${c.status}" and cannot be published.`);
  return c;
}
