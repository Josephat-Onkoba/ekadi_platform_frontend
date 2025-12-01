/**
 * Ekadi Platform Authentication Context
 * 
 * This module provides authentication state management throughout the application.
 * It wraps the auth utility functions and provides React context for easy access
 * to authentication state and operations.
 * 
 * Features:
 * - Centralized authentication state
 * - Login/logout operations
 * - User registration
 * - Profile updates
 * - Automatic token management
 * - Protected route navigation
 * 
 * @module AuthContext
 */

'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  getCurrentUser,
  getUserData,
} from '@/src/lib/auth';
import { User, LoginCredentials, RegisterData, AuthContextType } from '@/src/types';
import { ROUTES } from '@/src/lib/constants';

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * Authentication context
 * Provides authentication state and methods to child components
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  /** Child components that will have access to auth context */
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Wraps the application to provide authentication state and methods.
 * Handles user authentication, registration, logout, and profile updates.
 * 
 * @param props - Component props
 * @returns Provider component with auth context
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Computed authentication state
   * User is authenticated if user object exists
   */
  const isAuthenticated = user !== null;

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize authentication state on mount
   * Loads cached user data from localStorage and optionally refreshes from API
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Check if running in browser
        if (typeof window === 'undefined') {
          return;
        }

        // Get cached user data from localStorage
        const cachedUser = getUserData();

        if (cachedUser) {
          setUser(cachedUser);

          // Optionally: Refresh user data from API to ensure it's current
          try {
            const freshUser = await getCurrentUser();
            setUser(freshUser);
          } catch (error) {
            // If refresh fails, keep cached user data
            if (process.env.NODE_ENV === 'development') {
              console.warn('Failed to refresh user data:', error);
            }
          }
        }
      } catch (error) {
        // Log error but don't crash the app
        if (process.env.NODE_ENV === 'development') {
          console.error('Auth initialization error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ============================================================================
  // AUTHENTICATION FUNCTIONS
  // ============================================================================

  /**
   * Login user with email and password
   * 
   * @param credentials - User login credentials (email and password)
   * @returns Promise that resolves when login is complete
   * @throws ApiError if login fails
   * 
   * @example
   * ```tsx
   * await login({
   *   email: 'user@example.com',
   *   password: 'securePassword123'
   * });
   * ```
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      try {
        setLoading(true);

        // Call login API
        const response = await loginUser(credentials);

        // Set user state
        setUser(response.user);

        // Navigate to dashboard
        router.push(ROUTES.PROTECTED.DASHBOARD);
      } catch (error) {
        // Rethrow error for component to handle
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  /**
   * Register a new user account
   * 
   * Note: User will NOT be logged in after registration.
   * Email verification is required before login.
   * 
   * @param data - User registration data
   * @returns Promise that resolves when registration is complete
   * @throws ApiError if registration fails
   * 
   * @example
   * ```tsx
   * await register({
   *   email: 'newuser@example.com',
   *   password: 'securePassword123',
   *   password2: 'securePassword123',
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   profile: {
   *     country_code: '+254',
   *     phone_number: '+254712345678',
   *     user_type: 'individual'
   *   }
   * });
   * ```
   */
  const register = useCallback(
    async (data: RegisterData): Promise<void> => {
      try {
        setLoading(true);

        // Call register API
        await registerUser(data);

        // Do NOT set user state (email verification required)

        // Navigate to email sent confirmation page
        router.push(ROUTES.PUBLIC.EMAIL_SENT);
      } catch (error) {
        // Rethrow error for component to handle
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  /**
   * Logout current user
   * 
   * Clears authentication tokens and user data, then redirects to login page.
   * Will still clear local data and redirect even if API call fails.
   * 
   * @returns Promise that resolves when logout is complete
   * 
   * @example
   * ```tsx
   * await logout();
   * ```
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      // Call logout API
      await logoutUser();
    } catch (error) {
      // Log error but continue with logout process
      if (process.env.NODE_ENV === 'development') {
        console.error('Logout API error:', error);
      }
    } finally {
      // Always clear user state and navigate to login
      setUser(null);
      router.push(ROUTES.PUBLIC.LOGIN);
      setLoading(false);
    }
  }, [router]);

  /**
   * Update user profile information
   * 
   * @param data - Partial user data to update
   * @returns Promise that resolves when update is complete
   * @throws ApiError if update fails
   * 
   * @example
   * ```tsx
   * await updateUser({
   *   first_name: 'Jane',
   *   profile: {
   *     bio: 'Updated bio text'
   *   }
   * });
   * ```
   */
  const updateUser = useCallback(async (data: any): Promise<void> => {
    try {
      setLoading(true);

      // Call update API
      const updatedUser = await updateUserProfile(data);

      // Update user state with fresh data
      setUser(updatedUser);
    } catch (error) {
      // Rethrow error for component to handle
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh user data from API
   * 
   * Fetches the latest user data from the server and updates local state.
   * Useful after external profile updates or to ensure data is current.
   * 
   * @returns Promise that resolves when refresh is complete
   * 
   * @example
   * ```tsx
   * await refreshUserData();
   * ```
   */
  const refreshUserData = useCallback(async (): Promise<void> => {
    try {
      // Fetch fresh user data
      const freshUser = await getCurrentUser();

      // Update user state
      setUser(freshUser);
    } catch (error) {
      // Log error but don't crash the app
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to refresh user data:', error);
      }
    }
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * Custom hook to access authentication context
 * 
 * Provides easy access to authentication state and methods.
 * Must be used within an AuthProvider.
 * 
 * @returns Authentication context value
 * @throws Error if used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * if (isAuthenticated) {
 *   return <div>Welcome, {user.first_name}!</div>;
 * }
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// ============================================================================
// EXPORTS
// ============================================================================

export { AuthContext };

