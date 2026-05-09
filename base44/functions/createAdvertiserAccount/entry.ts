import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userEmail, companyName } = await req.json();

    if (!userEmail) {
      return Response.json({ error: 'Missing email' }, { status: 400 });
    }

    // Check if account already exists
    const existing = await base44.asServiceRole.entities.AdvertiserAccount.filter({
      email: userEmail
    });

    if (existing && existing.length > 0) {
      return Response.json({ account: existing[0] });
    }

    // Create new advertiser account
    const account = await base44.asServiceRole.entities.AdvertiserAccount.create({
      email: userEmail,
      company_name: companyName || userEmail,
      status: 'pending_approval'
    });

    // Send welcome email to admin
    await base44.integrations.Core.SendEmail({
      to: 'admin@edxponential.com',
      subject: 'New Advertiser Application',
      body: `New advertiser account pending approval: ${companyName || userEmail}`
    }).catch(err => {
      console.log('Email notification failed:', err);
    });

    return Response.json({ account });
  } catch (error) {
    console.error('Error creating advertiser account:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});