/**
 * Custom Toast Notification Hook
 * 
 * Provides convenient methods for displaying toast notifications
 * with consistent styling and configuration across the application.
 * 
 * Features:
 * - Success, error, warning, and info toast types
 * - Consistent positioning and duration
 * - Optimized with useCallback
 * - TypeScript typed
 * 
 * @module useToast
 */

import { useCallback } from 'react';
import { addToast } from '@/src/components/common/ToastContainer';

/**
 * Custom Toast Hook
 * 
 * Provides convenient methods for displaying toast notifications
 * with predefined configurations for different notification types.
 * 
 * @returns Object with success, error, warning, and info methods
 * 
 * @example
 * ```tsx
 * import useCustomToast from '@/hooks/useToast';
 * 
 * function MyComponent() {
 *   const toast = useCustomToast();
 * 
 *   const handleSuccess = () => {
 *     toast.success('Success!', 'Your action was completed successfully.');
 *   };
 * 
 *   const handleError = () => {
 *     toast.error('Error!', 'Something went wrong.');
 *   };
 * 
 *   return <button onClick={handleSuccess}>Show Toast</button>;
 * }
 * ```
 */
export default function useCustomToast() {
  /**
   * Display a success toast notification
   * 
   * @param title - Toast title (main message)
   * @param description - Optional detailed description
   * 
   * @example
   * ```tsx
   * toast.success('Success!', 'Your changes have been saved.');
   * ```
   */
  const success = useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, type: 'success', duration: 4000 });
    },
    []
  );

  /**
   * Display an error toast notification
   * 
   * @param title - Toast title (main message)
   * @param description - Optional detailed description
   * 
   * @example
   * ```tsx
   * toast.error('Error!', 'Failed to save changes.');
   * ```
   */
  const error = useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, type: 'error', duration: 5000 });
    },
    []
  );

  /**
   * Display a warning toast notification
   * 
   * @param title - Toast title (main message)
   * @param description - Optional detailed description
   * 
   * @example
   * ```tsx
   * toast.warning('Warning!', 'This action cannot be undone.');
   * ```
   */
  const warning = useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, type: 'warning', duration: 4000 });
    },
    []
  );

  /**
   * Display an info toast notification
   * 
   * @param title - Toast title (main message)
   * @param description - Optional detailed description
   * 
   * @example
   * ```tsx
   * toast.info('Info', 'New features are available!');
   * ```
   */
  const info = useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, type: 'info', duration: 4000 });
    },
    []
  );

  return {
    success,
    error,
    warning,
    info,
  };
}

