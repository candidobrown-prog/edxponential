import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const MILESTONES = [25, 50, 75, 100];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data, old_data } = await req.json();

    // Get current and previous progress percentages
    const currentProgress = data.progress_percentage || 0;
    const previousProgress = old_data?.progress_percentage || 0;

    // Check if a milestone was crossed
    const reachedMilestone = MILESTONES.find(
      m => previousProgress < m && currentProgress >= m
    );

    if (!reachedMilestone) {
      return Response.json({ success: true, milestone: null });
    }

    // Get the course name for personalization
    let courseName = 'the course';
    if (data.course_id) {
      try {
        const courses = await base44.entities.Course.filter(
          { id: data.course_id },
          null,
          1
        );
        if (courses.length > 0) {
          courseName = courses[0].title || courseName;
        }
      } catch (err) {
        console.log('Could not fetch course name:', err.message);
      }
    }

    // Personalized encouragement messages for each milestone
    const messages = {
      25: `You've completed 25% of ${courseName}! Great start—keep that momentum going!`,
      50: `Halfway there! You're 50% through ${courseName}. You're crushing it!`,
      75: `You're at 75%! The finish line is in sight. One more push to complete ${courseName}!`,
      100: `Congratulations! You've completed ${courseName}! 🎉 Amazing work—you should be proud!`
    };

    // Send encouraging email
    const emailResponse = await base44.integrations.Core.SendEmail({
      to: data.user_email,
      subject: `Progress Update: You've reached ${reachedMilestone}% in ${courseName}! 🚀`,
      body: `
Hi ${data.student_name || 'there'},

${messages[reachedMilestone]}

Keep up the great work—your dedication to learning is making a real difference.

Best regards,
The edXponential Team
      `.trim()
    });

    console.log(
      `Progress milestone email sent to ${data.user_email} for ${reachedMilestone}% in ${courseName}`
    );

    return Response.json({
      success: true,
      milestone: reachedMilestone,
      emailSent: true
    });
  } catch (error) {
    console.error('Error sending milestone email:', error.message);
    return Response.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
});