// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';

/**
 * AuthContext provides:
 * - user: { _id, email, username } | null
 * - loading: boolean (initial check)
 * - isAuthenticated: boolean
 * - login(credentials) -> { ok, error }
 * - logout() -> void
 * - refresh() -> tries to re-check session
 *
 * Notes:
 * - We rely on httpOnly cookies set by backend. For initial state we call /api/admin/me.
 * - If your backend returns tokens in body and you need them, you can store token in-memory in this provider.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // admin user object or null
  const [loading, setLoading] = useState(true); // while checking session
  const [inMemoryAccessToken, setInMemoryAccessToken] = useState(null); // optional in-memory token

  // check current session (backend reads httpOnly cookie)
  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/me'); // implement on backend: returns { user }
      if (res?.data?.user) {
        setUser(res.data.user);
        // if backend returns { accessToken } and you need it, save in memory:
        if (res.data.accessToken) setInMemoryAccessToken(res.data.accessToken);
      } else {
        setUser(null);
        setInMemoryAccessToken(null);
      }
    } catch (err) {
      setUser(null);
      setInMemoryAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // run once on mount
    fetchMe();
  }, [fetchMe]);

  // login: posts credentials -> backend sets cookie (httpOnly) and may return user object
  async function login({ email, password }) {
    try {
      const res = await api.post('/admin/login', { email, password });
      // backend should set httpOnly cookie. If backend returns user info, use it; otherwise call fetchMe
      if (res?.data?.user) {
        setUser(res.data.user);
      } else {
        // re-check
        await fetchMe();
      }
      // if backend returns an accessToken in body use it in-memory:
      if (res?.data?.accessToken) setInMemoryAccessToken(res.data.accessToken);
      return { ok: true };
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Login failed';
      return { ok: false, error: message };
    }
  }

  async function logout() {
    try {
      await api.post('/admin/logout');
    } catch (err) {
      console.warn('logout error', err);
    } finally {
      // clear client state regardless
      setUser(null);
      setInMemoryAccessToken(null);
    }
  }



  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
   
    accessToken: inMemoryAccessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
