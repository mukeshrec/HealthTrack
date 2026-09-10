/**
 * TodaysCare — Medication list & daily health check
 *
 * Shows due medications with timing/status badges
 * and a Daily Health Check item with a Start button.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Button } from '../common/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';
import type { Medication, DailyHealthCheck } from '../../types';

interface TodaysCareProps {
  medications: Medication[];
  dailyCheck: DailyHealthCheck;
}

const MedicationRow: React.FC<{ medication: Medication }> = ({ medication }) => {
  const isDueNow = medication.status === 'due_now';

  return (
    <TouchableOpacity
      style={styles.medRow}
      activeOpacity={0.6}
      accessibilityLabel={`${medication.name}, ${medication.schedule}, ${isDueNow ? 'Due now' : medication.timeUntil}`}
      accessibilityRole="button"
    >
      <View style={[styles.medIcon, { backgroundColor: medication.iconColor + '18' }]}>
        <Ionicons
          name="ellipse"
          size={20}
          color={medication.iconColor}
        />
      </View>

      <View style={styles.medInfo}>
        <Text style={styles.medName}>{medication.name}</Text>
        <Text style={styles.medSchedule}>{medication.schedule}</Text>
      </View>

      <View style={styles.medStatus}>
        <Text
          style={[
            styles.medStatusText,
            isDueNow ? styles.medStatusDue : styles.medStatusUpcoming,
          ]}
        >
          {isDueNow ? 'Due now' : medication.timeUntil}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.neutral.gray300}
        />
      </View>
    </TouchableOpacity>
  );
};

const DailyCheckRow: React.FC<{ check: DailyHealthCheck }> = ({ check }) => {
  return (
    <TouchableOpacity
      style={styles.medRow}
      activeOpacity={0.6}
      accessibilityLabel={`${check.title}: ${check.description}`}
      accessibilityRole="button"
    >
      <View style={[styles.medIcon, { backgroundColor: colors.status.successLight }]}>
        <Ionicons
          name="checkmark-circle"
          size={22}
          color={colors.status.success}
        />
      </View>

      <View style={styles.medInfo}>
        <Text style={styles.medName}>{check.title}</Text>
        <Text style={styles.medSchedule}>{check.description}</Text>
      </View>

      <View style={styles.startButtonContainer}>
        <Button
          title="Start"
          variant="outline"
          size="small"
          onPress={() => {
            // Phase 0: no-op
          }}
        />
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.neutral.gray300}
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
};

export const TodaysCare: React.FC<TodaysCareProps> = ({
  medications,
  dailyCheck,
}) => {
  return (
    <View style={styles.container}>
      <SectionHeader
        title="Today's Care"
        icon="clipboard-outline"
        onSeeAll={() => {}}
      />

      <Card variant="elevated" padding={0}>
        {medications.map((med, index) => (
          <React.Fragment key={med.id}>
            <MedicationRow medication={med} />
            {(index < medications.length - 1 || !dailyCheck.isCompleted) && (
              <View style={styles.divider} />
            )}
          </React.Fragment>
        ))}
        <DailyCheckRow check={dailyCheck} />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  medIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    ...typography.bodySemibold,
    color: colors.text.primary,
  },
  medSchedule: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: 2,
  },
  medStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  medStatusText: {
    ...typography.smallMedium,
  },
  medStatusDue: {
    color: colors.status.dueNow,
  },
  medStatusUpcoming: {
    color: colors.text.secondary,
  },
  startButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chevron: {
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.base,
  },
});
