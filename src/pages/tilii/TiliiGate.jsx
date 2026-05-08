import React, { useState } from 'react';
import TiliiLockScreen from './TiliiLockScreen';

const ACCESS_KEY = 'tilii_access';

export function useTiliiAccess() {
  const [hasAccess, setHasAccess] = useState(() => localStorage.getItem(ACCESS_KEY) === 'true');
  const grantAccess = () => { localStorage.setItem(ACCESS_KEY, 'true'); setHasAccess(true); };
  return { hasAccess, grantAccess };
}

export default function TiliiGate({ children }) {
  const { hasAccess, grantAccess } = useTiliiAccess();
  if (!hasAccess) return <TiliiLockScreen onUnlock={grantAccess} />;
  return children;
}