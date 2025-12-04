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
  Badge,
  SimpleGrid,
  Stat,
  Spinner,
  Center,
} from '@chakra-ui/react';
import {
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiMail,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiLock,
  FiUnlock,
  FiArrowLeft,
} from 'react-icons/fi';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  getEventById,
  deleteEvent,
  closeEvent,
  reopenEvent,
  formatEventDate,
  formatEventTime,
  getEventTypeIcon,
} from '@/src/lib/events';
import { decodeEventId } from '@/src/lib/id';
import useCustomToast from '@/src/hooks/useToast';
import AuthNav from '@/src/components/layout/AuthNav';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import { ROUTES, THEME, EVENT_STATUSES } from '@/src/lib/constants';
import type { EventDetail } from '@/src/types';

type ActionType = 'delete' | 'close' | 'reopen' | null;

function getStatusColor(status: string): string {
  const match = EVENT_STATUSES.find((s) => s.value === status);
  return match?.color || 'gray';
}

export default function EventDetailPage() {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<ActionType>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);
  const [isReopenOpen, setIsReopenOpen] = useState(false);

  const params = useParams();
  const router = useRouter();
  const toast = useCustomToast();

  const slug = (params as any).id as string;
  const eventId = decodeEventId(slug);

  const loadEvent = async () => {
    if (!eventId || Number.isNaN(eventId)) {
      router.push(ROUTES.PROTECTED.EVENTS);
      return;
    }

    setLoading(true);
    try {
      const data = await getEventById(eventId);
      setEvent(data);
    } catch (error: any) {
      toast.error(
        'Error loading event',
        error?.message || 'Failed to load event. Redirecting to events list.'
      );
      router.push(ROUTES.PROTECTED.EVENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const handleDelete = async () => {
    if (!event) return;
    setActionLoading('delete');
    try {
      await deleteEvent(event.id);
      toast.success('Event deleted successfully');
      router.push(ROUTES.PROTECTED.EVENTS);
    } catch (error: any) {
      toast.error(
        'Error deleting event',
        error?.message || 'Failed to delete event. Please try again.'
      );
    } finally {
      setActionLoading(null);
      setIsDeleteOpen(false);
    }
  };

  const handleClose = async () => {
    if (!event) return;
    setActionLoading('close');
    try {
      await closeEvent(event.id);
      toast.success('Event closed successfully');
      await loadEvent();
    } catch (error: any) {
      toast.error(
        'Error closing event',
        error?.message || 'Failed to close event. Please try again.'
      );
    } finally {
      setActionLoading(null);
      setIsCloseOpen(false);
    }
  };

  const handleReopen = async () => {
    if (!event) return;
    setActionLoading('reopen');
    try {
      await reopenEvent(event.id);
      toast.success('Event reopened successfully');
      await loadEvent();
    } catch (error: any) {
      toast.error(
        'Error reopening event',
        error?.message || 'Failed to reopen event. Please try again.'
      );
    } finally {
      setActionLoading(null);
      setIsReopenOpen(false);
    }
  };

  const renderModal = ({
    isOpen,
    title,
    description,
    confirmLabel,
    onConfirm,
    onClose,
    variant,
  }: {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    onClose: () => void;
    variant: 'delete' | 'close' | 'reopen';
  }) => {
    if (!isOpen) return null;
    const color =
      variant === 'delete' ? 'red' : variant === 'close' ? 'orange' : 'green';

    return (
      <Box
        position="fixed"
        inset={0}
        bg="blackAlpha.600"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={1000}
      >
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="2xl"
          maxW="md"
          w="90%"
          p={6}
        >
          <Stack gap={4}>
            <Heading fontSize="xl" color={THEME.COLORS.primary}>
              {title}
            </Heading>
            <Text fontSize="sm" color="gray.700">
              {description}
            </Text>
            <Flex justify="flex-end" gap={3} pt={2}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                bg={color === 'red' ? THEME.COLORS.error : color === 'orange' ? THEME.COLORS.warning : THEME.COLORS.success}
                color="white"
                _hover={{ opacity: 0.9 }}
                loading={actionLoading === variant}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <ProtectedRoute>
      <>
        <AuthNav />

        <Box
          as="main"
          minH="calc(100vh - 140px)"
          bg={THEME.COLORS.background}
        >
          {loading ? (
            <Center py={20}>
              <Spinner size="xl" color={THEME.COLORS.primary} />
            </Center>
          ) : event ? (
            <>
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
                    {/* LEFT - Back & Title */}
                    <Stack gap={3}>
                      <Link href={ROUTES.PROTECTED.EVENTS}>
                        <Button
                          variant="ghost"
                          size="sm"
                          color={THEME.COLORS.primary}
                        >
                          <Box
                            as="span"
                            display="inline-flex"
                            alignItems="center"
                            mr={2}
                          >
                            <Icon as={FiArrowLeft} />
                          </Box>
                          Back to Events
                        </Button>
                      </Link>
                      <Flex align="center" gap={3}>
                        <Text fontSize="4xl">
                          {getEventTypeIcon(event.event_type)}
                        </Text>
                        <Stack gap={1}>
                          <Heading
                            fontSize="2xl"
                            color={THEME.COLORS.primary}
                          >
                            {event.event_name}
                          </Heading>
                          <Badge
                            colorScheme={getStatusColor(event.status)}
                            fontSize="sm"
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            {event.status_display}
                          </Badge>
                        </Stack>
                      </Flex>
                    </Stack>

                    {/* RIGHT - Action Buttons */}
                    <Flex gap={3} flexWrap="wrap">
                      {event.can_edit && (
                        <Link href={ROUTES.PROTECTED.EVENT_EDIT(slug)}>
                          <Button {...THEME.BUTTON_STYLES.primaryButton}>
                            <Box
                              as="span"
                              display="inline-flex"
                              alignItems="center"
                              mr={2}
                            >
                              <Icon as={FiEdit} />
                            </Box>
                            Edit Event
                          </Button>
                        </Link>
                      )}

                      {event.status === 'active' && event.can_edit && (
                        <Button
                          onClick={() => setIsCloseOpen(true)}
                          colorScheme="orange"
                          variant="outline"
                        >
                          <Box
                            as="span"
                            display="inline-flex"
                            alignItems="center"
                            mr={2}
                          >
                            <Icon as={FiLock} />
                          </Box>
                          Close Event
                        </Button>
                      )}

                      {event.status === 'closed' && (
                        <Button
                          onClick={() => setIsReopenOpen(true)}
                          colorScheme="green"
                          variant="outline"
                        >
                          <Box
                            as="span"
                            display="inline-flex"
                            alignItems="center"
                            mr={2}
                          >
                            <Icon as={FiUnlock} />
                          </Box>
                          Reopen Event
                        </Button>
                      )}

                      <Button
                        onClick={() => setIsDeleteOpen(true)}
                        colorScheme="red"
                        variant="outline"
                      >
                        <Box
                          as="span"
                          display="inline-flex"
                          alignItems="center"
                          mr={2}
                        >
                          <Icon as={FiTrash2} />
                        </Box>
                        Delete
                      </Button>
                    </Flex>
                  </Flex>
                </Container>
              </Box>

              {/* CLOSED BANNER */}
              {event.status === 'closed' && (
                <Container maxW="container.xl" pt={4}>
                  <Box
                    bg="yellow.50"
                    borderRadius="md"
                    p={4}
                    borderLeft="4px solid"
                    borderColor="yellow.400"
                  >
                    <Flex align="center" gap={3}>
                      <Icon as={FiLock} color="yellow.500" />
                      <Text fontSize="sm" color="gray.800">
                        This event is closed. To make changes, reopen the event first.
                      </Text>
                    </Flex>
                  </Box>
                </Container>
              )}

              {/* MAIN CONTENT */}
              <Container maxW="container.xl" py={8}>
                <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
                  {/* LEFT COLUMN */}
                  <Stack gap={6} gridColumn={{ base: 'span 1', lg: 'span 2' }}>
                    {/* EVENT DETAILS CARD */}
                    <Box
                      bg="white"
                      borderRadius="xl"
                      boxShadow="md"
                      p={8}
                    >
                      <Stack gap={6}>
                        <Heading fontSize="xl" color={THEME.COLORS.primary}>
                          Event Details
                        </Heading>

                        <Box borderTop="1px" borderColor="gray.200" />

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                          {/* DATE */}
                          <Stack gap={3}>
                            <Flex align="center" gap={2} color="gray.600">
                              <Icon as={FiCalendar} w={5} h={5} />
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                textTransform="uppercase"
                              >
                                Date
                              </Text>
                            </Flex>
                            <Text
                              fontSize="lg"
                              color="gray.800"
                              fontWeight="semibold"
                            >
                              {formatEventDate(event.event_date)}
                            </Text>
                          </Stack>

                          {/* TIME */}
                          <Stack gap={3}>
                            <Flex align="center" gap={2} color="gray.600">
                              <Icon as={FiClock} w={5} h={5} />
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                textTransform="uppercase"
                              >
                                Time
                              </Text>
                            </Flex>
                            <Text
                              fontSize="lg"
                              color="gray.800"
                              fontWeight="semibold"
                            >
                              {formatEventTime(event.event_time)}
                            </Text>
                          </Stack>

                          {/* LOCATION */}
                          <Stack gap={3} gridColumn="span 2">
                            <Flex align="center" gap={2} color="gray.600">
                              <Icon as={FiMapPin} w={5} h={5} />
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                textTransform="uppercase"
                              >
                                Location
                              </Text>
                            </Flex>
                            <Text fontSize="lg" color="gray.800">
                              {event.event_location}
                            </Text>
                          </Stack>

                          {/* EVENT TYPE */}
                          <Stack gap={3}>
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              textTransform="uppercase"
                              color="gray.600"
                            >
                              Event Type
                            </Text>
                            <Text fontSize="lg" color="gray.800">
                              {event.event_type_display}
                            </Text>
                          </Stack>

                          {/* ORGANIZER */}
                          <Stack gap={3}>
                            <Flex align="center" gap={2} color="gray.600">
                              <Icon as={FiUser} w={5} h={5} />
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                textTransform="uppercase"
                              >
                                Organizer
                              </Text>
                            </Flex>
                            <Text fontSize="lg" color="gray.800">
                              {event.created_by.first_name}{' '}
                              {event.created_by.last_name}
                            </Text>
                          </Stack>
                        </SimpleGrid>

                        {/* DESCRIPTION */}
                        {event.event_description && (
                          <Stack gap={3}>
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              textTransform="uppercase"
                              color="gray.600"
                            >
                              Description
                            </Text>
                            <Text
                              fontSize="md"
                              color="gray.700"
                              whiteSpace="pre-wrap"
                            >
                              {event.event_description}
                            </Text>
                          </Stack>
                        )}
                      </Stack>
                    </Box>

                    {/* STATISTICS CARD */}
                    <Box
                      bg="white"
                      borderRadius="xl"
                      boxShadow="md"
                      p={8}
                    >
                      <Stack gap={6}>
                        <Heading fontSize="xl" color={THEME.COLORS.primary}>
                          Event Statistics
                        </Heading>

                        <Box borderTop="1px" borderColor="gray.200" />

                        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
                          <Stat.Root>
                            <Stat.Label fontSize="xs" color="gray.600">
                              Invitations Sent
                            </Stat.Label>
                            <Stat.ValueText
                              fontSize="2xl"
                              color={THEME.COLORS.primary}
                            >
                              {event.total_invitations}
                            </Stat.ValueText>
                            <Stat.HelpText color="gray.500">
                              <Icon
                                as={FiMail}
                                display="inline"
                                mr={1}
                              />
                              Total sent
                            </Stat.HelpText>
                          </Stat.Root>

                          <Stat.Root>
                            <Stat.Label fontSize="xs" color="gray.600">
                              RSVPs Received
                            </Stat.Label>
                            <Stat.ValueText
                              fontSize="2xl"
                              color={THEME.COLORS.primary}
                            >
                              {event.total_rsvps}
                            </Stat.ValueText>
                            <Stat.HelpText color="gray.500">
                              <Icon
                                as={FiMessageSquare}
                                display="inline"
                                mr={1}
                              />
                              Responses
                            </Stat.HelpText>
                          </Stat.Root>

                          <Stat.Root>
                            <Stat.Label fontSize="xs" color="gray.600">
                              Confirmed
                            </Stat.Label>
                            <Stat.ValueText fontSize="2xl" color="green.500">
                              {event.total_confirmations}
                            </Stat.ValueText>
                            <Stat.HelpText color="gray.500">
                              <Icon
                                as={FiCheckCircle}
                                display="inline"
                                mr={1}
                                color="green.500"
                              />
                              Attending
                            </Stat.HelpText>
                          </Stat.Root>

                          <Stat.Root>
                            <Stat.Label fontSize="xs" color="gray.600">
                              Response Rate
                            </Stat.Label>
                            <Stat.ValueText
                              fontSize="2xl"
                              color={THEME.COLORS.primary}
                            >
                              {event.response_rate.toFixed(1)}%
                            </Stat.ValueText>
                            <Stat.HelpText color="gray.500">
                              Of invitations
                            </Stat.HelpText>
                          </Stat.Root>
                        </SimpleGrid>

                        {event.total_invitations === 0 && (
                          <Box
                            mt={4}
                            bg={THEME.COLORS.background}
                            borderRadius="md"
                            p={4}
                          >
                            <Text fontSize="sm" color="gray.700">
                              No invitations sent yet. Start by creating and sending invitations to
                              your guests.
                            </Text>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </Stack>

                  {/* RIGHT COLUMN */}
                  <Stack gap={6}>
                    {/* QUICK ACTIONS CARD */}
                    <Box
                      bg="white"
                      borderRadius="xl"
                      boxShadow="md"
                      p={6}
                    >
                      <Stack gap={4}>
                        <Heading fontSize="lg" color={THEME.COLORS.primary}>
                          Quick Actions
                        </Heading>

                        <Box borderTop="1px" borderColor="gray.200" />

                        <Stack gap={3}>
                          <Button
                            w="full"
                            {...THEME.BUTTON_STYLES.primaryButton}
                            disabled
                          >
                            <Box
                              as="span"
                              display="inline-flex"
                              alignItems="center"
                              mr={2}
                            >
                              <Icon as={FiMail} />
                            </Box>
                            Send Invitations (Coming in Milestone 4)
                          </Button>

                          <Button
                            w="full"
                            {...THEME.BUTTON_STYLES.secondaryButton}
                            variant="outline"
                            disabled
                          >
                            <Box
                              as="span"
                              display="inline-flex"
                              alignItems="center"
                              mr={2}
                            >
                              <Icon as={FiCheckCircle} />
                            </Box>
                            View RSVPs (Coming in Milestone 4)
                          </Button>

                          <Link href={ROUTES.PROTECTED.EVENT_EDIT(slug)}>
                            <Button
                              w="full"
                              {...THEME.BUTTON_STYLES.secondaryButton}
                              variant="outline"
                              disabled={!event.can_edit}
                            >
                              <Box
                                as="span"
                                display="inline-flex"
                                alignItems="center"
                                mr={2}
                              >
                                <Icon as={FiEdit} />
                              </Box>
                              Edit Details
                            </Button>
                          </Link>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* EVENT STATUS CARD */}
                    <Box
                      bg={
                        event.is_upcoming
                          ? 'green.50'
                          : event.is_past
                          ? 'gray.50'
                          : 'blue.50'
                      }
                      borderRadius="xl"
                      p={6}
                      borderLeft="4px solid"
                      borderColor={
                        event.is_upcoming
                          ? 'green.400'
                          : event.is_past
                          ? 'gray.400'
                          : 'blue.400'
                      }
                    >
                      <Stack gap={3}>
                        <Flex align="center" gap={2}>
                          <Icon
                            as={
                              event.is_upcoming
                                ? FiCalendar
                                : event.is_past
                                ? FiXCircle
                                : FiCheckCircle
                            }
                            w={6}
                            h={6}
                            color={
                              event.is_upcoming
                                ? 'green.600'
                                : event.is_past
                                ? 'gray.600'
                                : 'blue.600'
                            }
                          />
                          <Text fontWeight="bold" color="gray.800">
                            {event.is_upcoming
                              ? 'Upcoming Event'
                              : event.is_past
                              ? 'Past Event'
                              : 'Ongoing Event'}
                          </Text>
                        </Flex>
                        <Text fontSize="sm" color="gray.700">
                          {event.is_upcoming
                            ? "This event hasn't happened yet."
                            : event.is_past
                            ? 'This event has already taken place.'
                            : 'This event is currently active.'}
                        </Text>
                      </Stack>
                    </Box>

                    {/* METADATA CARD */}
                    <Box
                      bg="white"
                      borderRadius="xl"
                      boxShadow="md"
                      p={6}
                    >
                      <Stack gap={4}>
                        <Heading fontSize="lg" color={THEME.COLORS.primary}>
                          Event Info
                        </Heading>

                        <Box borderTop="1px" borderColor="gray.200" />

                        <Stack gap={3} fontSize="sm">
                          <Flex justify="space-between">
                            <Text color="gray.600">Created</Text>
                            <Text color="gray.800" fontWeight="semibold">
                              {new Date(event.created_at).toLocaleDateString()}
                            </Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text color="gray.600">Last Updated</Text>
                            <Text color="gray.800" fontWeight="semibold">
                              {new Date(event.updated_at).toLocaleDateString()}
                            </Text>
                          </Flex>
                          <Flex justify="space-between" align="center">
                            <Text color="gray.600">Status</Text>
                            <Badge colorScheme={getStatusColor(event.status)}>
                              {event.status_display}
                            </Badge>
                          </Flex>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </SimpleGrid>
              </Container>

              {/* MODALS */}
              {renderModal({
                isOpen: isDeleteOpen,
                title: 'Delete Event',
                description:
                  event &&
                  `Are you sure you want to delete '${event.event_name}'? All associated data including invitations and RSVPs will be permanently removed.`,
                confirmLabel: 'Yes, Delete Event',
                onConfirm: handleDelete,
                onClose: () => setIsDeleteOpen(false),
                variant: 'delete',
              })}

              {renderModal({
                isOpen: isCloseOpen,
                title: 'Close Event',
                description:
                  'Closing this event will prevent any further edits. You can reopen it later if needed. Are you sure?',
                confirmLabel: 'Close Event',
                onConfirm: handleClose,
                onClose: () => setIsCloseOpen(false),
                variant: 'close',
              })}

              {renderModal({
                isOpen: isReopenOpen,
                title: 'Reopen Event',
                description:
                  'Reopening this event will allow you to make edits again. Continue?',
                confirmLabel: 'Reopen Event',
                onConfirm: handleReopen,
                onClose: () => setIsReopenOpen(false),
                variant: 'reopen',
              })}
            </>
          ) : (
            <Center py={20}>
              <Text>Event not found.</Text>
            </Center>
          )}
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


