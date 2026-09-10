/**
 * VitalsSnapshot — Live Clinical Vitals Carousel
 *
 * Real-time clinical parameters:
 * - Blood Pressure (120/80 mmHg - Optimal)
 * - Blood Sugar (98 mg/dL - Fasting Normal)
 * - Heart Rate (72 bpm - Resting)
 * - SpO2 Oxygen (98% - Normal)
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

interface VitalItem {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'optimal' | 'attention' | 'normal';
  statusText: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
}

const VITALS_DATA: VitalItem[] = [
  {
    id: 'vital-bp',
    name: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    status: 'optimal',
    statusText: 'Optimal',
    icon: 'heart',
    iconColor: '#DC2626',
    bgColor: '#FEF2F2',
  },
  {
    id: 'vital-glucose',
    name: 'Blood Sugar',
    value: '98',
    unit: 'mg/dL',
    status: 'optimal',
    statusText: 'Fasting Normal',
    icon: 'water',
    iconColor: '#2563EB',
    bgColor: '#EFF6FF',
  },
  {
    id: 'vital-pulse',
    name: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    status: 'normal',
    statusText: 'Resting Normal',
    icon: 'pulse',
    iconColor: '#059669',
    bgColor: '#ECFDF5',
  },
  {
    id: 'vital-spo2',
    name: 'Oxygen Saturation',
    value: '98',
    unit: '%',
    status: 'optimal',
    statusText: 'Normal',
    icon: 'leaf',
    iconColor: '#7C3AED',
    bgColor: '#F5F3FF',
  },
];

interface VitalsSnapshotProps {
  onVitalPress?: (vitalId: string) => void;
  onSeeAll?: () => void;
}

export const VitalsSnapshot: React.FC<VitalsSnapshotProps> = ({
  onVitalPress,
  onSeeAll,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="fitness-outline" size={18} color={colors.primary.blue} />
          <Text style={styles.title}>Live Vitals Snapshot</Text>
        </View>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>View Trends</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      >
        {VITALS_DATA.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.vitalCard}
            onPress={() => onVitalPress?.(item.id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon} size={18} color={item.iconColor} />
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{item.statusText}</Text>
              </View>
            </View>

            <Text style={styles.vitalName}>{item.name}</Text>

            <View style={styles.valueRow}>
              <Text style={styles.vitalValue}>{item.value}</Text>
              <Text style={styles.vitalUnit}>{item.unit}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
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
  carousel: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: 4,
  },
  vitalCard: {
    width: 156,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
  },
  vitalName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
  },
  vitalUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
});
