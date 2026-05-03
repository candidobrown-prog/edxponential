import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function scoreCapitalFit(deal, investor) {
  if (!deal.amount_seeking || !investor.min_check_size) return 0;
  const ask = deal.amount_seeking;
  const min = investor.min_check_size || 0;
  const max = investor.max_check_size || Infinity;
  if (ask >= min && ask <= max) return 20;
  if (ask >= min * 0.5 && ask <= max * 2) return 12;
  if (ask >= min * 0.25 && ask <= max * 3) return 6;
  return 0;
}

function scoreStageFit(deal, investor) {
  if (!deal.stage || !investor.preferred_stage?.length) return 8;
  const stageMap = { idea: 'idea', launch: 'launch', early_traction: 'early_traction', growth: 'growth', turnaround: 'turnaround', acquisition: 'acquisition' };
  const mapped = stageMap[deal.stage] || deal.stage;
  return investor.preferred_stage.includes(mapped) ? 15 : 3;
}

function scoreSectorFit(deal, investor) {
  if (!investor.preferred_education_focus?.length) return 8;
  const sectorMap = {
    charter: ['charter'], private: ['private'], public: ['turnaround'],
    higher_ed: ['leadership'], edtech: ['edtech'], services: ['workforce'], other: []
  };
  const dealSectors = sectorMap[deal.education_type] || [];
  const overlap = dealSectors.filter(s => investor.preferred_education_focus.includes(s));
  if (overlap.length > 0) return 15;
  const impactMap = {
    literacy: ['literacy'], math: ['math'], turnaround: ['turnaround'],
    scaling: ['charter', 'edtech'], access: ['underserved', 'special_ed']
  };
  const impactSectors = impactMap[deal.impact_focus] || [];
  const impactOverlap = impactSectors.filter(s => investor.preferred_education_focus.includes(s));
  return impactOverlap.length > 0 ? 10 : 3;
}

function scoreImpactFit(deal, investor) {
  if (!investor.impact_priorities?.length) return 8;
  let score = 0;
  const priorities = investor.impact_priorities;
  if (priorities.includes('reading_proficiency') && deal.reading_proficiency > 0) score += 4;
  if (priorities.includes('math_proficiency') && deal.math_proficiency > 0) score += 4;
  if (priorities.includes('enrollment_growth') && deal.enrollment > 0) score += 3;
  if (priorities.includes('attendance') && deal.attendance_rate > 0) score += 3;
  if (priorities.includes('underserved') && deal.impact_focus === 'access') score += 5;
  if (priorities.includes('innovation') && deal.education_type === 'edtech') score += 3;
  if (priorities.includes('founder_diversity')) score += 2;
  return Math.min(15, score);
}

function scoreGeographyFit(deal, investor) {
  if (!investor.preferred_geography || !deal.geography) return 5;
  const inv = investor.preferred_geography.toLowerCase();
  const deal_geo = deal.geography.toLowerCase();
  if (inv === 'national' || inv === 'all' || inv === 'anywhere') return 10;
  if (deal_geo.includes(inv) || inv.includes(deal_geo)) return 10;
  const states = ['tx', 'ca', 'ny', 'fl', 'il', 'oh', 'pa', 'ga'];
  for (const st of states) {
    if (deal_geo.includes(st) && inv.includes(st)) return 10;
  }
  return 3;
}

function scoreRiskFit(deal, investor) {
  if (!investor.risk_appetite || !deal.risk_profile) return 5;
  const riskOrder = ['conservative', 'balanced', 'bold', 'transformational'];
  const invIdx = riskOrder.indexOf(investor.risk_appetite);
  const dealIdx = riskOrder.indexOf(deal.risk_profile || 'balanced');
  const diff = Math.abs(invIdx - dealIdx);
  if (diff === 0) return 10;
  if (diff === 1) return 7;
  if (diff === 2) return 3;
  return 0;
}

function scoreInvolvementFit(deal, investor) {
  if (!investor.desired_involvement?.length || !deal.desired_investor_involvement) return 5;
  return investor.desired_involvement.includes(deal.desired_investor_involvement) ? 10 : 3;
}

function scoreMomentum(deal) {
  let score = 0;
  if (deal.pitch_readiness_score > 80) score += 2;
  if (deal.intros_count > 3) score += 1;
  if (deal.saves_count > 5) score += 1;
  const committed = deal.committed_capital || 0;
  const seeking = deal.amount_seeking || 1;
  if (committed / seeking > 0.3) score += 1;
  return Math.min(5, score);
}

function getLabel(score) {
  if (score >= 90) return 'Exceptional Match';
  if (score >= 80) return 'Strong Match';
  if (score >= 70) return 'Good Match';
  if (score >= 60) return 'Possible Fit';
  return 'Low Fit';
}

