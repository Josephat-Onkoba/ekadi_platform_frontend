 'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Input,
  Button,
  IconButton,
  Field,
  Icon,
  Flex,
  Circle,
  // Fade removed here
} from '@chakra-ui/react';
import { 
  FiEye, 
  FiEyeOff, 
  FiMail, 
  FiLock, 
  FiUser, 
  FiPhone, 
  FiBriefcase, 
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiChevronLeft,
  FiCheck
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import useCustomToast from '@/src/hooks/useToast';
import { ROUTES, COUNTRY_CODES, USER_TYPES, THEME } from '@/src/lib/constants';
import { RegisterData } from '@/src/types';
import { IconType } from 'react-icons';

const PublicNav = dynamic(() => import('@/src/components/layout/PublicNav'), {
  ssr: false,
});

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    password2: z.string().min(1, 'Please confirm your password'),
    first_name: z.string().min(2, 'First name must be at least 2 characters').min(1, 'First name is required'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters').min(1, 'Last name is required'),
    profile: z.object({
      country_code: z.string().min(1, 'Country code is required'),
      phone_number: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^[0-9 ]+$/, 'Phone number must contain digits (and spaces) only')
        .min(4, 'Phone number must be at least 4 digits')
        .max(20, 'Phone number must be at most 20 characters'),
      user_type: z.enum(['individual', 'business'] as const),
      company_name: z.string().optional(),
    }),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ['password2'],
  })
  .refine(
    (data) => {
      if (data.profile.user_type === 'business') {
        return data.profile.company_name && data.profile.company_name.length > 0;
      }
      return true;
    },
    {
      message: 'Company name is required for business accounts',
      path: ['profile', 'company_name'],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

interface FormInputProps {
  icon: IconType;
  label: string;
  placeholder: string;
  error?: string;
  isValid?: boolean;
  type?: string;
  register: any;
  name: string;
  rightElement?: ReactNode;
}

const FormInput = ({
  icon: IconComponent,
  label,
  placeholder,
  error,
  isValid,
  type = 'text',
  register,
  name,
  rightElement,
}: FormInputProps) => (
  <Field.Root invalid={!!error} w="100%">
    <Field.Label fontWeight="semibold" color="gray.700" mb={3}>
      {label}
    </Field.Label>
    <Box position="relative" w="100%">
      <Input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        h="52px"
        pl="1.25rem"
        pr={rightElement ? "3.5rem" : isValid && !error ? "3.5rem" : "1.25rem"}
        borderRadius="lg"
        border="2px solid"
        borderColor={error ? THEME.COLORS.error : "gray.200"}
        bg={THEME.COLORS.background}
        color={THEME.COLORS.textPrimary}
        fontSize="md"
        className="registration-input"
        _placeholder={{
          color: "gray.500",
          opacity: 1,
        }}
        _focus={{
          borderColor: THEME.COLORS.primary,
          bg: `${THEME.COLORS.background} !important`,
          boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
        }}
        transition="all 0.2s"
      />
      {isValid && !error && (
        <Box
          position="absolute"
          right="1rem"
          top="50%"
          transform="translateY(-50%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="24px"
          h="24px"
          borderRadius="full"
          bg={`${THEME.COLORS.success}15`}
          pointerEvents="none"
          zIndex={2}
        >
          <Icon 
            as={FiCheckCircle} 
            color={THEME.COLORS.success}
            boxSize={4}
          />
        </Box>
      )}
      {rightElement && (
        <Box position="absolute" right="0.5rem" top="50%" transform="translateY(-50%)" zIndex={2}>
          {rightElement}
        </Box>
      )}
    </Box>
    {error && (
      <Flex align="center" gap={1.5} mt={2}>
        <Icon as={FiAlertCircle} color={THEME.COLORS.error} boxSize={4} />
        <Field.ErrorText color={THEME.COLORS.error} fontSize="sm" fontWeight="medium">
          {error}
        </Field.ErrorText>
      </Flex>
    )}
  </Field.Root>
);

// Basic password strength helper for UX feedback
const getPasswordStrength = (password: string | undefined) => {
  if (!password) return { label: 'Too short', color: 'gray.500' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', color: THEME.COLORS.error };
  if (score <= 4) return { label: 'Medium', color: THEME.COLORS.warning };
  return { label: 'Strong', color: THEME.COLORS.success };
};

// Stepper Component
const Stepper = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => {
  return (
    <Flex justify="space-between" mb={8} position="relative">
      {/* Connecting Line */}
      <Box 
        position="absolute" 
        top="14px" 
        left="0" 
        right="0" 
        h="2px" 
        bg="gray.200" 
        zIndex={0}
      />
      <Box 
        position="absolute" 
        top="14px" 
        left="0" 
        width={`${((currentStep - 1) / (steps.length - 1)) * 100}%`}
        h="2px" 
        bg={THEME.COLORS.primary}
        zIndex={0}
        transition="width 0.3s ease"
      />

      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <Flex 
            key={step} 
            direction="column" 
            align="center" 
            zIndex={1} 
            position="relative"
          >
            <Circle 
              size="30px" 
              bg={isCompleted || isActive ? THEME.COLORS.primary : "gray.200"}
              color={isCompleted || isActive ? "white" : "gray.500"}
              fontWeight="bold"
              fontSize="sm"
              mb={2}
              transition="all 0.3s ease"
              border="2px solid"
              borderColor={isActive ? `${THEME.COLORS.primary}40` : "transparent"}
              boxShadow={isActive ? "0 0 0 2px white" : "none"}
            >
              {isCompleted ? <Icon as={FiCheck} /> : stepNum}
            </Circle>
            <Text 
              fontSize="xs" 
              fontWeight={isActive ? "bold" : "medium"}
              color={isActive ? THEME.COLORS.primary : "gray.500"}
              display={{ base: 'none', md: 'block' }}
            >
              {step}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);

  const { register: registerUser } = useAuth();
  const router = useRouter();
  const toast = useCustomToast();

  const STEPS = ['Personal & Contact', 'Account Setup'];

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      profile: {
        country_code: '+254',
        user_type: 'individual',
      },
    },
  });

  const watchUserType = watch('profile.user_type');
  const watchAllFields = watch();

  // Validate current step before moving next
  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];

    switch (step) {
      case 1: // Personal & Contact Info
        fieldsToValidate = [
          'first_name',
          'last_name',
          'email',
          'profile.phone_number',
          'profile.country_code',
        ];
        break;
      case 2: // Account Setup
        fieldsToValidate = ['profile.user_type', 'password', 'password2'];
        if (watchUserType === 'business') {
          fieldsToValidate.push('profile.company_name');
        }
        break;
      default:
        return;
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: RegisterFormData) => {
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
      let phoneNumber = data.profile.phone_number.replace(/\s+/g, '').trim();
      if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1);
      }
      
      const registrationData: RegisterData = {
        ...data,
        profile: {
          ...data.profile,
          phone_number: `${data.profile.country_code}${phoneNumber}`,
        },
      };

      await registerUser(registrationData);
      toast.success('Account Created!', 'A verification link has been sent to your email.');
      // Redirect is handled by AuthContext.register function
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('Registration Failed', error?.message || 'Unable to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PublicNav />
      <Box
        as="style"
        dangerouslySetInnerHTML={{
          __html: `
            .registration-input,
            .registration-input:hover,
            .registration-input:focus {
              background-color: ${THEME.COLORS.background} !important;
              background: ${THEME.COLORS.background} !important;
            }
            .registration-input::placeholder {
              color: #718096 !important;
              opacity: 1 !important;
            }
            @media (prefers-color-scheme: dark) {
              .registration-input,
              .registration-input:hover,
              .registration-input:focus {
                background-color: ${THEME.COLORS.background} !important;
                background: ${THEME.COLORS.background} !important;
                color: ${THEME.COLORS.textPrimary} !important;
              }
            }
          `,
        }}
      />

      <Box 
        minH="calc(100vh - 70px)" 
        bg={THEME.COLORS.background}
        py={{ base: 8, md: 12 }}
      >
        <Container maxW="lg" mx="auto" px={{ base: 4, sm: 6 }} w="100%">
          <Box 
            {...THEME.CARD_STYLES}
            borderRadius="xl"
            boxShadow="md"
            p={{ base: 6, md: 10 }}
            w="100%"
          >
            {/* Header */}
            <Stack gap={2} mb={8} textAlign="center">
              <Heading fontSize="2xl" color={THEME.COLORS.primary}>
                Create Account
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Step {step} of {STEPS.length}: {STEPS[step - 1]} Information
              </Text>
            </Stack>

            {/* Stepper Visual */}
            <Stepper currentStep={step} steps={STEPS} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={6} w="100%">
                
                {/* STEP 1: PERSONAL & CONTACT INFORMATION */}
                {step === 1 && (
                  <Stack gap={5} w="100%">
                    <FormInput
                      icon={FiUser}
                      label="First Name"
                      placeholder="Enter your first name"
                      error={errors.first_name?.message}
                      isValid={!!watchAllFields.first_name}
                      register={register}
                      name="first_name"
                    />
                    <FormInput
                      icon={FiUser}
                      label="Last Name"
                      placeholder="Enter your last name"
                      error={errors.last_name?.message}
                      isValid={!!watchAllFields.last_name}
                      register={register}
                      name="last_name"
                    />
                    {/* EMAIL */}
                    <FormInput
                      icon={FiMail}
                      label="Email Address"
                      placeholder="your.email@example.com"
                      type="email"
                      error={errors.email?.message}
                      isValid={!!watchAllFields.email}
                      register={register}
                      name="email"
                    />

                    <Box>
                      <Stack direction={{ base: 'column', sm: 'row' }} gap={4}>
                        <Field.Root invalid={!!errors.profile?.country_code} w={{ base: '100%', sm: '160px' }}>
                          <Field.Label fontWeight="semibold" color="gray.700" mb={3} fontSize="sm">
                            Country Code
                          </Field.Label>
                          <Box position="relative" w="100%">
                            <Box
                              as="select"
                              {...register('profile.country_code')}
                              w="100%"
                              h="52px"
                              pl="1.25rem"
                              pr="1rem"
                              borderRadius="lg"
                              border="2px solid"
                              borderColor={errors.profile?.country_code ? THEME.COLORS.error : "gray.200"}
                              bg={THEME.COLORS.background}
                              color={THEME.COLORS.textPrimary}
                              fontSize="md"
                              className="registration-input"
                              _focus={{
                                borderColor: THEME.COLORS.primary,
                                bg: `${THEME.COLORS.background} !important`,
                                boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                                outline: "none",
                              }}
                              transition="all 0.2s"
                              cursor="pointer"
                            >
                              {COUNTRY_CODES.map((code) => (
                                <option key={code.value} value={code.value} style={{ backgroundColor: THEME.COLORS.background }}>
                                  {code.flag} {code.value}
                                </option>
                              ))}
                            </Box>
                          </Box>
                        </Field.Root>

                        <Box flex={1}>
                          <FormInput
                            icon={FiPhone}
                            label="Phone Number"
                            placeholder="e.g., 712 345 678"
                            type="tel"
                            error={errors.profile?.phone_number?.message}
                            isValid={!!watchAllFields.profile?.phone_number}
                            register={(_fieldName: string) =>
                              register('profile.phone_number', {
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                  const raw = e.target.value.replace(/\D/g, '');
                                  // Simple grouping: 3-3-rest
                                  let formatted = raw;
                                  if (raw.length > 3 && raw.length <= 6) {
                                    formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
                                  } else if (raw.length > 6) {
                                    formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
                                  }
                                  e.target.value = formatted;
                                },
                              })
                            }
                            name="profile.phone_number"
                          />
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                )}

                {/* STEP 2: ACCOUNT SETUP (TYPE + PASSWORD) */}
                {step === 2 && (
                  <Stack gap={5} w="100%">
                    <Field.Root invalid={!!errors.profile?.user_type}>
                      <Field.Label fontWeight="semibold" color="gray.700" mb={2}>
                        Select Account Type
                      </Field.Label>
                      <Stack direction={{ base: 'column', sm: 'row' }} gap={3}>
                        {USER_TYPES.map((type) => (
                          <Box
                            key={type.value}
                            as="label"
                            flex={1}
                            cursor="pointer"
                            borderRadius="md"
                            border="2px solid"
                            borderColor={watchUserType === type.value ? THEME.COLORS.primary : 'gray.200'}
                            bg={watchUserType === type.value ? THEME.COLORS.background : 'white'}
                            p={4}
                            _hover={{ 
                              borderColor: THEME.COLORS.primary,
                              bg: watchUserType === type.value ? THEME.COLORS.background : THEME.COLORS.background,
                            }}
                            transition="all 0.2s"
                          >
                            <Flex align="center" gap={3}>
                              <Box
                                w="20px"
                                h="20px"
                                borderRadius="full"
                                border="2px solid"
                                borderColor={watchUserType === type.value ? THEME.COLORS.primary : 'gray.300'}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                bg={watchUserType === type.value ? THEME.COLORS.primary : 'white'}
                              >
                                {watchUserType === type.value && (
                                  <Box w="8px" h="8px" borderRadius="full" bg="white" />
                                )}
                              </Box>
                              <input
                                type="radio"
                                value={type.value}
                                {...register('profile.user_type')}
                                style={{ display: 'none' }}
                              />
                              <Box>
                                <Flex align="center" gap={2} mb={1}>
                                  <Icon 
                                    as={type.value === 'business' ? FiBriefcase : FiUser} 
                                    color={watchUserType === type.value ? THEME.COLORS.primary : 'gray.600'}
                                  />
                                  <Text fontWeight="bold" color="gray.800">
                                    {type.label}
                                  </Text>
                                </Flex>
                                <Text fontSize="xs" color="gray.500">
                                  {type.value === 'individual' ? 'For personal use' : 'For organizations'}
                                </Text>
                              </Box>
                            </Flex>
                          </Box>
                        ))}
                      </Stack>
                    </Field.Root>

                    {/* Conditional Company Name */}
                    {watchUserType === 'business' && (
                      <Box mt={4}>
                        <FormInput
                          icon={FiBriefcase}
                          label="Company Name"
                          placeholder="Enter company name"
                          error={errors.profile?.company_name?.message}
                          isValid={!!watchAllFields.profile?.company_name}
                          register={register}
                          name="profile.company_name"
                        />
                      </Box>
                    )}

                    <FormInput
                      icon={FiLock}
                      label="Create Password"
                      placeholder="Enter a strong password"
                      type={showPassword ? 'text' : 'password'}
                      error={errors.password?.message}
                      isValid={!!watchAllFields.password}
                      register={register}
                      name="password"
                      rightElement={
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                          color={THEME.COLORS.primary}
                          _hover={{
                            bg: THEME.COLORS.background,
                            color: THEME.COLORS.primary,
                          }}
                          borderRadius="md"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      }
                    />
                    {/* Password strength indicator */}
                    <Text fontSize="sm" color={getPasswordStrength(watchAllFields.password).color}>
                      Password strength: {getPasswordStrength(watchAllFields.password).label}
                    </Text>

                    <FormInput
                      icon={FiLock}
                      label="Confirm Password"
                      placeholder="Re-enter your password"
                      type={showPassword2 ? 'text' : 'password'}
                      error={errors.password2?.message}
                      isValid={!!watchAllFields.password2 && watchAllFields.password === watchAllFields.password2}
                      register={register}
                      name="password2"
                      rightElement={
                        <IconButton
                          aria-label={showPassword2 ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword2(!showPassword2)}
                          variant="ghost"
                          size="sm"
                          color={THEME.COLORS.primary}
                          _hover={{
                            bg: THEME.COLORS.background,
                            color: THEME.COLORS.primary,
                          }}
                          borderRadius="md"
                        >
                          {showPassword2 ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      }
                    />
                  </Stack>
                )}

                {/* NAVIGATION BUTTONS */}
                <Flex gap={3} pt={4}>
                  {step > 1 && (
                    <Button
                      variant="ghost"
                      onClick={handlePrevStep} size="lg"
                      w="50%"
                      color="gray.600"
                      _hover={{
                        bg: THEME.COLORS.background,
                        color: THEME.COLORS.primary,
                      }}
                    >
                      Back
                    </Button>
                  )}
                  
                  {step < STEPS.length ? (
                    <Button
                      onClick={handleNextStep}
                      {...THEME.BUTTON_STYLES.primaryButton}
                      size="lg"
                      w={step === 1 ? "100%" : "50%"} >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      {...THEME.BUTTON_STYLES.primaryButton}
                      size="lg"
                      w="50%"
                      disabled={isSubmitting} >
                      Complete
                    </Button>
                  )}
                </Flex>

              </Stack>
            </form>

            {/* Footer Login Link */}
            <Flex 
              justify="center" 
              align="center" 
              mt={8} 
              pt={5} 
              borderTop="1px solid"
              borderColor="gray.200"
            >
              <Text fontSize="sm" color="gray.600">
                Already have an account?{' '}
                <Link href={ROUTES.PUBLIC.LOGIN}>
                  <Box 
                    as="span"
                    color={THEME.COLORS.primary}
                    fontWeight="bold"
                    _hover={{ 
                      textDecoration: 'underline',
                      color: THEME.COLORS.primary,
                      opacity: 0.8,
                    }}
                    transition="all 0.2s"
                    cursor="pointer"
                  >
                    Login here →
                  </Box>
                </Link>
              </Text>
            </Flex>
          </Box>
        </Container>
      </Box>
    </>
  );
}