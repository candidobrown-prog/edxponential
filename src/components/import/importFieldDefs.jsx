/**
 * Field definitions for each import type.
 * Each field: { key, label, required, type, aliases, hint, sample }
 */

export const STUDENT_FIELDS = [
  { key: 'student_name', label: 'Student Name', required: true, aliases: ['name', 'fullname', 'studentname', 'student'], hint: 'First and last name', sample: 'Jayden Smith' },
  { key: 'grade', label: 'Grade Level', required: true, aliases: ['grade', 'gradelevel', 'gr', 'level'], hint: 'K, 1–12', sample: '5' },
  { key: 'student_id_number', label: 'Student ID', required: false, aliases: ['studentid', 'id', 'student_id', 'stuid'], hint: 'Unique ID number', sample: 'STU-2024-001' },
  { key: 'homeroom_teacher', label: 'Homeroom Teacher', required: false, aliases: ['teacher', 'homeroom', 'homeroomteacher'], hint: 'Teacher last name or full name', sample: 'Ms. Johnson' },
  { key: 'counselor', label: 'Counselor', required: false, aliases: ['counselor', 'counsellorname'], hint: 'Assigned counselor', sample: 'Mr. Williams' },
  { key: 'subgroup', label: 'Subgroup', required: false, aliases: ['subgroup', 'group', 'cohort'], hint: 'e.g. ELL, SpEd, GT', sample: 'ELL' },
  { key: 'parent_name', label: 'Parent / Guardian Name', required: false, aliases: ['parentname', 'guardianname', 'parent', 'guardian'], sample: 'Maria Smith' },
  { key: 'parent_email', label: 'Parent Email', required: false, type: 'email', aliases: ['parentemail', 'guardianemail', 'email'], sample: 'maria.smith@email.com' },
  { key: 'parent_phone', label: 'Parent Phone', required: false, aliases: ['parentphone', 'phone', 'guardianphone', 'contact'], sample: '555-867-5309' },
  { key: 'attendance_pct', label: 'Attendance %', required: false, type: 'number', aliases: ['attendance', 'attendancepct', 'attendpct', 'attpct'], hint: '0–100', sample: '94' },
  { key: 'gpa', label: 'GPA', required: false, type: 'number', aliases: ['gpa', 'gradepoint'], hint: '0.0–4.0', sample: '3.2' },
  { key: 'risk_level', label: 'Risk Level', required: false, aliases: ['risk', 'risklevel', 'riskstatus'], hint: 'on_track / watch / concern / at_risk / critical', sample: 'on_track' },
  { key: 'notes', label: 'Notes', required: false, aliases: ['notes', 'comments', 'memo'], sample: '' },
];

export const CULTURE_FIELDS = [
  { key: 'student_name', label: 'Student Name', required: true, aliases: ['name', 'student', 'studentname'], sample: 'Jayden Smith' },
  { key: 'grade', label: 'Grade', required: false, aliases: ['grade', 'gr', 'gradelevel'], sample: '5' },
  { key: 'entry_date', label: 'Date', required: true, aliases: ['date', 'entrydate', 'incidentdate', 'eventdate'], hint: 'MM/DD/YYYY', sample: '09/15/2024' },
  { key: 'category', label: 'Category', required: true, aliases: ['category', 'type', 'eventtype', 'incidenttype'], hint: 'tardy / infraction_minor / suspension / etc.', sample: 'tardy' },
  { key: 'severity', label: 'Severity', required: false, aliases: ['severity', 'level', 'seriousness'], hint: 'low / medium / high / critical', sample: 'low' },
  { key: 'teacher', label: 'Teacher', required: false, aliases: ['teacher', 'reportedby', 'staff'], sample: 'Ms. Johnson' },
  { key: 'location', label: 'Location', required: false, aliases: ['location', 'place', 'room'], sample: 'Hallway B' },
  { key: 'description', label: 'Description', required: false, aliases: ['description', 'details', 'notes', 'summary'], sample: 'Student arrived 12 minutes late' },
  { key: 'action_taken', label: 'Action Taken', required: false, aliases: ['action', 'actiontaken', 'response'], sample: 'Verbal warning issued' },
  { key: 'resolution_status', label: 'Status', required: false, aliases: ['status', 'resolution', 'resolutionstatus'], hint: 'open / pending / resolved', sample: 'open' },
];

export const STAFF_FIELDS = [
  { key: 'staff_name', label: 'Staff Name', required: true, aliases: ['name', 'staffname', 'fullname', 'employee'], sample: 'Angela Rodriguez' },
  { key: 'staff_email', label: 'Email', required: true, type: 'email', aliases: ['email', 'staffemail', 'workemail'], sample: 'a.rodriguez@school.edu' },
  { key: 'role', label: 'Role', required: true, aliases: ['role', 'position', 'title', 'jobtitle'], hint: 'counselor / dean / teacher_leader / etc.', sample: 'counselor' },
  { key: 'school_id', label: 'School ID', required: false, aliases: ['schoolid', 'school', 'location'], sample: 'SCH-001' },
];

export const ATTENDANCE_FIELDS = [
  { key: 'student_name', label: 'Student Name', required: true, aliases: ['name', 'student', 'studentname'], sample: 'Jayden Smith' },
  { key: 'grade', label: 'Grade', required: false, aliases: ['grade', 'gr'], sample: '5' },
  { key: 'entry_date', label: 'Date', required: true, aliases: ['date', 'attendancedate', 'day'], hint: 'MM/DD/YYYY', sample: '09/15/2024' },
  { key: 'category', label: 'Attendance Type', required: true, aliases: ['type', 'attendancetype', 'code', 'category'], hint: 'attendance / tardy / absence_excused / absence_unexcused', sample: 'tardy' },
  { key: 'description', label: 'Notes', required: false, aliases: ['notes', 'reason', 'description'], sample: 'Doctor appointment' },
];