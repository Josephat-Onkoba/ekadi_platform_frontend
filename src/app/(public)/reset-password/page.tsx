/**
 * Password Reset Confirmation Page Component
 * 
 * Allows users to set a new password after clicking the reset link from their email.
 * Features:
 * - Token validation from URL
 * - Password strength requirements
 * - Password visibility toggles
 * - Success state with auto-redirect
 * - Invalid/expired token handling
 * - Toast notifications
 * - Responsive design matching application theme
 * 
 * @module ResetPasswordConfirmPage
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
  IconButton,
  Icon,
  Collapsible,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiCheckCircle, FiXCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmPasswordReset } from '@/src/lib/auth';
import useCustomToast from '@/src/hooks/useToast';
import PublicNav from '@/src/components/layout/PublicNav';
import { ROUTES, THEME } from '@/src/lib/constants';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const resetConfirmSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    password2: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ['password2'],
  });

type ResetConfirmFormData = z.infer<typeof resetConfirmSchema>;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ResetPasswordConfirmPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetConfirmFormData>({
    resolver: zodResolver(resetConfirmSchema),
    mode: 'onChange',
  });

  // Check token on mount
  useEffect(() => {
    const tokenParam = searchParams.get('token');

    if (!tokenParam) {
      setTokenValid(false);
      setToken(null);
      toast.error('Invalid Reset Link', 'This password reset link is invalid or missing.');
      return;
    }

    setToken(tokenParam);
  }, [searchParams, toast]);

  const onSubmit = async (data: ResetConfirmFormData) => {
    if (!token) {
      toast.error('Invalid Token', 'Reset token is missing. Please request a new reset link.');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(token, data.password, data.password2);
      setResetSuccess(true);
      toast.success('Password Reset Successful', 'Your password has been changed successfully.');

      // Wait 2 seconds then redirect to login
      setTimeout(() => {
        router.push(ROUTES.PUBLIC.LOGIN);
      }, 2000);
    } catch (error: any) {
      console.error('Password reset confirmation error:', error);
      const errorMessage = error?.message || 'Unable to reset password. Please try again.';

      // Check if token is expired or invalid
      if (
        errorMessage.toLowerCase().includes('expired') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('not found')
      ) {
        setTokenValid(false);
        toast.error('Reset Link Expired', 'This password reset link has expired. Please request a new one.');
      } else {
        toast.error('Reset Failed', errorMessage);
      }
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
            {/* INVALID TOKEN STATE */}
            {!tokenValid ? (
              <Stack spacing={6} textAlign="center">
                <Icon
                  as={FiXCircle}
                  w={16}
                  h={16}
                  color="red.500"
                  mx="auto"
                />
                <Heading fontSize="2xl" color="red.600">
                  Invalid Reset Link
                </Heading>
                <Text color="gray.600">
                  This password reset link is invalid or has expired.
                </Text>
                <Link href={ROUTES.PUBLIC.FORGOT_PASSWORD} style={{ width: '100%' }}>
                  <Button
                    {...THEME.BUTTON_STYLES.primaryButton}
                    w="full"
                    size="lg"
                  >
                    Request New Link
                  </Button>
                </Link>
              </Stack>
            ) : resetSuccess ? (
              /* SUCCESS STATE */
              <Stack spacing={6} textAlign="center">
                <Box
                  bg="green.50"
                  borderRadius="full"
                  p={4}
                  mx="auto"
                  w="fit-content"
                >
                  <Icon
                    as={FiCheckCircle}
                    w={16}
                    h={16}
                    color="green.500"
                  />
                </Box>
                <Heading fontSize="2xl" color={THEME.COLORS.primary} fontWeight="bold">
                  Password Reset Successfully
                </Heading>
                <Text color="gray.600">
                  Your password has been changed. You can now login with your new password.
                </Text>
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  All existing sessions have been logged out for security.
                </Text>
                <Link href={ROUTES.PUBLIC.LOGIN} style={{ width: '100%' }}>
                  <Button
                    {...THEME.BUTTON_STYLES.primaryButton}
                    w="full"
                    size="lg"
                  >
                    Go to Login
                  </Button>
                </Link>
              </Stack>
            ) : (
              /* FORM STATE */
              <Stack spacing={6}>
                {/* HEADER */}
                <Stack spacing={3} textAlign="center">
                  <Heading 
                    fontSize="2xl" 
                    color={THEME.COLORS.primary}
                    fontWeight="bold"
                  >
                    Set New Password
                  </Heading>
                  <Text color="gray.600">
                    Choose a strong password for your account
                  </Text>
                </Stack>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={5}>
                    {/* NEW PASSWORD */}
                    <Field.Root invalid={!!errors.password} w="100%">
                      <Field.Label fontWeight="semibold" color="gray.700" mb={3}>
                        New Password
                      </Field.Label>
                      <Box position="relative" w="100%">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          borderRadius="md"
                          h="52px"
                          pl="1.25rem"
                          pr="3.5rem"
                          bg={THEME.COLORS.background}
                          border="2px solid"
                          borderColor={errors.password ? THEME.COLORS.error : 'gray.200'}
                          color={THEME.COLORS.textPrimary}
                          className="registration-input"
                          sx={{
                            backgroundColor: `${THEME.COLORS.background} !important`,
                            background: `${THEME.COLORS.background} !important`,
                            '&:hover': {
                              backgroundColor: `${THEME.COLORS.background} !important`,
                              background: `${THEME.COLORS.background} !important`,
                            },
                            '&:focus': {
                              backgroundColor: `${THEME.COLORS.background} !important`,
                              background: `${THEME.COLORS.background} !important`,
                              borderColor: `${THEME.COLORS.primary} !important`,
                              boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20 !important`,
                            },
                          }}
                          _placeholder={{
                            color: 'gray.500',
                            opacity: 1,
                          }}
                          {...register('password')}
                        />
                        <Box position="absolute" right="0.5rem" top="50%" transform="translateY(-50%)" zIndex={2}>
                          <IconButton
                            aria-label="Toggle password visibility"
                            icon={showPassword ? <FiEyeOff /> : <FiEye />}
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                            size="sm"
                            color={THEME.COLORS.primary}
                            _hover={{
                              bg: THEME.COLORS.background,
                              color: THEME.COLORS.primary,
                            }}
                            borderRadius="md"
                          />
                        </Box>
                      </Box>
                      <Field.ErrorText>
                        {errors.password?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    {/* CONFIRM PASSWORD */}
                    <Field.Root invalid={!!errors.password2} w="100%">
                      <Field.Label fontWeight="semibold" color="gray.700" mb={3}>
                        Confirm New Password
                      </Field.Label>
                      <Box position="relative" w="100%">
                        <Input
                          type={showPassword2 ? 'text' : 'password'}
                          placeholder="••••••••"
                          borderRadius="md"
                          h="52px"
                          pl="1.25rem"
                          pr="3.5rem"
                          bg={THEME.COLORS.background}
                          border="2px solid"
                          borderColor={errors.password2 ? THEME.COLORS.error : 'gray.200'}
                          color={THEME.COLORS.textPrimary}
                          className="registration-input"
                          sx={{
                            backgroundColor: `${THEME.COLORS.background} !important`,
                            background: `${THEME.COLORS.background} !important`,
                            '&:hover': {
                              backgroundColor: `${THEME.COLORS.background} !important`,
                              background: `${THEME.COLORS.background} !important`,
                            },
                            '&:focus': {
                              backgroundColor: `${THEME.COLORS.background} !important`,
                              background: `${THEME.COLORS.background} !important`,
                              borderColor: `${THEME.COLORS.primary} !important`,
                              boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20 !important`,
                            },
                          }}
                          _placeholder={{
                            color: 'gray.500',
                            opacity: 1,
                          }}
                          {...register('password2')}
                        />
                        <Box position="absolute" right="0.5rem" top="50%" transform="translateY(-50%)" zIndex={2}>
                          <IconButton
                            aria-label="Toggle password visibility"
                            icon={showPassword2 ? <FiEyeOff /> : <FiEye />}
                            onClick={() => setShowPassword2(!showPassword2)}
                            variant="ghost"
                            size="sm"
                            color={THEME.COLORS.primary}
                            _hover={{
                              bg: THEME.COLORS.background,
                              color: THEME.COLORS.primary,
                            }}
                            borderRadius="md"
                          />
                        </Box>
                      </Box>
                      <Field.ErrorText>
                        {errors.password2?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    {/* PASSWORD REQUIREMENTS - LINK STYLE */}
                    <Box>
                      <Button
                        onClick={() => setShowRequirements(!showRequirements)}
                        variant="link"
                        size="sm"
                        color={THEME.COLORS.primary}
                        fontWeight="semibold"
                        fontSize="sm"
                        p={0}
                        h="auto"
                        _hover={{
                          textDecoration: 'underline',
                        }}
                        rightIcon={
                          <Icon
                            as={showRequirements ? FiChevronUp : FiChevronDown}
                            w={4}
                            h={4}
                          />
                        }
                      >
                        Password Requirements
                      </Button>
                      <Collapsible.Root open={showRequirements}>
                        <Collapsible.Content>
                          <Box
                            mt={2}
                            p={3}
                            bg="blue.50"
                            borderRadius="md"
                            borderLeft="3px solid"
                            borderColor={THEME.COLORS.primary}
                          >
                            <Stack spacing={1.5} color="gray.700">
                              <Text fontSize="sm">• At least 8 characters</Text>
                              <Text fontSize="sm">• One uppercase letter</Text>
                              <Text fontSize="sm">• One lowercase letter</Text>
                              <Text fontSize="sm">• One number</Text>
                            </Stack>
                          </Box>
                        </Collapsible.Content>
                      </Collapsible.Root>
                    </Box>

                    {/* SUBMIT BUTTON */}
                    <Button
                      type="submit"
                      w="full"
                      size="lg"
                      isLoading={isSubmitting}
                      loadingText="Resetting Password..."
                      {...THEME.BUTTON_STYLES.primaryButton}
                    >
                      Reset Password
                    </Button>
                  </Stack>
                </form>
              </Stack>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

