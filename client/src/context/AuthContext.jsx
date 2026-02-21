import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      // Unified server response: { success, message, data }
      setUser(res?.data?.data?.user || null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await refreshMe();
      } finally {
        if (isMounted) setIsBootstrapping(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [refreshMe]);

  const login = useCallback(async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res?.data?.data?.user || null);
    return res;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const res = await api.post('/auth/register', { name, email, password });
    setUser(res?.data?.data?.user || null);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, isBootstrapping, login, register, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
