/**
 * Ekadi Platform Constants
 * 
 * This file centralizes all configuration constants used throughout the application.
 * Constants are organized by category for easy maintenance and discovery.
 * 
 * @module constants
 */

// ============================================================================
// 1. API ENDPOINTS
// ============================================================================

/**
 * API endpoint paths organized by feature
 * All endpoints are relative to the API_CONFIG.BASE_URL
 */
export const API_ENDPOINTS = {
  /**
   * Authentication and user management endpoints
   */
  AUTH: {
    /** User registration endpoint */
    REGISTER: '/auth/register/',
    /** User login endpoint */
    LOGIN: '/auth/login/',
    /** User logout endpoint */
    LOGOUT: '/auth/logout/',
    /** Token refresh endpoint */
    REFRESH: '/auth/refresh/',
    /** Email verification endpoint */
    VERIFY_EMAIL: '/auth/verify-email/',
    /** Resend verification email endpoint */
    RESEND_VERIFICATION: '/auth/resend-verification/',
    /** Request password reset endpoint */
    PASSWORD_RESET: '/auth/password-reset/',
    /** Confirm password reset endpoint */
    PASSWORD_RESET_CONFIRM: '/auth/password-reset-confirm/',
    /** Get current user data endpoint */
    CURRENT_USER: '/auth/user/',
    /** Update user profile endpoint */
    UPDATE_USER: '/auth/user/update/',
  },
} as const;

// ============================================================================
// 2. API CONFIGURATION
// ============================================================================

/**
 * API client configuration settings
 * Includes base URL, timeout, and default headers
 */
export const API_CONFIG = {
  /** Base URL for API requests (from environment variables) */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  /** Request timeout in milliseconds (30 seconds) */
  TIMEOUT: 30000,
  /** Default headers for all API requests */
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// ============================================================================
// 3. STORAGE KEYS
// ============================================================================

/**
 * Local storage keys for persisting data
 * Prefixed with 'ekadi_' to avoid conflicts with other applications
 */
export const STORAGE_KEYS = {
  /** Key for storing JWT access token */
  ACCESS_TOKEN: 'ekadi_access_token',
  /** Key for storing JWT refresh token */
  REFRESH_TOKEN: 'ekadi_refresh_token',
  /** Key for storing cached user data */
  USER_DATA: 'ekadi_user_data',
} as const;

// ============================================================================
// 4. ROUTES
// ============================================================================

/**
 * Application route paths organized by access level
 */
export const ROUTES = {
  /**
   * Public routes accessible without authentication
   */
  PUBLIC: {
    /** Home/landing page */
    HOME: '/',
    /** Login page */
    LOGIN: '/login',
    /** Registration page */
    REGISTER: '/register',
    /** Forgot password page */
    FORGOT_PASSWORD: '/forgot-password',
    /** Reset password confirmation page */
    RESET_PASSWORD: '/reset-password',
    /** Email verification page */
    VERIFY_EMAIL: '/verify-email',
    /** Email sent confirmation page */
    EMAIL_SENT: '/verify-email-sent',
  },
  /**
   * Protected routes requiring authentication
   */
  PROTECTED: {
    /** User dashboard */
    DASHBOARD: '/dashboard',
    /** User profile view */
    PROFILE: '/profile',
    /** Edit profile page */
    EDIT_PROFILE: '/profile/edit',
    /** User settings page */
    SETTINGS: '/settings',
  },
  /**
   * Error pages
   */
  ERROR: {
    /** Unauthorized access page */
    UNAUTHORIZED: '/unauthorized',
    /** 404 not found page */
    NOT_FOUND: '/404',
    /** 500 server error page */
    SERVER_ERROR: '/error',
  },
} as const;

// ============================================================================
// 5. USER TYPES
// ============================================================================

/**
 * Available user account types
 * Used in registration and profile forms
 */
export const USER_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business' },
] as const;

// ============================================================================
// 6. COUNTRY CODES
// ============================================================================

/**
 * Supported country codes for phone numbers
 * Currently supports Kenya and Tanzania
 */
export const COUNTRY_CODES = [
  { value: '+254', label: 'Kenya (+254)', flag: '🇰🇪' },
  { value: '+255', label: 'Tanzania (+255)', flag: '🇹🇿' },
] as const;

// ============================================================================
// 7. VALIDATION
// ============================================================================

/**
 * Validation rules and timing constants
 * Used for form validation and session management
 */
export const VALIDATION = {
  /** Minimum password length requirement */
  PASSWORD_MIN_LENGTH: 8,
  /** Interval for checking token expiry in milliseconds (1 minute) */
  TOKEN_EXPIRY_CHECK_INTERVAL: 60000,
  /** Session timeout duration in milliseconds (1 hour) */
  SESSION_TIMEOUT: 3600000,
} as const;

// ============================================================================
// 8. THEME
// ============================================================================

/**
 * Design system theme constants
 * Centralized colors, spacing, and component styles for consistent UI
 */
export const THEME = {
  /**
   * Color palette
   */
  COLORS: {
    /** Primary brand color - Deep Teal */
    primary: '#008080',
    /** Accent brand color - Vibrant Coral */
    accent: '#FF6F61',
    /** Background color - Warm Off-White */
    background: '#F9F9F9',
    /** Card background - White */
    cardBg: '#FFFFFF',
    /** Primary text color */
    textPrimary: '#2D3748',
    /** Secondary text color */
    textSecondary: '#718096',
    /** Status colors */
    success: '#16A34A',
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#3B82F6',
  },

  /**
   * Button styles with animations and transitions
   */
  BUTTON_STYLES: {
    /** Primary button style (Vibrant Coral background) */
    primaryButton: {
      bg: '#FF6F61',
      color: 'white',
      _hover: { 
        bg: '#FF5A4D', 
        transform: 'translateY(-2px)', 
        boxShadow: 'lg' 
      },
      _active: { transform: 'translateY(0)' },
      transition: 'all 0.2s',
      fontWeight: 'semibold',
    },
    /** Secondary button style (Outline with Deep Teal) */
    secondaryButton: {
      borderColor: '#008080',
      color: '#008080',
      _hover: { 
        bg: '#008080', 
        color: 'white', 
        transform: 'translateY(-2px)', 
        boxShadow: 'lg' 
      },
      _active: { transform: 'translateY(0)' },
      transition: 'all 0.2s',
      fontWeight: 'semibold',
    },
    /** Outline button style */
    outlineButton: {
      variant: 'outline',
      borderColor: '#008080',
      color: '#008080',
      _hover: { bg: '#F9F9F9' },
      fontWeight: 'medium',
    },
  },

  /**
   * Card styles with hover effects
   */
  CARD_STYLES: {
    bg: 'white',
    borderRadius: 'xl',
    boxShadow: 'md',
    p: 8,
    _hover: { 
      boxShadow: 'lg', 
      transform: 'translateY(-2px)' 
    },
    transition: 'all 0.2s',
  },

  /**
   * Spacing scale for consistent padding and margins
   */
  SPACING: {
    /** Section padding (responsive) */
    sectionPadding: { base: 8, md: 12, lg: 16 },
    /** Card padding */
    cardPadding: 8,
    /** Stack spacing */
    stackSpacing: 6,
    /** General spacing values */
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 20,
  },

  /**
   * Border radius
   */
  RADIUS: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
} as const;

