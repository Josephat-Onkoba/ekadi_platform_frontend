/**
 * Email Verification Confirmation Page Component
 * 
 * Handles email verification token confirmation with:
 * - Automatic token verification on page load
 * - Multiple status states (loading, success, error, expired)
 * - Auto-redirect to login after successful verification
 * - Countdown timer for redirect
 * - Resend functionality for expired tokens
 * - Toast notifications for user feedback
 * 
 * @module VerifyEmailPage
 */

'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/src/lib/auth';
import useCustomToast from '@/src/hooks/useToast';
import PublicNav from '@/src/components/layout/PublicNav';
import { ROUTES, THEME } from '@/src/lib/constants';

// ============================================================================
// TYPES
// ============================================================================

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(5);

  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useCustomToast();
  
  // Ref to prevent duplicate verification calls
  const hasVerifiedRef = useRef(false);

  // Verify token on mount (only once)
  useEffect(() => {
    // Prevent duplicate calls (especially in React Strict Mode development)
    if (hasVerifiedRef.current) {
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      toast.error('Verification Failed', 'Invalid verification link.');
      hasVerifiedRef.current = true; // Mark as processed even for error case
      return;
    }

    // Mark as processing to prevent duplicate calls
    hasVerifiedRef.current = true;

    const verifyToken = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Your email has been successfully verified!');
        toast.success('Email Verified!', 'You can now log in to your account.');
      } catch (error: any) {
        console.error('Verification error:', error);
        const errorMessage = error?.message || 'Unable to verify email. Please try again.';
        
        // Check if token is expired
        if (errorMessage.toLowerCase().includes('expired') || 
            errorMessage.toLowerCase().includes('invalid') ||
            errorMessage.toLowerCase().includes('not found')) {
          setStatus('expired');
          setMessage('Your verification link has expired. Please request a new one.');
        } else {
          setStatus('error');
          setMessage(errorMessage);
        }
        
        toast.error('Verification Failed', errorMessage);
      }
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (status === 'success' && countdown === 0) {
      router.push(ROUTES.PUBLIC.LOGIN);
    }
  }, [status, countdown, router]);

  return (
    <>
      <PublicNav />

      <Box 
        minH="calc(100vh - 70px)" 
        bg={THEME.COLORS.background}
        py={12}
      >
        <Container maxW="md">
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p={8}
            textAlign="center"
          >
            <Stack spacing={6} align="center">
              {/* LOADING STATE */}
              {status === 'loading' && (
                <>
                  <Spinner
                    size="xl"
                    thickness="4px"
                    speed="0.65s"
                    color={THEME.COLORS.primary}
                  />
                  <Heading fontSize="xl" color="gray.700">
                    Verifying Your Email...
                  </Heading>
                  <Text color="gray.600">
                    Please wait while we verify your account
                  </Text>
                </>
              )}

              {/* SUCCESS STATE */}
              {status === 'success' && (
                <>
                  <Box
                    bg="green.50"
                    borderRadius="full"
                    p={4}
                  >
                    <Icon
                      as={FiCheckCircle}
                      w={16}
                      h={16}
                      color="green.500"
                    />
                  </Box>
                  <Heading fontSize="2xl" color={THEME.COLORS.primary}>
                    Email Verified!
                  </Heading>
                  <Text color="gray.600" fontSize="lg">
                    {message}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    Redirecting to login in {countdown} seconds...
                  </Text>
                  <Link href={ROUTES.PUBLIC.LOGIN} style={{ width: '100%' }}>
                    <Button
                      {...THEME.BUTTON_STYLES.primaryButton}
                      w="full"
                      size="lg"
                    >
                      Go to Login Now
                    </Button>
                  </Link>
                </>
              )}

              {/* ERROR STATE */}
              {status === 'error' && (
                <>
                  <Box
                    bg="red.50"
                    borderRadius="full"
                    p={4}
                  >
                    <Icon
                      as={FiXCircle}
                      w={16}
                      h={16}
                      color="red.500"
                    />
                  </Box>
                  <Heading fontSize="2xl" color="red.600">
                    Verification Failed
                  </Heading>
                  <Text color="gray.600">
                    {message}
                  </Text>
                  <Link href={ROUTES.PUBLIC.LOGIN} style={{ width: '100%' }}>
                    <Button
                      {...THEME.BUTTON_STYLES.secondaryButton}
                      variant="outline"
                      w="full"
                      size="lg"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </>
              )}

              {/* EXPIRED STATE */}
              {status === 'expired' && (
                <>
                  <Box
                    bg="orange.50"
                    borderRadius="full"
                    p={4}
                  >
                    <Icon
                      as={FiAlertCircle}
                      w={16}
                      h={16}
                      color="orange.500"
                    />
                  </Box>
                  <Heading fontSize="2xl" color="orange.600">
                    Link Expired
                  </Heading>
                  <Text color="gray.600">
                    Your verification link has expired. Please request a new one.
                  </Text>
                  <Stack direction="row" spacing={4} w="full">
                    <Link href={`${ROUTES.PUBLIC.EMAIL_SENT}?resend=true`} style={{ flex: 1 }}>
                      <Button
                        {...THEME.BUTTON_STYLES.primaryButton}
                        flex={1}
                        size="lg"
                      >
                        Resend Link
                      </Button>
                    </Link>
                    <Link href={ROUTES.PUBLIC.LOGIN} style={{ flex: 1 }}>
                      <Button
                        {...THEME.BUTTON_STYLES.secondaryButton}
                        variant="outline"
                        flex={1}
                        size="lg"
                      >
                        Back to Login
                      </Button>
                    </Link>
                  </Stack>
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}

