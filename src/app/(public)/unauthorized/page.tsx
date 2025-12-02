'use client';

import { Box, Container, Heading, Text, Stack, Button, Icon } from '@chakra-ui/react';
import { FiLock, FiLogIn, FiHome } from 'react-icons/fi';
import Link from 'next/link';
import { ROUTES, THEME } from '@/src/lib/constants';

/**
 * Unauthorized Access Page Component
 *
 * Shown when a user attempts to access a page they are not authorized to view.
 * Provides clear messaging and actions to either login or return to the homepage.
 */
export default function UnauthorizedPage() {
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
              {/* LOCK ICON */}
              <Box bg="red.50" borderRadius="full" p={5}>
                <Icon as={FiLock} w={16} h={16} color="red.500" />
              </Box>

              {/* STATUS CODE */}
              <Text
                fontSize={{ base: '3xl', md: '5xl' }}
                fontWeight="bold"
                color="red.500"
              >
                403
              </Text>

              {/* HEADING */}
              <Heading
                fontSize={{ base: '2xl', md: '3xl' }}
                color={THEME.COLORS.primary}
              >
                Access Denied
              </Heading>

              {/* MESSAGE */}
              <Stack gap={3} maxW="lg">
                <Text color="gray.600" fontSize="md">
                  You don&apos;t have permission to access this page.
                </Text>
                <Text color="gray.600">
                  If you believe this is an error, please contact support or try logging in again.
                </Text>
              </Stack>

              {/* ACTION BUTTONS */}
              <Stack
                direction={{ base: 'column', md: 'row' }}
                gap={4}
                w="full"
                maxW="md"
              >
                {/* LOGIN */}
                <Link href={ROUTES.PUBLIC.LOGIN} style={{ width: '100%' }}>
                  <Button
                    w="full"
                    {...THEME.BUTTON_STYLES.primaryButton}
                  >
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      mr={2}
                    >
                      <FiLogIn size={18} />
                    </Box>
                    Login
                  </Button>
                </Link>

                {/* HOME */}
                <Link href={ROUTES.PUBLIC.HOME} style={{ width: '100%' }}>
                  <Button
                    w="full"
                    {...THEME.BUTTON_STYLES.secondaryButton}
                    variant="outline"
                  >
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      mr={2}
                    >
                      <FiHome size={18} />
                    </Box>
                    Go to Homepage
                  </Button>
                </Link>
              </Stack>

              {/* COPYRIGHT */}
              <Text mt={12} mb={4} color="gray.400" fontSize="sm">
                © 2025 Ekadi Platform. All rights reserved.
              </Text>
            </Stack>
        </Container>
      </Box>
    </>
  );
}


