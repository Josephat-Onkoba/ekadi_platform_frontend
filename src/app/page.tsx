/**
 * Landing Page - Professionally Redesigned
 * 
 * Design Features:
 * - Proper implementation of Ekadi brand colors (Teal & Coral)
 * - Modern gradient backgrounds and visual depth
 * - Professional typography hierarchy
 * - Engaging animations and hover effects
 * - Mobile-first responsive design
 * - Decorative elements for visual interest
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
  HStack,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiMail, 
  FiCheckCircle, 
  FiUsers, 
  FiArrowRight,
  FiStar,
  FiEdit3,
  FiSend,
  FiBarChart,
  FiSmartphone,
  FiPlay,
  FiCheck,
} from 'react-icons/fi';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { ROUTES, THEME } from '@/src/lib/constants';

// Defer nav/footer loading
const PublicNav = dynamic(() => import('@/src/components/layout/PublicNav'), {
  ssr: false,
});

const Footer = dynamic(() => import('@/src/components/layout/Footer'), {
  ssr: false,
});

// ============================================================================
// TYPES
// ============================================================================

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

interface StepCardProps {
  step: string;
  icon: IconType;
  title: string;
  description: string;
  isLast?: boolean;
}

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

interface StatCardProps {
  value: string;
  label: string;
  description: string;
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

/**
 * Feature Card with consistent accent
 */
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Box 
    position="relative"
    bg="white"
    p={{ base: 6, md: 8 }}
    borderRadius="2xl"
    boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
    border="1px solid"
    borderColor="gray.100"
    overflow="hidden"
    _hover={{ 
      transform: "translateY(-8px)",
      boxShadow: "0 20px 40px rgba(0, 128, 128, 0.15)",
      borderColor: THEME.COLORS.primary,
    }}
    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    role="article"
    h="full"
  >
    {/* Top accent bar - consistent primary color */}
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      h="4px"
      bg={THEME.COLORS.primary}
    />
    
    <VStack align="flex-start" gap={4}>
      <Box
        p={3}
        borderRadius="xl"
        bg={`${THEME.COLORS.primary}10`}
        color={THEME.COLORS.primary}
      >
        <Icon as={icon} boxSize={{ base: 6, md: 7 }} />
      </Box>
      <Heading 
        as="h3" 
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="bold" 
        color={THEME.COLORS.textPrimary}
      >
        {title}
      </Heading>
      <Text 
        color={THEME.COLORS.textSecondary} 
        fontSize={{ base: "sm", md: "md" }} 
        lineHeight="tall"
      >
        {description}
      </Text>
    </VStack>
  </Box>
);

/**
 * Timeline Step for How It Works - Horizontal on desktop, vertical on mobile
 */
const TimelineStep = ({ step, icon, title, description, isLast }: StepCardProps) => (
  <Flex 
    direction={{ base: 'row', md: 'column' }} 
    align={{ base: 'flex-start', md: 'center' }}
    position="relative"
    flex={1}
  >
    {/* Left side - Number and line (mobile) / Top - Number and line (desktop) */}
    <Flex 
      direction={{ base: 'column', md: 'row' }} 
      align="center"
      position={{ base: 'relative', md: 'relative' }}
      mr={{ base: 5, md: 0 }}
      mb={{ base: 0, md: 5 }}
    >
      {/* Step Number Circle */}
      <Flex
        w={{ base: 12, md: 14 }}
        h={{ base: 12, md: 14 }}
        borderRadius="full"
        bg={THEME.COLORS.primary}
        color="white"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="bold"
        align="center"
        justify="center"
        boxShadow="0 4px 15px rgba(0, 128, 128, 0.3)"
        position="relative"
        zIndex={2}
      >
        {step}
      </Flex>
      
      {/* Connector Line - Vertical on mobile, horizontal on desktop */}
      {!isLast && (
        <>
          {/* Mobile vertical line */}
          <Box
            display={{ base: 'block', md: 'none' }}
            position="absolute"
            top="48px"
            left="50%"
            transform="translateX(-50%)"
            w="2px"
            h="calc(100% + 20px)"
            bg={THEME.COLORS.primary}
            opacity={0.2}
          />
          {/* Desktop horizontal line */}
          <Box
            display={{ base: 'none', md: 'block' }}
            position="absolute"
            left="100%"
            top="50%"
            transform="translateY(-50%)"
            w="100%"
            h="2px"
            bg={THEME.COLORS.primary}
            opacity={0.2}
          />
        </>
      )}
    </Flex>
    
    {/* Content */}
    <Box 
      flex={1} 
      pb={{ base: 8, md: 0 }}
      textAlign={{ base: 'left', md: 'center' }}
    >
      <Flex 
        align="center" 
        gap={2} 
        mb={2}
        justify={{ base: 'flex-start', md: 'center' }}
      >
        <Icon as={icon} boxSize={5} color={THEME.COLORS.accent} />
        <Heading 
          as="h3" 
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="bold" 
          color={THEME.COLORS.textPrimary}
        >
          {title}
        </Heading>
      </Flex>
      <Text 
        color={THEME.COLORS.textSecondary} 
        fontSize={{ base: "sm", md: "md" }} 
        lineHeight="tall"
        maxW={{ base: 'full', md: '200px' }}
        mx={{ base: 0, md: 'auto' }}
      >
        {description}
      </Text>
    </Box>
  </Flex>
);

