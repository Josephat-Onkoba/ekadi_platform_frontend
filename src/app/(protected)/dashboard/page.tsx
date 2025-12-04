/**
 * Dashboard Page Component
 * 
 * Main dashboard page displayed after user login.
 * Features:
 * - Welcome message with user's first name
 * - Statistics cards showing event metrics
 * - Quick action buttons for common tasks
 * - Recent activity placeholder
 * - Protected route wrapper
 * 
 * @module DashboardPage
 */

'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Stat,
  Button,
  Flex,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import {
  FiCalendar, 
  FiMail, 
  FiUsers, 
  FiCheckCircle, 
  FiPlus,
  FiCreditCard,
  FiZap,
  FiArrowRight,
  FiTrendingUp,
} from 'react-icons/fi';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect, type ReactNode } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import { ROUTES, THEME } from '@/src/lib/constants';
import { getEventStats } from '@/src/lib/events';
import type { IconType } from 'react-icons';
import type { EventStats } from '@/src/types';

// Lazy-load heavier layout pieces to keep initial bundle smaller
const AuthNav = dynamic(() => import('@/src/components/layout/AuthNav'), {
  ssr: false,
});

// ============================================================================
// TYPES
// ============================================================================

interface StatCardProps {
  label: string;
  value: string | number | ReactNode;
  helpText: ReactNode;
  icon: IconType;
}

interface QuickActionProps {
  href: string;
  icon: IconType;
  title: string;
  description: string;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Stat Card Component
 * Displays a single statistic with icon
 */
function StatCard({ label, value, helpText, icon: IconComponent }: StatCardProps) {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="md"
      _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <Stat.Root>
        <Flex justify="space-between" align="start">
          <Stack gap={1} flex={1}>
            <Stat.Label color="gray.600" fontWeight="medium" fontSize="sm">
              {label}
            </Stat.Label>
            <Stat.ValueText fontSize="3xl" fontWeight="bold" color={THEME.COLORS.primary}>
              {value}
            </Stat.ValueText>
            <Stat.HelpText color="gray.500" fontSize="sm" m={0}>
              {helpText}
            </Stat.HelpText>
          </Stack>
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={10}
            h={10}
            color={THEME.COLORS.primary}
            opacity={0.2}
          >
            <IconComponent size={24} />
          </Box>
        </Flex>
      </Stat.Root>
    </Box>
  );
}

/**
 * Quick Action Button Component
 * Displays a quick action button with icon, title, and description
 */
