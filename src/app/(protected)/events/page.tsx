'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Badge,
  Input,
  Spinner,
  Center,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiSearch,
} from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  getAllEvents,
} from '@/src/lib/events';
import useCustomToast from '@/src/hooks/useToast';
import AuthNav from '@/src/components/layout/AuthNav';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import { ROUTES, THEME, EVENT_TYPES, EVENT_STATUSES } from '@/src/lib/constants';
import type { EventListItem } from '@/src/types';
import EventCard from '@/src/components/events/EventCard';

/**
 * Events List Page Component
 * 
 * Displays a filterable and searchable list of user's events.
 * Features real-time filtering by type and status, search functionality,
 * and responsive grid layout with color-coded status indicators.
 */
export default function EventsListPage() {
  // State management
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Hooks
  const toast = useCustomToast();

  // Load events with filters
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);

      // Build filters object
      const filters: {
        event_type?: string;
        status?: string;
        search?: string;
      } = {};

      if (selectedType !== 'all') {
        filters.event_type = selectedType;
      }

      if (selectedStatus !== 'all') {
        filters.status = selectedStatus;
      }

      if (searchQuery) {
        filters.search = searchQuery;
      }

      try {
        const data = await getAllEvents(filters);
        setEvents(data);
      } catch (error: any) {
        toast.error(
          'Error loading events',
          error.message || 'Failed to load events. Please try again.'
        );
        // Clear events on error to avoid showing stale data
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedStatus, searchQuery]);

  return (
    <ProtectedRoute>
      <>
        <AuthNav />

        <Box
          as="main"
          minH="calc(100vh - 140px)"
          bg={THEME.COLORS.background}
        >
          {/* PAGE HEADER */}
          <Box
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            py={6}
          >
            <Container maxW="container.xl">
              <Flex
                justify="space-between"
                align="center"
                flexWrap="wrap"
                gap={4}
              >
                {/* LEFT - Title */}
                <Stack gap={1}>
                  <Heading fontSize="2xl" color={THEME.COLORS.primary}>
                    My Events
                  </Heading>
                  <Text color="gray.600">
                    {events.length} event{events.length !== 1 ? 's' : ''}
                  </Text>
                </Stack>

                {/* RIGHT - Create Button */}
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
                    Create Event
                  </Button>
                </Link>
              </Flex>
            </Container>
          </Box>

          {/* FILTERS SECTION */}
          <Container maxW="container.xl" py={6}>
            <Stack gap={4}>
              <Flex gap={4} flexWrap="wrap">
                {/* SEARCH */}
                <Box flex="1" minW="250px" position="relative">
                  <Icon
                    as={FiSearch}
                    color="gray.400"
                    position="absolute"
                    left="12px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={1}
                  />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderRadius="md"
                    pl="40px"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: THEME.COLORS.primary,
                      boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                    }}
                  />
                </Box>

                {/* EVENT TYPE FILTER */}
                <Box w="200px">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '2px solid #E2E8F0',
                      backgroundColor: 'white',
                      fontSize: '14px',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = THEME.COLORS.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${THEME.COLORS.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="all">All Types</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </Box>

                {/* STATUS FILTER */}
                <Box w="200px">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '2px solid #E2E8F0',
                      backgroundColor: 'white',
                      fontSize: '14px',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = THEME.COLORS.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${THEME.COLORS.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="all">All Statuses</option>
                    {EVENT_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </Box>
              </Flex>
            </Stack>
          </Container>

          {/* EVENTS GRID */}
          <Container maxW="container.xl" pb={8}>
            {loading ? (
              /* LOADING STATE */
              <Center py={20}>
                <Spinner
                  size="xl"
                  color={THEME.COLORS.primary}
                />
              </Center>
            ) : events.length === 0 ? (
              /* EMPTY STATE */
              <Center py={20}>
                <Stack gap={4} textAlign="center" maxW="md">
                  <Text fontSize="6xl" opacity={0.3}>
                    📅
                  </Text>
                  <Heading fontSize="xl" color="gray.700">
                    No events yet
                  </Heading>
                  <Text color="gray.600">
                    Create your first event to get started
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
                      Create Event
                    </Button>
                  </Link>
                </Stack>
              </Center>
            ) : (
              /* EVENTS GRID */
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </SimpleGrid>
            )}
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
