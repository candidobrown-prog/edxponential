// Mastery-risk engine: categorical risk + confidence from evidence quality. No numeric probabilities.
export const RISK = ['low', 'moderate', 'high', 'indeterminate'];
export const CONFIDENCE = ['high', 'moderate', 'low'];

/**
 * @param {object} e
 *   assessment: { correct, total, aligned: boolean } | null
 *   responses:  { analyzed, correct, incorrect, partial, unique_students }
 *   studentsPresent: number
 *   contradictions: number   (verbal vs written contradictions surfaced)
 *   misconceptionsHigh: number (misconception hypotheses with confidence >= moderate)
 */
export function assessMasteryRisk(e = {}) {
  const reasons = [];
  const present = e.studentsPresent || 0;
  const a = e.assessment;
  const r = e.responses || { analyzed: 0, correct: 0, incorrect: 0, partial: 0, unique_students: 0 };

  const hasAssessment = a && Number.isFinite(a.total) && a.total > 0;
  const assessmentPct = hasAssessment ? a.correct / a.total * 100 : null;
  if (a && !hasAssessment) reasons.push('Assessment denominator missing — mastery percentage not calculated.');
  if (hasAssessment && a.aligned === false) reasons.push('Assessment is not aligned to the standard; treated as weak evidence.');

  const coverage = present ? Math.min(1, (hasAssessment ? a.total : r.unique_students) / present) : 0;
  const sampleSmall = coverage < 0.5;
  if (sampleSmall) reasons.push(`Evidence covers ${Math.round(coverage * 100)}% of students present — whole-class conclusions are limited.`);

  const verbalPct = r.analyzed ? (r.correct + 0.5 * (r.partial || 0)) / r.analyzed * 100 : null;
  if (!hasAssessment && verbalPct === null) {
    return { risk: 'indeterminate', confidence: 'low', reasons: [...reasons, 'No assessment results and no analysable student responses.'], observed: {}, predicted: null };
  }

  const primary = hasAssessment && a.aligned !== false ? assessmentPct : verbalPct;
  let risk = primary >= 80 ? 'low' : primary >= 60 ? 'moderate' : 'high';
  if ((e.contradictions || 0) > 0) { reasons.push('Written and verbal evidence contradict each other.'); if (risk === 'low') risk = 'moderate'; }
  if ((e.misconceptionsHigh || 0) >= 2 && risk === 'low') { risk = 'moderate'; reasons.push('Multiple credible misconception hypotheses remain open.'); }

  let confidence = 'high';
  if (sampleSmall || !hasAssessment || (a && a.aligned === false)) confidence = 'moderate';
  if (sampleSmall && !hasAssessment) confidence = 'low';
  if ((e.contradictions || 0) > 0) confidence = confidence === 'high' ? 'moderate' : 'low';
  if (confidence === 'low' && coverage < 0.25) risk = 'indeterminate';

  return {
    risk, confidence, reasons,
    observed: { assessment_pct: assessmentPct === null ? null : Math.round(assessmentPct), verbal_pct: verbalPct === null ? null : Math.round(verbalPct), coverage_pct: Math.round(coverage * 100) },
    predicted: null,   // No validated predictive model: never emit a future-proficiency probability.
    notice: 'Describes observed understanding in this lesson; it is not a prediction of future proficiency.',
  };
}
