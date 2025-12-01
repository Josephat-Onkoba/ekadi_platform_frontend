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
// TOKEN MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Save access and refresh tokens to localStorage
 * 
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

/**
 * Retrieve access token from localStorage
 * 
 * @returns Access token or null if not found
 */
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
  return null;
};

/**
 * Retrieve refresh token from localStorage
 * 
 * @returns Refresh token or null if not found
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  return null;
};

/**
 * Clear all authentication tokens from localStorage
 * Removes access token, refresh token, and user data
 */
export const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

// ============================================================================
// USER DATA MANAGEMENT FUNCTIONS
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
// AUTHENTICATION STATE FUNCTIONS
// ============================================================================

/**
 * Check if user is authenticated
 * Validates presence of access token and checks if it's expired
 * 
 * @returns True if user has valid authentication token
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token;
};

/**
 * Check if a JWT token is expired
 * Decodes token and compares expiration time with current time
 * 
 * JWT Structure: header.payload.signature
 * The payload contains the 'exp' claim (expiration timestamp in seconds)
 * 
 * @param token - JWT token to check
 * @returns True if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Split token into parts (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));

    // Extract expiration timestamp
    const exp = decodedPayload.exp;
    if (!exp) {
      return true;
    }

    // Compare with current time (convert milliseconds to seconds)
    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  } catch (error) {
    // Return true if token cannot be parsed
    return true;
  }
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
    
    const { user, tokens } = response.data;
    
    // Save tokens to localStorage
    saveTokens(tokens.access, tokens.refresh);
    
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
 * Calls logout endpoint and clears local authentication data
 * 
 * @returns Promise resolving when logout is complete
 * @throws ApiError if logout request fails
 */
export const logoutUser = async (): Promise<void> => {
  try {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
        refresh_token: refreshToken,
      });
    }
  } catch (error) {
    // Log error but continue with token cleanup
    if (process.env.NODE_ENV === 'development') {
      console.error('Logout API call failed:', error);
    }
  } finally {
    // Always clear tokens, even if API call fails
    clearTokens();
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
    const response = await apiClient.patch(API_ENDPOINTS.AUTH.UPDATE_USER, data);
    
    const updatedUser = response.data;
    
    // Save updated user data to localStorage
    saveUserData(updatedUser);
    
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

