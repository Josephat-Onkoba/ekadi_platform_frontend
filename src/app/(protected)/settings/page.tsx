/**
 * Settings Page
 * 
 * User account settings page with preferences, notifications, and security options
 * 
 * @module SettingsPage
 */

 'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Separator,
  Field,
  Flex,
} from '@chakra-ui/react';
import { 
  FiSettings, 
  FiUser, 
  FiBell, 
  FiGlobe, 
} from 'react-icons/fi';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import useCustomToast from '@/src/hooks/useToast';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import { ROUTES, THEME } from '@/src/lib/constants';

const AuthNav = dynamic(() => import('@/src/components/layout/AuthNav'), {
  ssr: false,
});

const Footer = dynamic(() => import('@/src/components/layout/Footer'), {
  ssr: false,
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Settings Page Component
 * 
 * Displays user settings including account info, notifications, language, and security
 * 
 * @returns Settings page component
 */
export default function SettingsPage() {
  const { user, logout } = useAuth();
  const toast = useCustomToast();

  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  /**
   * Handle language toggle
   */
  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'sw' : 'en';
    setLanguage(newLanguage);
    toast.success(
      'Language preference updated',
      `Interface language changed to ${newLanguage === 'en' ? 'English' : 'Kiswahili'}`
    );
  };

  return (
    <ProtectedRoute>
      <>
        <AuthNav />

        <Box as="main" minH="calc(100vh - 140px)" bg={THEME.COLORS.background}>
          {/* PAGE HEADER */}
          <Box bg="white" borderBottom="1px" borderColor="gray.200" py={6}>
            <Container maxW="container.xl">
              <Heading fontSize="2xl" color={THEME.COLORS.primary} fontWeight="bold">
                Account Settings
              </Heading>
            </Container>
          </Box>

          {/* MAIN CONTENT */}
          <Container maxW="container.md" py={8}>
            <Stack gap={6}>
              {/* ACCOUNT INFORMATION CARD */}
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                p={8}
              >
                <Stack gap={6}>
                  <Flex align="center" gap={3}>
                    <Box as="span" display="inline-flex" alignItems="center">
                      <FiUser size={24} color={THEME.COLORS.primary} />
                    </Box>
                    <Heading fontSize="lg" color={THEME.COLORS.primary} fontWeight="bold">
                      Account Information
                    </Heading>
                  </Flex>

                  <Separator />

                  <Stack gap={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600" fontWeight="semibold" mb={1}>
                        Email
                      </Text>
                      <Text fontSize="md" color="gray.800">
                        {user?.email || 'N/A'}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="gray.600" fontWeight="semibold" mb={1}>
                        Account Type
                      </Text>
                      <Text fontSize="md" color="gray.800" textTransform="capitalize">
                        {user?.profile?.user_type || 'N/A'}
                      </Text>
                    </Box>

                    <Link href={ROUTES.PROTECTED.EDIT_PROFILE} style={{ width: '100%' }}>
                      <Button
                        w="full"
                        {...THEME.BUTTON_STYLES.secondaryButton}
                        variant="outline"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                  </Stack>
                </Stack>
              </Box>

              {/* NOTIFICATION PREFERENCES CARD */}
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                p={8}
              >
                <Stack gap={6}>
                  <Flex align="center" gap={3}>
                    <Box as="span" display="inline-flex" alignItems="center">
                      <FiBell size={24} color={THEME.COLORS.primary} />
                    </Box>
                    <Heading fontSize="lg" color={THEME.COLORS.primary} fontWeight="bold">
                      Notifications
                    </Heading>
                  </Flex>

                  <Separator />

                  <Stack gap={4}>
                    {/* EMAIL NOTIFICATIONS */}
                    <Field.Root display="flex" alignItems="center" justifyContent="space-between">
                      <Stack gap={1} flex="1">
                        <Field.Label htmlFor="email-notifications" mb={0} fontWeight="semibold">
                          Email Notifications
                        </Field.Label>
                        <Text fontSize="sm" color="gray.600">
                          Receive event updates via email
                        </Text>
                      </Stack>
                      <Button
                        as="div"
                        role="switch"
                        aria-checked={emailNotifications}
                        aria-labelledby="email-notifications"
                        w="44px"
                        h="24px"
                        p={0}
                        borderRadius="full"
                        bg={emailNotifications ? THEME.COLORS.primary : 'gray.300'}
                        position="relative"
                        transition="all 0.2s"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        cursor="pointer"
                      >
                        <Box
                          position="absolute"
                          top="2px"
                          left={emailNotifications ? '22px' : '2px'}
                          w="20px"
                          h="20px"
                          borderRadius="full"
                          bg="white"
                          boxShadow="sm"
                          transition="all 0.2s"
                        />
                      </Button>
                    </Field.Root>

                    {/* SMS NOTIFICATIONS */}
                    <Field.Root display="flex" alignItems="center" justifyContent="space-between">
                      <Stack gap={1} flex="1">
                        <Field.Label htmlFor="sms-notifications" mb={0} fontWeight="semibold">
                          SMS Notifications
                        </Field.Label>
                        <Text fontSize="sm" color="gray.600">
                          Receive RSVP alerts via SMS
                        </Text>
                      </Stack>
                      <Button
                        as="div"
                        role="switch"
                        aria-checked={smsNotifications}
                        aria-labelledby="sms-notifications"
                        w="44px"
                        h="24px"
                        p={0}
                        borderRadius="full"
                        bg={smsNotifications ? THEME.COLORS.primary : 'gray.300'}
                        position="relative"
                        transition="all 0.2s"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => setSmsNotifications(!smsNotifications)}
                        cursor="pointer"
                      >
                        <Box
                          position="absolute"
                          top="2px"
                          left={smsNotifications ? '22px' : '2px'}
                          w="20px"
                          h="20px"
                          borderRadius="full"
                          bg="white"
                          boxShadow="sm"
                          transition="all 0.2s"
                        />
                      </Button>
                    </Field.Root>
                  </Stack>
                </Stack>
              </Box>

              {/* LANGUAGE PREFERENCE CARD */}
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                p={8}
              >
                <Stack gap={6}>
                  <Flex align="center" gap={3}>
                    <Box as="span" display="inline-flex" alignItems="center">
                      <FiGlobe size={24} color={THEME.COLORS.primary} />
                    </Box>
                    <Heading fontSize="lg" color={THEME.COLORS.primary} fontWeight="bold">
                      Language
                    </Heading>
                  </Flex>

                  <Separator />

                  <Field.Root display="flex" alignItems="center" justifyContent="space-between">
                    <Stack gap={1} flex="1">
                      <Field.Label htmlFor="language-toggle" mb={0} fontWeight="semibold">
                        Interface Language
                      </Field.Label>
                      <Text fontSize="sm" color="gray.600">
                        {language === 'en' ? 'English' : 'Kiswahili'}
                      </Text>
                    </Stack>
                    <Button
                      as="div"
                      role="switch"
                      aria-checked={language === 'sw'}
                      aria-labelledby="language-toggle"
                      w="44px"
                      h="24px"
                      p={0}
                      borderRadius="full"
                      bg={language === 'sw' ? THEME.COLORS.primary : 'gray.300'}
                      position="relative"
                      transition="all 0.2s"
                      _hover={{ opacity: 0.8 }}
                      onClick={handleLanguageToggle}
                      cursor="pointer"
                    >
                      <Box
                        position="absolute"
                        top="2px"
                        left={language === 'sw' ? '22px' : '2px'}
                        w="20px"
                        h="20px"
                        borderRadius="full"
                        bg="white"
                        boxShadow="sm"
                        transition="all 0.2s"
                      />
                    </Button>
                  </Field.Root>
                </Stack>
              </Box>

              {/* SECURITY SECTION CARD */}
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                p={8}
              >
                <Stack gap={6}>
                  <Flex align="center" gap={3}>
                    <Box as="span" display="inline-flex" alignItems="center">
                      <FiSettings size={24} color={THEME.COLORS.primary} />
                    </Box>
                    <Heading fontSize="lg" color={THEME.COLORS.primary} fontWeight="bold">
                      Security
                    </Heading>
                  </Flex>

                  <Separator />

                  <Stack gap={4}>
                    <Box>
                      <Text fontWeight="semibold" mb={2}>
                        Password
                      </Text>
                      <Text fontSize="sm" color="gray.600" mb={3}>
                        Last changed: Never
                      </Text>
                      <Link href={ROUTES.PUBLIC.FORGOT_PASSWORD}>
                        <Button
                          size="sm"
                          {...THEME.BUTTON_STYLES.secondaryButton}
                          variant="outline"
                        >
                          Change Password
                        </Button>
                      </Link>
                    </Box>
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

