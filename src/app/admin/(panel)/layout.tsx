"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import apiClient, { initCsrf } from "@/lib/api/client";
import { ToastProvider, DialogProvider, Loading } from "@/components/elements";

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

function AdminPanelGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser]           = useState<User | null>(null);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const didCheck                  = useRef(false);

  useEffect(() => {
    if (didCheck.current) return;
    didCheck.current = true;
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (authState === "unauthenticated") router.replace("/admin/login");
  }, [authState, router]);

  const checkAdminAuth = async () => {
    try {
      await initCsrf();
      const data = await apiClient.silentGet<{ success: boolean; user: User }>("/auth/admin/me");
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
      <Loading />
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
      <DialogProvider>
        <AdminPanelGuard>{children}</AdminPanelGuard>
      </DialogProvider>
    </ToastProvider>
  );
}