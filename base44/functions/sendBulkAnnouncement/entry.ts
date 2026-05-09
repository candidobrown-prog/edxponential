import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { community_id, community_name, subject, message, member_emails } = await req.json();

    if (!community_id || !subject || !message || !member_emails || member_emails.length === 0) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user is a moderator of this community
    const members = await base44.entities.CommunityMember.filter({
      community_id,
      user_email: user.email,
    });

    const userMember = members[0];
    if (!userMember || userMember.role !== 'moderator') {
      return Response.json({ error: 'Only moderators can send announcements' }, { status: 403 });
    }

    // Send emails to all members
    const emailPromises = member_emails.map(email =>
      base44.integrations.Core.SendEmail({
        to: email,
        subject: `[${community_name}] ${subject}`,
        body: `
<p>Hello,</p>

<p>${message}</p>

<p>---<br/>
This is an announcement from the <strong>${community_name}</strong> community.</p>
        `.trim(),
        from_name: `${community_name} Community`,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Bulk announcement sent: ${successful} successful, ${failed} failed`);

    return Response.json({
      success: true,
      sent: successful,
      failed,
      total: member_emails.length,
    });
  } catch (error) {
    console.error('Error sending bulk announcement:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});