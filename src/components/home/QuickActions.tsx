/**
 * QuickActions — Horizontal quick action grid
 *
 * Four icon cards in a row: Medications, Daily Check, Speak, Emergency.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconCard } from '../common/IconCard';
import { spacing } from '../../theme';
import type { QuickAction } from '../../types';

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <IconCard
          key={action.id}
          title={action.title}
          subtitle={action.subtitle}
          icon={action.icon as keyof typeof Ionicons.glyphMap}
          bgColor={action.bgColor}
          iconColor={action.iconColor}
          textColor={action.textColor}
          onPress={() => {
            // Phase 0: no-op, will be wired in Phase 1
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.base,
  },
});
