/* School Health Index: account options and exam questions.
   Every answer is a choice where possible; written answers are few and mostly optional.
   Scoring: agreement items map 1-5 to 0-100 (Don't know is excluded); a domain score is the
   mean of its items; the overall score is the mean of the 12 domain scores. See supabase/schema.sql. */

export const ROLES = [
  'Principal', 'Assistant principal', 'Head of school', 'Executive director', 'Superintendent',
  'Deputy or assistant superintendent', 'District administrator', 'Charter network leader',
  'Board member', 'Dean or culture lead', 'Instructional coach', 'Teacher',
  'State education agency staff', 'Other',
];

export const HEARD_FROM = [
  'Google or another search engine', 'AI assistant (ChatGPT, Claude, Gemini, etc.)',
  'LinkedIn', 'Facebook', 'Instagram', 'X (Twitter)', 'YouTube', 'TikTok',
  'Referral from a colleague', 'District or network leader', 'State education agency',
  'Charter authorizer or support organization', 'Conference or event', 'Webinar',
  'Email or newsletter', 'Podcast', 'Article or news story', 'Partner organization',
  'Worked with BetterEd before', 'Other',
];

export const BUDGETS = ['$5,000–$10,000', '$10,000–$25,000', '$25,000–$50,000', '$50,000–$75,000', '$75,000–$100,000', 'Over $100,000'];

export const CALL_TIMES = ['Morning (8–11 a.m.)', 'Midday (11 a.m.–2 p.m.)', 'Afternoon (2–5 p.m.)', 'Any time'];

export const INTERESTS = ['School Health (culture & climate)', 'Leader Development', 'Teacher Development', 'Intensive Care (whole-school turnaround)', 'Not sure yet: diagnosis first'];

export const STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'],
  ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'],
  ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'],
  ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'],
  ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'],
  ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'],
  ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
  ['AS', 'American Samoa'], ['GU', 'Guam'], ['MP', 'Northern Mariana Islands'], ['PR', 'Puerto Rico'], ['VI', 'U.S. Virgin Islands'],
];

export const AGREE = ['Strongly disagree', 'Disagree', 'Neither', 'Agree', 'Strongly agree'];

/* About your school: quick context, all choices */
export const CONTEXT = [
  { id: 'c_type', label: 'What kind of school is it?', options: ['Traditional public school', 'Public charter school', 'Private or independent school', 'Other'], required: true },
  { id: 'c_grades', label: 'Which grades do you serve?', options: ['Elementary (PK–5)', 'Middle (6–8)', 'High (9–12)', 'K–8', 'K–12', '6–12', 'Other'], required: true },
  { id: 'c_enroll', label: 'About how many students are enrolled?', options: ['Under 250', '250–499', '500–749', '750–999', '1,000 or more'], required: true },
  { id: 'c_tenure', label: 'How long have you been in your current role?', options: ['Less than 1 year', '1–2 years', '3–5 years', '6 or more years'], required: true },
  { id: 'c_status', label: 'What is your school\'s current accountability status?', options: ['Not identified for support', 'Targeted support (TSI or ATSI)', 'Comprehensive support (CSI)', 'Charter renewal, probation or warning', 'Not sure'], required: true },
  { id: 'c_urgency', label: 'How soon do you need things to change?', options: ['This semester', 'This school year', 'Next school year', 'Exploring for now'], required: true },
];

/* The 12 domains, in the same order as the public School Health Index page */
export const DOMAINS = [
  { n: '01', key: 'leadership', name: 'Leadership', items: [
    'Our leadership team has a small number of clear priorities that everyone can name.',
    'School leaders spend part of every week in classrooms, giving teachers feedback.',
    'Decisions are made by the right people, and once made, they stick.',
  ] },
  { n: '02', key: 'culture', name: 'Culture and Climate', items: [
    'Students feel safe, known and expected to succeed.',
    'Arrival, transitions and dismissal are calm and consistent.',
    'Adults hold the same high expectations in every classroom.',
  ] },
  { n: '03', key: 'instruction', name: 'Instruction', items: [
    'Lessons are planned around what students must learn, not just the next activity.',
    'Teaching quality is consistent from room to room.',
    'Teachers get useful feedback on their teaching at least every two weeks.',
  ] },
  { n: '04', key: 'achievement', name: 'Student Achievement', items: [
    'Most of our students read and do math at grade level.',
    'Student achievement has improved over the last two years.',
    'We know which groups of students are furthest behind, and we act on it.',
  ] },
  { n: '05', key: 'talent', name: 'Talent', items: [
    'We fill teaching vacancies with strong candidates before the school year starts.',
    'Our most effective teachers choose to stay.',
    'New teachers get structured support in their first year.',
  ] },
  { n: '06', key: 'enrollment', name: 'Enrollment', items: [
    'Enrollment is stable or growing.',
    'Most families re-enroll year after year.',
    'We understand why families choose our school, and why some leave.',
  ] },
  { n: '07', key: 'operations', name: 'Operations', items: [
    'Schedules, systems and routines run without constant attention from the principal.',
    'Daily attendance is strong, and chronic absence is low.',
    'We review data in regular cycles, not just at deadlines.',
  ] },
  { n: '08', key: 'finance', name: 'Finance', items: [
    'Our budget reflects our top priorities.',
    'Our finances are sustainable for the next three years.',
    'Leaders understand the budget well enough to make trade-offs.',
  ] },
  { n: '09', key: 'facilities', name: 'Facilities', items: [
    'The building supports safety and learning.',
    'Classrooms and common spaces are clean, orderly and welcoming.',
    'Facility problems get fixed quickly.',
  ] },
  { n: '10', key: 'family', name: 'Family Trust', items: [
    'Families know what the school expects of their children, and why.',
    'Families hear from us about good news, not only problems.',
    'Most families would recommend this school to a friend.',
  ] },
  { n: '11', key: 'sped', name: 'Special Education', items: [
    'Students with disabilities receive the services in their plans, on time.',
    'Students with disabilities are making real progress.',
    'General and special education teachers plan together.',
  ] },
  { n: '12', key: 'planning', name: 'Strategic Planning', items: [
    'We have a written plan with a few priorities, owners and measures.',
    'We review progress on the plan at least once a month.',
    'Our board or district oversees the work in a way that helps.',
  ] },
];

/* In your own words: one required answer, the rest optional */
export const OPEN = [
  { id: 'o_keeping', label: 'In your own words, what is keeping your school from getting better?', hint: 'A few sentences is plenty. Tell us what you see every day.', required: true, max: 2000 },
  { id: 'o_tried', label: 'What have you already tried?', hint: 'Optional.', required: false, max: 2000 },
  { id: 'o_first', label: 'If BetterEd could help with one thing first, what would it be?', options: INTERESTS, required: true },
  { id: 'o_level', label: 'Who should the work reach first?', options: ['Core: one leader, one-to-one', 'Crew: a leadership or teacher team', 'Cohort: leaders or teachers across campuses', 'Community: the whole school', 'Not sure yet'], required: false },
];

export const itemId = (d, i) => `d${d.n}_${i + 1}`;
export const noteId = (d) => `d${d.n}_note`;
