// Student engagement: five domains, each 0–100 only when evidence exists; weighted overall with coverage reporting.
export const ENGAGEMENT_DOMAINS = [
  { key: 'observable_participation', label: 'Observable participation', weight: 25, needs: ['audio', 'video', 'notes'] },
  { key: 'cognitive_engagement', label: 'Cognitive engagement and reasoning', weight: 30, needs: ['audio', 'video', 'notes', 'student_work'] },
  { key: 'task_engagement', label: 'Task engagement', weight: 20, needs: ['video', 'notes'] },            // visual on-task evidence
  { key: 'equitable_access', label: 'Equitable access', weight: 15, needs: ['audio', 'video', 'notes'] },
  { key: 'persistence', label: 'Persistence and responsiveness', weight: 10, needs: ['audio', 'video', 'notes', 'student_work'] },
];

export const ENGAGEMENT_BANDS = [
  { rating: 5, min: 90 }, { rating: 4, min: 80 }, { rating: 3, min: 65 }, { rating: 2, min: 50 }, { rating: 1, min: 0 },
];

/**
 * @param {object} domainScores { key: number|null } — null means not scored
 * @param {string[]} evidenceTypes available evidence: 'audio' | 'video' | 'notes' | 'student_work'
 */
export function computeEngagement(domainScores = {}, evidenceTypes = []) {
  const domains = ENGAGEMENT_DOMAINS.map((d) => {
    const supported = d.needs.some((n) => evidenceTypes.includes(n));
    const raw = domainScores[d.key];
    const valid = supported && typeof raw === 'number' && raw >= 0 && raw <= 100;
    return { ...d, score: valid ? raw : null, scored: valid, supported,
      reason: valid ? null : !supported ? `Requires ${d.needs.join(' or ')} evidence` : 'Insufficient evidence' };
  });
  const scored = domains.filter((d) => d.scored);
  const coverage = scored.reduce((a, d) => a + d.weight, 0);          // % of weight actually scored
  const weighted = coverage ? scored.reduce((a, d) => a + d.score * d.weight, 0) / coverage : null;
  const complete = coverage === 100;
  let rating = null;
  if (weighted !== null) rating = ENGAGEMENT_BANDS.find((b) => weighted >= b.min).rating;
  // A 5 additionally requires strong cognitive engagement, equitable access and full coverage
  const cog = domains.find((d) => d.key === 'cognitive_engagement'), eq = domains.find((d) => d.key === 'equitable_access');
  if (rating === 5 && !(complete && cog.score >= 85 && eq.score >= 85)) rating = 4;
  return {
    domains: domains.map(({ needs, ...d }) => d),
    coverage_pct: coverage,
    complete,
    weighted_score: weighted === null ? null : Math.round(weighted * 10) / 10,
    provisional_rating: rating,
    status: complete ? 'complete' : coverage ? 'partial' : 'insufficient_evidence',
    note: complete ? null : 'Scoring coverage is incomplete; the weighted score covers only the scored domains and must not be read as a total.',
  };
}
