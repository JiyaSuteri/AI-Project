import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bistro_auth_token') || null;
    }
    return null;
  });
  const [isGuest, setIsGuest] = useState(() => {
    if (typeof window !== 'undefined') {
      const guestStored = localStorage.getItem('bistro_is_guest');
      // Default to guest if not authenticated
      const tokenStored = localStorage.getItem('bistro_auth_token');
      return guestStored === 'true' || !tokenStored;
    }
    return true;
  });
  const [loading, setLoading] = useState(true);
  const [googleConfigured, setGoogleConfigured] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const status = await api.getAuthStatus().catch(() => ({ google_configured: false }));
        setGoogleConfigured(Boolean(status?.google_configured));

        if (token) {
          const profile = await api.getMe();
          setUser(profile);
          setIsGuest(false);
          localStorage.setItem('bistro_is_guest', 'false');
        }
      } catch (err) {
        console.warn('Auth token verification failed or expired:', err.message);
        // If token expired, clear it
        if (token) {
          localStorage.removeItem('bistro_auth_token');
          setToken(null);
          setUser(null);
          setIsGuest(true);
          localStorage.setItem('bistro_is_guest', 'true');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const loginWithGoogle = useCallback(async (credential) => {
    setLoading(true);
    try {
      const data = await api.googleAuth(credential);
      if (data?.access_token) {
        localStorage.setItem('bistro_auth_token', data.access_token);
        localStorage.setItem('bistro_is_guest', 'false');
        setToken(data.access_token);
        setUser(data.user);
        setIsGuest(false);
        return { success: true, user: data.user };
      }
      throw new Error('No access token returned from Google authentication');
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAsGuest = useCallback(() => {
    localStorage.removeItem('bistro_auth_token');
    localStorage.setItem('bistro_is_guest', 'true');
    setToken(null);
    setUser(null);
    setIsGuest(true);
  }, []);

  const loginWithDevDemo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.devDemoLogin();
      if (data?.access_token) {
        localStorage.setItem('bistro_auth_token', data.access_token);
        localStorage.setItem('bistro_is_guest', 'false');
        setToken(data.access_token);
        setUser(data.user);
        setIsGuest(false);
        return { success: true, user: data.user };
      }
      throw new Error('Demo login failed');
    } catch (err) {
      console.error('Demo login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await api.logout().catch(() => {});
      }
    } finally {
      localStorage.removeItem('bistro_auth_token');
      localStorage.setItem('bistro_is_guest', 'true');
      setToken(null);
      setUser(null);
      setIsGuest(true);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isGuest,
        isAuthenticated: Boolean(user && token),
        googleConfigured,
        loading,
        loginWithGoogle,
        loginAsGuest,
        loginWithDevDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
