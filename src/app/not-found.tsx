'use client';

import { Box, Container, Heading, Text, Stack, Button, Icon } from '@chakra-ui/react';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { ROUTES, THEME } from '@/src/lib/constants';

/**
 * 404 Not Found Page Component
 * 
 * Displays a user-friendly error page when a requested route doesn't exist.
 * Provides navigation options to return home or go back to the previous page.
 * 
 * Features:
 * - Large 404 number for clear visual indication
 * - Helpful message explaining the error
 * - Action buttons to navigate away from the error
 * - Responsive design with mobile-first approach
 * - Consistent with app theme and styling
 * 
 * @returns 404 error page component
 */
export default function NotFoundPage() {
  return (
    <>
      <Box
        as="main"
        minH="calc(100vh - 140px)"
        bg={THEME.COLORS.background}
        display="flex"
        alignItems="center"
      >
        <Container maxW="container.md" py={{ base: 12, md: 16 }}>
          <Stack gap={6} align="center" textAlign="center">
            {/* SEARCH ICON */}
            <Box bg="red.50" borderRadius="full" p={5}>
              <Icon as={FiSearch} w={16} h={16} color="red.500" />
            </Box>

            {/* 404 NUMBER */}
            <Text
              fontSize={{ base: '4xl', md: '7xl' }}
              fontWeight="bold"
              color={THEME.COLORS.primary}
              lineHeight="1"
            >
              404
            </Text>

            {/* HEADING */}
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              color="gray.800"
            >
              Page Not Found
            </Heading>

            {/* MESSAGE */}
            <Text color="gray.600" fontSize="md" maxW="md">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </Text>

            {/* ACTION BUTTONS */}
            <Stack
              direction={{ base: 'column', md: 'row' }}
              gap={4}
              w="full"
              maxW="md"
            >
              {/* GO HOME */}
              <Link href={ROUTES.PUBLIC.HOME} style={{ width: '100%' }}>
                <Button w="full" {...THEME.BUTTON_STYLES.primaryButton}>
                  <Icon as={FiHome} mr={2} />
                  Go to Homepage
                </Button>
              </Link>

              {/* GO BACK */}
              <Button
                w="full"
                onClick={() => window.history.back()}
                {...THEME.BUTTON_STYLES.secondaryButton}
                variant="outline"
              >
                <Icon as={FiArrowLeft} mr={2} />
                Go Back
              </Button>
            </Stack>

            {/* COPYRIGHT AT THE BOTTOM */}
            <Text mt={12} mb={4} color="gray.400" fontSize="sm">
              © 2025 Ekadi Platform. All rights reserved.
            </Text>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
