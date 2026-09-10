/**
 * RecentUpdates — Health update timeline
 *
 * Shows recent mood/health entries with emoji face icons,
 * dates, and descriptions.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectionHeader } from '../common/SectionHeader';
import { colors, typography, spacing, borderRadius } from '../../theme';
import type { HealthUpdate, MoodType } from '../../types';

interface RecentUpdatesProps {
  updates: HealthUpdate[];
}

const getMoodIcon = (mood: MoodType): {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
} => {
  switch (mood) {
    case 'great':
      return { name: 'happy', color: colors.mood.great, bgColor: colors.status.successLight };
    case 'good':
      return { name: 'happy-outline', color: colors.mood.good, bgColor: colors.primary.tealSoft };
    case 'neutral':
      return { name: 'sad-outline', color: colors.mood.neutral, bgColor: colors.status.warningLight };
    case 'bad':
      return { name: 'sad', color: colors.mood.bad, bgColor: colors.status.errorLight };
  }
};

const UpdateItem: React.FC<{ update: HealthUpdate }> = ({ update }) => {
  const mood = getMoodIcon(update.mood);

  return (
    <View style={styles.updateRow}>
      <View style={[styles.moodIcon, { backgroundColor: mood.bgColor }]}>
        <Ionicons name={mood.name} size={20} color={mood.color} />
      </View>
      <View style={styles.updateInfo}>
        <Text style={styles.updateDate}>{update.date}</Text>
        <Text style={styles.updateDesc}>{update.description}</Text>
      </View>
    </View>
  );
};

export const RecentUpdates: React.FC<RecentUpdatesProps> = ({ updates }) => {
  return (
    <View style={styles.container}>
      <SectionHeader
        title="Recent Updates"
        icon="sparkles"
        iconColor={colors.primary.teal}
        onSeeAll={() => {}}
        compact
      />

      {updates.map((update) => (
        <UpdateItem key={update.id} update={update} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  moodIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  updateInfo: {
    flex: 1,
  },
  updateDate: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  updateDesc: {
    ...typography.smallMedium,
    color: colors.text.primary,
    marginTop: 1,
  },
});
