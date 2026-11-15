import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { base44, getToken } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const checkUserAuth = useCallback(async () => {
    if (!getToken()) {
      setUser(null); setIsAuthenticated(false); setIsLoadingAuth(false); setAuthChecked(true);
      return;
    }
    try {
      setIsLoadingAuth(true);
      const me = await base44.auth.me();
      setUser(me); setIsAuthenticated(true); setAuthError(null);
    } catch (error) {
      setUser(null); setIsAuthenticated(false);
      if (error.status === 401 || error.status === 403) setAuthError({ type: 'auth_required', message: 'Authentication required' });
    } finally {
      setIsLoadingAuth(false); setAuthChecked(true);
    }
  }, []);

  useEffect(() => { checkUserAuth(); }, [checkUserAuth]);

  const login = async (email, password) => { await base44.auth.login(email, password); await checkUserAuth(); };
  const register = async (email, password, fullName) => { await base44.auth.register(email, password, fullName); await checkUserAuth(); };

  const logout = (shouldRedirect = true) => {
    setUser(null); setIsAuthenticated(false);
    shouldRedirect ? base44.auth.logout(window.location.href) : base44.auth.logout();
  };
  const navigateToLogin = () => { setAuthError(null); setIsAuthenticated(false); };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isLoadingAuth,
      isLoadingPublicSettings: false, appPublicSettings: null,
      authError, authChecked, login, register, logout, navigateToLogin, checkUserAuth, checkAppState: checkUserAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
