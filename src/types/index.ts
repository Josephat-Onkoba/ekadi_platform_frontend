/**
 * Ekadi Platform TypeScript Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the Ekadi frontend application. Types are organized by category for
 * easy maintenance and discovery.
 */

// ============================================================================
// 1. USER TYPES
// ============================================================================

/**
 * User type discriminator - defines whether the account is for an individual or business
 */
export type UserType = 'individual' | 'business';

/**
 * User Profile interface
 * Represents the extended profile information for a user
 */
export interface UserProfile {
  /** Country code for phone number (default: +254 for Kenya) */
  country_code: string;
  /** Contact phone number in international format */
  phone_number: string;
  /** Type of user account */
  user_type: UserType;
  /** Company name (required for business accounts) */
  company_name?: string | null;
  /** URL to user's profile picture */
  profile_picture?: string | null;
  /** Short biography or description */
  bio?: string | null;
}

/**
 * User interface
 * Represents the authenticated user with nested profile data
 */
export interface User {
  /** Unique user identifier */
  id: number;
  /** User's email address (used for login) */
  email: string;
  /** User's first name */
  first_name: string;
  /** User's last name */
  last_name: string;
  /** Whether the user has verified their email address */
  email_verified: boolean;
  /** Whether the user account is active */
  is_active: boolean;
  /** Nested profile information */
  profile: UserProfile;
  /** Timestamp when the account was created */
  created_at: string;
  /** Timestamp when the account was last updated */
  updated_at: string;
}


// ============================================================================
// 2. AUTHENTICATION TYPES
// ============================================================================

/**
 * Login credentials
 * Used for user authentication
 */
export interface LoginCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Registration form data
 * Used when creating a new user account
 */
export interface RegisterData {
  /** Email address for the new account */
  email: string;
  /** Password for the new account */
  password: string;
  /** Password confirmation (must match password) */
  password2: string;
  /** User's first name */
  first_name: string;
  /** User's last name */
  last_name: string;
  /** Profile information for the new account */
  profile: {
    country_code: string;
    phone_number: string;
    user_type: 'individual' | 'business';
    company_name?: string;
  };
}

/**
 * Authentication tokens
 * Returned after successful login
 */
export interface AuthTokens {
  /** Access token for API requests */
  access: string;
  /** Refresh token for obtaining new access tokens */
  refresh: string;
}

/**
 * Authentication response
 * Complete response after successful authentication
 */
export interface AuthResponse {
  /** Success message */
  message: string;
  /** Authenticated user data */
  user: User;
  /** Authentication tokens */
  tokens: AuthTokens;
}


// ============================================================================
// 3. API RESPONSE TYPES
// ============================================================================

/**
 * API error response
 * Standardized error response structure from the backend
 * Includes index signature for dynamic field-specific errors
 */
export interface ApiError {
  /** General error message */
  error?: string;
  /** Detailed error information */
  detail?: string;
  /** Human-readable error message (extracted from field errors) */
  message?: string;
  /** HTTP status code */
  status?: number;
  /** Raw field-level validation errors from DRF */
  fieldErrors?: Record<string, any>;
  /** Field-specific validation errors (allows any additional fields) */
  [key: string]: any;
}

/**
 * Standard API response wrapper
 * Generic response wrapper for API calls
 */
export interface ApiResponse<T = any> {
  /** Response data (type varies by endpoint) */
  data?: T;
  /** Error information if request failed */
  error?: ApiError;
  /** HTTP status code */
  status: number;
}

/**
 * Paginated API response
 * Used for endpoints that return paginated data
 */
export interface PaginatedResponse<T> {
  /** Total number of items */
  count: number;
  /** URL to next page (null if no next page) */
  next: string | null;
  /** URL to previous page (null if no previous page) */
  previous: string | null;
  /** Array of results for current page */
  results: T[];
}

/**
 * API request state
 * Tracks the state of an API request for UI feedback
 */
export interface ApiRequestState {
  /** Whether a request is currently in progress */
  loading: boolean;
  /** Error object if request failed */
  error: ApiError | null;
  /** Success state of the request */
  success: boolean;
}

// ============================================================================
// 4. FORM TYPES
// ============================================================================

/**
 * Password reset request data
 * Used to initiate password reset process
 */
export interface PasswordResetRequest {
  /** Email address of the account to reset */
  email: string;
}

/**
 * Password reset confirmation data
 * Used to complete password reset with token
 */
export interface PasswordResetConfirm {
  /** Reset token from email */
  token: string;
  /** New password */
  password: string;
  /** Password confirmation (must match password) */
  password2: string;
}

/**
 * User update data
 * Used for updating user profile information
 */
export interface UserUpdateData {
  /** User's first name */
  first_name: string;
  /** User's last name */
  last_name: string;
  /** Profile information to update */
  profile: {
    country_code: string;
    phone_number: string;
    user_type: 'individual' | 'business';
    company_name?: string;
    bio?: string;
  };
}

// ============================================================================
// 5. CONTEXT TYPES
// ============================================================================

/**
 * Authentication context type
 * Provides authentication state and methods throughout the app
 */
export interface AuthContextType {
  /** Currently authenticated user (null if not authenticated) */
  user: User | null;
  /** Whether authentication state is being loaded */
  loading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Login function */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Register function */
  register: (data: RegisterData) => Promise<void>;
  /** Logout function */
  logout: () => Promise<void>;
  /** Update user profile function */
  updateUser: (data: UserUpdateData) => Promise<void>;
  /** Refresh user data function */
  refreshUserData: () => Promise<void>;
}

/**
 * Theme mode
 * Application theme options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme context value
 * Provides theme state and methods throughout the app
 */
export interface ThemeContextValue {
  /** Current theme mode */
  mode: ThemeMode;
  /** Set theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Whether dark mode is active */
  isDark: boolean;
}

/**
 * Notification type
 * Types of notifications that can be displayed
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Notification object
 * Represents a single notification
 */
export interface Notification {
  /** Unique notification ID */
  id: string;
  /** Notification type */
  type: NotificationType;
  /** Notification message */
  message: string;
  /** Optional notification title */
  title?: string;
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  duration?: number;
}

/**
 * Notification context value
 * Provides notification system throughout the app
 */
export interface NotificationContextValue {
  /** Array of active notifications */
  notifications: Notification[];
  /** Add a notification */
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  /** Remove a notification by ID */
  removeNotification: (id: string) => void;
  /** Remove all notifications */
  clearNotifications: () => void;
  /** Helper methods for common notification types */
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

// ============================================================================
// 6. UTILITY TYPES
// ============================================================================

/**
 * Deep partial type
 * Makes all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Async function state
 * Tracks the state of an async function execution
 */
export interface AsyncFunctionState<T = any> {
  /** Whether the function is executing */
  loading: boolean;
  /** Error if the function failed */
  error: Error | null;
  /** Result data if the function succeeded */
  data: T | null;
}

