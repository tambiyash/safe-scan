// SafeScan Typography System

import { StyleSheet } from 'react-native';

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const typography = StyleSheet.create({
  // Display - Large headers
  displayLarge: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: 0,
  },

  // Headlines
  headlineLarge: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  headlineMedium: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },

  // Titles
  titleLarge: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  titleMedium: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  titleSmall: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.5,
  },

  // Body text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },

  // Labels
  labelLarge: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0.5,
  },

  // Monospace for URLs/codes
  mono: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
});

export type Typography = typeof typography;
