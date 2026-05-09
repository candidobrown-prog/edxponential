import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Send email reminders 24 hours before scheduled coaching sessions
 * Runs via scheduled automation (every 6 hours)
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Only admins can trigger reminders via API
    if (user?.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    // Get all active coaching sessions
    const sessions = await base44.entities.CoachingSession?.filter?.(
      { status: 'scheduled' },
      'scheduled_date',
      1000
    );

    if (!sessions || sessions.length === 0) {
      return Response.json({ message: 'No sessions found', reminders_sent: 0 });
    }

    const now = new Date();
    const reminders_sent = [];
    const errors = [];

    for (const session of sessions) {
      try {
        // Parse session date
        const sessionDate = new Date(session.scheduled_date);
        const hoursUntilSession = (sessionDate - now) / (1000 * 60 * 60);

        // Check if session is 24 hours away (23-25 hour window)
        if (hoursUntilSession > 23 && hoursUntilSession < 25) {
          // Skip if reminder already sent
          if (session.reminder_sent) {
            continue;
          }

          const coachEmail = session.coach_email;
          const executiveEmail = session.executive_email;
          const coachName = session.coach_name || 'Coach';
          const executiveName = session.executive_name || 'Executive';
          const sessionTitle = session.title || 'Coaching Session';

          const formattedDate = sessionDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });

          const formattedTime = sessionDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          });

          // Send email to coach
          if (coachEmail) {
            try {
              await base44.integrations.Core.SendEmail({
                to: coachEmail,
                from_name: 'edXponential Coaching',
                subject: `Reminder: ${sessionTitle} Tomorrow at ${formattedTime}`,
                body: `Hi ${coachName},\n\nThis is a friendly reminder that you have a scheduled coaching session tomorrow.\n\nSession Details:\n- Title: ${sessionTitle}\n- Date: ${formattedDate}\n- Time: ${formattedTime}\n- Executive: ${executiveName}\n\nPlease make sure you're prepared and on time.\n\nBest regards,\nThe edXponential Team`,
              });
            } catch (error) {
              errors.push({
                session_id: session.id,
                recipient: coachEmail,
                error: error.message,
              });
            }
          }

          // Send email to executive
          if (executiveEmail) {
            try {
              await base44.integrations.Core.SendEmail({
                to: executiveEmail,
                from_name: 'edXponential Coaching',
                subject: `Reminder: ${sessionTitle} Tomorrow at ${formattedTime}`,
                body: `Hi ${executiveName},\n\nThis is a friendly reminder that you have a scheduled coaching session tomorrow.\n\nSession Details:\n- Title: ${sessionTitle}\n- Date: ${formattedDate}\n- Time: ${formattedTime}\n- Coach: ${coachName}\n\nPlease make sure you're prepared and on time.\n\nBest regards,\nThe edXponential Team`,
              });
            } catch (error) {
              errors.push({
                session_id: session.id,
                recipient: executiveEmail,
                error: error.message,
              });
            }
          }

          // Mark reminder as sent
          try {
            await base44.entities.CoachingSession?.update?.(session.id, {
              reminder_sent: true,
              reminder_sent_at: new Date().toISOString(),
            });

            reminders_sent.push({
              session_id: session.id,
              title: sessionTitle,
              coach_email: coachEmail,
              executive_email: executiveEmail,
            });
          } catch (updateError) {
            errors.push({
              session_id: session.id,
              error: `Failed to update session: ${updateError.message}`,
            });
          }
        }
      } catch (sessionError) {
        errors.push({
          session_id: session?.id,
          error: `Failed to process session: ${sessionError.message}`,
        });
      }
    }

    return Response.json({
      success: true,
      reminders_sent: reminders_sent.length,
      details: reminders_sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error sending coaching session reminders:', error);
    return Response.json(
      { error: `Failed to send reminders: ${error.message}` },
      { status: 500 }
    );
  }
});