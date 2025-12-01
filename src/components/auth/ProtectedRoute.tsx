/**
 * Protected Route Wrapper Component
 * 
 * Wraps routes that require authentication. This component:
 * - Checks if the user is authenticated
 * - Redirects unauthenticated users to the login page
 * - Shows a loading spinner while checking authentication status
 * - Stores the intended destination in sessionStorage for post-login redirect
 * 
 * Usage:
 * ```tsx
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * ```
 * 
 * @module ProtectedRoute
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import LoadingSpinner from '@/src/components/common/LoadingSpinner';
import { ROUTES } from '@/src/lib/constants';

// ============================================================================
// TYPES
// ============================================================================

interface ProtectedRouteProps {
  /** Child components to render if user is authenticated */
  children: ReactNode;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const REDIRECT_KEY = 'redirectAfterLogin';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Protected Route Component
 * 
 * Wraps protected routes and ensures only authenticated users can access them.
 * Unauthenticated users are redirected to the login page, and their intended
 * destination is stored for redirect after successful login.
 * 
 * @param props - Component props
 * @returns Protected route wrapper or loading spinner
 * 
 * @example
 * ```tsx
 * // In a page or layout
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedRoute>
 *       <DashboardContent />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication and redirect if needed
  useEffect(() => {
    // Wait for auth check to complete
    if (loading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      // Store current path for redirect after login
      if (pathname && pathname !== ROUTES.PUBLIC.LOGIN) {
        sessionStorage.setItem(REDIRECT_KEY, pathname);
      }

      // Redirect to login page
      router.push(ROUTES.PUBLIC.LOGIN);
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  // If not authenticated, return null (redirect is in progress)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

