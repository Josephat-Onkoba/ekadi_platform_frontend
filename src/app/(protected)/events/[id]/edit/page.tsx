'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Input,
  Textarea,
  Button,
  Icon,
  Flex,
  Spinner,
  Center,
  Field,
} from '@chakra-ui/react';
import { FiSave, FiX, FiAlertTriangle } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getEventById, updateEvent } from '@/src/lib/events';
import useCustomToast from '@/src/hooks/useToast';
import AuthNav from '@/src/components/layout/AuthNav';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import { ROUTES, THEME, EVENT_TYPES, EVENT_STATUSES } from '@/src/lib/constants';
import type { EventFormData, EventDetail } from '@/src/types';
import { decodeEventId, encodeEventId } from '@/src/lib/id';

const eventUpdateSchema = z
  .object({
    event_type: z.enum(['wedding', 'send_off', 'conference', 'birthday', 'corporate', 'other']).optional(),
    event_name: z
      .string()
      .min(3, 'Event name must be at least 3 characters')
      .max(255, 'Event name must be at most 255 characters')
      .optional(),
    event_location: z
      .string()
      .min(3, 'Location is required')
      .optional(),
    event_date: z.string().optional(),
    event_time: z.string().optional(),
    event_description: z.string().optional(),
    status: z.enum(['draft', 'active', 'closed']).optional(),
  })
  .refine(
    (data) => {
      if (!data.event_date) return true;
      const selected = new Date(data.event_date);
      const today = new Date();
      selected.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    },
    {
      path: ['event_date'],
      message: 'Event date cannot be in the past',
    }
  );

type EventUpdateFormValues = z.infer<typeof eventUpdateSchema>;

