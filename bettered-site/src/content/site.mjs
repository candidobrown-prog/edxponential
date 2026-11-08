// Structured content. Presentation lives in src/templates. Edit copy here.
// Lifecycle for publishable items: 'draft' | 'review' | 'approved' | 'published' | 'archived'.
// Production builds include only 'published'. Preview builds also show 'review' with a visible label.

export const site = {
  name: 'BetterEd Solutions',
  legalName: 'BetterEd Solutions, LLC',
  url: 'https://betteredsolutions.org',
  tagline: 'Happy. Healthy. High-performing.',
  positioning: 'School improvement, turnaround and transformation firm',
  description: 'BetterEd Solutions is a school improvement, turnaround and transformation firm. We treat struggling schools the way good medicine treats patients: diagnose honestly, treat decisively, and stay until the results hold.',
  email: 'info@betteredsolutions.org',
  phone: '1-800-735-0953',
  founded: '2019',
  foundedPlace: 'New Jersey',
  locale: 'en_US',
  // Where "Take the School Health Index" sends people once the intake app is wired (M9).
  shiIntakeUrl: '/contact/?type=shi',
  contactEndpoint: '/api/contact',
  primaryCta: { label: 'Start with the diagnosis', href: '/contact/?type=diagnostic', track: 'CTA primary' },
  secondaryCta: { label: 'Take the School Health Index', href: '/school-health-index/', track: 'SHI opened' },
};

