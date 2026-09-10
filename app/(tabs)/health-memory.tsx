/**
 * Health Memory Screen — Placeholder
 *
 * Will contain the longitudinal health record timeline
 * in a future phase.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../src/theme';

export default function HealthMemoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={64} color={colors.primary.teal} />
        </View>
        <Text style={styles.title}>Health Memory</Text>
        <Text style={styles.subtitle}>
          Your complete health timeline will appear here.
        </Text>
        <Text style={styles.description}>
          Decades of diagnoses, prescriptions, lab results, and clinical notes — all in one place.
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Coming in Phase 1</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
  badge: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary.tealSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  badgeText: {
    ...typography.smallMedium,
    color: colors.primary.teal,
  },
});
