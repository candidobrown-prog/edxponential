import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { type, data } = body; // type: 'investor' | 'founder'

    let prompt = '';

    if (type === 'investor') {
      const inv = data;
      const stages = (inv.preferred_stage || []).map(s => s.replace('_', ' ')).join(', ');
      const focus = (inv.preferred_education_focus || []).join(', ');
      const involvement = (inv.desired_involvement || []).map(s => s.replace('_', ' ')).join(', ');
      const minK = inv.min_check_size ? `$${(inv.min_check_size/1000).toFixed(0)}K` : 'flexible';
      const maxK = inv.max_check_size ? `$${(inv.max_check_size/1000).toFixed(0)}K` : '';
      const range = maxK ? `${minK}–${maxK}` : minK;

      prompt = `Generate a 1-2 sentence investor thesis profile for an edVestor named ${inv.full_name || 'this investor'} with the following profile:
- Capital range: ${range}
- Preferred stages: ${stages || 'all stages'}
- Education focus: ${focus || 'general education'}
- Risk appetite: ${inv.risk_appetite || 'balanced'}
- Desired involvement: ${involvement || 'flexible'}
- Geography: ${inv.preferred_geography || 'national'}
- Impact priorities: ${(inv.impact_priorities || []).join(', ') || 'broad impact'}

Write in third-person, professional, concise. Start with "Invests..." Make it sound like a premium private capital profile. Do not use generic language.`;
    } else {
      const deal = data;
      prompt = `Generate a 1-2 sentence founder opportunity thesis for the following education investment opportunity:
- Organization: ${deal.organization || deal.title}
- Stage: ${deal.stage?.replace('_', ' ') || 'growth'}
- Funding ask: $${((deal.amount_seeking || 0)/1000).toFixed(0)}K
- Education type: ${deal.education_type || 'school'}
- Location: ${deal.location || deal.geography || 'United States'}
- Enrollment: ${deal.enrollment || 'unknown'} students
- Reading proficiency: ${deal.reading_proficiency || 'not reported'}%
- Math proficiency: ${deal.math_proficiency || 'not reported'}%
- Impact focus: ${deal.impact_focus || 'student outcomes'}
- Use of funds: ${deal.use_of_funds || 'expansion and growth'}
- Timeline: ${deal.timeline || 'flexible'}

Write in third-person, professional, concise. Start with a descriptor of the school/org type. Make it sound like a premium capital market profile summary. Do not use generic language.`;
    }

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    return Response.json({ thesis: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});