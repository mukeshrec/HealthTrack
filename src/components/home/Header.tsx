/**
 * Header — MyCare+ Enterprise Top Bar & Search System
 *
 * Clinical brand bar with:
 * - MyCare+ heart emblem & active health index
 * - Quick Emergency SOS trigger
 * - Integrated medical search bar & filter chips
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Avatar } from '../common/Avatar';
import type { Patient } from '../../types';

interface HeaderProps {
  patient: Patient;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  activeFilter?: string;
  onFilterSelect?: (filter: string) => void;
  onNotificationPress?: () => void;
  onEmergencyPress?: () => void;
}

const FILTER_TAGS = ['All', 'Vitals', 'Meds', 'Labs', 'Doctors'];

export const Header: React.FC<HeaderProps> = ({
  patient,
  searchValue = '',
  onSearchChange,
  activeFilter = 'All',
  onFilterSelect,
  onNotificationPress,
  onEmergencyPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Brand Bar */}
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../../assets/images/app-emblem.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.brandText}>
              mycare<Text style={styles.brandPlus}>+</Text>
            </Text>
            <View style={styles.healthStatusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.healthStatusText}>Health Index 96% • Stable</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {/* Emergency SOS Button */}
          <TouchableOpacity
            style={styles.sosButton}
            onPress={onEmergencyPress}
            activeOpacity={0.8}
            accessibilityLabel="Trigger Emergency SOS"
          >
            <Ionicons name="call" size={14} color="#DC2626" />
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={styles.bellButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            {patient.notificationCount > 0 && (
              <View style={styles.badgeDot}>
                <Text style={styles.badgeDotText}>{patient.notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Avatar */}
          <Avatar name={`${patient.firstName} ${patient.lastName}`} size={38} online />
        </View>
      </View>

      {/* Patient Greeting & Subtitle */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>
          Hello, {patient.firstName} 👋
        </Text>
        <Text style={styles.greetingSubtitle}>
          Your daily clinical care plan & health memory
        </Text>
      </View>

      {/* Embedded Search Input */}
      {onSearchChange && (
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search records, medications, vitals..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchValue}
            onChangeText={onSearchChange}
          />
          {searchValue.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')}>
              <Ionicons name="close-circle" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Search Filter Tags */}
      {onFilterSelect && (
        <View style={styles.filterRow}>
          {FILTER_TAGS.map((tag) => {
            const isActive = activeFilter === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => onFilterSelect(tag)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandPlus: {
    color: '#60A5FA',
    fontWeight: '900',
  },
  healthStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  healthStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  sosText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  badgeDotText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greetingSection: {
    marginBottom: spacing.md,
  },
  greetingTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  greetingSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  filterChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
