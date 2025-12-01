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
import { ApiResponse, ApiError } from '@/types';

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
 * Clear all authentication tokens and user data from localStorage
 * Used on logout or when token refresh fails
 */
export const clearAuthTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

/**
 * Refresh the access token using the refresh token
 * 
 * @returns Promise resolving to new access token
 * @throws Error if refresh token is missing or refresh fails
 */
const refreshAccessToken = async (): Promise<string> => {
  try {
    // Get refresh token from localStorage
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Request new access token
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      { refresh: refreshToken },
      {
        headers: API_CONFIG.HEADERS,
      }
    );

    // Extract new tokens from response
    const { access, refresh } = response.data;

    // Save new tokens to localStorage
    if (access) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
    }
    if (refresh) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    }

    return access;
  } catch (error) {
    // Clear all tokens on refresh failure
    clearAuthTokens();

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = ROUTES.PUBLIC.LOGIN;
    }

    throw error;
  }
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
      status: 0,
    };
  }

  // Timeout error
  if (error.code === 'ECONNABORTED') {
    return {
      error: 'Request Timeout',
      detail: 'The request took too long to complete. Please try again.',
      status: 408,
    };
  }

  // Server responded with error
  if (error.response) {
    const { status, data } = error.response;
    return {
      error: data?.error || data?.message || 'An error occurred',
      detail: data?.detail || error.message,
      status,
      ...data, // Include any field-specific errors
    };
  }

  // Request was made but no response received
  return {
    error: 'No Response',
    detail: 'The server did not respond. Please try again later.',
    status: 503,
  };
};

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================

/**
 * Configured axios instance with authentication and error handling
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: false, // Using JWT tokens, not cookies
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * Request interceptor to attach JWT token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      // Get access token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        // Attach token to Authorization header if it exists
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    } catch (error) {
      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Request interceptor error:', error);
      }
      return Promise.reject(error);
    }
  },
  (error) => {
    // Log error in development
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

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
      console.error('API Error Details:', {
        url: originalRequest?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
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
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
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
          // Attempt to refresh the token
          const newAccessToken = await refreshAccessToken();

          // Process queued requests with new token
          processQueue(null, newAccessToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return apiClient(originalRequest);
        } catch (refreshError) {
          // Token refresh failed
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