/**
 * Testimonial Card
 */
const TestimonialCard = ({ name, role, company, content, rating }: TestimonialCardProps) => (
  <Box
    p={{ base: 6, md: 8 }}
    bg="white"
    borderRadius="2xl"
    boxShadow="0 4px 20px rgba(0, 0, 0, 0.06)"
    border="1px solid"
    borderColor="gray.100"
    position="relative"
    _hover={{
      boxShadow: "0 12px 40px rgba(0, 128, 128, 0.12)",
      transform: "translateY(-4px)",
    }}
    transition="all 0.3s ease"
    h="full"
  >
    {/* Quote decoration */}
    <Text
      position="absolute"
      top={4}
      right={6}
      fontSize="6xl"
      fontWeight="bold"
      color={`${THEME.COLORS.primary}15`}
      lineHeight={1}
      fontFamily="Georgia, serif"
    >
      "
    </Text>
    
    <VStack align="flex-start" gap={4} h="full">
      {/* Stars */}
      <HStack gap={1}>
        {[...Array(rating)].map((_, i) => (
          <Icon 
            key={i} 
            as={FiStar} 
            color={THEME.COLORS.accent} 
            boxSize={4} 
            fill={THEME.COLORS.accent} 
          />
        ))}
      </HStack>
      
      {/* Content */}
      <Text 
        fontSize={{ base: "sm", md: "md" }}
        color={THEME.COLORS.textSecondary}
        lineHeight="tall"
        flex={1}
      >
        {content}
      </Text>
      
      {/* Author */}
      <Box pt={4} borderTop="1px solid" borderColor="gray.100" w="full">
        <Text fontSize="sm" fontWeight="bold" color={THEME.COLORS.textPrimary}>
          {name}
        </Text>
        <Text fontSize="xs" color={THEME.COLORS.textSecondary}>
          {role} at {company}
        </Text>
      </Box>
    </VStack>
  </Box>
);

/**
 * Stat Card
 */
const StatCard = ({ value, label, description }: StatCardProps) => (
  <VStack gap={2} textAlign="center">
    <Text 
      fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} 
      fontWeight="extrabold" 
      color={THEME.COLORS.primary}
      lineHeight={1}
    >
      {value}
    </Text>
    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color={THEME.COLORS.textPrimary}>
      {label}
    </Text>
    <Text fontSize="sm" color={THEME.COLORS.textSecondary}>
      {description}
    </Text>
  </VStack>
);

// ============================================================================
// DATA
// ============================================================================

