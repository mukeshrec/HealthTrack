/**
 * Button — Accessible button component
 *
 * Ensures 48x48 minimum touch target for elderly accessibility.
 * Supports primary, secondary, outline, and text variants.
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, borderRadius, spacing, typography, touchTarget } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.neutral.white : colors.primary.teal}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTarget.minHeight,
    minWidth: touchTarget.minWidth,
    borderRadius: borderRadius.xl,
  },

  // ── Variants ────────────────────────────
  primary: {
    backgroundColor: colors.primary.teal,
  },
  secondary: {
    backgroundColor: colors.primary.tealSoft,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary.teal,
  },
  text: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },

  // ── Sizes ───────────────────────────────
  size_small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 36,
    borderRadius: borderRadius.lg,
  },
  size_medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  size_large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },

  // ── Text ────────────────────────────────
  // @ts-ignore – RN style compatibility
  text_base: {
    ...typography.buttonMedium,
  },
  text_primary: {
    color: colors.neutral.white,
  },
  text_secondary: {
    color: colors.primary.teal,
  },
  text_outline: {
    color: colors.primary.teal,
  },
  text_text: {
    color: colors.primary.teal,
  },
  text_small: {
    ...typography.buttonSmall,
  },
  text_medium: {
    ...typography.buttonMedium,
  },
  text_large: {
    ...typography.buttonLarge,
  },
  textDisabled: {
    opacity: 0.7,
  },
});
