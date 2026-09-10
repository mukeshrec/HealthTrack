/**
 * Header — App top bar
 *
 * Displays the Health Memory logo, notification bell with badge,
 * and user avatar with name and dropdown chevron.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import type { Patient } from '../../types';

interface HeaderProps {
  patient: Patient;
}

export const Header: React.FC<HeaderProps> = ({ patient }) => {
  return (
    <View style={styles.container}>
      {/* Logo + Brand */}
      <View style={styles.logoSection}>
        <View style={styles.logoIcon}>
          <Ionicons name="heart" size={22} color={colors.primary.teal} />
        </View>
        <View>
          <Text style={styles.brandTitle}>
            Health{' '}
            <Text style={styles.brandAccent}>Memory</Text>
          </Text>
          <Text style={styles.tagline}>
            Your health. Your memory. Wherever you go.
          </Text>
        </View>
      </View>

      {/* Right Side: Bell + Avatar */}
      <View style={styles.rightSection}>
        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.bellButton}
          accessibilityLabel={`${patient.notificationCount} notifications`}
          accessibilityRole="button"
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text.primary}
          />
          <Badge count={patient.notificationCount} />
        </TouchableOpacity>

        {/* User Avatar + Name */}
        <TouchableOpacity
          style={styles.profileButton}
          accessibilityLabel={`Profile: ${patient.firstName}`}
          accessibilityRole="button"
        >
          <Avatar
            source={require('../../../assets/images/avatar-lakshmi.jpg')}
            name={`${patient.firstName} ${patient.lastName}`}
            size={40}
          />
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>{patient.firstName}</Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={colors.text.secondary}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  brandTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  brandAccent: {
    color: colors.primary.teal,
  },
  tagline: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: -2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bellButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  profileName: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});