const FEATURES = [
  {
    icon: FiCalendar,
    title: "Event Management",
    description: "Create and manage multiple events with an intuitive dashboard. Track everything from one central location.",
  },
  {
    icon: FiMail,
    title: "WhatsApp & SMS",
    description: "Send beautiful invitations instantly via WhatsApp and SMS. Reach your guests where they are.",
  },
  {
    icon: FiCheckCircle,
    title: "RSVP Tracking",
    description: "Track responses in real-time with detailed analytics. Know exactly who's attending your event.",
  },
  {
    icon: FiUsers,
    title: "Custom Cards",
    description: "Design stunning invitation cards for any occasion. Choose from templates or create your own.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: FiEdit3,
    title: "Create Event",
    description: "Set up your event details in just a few minutes",
  },
  {
    step: "2",
    icon: FiSmartphone,
    title: "Design Card",
    description: "Choose a beautiful template or customize your own",
  },
  {
    step: "3",
    icon: FiSend,
    title: "Send Invites",
    description: "Deliver via WhatsApp & SMS to all your guests",
  },
  {
    step: "4",
    icon: FiBarChart,
    title: "Track RSVPs",
    description: "Monitor responses and manage your guest list",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Event Planner",
    company: "Celebrations Co.",
    content: "Ekadi has transformed how I manage events. The WhatsApp integration is a game-changer, and my clients love the beautiful invitation cards!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Wedding Coordinator",
    company: "Dream Weddings",
    content: "The RSVP tracking feature saves me hours every week. I can see who's responded instantly. I can't imagine planning events without Ekadi.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Corporate Events Manager",
    company: "TechCorp",
    content: "Professional, efficient, and beautiful. Ekadi makes event management feel effortless. Our team productivity increased significantly!",
    rating: 5,
  },
];

const STATS = [
  { value: "10K+", label: "Events Created", description: "Trusted by organizers worldwide" },
  { value: "98%", label: "Satisfaction Rate", description: "Loved by our community" },
  { value: "24/7", label: "Support Available", description: "We're here when you need us" },
];

