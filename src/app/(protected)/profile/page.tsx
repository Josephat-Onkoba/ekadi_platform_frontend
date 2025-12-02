/**
 * User Profile View Page
 * 
 * Displays the authenticated user's profile information including:
 * - Profile picture and basic info
 * - Contact information
 * - Account details
 * - Account status badges
 * 
 * @module ProfilePage
 */

'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Avatar,
  Badge,
  Flex,
  Button,
  Separator,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
} from '@chakra-ui/react';
import { 
  FiMail, 
  FiPhone, 
  FiBriefcase, 
  FiUser, 
  FiCalendar, 
  FiEdit,
} from 'react-icons/fi';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/src/contexts/AuthContext';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import { ROUTES, THEME } from '@/src/lib/constants';
import { format } from 'date-fns';

const AuthNav = dynamic(() => import('@/src/components/layout/AuthNav'), {
  ssr: false,
});

const Footer = dynamic(() => import('@/src/components/layout/Footer'), {
  ssr: false,
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date string to readable format
 * 
 * @param dateString - ISO date string
 * @returns Formatted date string or "N/A" if invalid
 */
function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'N/A';
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Profile Page Component
 * 
 * Displays user profile information in a well-organized layout
 * 
 * @returns Profile page component
 */
export default function ProfilePage() {
  const { user, loading } = useAuth();

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
                  My Profile
                </Heading>
                <Link href={ROUTES.PROTECTED.EDIT_PROFILE}>
                  <Button {...THEME.BUTTON_STYLES.primaryButton}>
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      mr={2}
                    >
                      <FiEdit size={18} />
                    </Box>
                    Edit Profile
                  </Button>
                </Link>
              </Flex>
            </Container>
          </Box>

          {/* MAIN CONTENT */}
          <Container maxW="container.lg" py={8}>
            <Stack gap={6}>
              {/* PROFILE HEADER CARD */}
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                p={8}
              >
                <Stack gap={6}>
                  {/* AVATAR & NAME */}
                  <Flex align="center" gap={6} flexWrap="wrap">
                    {loading ? (
                      <>
                        <SkeletonCircle size="24" />
                        <Stack gap={2} flex="1" minW="200px">
                          <Skeleton height="28px" width="60%" />
                          <Skeleton height="20px" width="40%" />
                          <Skeleton height="18px" width="30%" />
                        </Stack>
                      </>
                    ) : (
                      <>
                        <Avatar.Root size="2xl">
                          <Avatar.Image 
                            src={user?.profile?.profile_picture || undefined}
                          />
                          <Avatar.Fallback 
                            bg={THEME.COLORS.primary}
                            border="4px solid"
                            borderColor={THEME.COLORS.background}
                          >
                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                          </Avatar.Fallback>
                        </Avatar.Root>

                        <Stack gap={2} flex="1" minW="200px">
                          <Flex align="center" gap={3} flexWrap="wrap">
                            <Heading fontSize="3xl" color={THEME.COLORS.primary} fontWeight="bold">
                              {user?.first_name || ''} {user?.last_name || ''}
                            </Heading>
                            {user?.profile?.user_type && (
                              <Badge
                                colorScheme={user.profile.user_type === 'business' ? 'purple' : 'green'}
                                fontSize="sm"
                                px={3}
                                py={1}
                                borderRadius="full"
                              >
                                {user.profile.user_type === 'business' ? 'Business' : 'Individual'}
                              </Badge>
                            )}
                          </Flex>

                          {user?.profile?.company_name && (
                            <Flex align="center" gap={2} color="gray.600">
                              <Box as="span" display="inline-flex" alignItems="center">
                                <FiBriefcase size={16} />
                              </Box>
                              <Text fontSize="lg">
                                {user.profile.company_name}
                              </Text>
                            </Flex>
                          )}

                          <Flex align="center" gap={2}>
                            <Badge
                              colorScheme={user?.email_verified ? 'green' : 'yellow'}
                              variant="subtle"
                            >
                              {user?.email_verified ? '✓ Verified' : '⚠ Not Verified'}
                            </Badge>
                          </Flex>
                        </Stack>
                      </>
                    )}
                  </Flex>

                  {/* BIO (if exists) */}
                  {user?.profile?.bio && (
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2}>
                        About
                      </Text>
                      <Text color="gray.600" lineHeight="tall">
                        {user.profile.bio}
                      </Text>
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* CONTACT INFORMATION CARD */}
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                p={8}
              >
                <Stack gap={6}>
                  <Heading fontSize="xl" color={THEME.COLORS.primary} fontWeight="bold">
                    Contact Information
                  </Heading>

                  <Separator />

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    {/* EMAIL */}
                    <Stack gap={3}>
                      <Flex align="center" gap={2} color="gray.600">
                        <Box as="span" display="inline-flex" alignItems="center">
                          <FiMail size={20} />
                        </Box>
                        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase">
                          Email Address
                        </Text>
                      </Flex>
                      <Text fontSize="lg" color="gray.800">
                        {user?.email || 'N/A'}
                      </Text>
                    </Stack>

                    {/* PHONE */}
                    <Stack gap={3}>
                      <Flex align="center" gap={2} color="gray.600">
                        <Box as="span" display="inline-flex" alignItems="center">
                          <FiPhone size={20} />
                        </Box>
                        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase">
                          Phone Number
                        </Text>
                      </Flex>
                      <Text fontSize="lg" color="gray.800">
                        {user?.profile?.country_code && user?.profile?.phone_number
                          ? `${user.profile.country_code} ${user.profile.phone_number}`
                          : 'N/A'}
                      </Text>
                    </Stack>
                  </SimpleGrid>
                </Stack>
              </Box>

              {/* ACCOUNT INFORMATION CARD */}
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                p={8}
              >
                <Stack gap={6}>
                  <Heading fontSize="xl" color={THEME.COLORS.primary} fontWeight="bold">
                    Account Information
                  </Heading>

                  <Separator />

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    {/* ACCOUNT TYPE */}
                    <Stack gap={3}>
                      <Flex align="center" gap={2} color="gray.600">
                        <Box as="span" display="inline-flex" alignItems="center">
                          <FiUser size={20} />
                        </Box>
                        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase">
                          Account Type
                        </Text>
                      </Flex>
                      <Text fontSize="lg" color="gray.800" textTransform="capitalize">
                        {user?.profile?.user_type || 'N/A'}
                      </Text>
                    </Stack>

                    {/* MEMBER SINCE */}
                    <Stack gap={3}>
                      <Flex align="center" gap={2} color="gray.600">
                        <Box as="span" display="inline-flex" alignItems="center">
                          <FiCalendar size={20} />
                        </Box>
                        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase">
                          Member Since
                        </Text>
                      </Flex>
                      <Text fontSize="lg" color="gray.800">
                        {formatDate(user?.created_at || '')}
                      </Text>
                    </Stack>
                  </SimpleGrid>

                  {/* ACCOUNT STATUS */}
                  <Stack gap={3} mt={2}>
                    <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" color="gray.600">
                      Account Status
                    </Text>
                    <Flex gap={2} flexWrap="wrap">
                      <Badge
                        colorScheme={user?.is_active ? 'green' : 'red'}
                        fontSize="sm"
                        px={3}
                        py={1}
                      >
                        {user?.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge
                        colorScheme={user?.email_verified ? 'green' : 'yellow'}
                        fontSize="sm"
                        px={3}
                        py={1}
                      >
                        {user?.email_verified ? 'Email Verified' : 'Email Not Verified'}
                      </Badge>
                    </Flex>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Container>
        </Box>

        <Footer />
      </>
    </ProtectedRoute>
  );
}

