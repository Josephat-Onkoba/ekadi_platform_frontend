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
  Link as ChakraLink,
  Separator,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import useCustomToast from '@/src/hooks/useToast';
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
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const toast = useCustomToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedEmail = localStorage.getItem('ekadi_remember_email');
    if (storedEmail) {
      setValue('email', storedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginCredentials) => {
    const now = Date.now();
    if (lastSubmitTime && now - lastSubmitTime < 5000) {
      toast.error(
        'Please wait a moment',
        'You are submitting too quickly. Please wait a few seconds before trying again.'
      );
      return;
    }

    setLastSubmitTime(now);

    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem('ekadi_remember_email', data.email);
      } else {
        localStorage.removeItem('ekadi_remember_email');
      }
    }
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Welcome back!', 'You have been successfully logged in.');
      // Navigation is handled by AuthContext after successful login
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Extract error message from various possible formats
      let errorMessage = 'Unable to log in. Please check your credentials.';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.detail) {
        errorMessage = error.detail;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
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

  // Password toggle button component
  const PasswordToggleButton = () => (
    <Button
      type="button"
      aria-label="Toggle password visibility"
      onClick={() => setShowPassword(!showPassword)}
      variant="ghost"
      size="sm"
      p={2}
      minW="36px"
      h="36px"
      color="gray.500"
      _hover={{
        bg: 'gray.100',
        color: THEME.COLORS.primary,
      }}
      borderRadius="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon as={showPassword ? FiEyeOff : FiEye} boxSize={5} />
    </Button>
  );

  return (
    <Box 
      minH="100vh" 
      bg={THEME.COLORS.background}
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={4}
      px={4}
    >
      <Container maxW="440px">
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          p={{ base: 6, sm: 8 }}
        >
          {/* HEADER */}
          <Stack gap={2} mb={8} textAlign="center">
            <Link href="/">
              <Text 
                fontSize="2xl" 
                fontWeight="bold" 
                color={THEME.COLORS.primary}
                mb={2}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
              >
                Ekadi
              </Text>
            </Link>
            <Heading 
              fontSize="xl" 
              color="gray.800"
              fontWeight="bold"
            >
              Welcome Back
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Login to manage your events
            </Text>
          </Stack>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={5}>
              {/* EMAIL */}
              <Field.Root invalid={!!(touchedFields.email && errors.email)} w="100%">
                <Field.Label fontWeight="semibold" color="gray.700" mb={2} fontSize="sm">
                  Email
                </Field.Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  borderRadius="lg"
                  h="48px"
                  pl="1rem"
                  pr="1rem"
                  bg={THEME.COLORS.background}
                  border="2px solid"
                  borderColor={touchedFields.email && errors.email ? THEME.COLORS.error : "gray.200"}
                  className="registration-input"
                  _placeholder={{
                    color: "gray.500",
                    opacity: 1,
                  }}
                  _focus={{
                    borderColor: THEME.COLORS.primary,
                    bg: THEME.COLORS.background,
                    boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                  }}
                  _hover={{
                    borderColor: touchedFields.email && errors.email ? THEME.COLORS.error : THEME.COLORS.primary,
                  }}
                  {...register('email')}
                />
                {touchedFields.email && errors.email && (
                  <Flex align="center" gap={1.5} mt={1.5}>
                    <Icon as={FiAlertCircle} color={THEME.COLORS.error} boxSize={3.5} />
                    <Field.ErrorText color={THEME.COLORS.error} fontSize="xs" fontWeight="medium">
                      {errors.email?.message}
                    </Field.ErrorText>
                  </Flex>
                )}
              </Field.Root>

              {/* PASSWORD */}
              <Field.Root invalid={!!(touchedFields.password && errors.password)} w="100%">
                <Field.Label fontWeight="semibold" color="gray.700" mb={2} fontSize="sm">
                  Password
                </Field.Label>
                <Box position="relative" w="100%">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    borderRadius="lg"
                    h="48px"
                    pl="1rem"
                    pr="3rem"
                    bg={THEME.COLORS.background}
                    border="2px solid"
                    borderColor={touchedFields.password && errors.password ? THEME.COLORS.error : "gray.200"}
                    className="registration-input"
                    _placeholder={{
                      color: "gray.500",
                      opacity: 1,
                    }}
                    _focus={{
                      borderColor: THEME.COLORS.primary,
                      bg: THEME.COLORS.background,
                      boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                    }}
                    _hover={{
                      borderColor: touchedFields.password && errors.password ? THEME.COLORS.error : THEME.COLORS.primary,
                    }}
                    {...register('password')}
                  />
                  <Box position="absolute" right="0.5rem" top="50%" transform="translateY(-50%)" zIndex={2}>
                    <PasswordToggleButton />
                  </Box>
                </Box>
                {touchedFields.password && errors.password && (
                  <Flex align="center" gap={1.5} mt={1.5}>
                    <Icon as={FiAlertCircle} color={THEME.COLORS.error} boxSize={3.5} />
                    <Field.ErrorText color={THEME.COLORS.error} fontSize="xs" fontWeight="medium">
                      {errors.password?.message}
                    </Field.ErrorText>
                  </Flex>
                )}
              </Field.Root>

              {/* REMEMBER ME + FORGOT PASSWORD */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Flex alignItems="center" gap={2}>
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                    style={{
                      width: 16,
                      height: 16,
                      cursor: 'pointer',
                      accentColor: THEME.COLORS.primary,
                    }}
                  />
                  <label htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
                    <Text fontSize="sm" color="gray.600">
                      Remember me
                    </Text>
                  </label>
                </Flex>
                <ChakraLink
                  as={Link}
                  href={ROUTES.PUBLIC.FORGOT_PASSWORD}
                  fontSize="sm"
                  color={THEME.COLORS.primary}
                  fontWeight="medium"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Forgot password?
                </ChakraLink>
              </Box>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                size="lg"
                h="48px"
                w="full"
                disabled={isSubmitting}
                {...THEME.BUTTON_STYLES.primaryButton}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
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
              fontWeight="bold"
              _hover={{ textDecoration: 'underline' }}
            >
              Sign up
            </ChakraLink>
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
