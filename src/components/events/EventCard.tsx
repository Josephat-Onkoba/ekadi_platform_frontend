import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';
import {
  formatEventDate,
  formatEventTime,
  getEventTypeIcon,
} from '@/src/lib/events';
import { ROUTES, THEME } from '@/src/lib/constants';
import type { EventListItem } from '@/src/types';
import { encodeEventId } from '@/src/lib/id';

interface EventCardProps {
  event: EventListItem;
  onClick?: () => void;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'draft':
      return `${THEME.COLORS.primary}40`;
    case 'active':
      return 'green.400';
    case 'closed':
      return 'red.400';
    default:
      return 'gray.300';
  }
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const slug = encodeEventId(event.id);

  return (
    <Link href={ROUTES.PROTECTED.EVENT_DETAIL(slug)}>
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="md"
        p={6}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          boxShadow: 'xl',
          transform: 'translateY(-4px)',
          borderColor: THEME.COLORS.accent,
        }}
        border="2px"
        borderColor="transparent"
        borderLeft="4px"
        borderLeftColor={getStatusColor(event.status)}
        onClick={onClick}
      >
        <Stack gap={4}>
          {/* HEADER - Icon & Status */}
          <Flex justify="space-between" align="start">
            <Text fontSize="4xl" lineHeight="1">
              {getEventTypeIcon(event.event_type)}
            </Text>
            <Badge
              colorScheme={
                event.status === 'active'
                  ? 'green'
                  : event.status === 'closed'
                  ? 'red'
                  : 'gray'
              }
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              textTransform="uppercase"
              fontWeight="bold"
            >
              {event.status_display}
            </Badge>
          </Flex>

          {/* EVENT NAME */}
          <Heading
            fontSize="lg"
            color={THEME.COLORS.primary}
            fontWeight="bold"
            css={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.event_name}
          </Heading>

          {/* EVENT TYPE */}
          <Text
            fontSize="sm"
            color="gray.600"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="0.1em"
          >
            {event.event_type_display}
          </Text>

          {/* DETAILS SECTION */}
          <Stack gap={2} fontSize="sm" color="gray.600">
            {/* DATE */}
            <Flex align="center" gap={2}>
              <Icon as={FiCalendar} w={4} h={4} color={THEME.COLORS.primary} />
              <Text fontWeight="medium">
                {formatEventDate(event.event_date)}
              </Text>
            </Flex>

            {/* TIME */}
            <Flex align="center" gap={2}>
              <Icon as={FiClock} w={4} h={4} color={THEME.COLORS.primary} />
              <Text fontWeight="medium">
                {formatEventTime(event.event_time)}
              </Text>
            </Flex>

            {/* LOCATION */}
            <Flex align="center" gap={2}>
              <Icon as={FiMapPin} w={4} h={4} color={THEME.COLORS.primary} />
              <Text
                fontWeight="medium"
                css={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {event.event_location}
              </Text>
            </Flex>
          </Stack>

          {/* FOOTER - Timing Indicator */}
          <Flex
            justify="space-between"
            align="center"
            pt={2}
            borderTop="1px"
            borderColor="gray.100"
          >
            {event.is_upcoming ? (
              <Badge colorScheme="green" variant="subtle" fontSize="xs">
                🔔 Upcoming
              </Badge>
            ) : event.is_past ? (
              <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                📅 Past
              </Badge>
            ) : (
              <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                ✨ Active
              </Badge>
            )}

            <Text fontSize="xs" color="gray.500">
              By {event.created_by_name}
            </Text>
          </Flex>
        </Stack>
      </Box>
    </Link>
  );
}


