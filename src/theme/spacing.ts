/**
 * Health Memory — Spacing Design System
 *
 * 4px base unit grid. Provides consistent spacing
 * and border radius tokens across the app.
 */

export const spacing = {
  /** 2px */  xxs: 2,
  /** 4px */  xs: 4,
  /** 6px */  s: 6,
  /** 8px */  sm: 8,
  /** 12px */ md: 12,
  /** 16px */ base: 16,
  /** 20px */ lg: 20,
  /** 24px */ xl: 24,
  /** 32px */ xxl: 32,
  /** 40px */ xxxl: 40,
  /** 48px */ huge: 48,
  /** 64px */ massive: 64,
} as const;

export const borderRadius = {
  /** 4px */  xs: 4,
  /** 8px */  sm: 8,
  /** 12px */ md: 12,
  /** 16px */ lg: 16,
  /** 20px */ xl: 20,
  /** 24px */ xxl: 24,
  /** 999px */ full: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#1B2B5A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#1B2B5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  bottomTab: {
    shadowColor: '#1B2B5A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

/** Minimum touch target for accessibility (48x48dp) */
export const touchTarget = {
  minHeight: 48,
  minWidth: 48,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
