/**
 * Landing Page - Improved Version
 * 
 * Enhancements:
 * - Extracted reusable components
 * - Modern gradient designs
 * - Better mobile responsiveness
 * - Improved accessibility
 * - Smoother animations
 * - Cleaner code organization
 */

'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Icon,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiMail, 
  FiCheckCircle, 
  FiUsers, 
  FiArrowRight,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiStar,
  FiClock,
  FiSmartphone,
  FiEdit3,
  FiSend,
  FiBarChart
} from 'react-icons/fi';
import Link from 'next/link';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import PublicNav from '@/src/components/layout/PublicNav';
import Footer from '@/src/components/layout/Footer';
import { ROUTES, THEME } from '@/src/lib/constants';

// ============================================================================
// TYPES
// ============================================================================

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

interface SectionProps {
  children: ReactNode;
  bg?: string;
  py?: number | { base: number; md: number };
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

/**
 * Feature Card Component
 * Displays a feature with icon, title, and description
 */
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Box 
    textAlign="center"
    bg="white"
    p={{ base: 8, md: 10 }}
    borderRadius="xl"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
    _hover={{ 
      boxShadow: "xl",
      transform: "translateY(-4px)",
      borderColor: THEME.COLORS.primary,
    }}
    transition="all 0.3s ease"
    role="article"
    h="full"
  >
    <Flex justify="center" mb={6}>
      <Box
        p={4}
        borderRadius="xl"
        bg={THEME.COLORS.background}
        _groupHover={{ bg: "gray.100" }}
        transition="background 0.3s"
      >
        <Icon as={icon} boxSize={{ base: 10, md: 12 }} color={THEME.COLORS.primary} />
      </Box>
    </Flex>
    <Heading 
      as="h3" 
      fontSize={{ base: "xl", md: "2xl" }}
      fontWeight="bold" 
      color="gray.800"
      mb={4}
    >
      {title}
    </Heading>
    <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} lineHeight="tall">
      {description}
    </Text>
  </Box>
);

/**
 * Section Wrapper Component
 * Provides consistent spacing and backgrounds for sections
 */
const Section = ({ children, bg = "white", py = { base: 12, md: 20 } }: SectionProps) => (
  <Box as="section" bg={bg} py={py}>
    {children}
  </Box>
);

/**
 * CTA Button Component
 * Primary call-to-action button with consistent styling
 */
const CTAButton = ({ 
  href, 
  children, 
  variant = "primary" 
}: { 
  href: string; 
  children: ReactNode; 
  variant?: "primary" | "secondary";
}) => {
  const isPrimary = variant === "primary";
  
  return (
    <Link href={href}>
      <Button
        size="lg"
        h={{ base: "50px", md: "56px" }}
        px={{ base: 6, md: 8 }}
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="bold"
        borderRadius="lg"
        bg={isPrimary ? "coral.500" : "transparent"}
        color={isPrimary ? "white" : "teal.600"}
        border={isPrimary ? "none" : "2px solid"}
        borderColor={isPrimary ? "transparent" : "teal.600"}
        _hover={{ 
          bg: isPrimary ? "coral.600" : "teal.50",
          transform: 'translateY(-2px)',
          boxShadow: isPrimary ? "0 10px 20px rgba(255, 111, 97, 0.3)" : "md",
        }}
        _active={{
          transform: 'translateY(0)',
        }}
        transition="all 0.3s ease" >
        {children}
      </Button>
    </Link>
  );
};

// ============================================================================
// FEATURES DATA
// ============================================================================

const FEATURES = [
  {
    icon: FiCalendar,
    title: "Event Management",
    description: "Create and manage multiple events with an intuitive dashboard",
  },
  {
    icon: FiMail,
    title: "WhatsApp & SMS",
    description: "Send invitations instantly via WhatsApp and SMS messaging",
  },
  {
    icon: FiCheckCircle,
    title: "RSVP Tracking",
    description: "Track responses in real-time and manage guest lists effortlessly",
  },
  {
    icon: FiUsers,
    title: "Custom Cards",
    description: "Design beautiful invitation cards for any occasion or event",
  },
] as const;

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: FiEdit3,
    title: "Create Your Event",
    description: "Set up your event details, date, time, and location in minutes",
  },
  {
    step: "02",
    icon: FiSmartphone,
    title: "Design Your Card",
    description: "Choose from beautiful templates or create a custom invitation card",
  },
  {
    step: "03",
    icon: FiSend,
    title: "Send Invitations",
    description: "Send invitations via WhatsApp and SMS to all your guests instantly",
  },
  {
    step: "04",
    icon: FiBarChart,
    title: "Track RSVPs",
    description: "Monitor responses in real-time and manage your guest list effortlessly",
  },
] as const;

