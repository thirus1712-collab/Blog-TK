import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('blog_tk_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('blog_tk_token') || null);
  const [loading, setLoading] = useState(true);

  // Global search & refresh states for navbar integration
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Fetch current user details on mount if token exists
  const fetchMe = useCallback(async () => {
    const storedToken = localStorage.getItem('blog_tk_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('blog_tk_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('[Auth] Token invalid or expired, logging out');
      localStorage.removeItem('blog_tk_token');
      localStorage.removeItem('blog_tk_user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('blog_tk_token', receivedToken);
      localStorage.setItem('blog_tk_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  // Register handler
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('blog_tk_token');
    localStorage.removeItem('blog_tk_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
        refreshUser: fetchMe,
        searchQuery,
        setSearchQuery,
        refreshTrigger,
        triggerRefresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
