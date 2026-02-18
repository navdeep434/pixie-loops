"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/elements/useToast";
import { API_URL } from "@/lib/api/config";

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

function AdminPanelGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (authState === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [authState, router]);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/admin/me`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Not authenticated");

      const data = await response.json();

      if (data.success && data.user?.roles.includes("admin")) {
        setUser(data.user);
        setAuthState("authenticated");
      } else {
        throw new Error("Not an admin");
      }
    } catch {
      setUser(null);
      setAuthState("unauthenticated");
    }
  };

  if (authState !== "authenticated") {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar user={user!} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={user!} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminPanelGuard>{children}</AdminPanelGuard>
    </ToastProvider>
  );
}