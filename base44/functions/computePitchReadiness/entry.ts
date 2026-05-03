import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function computeScore(deal) {
  let score = 0;
  const suggestions = [];

  // Founder profile completeness (20 pts)
  if (deal.founder_name) score += 5;
  if (deal.founder_background) score += 5; else suggestions.push('Add your founder background and track record.');
  if (deal.founder_photo) score += 5; else suggestions.push('Upload a professional founder photo.');
  if (deal.founder_track_record) score += 5; else suggestions.push('Document your track record and prior results.');

  // School / company data (20 pts)
  if (deal.enrollment > 0) score += 5; else suggestions.push('Add enrollment or users served count.');
  if (deal.reading_proficiency > 0 || deal.math_proficiency > 0) score += 7; else suggestions.push('Add performance data — reading and math proficiency improve investor confidence.');
  if (deal.attendance_rate > 0) score += 4; else suggestions.push('Include your attendance rate.');
  if (deal.years_operating > 0) score += 4; else suggestions.push('Specify how many years your organization has been operating.');

  // Funding clarity (20 pts)
  if (deal.amount_seeking > 0) score += 5;
  if (deal.use_of_funds && deal.use_of_funds.length > 30) score += 8; else suggestions.push('Expand your use of funds section with specific allocations.');
  if (deal.minimum_investment > 0) score += 4; else suggestions.push('Set a minimum investment amount.');
  if (deal.timeline) score += 3; else suggestions.push('Add a timeline to close your round.');

  // Documents (20 pts)
  if (deal.pitch_deck_url) score += 8; else suggestions.push('Upload your pitch deck — this is required for investor review.');
  if (deal.financials_url) score += 7; else suggestions.push('Upload financial projections or current financials.');
  if (deal.growth_plan_url || (deal.growth_plan && deal.growth_plan.length > 50)) score += 5; else suggestions.push('Add a growth plan document or description.');

  // Narrative quality (20 pts)
  if (deal.problem && deal.problem.length > 50) score += 5; else suggestions.push('Expand the problem you are solving.');
  if (deal.solution && deal.solution.length > 50) score += 5; else suggestions.push('Expand your proposed solution.');
  if (deal.evidence_of_traction && deal.evidence_of_traction.length > 30) score += 5; else suggestions.push('Add evidence of traction — results, wins, milestones.');
  if (deal.risks && deal.risks.length > 20) score += 5; else suggestions.push('Complete the risks section — investors respect honest risk assessment.');

  let label = 'Not Ready for Deal Room';
  if (score >= 90) label = 'Investor Ready';
  else if (score >= 75) label = 'Nearly Ready';
  else if (score >= 60) label = 'Needs Strengthening';

  return { score: Math.min(100, score), label, suggestions };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { deal_id } = body;

    const allDeals = await base44.entities.DealRoom.list('-created_date', 500);
    const deals = allDeals.filter(d => d.id === deal_id);
    if (!deals?.length) return Response.json({ error: 'Deal not found' }, { status: 404 });

    const deal = deals[0];
    const { score, label, suggestions } = computeScore(deal);

    await base44.asServiceRole.entities.DealRoom.update(deal_id, {
      pitch_readiness_score: score,
      pitch_readiness_label: label,
      ai_suggestions: suggestions
    });

    return Response.json({ score, label, suggestions });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});