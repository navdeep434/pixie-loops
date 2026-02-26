"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import apiClient, { initCsrf, SessionExpiredError } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  roles: string[];
  permissions: string[];
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refresh: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

interface MeResponse {
  success: boolean;
  user: User;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Check existing session on mount ──────────────────────────────────────
  // Uses silentGet so a 401 (not logged in) does NOT fire session:expired
  // and does NOT redirect — it's a normal "guest" state.

  const checkAuth = useCallback(async () => {
    try {
      const data = await apiClient.silentGet<MeResponse>("/auth/me");

      if (data.success && data.user?.roles?.includes("customer")) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      // 401 = not logged in (normal), any other error = treat as guest
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ── Listen for session:expired events from apiClient ─────────────────────
  // Only fired by non-silent requests (e.g. submitting a form while logged out)

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      // Uncomment to auto-redirect on mid-session expiry:
      // window.location.href = "/crochet/login?reason=session_expired";
    };
    window.addEventListener("session:expired", handleExpired);
    return () => window.removeEventListener("session:expired", handleExpired);
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────

  const login = async (
    email: string,
    password: string,
    remember = false
  ): Promise<void> => {
    // Always get a fresh CSRF token before login
    // (session may not exist yet, or it's a cold browser start)
    await initCsrf();

    const data = await apiClient.post<{ success: boolean; user: User; message?: string; errors?: any }>(
      "/auth/login",
      { email, password, remember }
    );

    if (!data.success) {
      const message =
        data?.errors?.email?.[0]    ??
        data?.errors?.password?.[0] ??
        data?.message               ??
        "Login failed";
      throw new Error(message);
    }

    if (!data.user?.roles?.includes("customer")) {
      throw new Error("This account is not a customer account.");
    }

    setUser(data.user);
  };

  // ── Register ─────────────────────────────────────────────────────────────

  const register = async (registerData: RegisterData): Promise<void> => {
    await initCsrf();

    const data = await apiClient.post<{ success: boolean; user: User; message?: string; errors?: any }>(
      "/auth/register",
      registerData
    );

    if (!data.success) {
      const message =
        data?.errors?.email?.[0]    ??
        data?.errors?.password?.[0] ??
        data?.message               ??
        "Registration failed";
      throw new Error(message);
    }

    setUser(data.user);
  };

  // ── Logout ───────────────────────────────────────────────────────────────

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // If the server-side logout fails, still clear local state
    } finally {
      setUser(null);
    }
  };

  // ── Refresh ──────────────────────────────────────────────────────────────

  const refresh = async (): Promise<void> => {
    setLoading(true);
    await checkAuth();
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  const hasRole       = (role: string)       => user?.roles?.includes(role)       ?? false;
  const hasPermission = (permission: string) => user?.permissions?.includes(permission) ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        refresh,
        isAuthenticated: !!user,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}