// BetterEd CFU-100 rubric — weighted scoring with strict handling of missing evidence and unapproved multipliers.
export const CFU_DIMENSIONS = [
  { key: 'learning_targets', label: 'Learning targets and success criteria', weight: 8 },
  { key: 'question_quality', label: 'Question quality and cognitive demand', weight: 12 },
  { key: 'equitable_visibility', label: 'Equitable visibility of student thinking', weight: 12 },
  { key: 'cfu_intentionality', label: 'CFU intentionality and frequency', weight: 12 },
  { key: 'student_reasoning', label: 'Student reasoning and metacognition', weight: 12 },
  { key: 'misconception_diagnosis', label: 'Misconception diagnosis', weight: 10 },
  { key: 'instructional_responsiveness', label: 'Instructional responsiveness', weight: 12 },
  { key: 'actionable_feedback', label: 'Actionable feedback', weight: 8 },
  { key: 'student_ownership', label: 'Student ownership and discourse', weight: 7 },
  { key: 'verification_transfer', label: 'Verification and transfer', weight: 7 },
];
export const CFU_LEVELS = ['distinguished', 'proficient', 'basic', 'unsatisfactory'];
export const NON_SCORING = ['not_observed', 'insufficient_evidence'];

// Approved multipliers. Basic and Unsatisfactory are intentionally null until the authoritative rubric is imported.
export const DEFAULT_RUBRIC = {
  version: 'CFU-100 v1 (partial — awaiting authoritative anchors)',
  dimensions: CFU_DIMENSIONS,
  multipliers: { distinguished: 1.0, proficient: 0.8, basic: null, unsatisfactory: null },
  anchors: {},            // { dimensionKey: { level: 'descriptor text' } } — imported from the approved source
  authoritative: false,
};

export function rubricTotalsOk(rubric) {
  return rubric.dimensions.reduce((a, d) => a + d.weight, 0) === 100;
}

/**
 * @param {object} ratings { dimensionKey: { level, evidence?: [], rationale?, confidence? } }
 * @param {object} rubric  rubric config (DEFAULT_RUBRIC shape)
 */
export function scoreCfu100(ratings = {}, rubric = DEFAULT_RUBRIC) {
  if (!rubricTotalsOk(rubric)) throw new Error('Rubric dimension weights must total 100');
  const rows = []; const blockers = []; let earned = 0, weightScored = 0;
  for (const d of rubric.dimensions) {
    const r = ratings[d.key] || {};
    const level = r.level ?? 'insufficient_evidence';
    let points = null, status = 'scored';
    if (NON_SCORING.includes(level)) { status = level; }
    else if (!CFU_LEVELS.includes(level)) { status = 'invalid'; blockers.push(`${d.label}: unknown level "${level}"`); }
    else {
      const m = rubric.multipliers[level];
      if (m === null || m === undefined) { status = 'unapproved_multiplier'; blockers.push(`${d.label}: level "${level}" has no approved multiplier in the configured rubric`); }
      else { points = Math.round(d.weight * m * 100) / 100; earned += points; weightScored += d.weight; }
    }
    const hasEvidence = Array.isArray(r.evidence) && r.evidence.length > 0;
    if (status === 'scored' && !hasEvidence) blockers.push(`${d.label}: rated "${level}" without linked evidence`);
    rows.push({ key: d.key, label: d.label, weight: d.weight, level, status, points, evidence: r.evidence || [],
      rationale: r.rationale || null, missing_evidence: r.missing_evidence || null, confidence: r.confidence ?? null,
      reviewer: r.reviewer || null, approval_status: r.approval_status || 'proposed', timestamp: r.timestamp ?? null });
  }
  const complete = weightScored === 100 && blockers.length === 0;
  return {
    rubric_version: rubric.version,
    rows,
    weight_scored: weightScored,
    earned_points: Math.round(earned * 100) / 100,
    // Only a complete score may be presented "out of 100".
    score_out_of_100: complete ? Math.round(earned * 100) / 100 : null,
    // Partial view: earned over the weight that was actually scored (never labelled as /100)
    partial_pct_of_scored: weightScored ? Math.round(earned / weightScored * 1000) / 10 : null,
    status: complete ? 'complete' : weightScored ? 'provisional' : 'unscored',
    finalizable: complete && rubric.authoritative === true,
    blockers: rubric.authoritative ? blockers : [...blockers, 'Authoritative CFU-100 rubric (Basic/Unsatisfactory multipliers and anchors) has not been imported; finalization is blocked'],
    developmental_notice: 'Developmental coaching score — not a personnel evaluation rating.',
  };
}
