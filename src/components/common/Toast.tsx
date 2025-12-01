'use client';

import { useEffect } from 'react';
import { Box, Text, Flex, Icon } from '@chakra-ui/react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const typeConfig = {
  success: {
    icon: FiCheckCircle,
    bg: '#16A34A',
    color: 'white',
  },
  error: {
    icon: FiXCircle,
    bg: '#DC2626',
    color: 'white',
  },
  warning: {
    icon: FiAlertTriangle,
    bg: '#F59E0B',
    color: 'white',
  },
  info: {
    icon: FiInfo,
    bg: '#3B82F6',
    color: 'white',
  },
};

export default function Toast({ id, title, description, type, duration = 4000, onClose }: ToastProps) {
  const config = typeConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <Box
      bg={config.bg}
      color={config.color}
      p={4}
      rounded="lg"
      shadow="lg"
      minW="300px"
      maxW="500px"
      mb={3}
      cursor="pointer"
      onClick={() => onClose(id)}
      _hover={{ opacity: 0.9 }}
      transition="all 0.2s"
    >
      <Flex align="start" gap={3}>
        <Icon as={config.icon} w={5} h={5} mt={0.5} />
        <Box flex={1}>
          <Text fontWeight="bold" fontSize="sm">
            {title}
          </Text>
          {description && (
            <Text fontSize="sm" mt={1} opacity={0.9}>
              {description}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

