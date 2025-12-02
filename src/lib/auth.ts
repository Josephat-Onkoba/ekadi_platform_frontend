/**
 * Ekadi Platform Authentication Utilities
 * 
 * This module provides authentication helper functions for token management,
 * user data persistence, and authentication API calls.
 * 
 * Features:
 * - Token management (save, retrieve, clear)
 * - User data persistence
 * - Authentication state checks
 * - Login/logout operations
 * - User registration
 * - Email verification
 * - Password reset
 * - Profile management
 * 
 * @module auth
 */

import apiClient from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from './constants';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/src/types';

// ============================================================================
// USER DATA MANAGEMENT FUNCTIONS
// ============================================================================

// ============================================================================
/**
 * Save user data to localStorage
 * Serializes user object to JSON and stores it
 * 
 * @param user - User object to save
 */
export const saveUserData = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }
};

/**
 * Retrieve user data from localStorage
 * Deserializes JSON string back to User object
 * 
 * @returns User object or null if not found or invalid
 */
export const getUserData = (): User | null => {
  if (typeof window !== 'undefined') {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        return JSON.parse(userData) as User;
      }
    } catch (error) {
      // Return null if data is corrupted or invalid
      return null;
    }
  }
  return null;
};

// ============================================================================
// AUTHENTICATION API FUNCTIONS
// ============================================================================

/**
 * Login user with email and password
 * 
 * @param credentials - Login credentials (email and password)
 * @returns Promise resolving to authentication response with tokens and user data
 * @throws ApiError if login fails
 * 
 * @example
 * ```typescript
 * const response = await loginUser({
 *   email: 'user@example.com',
 *   password: 'securePassword123'
 * });
 * console.log(response.user, response.tokens);
 * ```
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    const { user } = response.data;
    
    // Save user data to localStorage
    saveUserData(user);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new user account
 * 
 * @param data - Registration data including user info and profile
 * @returns Promise resolving to success message and user data
 * @throws ApiError if registration fails
 * 
 * @example
 * ```typescript
 * const response = await registerUser({
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
export const registerUser = async (data: RegisterData): Promise<{ message: string; user: User }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * 
 * With httpOnly cookie-based auth, the backend is responsible for clearing
 * the authentication cookies. The frontend only needs to call the logout
 * endpoint and clear any cached user data.
 * 
 * @returns Promise resolving when logout is complete
 * @throws ApiError if logout request fails
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  } catch (error) {
    // Log error but continue with cleanup
    if (process.env.NODE_ENV === 'development') {
      console.error('Logout API call failed:', error);
    }
  } finally {
    // Clear cached user data
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }
};

// ============================================================================
// EMAIL VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Verify user email with token
 * 
 * @param token - Email verification token from email link
 * @returns Promise resolving to success message
 * @throws ApiError if verification fails
 * 
 * @example
 * ```typescript
 * const response = await verifyEmail('abc123token');
 * console.log(response.message);
 * ```
 */
export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Resend email verification link
 * 
 * @param email - User's email address
 * @returns Promise resolving to success message
 * @throws ApiError if request fails
 * 
 * @example
 * ```typescript
 * const response = await resendVerification('user@example.com');
 * console.log(response.message);
 * ```
 */
export const resendVerification = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================================================
// PASSWORD RESET FUNCTIONS
// ============================================================================

/**
 * Request password reset email
 * 
 * @param email - User's email address
 * @returns Promise resolving to success message
 * @throws ApiError if request fails
 * 
 * @example
 * ```typescript
 * const response = await requestPasswordReset('user@example.com');
 * console.log(response.message);
 * ```
 */
export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Confirm password reset with token and new password
 * 
 * @param token - Password reset token from email link
 * @param password - New password
 * @param password2 - Password confirmation (must match password)
 * @returns Promise resolving to success message
 * @throws ApiError if reset fails or passwords don't match
 * 
 * @example
 * ```typescript
 * const response = await confirmPasswordReset(
 *   'reset-token-123',
 *   'newPassword123',
 *   'newPassword123'
 * );
 * console.log(response.message);
 * ```
 */
export const confirmPasswordReset = async (
  token: string,
  password: string,
  password2: string
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
      token,
      password,
      password2,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================================================
// USER PROFILE FUNCTIONS
// ============================================================================

/**
 * Get current authenticated user data from API
 * 
 * @returns Promise resolving to current user object
 * @throws ApiError if request fails or user is not authenticated
 * 
 * @example
 * ```typescript
 * const user = await getCurrentUser();
 * console.log(user.email, user.profile);
 * ```
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.CURRENT_USER);
    
    const user = response.data;
    
    // Save user data to localStorage
    saveUserData(user);
    
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile information
 * 
 * @param data - Partial user data to update
 * @returns Promise resolving to updated user object
 * @throws ApiError if update fails
 * 
 * @example
 * ```typescript
 * const updatedUser = await updateUserProfile({
 *   first_name: 'Jane',
 *   profile: {
 *     bio: 'Updated bio text'
 *   }
 * });
 * console.log(updatedUser);
 * ```
 */
export const updateUserProfile = async (data: any): Promise<User> => {
  try {
    const isFormData =
      typeof FormData !== 'undefined' && data instanceof FormData;

    const response = await apiClient.patch(
      API_ENDPOINTS.AUTH.UPDATE_USER,
      data,
      isFormData
        ? {
            headers: {
              // Let the browser set the correct multipart boundary
              'Content-Type': 'multipart/form-data',
            },
          }
        : undefined
    );
    
    const updatedUser = response.data;
    
    // Save updated user data to localStorage
    saveUserData(updatedUser);
    
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// ============================================================================
// AVAILABILITY CHECK FUNCTIONS
// ============================================================================

/**
 * Check if an email address is available for registration
 * 
 * @param email - Email address to check
 * @returns Promise resolving to availability status
 * 
 * @example
 * ```typescript
 * const result = await checkEmailAvailability('user@example.com');
 * if (!result.available) {
 *   console.log(result.message); // "This email is already registered"
 * }
 * ```
 */
export const checkEmailAvailability = async (
  email: string
): Promise<{ available: boolean; message: string }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHECK_EMAIL, { email });
    return response.data;
  } catch (error: any) {
    // If there's a validation error, the email format is invalid
    if (error?.status === 400) {
      return { available: false, message: error?.message || 'Invalid email format' };
    }
    throw error;
  }
};

/**
 * Check if a phone number is available for registration
 * 
 * @param phoneNumber - Phone number to check (including country code)
 * @returns Promise resolving to availability status
 * 
 * @example
 * ```typescript
 * const result = await checkPhoneAvailability('+254712345678');
 * if (!result.available) {
 *   console.log(result.message); // "This phone number is already registered"
 * }
 * ```
 */
export const checkPhoneAvailability = async (
  phoneNumber: string
): Promise<{ available: boolean; message: string }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHECK_PHONE, { phone_number: phoneNumber });
    return response.data;
  } catch (error: any) {
    // If there's a validation error, the phone format is invalid
    if (error?.status === 400) {
      return { available: false, message: error?.message || 'Invalid phone number format' };
    }
    throw error;
  }
};

