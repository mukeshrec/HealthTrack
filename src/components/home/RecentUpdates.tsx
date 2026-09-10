/**
 * RecentUpdates — Longitudinal Medical Updates & Lab Timeline
 *
 * Feed of recent health activities, lab uploads, and vitals logs.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import type { HealthUpdate } from '../../types';

interface RecentUpdatesProps {
  updates: HealthUpdate[];
  onSeeAll?: () => void;
  onUpdatePress?: (id?: string) => void;
}

const getMoodConfig = (mood: HealthUpdate['mood']) => {
  switch (mood) {
    case 'great':
      return { icon: 'happy-outline' as const, color: '#059669', bg: '#ECFDF5', title: 'Optimal Health Log' };
    case 'good':
      return { icon: 'fitness-outline' as const, color: '#2563EB', bg: '#EFF6FF', title: 'Clinical Vitals Entry' };
    case 'neutral':
      return { icon: 'pulse-outline' as const, color: '#D97706', bg: '#FFFBEB', title: 'Routine Check-In' };
    case 'bad':
      return { icon: 'alert-circle-outline' as const, color: '#DC2626', bg: '#FEF2F2', title: 'Symptom Flag' };
    default:
      return { icon: 'document-text-outline' as const, color: '#2563EB', bg: '#EFF6FF', title: 'Medical Update' };
  }
};

export const RecentUpdates: React.FC<RecentUpdatesProps> = ({
  updates,
  onSeeAll,
  onUpdatePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recent Health Records</Text>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Full History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardList}>
        {updates.map((item, index) => {
          const config = getMoodConfig(item.mood);
          return (
            <React.Fragment key={item.id}>
              {index > 0 && <View style={styles.divider} />}
              <TouchableOpacity
                style={styles.updateCard}
                onPress={() => onUpdatePress?.(item.id)}
                activeOpacity={0.75}
              >
                <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
                  <Ionicons
                    name={config.icon}
                    size={18}
                    color={config.color}
                  />
                </View>

                <View style={styles.textCol}>
                  <View style={styles.titleRow}>
                    <Text style={styles.updateTitle}>{config.title}</Text>
                    <Text style={styles.timeAgo}>{item.date}</Text>
                  </View>
                  <Text style={styles.updateDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.md,
    marginBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  seeAllText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary.blue,
  },
  cardList: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
    paddingHorizontal: spacing.md,
  },
  updateCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[100],
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  updateTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  timeAgo: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  updateDesc: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
});
