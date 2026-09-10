/**
 * IconCard — Quick action card
 *
 * Displays an icon in a colored circle with title and subtitle.
 * Used for the Medications, Daily Check, Speak, Emergency grid.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, touchTarget } from '../../theme';

interface IconCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  iconColor: string;
  textColor: string;
  onPress?: () => void;
}

export const IconCard: React.FC<IconCardProps> = ({
  title,
  subtitle,
  icon,
  bgColor,
  iconColor,
  textColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${subtitle}`}
    >
      <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={26} color={iconColor} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 2,
    minHeight: touchTarget.minHeight,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.s,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
});