export const nav = [
  { label: 'Our Approach', href: '/approach/' },
  { label: 'EdSolutions', href: '/solutions/' },
  { label: 'Results', href: '/results/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'About', href: '/about/' },
];

export const footerNav = [
  { heading: 'Approach', links: [
    { label: 'Our Approach', href: '/approach/' },
    { label: 'School Health Index', href: '/school-health-index/' },
    { label: 'Results', href: '/results/' },
    { label: 'Insights', href: '/insights/' },
  ]},
  { heading: 'EdSolutions', links: [
    { label: 'School Health', href: '/solutions/school-health/' },
    { label: 'Leader Development', href: '/solutions/leader-development/' },
    { label: 'Teacher Development', href: '/solutions/teacher-development/' },
    { label: 'Intensive Care', href: '/solutions/intensive-care/' },
  ]},
  { heading: 'Company', links: [
    { label: 'About', href: '/about/' },
    { label: 'Partner', href: '/partner/' },
    { label: 'Procurement', href: '/procurement/' },
    { label: 'Contact', href: '/contact/' },
  ]},
  { heading: 'Policies', links: [
    { label: 'Privacy', href: '/privacy/' },
    { label: 'Accessibility', href: '/accessibility/' },
  ]},
];

export const method = [
  {
    key: 'intake', name: 'Intake', short: 'Intake',
    line: 'Hear what you are seeing, and gauge how urgent it is.',
    body: 'Every engagement starts with a 30-minute conversation and the School Health Index. You tell us what you are seeing and what you have already tried. Your team completes the 12-domain intake, and a BetterEd expert reviews it within 48 hours. We do not propose anything yet.',
    activities: ['A 30-minute conversation with your leaders', 'The School Health Index: a 12-domain intake your team completes', 'Expert review of the intake within 48 hours', 'Agreement on what the diagnostic visit will examine'],
    output: 'A first read of your school\'s health, and a plan for the diagnostic visit.',
  },
  {
    key: 'diagnose', name: 'Diagnosis', short: 'Diagnose',
    line: 'Understand what is actually happening before recommending anything.',
    body: 'We read the data, observe classrooms, sit in leadership meetings, walk the hallways at arrival and dismissal, and listen to teachers, students and families. We look for root causes in the conditions around learning: culture, leadership, instruction, systems, routines and execution.',
    activities: ['Data review: attendance, achievement, discipline, staffing, enrollment', 'Classroom observation across grades and subjects', 'Leadership, teacher, student and family interviews', 'Root-cause analysis across the 12 School Health Index domains'],
    output: 'A written diagnosis: what is working, what is not, and the few root causes that explain the most.',
  },
  {
    key: 'plan', name: 'Treatment plan', short: 'Plan',
    line: 'The right treatment, at the right level of care, in writing.',
    body: 'Not more intervention than the school needs. Not less than the problem requires. The diagnosis decides which EdSolutions are used, in what order, at what level of care, and how much time we spend in the building. The vital signs we will track, and the discharge criteria that will tell us the school is healthy on its own, are named here, before any work begins.',
    activities: ['A short list of priorities, each with an owner and a measure', 'The EdSolutions the diagnosis calls for, in order, and the level of care', 'The vital signs we will track, and how often we report them', 'Discharge criteria: what healthy looks like for this school', 'Governance: who decides, who reports, how often'],
    output: 'A treatment plan the leadership team owns, with measures named before work begins.',
  },
  {
    key: 'treat', name: 'Treatment', short: 'Treat',
    line: 'Start the work in the building, without waiting.',
    body: 'Once the plan is agreed, we start. Every year a school struggles is a year children do not get back, so we move with urgency: routines launched with staff, leadership meetings redesigned, coaching under way in classrooms, on the priorities in the plan.',
    activities: ['The EdSolutions the plan calls for, in order', 'Routines and structures launched with staff', 'Coaching in classrooms and leadership meetings', 'Monthly progress reviews against the vital signs'],
    output: 'Treatment under way, with progress reported against the vital signs.',
  },
  {
    key: 'strengthen', name: 'Strengthen', short: 'Strengthen',
    line: 'Stay close enough to the work for practice to change.',
    body: 'Plans do not change schools. Adults practicing differently does. We coach in classrooms and leadership meetings, model, rehearse and give feedback until new routines are the normal way of working.',
    activities: ['Observation and feedback cycles with teachers', 'Leadership coaching tied to the week\'s real decisions', 'Rehearsal and modeling of routines before they go live', 'Progress monitoring against the vital signs in the treatment plan'],
    output: 'Changed adult practice you can see in classrooms, and evidence that it is changing results.',
  },
  {
    key: 'discharge', name: 'Discharge & follow-up', short: 'Discharge',
    line: 'Step back when the school is healthy on its own, then check in.',
    body: 'The goal is not a school that depends on BetterEd. When the discharge criteria in the treatment plan are met, we hand over the work deliberately and step down, then return for scheduled check-ups to confirm the gains are holding.',
    activities: ['Leaders running the routines without us in the room', 'Systems documented and owned by the school', 'A measurement cycle the school runs itself', 'A planned step-down of BetterEd time, then follow-up check-ups'],
    output: 'A school that can diagnose and correct itself.',
  },
];

export const solutions = [
  {
    slug: 'school-health', n: '01', name: 'School Health', sub: 'Culture & climate', role: 'The heart', icon: 'heart', intensity: 2,
    short: 'The heart of the school, where every treatment starts: belonging, safety and high expectations, so adults can do their best work and children can learn.',
    cta: 'Talk about School Health', contactType: 'culture',
    hero: 'Culture is the heart of a school.',
    lead: 'When a school has a culture and climate problem, it has a heart condition. Children learn where they feel safe, known and expected to succeed. Adults teach well where expectations are clear and support is real. Every BetterEd treatment starts here, because nothing else holds without a healthy heart.',
    why: [
      'Culture is not a poster or a discipline policy. It is what adults and children do, every day, when no one is checking. When the conditions are weak, every other improvement leaks away: coaching does not stick, leaders spend their days on incidents, and good teachers leave.',
      'We treat culture as an institutional condition, not a student problem. Children are not the problem. The routines, expectations and relationships the adults build are where we start.',
    ],
    examine: [
      ['Student experience', 'Do students feel safe, known and expected to succeed? We ask them.'],
      ['Adult culture', 'Trust, communication and shared expectations among staff.'],
      ['Routines', 'Arrival, transitions, lunch, dismissal: where time and calm are won or lost.'],
      ['Expectations', 'Whether adults hold the same high bar, consistently, in every room.'],
      ['Belonging and safety', 'Physical and emotional safety; how conflict is handled and repaired.'],
      ['Accountability', 'Whether commitments have owners, and whether follow-through happens.'],
      ['Family trust', 'Whether families know what the school is asking of them, and why.'],
    ],
    work: ['Schoolwide routines designed, rehearsed with staff and launched together', 'Clear, shared expectations for adults and students', 'Coaching for leaders on presence, follow-through and repair', 'A culture walk-through and student voice cycle the school runs itself'],
    measures: ['Attendance and chronic absence', 'Incidents and instructional time lost', 'Student and staff survey measures of safety and belonging', 'Staff retention'],
    children: 'Calmer hallways, more minutes of learning, and adults who know their names and expect a lot of them.',
    related: ['leader-development', 'intensive-care'],
  },
  {
    slug: 'leader-development', n: '02', name: 'Leader Development', sub: 'Principals & leadership teams', role: 'The head', icon: 'head', intensity: 2,
    short: 'Heavy is the head that wears the crown. We build leaders who diagnose, decide and develop adults.',
    cta: 'Develop your leaders', contactType: 'leadership',
    hero: 'Heavy is the head that wears the crown.',
    lead: 'The quality of the leader decides whether improvement takes hold. We develop principals and leadership teams who can diagnose their own schools, choose the few moves that matter, and grow the adults around them.',
    why: [
      'Principals carry instruction, culture, operations, compliance, families and staff, often with little support of their own. Most leadership development happens away from the building. We do it inside the leader\'s real week, on the decisions in front of them.',
      'Candido Brown, BetterEd\'s founder, was a principal and went on to lead principals across a growing network of schools. That experience shapes how we coach: practical, direct, and focused on what a leader does on Monday.',
    ],
    examine: [
      ['Decision making', 'How priorities are set, and whether they survive the week.'],
      ['Instructional leadership', 'Time in classrooms; the quality of feedback leaders give.'],
      ['Adult development', 'How teachers are observed, coached and grown.'],
      ['Delegation', 'Whether the leadership team carries real ownership.'],
      ['Accountability', 'How commitments are tracked and missed ones addressed.'],
      ['Communication', 'Clarity with staff, families and the district or board.'],
      ['Execution routines', 'The weekly meetings and data cycles that move the work.'],
    ],
    work: ['One-to-one leadership coaching tied to live decisions', 'Leadership team design: roles, meetings, decision rights', 'Instructional leadership: observation, feedback and data meetings', 'Rehearsal of hard conversations before they happen'],
    measures: ['Leader time spent on instruction', 'Quality and frequency of teacher feedback', 'Completion of priority commitments', 'Teacher and leader retention'],
    children: 'A school led by someone with the time, clarity and team to make every classroom better.',
    related: ['teacher-development', 'school-health'],
  },
  {
    slug: 'teacher-development', n: '03', name: 'Teacher Development', sub: 'Instruction in the classroom', role: 'The hands', icon: 'hand', intensity: 2,
    short: 'Teachers are where learning happens. We coach reading, writing and math instruction in the classroom.',
    cta: 'Strengthen teaching', contactType: 'educator',
    hero: 'Teachers are where learning happens.',
    lead: 'We coach reading, writing and math instruction in real classrooms, with feedback that changes the next lesson, not the next school year.',
    why: [
      'Most professional development happens in a room away from children and is forgotten by Friday. We work where the teaching happens: planning with teachers, watching lessons, giving one clear piece of feedback, and rehearsing the change before the next class.',
      'We respect teachers\' expertise and time. The goal is not compliance with a program. It is stronger instruction that teachers own.',
    ],
    examine: [
      ['Planning', 'Whether lessons are built around what students must learn.'],
      ['Reading and writing', 'Foundational skills, complex text, and writing about reading.'],
      ['Mathematics', 'Conceptual understanding, fluency and student discourse.'],
      ['Instructional routines', 'Checks for understanding, questioning, pacing.'],
      ['Feedback culture', 'How often teachers are observed and how useful the feedback is.'],
      ['Implementation', 'Whether curriculum is taught as intended.'],
    ],
    work: ['Observation and feedback cycles: one lever at a time', 'Co-planning and lesson internalization', 'Modeling and rehearsal before new routines go live', 'Professional learning built from what was seen in classrooms'],
    measures: ['Implementation of the targeted practice, observed', 'Student work and interim assessment results', 'Reading, writing and math proficiency', 'Teacher reported usefulness of feedback'],
    children: 'Clearer lessons, more time thinking and writing, and teachers who know exactly where each child is.',
    related: ['leader-development', 'intensive-care'],
  },
  {
    slug: 'intensive-care', n: '04', name: 'Intensive Care', sub: 'Whole-school turnaround', role: 'The whole body', icon: 'body', intensity: 4, intensive: true,
    short: 'When it is not one condition but the whole body: heart, head and hands treated together, until the school is healthy on its own.',
    cta: 'Talk about Intensive Care', contactType: 'turnaround',
    hero: 'When it is the whole body, we treat the whole body.',
    lead: 'Intensive Care is whole-school turnaround: the heart, head and hands of a school (culture, leadership and teaching), plus its systems and measurement, treated together, with more time, more intensity and more attention, until the school is healthy on its own.',
    why: [
      'Some schools are not struggling for one reason. Culture is unstable, leadership is stretched, instruction is uneven, systems are fragmented and every problem feeds the next. Fixing one at a time does not work, because the others undo it.',
      'Turnaround is integrated work. We diagnose across every domain, agree the few priorities that unlock the rest, and stay in the building at the intensity the school needs. We do not promise timelines. We name measures, report them, and adjust.',
    ],
    examine: [
      ['Culture & climate', 'The conditions for learning and adult work.'],
      ['Leadership', 'Capacity, team structure and decision rights.'],
      ['Instruction', 'Quality and consistency across classrooms.'],
      ['Systems', 'Schedules, data cycles, staffing and operations.'],
      ['Execution', 'Whether plans become practice, week by week.'],
      ['Governance', 'How the school, district or board oversee the work.'],
    ],
    work: ['Integrated diagnosis across all 12 School Health Index domains', 'A turnaround plan with few priorities, owners and measures', 'Sustained in-building presence: leadership, classrooms and culture together', 'Monthly progress reviews with school and system leaders', 'A planned transfer of every routine to the school team'],
    measures: ['Attendance and culture indicators', 'Leadership and instructional practice, observed', 'Reading and math proficiency and growth', 'Designation or accountability status, where applicable', 'Retention of effective teachers and leaders'],
    children: 'A school that works: safe, well led, well taught, and still getting better after we leave.',
    related: ['school-health', 'leader-development'],
    caseStudy: 'shining-stars-montessori',
  },
];

export const mastery = [
  { l: 'M', name: 'Mindset', text: 'Growth begins with how we think, learn, respond and adapt.', behavior: 'We take feedback, stay coachable and admit when we are wrong.' },
  { l: 'A', name: 'Accountability', text: 'Own outcomes, commitments and follow-through.', behavior: 'Commitments have owners. Owners have deadlines. Missed commitments are addressed.' },
  { l: 'S', name: 'Strategic planning', text: 'Research first. Understand the audience. Name the risks. Establish governance. Prioritize the moves that matter.', behavior: 'We choose the few moves that matter most and execute them well.' },
  { l: 'T', name: 'Trust', text: 'Do what you say. Be consistent. Stay present when the work becomes difficult.', behavior: 'Loyal, consistent, and present when it is hard.' },
  { l: 'E', name: 'Excellence', text: 'Work carrying the BetterEd name should meet a high standard.', behavior: 'Every classroom, every school, every leader, and every piece of work that carries our name.' },
  { l: 'R', name: 'Results', text: 'Measured, not promised.', behavior: 'Attendance, instruction, reading, writing and math, reported whatever they show.' },
  { l: 'Y', name: 'Year after year', text: 'Build improvement that continues after the engagement ends.', behavior: 'We build systems and leaders that outlast the engagement, the funding and the headlines.' },
];

export const shiDomains = [
  { n: '01', name: 'Leadership', looks: 'Leadership capacity, team structure, decision rights and how priorities are set and kept.', solution: 'leader-development' },
  { n: '02', name: 'Culture and Climate', looks: 'Safety, belonging, expectations, routines and adult culture.', solution: 'school-health' },
  { n: '03', name: 'Instruction', looks: 'Planning, classroom practice, feedback and curriculum implementation.', solution: 'teacher-development' },
  { n: '04', name: 'Student Achievement', looks: 'Proficiency, growth and the gaps between groups of students, read in context.', solution: 'teacher-development' },
  { n: '05', name: 'Talent', looks: 'Hiring, development and retention of teachers and leaders.', solution: 'leader-development' },
  { n: '06', name: 'Enrollment', looks: 'Enrollment trends, re-enrollment and what they signal about trust.', solution: 'intensive-care' },
  { n: '07', name: 'Operations', looks: 'Schedules, systems and the operational load on school leaders.', solution: 'intensive-care' },
  { n: '08', name: 'Finance', looks: 'Whether resources match priorities, and how sustainable the budget is.', solution: 'intensive-care' },
  { n: '09', name: 'Facilities', looks: 'Whether the building supports safety, learning and pride.', solution: 'school-health' },
  { n: '10', name: 'Family Trust', looks: 'Communication with families and whether they would choose the school again.', solution: 'school-health' },
  { n: '11', name: 'Special Education', looks: 'Services, compliance and whether students with disabilities are learning.', solution: 'teacher-development' },
  { n: '12', name: 'Strategic Planning', looks: 'Whether there is a plan, with few priorities, owners, measures and governance.', solution: 'leader-development' },
];

export const shiBands = [
  { range: '85–100', name: 'Thriving' },
  { range: '70–84', name: 'Stable' },
  { range: '55–69', name: 'At risk' },
  { range: '40–54', name: 'Critical' },
  { range: '0–39', name: 'Intervention required' },
];

export const founder = {
  name: 'Candido Brown',
  title: 'Founder and CEO',
  photo: null, // M2: supply an approved portrait on Paper or Navy
  summary: 'Candido Brown is the founder and CEO of BetterEd Solutions. He grew up in Baltimore, taught, led a school as principal, and spent a decade building and leading schools inside a fast-growing charter network before founding BetterEd in 2019.',
  story: [
    'Candido was born in Salem, New Jersey, and grew up in Baltimore from the age of one. The city gave him his hardest challenges and his most extraordinary teachers. He graduated from Baltimore City College, earned a bachelor\'s degree in sociology at Johns Hopkins University, and a master\'s degree in Education Policy and Management at the Harvard Graduate School of Education.',
    'After Harvard he joined Success Academy Charter Schools when the network had three schools, and spent ten years there as a teacher, principal, principal director, network director and managing director of schools. He learned what it takes to open, lead and improve schools at pace, and what it costs children when adults delay.',
    'He returned to work in Baltimore and founded BetterEd Solutions in 2019 to bring that discipline to schools that need it most: diagnose honestly, treat decisively, and stay until the results hold.',
  ],
  creds: [
    ['Baltimore City College', 'Graduate'],
    ['Johns Hopkins University', 'BA, Sociology'],
    ['Harvard Graduate School of Education', 'Master\'s, Education Policy and Management'],
    ['Success Academy Charter Schools', 'Teacher to managing director of schools, ten years'],
  ],
};

// CL-12: carried from the current site. Confirm spellings and titles before launch.
export const team = [
  ['Candido Brown', 'Founder & CEO'],
  ['Dr. Monique Lewis', 'Partner, School Improvement & Turnaround'],
  ['Clara Borders', 'Partner, Montessori School Improvement'],
  ['Stephanie Carter-Bagley', 'Partner, Governance, Finance & Risk'],
  ['Elijah Perry', 'Partner, Advancement'],
  ['Anjelica Hardin Hall', 'Partner, Charter Strategy & Growth'],
  ['Ashley Furan', 'Partner, School Renewal'],
  ['Casey Kean', 'Partner, Data Intelligence'],
  ['Denis Ocampo', 'Partner, Partnerships'],
  ['Jennifer Bauer', 'Partner, School Improvement & Principal Coaching'],
  ['Jessica Nelson-Clark', 'Partner, Brand & Reputation'],
  ['Dr. Alina Lewis', 'Partner, Research'],
  ['Dr. Dejon Tucker', 'Partner, School Improvement & Transformation'],
  ['Jhay Tamayo', 'Business Operations Manager'],
];

export const caseStudies = [
  {
    slug: 'shining-stars-montessori', status: 'published',
    school: 'Shining Stars Montessori Academy PCS',
    title: 'Treating the whole school, not one symptom',
    summary: 'A public charter school facing connected pressures across enrollment, culture, staffing, instruction, leadership and facilities. A multi-year engagement treated them together.',
    facts: [['School type', 'Public charter school'], ['Engagement', 'Multi-year'], ['EdSolutions', 'Intensive Care (whole-school turnaround)'], ['Results year', '2025–26']],
    solutions: ['intensive-care', 'leader-development', 'teacher-development', 'school-health'],
    claims: ['CL-01', 'CL-02'],
    stages: {
      condition: 'The school faced pressure on several fronts at once: enrollment, culture, staffing, instruction, leadership and facilities. Each pressure made the others worse. Isolated professional development, or any single intervention, could not address them.',
      diagnosis: 'The diagnosis pointed to connected institutional systems rather than one cause. The engagement was organized around seven: leadership, instruction, talent, culture, enrollment, family engagement and facilities.',
      treatment: 'Three priorities: coordinate improvement across systems instead of running each as a separate initiative; align leadership and instructional support through executive support, leadership development, instructional coaching, teacher development and curriculum alignment; and connect staffing, family engagement, enrollment, culture and facilities work to the academic goals.',
      strengthening: 'BetterEd worked alongside the school\'s leaders and teachers through coaching and implementation support, so the routines were practiced inside the building rather than planned outside it.',
      sustainability: 'The engagement was designed to leave capacity behind. Leadership routines, instructional systems and measurement cycles were handed to the school team.',
    },
  },
];

export const insights = [
  {
    slug: 'diagnosis-before-prescription', status: 'review',
    title: 'Diagnosis before prescription',
    deck: 'Why the first job in school improvement is an honest exam, and what it should look at.',
    category: 'School Turnaround', author: 'BetterEd Solutions', date: '2026-11-08', readMinutes: 5,
    related: ['school-health', 'intensive-care'],
    body: [
      ['p', 'Most struggling schools have been prescribed something before anyone examined them. A new curriculum. A coaching vendor. A data platform. A new principal. Each arrives with good intentions and a theory of what is wrong. Few arrive with evidence about this school.'],
      ['p', 'Medicine learned long ago that treating a symptom without a diagnosis is how patients get worse. Schools deserve the same discipline. The institution is the patient. Children are not the problem, and neither are families. The conditions adults build around learning are where the cause usually lives.'],
      ['h2', 'What a good diagnosis looks at'],
      ['p', 'A useful diagnosis is broad before it is deep. It looks at leadership, culture and climate, instruction and achievement, and then at the systems most improvement plans ignore: talent, enrollment, operations, finance, facilities, family trust, special education and the plan itself. Problems in one domain usually show up as symptoms in another. Low reading scores can be an instruction problem. They can also be a staffing problem, a schedule problem or a culture problem.'],
      ['p', 'It also looks in more than one way. Data shows where to look. Classrooms, hallways, leadership meetings and conversations with teachers, students and families show why.'],
      ['h2', 'What it should produce'],
      ['p', 'A diagnosis is useful only if it narrows the work. The output should be a short list of root causes that explain the most, a clear statement of what is working and must be protected, and the measures that will tell everyone whether the treatment is working.'],
      ['quote', 'If a plan has more priorities than the principal can name from memory, it is not a plan. It is a list.'],
      ['h2', 'Then, and only then, treat'],
      ['p', 'With a diagnosis in hand, the treatment can be the right intensity. Some schools need their conditions stabilized and their leaders supported. Some need intensive care across every domain at once. Prescribing the same thing to both wastes money and, worse, wastes a year of children\'s learning.'],
      ['p', 'That is why every BetterEd engagement starts the same way. Diagnose. Treat. Strengthen. Sustain.'],
    ],
  },
  // M8: published articles on the current site; bodies to be migrated. Linked to their live URLs until then.
  { slug: 'the-first-90-days-of-a-school-turnaround', status: 'external', title: 'The First 90 Days of a School Turnaround', category: 'School Turnaround', author: 'Candido Brown', readMinutes: 8, externalUrl: 'https://betteredsolutions.org/blog/the-first-90-days-of-a-school-turnaround', deck: 'How to use the first three months to set the standard, drive consistency and lock in what works.' },
  { slug: 'executive-coaching-for-principals-is-not-a-luxury', status: 'external', title: 'Executive Coaching for Principals Is Not a Luxury', category: 'Leadership', author: 'Candido Brown', readMinutes: 6, externalUrl: 'https://betteredsolutions.org/blog/executive-coaching-for-principals-is-not-a-luxury', deck: 'Why principal coaching belongs in the core improvement budget, and what the evidence does and does not say.' },
  { slug: 'ai-wont-replace-teachers-it-should-protect-them', status: 'external', title: 'AI Won\'t Replace Teachers. It Should Protect Them.', category: 'AI & Education', author: 'Candido Brown', readMinutes: 7, externalUrl: 'https://betteredsolutions.org/blog/ai-wont-replace-teachers-it-should-protect-them', deck: 'Judge AI by the time and capacity it returns to teachers, with a human accountable for every decision.' },
];
