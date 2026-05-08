import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import WhalleDohLockScreen from './WhalleDohLockScreen';

// Simple session-based access key
const ACCESS_KEY = 'whalledoh_access';

export function useWhalleDohAccess() {
  const [hasAccess, setHasAccess] = useState(() => localStorage.getItem(ACCESS_KEY) === 'true');

  const grantAccess = () => {
    localStorage.setItem(ACCESS_KEY, 'true');
    setHasAccess(true);
  };

  return { hasAccess, grantAccess };
}

export default function WhalleDohGate({ children }) {
  const { hasAccess, grantAccess } = useWhalleDohAccess();

  if (!hasAccess) {
    return <WhalleDohLockScreen onUnlock={grantAccess} />;
  }

  return children;
}