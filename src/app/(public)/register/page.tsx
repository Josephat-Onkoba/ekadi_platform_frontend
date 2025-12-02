'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Input,
  Button,
  Field,
  Icon,
  Flex,
  Circle,
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
  FiCheck
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import useCustomToast from '@/src/hooks/useToast';
import { ROUTES, COUNTRY_CODES, USER_TYPES, THEME } from '@/src/lib/constants';
import { RegisterData } from '@/src/types';
import { IconType } from 'react-icons';
import { checkEmailAvailability, checkPhoneAvailability } from '@/src/lib/auth';

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
  isTouched?: boolean;
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
  isTouched,
  type = 'text',
  register,
  name,
  rightElement,
}: FormInputProps) => {
  // Only show error if user has interacted with the field
  const showError = isTouched && error;
  
  return (
    <Field.Root invalid={!!showError} w="100%">
      <Field.Label fontWeight="semibold" color="gray.700" mb={2} fontSize="sm">
        {label}
      </Field.Label>
      <Box position="relative" w="100%">
        <Input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          h="46px"
          pl="1rem"
          pr={rightElement && isValid && !error && isTouched ? "5.5rem" : rightElement ? "3rem" : isValid && !error ? "3rem" : "1rem"}
          borderRadius="lg"
          border="2px solid"
          borderColor={showError ? THEME.COLORS.error : "gray.200"}
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
            bg: THEME.COLORS.background,
            boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
          }}
          _hover={{
            borderColor: showError ? THEME.COLORS.error : THEME.COLORS.primary,
          }}
          transition="all 0.2s"
        />
        {isValid && !error && isTouched && (
          <Box
            position="absolute"
            right={rightElement ? "3rem" : "0.75rem"}
            top="50%"
            transform="translateY(-50%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="20px"
            h="20px"
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
      {showError && (
        <Flex align="center" gap={1.5} mt={1.5}>
          <Icon as={FiAlertCircle} color={THEME.COLORS.error} boxSize={3.5} />
          <Field.ErrorText color={THEME.COLORS.error} fontSize="xs" fontWeight="medium">
            {error}
          </Field.ErrorText>
        </Flex>
      )}
    </Field.Root>
  );
};

// Password strength helper with strength bar
const getPasswordStrength = (password: string | undefined) => {
  if (!password || password.length === 0) return { label: '', color: 'gray.300', score: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 8) return { label: 'Too short', color: THEME.COLORS.error, score: 1 };
  if (score <= 3) return { label: 'Weak', color: THEME.COLORS.error, score: 2 };
  if (score <= 4) return { label: 'Medium', color: THEME.COLORS.warning, score: 3 };
  return { label: 'Strong', color: THEME.COLORS.success, score: 4 };
};

// Password Strength Bar Component
const PasswordStrengthBar = ({ password }: { password: string | undefined }) => {
  const strength = getPasswordStrength(password);
  
  // Don't show if no password entered
  if (!password || password.length === 0) return null;
  
  return (
    <Box mt={2}>
      <Flex gap={1} mb={1.5}>
        {[1, 2, 3, 4].map((level) => (
          <Box
            key={level}
            flex={1}
            h="4px"
            borderRadius="full"
            bg={level <= strength.score ? strength.color : 'gray.200'}
            transition="all 0.3s"
          />
        ))}
      </Flex>
      <Text fontSize="xs" color={strength.color} fontWeight="medium">
        Password strength: {strength.label}
      </Text>
    </Box>
  );
};

