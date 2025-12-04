'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import {
  FiCheck,
  FiArrowRight,
  FiHelpCircle,
  FiZap,
  FiTrendingUp,
  FiBriefcase,
  FiStar,
  FiChevronDown,
} from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';
import PublicNav from '@/src/components/layout/PublicNav';
import Footer from '@/src/components/layout/Footer';
import { ROUTES, THEME, PRICING_PLANS, PRICING_FAQ, PAYMENT_METHODS } from '@/src/lib/constants';
import type { IconType } from 'react-icons';

type BillingCycle = 'monthly' | 'annual';

function formatPrice(amount: number | null): string {
  if (amount === null) {
    return 'Custom';
  }
  return `KES ${amount.toLocaleString()}`;
}

function getPlanIcon(planType: string): IconType {
  switch (planType) {
    case 'payg':
      return FiZap;
    case 'subscription':
      return FiTrendingUp;
    case 'custom':
      return FiBriefcase;
    default:
      return FiStar;
  }
}

export default function PricingPage() {
  const [selectedBilling, setSelectedBilling] = useState<BillingCycle>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const payg = PRICING_PLANS.PAY_AS_YOU_GO;
  const starter = PRICING_PLANS.STARTER;
  const professional = PRICING_PLANS.PROFESSIONAL;
  const enterprise = PRICING_PLANS.ENTERPRISE;

  return (
    <>
      <PublicNav />

      <Box as="main" minH="100vh" bg={THEME.COLORS.background}>
        {/* HERO SECTION */}
        <Box bg="white" pt={20} pb={12} borderBottom="1px" borderColor="gray.200">
          <Container maxW="container.xl">
            <Stack gap={6} textAlign="center" maxW="3xl" mx="auto">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={THEME.COLORS.accent}
                textTransform="uppercase"
                letterSpacing="widest"
              >
                Transparent Pricing
              </Text>

              <Heading
                fontSize={{ base: '4xl', md: '5xl' }}
                fontWeight="bold"
                color={THEME.COLORS.primary}
              >
                Simple, Fair Pricing
              </Heading>

              <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
                Choose the plan that fits your needs. No hidden fees, cancel anytime.
              </Text>

              <Text fontSize="md" color="gray.500">
                🎁 First event free for all new users (up to 50 invitations)
              </Text>
            </Stack>
          </Container>
        </Box>

        {/* PRICING CARDS SECTION */}
        <Container maxW="container.xl" py={16}>
          {/* Billing toggle */}
          <Flex justify="center" mb={10}>
            <Box
              bg="white"
              borderRadius="full"
              border="1px solid"
              borderColor="gray.200"
              p={1}
              display="inline-flex"
              gap={1}
            >
              <Button
                size="sm"
                borderRadius="full"
                onClick={() => setSelectedBilling('monthly')}
                bg={selectedBilling === 'monthly' ? THEME.COLORS.primary : 'transparent'}
                color={selectedBilling === 'monthly' ? 'white' : 'gray.700'}
                _hover={{
                  bg:
                    selectedBilling === 'monthly'
                      ? THEME.COLORS.primary
                      : 'gray.50',
                }}
              >
                Monthly billing
              </Button>
              <Button
                size="sm"
                borderRadius="full"
                onClick={() => setSelectedBilling('annual')}
                bg={selectedBilling === 'annual' ? THEME.COLORS.primary : 'transparent'}
                color={selectedBilling === 'annual' ? 'white' : 'gray.500'}
                _hover={{
                  bg:
                    selectedBilling === 'annual'
                      ? THEME.COLORS.primary
                      : 'gray.50',
                }}
              >
                Annual (coming soon)
              </Button>
            </Box>
          </Flex>

          <SimpleGrid columns={{ base: 1, lg: 4 }} gap={8}>
            {[payg, starter, professional, enterprise].map((plan) => (
              <Box
                key={plan.name}
                bg="white"
                borderRadius="xl"
                boxShadow={plan.popular ? 'xl' : 'md'}
                p={8}
                position="relative"
                border="2px"
                borderColor={plan.popular ? THEME.COLORS.accent : 'transparent'}
                transform={plan.popular ? 'scale(1.05)' : 'none'}
                transition="all 0.3s"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
                display="flex"
                flexDirection="column"
                height="100%"
              >
                {plan.popular && (
                  <Badge
                    position="absolute"
                    top="-3"
                    right="8"
                    bg={THEME.COLORS.accent}
                    color="white"
                    px={4}
                    py={1}
                    borderRadius="full"
                    textTransform="uppercase"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    Most Popular
                  </Badge>
                )}

                <Stack gap={6} flex="1">
                  {/* PLAN HEADER */}
                  <Stack gap={3}>
                    <Flex align="center" gap={3}>
                      <Icon
                        as={getPlanIcon(plan.type)}
                        w={8}
                        h={8}
                        color={THEME.COLORS.primary}
                      />
                      <Heading fontSize="2xl" color={THEME.COLORS.primary}>
                        {plan.name}
                      </Heading>
                    </Flex>
                    <Text color={THEME.COLORS.textSecondary} fontSize="sm">
                      {plan.description}
                    </Text>
                  </Stack>

                  {/* PRICING */}
                  {plan.type === 'payg' && 'pricing' in plan ? (
                    <Stack gap={2}>
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        From {formatPrice(plan.pricing.event_creation.amount)} per event
                      </Text>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.600">{plan.pricing.event_creation.description}</Text>
                        <Text fontWeight="semibold" color={THEME.COLORS.primary}>
                          {formatPrice(plan.pricing.event_creation.amount)}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.600">{plan.pricing.whatsapp_message.description}</Text>
                        <Text fontWeight="semibold" color={THEME.COLORS.primary}>
                          {formatPrice(plan.pricing.whatsapp_message.amount)}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.600">{plan.pricing.sms_message.description}</Text>
                        <Text fontWeight="semibold" color={THEME.COLORS.primary}>
                          {formatPrice(plan.pricing.sms_message.amount)}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.600">{plan.pricing.card_design.description}</Text>
                        <Text fontWeight="semibold" color={THEME.COLORS.primary}>
                          {formatPrice(plan.pricing.card_design.amount)}
                        </Text>
                      </Flex>
                    </Stack>
                  ) : plan.type === 'subscription' && 'price' in plan ? (
                    <Stack gap={1}>
                      <Flex align="baseline" gap={2}>
                        <Text fontSize="4xl" fontWeight="bold" color={THEME.COLORS.primary}>
                          {formatPrice(plan.price)}
                        </Text>
                        <Text fontSize="lg" color="gray.600">
                          /{plan.billingCycle}
                        </Text>
                      </Flex>
                      {plan.limits && (
                        <Text fontSize="sm" color={THEME.COLORS.textSecondary}>
                          {plan.limits.events} events • {plan.limits.whatsapp} WhatsApp •{' '}
                          {plan.limits.sms} SMS
                        </Text>
                      )}
                      {selectedBilling === 'annual' && (
                        <Text fontSize="xs" color="gray.400">
                          Annual billing discounts coming soon
                        </Text>
                      )}
                    </Stack>
                  ) : (
                    <Stack gap={1}>
                      <Text fontSize="3xl" fontWeight="bold" color={THEME.COLORS.primary}>
                        Custom
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Contact us for pricing
                      </Text>
                    </Stack>
                  )}

                  {/* DIVIDER */}
                  <Box borderTop="1px" borderColor="gray.200" />

                  {/* FEATURES LIST */}
                  <Stack gap={3}>
                    {plan.features.map((feature) => (
                      <Flex key={feature} align="start" gap={3}>
                        <Icon
                          as={FiCheck}
                          color="green.500"
                          w={5}
                          h={5}
                          mt={0.5}
                        />
                        <Text fontSize="sm" color="gray.700">
                          {feature}
                        </Text>
                      </Flex>
                    ))}
                  </Stack>
                </Stack>

                {/* CTA BUTTON */}
                {plan.type === 'custom' ? (
                  <Link href="/contact">
                    <Button
                      w="full"
                      size="lg"
                      mt={6}
                      {...THEME.BUTTON_STYLES.secondaryButton}
                      variant="outline"
                    >
                      <Box
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        mr={2}
                      >
                        <Icon as={FiArrowRight} />
                      </Box>
                      Contact Sales
                    </Button>
                  </Link>
                ) : (
                  <Link href={ROUTES.PUBLIC.REGISTER}>
                    <Button
                      w="full"
                      size="lg"
                      mt={6}
                      {...(plan.popular
                        ? THEME.BUTTON_STYLES.primaryButton
                        : { ...THEME.BUTTON_STYLES.secondaryButton, variant: 'outline' })}
                    >
                      <Box
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        mr={2}
                      >
                        <Icon as={FiArrowRight} />
                      </Box>
                      {plan.type === 'payg' ? 'Start Free' : 'Get Started'}
                    </Button>
                  </Link>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Container>

        {/* COMPARISON TABLE SECTION */}
        <Box bg="white" py={16}>
          <Container maxW="container.xl">
            <Stack gap={8}>
              <Stack gap={3} textAlign="center">
                <Heading fontSize="3xl" color={THEME.COLORS.primary}>
                  Compare Plans
                </Heading>
                <Text fontSize="lg" color={THEME.COLORS.textSecondary}>
                  Choose the perfect plan for your needs
                </Text>
              </Stack>

              <Box overflowX="auto" borderRadius="xl" border="1px" borderColor="gray.200">
                <Box as="table" width="100%" borderCollapse="collapse">
                  <Box as="thead" bg="gray.50">
                    <Box as="tr">
                      <Box as="th" textAlign="left" p={4} fontWeight="semibold">
                        Feature
                      </Box>
                      <Box as="th" textAlign="center" p={4} fontWeight="semibold">
                        Pay As You Go
                      </Box>
                      <Box as="th" textAlign="center" p={4} fontWeight="semibold">
                        Starter
                      </Box>
                      <Box
                        as="th"
                        textAlign="center"
                        p={4}
                        fontWeight="semibold"
                        bg={THEME.COLORS.background}
                      >
                        Professional
                      </Box>
                      <Box as="th" textAlign="center" p={4} fontWeight="semibold">
                        Enterprise
                      </Box>
                    </Box>
                  </Box>
                  <Box as="tbody">
                    {/* Events per month */}
                    <Box as="tr" borderTop="1px solid" borderColor="gray.200">
                      <Box as="td" p={4} fontWeight="semibold">
                        Events per month
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        Pay per event
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        5
                      </Box>
                      <Box
                        as="td"
                        p={4}
                        textAlign="center"
                        bg={THEME.COLORS.background}
                      >
                        20
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        Unlimited
                      </Box>
                    </Box>

                    {/* WhatsApp messages */}
                    <Box as="tr" borderTop="1px solid" borderColor="gray.200">
                      <Box as="td" p={4} fontWeight="semibold">
                        WhatsApp messages
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        KES 2 each
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        500
                      </Box>
                      <Box
                        as="td"
                        p={4}
                        textAlign="center"
                        bg={THEME.COLORS.background}
                      >
                        2,000
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        Unlimited
                      </Box>
                    </Box>

                    {/* SMS messages */}
                    <Box as="tr" borderTop="1px solid" borderColor="gray.200">
                      <Box as="td" p={4} fontWeight="semibold">
                        SMS messages
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        KES 3 each
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        300
                      </Box>
                      <Box
                        as="td"
                        p={4}
                        textAlign="center"
                        bg={THEME.COLORS.background}
                      >
                        1,500
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        Unlimited
                      </Box>
                    </Box>

                    {/* Custom branding */}
                    <Box as="tr" borderTop="1px solid" borderColor="gray.200">
                      <Box as="td" p={4} fontWeight="semibold">
                        Custom branding
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        <Icon as={FiCheck} color="gray.300" />
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        <Icon as={FiCheck} color="gray.300" />
                      </Box>
                      <Box
                        as="td"
                        p={4}
                        textAlign="center"
                        bg={THEME.COLORS.background}
                      >
                        <Icon as={FiCheck} color="green.500" />
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        <Icon as={FiCheck} color="green.500" />
                      </Box>
                    </Box>

                    {/* API access */}
                    <Box as="tr" borderTop="1px solid" borderColor="gray.200">
                      <Box as="td" p={4} fontWeight="semibold">
                        API access
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        <Icon as={FiCheck} color="gray.300" />
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        <Icon as={FiCheck} color="gray.300" />
                      </Box>
                      <Box
                        as="td"
                        p={4}
                        textAlign="center"
                        bg={THEME.COLORS.background}
                      >
                        <Icon as={FiCheck} color="green.500" />
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        <Icon as={FiCheck} color="green.500" />
                      </Box>
                    </Box>

                    {/* Priority support */}
                    <Box as="tr" borderTop="1px solid" borderColor="gray.200">
                      <Box as="td" p={4} fontWeight="semibold">
                        Priority support
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        <Icon as={FiCheck} color="gray.300" />
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        <Icon as={FiCheck} color="green.500" />
                      </Box>
                      <Box
                        as="td"
                        p={4}
                        textAlign="center"
                        bg={THEME.COLORS.background}
                      >
                        <Icon as={FiCheck} color="green.500" />
                      </Box>
                      <Box as="td" p={4} textAlign="center">
                        <Icon as={FiCheck} color="green.500" />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* PAYMENT METHODS SECTION */}
        <Container maxW="container.xl" py={16}>
          <Stack gap={8} textAlign="center">
            <Stack gap={3}>
              <Heading fontSize="3xl" color={THEME.COLORS.primary}>
                Flexible Payment Options
              </Heading>
              <Text fontSize="lg" color={THEME.COLORS.textSecondary}>
                We accept all major payment methods
              </Text>
            </Stack>

            <Flex justify="center" gap={8} flexWrap="wrap">
              {PAYMENT_METHODS.map((method) => (
                <Stack
                  key={method.name}
                  align="center"
                  p={6}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  minW="150px"
                  _hover={{ boxShadow: 'lg' }}
                >
                  <Text fontSize="4xl">{method.icon}</Text>
                  <Text fontWeight="semibold" color="gray.800">
                    {method.name}
                  </Text>
                </Stack>
              ))}
            </Flex>
          </Stack>
        </Container>

        {/* FAQ SECTION */}
        <Box bg="white" py={16}>
          <Container maxW="container.lg">
            <Stack gap={8}>
              <Stack gap={3} textAlign="center">
                <Heading fontSize="3xl" color={THEME.COLORS.primary}>
                  Frequently Asked Questions
                </Heading>
              <Text fontSize="lg" color={THEME.COLORS.textSecondary}>
                  Everything you need to know about our pricing
                </Text>
              </Stack>

            <Stack gap={6}>
                {PRICING_FAQ.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <Box
                      key={faq.question}
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      overflow="hidden"
                    >
                      <Button
                        onClick={() =>
                          setOpenFaqIndex(isOpen ? null : index)
                        }
                        variant="ghost"
                        w="100%"
                        justifyContent="space-between"
                        py={4}
                        borderRadius="0"
                        _hover={{ bg: THEME.COLORS.background }}
                      >
                        <Flex flex="1" textAlign="left" align="center" gap={3}>
                          <Icon as={FiHelpCircle} color={THEME.COLORS.primary} />
                          <Text fontWeight="semibold" color="gray.800">
                            {faq.question}
                          </Text>
                        </Flex>
                        <Icon
                          as={FiChevronDown}
                          color="gray.500"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                          }}
                        />
                      </Button>
                      {isOpen && (
                        <Box pb={4} px={6} pt={0} color="gray.600">
                          {faq.answer}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* CTA SECTION */}
        <Box bg={THEME.COLORS.primary} py={20}>
          <Container maxW="container.md">
            <Stack gap={6} textAlign="center" color="white">
              <Heading fontSize="3xl">Ready to Get Started?</Heading>
              <Text fontSize="lg" opacity={0.9}>
                Create your first event for free. No credit card required.
              </Text>
              <Flex gap={4} justify="center" flexWrap="wrap">
                <Link href={ROUTES.PUBLIC.REGISTER}>
                  <Button
                    size="lg"
                    bg="white"
                    color={THEME.COLORS.primary}
                    _hover={{ bg: 'gray.100' }}
                    px={8}
                  >
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      mr={2}
                    >
                      <Icon as={FiArrowRight} />
                    </Box>
                    Start Free Trial
                  </Button>
                </Link>
                <Link href={ROUTES.PUBLIC.LOGIN}>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    px={8}
                  >
                    Sign In
                  </Button>
                </Link>
              </Flex>
            </Stack>
          </Container>
        </Box>
      </Box>

      <Footer />
    </>
  );
}