export default function EditEventPage() {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const slug = (params as any).id as string;
  const eventId = decodeEventId(slug);

  const router = useRouter();
  const toast = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EventUpdateFormValues>({
    resolver: zodResolver(eventUpdateSchema),
  });

  const watchStatus = watch('status');

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId || Number.isNaN(eventId)) {
        router.push(ROUTES.PROTECTED.EVENTS);
        return;
      }

      setLoading(true);
      try {
        const data = await getEventById(eventId);
        setEvent(data);

        if (!data.can_edit) {
          toast.error('Cannot edit closed events');
          router.push(ROUTES.PROTECTED.EVENT_DETAIL(encodeEventId(data.id)));
          return;
        }

        reset({
          event_type: data.event_type,
          event_name: data.event_name,
          event_location: data.event_location,
          event_date: data.event_date,
          event_time: data.event_time,
          event_description: data.event_description || '',
          status: data.status,
        });
      } catch (error: any) {
        toast.error(
          'Error loading event',
          error?.message || 'Failed to load event. Please try again.'
        );
        router.push(ROUTES.PROTECTED.EVENTS);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const onSubmit = async (data: Partial<EventFormData>) => {
    if (!eventId || Number.isNaN(eventId)) return;
    setIsSubmitting(true);
    try {
      await updateEvent(eventId, data);
      toast.success('Event updated successfully!');
      router.push(ROUTES.PROTECTED.EVENT_DETAIL(slug));
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update event. Please try again.';
      toast.error('Error updating event', message);
      // eslint-disable-next-line no-console
      console.error('Update event error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <>
        <AuthNav />

        <Box as="main" minH="calc(100vh - 140px)" bg={THEME.COLORS.background}>
          {loading ? (
            <Center py={20}>
              <Spinner size="xl" color={THEME.COLORS.primary} />
            </Center>
          ) : event ? (
            <>
              {/* PAGE HEADER */}
              <Box bg="white" borderBottom="1px" borderColor="gray.200" py={6}>
                <Container maxW="container.xl">
                  <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                    <Stack gap={1}>
                      <Heading fontSize="2xl" color={THEME.COLORS.primary}>
                        Edit Event
                      </Heading>
                      <Text color="gray.600">
                        Update the details of {event.event_name}
                      </Text>
                    </Stack>

                    <Link href={ROUTES.PROTECTED.EVENT_DETAIL(slug)}>
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
                          <Icon as={FiX} />
                        </Box>
                        Cancel
                      </Button>
                    </Link>
                  </Flex>
                </Container>
              </Box>

              {/* CLOSED WARNING (extra guard) */}
              {event.status === 'closed' && (
                <Container maxW="container.md" pt={4}>
                  <Box
                    bg="red.50"
                    borderRadius="md"
                    p={4}
                    borderLeft="4px solid"
                    borderColor="red.400"
                  >
                    <Flex align="center" gap={3}>
                      <Icon as={FiAlertTriangle} color="red.500" />
                      <Text fontSize="sm" color="gray.800">
                        This event is closed and cannot be edited. Please reopen the event first.
                      </Text>
                    </Flex>
                  </Box>
                </Container>
              )}

              {/* FORM CONTENT */}
              <Container maxW="container.md" py={8}>
                <Box bg="white" borderRadius="xl" boxShadow="md" p={8}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap={6}>
                      {/* EVENT TYPE */}
                      <Field.Root invalid={!!errors.event_type} required>
                        <Field.Label fontWeight="semibold" color="gray.700">
                          Event Type
                        </Field.Label>
                        <Box
                          as="select"
                          {...register('event_type')}
                          w="100%"
                          h="46px"
                          pl="0.75rem"
                          pr="0.5rem"
                          borderRadius="md"
                          border="2px solid"
                          borderColor="gray.200"
                          bg="white"
                          color={THEME.COLORS.textPrimary}
                          fontSize="sm"
                          _focus={{
                            borderColor: THEME.COLORS.primary,
                            boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                            outline: 'none',
                          }}
                          transition="all 0.2s"
                          cursor="pointer"
                        >
                          {EVENT_TYPES.map((type) => (
                            <option
                              key={type.value}
                              value={type.value}
                              style={{ backgroundColor: '#fff' }}
                            >
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </Box>
                        <Field.ErrorText>{errors.event_type?.message}</Field.ErrorText>
                      </Field.Root>

                      {/* EVENT NAME */}
                      <Field.Root invalid={!!errors.event_name} required>
                        <Field.Label fontWeight="semibold" color="gray.700">
                          Event Name
                        </Field.Label>
                        <Input
                          placeholder="e.g., John & Mary Wedding"
                          borderRadius="md"
                          borderColor="gray.200"
                          _focus={{
                            borderColor: THEME.COLORS.primary,
                            boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                            outline: 'none',
                          }}
                          {...register('event_name')}
                        />
                        <Field.ErrorText>{errors.event_name?.message}</Field.ErrorText>
                      </Field.Root>

                      {/* DATE & TIME */}
                      <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                        <Field.Root invalid={!!errors.event_date} required flex="1">
                          <Field.Label fontWeight="semibold" color="gray.700">
                            Event Date
                          </Field.Label>
                          <Input
                            type="date"
                            borderRadius="md"
                            borderColor="gray.200"
                            min={new Date().toISOString().split('T')[0]}
                            _focus={{
                              borderColor: THEME.COLORS.primary,
                              boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                              outline: 'none',
                            }}
                            {...register('event_date')}
                          />
                          <Field.ErrorText>{errors.event_date?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.event_time} required flex="1">
                          <Field.Label fontWeight="semibold" color="gray.700">
                            Event Time
                          </Field.Label>
                          <Input
                            type="time"
                            borderRadius="md"
                            borderColor="gray.200"
                            _focus={{
                              borderColor: THEME.COLORS.primary,
                              boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                              outline: 'none',
                            }}
                            {...register('event_time')}
                          />
                          <Field.ErrorText>{errors.event_time?.message}</Field.ErrorText>
                        </Field.Root>
                      </Stack>

                      {/* LOCATION */}
                      <Field.Root invalid={!!errors.event_location} required>
                        <Field.Label fontWeight="semibold" color="gray.700">
                          Event Location
                        </Field.Label>
                        <Input
                          placeholder="e.g., Safari Park Hotel, Nairobi"
                          borderRadius="md"
                          borderColor="gray.200"
                          _focus={{
                            borderColor: THEME.COLORS.primary,
                            boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                            outline: 'none',
                          }}
                          {...register('event_location')}
                        />
                        <Field.ErrorText>{errors.event_location?.message}</Field.ErrorText>
                      </Field.Root>

                      {/* DESCRIPTION */}
                      <Field.Root invalid={!!errors.event_description}>
                        <Field.Label fontWeight="semibold" color="gray.700">
                          Event Description
                        </Field.Label>
                        <Textarea
                          placeholder="Add any additional details about your event..."
                          rows={6}
                          borderRadius="md"
                          borderColor="gray.200"
                          _focus={{
                            borderColor: THEME.COLORS.primary,
                            boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                            outline: 'none',
                          }}
                          {...register('event_description')}
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          Optional - Describe what guests should know
                        </Text>
                        <Field.ErrorText>{errors.event_description?.message}</Field.ErrorText>
                      </Field.Root>

                      {/* STATUS */}
                      <Field.Root invalid={!!errors.status}>
                        <Field.Label fontWeight="semibold" color="gray.700">
                          Event Status
                        </Field.Label>
                        <Box
                          as="select"
                          {...register('status')}
                          w="100%"
                          h="46px"
                          pl="0.75rem"
                          pr="0.5rem"
                          borderRadius="md"
                          border="2px solid"
                          borderColor="gray.200"
                          bg="white"
                          color={THEME.COLORS.textPrimary}
                          fontSize="sm"
                          _focus={{
                            borderColor: THEME.COLORS.primary,
                            boxShadow: `0 0 0 3px ${THEME.COLORS.primary}20`,
                            outline: 'none',
                          }}
                          transition="all 0.2s"
                          cursor="pointer"
                        >
                          {EVENT_STATUSES.map((status) => (
                            <option
                              key={status.value}
                              value={status.value}
                              style={{ backgroundColor: '#fff' }}
                            >
                              {status.label} - {status.description}
                            </option>
                          ))}
                        </Box>
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          Change status to control event visibility and editability
                        </Text>
                        <Field.ErrorText>{errors.status?.message}</Field.ErrorText>
                      </Field.Root>

                      {/* WARNING WHEN CLOSING */}
                      {watchStatus === 'closed' && (
                        <Box
                          bg="orange.50"
                          p={4}
                          borderRadius="md"
                          borderLeft="4px solid"
                          borderColor="orange.400"
                        >
                          <Flex align="start" gap={3}>
                            <Icon
                              as={FiAlertTriangle}
                              color="orange.500"
                              w={5}
                              h={5}
                              mt={0.5}
                            />
                            <Text fontSize="sm" color="gray.700">
                              Closing this event will prevent further edits. You can reopen it later
                              from the event details page.
                            </Text>
                          </Flex>
                        </Box>
                      )}

                      {/* ACTION BUTTONS */}
                      <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                        <Button
                          type="submit"
                          flex="1"
                          loading={isSubmitting}
                          {...THEME.BUTTON_STYLES.primaryButton}
                        >
                          <Box
                            as="span"
                            display="inline-flex"
                            alignItems="center"
                            mr={2}
                          >
                            <Icon as={FiSave} />
                          </Box>
                          Save Changes
                        </Button>
                        <Link href={ROUTES.PROTECTED.EVENT_DETAIL(slug)} style={{ flex: 1 }}>
                          <Button
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


