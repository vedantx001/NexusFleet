import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  signup as signupRequest,
} from '../features/auth/services/authService';
import {
  clearStoredToken,
  getStoredToken,
  setApiAuthToken,
  setStoredToken,
} from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    let isMounted = true;

    const stored = getStoredToken();
    if (stored) {
      setApiAuthToken(stored);
    }

    const bootstrap = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted && currentUser) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { user: nextUser, token: nextToken } = await loginRequest({ email, password });
    if (nextToken) {
      setStoredToken(nextToken);
      setApiAuthToken(nextToken);
      setToken(nextToken);
    }
    setUser(nextUser);
    return nextUser;
  }, []);

  const signup = useCallback(async ({ name, email, password, role }) => {
    const { user: nextUser, token: nextToken } = await signupRequest({ name, email, password, role });
    if (nextToken) {
      setStoredToken(nextToken);
      setApiAuthToken(nextToken);
      setToken(nextToken);
    }
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setToken(null);
      clearStoredToken();
      setApiAuthToken(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      isBootstrapping,
      isAuthenticated,
      user,
      token,
      login,
      signup,
      logout,
    }),
    [isBootstrapping, isAuthenticated, user, token, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
