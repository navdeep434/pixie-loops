"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import apiClient, { initCsrf } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface MeResponse {
  success: boolean;
  user: AdminUser;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin]     = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Check existing admin session on mount ─────────────────────────────────

  const checkAuth = useCallback(async () => {
    try {
      // silentGet so 401 (not logged in) does NOT fire session:expired
      const data = await apiClient.silentGet<MeResponse>("/auth/admin/me");

      if (data.success && data.user?.roles?.includes("admin")) {
        setAdmin(data.user);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ── Listen for session:expired events ────────────────────────────────────

  useEffect(() => {
    const handleExpired = () => setAdmin(null);
    window.addEventListener("session:expired", handleExpired);
    return () => window.removeEventListener("session:expired", handleExpired);
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/auth/admin/logout");
    } catch {
      // Still clear local state even if server call fails
    } finally {
      setAdmin(null);
    }
  };

  // ── Refresh ───────────────────────────────────────────────────────────────

  const refresh = async (): Promise<void> => {
    setLoading(true);
    await checkAuth();
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const hasRole       = (role: string)       => admin?.roles?.includes(role)       ?? false;
  const hasPermission = (permission: string) => admin?.permissions?.includes(permission) ?? false;

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        hasRole,
        hasPermission,
        logout,
        refresh,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
}