/**
 * MyCare+ — Spacing & Layout Tokens
 *
 * 4px base unit grid, modern rounded corners, and soft clinical shadows.
 */

export const spacing = {
  /** 2px */   xxs: 2,
  /** 4px */   xs: 4,
  /** 6px */   s: 6,
  /** 8px */   sm: 8,
  /** 10px */  smd: 10,
  /** 12px */  md: 12,
  /** 14px */  mdl: 14,
  /** 16px */  base: 16,
  /** 18px */  lg_sm: 18,
  /** 20px */  lg: 20,
  /** 24px */  xl: 24,
  /** 28px */  xl_lg: 28,
  /** 32px */  xxl: 32,
  /** 40px */  xxxl: 40,
  /** 48px */  huge: 48,
  /** 64px */  massive: 64,
} as const;

export const borderRadius = {
  /** 4px */   xs: 4,
  /** 8px */   sm: 8,
  /** 12px */  md: 12,
  /** 16px */  lg: 16,
  /** 20px */  xl: 20,
  /** 24px */  xxl: 24,
  /** 28px */  xxxl: 28,
  /** 999px */ full: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#254E9E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#254E9E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  soft: {
    shadowColor: '#254E9E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  card: {
    shadowColor: '#254E9E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  cardHover: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  button: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  bottomTab: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;

export const touchTarget = {
  minHeight: 48,
  minWidth: 48,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
