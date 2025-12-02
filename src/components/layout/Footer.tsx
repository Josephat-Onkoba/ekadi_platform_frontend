/**
 * Footer Component - Minimal Improved Version
 * 
 * A cleaner, simpler footer that's still better than the original
 * 
 * Improvements over original:
 * - Better responsive grid
 * - Improved accessibility
 * - Social media links
 * - Better mobile layout
 * - Cleaner styling
 * 
 * @module Footer
 */

'use client';

import {
  Box,
  Container,
  Stack,
  Text,
  Link as ChakraLink,
  Flex,
  SimpleGrid,
  Heading,
  Icon,
  HStack,
  Button,
  Separator,
} from '@chakra-ui/react';
import { 
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from 'react-icons/fi';
import Link from 'next/link';
import { THEME } from '@/src/lib/constants';

// ============================================================================
// TYPES
// ============================================================================

interface FooterLinkProps {
  href: string;
  children: string;
}

interface FooterSectionProps {
  title: string;
  links: Array<{ href: string; label: string }>;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <ChakraLink
    as={Link}
    href={href}
    color="gray.600"
    fontSize="sm"
    _hover={{ 
      color: THEME.COLORS.primary,
      textDecoration: 'underline',
    }}
    transition="color 0.2s"
  >
    {children}
  </ChakraLink>
);

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <Stack gap={3}>
    <Heading 
      as="h3" 
      fontSize="sm" 
      fontWeight="bold" 
      color="gray.800"
      textTransform="uppercase"
      letterSpacing="wide"
    >
      {title}
    </Heading>
    <Stack gap={2}>
      {links.map((link) => (
        <FooterLink key={link.href} href={link.href}>
          {link.label}
        </FooterLink>
      ))}
    </Stack>
  </Stack>
);

// ============================================================================
// DATA
// ============================================================================

const SECTIONS = [
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/careers', label: 'Careers' },
    ],
  },
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/help', label: 'Help Center' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/docs', label: 'Documentation' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/cookies', label: 'Cookie Policy' },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: 'https://twitter.com/ekadi', icon: FiTwitter, label: 'Twitter' },
  { href: 'https://facebook.com/ekadi', icon: FiFacebook, label: 'Facebook' },
  { href: 'https://instagram.com/ekadi', icon: FiInstagram, label: 'Instagram' },
  { href: 'https://linkedin.com/company/ekadi', icon: FiLinkedin, label: 'LinkedIn' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Footer Component
 * 
 * Clean, responsive footer with navigation and social links
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="gray.50"
      borderTop="1px solid"
      borderColor="gray.200"
      mt="auto"
    >
      <Container maxW="container.xl" py={{ base: 10, md: 12 }}>
        {/* Brand + Links Grid */}
        <SimpleGrid 
          columns={{ base: 1, sm: 2, md: 5 }} 
          gap={{ base: 8, md: 6 }}
          mb={8}
        >
          {/* Brand Section */}
          <Stack gap={4}>
            <Heading 
              as="h2" 
              fontSize="2xl" 
              fontWeight="bold" 
              color={THEME.COLORS.primary}
            >
              Ekadi
            </Heading>
            <Text fontSize="sm" color="gray.600" lineHeight="tall">
              Create stunning event cards and manage RSVPs effortlessly.
            </Text>
          </Stack>

          {/* Link Sections */}
          {SECTIONS.map((section) => (
            <FooterSection key={section.title} {...section} />
          ))}
        </SimpleGrid>

        <Separator borderColor="gray.300" mb={6} />

        {/* Bottom Section */}
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
        >
          {/* Copyright */}
          <Text 
            fontSize="sm" 
            color="gray.500"
            textAlign={{ base: 'center', md: 'left' }}
          >
            © {currentYear} Ekadi Platform. All rights reserved.
          </Text>

          {/* Social Links */}
          <HStack gap={1}>
            {SOCIAL_LINKS.map((social) => (
              <ChakraLink
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  aria-label={social.label}
                  variant="ghost"
                  colorScheme="gray"
                  size="md"
                  minW="auto"
                  p={0}
                  _hover={{ 
                    bg: THEME.COLORS.background,
                    color: THEME.COLORS.primary,
                  }}
                  transition="all 0.2s"
                >
                  <Icon as={social.icon} boxSize={5} />
                </Button>
              </ChakraLink>
            ))}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}