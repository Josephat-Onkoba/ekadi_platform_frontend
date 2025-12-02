/**
 * Ekadi Platform API Client
 * 
 * This module configures an axios instance with JWT authentication,
 * automatic token refresh, and comprehensive error handling.
 * 
 * Features:
 * - Automatic JWT token attachment to requests
 * - Token refresh on 401 errors
 * - Request/response interceptors
 * - Centralized error handling
 * 
 * @module api
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, ROUTES } from './constants';
import { ApiResponse, ApiError } from '@/src/types';

// ============================================================================
// TOKEN REFRESH STATE
// ============================================================================

/**
 * Flag to prevent multiple simultaneous token refresh attempts
 */
let isRefreshing = false;

/**
 * Queue of failed requests waiting for token refresh
 */
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

/**
 * Process the queue of failed requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Clear cached user data from storage.
 * 
 * NOTE:
 * - We are no longer storing JWTs in localStorage for security reasons.
 * - Authentication is now handled via secure httpOnly cookies managed
 *   entirely by the backend.
 */
export const clearAuthTokens = (): void => {
  if (typeof window !== 'undefined') {
    // Keep this function for backwards compatibility, but only clear
    // non-sensitive cached data.
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

/**
 * Refresh the authentication session using httpOnly cookies.
 * 
 * We no longer read or write JWTs on the client. Instead, the backend
 * is responsible for setting and rotating secure httpOnly cookies.
 *
 * @returns Promise that resolves when the refresh attempt completes
 * @throws Error if refresh fails
 */
const refreshAccessToken = async (): Promise<void> => {
  try {
    await axios.post(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      {},
      {
        headers: API_CONFIG.HEADERS,
        // Ensure cookies are sent with the refresh request
        withCredentials: true,
      }
    );
  } catch (error) {
    // Clear cached data on refresh failure
    clearAuthTokens();

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = ROUTES.PUBLIC.LOGIN;
    }

    throw error;
  }
};

/**
 * Extract human-readable error message from Django REST Framework error response
 * 
 * DRF returns errors in various formats:
 * - Field errors: { "email": ["This email already exists."] }
 * - Non-field errors: { "non_field_errors": ["Error message"] }
 * - Detail: { "detail": "Error message" }
 * - Generic: { "error": "Error message", "message": "Error message" }
 * 
 * @param errorData - Error response data from DRF
 * @returns Human-readable error message
 */
const extractErrorMessage = (errorData: any): string => {
  if (!errorData || typeof errorData !== 'object') {
    return 'An error occurred';
  }

  // Check for explicit error/message/detail fields
  if (errorData.detail) {
    return errorData.detail;
  }
  if (errorData.error) {
    return errorData.error;
  }
  if (errorData.message) {
    return errorData.message;
  }

  // Check for non-field errors (DRF validation)
  if (errorData.non_field_errors) {
    const errors = errorData.non_field_errors;
    return Array.isArray(errors) ? errors.join(' ') : errors;
  }

  // Extract field-level validation errors
  const fieldErrors: string[] = [];
  for (const [field, errors] of Object.entries(errorData)) {
    if (Array.isArray(errors)) {
      // Format field name to be more readable
      const fieldName = field
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      errors.forEach((err: any) => {
        if (typeof err === 'string') {
          fieldErrors.push(`${fieldName}: ${err}`);
        } else if (typeof err === 'object') {
          // Handle nested errors (e.g., profile.phone_number)
          for (const [nestedField, nestedErrors] of Object.entries(err)) {
            const nestedFieldName = nestedField
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());
            if (Array.isArray(nestedErrors)) {
              nestedErrors.forEach((nestedErr: string) => {
                fieldErrors.push(`${nestedFieldName}: ${nestedErr}`);
              });
            }
          }
        }
      });
    } else if (typeof errors === 'object' && errors !== null) {
      // Handle nested object errors (e.g., profile: { phone_number: [...] })
      for (const [nestedField, nestedErrors] of Object.entries(errors)) {
        const nestedFieldName = nestedField
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
        if (Array.isArray(nestedErrors)) {
          nestedErrors.forEach((nestedErr: string) => {
            fieldErrors.push(`${nestedFieldName}: ${nestedErr}`);
          });
        }
      }
    }
  }

  if (fieldErrors.length > 0) {
    return fieldErrors.join('\n');
  }

  return 'An error occurred';
};

