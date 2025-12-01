/**
 * Edit Profile Page
 * 
 * Allows users to edit their profile information including:
 * - Name and contact information
 * - Profile picture upload
 * - Account type and company name
 * - Bio
 * 
 * @module EditProfilePage
 */

'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Input,
  Button,
  Avatar,
  Textarea,
  Flex,
  Field,
} from '@chakra-ui/react';
import { 
  FiUpload, 
  FiSave, 
  FiX,
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import useCustomToast from '@/src/hooks/useToast';
import AuthNav from '@/src/components/layout/AuthNav';
import Footer from '@/src/components/layout/Footer';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import { ROUTES, THEME, COUNTRY_CODES, USER_TYPES } from '@/src/lib/constants';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const editProfileSchema = z
  .object({
    first_name: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters'),
    last_name: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters'),
    profile: z.object({
      country_code: z.string().min(1, 'Country code is required'),
      phone_number: z
        .string()
        .min(1, 'Phone number is required')
        .min(10, 'Phone number must be at least 10 characters'),
      user_type: z.enum(['individual', 'business'], {
        required_error: 'Please select an account type',
      }),
      company_name: z.string().optional(),
      bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
    }),
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

type EditProfileFormData = z.infer<typeof editProfileSchema>;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Edit Profile Page Component
 * 
 * Form for editing user profile information
 * 
 * @returns Edit profile page component
 */
export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const toast = useCustomToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      profile: {
        country_code: user?.profile?.country_code || '+254',
        phone_number: user?.profile?.phone_number || '',
        user_type: user?.profile?.user_type || 'individual',
        company_name: user?.profile?.company_name || '',
        bio: user?.profile?.bio || '',
      },
    },
  });

  const watchUserType = watch('profile.user_type');
  const watchBio = watch('profile.bio');

  /**
   * Handle file selection for profile picture
   */
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, etc.)',
        type: 'error',
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        type: 'error',
      });
      return;
    }

    // Set file and create preview
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle form submission
   */
  const onSubmit = async (data: EditProfileFormData) => {
    setIsSubmitting(true);

    try {
      if (selectedFile) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('profile[country_code]', data.profile.country_code);
        formData.append('profile[phone_number]', data.profile.phone_number);
        formData.append('profile[user_type]', data.profile.user_type);
        if (data.profile.company_name) {
          formData.append('profile[company_name]', data.profile.company_name);
        }
        if (data.profile.bio) {
          formData.append('profile[bio]', data.profile.bio);
        }
        formData.append('profile_picture', selectedFile);

        // Note: You'll need to update the API endpoint to accept FormData
        // For now, we'll call updateUser with the data object
        // In a real implementation, you'd make a separate API call for file upload
        await updateUser({
          first_name: data.first_name,
          last_name: data.last_name,
          profile: {
            country_code: data.profile.country_code,
            phone_number: data.profile.phone_number,
            user_type: data.profile.user_type,
            company_name: data.profile.company_name,
            bio: data.profile.bio,
          },
        });
      } else {
        // Update without file
        await updateUser({
          first_name: data.first_name,
          last_name: data.last_name,
          profile: {
            country_code: data.profile.country_code,
            phone_number: data.profile.phone_number,
            user_type: data.profile.user_type,
            company_name: data.profile.company_name,
            bio: data.profile.bio,
          },
        });
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        type: 'success',
      });

      router.push(ROUTES.PROTECTED.PROFILE);
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error?.message || 'Failed to update profile. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <>
        <AuthNav />

        <Box as="main" minH="calc(100vh - 140px)" bg={THEME.COLORS.background}>
          {/* PAGE HEADER */}
          <Box bg="white" borderBottom="1px" borderColor="gray.200" py={6}>
            <Container maxW="container.xl">
              <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                <Heading fontSize="2xl" color={THEME.COLORS.primary} fontWeight="bold">
                  Edit Profile
                </Heading>
                <Link href={ROUTES.PROTECTED.PROFILE}>
                  <Button
                    {...THEME.BUTTON_STYLES.secondaryButton}
                    variant="ghost"
                  >
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      mr={2}
                    >
                      <FiX size={18} />
                    </Box>
                    Cancel
                  </Button>
                </Link>
              </Flex>
            </Container>
          </Box>

          {/* MAIN CONTENT */}
          <Container maxW="container.md" py={8}>
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              p={8}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={6}>
                  {/* PROFILE PICTURE SECTION */}
                  <Stack gap={4} align="center">
                    <Avatar.Root size="2xl">
                      <Avatar.Image
                        src={previewImage || user?.profile?.profile_picture || undefined}
                      />
                      <Avatar.Fallback
                        bg={THEME.COLORS.primary}
                        border="4px solid"
                        borderColor={THEME.COLORS.background}
                      >
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      display="none"
                    />

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      {...THEME.BUTTON_STYLES.secondaryButton}
                      variant="outline"
                      size="sm"
                    >
                      <Box
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        mr={2}
                      >
                        <FiUpload size={16} />
                      </Box>
                      Change Photo
                    </Button>

                    <Text fontSize="xs" color="gray.500">
                      Max file size: 5MB. JPG, PNG only.
                    </Text>
                  </Stack>

                  {/* NAME FIELDS */}
                  <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                    {/* FIRST NAME */}
                    <Field.Root invalid={!!errors.first_name} flex={1}>
                      <Field.Label fontWeight="semibold" color="gray.700" mb={2}>
                        First Name
                      </Field.Label>
                      <Input
                        _focus={{
                          borderColor: THEME.COLORS.primary,
                          boxShadow: `0 0 0 1px ${THEME.COLORS.primary}`,
                        }}
                        borderRadius="md"
                        border="2px solid"
                        borderColor={errors.first_name ? 'red.300' : 'gray.200'}
                        {...register('first_name')}
                      />
                      <Field.ErrorText>
                        {errors.first_name?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    {/* LAST NAME */}
                    <Field.Root invalid={!!errors.last_name} flex={1}>
                      <Field.Label fontWeight="semibold" color="gray.700" mb={2}>
                        Last Name
                      </Field.Label>
                      <Input
                        _focus={{
                          borderColor: THEME.COLORS.primary,
                          boxShadow: `0 0 0 1px ${THEME.COLORS.primary}`,
                        }}
                        borderRadius="md"
                        border="2px solid"
                        borderColor={errors.last_name ? 'red.300' : 'gray.200'}
                        {...register('last_name')}
                      />
                      <Field.ErrorText>
                        {errors.last_name?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </Stack>

                  {/* PHONE SECTION */}
                  <Stack direction="row" gap={4}>
                    {/* COUNTRY CODE */}
                    <Field.Root invalid={!!errors.profile?.country_code} w="40%">
                      <Field.Label fontWeight="semibold" color="gray.700" mb={2}>
                        Code
                      </Field.Label>
                      <Box
                        as="select"
                        {...register('profile.country_code')}
                        w="100%"
                        h="48px"
                        pl="1rem"
                        pr="1rem"
                        borderRadius="md"
                        border="2px solid"
                        borderColor={errors.profile?.country_code ? 'red.300' : 'gray.200'}
                        bg={THEME.COLORS.background}
                        color="gray.800"
                        fontSize="md"
                        _focus={{
                          borderColor: THEME.COLORS.primary,
                          boxShadow: `0 0 0 1px ${THEME.COLORS.primary}`,
                          outline: 'none',
                        }}
                      >
                        {COUNTRY_CODES.map((code) => (
                          <option key={code.value} value={code.value}>
                            {code.flag} {code.label}
                          </option>
                        ))}
                      </Box>
                      <Field.ErrorText>
                        {errors.profile?.country_code?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    {/* PHONE NUMBER */}
                    <Field.Root invalid={!!errors.profile?.phone_number} flex={1}>
                      <Field.Label fontWeight="semibold" color="gray.700" mb={2}>
                        Phone Number
                      </Field.Label>
                      <Input
                        type="tel"
                        placeholder="712345678"
                        _focus={{
                          borderColor: THEME.COLORS.primary,
                          boxShadow: `0 0 0 1px ${THEME.COLORS.primary}`,
                        }}
                        borderRadius="md"
                        border="2px solid"
                        borderColor={errors.profile?.phone_number ? 'red.300' : 'gray.200'}
                        {...register('profile.phone_number')}
                      />
                      <Field.ErrorText>
                        {errors.profile?.phone_number?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </Stack>

                  {/* USER TYPE */}
                  <Field.Root invalid={!!errors.profile?.user_type}>
                    <Field.Label fontWeight="semibold" color="gray.700" mb={2}>
                      Account Type
                    </Field.Label>
                    <Stack direction={{ base: 'column', sm: 'row' }} gap={3} mt={2}>
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
                            bg: THEME.COLORS.background,
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
                            <Text fontWeight="semibold" color="gray.800">
                              {type.label}
                            </Text>
                          </Flex>
                        </Box>
                      ))}
                    </Stack>
                    <Field.ErrorText>
                      {errors.profile?.user_type?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  {/* COMPANY NAME (conditional) */}
                  {watchUserType === 'business' && (
                    <Field.Root invalid={!!errors.profile?.company_name}>
                      <Field.Label fontWeight="semibold" color="gray.700" mb={2}>
                        Company Name
                      </Field.Label>
                      <Input
                        _focus={{
                          borderColor: THEME.COLORS.primary,
                          boxShadow: `0 0 0 1px ${THEME.COLORS.primary}`,
                        }}
                        borderRadius="md"
                        border="2px solid"
                        borderColor={errors.profile?.company_name ? 'red.300' : 'gray.200'}
                        {...register('profile.company_name')}
                      />
                      <Field.ErrorText>
                        {errors.profile?.company_name?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  )}

                  {/* BIO */}
                  <Field.Root invalid={!!errors.profile?.bio}>
                    <Field.Label fontWeight="semibold" color="gray.700" mb={2}>
                      Bio
                    </Field.Label>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      rows={4}
                      _focus={{
                        borderColor: THEME.COLORS.primary,
                        boxShadow: `0 0 0 1px ${THEME.COLORS.primary}`,
                      }}
                      borderRadius="md"
                      border="2px solid"
                      borderColor={errors.profile?.bio ? 'red.300' : 'gray.200'}
                      {...register('profile.bio')}
                    />
                    <Flex justify="space-between" align="center" mt={1}>
                      <Field.ErrorText>
                        {errors.profile?.bio?.message}
                      </Field.ErrorText>
                      <Text fontSize="xs" color="gray.500">
                        {watchBio?.length || 0}/500 characters
                      </Text>
                    </Flex>
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
                      Your email cannot be changed. Contact support if you need to update it.
                    </Text>
                  </Box>

                  {/* ACTION BUTTONS */}
                  <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="Saving..."
                      flex="1"
                      {...THEME.BUTTON_STYLES.primaryButton}
                    >
                      <Box
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        mr={2}
                      >
                        <FiSave size={18} />
                      </Box>
                      Save Changes
                    </Button>
                    <Link href={ROUTES.PROTECTED.PROFILE} style={{ flex: 1 }}>
                      <Button
                        flex="1"
                        w="full"
                        {...THEME.BUTTON_STYLES.secondaryButton}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </Link>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Container>
        </Box>

        <Footer />
      </>
    </ProtectedRoute>
  );
}

