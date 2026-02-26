"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  redirectTo?: string; // where to redirect on session expiry
};

/**
 * Drop this inside your admin layout and crochet layout.
 * It listens for the "session:expired" event dispatched by apiClient
 * and redirects the user to the login page.
 */
export default function SessionGuard({ redirectTo = "/admin/login" }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleExpired = () => {
      // Don't redirect if already on a login page
      if (pathname.includes("/login")) return;

      // Small delay so any in-flight toasts can show
      setTimeout(() => {
        router.push(`${redirectTo}?reason=session_expired`);
      }, 300);
    };

    window.addEventListener("session:expired", handleExpired);
    return () => window.removeEventListener("session:expired", handleExpired);
  }, [pathname, redirectTo, router]);

  return null;
}