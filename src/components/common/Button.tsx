/**
 * Button — Modern Medical Button Component
 *
 * Supports pill styles, primary gradients, soft tints, outlines, and icon adornments.
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows, touchTarget } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  pill?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  pill = true,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    pill ? styles.pill : styles.rounded,
    variant === 'primary' && styles.primaryShadow,
    disabled && styles.disabled,
    style,
  ];

  const getIconColor = () => {
    if (disabled) return colors.neutral.gray400;
    if (variant === 'primary' || variant === 'danger') return colors.neutral.white;
    if (variant === 'secondary') return colors.primary.blue;
    if (variant === 'outline') return colors.primary.blue;
    return colors.primary.blue;
  };

  const iconSize = size === 'small' ? 14 : size === 'medium' ? 18 : 20;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.neutral.white : colors.primary.blue}
          size="small"
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={getIconColor()}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              styles[`text_${variant}`],
              styles[`text_${size}`],
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={getIconColor()}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pill: {
    borderRadius: borderRadius.full,
  },
  rounded: {
    borderRadius: borderRadius.lg,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },

  // ── Variants ────────────────────────────
  primary: {
    backgroundColor: colors.primary.blue,
  },
  primaryShadow: {
    ...shadows.button,
  },
  secondary: {
    backgroundColor: colors.primary.sky,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary.blue,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.status.error,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },

  // ── Sizes ───────────────────────────────
  size_small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    minHeight: 34,
  },
  size_medium: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: touchTarget.minHeight,
  },
  size_large: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.base,
    minHeight: 52,
  },

  // ── Text ────────────────────────────────
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  text_primary: {
    color: colors.neutral.white,
  },
  text_secondary: {
    color: colors.primary.blue,
  },
  text_outline: {
    color: colors.primary.blue,
  },
  text_ghost: {
    color: colors.primary.blue,
  },
  text_danger: {
    color: colors.neutral.white,
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
    color: colors.neutral.gray400,
  },
});
