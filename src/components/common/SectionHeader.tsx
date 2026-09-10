/**
 * SectionHeader — Section title with "See All" link
 *
 * Used for "Today's Care", "Recent Updates",
 * "Upcoming Appointments" section headers.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, touchTarget } from '../../theme';

interface SectionHeaderProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onSeeAll?: () => void;
  showSeeAll?: boolean;
  compact?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  iconColor = colors.text.primary,
  onSeeAll,
  showSeeAll = true,
  compact = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {icon && (
          <Ionicons
            name={icon}
            size={compact ? 16 : 20}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {showSeeAll && (
        <TouchableOpacity
          onPress={onSeeAll}
          style={styles.seeAllButton}
          accessibilityLabel={`See all ${title}`}
          accessibilityRole="button"
        >
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    marginRight: spacing.xs,
  },
  icon: {
    marginRight: spacing.s,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    flexShrink: 1,
  },
  titleCompact: {
    fontSize: 15,
    lineHeight: 20,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget.minHeight,
    paddingLeft: spacing.xs,
    flexShrink: 0,
  },
  seeAllText: {
    ...typography.smallMedium,
    color: colors.text.secondary,
    marginRight: 2,
  },
});
