import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export function useAccessGuard() {
  const navigate = useNavigate();
  const [accessState, setAccessState] = useState({
    isAuthenticated: false,
    isApproved: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await base44.auth.me();

        if (!user) {
          setAccessState({
            isAuthenticated: false,
            isApproved: false,
            isLoading: false,
            user: null,
          });
          return;
        }

        // Check if user is approved
        const isApproved = user.access_level === 'approved' || user.role === 'admin';

        setAccessState({
          isAuthenticated: true,
          isApproved,
          isLoading: false,
          user,
        });
      } catch (err) {
        setAccessState({
          isAuthenticated: false,
          isApproved: false,
          isLoading: false,
          user: null,
        });
      }
    };

    checkAccess();
  }, []);

  const requireAccess = (requiredLevel = 'approved') => {
    if (accessState.isLoading) return null;

    if (requiredLevel === 'authenticated' && !accessState.isAuthenticated) {
      navigate('/signin');
      return null;
    }

    if (requiredLevel === 'approved' && (!accessState.isAuthenticated || !accessState.isApproved)) {
      navigate('/apply');
      return null;
    }

    if (requiredLevel === 'admin' && accessState.user?.role !== 'admin') {
      navigate('/');
      return null;
    }

    return accessState;
  };

  return { ...accessState, requireAccess };
}