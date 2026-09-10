/**
 * Health Memory — Color Design System
 * 
 * Extracted from the UI reference design.
 * Uses a warm, accessible palette optimized for elderly users
 * with high contrast ratios for readability.
 */

export const colors = {
  // ── Primary Brand ──────────────────────────────────
  primary: {
    deepBlue: '#1B2B5A',
    blue: '#2D4A8C',
    lightBlue: '#4A6FB5',
    teal: '#2AA89A',
    tealLight: '#3BBFB0',
    tealSoft: '#E8F5EE',
  },

  // ── Accent Colors (Quick Actions) ─────────────────
  accent: {
    medication: {
      bg: '#EBF2FF',
      icon: '#4A7FF7',
      text: '#3366CC',
    },
    dailyCheck: {
      bg: '#FFF4EB',
      icon: '#F5A623',
      text: '#E8941A',
    },
    speak: {
      bg: '#F3EEFF',
      icon: '#8B6FE8',
      text: '#7356D6',
    },
    emergency: {
      bg: '#FFEBEB',
      icon: '#E85454',
      text: '#D43D3D',
    },
  },

  // ── Status Colors ─────────────────────────────────
  status: {
    success: '#27AE60',
    successLight: '#E8F8EF',
    warning: '#F5A623',
    warningLight: '#FFF8EB',
    error: '#E85454',
    errorLight: '#FFEBEB',
    info: '#4A7FF7',
    infoLight: '#EBF2FF',
    dueNow: '#E8941A',
  },

  // ── Neutral / Gray Scale ──────────────────────────
  neutral: {
    white: '#FFFFFF',
    snow: '#F8F9FC',
    gray50: '#F2F4F7',
    gray100: '#E4E7EC',
    gray200: '#C9CED6',
    gray300: '#A0A7B4',
    gray400: '#7A8291',
    gray500: '#5C6470',
    gray600: '#454B55',
    gray700: '#2E3440',
    gray800: '#1E2430',
    black: '#0D1117',
  },

  // ── Semantic Tokens ───────────────────────────────
  text: {
    primary: '#1B2B5A',
    secondary: '#5C6470',
    tertiary: '#A0A7B4',
    inverse: '#FFFFFF',
    link: '#4A7FF7',
  },

  background: {
    primary: '#F8F9FC',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    greeting: '#E8F5EE',
  },

  border: {
    light: '#E4E7EC',
    default: '#C9CED6',
    focus: '#4A7FF7',
  },

  // ── Gradient Definitions ──────────────────────────
  gradient: {
    greeting: ['#E8F5EE', '#D4EFE3', '#C5E8D8'],
    teal: ['#2AA89A', '#3BBFB0'],
    blue: ['#1B2B5A', '#2D4A8C'],
  },

  // ── Mood Emoji Colors ─────────────────────────────
  mood: {
    great: '#27AE60',
    good: '#2AA89A',
    neutral: '#F5A623',
    bad: '#E85454',
  },
} as const;

export type Colors = typeof colors;
