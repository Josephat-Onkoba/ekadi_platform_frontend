/**
 * Authenticated Navigation Bar Component - Improved Version
 * 
 * Enhancements:
 * - Better mobile responsiveness with mobile menu
 * - Improved accessibility with ARIA labels
 * - Loading states for user data
 * - Better error handling
 * - Active link indication
 * - Skeleton loading for avatar
 * - Smoother animations
 * 
 * @module AuthNav
 */

'use client';

import {
  Box,
  Flex,
  Button,
  Text,
  Container,
  Avatar,
  IconButton,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
  Stack,
  Badge,
  Skeleton,
  SkeletonCircle,
  Separator,
} from '@chakra-ui/react';
import { 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiHome, 
  FiMenu,
  FiChevronDown,
  FiX,
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROUTES, THEME } from '@/src/lib/constants';
import { useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface NavLinkProps {
  href: string;
  icon: any;
  label: string;
  isActive?: boolean;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Desktop Navigation Link Component
 */
const DesktopNavLink = ({ href, icon: IconComponent, label, isActive }: NavLinkProps) => {
  if (!IconComponent) return null;
  
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        color={isActive ? THEME.COLORS.primary : 'gray.700'}
        bg={isActive ? THEME.COLORS.background : 'transparent'}
        _hover={{ 
          bg: isActive ? 'gray.100' : 'gray.50',
          color: THEME.COLORS.primary,
        }}
        fontWeight={isActive ? 'semibold' : 'medium'}
        fontSize="sm"
        transition="all 0.2s"
      >
        <Box as="span" mr={2} display="inline-flex" alignItems="center">
          <IconComponent size={16} />
        </Box>
        {label}
      </Button>
    </Link>
  );
};

/**
 * Mobile Navigation Link Component
 */
const MobileNavLink = ({ href, icon: IconComponent, label, isActive }: NavLinkProps) => {
  if (!IconComponent) return null;
  
  return (
    <Link href={href} style={{ width: '100%' }}>
      <Button
        w="full"
        justifyContent="flex-start"
        variant="ghost"
        color={isActive ? THEME.COLORS.primary : 'gray.700'}
        bg={isActive ? THEME.COLORS.background : 'transparent'}
        _hover={{ 
          bg: isActive ? 'gray.100' : 'gray.50',
          color: THEME.COLORS.primary,
        }}
        fontWeight={isActive ? 'semibold' : 'medium'}
        size="lg"
      >
        <Box as="span" mr={2} display="inline-flex" alignItems="center">
          <IconComponent size={20} />
        </Box>
        {label}
      </Button>
    </Link>
  );
};

/**
 * User Profile Menu Content
 */
const UserProfileMenu = ({ 
  user, 
  onLogout,
  onClose
}: { 
  user: any; 
  onLogout: () => void;
  onClose: () => void;
}) => (
  <Stack direction="column" gap={0} align="stretch" w="220px">
    {/* User Info Section */}
    <Box px={3} py={2}>
      <Text fontSize="sm" fontWeight="semibold" color="gray.800">
        {user?.first_name} {user?.last_name}
      </Text>
      <Text fontSize="xs" color="gray.500" mt={0.5}>
        {user?.email}
      </Text>
      {user?.profile?.user_type && (
        <Badge 
          colorScheme="teal" 
          fontSize="2xs" 
          mt={2}
          textTransform="capitalize"
        >
          {user.profile.user_type} Account
        </Badge>
      )}
    </Box>

    <Separator />

    {/* Navigation Links */}
    <Link href={ROUTES.PROTECTED.PROFILE} onClick={onClose}>
      <Button
        w="full"
        justifyContent="flex-start"
        variant="ghost"
        fontSize="sm"
        borderRadius={0}
        _hover={{ bg: 'gray.50', color: THEME.COLORS.primary }}
      >
        <Box as="span" mr={2} display="inline-flex" alignItems="center">
          <FiUser size={16} />
        </Box>
        Profile
      </Button>
    </Link>

    <Link href={ROUTES.PROTECTED.SETTINGS} onClick={onClose}>
      <Button
        w="full"
        justifyContent="flex-start"
        variant="ghost"
        fontSize="sm"
        borderRadius={0}
        _hover={{ bg: 'gray.50', color: THEME.COLORS.primary }}
      >
        <Box as="span" mr={2} display="inline-flex" alignItems="center">
          <FiSettings size={16} />
        </Box>
        Settings
      </Button>
    </Link>

    <Separator />

    {/* Logout Button */}
    <Button
      w="full"
      justifyContent="flex-start"
      variant="ghost"
      onClick={onLogout}
      color="red.500"
      fontSize="sm"
      borderRadius={0}
      _hover={{ bg: 'red.50' }}
    >
      <Box as="span" mr={2} display="inline-flex" alignItems="center">
        <FiLogOut size={16} />
      </Box>
      Logout
    </Button>
  </Stack>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Authenticated Navigation Bar Component
 * 
 * Displays navigation for authenticated users with:
 * - Responsive mobile menu
 * - Active link indication
 * - Profile dropdown with user info
 * - Logout functionality
 * 
 * @returns Navigation bar component
 */
export default function AuthNav() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  /**
   * Check if a route is currently active
   */
  const isActiveRoute = (route: string): boolean => {
    return pathname === route;
  };

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Close mobile menu
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation items configuration
  const navItems = [
    {
      href: ROUTES.PROTECTED.DASHBOARD,
      icon: FiHome,
      label: 'Dashboard',
    },
    // Add more nav items here for future features
    // { href: '/events', icon: FiCalendar, label: 'Events' },
    // { href: '/cards', icon: FiCreditCard, label: 'Cards' },
  ];

  return (
    <>
      <Box
        as="nav"
        bg="white"
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={100}
        h="70px"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Container maxW="container.xl" h="full">
          <Flex justify="space-between" align="center" h="full">
            {/* LEFT - Logo */}
            <Link href={ROUTES.PROTECTED.DASHBOARD} aria-label="Go to dashboard">
              <Flex gap={2} align="center">
                <Text 
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold" 
                  color={THEME.COLORS.primary}
                  _hover={{ opacity: 0.8 }}
                  transition="opacity 0.2s"
                >
                  Ekadi
                </Text>
              </Flex>
            </Link>

            {/* CENTER - Desktop Navigation */}
            <Flex 
              gap={2} 
              display={{ base: 'none', md: 'flex' }}
              align="center"
            >
              {navItems.map((item) => (
                <DesktopNavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActiveRoute(item.href)}
                />
              ))}
            </Flex>

            {/* RIGHT - Profile Menu & Mobile Toggle */}
            <Flex align="center" gap={3}>
              {/* Profile Menu - Desktop */}
              <Box position="relative" display={{ base: 'none', sm: 'block' }}>
                <Button
                  variant="ghost"
                  p={0}
                  h="auto"
                  minW="auto"
                  _hover={{ bg: 'transparent' }}
                  _active={{ bg: 'transparent' }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <Flex gap={2} align="center">
                    {loading ? (
                      <SkeletonCircle size="8" />
                    ) : (
                      <Avatar.Root size="sm">
                        <Avatar.Image 
                          src={user?.profile?.profile_picture || undefined}
                        />
                        <Avatar.Fallback bg={THEME.COLORS.primary}>
                          {user?.first_name?.[0]}{user?.last_name?.[0]}
                        </Avatar.Fallback>
                      </Avatar.Root>
                    )}
                    <Box as="span" display="inline-flex" alignItems="center">
                      <FiChevronDown size={16} />
                    </Box>
                  </Flex>
                </Button>

                {isProfileMenuOpen && (
                  <>
                    <Box
                      position="fixed"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      zIndex={998}
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <Box
                      position="absolute"
                      top="100%"
                      right={0}
                      mt={2}
                      bg="white"
                      py={2}
                      boxShadow="lg"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      zIndex={999}
                      minW="220px"
                    >
                      {loading ? (
                        <Box px={3} py={2}>
                          <Skeleton height="20px" mb={2} />
                          <Skeleton height="16px" width="80%" />
                        </Box>
                      ) : (
                        <UserProfileMenu 
                          user={user} 
                          onLogout={handleLogout}
                          onClose={() => setIsProfileMenuOpen(false)}
                        />
                      )}
                    </Box>
                  </>
                )}
              </Box>

              {/* Mobile Menu Toggle */}
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={() => setIsMobileMenuOpen(true)}
                variant="ghost"
                aria-label="Open navigation menu"
                color="gray.700"
                _hover={{ bg: 'gray.50' }}
                size="lg"
                minW="44px"
                minH="44px"
              >
                <FiMenu size={24} />
              </IconButton>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Menu Drawer */}
      <DrawerRoot
        open={isMobileMenuOpen}
        onOpenChange={(e) => {
          if (!e.open) closeMobileMenu();
        }}
        placement="end"
        size="xs"
      >
        <DrawerBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold" color={THEME.COLORS.primary}>
                Menu
              </Text>
              <DrawerCloseTrigger asChild>
                <IconButton
                  variant="ghost"
                  aria-label="Close menu"
                  size="lg"
                  color={THEME.COLORS.primary}
                  _hover={{ 
                    bg: THEME.COLORS.background,
                    color: THEME.COLORS.primary,
                    transform: 'rotate(90deg)'
                  }}
                  transition="all 0.2s"
                  borderRadius="full"
                  minW="44px"
                  minH="44px"
                >
                  <FiX size={24} />
                </IconButton>
              </DrawerCloseTrigger>
            </Flex>
          </DrawerHeader>

          <DrawerBody p={4}>
            <Stack direction="column" gap={6} align="stretch">
              {/* User Info in Mobile Menu */}
              {loading ? (
                <Flex gap={3} align="center">
                  <SkeletonCircle size="12" />
                  <Stack direction="column" align="start" gap={1} flex={1}>
                    <Skeleton height="16px" width="80%" />
                    <Skeleton height="14px" width="60%" />
                  </Stack>
                </Flex>
              ) : (
                <Flex gap={3} align="center" pb={4} borderBottom="1px solid" borderColor="gray.200">
                  <Avatar.Root size="md">
                    <Avatar.Image 
                      src={user?.profile?.profile_picture || undefined}
                    />
                    <Avatar.Fallback bg={THEME.COLORS.primary}>
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <Stack direction="column" align="start" gap={0}>
                    <Text fontSize="sm" fontWeight="semibold">
                      {user?.first_name} {user?.last_name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {user?.email}
                    </Text>
                  </Stack>
                </Flex>
              )}

              {/* Navigation Links */}
              <Stack direction="column" gap={2} align="stretch">
                <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={1}>
                  Navigation
                </Text>
                {navItems.map((item) => (
                  <Box key={item.href} onClick={closeMobileMenu}>
                    <MobileNavLink
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={isActiveRoute(item.href)}
                    />
                  </Box>
                ))}
              </Stack>

              {/* Account Links */}
              <Stack direction="column" gap={2} align="stretch">
                <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={1}>
                  Account
                </Text>
                <Box onClick={closeMobileMenu}>
                  <Link href={ROUTES.PROTECTED.PROFILE} style={{ width: '100%' }}>
                    <Button
                      w="full"
                      justifyContent="flex-start"
                      variant="ghost"
                      size="lg"
                    >
                      <Box as="span" mr={2} display="inline-flex" alignItems="center">
                        <FiUser size={20} />
                      </Box>
                      Profile
                    </Button>
                  </Link>
                </Box>
                <Box onClick={closeMobileMenu}>
                  <Link href={ROUTES.PROTECTED.SETTINGS} style={{ width: '100%' }}>
                    <Button
                      w="full"
                      justifyContent="flex-start"
                      variant="ghost"
                      size="lg"
                    >
                      <Box as="span" mr={2} display="inline-flex" alignItems="center">
                        <FiSettings size={20} />
                      </Box>
                      Settings
                    </Button>
                  </Link>
                </Box>
              </Stack>

              {/* Logout Button */}
              <Button
                w="full"
                onClick={handleLogout}
                colorScheme="red"
                variant="ghost"
                size="lg"
                mt={4}
              >
                <Box as="span" mr={2} display="inline-flex" alignItems="center">
                  <FiLogOut size={20} />
                </Box>
                Logout
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
}