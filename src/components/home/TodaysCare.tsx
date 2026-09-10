/**
 * TodaysCare — Medications Checklist & Daily Health Check
 *
 * Clinical checklist with:
 * - Real-time medication dose status (Due Now, Taken, Upcoming)
 * - Daily check-in module
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import type { Medication, DailyHealthCheck } from '../../types';

interface TodaysCareProps {
  medications: Medication[];
  dailyCheck: DailyHealthCheck;
  onSeeAllMedications?: () => void;
  onDailyCheckPress?: () => void;
}

export const TodaysCare: React.FC<TodaysCareProps> = ({
  medications,
  dailyCheck,
  onSeeAllMedications,
  onDailyCheckPress,
}) => {
  const [takenIds, setTakenIds] = useState<string[]>([]);

  const toggleTaken = (id: string) => {
    if (takenIds.includes(id)) {
      setTakenIds(takenIds.filter((item) => item !== id));
    } else {
      setTakenIds([...takenIds, id]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Medications Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <Text style={styles.sectionTitle}>Today's Medications</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{medications.length} Prescriptions</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onSeeAllMedications} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Manage</Text>
        </TouchableOpacity>
      </View>

      {/* Medication List Card */}
      <View style={styles.medCard}>
        {medications.map((med, index) => {
          const isTaken = takenIds.includes(med.id);
          const isDue = med.status === 'due_now';

          return (
            <React.Fragment key={med.id}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.medRow}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    isTaken && styles.checkboxChecked,
                    isDue && !isTaken && styles.checkboxDue,
                  ]}
                  onPress={() => toggleTaken(med.id)}
                  activeOpacity={0.7}
                >
                  {isTaken && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  {isDue && !isTaken && <View style={styles.dueDot} />}
                </TouchableOpacity>

                <View style={styles.medInfo}>
                  <Text style={[styles.medName, isTaken && styles.medNameTaken]}>
                    {med.name}
                  </Text>
                  <Text style={styles.medInstructions}>
                    {med.dosage} • {med.schedule}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    isTaken
                      ? styles.statusTaken
                      : isDue
                      ? styles.statusDue
                      : styles.statusUpcoming,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      isTaken
                        ? styles.statusTakenText
                        : isDue
                        ? styles.statusDueText
                        : styles.statusUpcomingText,
                    ]}
                  >
                    {isTaken ? 'Taken' : isDue ? 'Due Now' : med.timeUntil}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          );
        })}
      </View>

      {/* Daily Health Check Widget */}
      <TouchableOpacity
        style={styles.dailyCheckCard}
        onPress={onDailyCheckPress}
        activeOpacity={0.85}
      >
        <View style={styles.dailyCheckLeft}>
          <View style={styles.dailyIconBox}>
            <Ionicons name="heart-half-outline" size={22} color="#D97706" />
          </View>
          <View style={styles.dailyTextBox}>
            <Text style={styles.dailyTitle}>Daily Symptom & Mood Check</Text>
            <Text style={styles.dailySubtitle}>3 quick questions • Takes 45 seconds</Text>
          </View>
        </View>

        <View style={styles.dailyStartBtn}>
          <Text style={styles.dailyStartText}>Start</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary.blue,
  },
  seeAllText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary.blue,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[100],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkboxDue: {
    borderColor: '#EF4444',
  },
  dueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  medNameTaken: {
    textDecorationLine: 'line-through',
    color: colors.text.tertiary,
  },
  medInstructions: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTaken: {
    backgroundColor: '#ECFDF5',
  },
  statusTakenText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  statusDue: {
    backgroundColor: '#FEF2F2',
  },
  statusDueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  statusUpcoming: {
    backgroundColor: '#F1F5F9',
  },
  statusUpcomingText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
  },

  // Daily Check Widget
  dailyCheckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    ...shadows.soft,
  },
  dailyCheckLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  dailyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyTextBox: {
    flex: 1,
  },
  dailyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  dailySubtitle: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  dailyStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  dailyStartText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