function QuickActionButton({ href, icon: IconComponent, title, description }: QuickActionProps) {
  return (
    <Link href={href} style={{ width: '100%' }}>
      <Button
        w="full"
        h="auto"
        py={6}
        flexDirection="column"
        gap={2}
        {...THEME.BUTTON_STYLES.secondaryButton}
        variant="outline"
        _hover={{
          ...THEME.BUTTON_STYLES.secondaryButton._hover,
          transform: 'translateY(-2px)',
        }}
      >
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          mb={1}
        >
          <IconComponent size={24} />
        </Box>
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <Text fontSize="sm" fontWeight="normal" color="gray.600">
          {description}
        </Text>
      </Button>
    </Link>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Dashboard Page Component
 * 
 * Main dashboard displaying user statistics, quick actions, and recent activity
 * 
 * @returns Dashboard page component
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const [eventStats, setEventStats] = useState<EventStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const stats = await getEventStats();
        setEventStats(stats);
      } catch (error) {
        // Stats are non-critical; log and continue
        // eslint-disable-next-line no-console
        console.error('Failed to load stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <ProtectedRoute>
      <>
        <AuthNav />

        <Box as="main" minH="calc(100vh - 140px)" bg={THEME.COLORS.background}>
          {/* WELCOME HEADER */}
          <Box bg="white" borderBottom="1px" borderColor="gray.200" py={8}>
            <Container maxW="container.xl">
              <Flex
                justify="space-between"
                align="center"
                flexWrap="wrap"
                gap={4}
              >
                {/* LEFT - Welcome Message */}
                <Stack gap={2}>
                  <Heading fontSize="3xl" color={THEME.COLORS.primary} fontWeight="bold">
                    Welcome back, {user?.first_name || 'User'}!
                  </Heading>
                  <Text color="gray.600" fontSize="lg">
                    Here's what's happening with your events
                  </Text>
                </Stack>

                {/* RIGHT - Create Event Button */}
                <Link href="/events/create">
                  <Button
                    size="lg"
                    {...THEME.BUTTON_STYLES.primaryButton}
                  >
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      mr={2}
                    >
                      <FiPlus size={20} />
                    </Box>
                    Create Event
                  </Button>
                </Link>
              </Flex>
            </Container>
          </Box>

          {/* MAIN CONTENT */}
          <Container maxW="container.xl" py={8}>
            <Stack gap={8}>
              {/* STATS SECTION */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} gap={6}>
                <StatCard
                  label="Total Events"
                  value={
                    statsLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      eventStats?.total_events || 0
                    )
                  }
                  helpText={
                    <>
                      {eventStats?.active_events || 0} active •{' '}
                      {eventStats?.draft_events || 0} draft
                    </>
                  }
                  icon={FiCalendar}
                />
                <StatCard
                  label="Invitations Sent"
                  value={
                    statsLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      eventStats?.total_invitations_sent || 0
                    )
                  }
                  helpText="Total sent"
                  icon={FiMail}
                />
                <StatCard
                  label="RSVPs Received"
                  value={
                    statsLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      eventStats?.total_confirmations || 0
                    )
                  }
                  helpText="Confirmed attendees"
                  icon={FiCheckCircle}
                />
                <StatCard
                  label="Upcoming Events"
                  value={
                    statsLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      eventStats?.upcoming_events || 0
                    )
                  }
                  helpText="Events coming soon"
                  icon={FiTrendingUp}
                />
                {/* Stat Card 5 - Past Events */}
                <Box
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  boxShadow="md"
                  _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <Stat.Root>
                    <Flex justify="space-between" align="start">
                      <Stack gap={1} flex={1}>
                        <Stat.Label color="gray.600" fontWeight="medium">
                          Past Events
                        </Stat.Label>
                        <Stat.ValueText fontSize="3xl" color={THEME.COLORS.primary}>
                          {statsLoading ? (
                            <Spinner size="sm" />
                          ) : (
                            eventStats?.past_events || 0
                          )}
                        </Stat.ValueText>
                        <Stat.HelpText color="gray.500">
                          Completed
                        </Stat.HelpText>
                      </Stack>
                      <Box
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        w={10}
                        h={10}
                        color={THEME.COLORS.primary}
                        opacity={0.2}
                      >
                        <FiCheckCircle size={24} />
                      </Box>
                    </Flex>
                  </Stat.Root>
                </Box>
              </SimpleGrid>

              {/* Empty State - No Events */}
              {!statsLoading && eventStats && eventStats.total_events === 0 && (
                <Box
                  bg="white"
                  p={8}
                  borderRadius="xl"
                  boxShadow="md"
                  textAlign="center"
                >
                  <Stack gap={4} align="center">
                    <Text fontSize="6xl" opacity={0.3}>
                      📅
                    </Text>
                    <Heading fontSize="xl" color="gray.700">
                      No Events Yet
                    </Heading>
                    <Text color="gray.600" maxW="md">
                      You haven't created any events. Start by creating your first event to see statistics here.
                    </Text>
                    <Link href={ROUTES.PROTECTED.EVENT_CREATE}>
                      <Button
                        {...THEME.BUTTON_STYLES.primaryButton}
                      >
                        <Box
                          as="span"
                          display="inline-flex"
                          alignItems="center"
                          mr={2}
                        >
                          <FiPlus size={20} />
                        </Box>
                        Create Your First Event
                      </Button>
                    </Link>
                  </Stack>
                </Box>
              )}

              {/* QUICK ACTIONS */}
              <Box
                bg="white"
                p={8}
                borderRadius="xl"
                boxShadow="md"
              >
                <Stack gap={6}>
                  <Heading fontSize="xl" color={THEME.COLORS.primary} fontWeight="bold">
                    Quick Actions
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    <QuickActionButton
                      href="/events/create"
                      icon={FiCalendar}
                      title="Create Event"
                      description="Start planning your next event"
                    />
                    <QuickActionButton
                      href="/cards/create"
                      icon={FiCreditCard}
                      title="Design Card"
                      description="Create beautiful invitations"
                    />
                    <QuickActionButton
                      href="/events"
                      icon={FiUsers}
                      title="View Events"
                      description="Manage your events"
                    />
                  </SimpleGrid>
                </Stack>
              </Box>

              {/* Pricing Promotion Card */}
              <Box
                bg={THEME.COLORS.primary}
                bgGradient={`linear(to-r, ${THEME.COLORS.primary}, ${THEME.COLORS.accent})`}
                color="white"
                p={8}
                borderRadius="xl"
                boxShadow="xl"
                position="relative"
                overflow="hidden"
              >
                {/* Decorative Background Pattern */}
                <Box
                  position="absolute"
                  top="-10"
                  right="-10"
                  fontSize="15rem"
                  opacity={0.1}
                  transform="rotate(15deg)"
                >
                  💳
                </Box>

                <Stack gap={4} position="relative" zIndex={1}>
                  <Flex align="center" gap={3}>
                    <Icon as={FiZap} w={8} h={8} />
                    <Heading fontSize="2xl">
                      Upgrade Your Plan
                    </Heading>
                  </Flex>

                  <Text fontSize="lg" opacity={0.95}>
                    Get more events, unlimited messages, and premium features. Choose a plan that grows with you.
                  </Text>

                  <Flex gap={4} flexWrap="wrap">
                    <Link href={ROUTES.PUBLIC.PRICING}>
                      <Button
                        bg="white"
                        color={THEME.COLORS.primary}
                        _hover={{ bg: 'gray.100' }}
                        size="lg"
                      >
                        <Box
                          as="span"
                          display="inline-flex"
                          alignItems="center"
                          mr={2}
                        >
                          <Icon as={FiArrowRight} />
                        </Box>
                        View Pricing
                      </Button>
                    </Link>

                    <Text fontSize="sm" alignSelf="center">
                      Currently on:{' '}
                      <Box
                        as="span"
                        ml={2}
                        px={3}
                        py={1}
                        borderRadius="full"
                        bg="whiteAlpha.300"
                        fontWeight="semibold"
                      >
                        Pay As You Go
                      </Box>
                    </Text>
                  </Flex>
                </Stack>
              </Box>

              {/* RECENT ACTIVITY (Placeholder) */}
              <Box
                bg="white"
                p={8}
                borderRadius="xl"
                boxShadow="md"
              >
                <Stack gap={6}>
                  <Heading fontSize="xl" color={THEME.COLORS.primary} fontWeight="bold">
                    Recent Activity
                  </Heading>
                  {!statsLoading && eventStats && eventStats.total_events > 0 ? (
                    <Text color="gray.500" textAlign="center" py={8}>
                      Recent activity feed coming soon. You have {eventStats.total_events}{' '}
                      event{eventStats.total_events !== 1 ? 's' : ''}.
                    </Text>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={8}>
                      No recent activity. Create your first event to get started!
                    </Text>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Container>
        </Box>
        <Box as="footer" py={6} bg={THEME.COLORS.background}>
          <Container maxW="container.xl">
            <Text textAlign="center" color="gray.400" fontSize="sm">
              © 2025 Ekadi Platform. All rights reserved.
            </Text>
          </Container>
        </Box>
      </>
    </ProtectedRoute>
  );
}
