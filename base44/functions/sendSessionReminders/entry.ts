import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Use service role to access all sessions
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format dates for comparison (YYYY-MM-DD)
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    // Fetch tutoring sessions scheduled for tomorrow
    const tutoringSessions = await base44.asServiceRole.entities.TutoringSession.filter({
      session_date: tomorrowDate,
      session_status: { $in: ['scheduled', 'confirmed'] }
    });

    // Fetch coaching sessions (CoachingSession entity has available_slots)
    // We look for slots with date = tomorrow and booked = true
    const coachingSessions = await base44.asServiceRole.entities.CoachingSession.filter({
      status: 'active'
    });

    let emailsSent = 0;
    const errors = [];

    // --- Process Tutoring Sessions ---
    for (const session of tutoringSessions) {
      const sessionTime = session.start_time || 'your scheduled time';
      const subject = session.subject || 'tutoring';

      // Email to student/booker
      if (session.booked_by_email) {
        const studentName = session.student_name || 'Student';
        const tutorName = session.tutor_name || 'your tutor';

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: session.booked_by_email,
          subject: `Reminder: Tutoring Session Tomorrow — ${subject}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0a0f1e;">📚 Tutoring Session Reminder</h2>
              <p>Hi ${studentName},</p>
              <p>This is a friendly reminder that you have a <strong>${subject}</strong> tutoring session scheduled for <strong>tomorrow, ${tomorrowDate}</strong> at <strong>${sessionTime}</strong>.</p>
              <div style="background: #f4f4f4; border-left: 4px solid #0a0f1e; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0;"><strong>Tutor:</strong> ${tutorName}</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${tomorrowDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${sessionTime}</p>
                ${session.session_type === 'virtual' && session.virtual_link ? `<p style="margin: 5px 0;"><strong>Link:</strong> <a href="${session.virtual_link}">${session.virtual_link}</a></p>` : ''}
                ${session.session_type === 'in_person' && session.location_address ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${session.location_address}</p>` : ''}
              </div>
              <p>Please make sure you are prepared and ready on time.</p>
              <p style="color: #666; font-size: 12px;">This reminder was sent by edXponential TwotrX platform.</p>
            </div>
          `
        });
        emailsSent++;
      }

      // Email to tutor
      if (session.tutor_email) {
        const studentName = session.student_name || 'a student';

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: session.tutor_email,
          subject: `Reminder: Tutoring Session Tomorrow — ${subject}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0a0f1e;">📚 Tutoring Session Reminder</h2>
              <p>Hi ${session.tutor_name || 'Tutor'},</p>
              <p>This is a friendly reminder that you have a <strong>${subject}</strong> session with <strong>${studentName}</strong> scheduled for <strong>tomorrow, ${tomorrowDate}</strong> at <strong>${sessionTime}</strong>.</p>
              <div style="background: #f4f4f4; border-left: 4px solid #0a0f1e; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0;"><strong>Student:</strong> ${studentName}</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${tomorrowDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${sessionTime}</p>
                ${session.session_type === 'virtual' && session.virtual_link ? `<p style="margin: 5px 0;"><strong>Link:</strong> <a href="${session.virtual_link}">${session.virtual_link}</a></p>` : ''}
                ${session.session_type === 'in_person' && session.location_address ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${session.location_address}</p>` : ''}
              </div>
              <p>Please ensure you are prepared and ready on time.</p>
              <p style="color: #666; font-size: 12px;">This reminder was sent by edXponential TwotrX platform.</p>
            </div>
          `
        });
        emailsSent++;
      }
    }

    // --- Process Coaching Sessions (check available_slots for tomorrow) ---
    for (const coaching of coachingSessions) {
      const slots = coaching.available_slots || [];
      const tomorrowSlots = slots.filter(slot => slot.date === tomorrowDate && slot.booked === true);

      for (const slot of tomorrowSlots) {
        const coachEmail = coaching.coach_email;
        const coachName = coaching.coach_name || 'your coach';
        const sessionTime = slot.time || 'your scheduled time';
        const specializations = (coaching.specializations || []).join(', ') || 'coaching';

        // We don't have attendee email on the slot directly, so notify the coach
        if (coachEmail) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: coachEmail,
            subject: `Reminder: Coaching Session Tomorrow at ${sessionTime}`,
            body: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0a0f1e;">🎯 Coaching Session Reminder</h2>
                <p>Hi ${coachName},</p>
                <p>This is a friendly reminder that you have a coaching session scheduled for <strong>tomorrow, ${tomorrowDate}</strong> at <strong>${sessionTime}</strong>.</p>
                <div style="background: #f4f4f4; border-left: 4px solid #0a0f1e; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0;"><strong>Specialization:</strong> ${specializations}</p>
                  <p style="margin: 5px 0;"><strong>Date:</strong> ${tomorrowDate}</p>
                  <p style="margin: 5px 0;"><strong>Time:</strong> ${sessionTime}</p>
                  <p style="margin: 5px 0;"><strong>Session Type:</strong> ${coaching.session_type || 'N/A'}</p>
                </div>
                <p>Please be ready and prepared for your session.</p>
                <p style="color: #666; font-size: 12px;">This reminder was sent by edXponential platform.</p>
              </div>
            `
          });
          emailsSent++;
        }
      }
    }

    console.log(`Session reminders sent: ${emailsSent} emails for ${tomorrowDate}`);

    return Response.json({
      success: true,
      date_checked: tomorrowDate,
      tutoring_sessions_found: tutoringSessions.length,
      coaching_sessions_checked: coachingSessions.length,
      emails_sent: emailsSent,
      errors
    });

  } catch (error) {
    console.error('Error sending session reminders:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});