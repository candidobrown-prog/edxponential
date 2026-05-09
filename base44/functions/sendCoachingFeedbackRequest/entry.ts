import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    const { session_id, student_email, student_name, coach_name, session_title } = body;

    if (!session_id || !student_email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create feedback link (using feedback form with session_id parameter)
    const feedbackLink = `${Deno.env.get('APP_URL') || 'https://app.edxponential.com'}/feedback?session_id=${session_id}&email=${encodeURIComponent(student_email)}`;

    // Send email via Base44 integration
    await base44.integrations.Core.SendEmail({
      to: student_email,
      subject: `Quick feedback on your session with ${coach_name}`,
      body: `
Hi ${student_name},

Thank you for attending your coaching session with ${coach_name} on "${session_title}". 

We'd love to hear about your experience! Your feedback helps us improve our coaching program and ensure we're providing the best support possible.

👉 Share your feedback (2 minutes): ${feedbackLink}

You'll rate your experience and can leave optional comments about what went well and what could be improved.

Your response is valuable to us and to ${coach_name}.

Best,
The edXponential Team

---
This is an automated message. Your feedback response will be recorded securely.
      `,
      from_name: 'edXponential Coaching'
    });

    console.log(`Feedback request sent to ${student_email} for session ${session_id}`);
    return Response.json({ success: true, sent_to: student_email });

  } catch (error) {
    console.error('Error sending feedback request:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});