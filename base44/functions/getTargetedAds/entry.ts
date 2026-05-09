import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is premium
    const isPremium = user.membership_tier === 'premium' || user.membership_tier === 'executive';
    if (isPremium) {
      return Response.json({ ads: [] });
    }

    const { placement } = await req.json();

    // Fetch active ads for this placement
    const ads = await base44.asServiceRole.entities.Advertisement.filter({
      placement_type: placement,
      status: 'active'
    });

    if (!ads || ads.length === 0) {
      return Response.json({ ads: [] });
    }

    // Rank ads based on:
    // 1. User role match
    // 2. User interests match
    // 3. Quality score
    // 4. Recent performance (CTR)

    const rankedAds = ads
      .map(ad => {
        let score = ad.quality_score || 5;

        // Boost if role matches
        if (ad.target_roles && ad.target_roles.includes(user.role)) {
          score += 3;
        }

        // Boost based on CTR
        score += (ad.ctr || 0) / 10;

        return { ...ad, ranking_score: score };
      })
      .sort((a, b) => b.ranking_score - a.ranking_score)
      .slice(0, 3); // Return top 3

    return Response.json({ ads: rankedAds });
  } catch (error) {
    console.error('Error getting targeted ads:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});