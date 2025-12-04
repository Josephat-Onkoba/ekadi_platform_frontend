/**
 * Public Navigation Bar Component - Enhanced Version
 * 
 * Enhancements over original:
 * - Removed unnecessary mounted state (causes hydration issues)
 * - Added mobile responsive drawer menu
 * - Active route highlighting
 * - Better accessibility with ARIA labels
 * - Smooth scroll indicator
 * - Better icon usage
 * - Improved animations
 * - Optional navigation links section
 * 
 * @module PublicNav
 */

'use client';

import {
  Box,
  Flex,
  Button,
  Text,
  Container,
  Icon,
  VStack,
  HStack,
} from '@chakra-ui/react';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from '@chakra-ui/react';
import { 
  FiMenu, 
  FiLogIn, 
  FiUserPlus, 
  FiInfo,
  FiX,
} from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES, THEME } from '@/src/lib/constants';
import { useEffect, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface NavLinkProps {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  sectionId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Desktop Navigation Link
 */
const DesktopNavLink = ({ href, label, isActive, sectionId, onScrollToSection }: NavLinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (sectionId && onScrollToSection) {
      e.preventDefault();
      onScrollToSection(sectionId);
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
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
        size="sm"
      >
        {label}
      </Button>
    </Link>
  );
};

/**
 * Mobile Navigation Link
 */
const MobileNavLink = ({ href, label, isActive, onClick, sectionId, onScrollToSection }: NavLinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (sectionId && onScrollToSection) {
      e.preventDefault();
      onScrollToSection(sectionId);
      if (onClick) onClick();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href} style={{ width: '100%' }} onClick={handleClick}>
      <Button
        w="full"
        justifyContent="flex-start"
        variant="ghost"
        color="gray.700"
        bg="transparent"
        _hover={{ 
          bg: THEME.COLORS.background,
          color: THEME.COLORS.accent,
          transform: 'translateX(4px)',
        }}
        fontWeight="medium"
        size="lg"
        borderRadius="lg"
        transition="all 0.2s"
        position="relative"
        pl={4}
        borderLeft="3px solid"
        borderColor="transparent"
        _active={{
          borderColor: THEME.COLORS.primary,
          color: THEME.COLORS.primary,
        }}
      >
        {label}
      </Button>
    </Link>
  );
};

/**
 * Scroll Progress Indicator
 */
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      h="2px"
      bg="gray.100"
    >
      <Box
        h="full"
        w={`${scrollProgress}%`}
        bg={THEME.COLORS.primary}
        transition="width 0.1s ease-out"
      />
    </Box>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Public Navigation Bar Component
 * 
 * Navigation for unauthenticated users with:
 * - Responsive mobile menu
 * - Login and register CTAs
 * - Optional navigation links
 * - Active route highlighting
 * - Scroll progress indicator
 * 
 * @returns Navigation bar component
 */
export default function PublicNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  /**
   * Handle scroll effect for nav shadow
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Check if a route is currently active
   */
  const isActiveRoute = (route: string): boolean => {
    return pathname === route;
  };

  /**
   * Handle smooth scroll to section
   */
  const handleScrollToSection = (sectionId: string) => {
    if (pathname !== ROUTES.PUBLIC.HOME) {
      // If not on home page, navigate to home first
      window.location.href = `${ROUTES.PUBLIC.HOME}#${sectionId}`;
    } else {
      // If on home page, smooth scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsOpen(false); // Close mobile menu if open
      }
    }
  };

  // Navigation links for landing page sections
  const navItems = [
    { href: '#features', label: 'Features', sectionId: 'features' },
    { href: '#how-it-works', label: 'How It Works', sectionId: 'how-it-works' },
    { href: '#testimonials', label: 'Testimonials', sectionId: 'testimonials' },
    { href: '#benefits', label: 'Benefits', sectionId: 'benefits' },
  ];

  return (
    <>
      <Box
        as="nav"
        bg="white"
        boxShadow={isScrolled ? 'md' : 'sm'}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={999}
        h="70px"
        borderBottom="1px solid"
        borderColor="gray.100"
        transition="box-shadow 0.2s"
      >
        <Container maxW="container.xl" h="full">
          <Flex justify="space-between" align="center" h="full">
            {/* LEFT - Logo */}
            <Link href={ROUTES.PUBLIC.HOME} aria-label="Go to homepage">
              <HStack gap={2} cursor="pointer">
                <Text 
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold" 
                  color={THEME.COLORS.primary}
                  _hover={{ opacity: 0.8 }}
                  transition="opacity 0.2s"
                >
                  Ekadi
                </Text>
              </HStack>
            </Link>

            {/* CENTER - Desktop Navigation */}
            <Flex
              gap={6}
              display={{ base: 'none', md: 'flex' }}
              align="center"
              justify="center"
              ml={8}
              flex="1"
            >
              {navItems.length > 0 && (
                <Flex gap={2} align="center">
                  {navItems.map((item) => (
                    <DesktopNavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      isActive={isActiveRoute(item.href)}
                      sectionId={item.sectionId}
                      onScrollToSection={handleScrollToSection}
                    />
                  ))}
                </Flex>
              )}

              {/* Desktop Pricing Link */}
              <Link href={ROUTES.PUBLIC.PRICING}>
                <Text
                  color="gray.700"
                  fontWeight="medium"
                  fontSize="sm"
                  _hover={{ color: THEME.COLORS.primary }}
                  transition="color 0.2s"
                >
                  Pricing
                </Text>
              </Link>
            </Flex>

            {/* RIGHT - Auth Buttons */}
            <Flex align="center" gap={3}>
              {/* Desktop Auth Buttons */}
              <HStack gap={2} display={{ base: 'none', md: 'flex' }}>
                <Link href={ROUTES.PUBLIC.LOGIN}>
                  <Button
                    variant="ghost"
                    color="gray.700"
                    _hover={{ bg: 'gray.50', color: THEME.COLORS.primary }}
                    size="md"
                    fontWeight="medium"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={FiLogIn} boxSize={4} />
                    Login
                  </Button>
                </Link>
                <Link href={ROUTES.PUBLIC.REGISTER}>
                  <Button
                    {...THEME.BUTTON_STYLES.primaryButton}
                    size="md"
                    boxShadow="sm"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={FiUserPlus} boxSize={4} />
                    Get Started
                  </Button>
                </Link>
              </HStack>

              {/* Mobile Menu Button */}
              <Button
                display={{ base: 'flex', md: 'none' }}
                onClick={() => setIsOpen(true)}
                aria-label="Open navigation menu"
                bg={THEME.COLORS.primary}
                color="white"
                borderRadius="lg"
                w={11}
                h={11}
                minW={11}
                p={0}
                _hover={{ 
                  bg: THEME.COLORS.primary,
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
                }}
                _active={{
                  bg: THEME.COLORS.primary,
                  transform: 'scale(0.95)',
                }}
                transition="all 0.2s"
              >
                <Icon as={FiMenu} boxSize={6} />
              </Button>
            </Flex>
          </Flex>
        </Container>

        {/* Scroll Progress Indicator */}
        <ScrollProgress />
      </Box>

      {/* Mobile Menu Drawer - Rendered outside nav for proper stacking */}
      <DrawerRoot 
        open={isOpen} 
        onOpenChange={(details) => setIsOpen(details.open)}
        placement="end" 
        size="sm"
      >
                
                <DrawerBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <DrawerContent
          bg="white"
          boxShadow="2xl"
          borderLeftRadius="2xl"
          transition="transform 0.2s ease-out, opacity 0.2s ease-out"
        >
          <DrawerHeader 
            borderBottomWidth="1px" 
            borderColor="gray.100"
            pb={4}
            bg={THEME.COLORS.background}
          >
            <Flex justify="space-between" align="center">
              <HStack gap={2}>
                <Box
                  w={8}
                  h={8}
                  borderRadius="md"
                  bg={THEME.COLORS.primary}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    E
                  </Text>
                </Box>
                <Text fontSize="xl" fontWeight="bold" color={THEME.COLORS.primary}>
                  Menu
                </Text>
              </HStack>
              <DrawerCloseTrigger asChild>
                <Button
                  variant="ghost"
                  aria-label="Close menu"
                  size="lg"
                  color={THEME.COLORS.primary}
                  minW="auto"
                  p={0}
                  _hover={{ 
                    bg: THEME.COLORS.background,
                    color: THEME.COLORS.primary,
                    transform: 'rotate(90deg)'
                  }}
                  transition="all 0.2s"
                  borderRadius="full"
                >
                  <Icon as={FiX} boxSize={6} />
                </Button>
              </DrawerCloseTrigger>
            </Flex>
          </DrawerHeader>

          <DrawerBody p={6} bg="white">
            <VStack gap={6} align="stretch">
              {/* Navigation Links (if any) */}
              {navItems.length > 0 && (
                <VStack gap={3} align="stretch">
                  <Flex align="center" gap={2}>
                    <Box w={1} h={4} bg={THEME.COLORS.primary} borderRadius="full" />
                    <Text 
                      fontSize="xs" 
                      fontWeight="bold" 
                      color={THEME.COLORS.primary} 
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Navigation
                    </Text>
                  </Flex>
                  {navItems.map((item, index) => (
                    <MobileNavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      isActive={pathname === ROUTES.PUBLIC.HOME}
                      onClick={() => setIsOpen(false)}
                      sectionId={item.sectionId}
                      onScrollToSection={handleScrollToSection}
                    />
                  ))}

                  {/* Mobile Pricing Link */}
                  <Link
                    href={ROUTES.PUBLIC.PRICING}
                    onClick={() => setIsOpen(false)}
                    style={{ width: '100%' }}
                  >
                    <Button
                      w="full"
                      justifyContent="flex-start"
                      variant="ghost"
                      color="gray.700"
                      bg="transparent"
                      _hover={{ 
                        bg: THEME.COLORS.background,
                        color: THEME.COLORS.primary,
                        transform: 'translateX(4px)',
                      }}
                      fontWeight="medium"
                      size="lg"
                      borderRadius="lg"
                      transition="all 0.2s"
                    >
                      Pricing
                    </Button>
                  </Link>
                </VStack>
              )}

              {/* Auth Buttons */}
              <VStack gap={4} align="stretch" pt={navItems.length > 0 ? 2 : 0}>
                <Flex align="center" gap={2}>
                  <Box w={1} h={4} bg={THEME.COLORS.accent} borderRadius="full" />
                  <Text 
                    fontSize="xs" 
                    fontWeight="bold" 
                    color={THEME.COLORS.accent} 
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Get Started
                  </Text>
                </Flex>
                <Link href={ROUTES.PUBLIC.LOGIN} onClick={() => setIsOpen(false)} style={{ width: '100%' }}>
                  <Button
                    w="full"
                    variant="outline"
                    borderColor={THEME.COLORS.primary}
                    borderWidth="2px"
                    color={THEME.COLORS.primary}
                    bg="transparent"
                    size="lg"
                    justifyContent="flex-start"
                    borderRadius="lg"
                    h="56px"
                    display="inline-flex"
                    alignItems="center"
                    gap={3}
                    _hover={{
                      bg: THEME.COLORS.primary,
                      color: 'white',
                    }}
                    transition="all 0.2s"
                  >
                    <Icon as={FiLogIn} boxSize={5} />
                    Login
                  </Button>
                </Link>
                <Link href={ROUTES.PUBLIC.REGISTER} onClick={() => setIsOpen(false)} style={{ width: '100%' }}>
                  <Button
                    w="full"
                    bg={THEME.COLORS.accent}
                    color="white"
                    size="lg"
                    justifyContent="flex-start"
                    borderRadius="lg"
                    h="56px"
                    display="inline-flex"
                    alignItems="center"
                    gap={3}
                    boxShadow="0 4px 15px rgba(255, 111, 97, 0.3)"
                    _hover={{
                      bg: '#FF5A4D',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(255, 111, 97, 0.4)',
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    transition="all 0.2s"
                  >
                    <Icon as={FiUserPlus} boxSize={5} />
                    Get Started Free
                  </Button>
                </Link>
              </VStack>

              {/* Help Section */}
              <Box 
                mt={4}
                p={5} 
                bg={THEME.COLORS.background}
                borderRadius="xl"
                border="2px solid"
                borderColor={THEME.COLORS.primary}
                position="relative"
                overflow="hidden"
              >
                {/* Accent corner */}
                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  w={16}
                  h={16}
                  bg={THEME.COLORS.accent}
                  transform="translate(50%, -50%) rotate(45deg)"
                />
                <HStack gap={3} mb={3}>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={THEME.COLORS.accent}
                  >
                    <Icon as={FiInfo} color="white" boxSize={4} />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color={THEME.COLORS.primary}>
                    New to Ekadi?
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" lineHeight="tall">
                  Create stunning event cards and manage RSVPs effortlessly. 
                  Get started with our free plan today!
                </Text>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
}