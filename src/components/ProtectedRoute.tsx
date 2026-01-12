"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission,
  redirectTo = '/crochet/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check role if required
      if (requiredRole && !hasRole(requiredRole)) {
        router.push('/crochet/unauthorized');
        return;
      }

      // Check permission if required
      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push('/crochet/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, loading, requiredRole, requiredPermission, router, redirectTo, hasRole, hasPermission]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or missing required role/permission
  if (!isAuthenticated || 
      (requiredRole && !hasRole(requiredRole)) || 
      (requiredPermission && !hasPermission(requiredPermission))) {
    return null;
  }

  return <>{children}</>;
}