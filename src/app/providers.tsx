/**
 * Ekadi Platform Providers - Modern Hook-based Version
 * 
 * This version uses react-error-boundary for cleaner error handling
 * Install: npm install react-error-boundary
 * 
 * @module Providers
 */

'use client';

import { ReactNode, Suspense, useEffect } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@/src/lib/theme';
import { AuthProvider } from '@/src/contexts/AuthContext';
import ToastContainer from '@/src/components/common/ToastContainer';

// ============================================================================
// TYPES
// ============================================================================

interface ProvidersProps {
  children: ReactNode;
}

// ============================================================================
// ERROR FALLBACK COMPONENT
// ============================================================================

/**
 * Error fallback component shown when providers fail
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f9fafb',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            backgroundColor: '#fee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '2rem' }}>⚠️</span>
        </div>
        
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
            color: '#1f2937',
          }}
        >
          Something Went Wrong
        </h1>
        
        <p
          style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            lineHeight: '1.6',
          }}
        >
          We encountered an error while loading the application. 
          Please try reloading the page.
        </p>
        
        <button
          onClick={resetErrorBoundary}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#008080',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#006666';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#008080';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Reload Application
        </button>
        
        {process.env.NODE_ENV === 'development' && (
          <details
            style={{
              marginTop: '2rem',
              textAlign: 'left',
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              Error Details (Development)
            </summary>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.375rem',
                overflow: 'auto',
                fontSize: '0.75rem',
                color: '#dc2626',
                lineHeight: '1.4',
              }}
            >
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// LOADING FALLBACK
// ============================================================================

/**
 * Loading fallback shown during provider initialization
 */
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          className="spinner"
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #008080',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p
          style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          Loading Ekadi...
        </p>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

// ============================================================================
// ERROR HANDLER
// ============================================================================

/**
 * Handles errors caught by ErrorBoundary
 */
function handleError(error: Error, info: { componentStack: string }) {
  // Log to error reporting service in production
  console.error('Provider Error:', error);
  console.error('Component Stack:', info.componentStack);
  
  // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { contexts: { react: info } });
  // }
}

// ============================================================================
// MAIN PROVIDERS COMPONENT
// ============================================================================

/**
 * Application Providers Component
 * 
 * Wraps the application with all necessary context providers:
 * - Error boundary for error handling
 * - Suspense for code splitting
 * - Chakra UI for theming
 * - Auth context for authentication
 * - Toast notifications
 * 
 * @param props - Component props
 * @returns Nested providers wrapping children
 */
/**
 * Force light mode on mount
 * Prevents dark mode from system preferences
 */
function ForceLightMode() {
  useEffect(() => {
    // Force light mode
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
    
    // Remove any dark mode classes
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    
    // Prevent system dark mode from applying
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) {
      // Override any dark mode styles
      document.documentElement.style.setProperty('--color-background', '#ffffff', 'important');
      document.documentElement.style.setProperty('--color-surface', '#f9fafb', 'important');
      document.documentElement.style.setProperty('--color-text', '#171717', 'important');
      document.documentElement.style.setProperty('--color-text-secondary', '#737373', 'important');
      document.documentElement.style.setProperty('--color-border', '#e5e7eb', 'important');
    }
  }, []);

  return null;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset app state if needed
        window.location.href = '/';
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <ForceLightMode />
        <ChakraProvider value={system}>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </ChakraProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

// ============================================================================
// EXPORTS FOR TESTING
// ============================================================================

export { ErrorFallback, LoadingFallback };