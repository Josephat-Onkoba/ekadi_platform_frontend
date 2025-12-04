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
    /** Check email availability endpoint */
    CHECK_EMAIL: '/auth/check-email/',
    /** Check phone availability endpoint */
    CHECK_PHONE: '/auth/check-phone/',
  },
  /**
   * Event management endpoints
   */
  EVENTS: {
    /** List all events or create new event */
    LIST_CREATE: '/events/',
    /** Get event details by ID */
    DETAIL: (id: number) => `/events/${id}/`,
    /** Update event by ID */
    UPDATE: (id: number) => `/events/${id}/update/`,
    /** Delete (soft delete) event by ID */
    DELETE: (id: number) => `/events/${id}/delete/`,
    /** Close event by ID */
    CLOSE: (id: number) => `/events/${id}/close/`,
    /** Reopen closed event by ID */
    REOPEN: (id: number) => `/events/${id}/reopen/`,
    /** Get event statistics */
    STATS: '/events/stats/',
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
    /** Pricing page */
    PRICING: '/pricing',
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
    /** Events list page */
    EVENTS: '/events',
    /** Create new event page */
    EVENT_CREATE: '/events/create',
    /** Event detail page */
    EVENT_DETAIL: (id: string | number) => `/events/${id}`,
    /** Edit event page */
    EVENT_EDIT: (id: string | number) => `/events/${id}/edit`,
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
// 8. EVENT TYPES
// ============================================================================

/**
 * Available event types with display labels, icons, and colors
 * Used in event creation, filtering, and display components
 */
export const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: '💒', color: 'purple' },
  { value: 'send_off', label: 'Send-off', icon: '👋', color: 'orange' },
  { value: 'conference', label: 'Conference', icon: '📊', color: 'blue' },
  { value: 'birthday', label: 'Birthday', icon: '🎂', color: 'pink' },
  { value: 'corporate', label: 'Corporate Event', icon: '🏢', color: 'teal' },
  { value: 'other', label: 'Other', icon: '🎉', color: 'gray' },
] as const;

// ============================================================================
// 9. EVENT STATUSES
// ============================================================================

/**
 * Available event statuses with display labels, colors, and descriptions
 * Used in event management, filtering, and status indicators
 */
export const EVENT_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray', description: 'Event is being prepared' },
  { value: 'active', label: 'Active', color: 'green', description: 'Event is published' },
  { value: 'closed', label: 'Closed', color: 'red', description: 'Event has concluded' },
] as const;

// ============================================================================
// 10. PRICING
// ============================================================================

/**
 * Pricing plans available in the Ekadi Platform
 * 
 * Includes pay-as-you-go and subscription options tailored for the Kenyan market.
 * Used on the pricing page and in billing-related UI.
 */
export const PRICING_PLANS = {
  /**
   * Pay As You Go plan - ideal for users who create events occasionally
   * and prefer not to commit to a monthly subscription.
   */
  PAY_AS_YOU_GO: {
    name: 'Pay As You Go',
    description: 'Perfect for occasional events',
    type: 'payg' as const,
    features: [
      'Pay only for what you use',
      'No monthly commitments',
      'All event types supported',
      'Basic card templates',
      'Email & SMS invitations',
      'RSVP tracking',
      'Event analytics',
    ],
    pricing: {
      event_creation: { amount: 500, currency: 'KES', description: 'per event created' },
      whatsapp_message: { amount: 2, currency: 'KES', description: 'per WhatsApp message' },
      sms_message: { amount: 3, currency: 'KES', description: 'per SMS sent' },
      card_design: { amount: 0, currency: 'KES', description: 'Basic templates free' },
    },
    popular: false,
  },

  /**
   * Starter subscription - designed for individuals planning
   * personal events such as weddings, birthdays, and send-offs.
   */
  STARTER: {
    name: 'Starter',
    description: 'Great for individuals planning personal events',
    type: 'subscription' as const,
    price: 2500,
    currency: 'KES',
    billingCycle: 'monthly' as const,
    features: [
      '5 events per month',
      '500 WhatsApp messages',
      '300 SMS messages',
      'All basic templates',
      'Email & SMS invitations',
      'RSVP tracking',
      'Event analytics',
      'Priority support',
    ],
    limits: {
      events: 5,
      whatsapp: 500,
      sms: 300,
    },
    popular: false,
  },

  /**
   * Professional subscription - ideal for event planners,
   * agencies, and SMEs running events regularly.
   */
  PROFESSIONAL: {
    name: 'Professional',
    description: 'Perfect for event planners and businesses',
    type: 'subscription' as const,
    price: 7500,
    currency: 'KES',
    billingCycle: 'monthly' as const,
    features: [
      '20 events per month',
      '2,000 WhatsApp messages',
      '1,500 SMS messages',
      'All premium templates',
      'Custom card branding',
      'Advanced analytics',
      'Bulk operations',
      'Priority support',
      'API access',
    ],
    limits: {
      events: 20,
      whatsapp: 2000,
      sms: 1500,
    },
    popular: true,
  },

  /**
   * Enterprise plan - tailored solutions for large organizations
   * with high-volume needs and advanced requirements.
   */
  ENTERPRISE: {
    name: 'Enterprise',
    description: 'For large organizations and agencies',
    type: 'custom' as const,
    price: null as number | null,
    currency: 'KES',
    billingCycle: 'custom' as const,
    features: [
      'Unlimited events',
      'Unlimited messages',
      'All premium features',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options',
      'Advanced security',
      '24/7 priority support',
      'Custom SLA',
    ],
    limits: null as {
      events: number;
      whatsapp: number;
      sms: number;
    } | null,
    popular: false,
  },
} as const;

/**
 * Frequently Asked Questions for the pricing page
 * 
 * Helps users understand how billing, plan changes, and limits work.
 */
export const PRICING_FAQ = [
  {
    question: 'How does Pay As You Go work?',
    answer:
      'With Pay As You Go, you only pay for the services you use. Create an event for KES 500, then pay KES 2 per WhatsApp message and KES 3 per SMS. No monthly fees or commitments.',
  },
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle. Unused credits from Pay As You Go never expire.',
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer:
      "If you exceed your monthly limits on a subscription plan, you can either upgrade to a higher plan or pay per-use rates for additional messages. We'll notify you before you hit your limits.",
  },
  {
    question: 'Are there any setup fees?',
    answer:
      'No setup fees! All plans include everything you need to start creating and managing events immediately.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept M-Pesa, credit/debit cards, and mobile money from major Kenyan and Tanzanian providers (Airtel Money, Tigopesa).',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! New users get their first event free (up to 50 invitations) to test the platform. No credit card required.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      "Absolutely! Cancel your subscription anytime. You'll retain access until the end of your billing period, and there are no cancellation fees.",
  },
  {
    question: 'Do unused messages roll over?',
    answer:
      "Subscription plan messages reset monthly and don't roll over. However, Pay As You Go credits never expire and can be used anytime.",
  },
] as const;

/**
 * Supported payment methods
 * 
 * Used to display payment options on the pricing and checkout flows.
 */
export const PAYMENT_METHODS = [
  { name: 'M-Pesa', icon: '📱', supported: true },
  { name: 'Credit/Debit Card', icon: '💳', supported: true },
  { name: 'Airtel Money', icon: '📱', supported: true },
  { name: 'Tigopesa', icon: '📱', supported: true },
] as const;

// ============================================================================
// 11. THEME
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

