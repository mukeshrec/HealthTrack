/**
 * Badge — Notification count indicator
 *
 * Red circle badge with white text count.
 * Used on the notification bell icon in the header.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors, typography } from '../../theme';

interface BadgeProps {
  count: number;
  size?: 'small' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({ count, size = 'medium' }) => {
  if (count <= 0) return null;

  const displayCount = count > 99 ? '99+' : String(count);

  return (
    <View
      style={[styles.badge, size === 'small' && styles.badgeSmall]}
      accessibilityLabel={`${count} notifications`}
    >
      <Text style={[styles.text, size === 'small' && styles.textSmall]}>
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: colors.status.error,
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },
  badgeSmall: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    top: -2,
    right: -4,
  },
  text: {
    color: colors.neutral.white,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  textSmall: {
    fontSize: 9,
    lineHeight: 12,
  },
});
