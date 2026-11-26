export const PRIMARY_NAV = [
  { label: 'Home', to: '/' },
  { label: 'School Health Index', to: '/school-health-index' },
  { label: 'Services', to: '/services' },
  { label: 'Academies', to: '/academies' },
  { label: 'Talent Exchange', to: '/talent-exchange' },
  { label: 'Case Studies', to: '/case-studies' },
];

export const ECOSYSTEM_NAV = [
  { label: 'edXponential', to: '/edxponential', description: 'Membership, courses, coaching, and community' },
  { label: 'The EdXponent', to: '/the-edxponent', description: 'BetterEd’s publication on school transformation' },
  { label: 'Raise Teacher Pay Project', to: '/raise-teacher-pay', description: 'Advocacy for teacher compensation and sustainability' },
];

export const SECONDARY_NAV = [
  { label: 'About', to: '/about' },
  { label: 'Insights', to: '/insights' },
  { label: 'Contact', to: '/contact' },
];

export const FOOTER_COLUMNS = [
  {
    heading: 'Diagnose',
    links: [
      { label: 'School Health Index', to: '/school-health-index' },
      { label: 'The BetterEd Medical Model', to: '/about/medical-model' },
      { label: 'The BetterEd Vitamins™', to: '/about/bettered-vitamins' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'All Services', to: '/services' },
      { label: 'School Improvement & Transformation', to: '/services/school-improvement' },
      { label: 'Executive Coaching', to: '/services/executive-coaching' },
      { label: 'Talent Acquisition', to: '/services/talent-acquisition' },
      { label: 'Capital, Advancement & Investment', to: '/services/capital-advancement-investment' },
    ],
  },
  {
    heading: 'Grow',
    links: [
      { label: 'BetterEd Academies', to: '/academies' },
      { label: 'Talent Exchange', to: '/talent-exchange' },
      { label: 'Case Studies', to: '/case-studies' },
    ],
  },
  {
    heading: 'Ecosystem',
    links: [
      { label: 'edXponential', to: '/edxponential' },
      { label: 'The EdXponent', to: '/the-edxponent' },
      { label: 'Raise Teacher Pay Project', to: '/raise-teacher-pay' },
      { label: 'Insights', to: '/insights' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About BetterEd', to: '/about' },
      { label: 'Candido Brown’s Story', to: '/about/candido-brown' },
      { label: 'Team', to: '/about/team' },
      { label: 'Contact', to: '/contact' },
      { label: 'Client Login', to: '/login' },
    ],
  },
];

export const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Accessibility', to: '/accessibility' },
  { label: 'Cookie Policy', to: '/cookies' },
];

// Flat index of every page, used by the header search palette.
export const SEARCH_INDEX = [
  { label: 'Home', to: '/', group: 'Main' },
  { label: 'School Health Index', to: '/school-health-index', group: 'Main' },
  { label: 'Take the School Health Index', to: '/school-health-index/start', group: 'Main' },
  { label: 'Services', to: '/services', group: 'Main' },
  { label: 'Academies', to: '/academies', group: 'Main' },
  { label: 'Talent Exchange', to: '/talent-exchange', group: 'Main' },
  { label: 'Case Studies', to: '/case-studies', group: 'Main' },
  { label: 'Shining Stars Montessori Case Study', to: '/case-studies/shining-stars-montessori', group: 'Case Studies' },
  { label: 'edXponential', to: '/edxponential', group: 'Ecosystem' },
  { label: 'The EdXponent', to: '/the-edxponent', group: 'Ecosystem' },
  { label: 'Raise Teacher Pay Project', to: '/raise-teacher-pay', group: 'Ecosystem' },
  { label: 'About BetterEd', to: '/about', group: 'Company' },
  { label: 'The BetterEd Medical Model', to: '/about/medical-model', group: 'Company' },
  { label: 'The BetterEd Vitamins™', to: '/about/bettered-vitamins', group: 'Company' },
  { label: 'Candido Brown’s Story', to: '/about/candido-brown', group: 'Company' },
  { label: 'Team', to: '/about/team', group: 'Company' },
  { label: 'Insights', to: '/insights', group: 'Company' },
  { label: 'Contact', to: '/contact', group: 'Company' },
  { label: 'Client Login', to: '/login', group: 'Company' },
];