function generateExplanation(deal, investor, breakdown) {
  const parts = [];
  const focus = (investor.preferred_education_focus || []).slice(0, 3).join(', ');
  const stages = (investor.preferred_stage || []).slice(0, 2).join(', ');
  if (breakdown.capital_fit >= 15) parts.push(`the funding ask of $${(deal.amount_seeking/1000).toFixed(0)}K fits within your capital range`);
  if (breakdown.stage_fit === 15) parts.push(`this is a ${deal.stage?.replace('_', ' ')} stage opportunity matching your preferred stage`);
  if (breakdown.sector_fit >= 10 && focus) parts.push(`aligns with your focus on ${focus}`);
  if (breakdown.impact_fit >= 10) parts.push(`strong alignment on your impact priorities`);
  if (breakdown.geography_fit >= 8) parts.push(`geography aligns with your preferred region`);
  const score = breakdown.total;
  const prefix = score >= 90 ? 'Exceptional match because' : score >= 80 ? 'Strong match because' : 'Potential match because';
  const explanation = `${prefix} ${parts.join(', ')}. Founder ${deal.founder_name} is seeking ${investor.desired_involvement?.includes(deal.desired_investor_involvement) ? 'the type of involvement you prefer' : 'capital and operational support'}.`;
  return explanation;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { edvestor_email, deal_id } = body;

    // Fetch investors and deals
    const [allInvestors, allDealsRaw] = await Promise.all([
      edvestor_email
        ? base44.asServiceRole.entities.EdVestor.filter({ user_email: edvestor_email })
        : base44.asServiceRole.entities.EdVestor.filter({ status: 'active' }),
      deal_id
        ? base44.asServiceRole.entities.DealRoom.list('-created_date', 500)
        : base44.asServiceRole.entities.DealRoom.filter({ status: 'active' })
    ]);

    const allDeals = deal_id
      ? allDealsRaw.filter(d => d.id === deal_id)
      : allDealsRaw;

    const results = [];

    for (const investor of allInvestors) {
      if (!investor.user_email) continue;
      for (const deal of allDeals) {
        const capital_fit = scoreCapitalFit(deal, investor);
        const stage_fit = scoreStageFit(deal, investor);
        const sector_fit = scoreSectorFit(deal, investor);
        const impact_fit = scoreImpactFit(deal, investor);
        const geography_fit = scoreGeographyFit(deal, investor);
        const risk_fit = scoreRiskFit(deal, investor);
        const involvement_fit = scoreInvolvementFit(deal, investor);
        const momentum_fit = scoreMomentum(deal);

        const total = capital_fit + stage_fit + sector_fit + impact_fit +
                      geography_fit + risk_fit + involvement_fit + momentum_fit;

        const breakdown = { capital_fit, stage_fit, sector_fit, impact_fit, geography_fit, risk_fit, involvement_fit, momentum_fit, total };
        const label = getLabel(total);
        const explanation = generateExplanation(deal, investor, breakdown);

        // Build AI insights
        const insights = [];
        if (deal.reading_proficiency && investor.preferred_education_focus?.includes('literacy')) {
          insights.push(`This deal fits your literacy thesis — ${deal.reading_proficiency}% reading proficiency reported.`);
        }
        if (deal.amount_seeking > (investor.max_check_size || Infinity)) {
          insights.push(`This ask is above your usual maximum check size. Consider co-investing.`);
        }
        if (deal.pitch_deck_url && !deal.financials_url) {
          insights.push(`Founder has a pitch deck but limited financial documentation. Request financials before committing.`);
        }
        if (deal.desired_investor_involvement === 'hands_on' || deal.desired_investor_involvement === 'board') {
          insights.push(`This opportunity may require hands-on advisory or board-level support.`);
        }
        if (deal.intros_count > 2) {
          insights.push(`${deal.intros_count} investors have already expressed interest — momentum is building.`);
        }

        // Check if match already exists
        const existing = await base44.asServiceRole.entities.MatchScore.filter({
          edvestor_email: investor.user_email,
          deal_id: deal.id
        });

        const matchData = {
          edvestor_email: investor.user_email,
          deal_id: deal.id,
          deal_title: deal.title,
          founder_name: deal.founder_name,
          score: total,
          label,
          capital_fit,
          stage_fit,
          sector_fit,
          impact_fit,
          geography_fit,
          risk_fit,
          involvement_fit,
          momentum_fit,
          explanation,
          why_strong: total >= 80 ? `Strong alignment on ${[stage_fit === 15 ? 'stage' : null, sector_fit >= 10 ? 'sector' : null, impact_fit >= 10 ? 'impact priorities' : null].filter(Boolean).join(', ')}` : null,
          review_first: `Funding ask: $${((deal.amount_seeking || 0)/1000).toFixed(0)}K · Stage: ${deal.stage} · ${deal.location || deal.geography || 'Location TBD'}`,
          potential_concerns: deal.risks || (deal.pitch_readiness_score < 60 ? 'Pitch deck not yet complete' : null),
          recommended_action: total >= 80 ? 'Request Introduction' : total >= 70 ? 'Review Opportunity' : 'Add to Pipeline',
          ai_insights: insights,
          computed_at: new Date().toISOString(),
          is_visible: total >= 60
        };

        if (existing?.length > 0) {
          await base44.asServiceRole.entities.MatchScore.update(existing[0].id, matchData);
        } else {
          await base44.asServiceRole.entities.MatchScore.create(matchData);
        }

        results.push({ edvestor: investor.full_name, deal: deal.title, score: total, label });
      }
    }

    return Response.json({ success: true, matches_computed: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});