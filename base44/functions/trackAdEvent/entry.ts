import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { adId, event } = await req.json();

    if (!adId || !event) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Track the event based on type
    if (event === 'dismissed') {
      // Log dismissal event
      console.log(`Ad dismissed: ${adId} by ${user.email}`);
    } else if (event === 'clicked') {
      // Log click event and update ad metrics
      const ad = await base44.asServiceRole.entities.Advertisement.read(adId);
      if (ad) {
        await base44.asServiceRole.entities.Advertisement.update(adId, {
          clicks: (ad.clicks || 0) + 1,
          ctr: ((ad.clicks + 1) / (ad.impressions || 1)) * 100
        });
      }
    } else if (event === 'impression') {
      // Update impression count
      const ad = await base44.asServiceRole.entities.Advertisement.read(adId);
      if (ad) {
        await base44.asServiceRole.entities.Advertisement.update(adId, {
          impressions: (ad.impressions || 0) + 1,
          ctr: (ad.clicks || 0) / ((ad.impressions || 0) + 1) * 100
        });
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error tracking ad event:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});