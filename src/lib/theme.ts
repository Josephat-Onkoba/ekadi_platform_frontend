/**
 * Chakra UI Theme Configuration
 * 
 * Custom theme configuration for the Ekadi Platform
 * Defines colors, typography, component styles, and more
 * 
 * @module theme
 */

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

/**
 * Custom theme configuration
 * Extends the default Chakra UI theme with custom values
 */
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Primary brand color - Deep Teal
        primary: {
          50: { value: '#E6F2F2' },
          100: { value: '#B3D9D9' },
          200: { value: '#80C0C0' },
          300: { value: '#4DA6A6' },
          400: { value: '#268C8C' },
          500: { value: '#008080' }, // Main primary
          600: { value: '#006666' },
          700: { value: '#004D4D' },
          800: { value: '#003333' },
          900: { value: '#001A1A' },
        },
        // Secondary brand color - Vibrant Coral
        secondary: {
          50: { value: '#FFF0EE' },
          100: { value: '#FFD4CE' },
          200: { value: '#FFB8AE' },
          300: { value: '#FF9C8E' },
          400: { value: '#FF886E' },
          500: { value: '#FF6F61' }, // Main secondary
          600: { value: '#E55A4D' },
          700: { value: '#CC4539' },
          800: { value: '#B23025' },
          900: { value: '#991B11' },
        },
        // Background - Warm Off-White
        background: {
          value: '#F9F9F9',
        },
      },
      fonts: {
        body: { value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif" },
        heading: { value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif" },
      },
    },
  },
});

/**
 * Export the custom Chakra UI system
 */
export const system = createSystem(defaultConfig, config);

