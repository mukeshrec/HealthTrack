/**
 * Health Memory — Typography Design System
 *
 * Accessibility-first type scale for elderly users.
 * Minimum body text: 16px (WCAG AA large text).
 * All interactive labels: 14px+.
 */

import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  default: 'System',
});

export const typography = {
  // ── Display / Hero ────────────────────────────────
  displayLarge: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,

  displayMedium: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.3,
  } as TextStyle,

  // ── Headings ──────────────────────────────────────
  h1: {
    fontFamily,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.2,
  } as TextStyle,

  h2: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  } as TextStyle,

  h3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  } as TextStyle,

  // ── Body ──────────────────────────────────────────
  bodyLarge: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  bodyMedium: {
    fontFamily,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  } as TextStyle,

  bodySemibold: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  // ── Small / Caption ───────────────────────────────
  small: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,

  smallMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,

  caption: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,

  // ── Button / Label ────────────────────────────────
  buttonLarge: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  buttonMedium: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,

  buttonSmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  } as TextStyle,

  label: {
    fontFamily,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;

export type Typography = typeof typography;
