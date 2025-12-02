/**
 * Forgot Password Page Component
 * 
 * Allows users to request a password reset link via email.
 * Features:
 * - Email validation using Zod
 * - Security: Doesn't reveal if email exists
 * - Success state after submission
 * - 15-minute expiry notice
 * - Toast notifications
 * - Responsive design matching application theme
 * 
 * @module ForgotPasswordPage
 */

'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Field,
  Input,
  Button,
  Icon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { requestPasswordReset } from '@/src/lib/auth';
import useCustomToast from '@/src/hooks/useToast';
import { ROUTES, THEME } from '@/src/lib/constants';

const PublicNav = dynamic(() => import('@/src/components/layout/PublicNav'), {
  ssr: false,
});

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const resetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
});

type ResetRequestFormData = z.infer<typeof resetRequestSchema>;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);

  const toast = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetRequestFormData>({
    resolver: zodResolver(resetRequestSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ResetRequestFormData) => {
    const now = Date.now();
    if (lastSubmitTime && now - lastSubmitTime < 5000) {
      toast.error(
        'Please wait a moment',
        'You are submitting too quickly. Please wait a few seconds before trying again.'
      );
      return;
    }

    setLastSubmitTime(now);
    setIsSubmitting(true);
    try {
      await requestPasswordReset(data.email);
      setEmailSent(true);
      toast.success(
        'Reset Link Sent',
        'If an account exists with that email, a password reset link has been sent.'
      );
      reset();
    } catch (error: any) {
      console.error('Password reset request error:', error);
      // Don't reveal if email exists (security best practice)
      // Show generic error message
      toast.error(
        'Request Failed',
        'Unable to process your request. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
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
          >
            {/* BACK LINK */}
            <Link href={ROUTES.PUBLIC.LOGIN} style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <Button
                variant="ghost"
                size="sm"
                mb={4}
                color={THEME.COLORS.primary}
                _hover={{
                  bg: THEME.COLORS.background,
                  color: THEME.COLORS.primary,
                }}
              >
                Back to Login
              </Button>
            </Link>

            {/* FORM STATE */}
            {!emailSent ? (
              <Stack gap={6}>
                {/* HEADER */}
                <Stack gap={3} textAlign="center">
                  <Icon
                    as={FiMail}
                    w={12}
                    h={12}
                    color={THEME.COLORS.primary}
                    mx="auto"
                  />
                  <Heading 
                    fontSize="2xl" 
                    color={THEME.COLORS.primary}
                    fontWeight="bold"
                  >
                    Reset Your Password
                  </Heading>
                  <Text color="gray.600">
                    Enter your email and we'll send you a reset link
                  </Text>
                </Stack>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack gap={5}>
                    {/* EMAIL */}
                    <Field.Root invalid={!!errors.email} w="100%">
                      <Field.Label fontWeight="semibold" color="gray.700" mb={3}>
                        Email Address
                      </Field.Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        borderRadius="md"
                        h="52px"
                        pl="1.25rem"
                        pr="1.25rem"
                        border="2px solid"
                        borderColor={errors.email ? THEME.COLORS.error : 'gray.200'}
                        bg={THEME.COLORS.background}
                        color={THEME.COLORS.textPrimary}
                        className="registration-input"
                        _placeholder={{
                          color: 'gray.500',
                          opacity: 1,
                        }}
                        {...register('email')}
                      />
                      <Field.ErrorText>
                        {errors.email?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    {/* INFO BOX */}
                    <Box
                      bg="blue.50"
                      p={4}
                      borderRadius="md"
                      borderLeft="4px"
                      borderColor="blue.400"
                    >
                      <Text fontSize="sm" color="gray.700">
                        The reset link will expire in 15 minutes.
                      </Text>
                    </Box>

                    {/* SUBMIT BUTTON */}
                    <Button
                      type="submit"
                      w="full"
                      size="lg"
                      disabled={isSubmitting} {...THEME.BUTTON_STYLES.primaryButton}
                    >
                      Send Reset Link
                    </Button>
                  </Stack>
                </form>
              </Stack>
            ) : (
              /* SUCCESS STATE */
              <Stack gap={6} textAlign="center">
                <Box
                  bg="green.50"
                  borderRadius="full"
                  p={4}
                  mx="auto"
                  w="fit-content"
                >
                  <Icon
                    as={FiMail}
                    w={16}
                    h={16}
                    color="green.500"
                  />
                </Box>
                <Heading 
                  fontSize="2xl" 
                  color={THEME.COLORS.primary}
                  fontWeight="bold"
                >
                  Check Your Email
                </Heading>
                <Text color="gray.600">
                  If an account exists with that email, we've sent a password reset link.
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Didn't receive it? Check your spam folder or try again.
                </Text>
                <Button
                  onClick={() => setEmailSent(false)}
                  {...THEME.BUTTON_STYLES.secondaryButton}
                  variant="outline"
                  w="full"
                  size="lg"
                >
                  Try Another Email
                </Button>
              </Stack>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

