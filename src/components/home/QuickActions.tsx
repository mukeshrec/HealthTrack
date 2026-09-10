/**
 * QuickActions — Clinical 2x2 Action Matrix
 *
 * Spacious 2x2 grid with high-contrast icons:
 * - Medications Checklist
 * - Daily Health Check
 * - AI Voice / Memory
 * - Emergency SOS
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import type { QuickAction } from '../../types';

interface QuickActionsProps {
  actions: QuickAction[];
  onActionPress?: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Clinical Actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.card}
            onPress={() => onActionPress?.(action.id)}
            activeOpacity={0.75}
          >
            <View style={[styles.iconBox, { backgroundColor: action.bgColor }]}>
              <Ionicons
                name={action.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={action.iconColor}
              />
            </View>
            <View style={styles.textCol}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    flexBasis: '47.5%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
    gap: spacing.sm,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  actionSubtitle: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
