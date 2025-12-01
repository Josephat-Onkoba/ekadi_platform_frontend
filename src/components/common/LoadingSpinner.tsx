/**
 * Loading Spinner Component
 * 
 * Displays a loading spinner with optional message.
 * Can be displayed inline or as a full-screen overlay.
 * 
 * Features:
 * - Configurable size
 * - Full-screen mode
 * - Optional loading message
 * - Chakra UI theming
 * 
 * @module LoadingSpinner
 */

'use client';

import { Box, Spinner, Text, Center } from '@chakra-ui/react';

/**
 * Props for LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to display as full screen loading */
  fullScreen?: boolean;
  /** Optional loading message to display below spinner */
  message?: string;
}

/**
 * Loading Spinner Component
 * 
 * Displays a loading spinner with configurable size and optional message.
 * Can be displayed inline or take up the full screen.
 * 
 * @param props - Component props
 * @returns Loading spinner component
 * 
 * @example
 * ```tsx
 * // Inline spinner
 * <LoadingSpinner />
 * 
 * // Full screen with message
 * <LoadingSpinner fullScreen message="Loading your data..." />
 * 
 * // Large spinner
 * <LoadingSpinner size="xl" />
 * ```
 */
export default function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  message,
}: LoadingSpinnerProps) {
  // Full screen loading state
  if (fullScreen) {
    return (
      <Center minH="100vh" flexDirection="column" gap={4}>
        <Spinner size={size} thickness="4px" speed="0.65s" color="teal.500" />
        {message && <Text color="gray.500">{message}</Text>}
      </Center>
    );
  }

  // Inline loading state
  return (
    <Center py={8}>
      <Spinner size={size} thickness="4px" speed="0.65s" color="teal.500" />
    </Center>
  );
}

