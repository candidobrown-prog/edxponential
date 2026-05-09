import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Hook to detect when a coaching session has ended and show feedback form
 * Checks for sessions that ended in the last 5 minutes
 */
export function useSessionFeedback() {
  const [endedSession, setEndedSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkForEndedSessions = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Get all coaching sessions for this executive
        const sessions = await base44.entities.CoachingSession?.filter?.(
          { executive_email: currentUser.email },
          '-scheduled_date',
          50
        );

        if (!sessions) return;

        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        // Find sessions that ended recently and haven't been reviewed yet
        for (const session of sessions) {
          const sessionEnd = new Date(
            new Date(session.scheduled_date).getTime() +
              (session.duration_minutes || 60) * 60 * 1000
          );

          const hasBeenReviewed = await checkIfReviewed(session.id);

          // If session ended in last 5 minutes and hasn't been reviewed
          if (
            sessionEnd > fiveMinutesAgo &&
            sessionEnd <= now &&
            !hasBeenReviewed &&
            session.status === 'completed'
          ) {
            setEndedSession(session);
            break;
          }
        }
      } catch (error) {
        console.error('Error checking for ended sessions:', error);
      }
    };

    // Check immediately and then every 30 seconds
    checkForEndedSessions();
    const interval = setInterval(checkForEndedSessions, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkIfReviewed = async (sessionId) => {
    try {
      const reviews = await base44.entities.CoachingSessionFeedback?.filter?.(
        { session_id: sessionId }
      );
      return reviews && reviews.length > 0;
    } catch {
      return false;
    }
  };

  return { endedSession, setEndedSession };
}

export default useSessionFeedback;