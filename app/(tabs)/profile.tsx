/**
 * Profile Screen — Placeholder
 *
 * Will contain patient profile, consent management,
 * guardian settings, and preferences in a future phase.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../src/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={64} color={colors.accent.emergency.icon} />
        </View>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          Your health identity and privacy controls.
        </Text>
        <Text style={styles.description}>
          Manage consent, guardian access, data sharing preferences, and your personal health profile.
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
    backgroundColor: colors.accent.emergency.bg,
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
    backgroundColor: colors.accent.emergency.bg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  badgeText: {
    ...typography.smallMedium,
    color: colors.accent.emergency.icon,
  },
});
