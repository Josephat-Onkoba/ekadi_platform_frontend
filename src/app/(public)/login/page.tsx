/**
 * Login Page Component
 * 
 * Provides user authentication functionality with:
 * - Email and password login
 * - Form validation using Zod
 * - Password visibility toggle
 * - Error handling for unverified emails
 * - Toast notifications
 * - Responsive design matching the application theme
 * 
 * @module LoginPage
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
  Link as ChakraLink,
  Separator,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import useCustomToast from '@/src/hooks/useToast';
import PublicNav from '@/src/components/layout/PublicNav';
import { ROUTES, THEME } from '@/src/lib/constants';
import { LoginCredentials } from '@/src/types';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Welcome back!', 'You have been successfully logged in.');
      // Navigation is handled by AuthContext after successful login
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Parse error message
      const errorMessage = error?.message || 'Unable to log in. Please check your credentials.';
      
      // Check if email is not verified
      if (errorMessage.toLowerCase().includes('email not verified') || 
          errorMessage.toLowerCase().includes('email verification')) {
        toast.error(
          'Email Not Verified',
          'Please verify your email address before logging in. Check your inbox for the verification link.'
        );
      } else {
        toast.error('Login Failed', errorMessage);
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
            _hover={{ boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            {/* HEADER */}
            <Stack spacing={4} mb={8} textAlign="center">
              <Heading 
                fontSize="2xl" 
                color={THEME.COLORS.primary}
                fontWeight="bold"
              >
                Welcome Back
              </Heading>
              <Text color="gray.600">
                Login to manage your events
              </Text>
            </Stack>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={5}>
                {/* EMAIL */}
                <Field.Root invalid={!!errors.email} w="100%">
                  <Field.Label fontWeight="semibold" color="gray.700" mb={3}>
                    Email
                  </Field.Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    borderRadius="md"
                    h="48px"
                    pl="1.25rem"
                    pr="1.25rem"
                    bg={THEME.COLORS.background}
                    border="2px solid"
                    borderColor={errors.email ? THEME.COLORS.error : "gray.200"}
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
                      color: "gray.500",
                      opacity: 1,
                    }}
                    {...register('email')}
                  />
                  <Field.ErrorText>
                    {errors.email?.message}
                  </Field.ErrorText>
                </Field.Root>

                {/* PASSWORD */}
                <Field.Root invalid={!!errors.password} w="100%">
                  <Field.Label fontWeight="semibold" color="gray.700" mb={3}>
                    Password
                  </Field.Label>
                  <Box position="relative" w="100%">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      borderRadius="md"
                      h="48px"
                      pl="1.25rem"
                      pr="3.5rem"
                      bg={THEME.COLORS.background}
                      border="2px solid"
                      borderColor={errors.password ? THEME.COLORS.error : "gray.200"}
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
                        color: "gray.500",
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

                {/* FORGOT PASSWORD LINK */}
                <Box textAlign="right">
                  <ChakraLink
                    as={Link}
                    href={ROUTES.PUBLIC.FORGOT_PASSWORD}
                    fontSize="sm"
                    color={THEME.COLORS.primary}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Forgot password?
                  </ChakraLink>
                </Box>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  isLoading={isSubmitting}
                  loadingText="Logging in..."
                  {...THEME.BUTTON_STYLES.primaryButton}
                >
                  Login
                </Button>
              </Stack>
            </form>

            {/* DIVIDER */}
            <Separator my={6} />

            {/* FOOTER */}
            <Text textAlign="center" fontSize="sm" color="gray.600">
              Don't have an account?{' '}
              <ChakraLink
                as={Link}
                href={ROUTES.PUBLIC.REGISTER}
                color={THEME.COLORS.primary}
                fontWeight="semibold"
                _hover={{ textDecoration: 'underline' }}
              >
                Sign up
              </ChakraLink>
            </Text>
          </Box>
        </Container>
      </Box>
    </>
  );
}

