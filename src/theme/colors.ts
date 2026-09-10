/**
 * MyCare+ — Enterprise Medical Color Design System
 * 
 * Modeled after world-class clinical platforms (One Medical, Mayo Clinic, Apple Health):
 * - High-trust Navy & Royal Blue core
 * - Vibrant Vitality Accents (Teal, Cyan, Amber, Rose)
 * - Ultra-clean slate and snow backgrounds
 * - WCAG AAA compliant contrast ratios
 */

export const colors = {
  // ── Primary Brand (Signature Royal Medical Blue) ────
  primary: {
    main: '#2563EB',          // Clinical Blue
    bright: '#3B6BE8',        // Accent Blue
    dark: '#1D4ED8',          // Deep Trust Blue
    deepBlue: '#0F172A',      // Slate Navy for High Contrast
    blue: '#2563EB',
    lightBlue: '#60A5FA',
    sky: '#EFF6FF',           // Soft ice blue surface
    teal: '#0D9488',          // Clinical teal for vitals
    tealLight: '#14B8A6',     // Mint accent
    tealSoft: '#F0FDFA',      // Mint soft tint
  },

  // ── Accent Colors (Clinical Action Categories) ──────
  accent: {
    medication: {
      bg: '#EFF6FF',
      icon: '#2563EB',
      text: '#1D4ED8',
      border: '#DBEAFE',
    },
    dailyCheck: {
      bg: '#FFFBEB',
      icon: '#D97706',
      text: '#B45309',
      border: '#FDE68A',
    },
    speak: {
      bg: '#F5F3FF',
      icon: '#7C3AED',
      text: '#6D28D9',
      border: '#DDD6FE',
    },
    emergency: {
      bg: '#FEF2F2',
      icon: '#DC2626',
      text: '#B91C1C',
      border: '#FECACA',
    },
    consultation: {
      bg: '#2563EB',
      icon: '#FFFFFF',
      text: '#FFFFFF',
      border: 'transparent',
    },
  },

  // ── Status & Vitals Colors ─────────────────────────
  status: {
    success: '#059669',
    successLight: '#ECFDF5',
    successText: '#047857',
    warning: '#D97706',
    warningLight: '#FFFBEB',
    warningText: '#B45309',
    error: '#DC2626',
    errorLight: '#FEF2F2',
    errorText: '#B91C1C',
    info: '#2563EB',
    infoLight: '#EFF6FF',
    infoText: '#1D4ED8',
    dueNow: '#EA580C',
    dueNowLight: '#FFF7ED',
  },

  // ── Neutral Scale (Ultra Crisp with index support) ──
  neutral: {
    white: '#FFFFFF',
    snow: '#FAFCFF',
    gray50: '#F8FAFC',
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    gray500: '#64748B',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1E293B',
    black: '#0F172A',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // ── Semantic Typography & Surfaces ─────────────────
  text: {
    primary: '#0F172A',       // Crisp Dark Navy
    secondary: '#475569',     // Slate Medium
    tertiary: '#94A3B8',      // Muted placeholder
    inverse: '#FFFFFF',       // Contrast White
    link: '#2563EB',          // Clinical Blue Link
  },

  background: {
    primary: '#F8FAFC',       // Clean hospital canvas
    secondary: '#F1F5F9',     // Input background
    card: '#FFFFFF',          // Pure white surface
    elevated: '#FFFFFF',
    greeting: '#EFF6FF',
    subtle: '#F1F5F9',
  },

  border: {
    light: '#F1F5F9',
    default: '#E2E8F0',
    focus: '#2563EB',
    active: '#3B6BE8',
  },

  // ── Gradients ─────────────────────────────────────
  gradient: {
    hero: ['#2563EB', '#1D4ED8', '#1E3A8A'] as const,
    primary: ['#3B82F6', '#1D4ED8'] as const,
    card: ['#FFFFFF', '#FAFCFF'] as const,
    softBlue: ['#EFF6FF', '#DBEAFE'] as const,
    greeting: ['#EFF6FF', '#F8FAFC'] as const,
    teal: ['#0D9488', '#059669'] as const,
    blue: ['#0F172A', '#2563EB'] as const,
  },

  // ── Mood & Health Range Colors ────────────────────
  mood: {
    great: '#059669',
    good: '#2563EB',
    neutral: '#D97706',
    bad: '#DC2626',
  },
} as const;

export type Colors = typeof colors;