const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Event Planner",
    company: "Celebrations Co.",
    content: "Ekadi has transformed how I manage events. The WhatsApp integration is a game-changer, and my clients love the beautiful cards!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Wedding Coordinator",
    company: "Dream Weddings",
    content: "The RSVP tracking feature saves me hours every week. I can't imagine planning events without Ekadi now.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Corporate Events Manager",
    company: "TechCorp",
    content: "Professional, efficient, and beautiful. Ekadi makes event management feel effortless. Highly recommended!",
    rating: 5,
  },
] as const;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Landing Page Component
 * Main entry point for unauthenticated users
 */
export default function HomePage() {
  return (
    <>
      <PublicNav />

      <Box as="main" minH="calc(100vh - 70px)">
        {/* ====================================
            HERO SECTION
            ==================================== */}
        <Section 
          bg={THEME.COLORS.background}
          py={{ base: 16, md: 24 }}
        >
          <Container maxW="container.xl">
            <Stack 
              spacing={{ base: 6, md: 8 }} 
              textAlign="center" 
              maxW="4xl" 
              mx="auto"
            >
              {/* Badge */}
              <Flex justify="center">
                <Box
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="white"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text 
                    fontSize="sm" 
                    fontWeight="semibold" 
                    color={THEME.COLORS.primary}
                    letterSpacing="wide"
                  >
                    Event Management Made Simple
                  </Text>
                </Box>
              </Flex>

              {/* Hero Title */}
              <Heading
                as="h1"
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                fontWeight="extrabold"
                lineHeight="shorter"
                color="gray.800"
                letterSpacing="tight"
              >
                Create Stunning Event Cards &{' '}
                <Box 
                  as="span" 
                  color={THEME.COLORS.primary}
                >
                  Manage RSVPs
                </Box>{' '}
                Effortlessly
              </Heading>

              {/* Hero Description */}
              <Text 
                fontSize={{ base: "md", md: "lg", lg: "xl" }} 
                color="gray.600"
                maxW="3xl"
                mx="auto"
                lineHeight="tall"
              >
                Send beautiful digital invitations via WhatsApp & SMS. Track RSVPs and 
                manage your events all in one centralized platform.
              </Text>

              {/* Hero CTA Buttons */}
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                spacing={4}
                justify="center"
                pt={4}
              >
                <Link href={ROUTES.PUBLIC.REGISTER}>
                  <Button
                    {...THEME.BUTTON_STYLES.primaryButton}
                    size="lg"
                    px={8} >
                    Get Started Free
                  </Button>
                </Link>
                <Link href={ROUTES.PUBLIC.LOGIN}>
                  <Button
                    {...THEME.BUTTON_STYLES.secondaryButton}
                    variant="outline"
                    size="lg"
                    px={8}
                  >
                    Login
                  </Button>
                </Link>
              </Stack>

              {/* Social Proof */}
              <Flex 
                justify="center" 
                align="center" 
                gap={2}
                pt={4}
                color="gray.500"
                fontSize="sm"
              >
              </Flex>
            </Stack>
          </Container>
        </Section>

        {/* ====================================
            FEATURES SECTION
            ==================================== */}
        <Box id="features" as="section" bg="white" py={{ base: 20, md: 28 }} scrollMarginTop="70px">
          <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
            {/* Section Header */}
            <Stack spacing={4} mb={{ base: 12, md: 20 }} textAlign="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={THEME.COLORS.primary}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Features
              </Text>
              <Heading 
                as="h2" 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold" 
                color="gray.800"
              >
                Everything You Need to Manage Events
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                color="gray.600"
                maxW="2xl"
                mx="auto"
              >
                From creation to execution, we've got you covered with powerful tools
              </Text>
            </Stack>

            {/* Feature Cards Grid */}
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 4 }}
              gap={{ base: 8, md: 10 }}
            >
              {FEATURES.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* ====================================
            HOW IT WORKS SECTION
            ==================================== */}
        <Box id="how-it-works" as="section" bg={THEME.COLORS.background} py={{ base: 20, md: 28 }} scrollMarginTop="70px">
          <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
            <Stack spacing={4} mb={{ base: 12, md: 20 }} textAlign="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={THEME.COLORS.primary}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                How It Works
              </Text>
              <Heading 
                as="h2" 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold" 
                color="gray.800"
              >
                Get Started in 4 Simple Steps
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                color="gray.600"
                maxW="2xl"
                mx="auto"
              >
                From event creation to guest management, we've made it simple and intuitive
              </Text>
            </Stack>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              gap={{ base: 8, md: 6 }}
            >
              {HOW_IT_WORKS.map((step, index) => (
                <Box
                  key={step.step}
                  position="relative"
                  textAlign="center"
                  p={8}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{
                    boxShadow: "xl",
                    transform: "translateY(-4px)",
                    borderColor: THEME.COLORS.primary,
                  }}
                  transition="all 0.3s ease"
                >
                  <Flex justify="center" mb={4}>
                    <Box
                      position="relative"
                      p={4}
                      borderRadius="xl"
                      bg={THEME.COLORS.background}
                    >
                      <Icon as={step.icon} boxSize={8} color={THEME.COLORS.primary} />
                      <Box
                        position="absolute"
                        top={-2}
                        right={-2}
                        w={6}
                        h={6}
                        borderRadius="full"
                        bg={THEME.COLORS.accent}
                        color="white"
                        fontSize="xs"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {step.step}
                      </Box>
                    </Box>
                  </Flex>
                  <Heading 
                    as="h3" 
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="bold" 
                    color="gray.800"
                    mb={3}
                  >
                    {step.title}
                  </Heading>
                  <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} lineHeight="tall">
                    {step.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* ====================================
            BENEFITS SECTION
            ==================================== */}
        <Box 
          id="benefits"
          as="section"
          bg="white" 
          py={{ base: 16, md: 24 }}
          scrollMarginTop="70px"
        >
          <Container maxW="container.lg">
            <SimpleGrid 
              columns={{ base: 1, md: 3 }} 
              gap={{ base: 8, md: 12 }}
              textAlign="center"
            >
              <Stack spacing={3}>
                <Text fontSize="3xl" fontWeight="bold" color={THEME.COLORS.primary}>
                  10K+
                </Text>
                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                  Events Created
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Trusted by event organizers worldwide
                </Text>
              </Stack>
              
              <Stack spacing={3}>
                <Text fontSize="3xl" fontWeight="bold" color={THEME.COLORS.primary}>
                  98%
                </Text>
                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                  Customer Satisfaction
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Loved by our community
                </Text>
              </Stack>
              
              <Stack spacing={3}>
                <Text fontSize="3xl" fontWeight="bold" color={THEME.COLORS.primary}>
                  24/7
                </Text>
                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                  Support Available
                </Text>
                <Text fontSize="sm" color="gray.600">
                  We're here when you need us
                </Text>
              </Stack>
            </SimpleGrid>
          </Container>
        </Box>

        {/* ====================================
            TESTIMONIALS SECTION
            ==================================== */}
        <Box id="testimonials" as="section" bg={THEME.COLORS.background} py={{ base: 20, md: 28 }} scrollMarginTop="70px">
          <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
            <Stack spacing={4} mb={{ base: 12, md: 20 }} textAlign="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={THEME.COLORS.primary}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Testimonials
              </Text>
              <Heading 
                as="h2" 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold" 
                color="gray.800"
              >
                Loved by Event Organizers
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                color="gray.600"
                maxW="2xl"
                mx="auto"
              >
                See what our users are saying about their experience with Ekadi
              </Text>
            </Stack>

            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={{ base: 6, md: 8 }}
            >
              {TESTIMONIALS.map((testimonial) => (
                <Box
                  key={testimonial.name}
                  p={8}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{
                    boxShadow: "xl",
                    transform: "translateY(-4px)",
                    borderColor: THEME.COLORS.primary,
                  }}
                  transition="all 0.3s ease"
                >
                  <Flex mb={4} gap={1}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} as={FiStar} color={THEME.COLORS.accent} boxSize={5} fill={THEME.COLORS.accent} />
                    ))}
                  </Flex>
                  <Text 
                    fontSize={{ base: "sm", md: "md" }}
                    color="gray.700"
                    lineHeight="tall"
                    mb={6}
                    fontStyle="italic"
                  >
                    "{testimonial.content}"
                  </Text>
                  <Box pt={4} borderTop="1px solid" borderColor="gray.100">
                    <Text fontSize="sm" fontWeight="bold" color="gray.800">
                      {testimonial.name}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {testimonial.role} at {testimonial.company}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* ====================================
            CTA SECTION
            ==================================== */}
        <Section 
          bg={THEME.COLORS.primary}
          py={{ base: 16, md: 24 }}
        >
          <Container maxW="container.md">
            <Stack 
              spacing={{ base: 6, md: 8 }} 
              textAlign="center" 
              color="white"
            >
              {/* CTA Heading */}
              <Heading 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                lineHeight="shorter"
              >
                Ready to Get Started?
              </Heading>

              {/* CTA Description */}
              <Text fontSize={{ base: "md", md: "lg" }} maxW="2xl" mx="auto">
                Join thousands of event organizers using Ekadi to create memorable 
                experiences and manage events effortlessly.
              </Text>

              {/* CTA Button */}
              <Flex justify="center" pt={2}>
                <Link href={ROUTES.PUBLIC.REGISTER}>
                  <Button
                    {...THEME.BUTTON_STYLES.primaryButton}
                    size="lg"
                    px={{ base: 6, md: 10 }}
                    fontSize={{ base: "md", md: "lg" }}
                    bg="white"
                    color={THEME.COLORS.primary}
                    _hover={{ 
                      bg: 'gray.100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    }}
                    borderRadius="lg" >
                    Create Free Account
                  </Button>
                </Link>
              </Flex>

              {/* Trust Badge */}
              <Text fontSize="sm" opacity={0.9}>
                No credit card required • Start in minutes
              </Text>
            </Stack>
          </Container>
        </Section>
      </Box>

      <Footer />
    </>
  );
}