const PRICING_FEATURES = [
  "Unlimited event creation",
  "WhatsApp & SMS invitations",
  "Beautiful card templates",
  "Real-time RSVP tracking",
  "Guest list management",
  "Event analytics dashboard",
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HomePage() {
  return (
    <>
      <PublicNav />

      <Box as="main" pt="70px">
        {/* ====================================
            HERO SECTION
            ==================================== */}
        <Box
          position="relative"
          overflow="hidden"
          bg={THEME.COLORS.background}
          minH={{ base: 'auto', md: 'calc(100vh - 70px)' }}
          pt={{ base: 10, md: 14, lg: 16 }}
          pb={{ base: 10, md: 14, lg: 16 }}
          display="flex"
          alignItems="center"
        >
          {/* Decorative background elements */}
          <Box
            position="absolute"
            top="-20%"
            right="-10%"
            w={{ base: "300px", md: "500px", lg: "700px" }}
            h={{ base: "300px", md: "500px", lg: "700px" }}
            borderRadius="full"
            bg={`${THEME.COLORS.primary}08`}
            filter="blur(80px)"
            pointerEvents="none"
          />
          <Box
            position="absolute"
            bottom="-10%"
            left="-5%"
            w={{ base: "200px", md: "400px" }}
            h={{ base: "200px", md: "400px" }}
            borderRadius="full"
            bg={`${THEME.COLORS.accent}08`}
            filter="blur(60px)"
            pointerEvents="none"
          />
          
          <Container maxW="container.xl" position="relative" zIndex={1}>
            <Stack 
              gap={{ base: 6, md: 8 }} 
              textAlign="center" 
              maxW="4xl" 
              mx="auto"
            >
              {/* Badge */}
              <Flex justify="center">
                <Badge
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="white"
                  boxShadow="0 2px 12px rgba(0, 128, 128, 0.15)"
                  border="1px solid"
                  borderColor={`${THEME.COLORS.primary}30`}
                  fontSize="sm"
                  fontWeight="semibold"
                  color={THEME.COLORS.primary}
                  textTransform="none"
                  letterSpacing="wide"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Box w={2} h={2} borderRadius="full" bg={THEME.COLORS.accent} />
                  Event Management Made Simple
                </Badge>
              </Flex>

              {/* Hero Title */}
              <Heading
                as="h1"
                fontSize={{ base: "2.1rem", sm: "2.6rem", md: "3rem", lg: "3.8rem" }}
                fontWeight="extrabold"
                lineHeight={1.1}
                color={THEME.COLORS.textPrimary}
                letterSpacing="tight"
              >
                Create Stunning Event Cards &{' '}
                <Box as="span" color={THEME.COLORS.primary}>
                  Manage RSVPs
                </Box>{' '}
                Effortlessly
              </Heading>

              {/* Hero Description */}
              <Text 
                fontSize={{ base: "md", md: "lg", lg: "xl" }} 
                color={THEME.COLORS.textSecondary}
                maxW="3xl"
                mx="auto"
                lineHeight="tall"
              >
                Send beautiful digital invitations via WhatsApp & SMS. Track RSVPs in real-time 
                and manage your events all in one powerful, easy-to-use platform.
              </Text>

              {/* Hero CTA Buttons */}
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                gap={4}
                justify="center"
                pt={4}
              >
                <Link href={ROUTES.PUBLIC.REGISTER}>
                  <Button
                    bg={THEME.COLORS.accent}
                    color="white"
                    size="lg"
                    px={8}
                    h={14}
                    fontSize="md"
                    fontWeight="semibold"
                    borderRadius="xl"
                    boxShadow="0 8px 30px rgba(255, 111, 97, 0.4)"
                    _hover={{ 
                      bg: '#FF5A4D', 
                      transform: 'translateY(-3px)', 
                      boxShadow: '0 12px 40px rgba(255, 111, 97, 0.5)',
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    transition="all 0.3s"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    Get Started Free
                    <Icon as={FiArrowRight} boxSize={5} />
                  </Button>
                </Link>
                <Link href={ROUTES.PUBLIC.LOGIN}>
                  <Button
                    variant="outline"
                    borderColor={THEME.COLORS.primary}
                    color={THEME.COLORS.primary}
                    bg="white"
                    size="lg"
                    px={8}
                    h={14}
                    fontSize="md"
                    fontWeight="semibold"
                    borderRadius="xl"
                    borderWidth="2px"
                    _hover={{ 
                      bg: THEME.COLORS.primary, 
                      color: 'white',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 30px rgba(0, 128, 128, 0.3)',
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    transition="all 0.3s"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={FiPlay} boxSize={5} />
                    Watch Demo
                  </Button>
                </Link>
              </Stack>

              {/* Trust Indicators */}
              <HStack 
                justify="center" 
                gap={{ base: 4, md: 8 }}
                pt={4}
                flexWrap="wrap"
              >
                {[
                  "No credit card required",
                  "Free forever plan",
                  "Setup in minutes"
                ].map((text) => (
                  <HStack key={text} gap={2} color={THEME.COLORS.textSecondary}>
                    <Icon as={FiCheck} color={THEME.COLORS.primary} boxSize={4} />
                    <Text fontSize="sm" fontWeight="medium">{text}</Text>
                  </HStack>
                ))}
              </HStack>
            </Stack>
          </Container>
        </Box>

        {/* ====================================
            FEATURES SECTION
            ==================================== */}
        <Box 
          id="features" 
          as="section" 
          bg="white" 
          py={{ base: 8, md: 12 }} 
          scrollMarginTop="70px"
        >
          <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
            {/* Section Header */}
            <VStack gap={4} mb={{ base: 6, md: 8 }} textAlign="center" maxW="2xl" mx="auto">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={THEME.COLORS.accent}
                textTransform="uppercase"
                letterSpacing="widest"
              >
                Features
              </Text>
              <Heading 
                as="h2" 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold" 
                color={THEME.COLORS.textPrimary}
                lineHeight="shorter"
              >
                Everything You Need to{' '}
                <Box as="span" color={THEME.COLORS.primary}>
                  Manage Events
                </Box>
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                color={THEME.COLORS.textSecondary}
                lineHeight="tall"
              >
                From creation to execution, we've got you covered with powerful tools 
                designed to make your event planning seamless.
              </Text>
            </VStack>

            {/* Feature Cards Grid */}
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 4 }}
              gap={{ base: 6, md: 8 }}
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
        <Box 
          id="how-it-works" 
          as="section" 
          position="relative"
          py={{ base: 8, md: 12 }} 
          scrollMarginTop="70px"
          overflow="hidden"
        >
          {/* Background */}
          <Box
            position="absolute"
            inset={0}
            bg={THEME.COLORS.background}
          />
          
          <Container maxW="container.xl" px={{ base: 4, md: 6 }} position="relative" zIndex={1}>
            <VStack gap={4} mb={{ base: 6, md: 8 }} textAlign="center" maxW="2xl" mx="auto">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={THEME.COLORS.accent}
                textTransform="uppercase"
                letterSpacing="widest"
              >
                How It Works
              </Text>
              <Heading 
                as="h2" 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold" 
                color={THEME.COLORS.textPrimary}
                lineHeight="shorter"
              >
                Get Started in{' '}
                <Box as="span" color={THEME.COLORS.primary}>
                  4 Simple Steps
                </Box>
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                color={THEME.COLORS.textSecondary}
                lineHeight="tall"
              >
                From event creation to guest management, we've made it simple and intuitive.
              </Text>
            </VStack>

            {/* Timeline Container */}
            <Box
              bg="white"
              borderRadius="2xl"
              p={{ base: 6, md: 10 }}
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.06)"
              border="1px solid"
              borderColor="gray.100"
            >
              <Flex 
                direction={{ base: 'column', md: 'row' }}
                gap={{ base: 0, md: 4 }}
              >
                {HOW_IT_WORKS.map((step, index) => (
                  <TimelineStep
                    key={step.step}
                    step={step.step}
                    icon={step.icon}
                    title={step.title}
                    description={step.description}
                    isLast={index === HOW_IT_WORKS.length - 1}
                  />
                ))}
              </Flex>
            </Box>
          </Container>
        </Box>

        {/* ====================================
            STATS SECTION
            ==================================== */}
        <Box 
          id="benefits"
          as="section"
          bg="white" 
          py={{ base: 8, md: 12 }}
          scrollMarginTop="70px"
        >
          <Container maxW="container.lg">
            <Box
              p={{ base: 8, md: 12 }}
              borderRadius="3xl"
              bg={THEME.COLORS.background}
              border="1px solid"
              borderColor="gray.200"
            >
              <SimpleGrid 
                columns={{ base: 1, md: 3 }} 
                gap={{ base: 10, md: 8 }}
              >
                {STATS.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </SimpleGrid>
            </Box>
          </Container>
        </Box>

        {/* ====================================
            TESTIMONIALS SECTION
            ==================================== */}
        <Box 
          id="testimonials" 
          as="section" 
          bg={THEME.COLORS.background} 
          py={{ base: 8, md: 12 }} 
          scrollMarginTop="70px"
        >
          <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
            <VStack gap={4} mb={{ base: 6, md: 8 }} textAlign="center" maxW="2xl" mx="auto">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={THEME.COLORS.accent}
                textTransform="uppercase"
                letterSpacing="widest"
              >
                Testimonials
              </Text>
              <Heading 
                as="h2" 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold" 
                color={THEME.COLORS.textPrimary}
                lineHeight="shorter"
              >
                Loved by{' '}
                <Box as="span" color={THEME.COLORS.primary}>
                  Event Organizers
                </Box>
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                color={THEME.COLORS.textSecondary}
                lineHeight="tall"
              >
                See what our users are saying about their experience with Ekadi.
              </Text>
            </VStack>

            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={{ base: 6, md: 8 }}
            >
              {TESTIMONIALS.map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* ====================================
            PRICING PREVIEW SECTION
            ==================================== */}
        <Box 
          as="section"
          bg="white" 
          py={{ base: 8, md: 12 }}
        >
          <Container maxW="container.lg">
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 10, lg: 16 }} alignItems="center">
              {/* Left - Content */}
              <VStack align="flex-start" gap={6}>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={THEME.COLORS.accent}
                  textTransform="uppercase"
                  letterSpacing="widest"
                >
                  Simple Pricing
                </Text>
                <Heading 
                  as="h2" 
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="bold" 
                  color={THEME.COLORS.textPrimary}
                  lineHeight="shorter"
                >
                  Start Free,{' '}
                  <Box as="span" color={THEME.COLORS.primary}>
                    Scale When Ready
                  </Box>
                </Heading>
                <Text 
                  fontSize={{ base: "md", md: "lg" }}
                  color={THEME.COLORS.textSecondary}
                  lineHeight="tall"
                >
                  Everything you need to get started is completely free. 
                  Upgrade anytime as your events grow.
                </Text>
                
                <Link href={ROUTES.PUBLIC.REGISTER}>
                  <Button
                    bg={THEME.COLORS.accent}
                    color="white"
                    size="lg"
                    px={8}
                    h={14}
                    fontSize="md"
                    fontWeight="semibold"
                    borderRadius="xl"
                    boxShadow="0 8px 30px rgba(255, 111, 97, 0.4)"
                    _hover={{ 
                      bg: '#FF5A4D', 
                      transform: 'translateY(-3px)', 
                      boxShadow: '0 12px 40px rgba(255, 111, 97, 0.5)',
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    transition="all 0.3s"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    Start Free Today
                    <Icon as={FiArrowRight} boxSize={5} />
                  </Button>
                </Link>
              </VStack>

              {/* Right - Features list */}
              <Box
                p={{ base: 6, md: 8 }}
                bg={THEME.COLORS.background}
                borderRadius="2xl"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text 
                  fontSize="lg" 
                  fontWeight="bold" 
                  color={THEME.COLORS.textPrimary}
                  mb={6}
                >
                  Free plan includes:
                </Text>
                <VStack align="flex-start" gap={4}>
                  {PRICING_FEATURES.map((feature) => (
                    <HStack key={feature} gap={3}>
                      <Box
                        p={1}
                        borderRadius="full"
                        bg={`${THEME.COLORS.primary}15`}
                      >
                        <Icon as={FiCheck} color={THEME.COLORS.primary} boxSize={4} />
                      </Box>
                      <Text color={THEME.COLORS.textSecondary} fontSize="md">
                        {feature}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </SimpleGrid>
          </Container>
        </Box>

        {/* ====================================
            CTA SECTION
            ==================================== */}
        <Box 
          as="section"
          position="relative"
          overflow="hidden"
          py={{ base: 10, md: 14 }}
          bg={THEME.COLORS.primary}
        >
          {/* Decorative circles */}
          <Box
            position="absolute"
            top="-50%"
            right="-20%"
            w="600px"
            h="600px"
            borderRadius="full"
            bg="white"
            opacity={0.05}
          />
          <Box
            position="absolute"
            bottom="-30%"
            left="-10%"
            w="400px"
            h="400px"
            borderRadius="full"
            bg="white"
            opacity={0.05}
          />
          
          <Container maxW="container.md" position="relative" zIndex={1}>
            <VStack 
              gap={{ base: 6, md: 8 }} 
              textAlign="center"
            >
              <Heading 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                lineHeight="shorter"
                color="white"
              >
                Ready to Transform Your Events?
              </Heading>

              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                maxW="xl" 
                mx="auto"
                lineHeight="tall"
                color="white"
              >
                Join thousands of event organizers using Ekadi to create memorable 
                experiences and manage events effortlessly.
              </Text>

              <Link href={ROUTES.PUBLIC.REGISTER}>
                <Button
                  bg="white"
                  color={THEME.COLORS.primary}
                  size="lg"
                  px={10}
                  h={14}
                  fontSize="md"
                  fontWeight="bold"
                  borderRadius="xl"
                  boxShadow="0 8px 30px rgba(0, 0, 0, 0.2)"
                  _hover={{ 
                    bg: 'gray.100',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  transition="all 0.3s"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  Create Free Account
                  <Icon as={FiArrowRight} boxSize={5} />
                </Button>
              </Link>

              <Text fontSize="sm" color="whiteAlpha.800">
                No credit card required • Start in minutes
              </Text>
            </VStack>
          </Container>
        </Box>
      </Box>

      <Footer />
    </>
  );
}
