/**
 * Email Verification Sent Page Component
 * 
 * Displays confirmation message after registration that a verification email has been sent.
 * Provides functionality to:
 * - Display the email address where verification was sent
 * - Resend verification email if needed
 * - Navigate to login if already verified
 * 
 * @module EmailVerificationSentPage
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
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FiMail, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resendVerification } from '@/src/lib/auth';
import useCustomToast from '@/src/hooks/useToast';
import PublicNav from '@/src/components/layout/PublicNav';
import { ROUTES, THEME } from '@/src/lib/constants';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EmailVerificationSentPage() {
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const toast = useCustomToast();

  const email = searchParams.get('email') || '';

  const handleResend = async () => {
    if (!email) {
      toast.error(
        'Email Not Available',
        'Please use the registration page to create a new account if you need a verification email.'
      );
      return;
    }

    setIsResending(true);
    try {
      await resendVerification(email);
      toast.success('Verification email sent!', 'Please check your inbox for the verification link.');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast.error(
        'Failed to Resend',
        error?.message || 'Unable to resend verification email. Please try again later.'
      );
    } finally {
      setIsResending(false);
    }
  };

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
              {/* SUCCESS ICON */}
              <Box
                bg={THEME.COLORS.background}
                borderRadius="full"
                p={4}
              >
                <Icon
                  as={FiMail}
                  w={16}
                  h={16}
                  color={THEME.COLORS.primary}
                />
              </Box>

              {/* HEADING */}
              <Heading 
                fontSize="2xl" 
                color={THEME.COLORS.primary}
                fontWeight="bold"
              >
                Check Your Email
              </Heading>

              {/* MESSAGE */}
              <Stack spacing={3}>
                <Text color="gray.600" fontSize="lg">
                  Email verification link sent
                </Text>
                <Text color="gray.600">
                  Please check your email inbox and click the verification link to activate your account.
                </Text>
              </Stack>

              {/* INFO BOX */}
              <Box
                bg="blue.50"
                p={4}
                borderRadius="md"
                borderLeft="4px"
                borderColor="blue.400"
                w="full"
                textAlign="left"
              >
                <Text fontSize="sm" color="gray.700">
                  The verification link will expire in 24 hours.
                </Text>
              </Box>

              {/* RESEND SECTION */}
              <Stack spacing={3} w="full">
                <Text color="gray.600" fontSize="sm">
                  Didn't receive the email?
                </Text>

                <Button />}
                  onClick={handleResend}
                  disabled={isResending} {...THEME.BUTTON_STYLES.secondaryButton}
                  variant="outline"
                  w="full"
                  size="lg"
                >
                  Resend Verification Email
                </Button>
              </Stack>

              {/* LOGIN LINK */}
              <Text fontSize="sm" color="gray.600" mt={4}>
                Already verified?{' '}
                <ChakraLink
                  as={Link}
                  href={ROUTES.PUBLIC.LOGIN}
                  color={THEME.COLORS.primary}
                  fontWeight="semibold"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Login here
                </ChakraLink>
              </Text>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}

