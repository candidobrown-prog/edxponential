// Client-side persistence for the School Health Index flow.
// No backend in this MVP — progress is kept in sessionStorage so a visitor
// can move between steps without losing answers, consistent with the
// "preliminary, not final" nature of this automated snapshot.

const KEY = 'bettered_shi_v1';

const defaultState = {
  contact: null, // { name, email, phone, role, school, consent }
  school: null, // { schoolName, schoolType, location, website, grades, enrollment, campuses, governance, yearsOperating }
  responses: {}, // { [questionId]: 1-5 }
  submittedAt: null,
};

export function loadSHI() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function saveSHI(state) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors (private browsing, quota, etc.)
  }
}

export function clearSHI() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