/**
 * Format axios error into standardized ApiError format
 * 
 * @param error - Axios error object
 * @returns Formatted API error
 */
const formatApiError = (error: AxiosError): ApiError => {
  // Network error
  if (error.message === 'Network Error') {
    return {
      error: 'Network Error',
      detail: 'Unable to connect to the server. Please check your internet connection.',
      message: 'Unable to connect to the server. Please check your internet connection.',
      status: 0,
    } as ApiError;
  }

  // Timeout error
  if (error.code === 'ECONNABORTED') {
    return {
      error: 'Request Timeout',
      detail: 'The request took too long to complete. Please try again.',
      message: 'The request took too long to complete. Please try again.',
      status: 408,
    } as ApiError;
  }

  // Server responded with error
  if (error.response) {
    const { status, data } = error.response;
    const errorData = data as any;
    const errorMessage = extractErrorMessage(errorData);
    
    return {
      error: errorData?.error || 'Validation Error',
      detail: errorData?.detail || errorMessage,
      message: errorMessage,
      status,
      fieldErrors: errorData, // Include raw field errors for form handling
    } as ApiError;
  }

  // Request was made but no response received
  return {
    error: 'No Response',
    detail: 'The server did not respond. Please try again later.',
    message: 'The server did not respond. Please try again later.',
    status: 503,
  } as ApiError;
};

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================

/**
 * Configured axios instance with authentication and error handling
 *
 * Security Change:
 * - `withCredentials` is now `true` so that the browser automatically
 *   sends secure httpOnly cookies with each request.
 * - We no longer attach JWTs from localStorage to the Authorization header.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true, // Use secure httpOnly cookies for auth
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * Request interceptor
 *
 * Previously, this interceptor attached JWTs from localStorage to the
 * Authorization header. Since we now rely on httpOnly cookies managed
 * by the backend, we simply return the config unchanged.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

/**
 * Response interceptor for error handling and token refresh
 */
apiClient.interceptors.response.use(
  // Success handler - return response as-is
  (response) => {
    return response;
  },

  // Error handler
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error in development with full response data
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.message);
      console.error('API Error Details:', {
        url: originalRequest?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && originalRequest) {
      // Check if this is not a refresh token request (prevent infinite loop)
      const isRefreshRequest = originalRequest.url?.includes(
        API_ENDPOINTS.AUTH.REFRESH
      );

      if (!isRefreshRequest && !originalRequest._retry) {
        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              // After refresh completes, retry the original request.
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // Mark this request as retried
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh the session using httpOnly cookies
          await refreshAccessToken();

          // Process queued requests
          processQueue(null, null);

          // Retry original request (cookies now carry refreshed session)
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Session refresh failed
          processQueue(refreshError as Error, null);
          clearAuthTokens();

          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = ROUTES.PUBLIC.LOGIN;
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // If this is a refresh request that failed, clear tokens and redirect
      if (isRefreshRequest) {
        clearAuthTokens();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.PUBLIC.LOGIN;
        }
      }
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = ROUTES.ERROR.UNAUTHORIZED;
      }
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      if (typeof window !== 'undefined') {
        window.location.href = ROUTES.ERROR.SERVER_ERROR;
      }
    }

    // Format and return error
    const formattedError = formatApiError(error);
    return Promise.reject(formattedError);
  }
);

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Export configured axios instance as default
 */
export default apiClient;

/**
 * Named export for explicit imports
 */
export { apiClient };

/**
 * Export refresh function for manual token refresh
 */
export { refreshAccessToken };