// Stepper Component
const Stepper = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => {
  return (
    <Flex justify="space-between" mb={6} position="relative">
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
              size="28px" 
              bg={isCompleted || isActive ? THEME.COLORS.primary : "gray.200"}
              color={isCompleted || isActive ? "white" : "gray.500"}
              fontWeight="bold"
              fontSize="xs"
              mb={1.5}
              transition="all 0.3s ease"
              border="2px solid"
              borderColor={isActive ? `${THEME.COLORS.primary}40` : "transparent"}
              boxShadow={isActive ? "0 0 0 2px white" : "none"}
            >
              {isCompleted ? <Icon as={FiCheck} boxSize={3} /> : stepNum}
            </Circle>
            <Text 
              fontSize="xs" 
              fontWeight={isActive ? "bold" : "medium"}
              color={isActive ? THEME.COLORS.primary : "gray.500"}
              display={{ base: 'none', sm: 'block' }}
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
  
  // Real-time availability check states
  const [emailAvailability, setEmailAvailability] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: '' });
  
  const [phoneAvailability, setPhoneAvailability] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: '' });
  
  // Debounce refs
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const phoneCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { register: registerUser } = useAuth();
  const router = useRouter();
  const toast = useCustomToast();

  const STEPS = ['Personal & Contact', 'Account Setup'];

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, touchedFields },
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
  const watchPassword = watch('password');
  const watchEmail = watch('email');
  const watchPhoneNumber = watch('profile.phone_number');
  const watchCountryCode = watch('profile.country_code');

  // Debounced email availability check
  const checkEmail = useCallback(async (email: string) => {
    if (!email || email.length < 5 || !email.includes('@')) {
      setEmailAvailability({ checking: false, available: null, message: '' });
      return;
    }

    setEmailAvailability({ checking: true, available: null, message: '' });
    
    try {
      const result = await checkEmailAvailability(email);
      setEmailAvailability({
        checking: false,
        available: result.available,
        message: result.message,
      });
    } catch (error) {
      setEmailAvailability({ checking: false, available: null, message: '' });
    }
  }, []);

  // Debounced phone availability check
  const checkPhone = useCallback(async (phoneNumber: string, countryCode: string) => {
    // Clean phone number
    let cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    if (!cleanPhone || cleanPhone.length < 4) {
      setPhoneAvailability({ checking: false, available: null, message: '' });
      return;
    }

    const fullPhone = `${countryCode}${cleanPhone}`;
    setPhoneAvailability({ checking: true, available: null, message: '' });
    
    try {
      const result = await checkPhoneAvailability(fullPhone);
      setPhoneAvailability({
        checking: false,
        available: result.available,
        message: result.message,
      });
    } catch (error) {
      setPhoneAvailability({ checking: false, available: null, message: '' });
    }
  }, []);

  // Effect for debounced email check
  useEffect(() => {
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    if (watchEmail && watchEmail.includes('@') && touchedFields.email) {
      emailCheckTimeoutRef.current = setTimeout(() => {
        checkEmail(watchEmail);
      }, 500); // 500ms debounce
    }

    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, [watchEmail, checkEmail, touchedFields.email]);

  // Effect for debounced phone check
  useEffect(() => {
    if (phoneCheckTimeoutRef.current) {
      clearTimeout(phoneCheckTimeoutRef.current);
    }

    if (watchPhoneNumber && touchedFields.profile?.phone_number) {
      phoneCheckTimeoutRef.current = setTimeout(() => {
        checkPhone(watchPhoneNumber, watchCountryCode || '+254');
      }, 500); // 500ms debounce
    }

    return () => {
      if (phoneCheckTimeoutRef.current) {
        clearTimeout(phoneCheckTimeoutRef.current);
      }
    };
  }, [watchPhoneNumber, watchCountryCode, checkPhone, touchedFields.profile?.phone_number]);

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
    
    // For step 1, also check email and phone availability
    if (step === 1 && isStepValid) {
      // Check if still checking availability
      if (emailAvailability.checking || phoneAvailability.checking) {
        toast.warning('Please wait', 'Checking email and phone availability...');
        return;
      }
      
      // Check if email is taken
      if (emailAvailability.available === false) {
        toast.error('Email Already Registered', emailAvailability.message);
        return;
      }
      
      // Check if phone is taken
      if (phoneAvailability.available === false) {
        toast.error('Phone Number Already Registered', phoneAvailability.message);
        return;
      }
      
      // If we haven't checked yet, trigger a check now
      if (emailAvailability.available === null && watchEmail) {
        await checkEmail(watchEmail);
        // Wait a bit for the result
        await new Promise(resolve => setTimeout(resolve, 600));
        if (emailAvailability.available === false) {
          toast.error('Email Already Registered', emailAvailability.message);
          return;
        }
      }
      
      if (phoneAvailability.available === null && watchPhoneNumber) {
        await checkPhone(watchPhoneNumber, watchCountryCode || '+254');
        await new Promise(resolve => setTimeout(resolve, 600));
        if (phoneAvailability.available === false) {
          toast.error('Phone Number Already Registered', phoneAvailability.message);
          return;
        }
      }
    }
    
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
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
      
    } catch (error: any) {
      // Extract error message from various possible formats
      let errorMessage = 'Unable to create account';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.detail) {
        errorMessage = error.detail;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error('Registration Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password toggle button component
  const PasswordToggleButton = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <Button
      type="button"
      onClick={onToggle}
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
      <Icon as={show ? FiEyeOff : FiEye} boxSize={5} />
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
      <Container maxW="520px" mx="auto" w="100%">
        <Box 
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          p={{ base: 6, sm: 8 }}
          w="100%"
        >
          {/* Header */}
          <Stack gap={1} mb={6} textAlign="center">
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
            <Heading fontSize="xl" color="gray.800" fontWeight="bold">
              Create Account
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Step {step} of {STEPS.length}: {STEPS[step - 1]}
            </Text>
          </Stack>

          {/* Stepper Visual */}
          <Stepper currentStep={step} steps={STEPS} />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4} w="100%">
              
              {/* STEP 1: PERSONAL & CONTACT INFORMATION */}
              {step === 1 && (
                <Stack gap={4} w="100%">
                  <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                    <FormInput
                      icon={FiUser}
                      label="First Name"
                      placeholder="John"
                      error={errors.first_name?.message}
                      isValid={!!watchAllFields.first_name && !errors.first_name}
                      isTouched={touchedFields.first_name}
                      register={register}
                      name="first_name"
                    />
                    <FormInput
                      icon={FiUser}
                      label="Last Name"
                      placeholder="Doe"
                      error={errors.last_name?.message}
                      isValid={!!watchAllFields.last_name && !errors.last_name}
                      isTouched={touchedFields.last_name}
                      register={register}
                      name="last_name"
                    />
                  </Flex>
                  
                  <Field.Root 
                    invalid={!!(errors.email?.message || (emailAvailability.available === false && touchedFields.email))} 
                    w="100%"
                  >
                    <Field.Label fontWeight="semibold" color="gray.700" mb={2} fontSize="sm">
                      Email Address
                    </Field.Label>
                    <Box position="relative" w="100%">
                      <Input
                        type="email"
                        {...register('email')}
                        placeholder="john.doe@example.com"
                        h="46px"
                        pl="1rem"
                        pr="3rem"
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={
                          errors.email?.message || emailAvailability.available === false 
                            ? THEME.COLORS.error 
                            : emailAvailability.available === true 
                              ? THEME.COLORS.success 
                              : "gray.200"
                        }
                        bg={THEME.COLORS.background}
                        color={THEME.COLORS.textPrimary}
                        fontSize="md"
                        className="registration-input"
                        _placeholder={{ color: "gray.500", opacity: 1 }}
                        _focus={{
                          borderColor: THEME.COLORS.primary,
                          bg: THEME.COLORS.background,
                          boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                        }}
                        _hover={{
                          borderColor: errors.email?.message || emailAvailability.available === false 
                            ? THEME.COLORS.error 
                            : THEME.COLORS.primary,
                        }}
                        transition="all 0.2s"
                      />
                      {/* Status indicator */}
                      <Box
                        position="absolute"
                        right="0.75rem"
                        top="50%"
                        transform="translateY(-50%)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        pointerEvents="none"
                        zIndex={2}
                      >
                        {emailAvailability.checking && (
                          <Box
                            w="16px"
                            h="16px"
                            borderRadius="full"
                            border="2px solid"
                            borderColor={THEME.COLORS.primary}
                            borderTopColor="transparent"
                            animation="spin 1s linear infinite"
                            css={{ '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }}
                          />
                        )}
                        {!emailAvailability.checking && emailAvailability.available === true && touchedFields.email && (
                          <Icon as={FiCheckCircle} color={THEME.COLORS.success} boxSize={5} />
                        )}
                        {!emailAvailability.checking && emailAvailability.available === false && touchedFields.email && (
                          <Icon as={FiAlertCircle} color={THEME.COLORS.error} boxSize={5} />
                        )}
                      </Box>
                    </Box>
                    {/* Error messages */}
                    {touchedFields.email && (errors.email?.message || emailAvailability.available === false) && (
                      <Flex align="center" gap={1.5} mt={1.5}>
                        <Icon as={FiAlertCircle} color={THEME.COLORS.error} boxSize={3.5} />
                        <Field.ErrorText color={THEME.COLORS.error} fontSize="xs" fontWeight="medium">
                          {errors.email?.message || emailAvailability.message}
                        </Field.ErrorText>
                      </Flex>
                    )}
                  </Field.Root>

                  <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
                    <Field.Root invalid={!!errors.profile?.country_code} w={{ base: '100%', sm: '140px' }}>
                      <Field.Label fontWeight="semibold" color="gray.700" mb={2} fontSize="sm">
                        Code
                      </Field.Label>
                      <Box
                        as="select"
                        {...register('profile.country_code')}
                        w="100%"
                        h="46px"
                        pl="0.75rem"
                        pr="0.5rem"
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={errors.profile?.country_code ? THEME.COLORS.error : "gray.200"}
                        bg={THEME.COLORS.background}
                        color={THEME.COLORS.textPrimary}
                        fontSize="sm"
                        className="registration-input"
                        _focus={{
                          borderColor: THEME.COLORS.primary,
                          boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                          outline: "none",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                      >
                        {COUNTRY_CODES.map((code) => (
                          <option key={code.value} value={code.value} style={{ backgroundColor: '#fff' }}>
                            {code.flag} {code.value}
                          </option>
                        ))}
                      </Box>
                    </Field.Root>

                    <Box flex={1}>
                      <Field.Root 
                        invalid={!!(errors.profile?.phone_number?.message || (phoneAvailability.available === false && touchedFields.profile?.phone_number))} 
                        w="100%"
                      >
                        <Field.Label fontWeight="semibold" color="gray.700" mb={2} fontSize="sm">
                          Phone Number
                        </Field.Label>
                        <Box position="relative" w="100%">
                          <Input
                            type="tel"
                            {...register('profile.phone_number', {
                              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                const raw = e.target.value.replace(/\D/g, '');
                                let formatted = raw;
                                if (raw.length > 3 && raw.length <= 6) {
                                  formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
                                } else if (raw.length > 6) {
                                  formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
                                }
                                e.target.value = formatted;
                              },
                            })}
                            placeholder="712 345 678"
                            h="46px"
                            pl="1rem"
                            pr="3rem"
                            borderRadius="lg"
                            border="2px solid"
                            borderColor={
                              errors.profile?.phone_number?.message || phoneAvailability.available === false 
                                ? THEME.COLORS.error 
                                : phoneAvailability.available === true 
                                  ? THEME.COLORS.success 
                                  : "gray.200"
                            }
                            bg={THEME.COLORS.background}
                            color={THEME.COLORS.textPrimary}
                            fontSize="md"
                            className="registration-input"
                            _placeholder={{ color: "gray.500", opacity: 1 }}
                            _focus={{
                              borderColor: THEME.COLORS.primary,
                              bg: THEME.COLORS.background,
                              boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                            }}
                            _hover={{
                              borderColor: errors.profile?.phone_number?.message || phoneAvailability.available === false 
                                ? THEME.COLORS.error 
                                : THEME.COLORS.primary,
                            }}
                            transition="all 0.2s"
                          />
                          {/* Status indicator */}
                          <Box
                            position="absolute"
                            right="0.75rem"
                            top="50%"
                            transform="translateY(-50%)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            pointerEvents="none"
                            zIndex={2}
                          >
                            {phoneAvailability.checking && (
                              <Box
                                w="16px"
                                h="16px"
                                borderRadius="full"
                                border="2px solid"
                                borderColor={THEME.COLORS.primary}
                                borderTopColor="transparent"
                                animation="spin 1s linear infinite"
                                css={{ '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }}
                              />
                            )}
                            {!phoneAvailability.checking && phoneAvailability.available === true && touchedFields.profile?.phone_number && (
                              <Icon as={FiCheckCircle} color={THEME.COLORS.success} boxSize={5} />
                            )}
                            {!phoneAvailability.checking && phoneAvailability.available === false && touchedFields.profile?.phone_number && (
                              <Icon as={FiAlertCircle} color={THEME.COLORS.error} boxSize={5} />
                            )}
                          </Box>
                        </Box>
                        {/* Error messages */}
                        {touchedFields.profile?.phone_number && (errors.profile?.phone_number?.message || phoneAvailability.available === false) && (
                          <Flex align="center" gap={1.5} mt={1.5}>
                            <Icon as={FiAlertCircle} color={THEME.COLORS.error} boxSize={3.5} />
                            <Field.ErrorText color={THEME.COLORS.error} fontSize="xs" fontWeight="medium">
                              {errors.profile?.phone_number?.message || phoneAvailability.message}
                            </Field.ErrorText>
                          </Flex>
                        )}
                      </Field.Root>
                    </Box>
                  </Flex>
                </Stack>
              )}

              {/* STEP 2: ACCOUNT SETUP (TYPE + PASSWORD) */}
              {step === 2 && (
                <Stack gap={4} w="100%">
                  <Field.Root invalid={!!errors.profile?.user_type}>
                    <Field.Label fontWeight="semibold" color="gray.700" mb={2} fontSize="sm">
                      Account Type
                    </Field.Label>
                    <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
                      {USER_TYPES.map((type) => (
                        <Box
                          key={type.value}
                          as="label"
                          flex={1}
                          cursor="pointer"
                          borderRadius="lg"
                          border="2px solid"
                          borderColor={watchUserType === type.value ? THEME.COLORS.primary : 'gray.200'}
                          bg={watchUserType === type.value ? `${THEME.COLORS.primary}08` : 'white'}
                          p={3}
                          _hover={{ 
                            borderColor: THEME.COLORS.primary,
                          }}
                          transition="all 0.2s"
                        >
                          <Flex align="center" gap={3}>
                            <Box
                              w="18px"
                              h="18px"
                              borderRadius="full"
                              border="2px solid"
                              borderColor={watchUserType === type.value ? THEME.COLORS.primary : 'gray.300'}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              bg={watchUserType === type.value ? THEME.COLORS.primary : 'white'}
                              flexShrink={0}
                            >
                              {watchUserType === type.value && (
                                <Box w="6px" h="6px" borderRadius="full" bg="white" />
                              )}
                            </Box>
                            <input
                              type="radio"
                              value={type.value}
                              {...register('profile.user_type')}
                              style={{ display: 'none' }}
                            />
                            <Flex align="center" gap={2}>
                              <Icon 
                                as={type.value === 'business' ? FiBriefcase : FiUser} 
                                color={watchUserType === type.value ? THEME.COLORS.primary : 'gray.500'}
                                boxSize={4}
                              />
                              <Text fontWeight="semibold" color="gray.700" fontSize="sm">
                                {type.label}
                              </Text>
                            </Flex>
                          </Flex>
                        </Box>
                      ))}
                    </Flex>
                  </Field.Root>

                  {/* Conditional Company Name */}
                  {watchUserType === 'business' && (
                    <FormInput
                      icon={FiBriefcase}
                      label="Company Name"
                      placeholder="Your company name"
                      error={errors.profile?.company_name?.message}
                      isValid={!!watchAllFields.profile?.company_name && !errors.profile?.company_name}
                      isTouched={touchedFields.profile?.company_name}
                      register={register}
                      name="profile.company_name"
                    />
                  )}

                  <Box>
                    <FormInput
                      icon={FiLock}
                      label="Password"
                      placeholder="Create a strong password"
                      type={showPassword ? 'text' : 'password'}
                      error={touchedFields.password ? errors.password?.message : undefined}
                      isValid={!!watchAllFields.password && !errors.password}
                      isTouched={touchedFields.password}
                      register={register}
                      name="password"
                      rightElement={
                        <PasswordToggleButton 
                          show={showPassword} 
                          onToggle={() => setShowPassword(!showPassword)} 
                        />
                      }
                    />
                    <PasswordStrengthBar password={watchPassword} />
                  </Box>

                  <FormInput
                    icon={FiLock}
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    type={showPassword2 ? 'text' : 'password'}
                    error={touchedFields.password2 ? errors.password2?.message : undefined}
                    isValid={!!watchAllFields.password2 && watchAllFields.password === watchAllFields.password2 && !errors.password2}
                    isTouched={touchedFields.password2}
                    register={register}
                    name="password2"
                    rightElement={
                      <PasswordToggleButton 
                        show={showPassword2} 
                        onToggle={() => setShowPassword2(!showPassword2)} 
                      />
                    }
                  />
                </Stack>
              )}

              {/* NAVIGATION BUTTONS */}
              <Flex gap={3} pt={2}>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    size="lg"
                    h="48px"
                    flex={1}
                    color="gray.600"
                    borderColor="gray.300"
                    _hover={{
                      bg: 'gray.50',
                      borderColor: THEME.COLORS.primary,
                      color: THEME.COLORS.primary,
                    }}
                    fontWeight="semibold"
                  >
                    Back
                  </Button>
                )}
                
                {step < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    {...THEME.BUTTON_STYLES.primaryButton}
                    size="lg"
                    h="48px"
                    flex={step === 1 ? 1 : 1}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    {...THEME.BUTTON_STYLES.primaryButton}
                    size="lg"
                    h="48px"
                    flex={1}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </Flex>

            </Stack>
          </form>

          {/* Footer Login Link */}
          <Flex 
            justify="center" 
            align="center" 
            mt={6} 
            pt={4} 
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
                  }}
                  cursor="pointer"
                >
                  Login
                </Box>
              </Link>
            </Text>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
