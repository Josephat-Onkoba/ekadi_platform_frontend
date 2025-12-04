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
  Field,
} from '@chakra-ui/react';
import { FiSave, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/src/lib/events';
import useCustomToast from '@/src/hooks/useToast';
import AuthNav from '@/src/components/layout/AuthNav';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import { ROUTES, THEME, EVENT_TYPES, EVENT_STATUSES } from '@/src/lib/constants';
import type { EventFormData } from '@/src/types';

const eventSchema = z
  .object({
    event_type: z.enum(['wedding', 'send_off', 'conference', 'birthday', 'corporate', 'other']),
    event_name: z
      .string()
      .min(3, 'Event name must be at least 3 characters')
      .max(255, 'Event name must be at most 255 characters'),
    event_location: z.string().min(3, 'Location is required'),
    event_date: z.string().min(1, 'Date is required'),
    event_time: z.string().min(1, 'Time is required'),
    event_description: z.string().optional(),
    status: z.enum(['draft', 'active', 'closed']),
  })
  .refine((data) => {
    if (!data.event_date) {
      return true;
    }

    const selectedDate = new Date(data.event_date);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, {
    path: ['event_date'],
    message: 'Event date cannot be in the past',
  });

type CreateEventFormValues = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_type: 'wedding',
      event_name: '',
      event_location: '',
      event_date: '',
      event_time: '',
      event_description: '',
      status: 'draft',
    },
  });

  const onSubmit = async (data: CreateEventFormValues) => {
    setIsSubmitting(true);
    try {
      await createEvent(data);
      toast.success('Event created successfully!');
      router.push(ROUTES.PROTECTED.EVENTS);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create event. Please try again.';
      toast.error('Error creating event', errorMessage);
      console.error('Create event error:', error);
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
                <Stack gap={1}>
                  <Heading fontSize="2xl" color={THEME.COLORS.primary}>
                    Create New Event
                  </Heading>
                  <Text color="gray.600">
                    Fill in the details below to create your event
                  </Text>
                </Stack>

                <Link href={ROUTES.PROTECTED.EVENTS}>
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
                      <option value="" style={{ backgroundColor: '#fff' }}>
                        Select event type
                      </option>
                      {EVENT_TYPES.map((type) => (
                        <option key={type.value} value={type.value} style={{ backgroundColor: '#fff' }}>
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
                        <option key={status.value} value={status.value} style={{ backgroundColor: '#fff' }}>
                          {status.label} - {status.description}
                        </option>
                      ))}
                    </Box>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Save as draft to edit later, or publish as active
                    </Text>
                    <Field.ErrorText>{errors.status?.message}</Field.ErrorText>
                  </Field.Root>

                  {/* INFO BOX */}
                  <Box
                    bg="blue.50"
                    p={4}
                    borderRadius="md"
                    borderLeft="4px"
                    borderColor="blue.400"
                  >
                    <Stack gap={2}>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                        📌 Quick Tips
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        • Choose 'Draft' to save and continue editing later
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        • Set to 'Active' when ready to send invitations
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        • You can close the event after it concludes
                      </Text>
                    </Stack>
                  </Box>

                  {/* ACTION BUTTONS */}
                  <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      flex="1"
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
                      Create Event
                    </Button>
                    <Link href={ROUTES.PROTECTED.EVENTS} style={{ flex: 1 }}>
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

