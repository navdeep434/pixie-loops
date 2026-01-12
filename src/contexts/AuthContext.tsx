"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api/config';


// Types
interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Unauthenticated');
      }

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error('Invalid session');
      }
    } catch {
      setUser(null);
      sessionStorage.clear();
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };


  const login = async (email: string, password: string, remember: boolean = false) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'Origin': typeof window !== 'undefined' ? window.location.origin : '',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, remember }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.success && data.user) {
      // Update state immediately
      setUser(data.user);
      sessionStorage.setItem('user', JSON.stringify(data.user));

      // Force a small delay to ensure state propagates
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return data;
  };

  const register = async (registerData: RegisterData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'Origin': typeof window !== 'undefined' ? window.location.origin : '',
      },
      credentials: 'include',
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    if (data.success && data.user) {
      setUser(data.user);
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 🔥 CLEAR EVERYTHING (FRONTEND)
      setUser(null);

      // Clear ALL session storage
      sessionStorage.clear();

      // Clear ALL local storage (if any future usage)
      localStorage.clear();

      // Clear cookies (best-effort for non-httpOnly)
      document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });

      // Hard redirect (prevents cached auth state)
      window.location.href = '/crochet/login';
    }
  };


  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}