/**
 * GreetingCard — Active Teleconsultation & Daily Clinical Plan
 *
 * Clinical card with:
 * - Next live consultation info
 * - 1-tap "Enter Video Consultation" action
 * - Doctor details & specialty
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

interface GreetingCardProps {
  patientName: string;
  upcomingCount?: number;
  onPressAction?: () => void;
  onDoctorPress?: () => void;
  onJoinCall?: () => void;
}

export const GreetingCard: React.FC<GreetingCardProps> = ({
  patientName,
  upcomingCount = 1,
  onPressAction,
  onDoctorPress,
  onJoinCall,
}) => {
  return (
    <View style={styles.card}>
      {/* Consultation Alert Banner */}
      <View style={styles.topBadgeRow}>
        <View style={styles.livePill}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveText}>Upcoming Consultation</Text>
        </View>
        <Text style={styles.timeTag}>Today • 04:30 PM</Text>
      </View>

      {/* Doctor Info */}
      <TouchableOpacity
        style={styles.doctorRow}
        onPress={onDoctorPress}
        activeOpacity={0.7}
      >
        <View style={styles.docAvatarCircle}>
          <Ionicons name="videocam" size={20} color={colors.primary.blue} />
        </View>
        <View style={styles.docTextCol}>
          <Text style={styles.doctorName}>Dr. Ramesh Kumar, MD</Text>
          <Text style={styles.doctorSpecialty}>Cardiology & Preventive Health Review</Text>
        </View>
      </TouchableOpacity>

      {/* Call to action button */}
      <TouchableOpacity
        style={styles.joinBtn}
        onPress={onJoinCall}
        activeOpacity={0.85}
      >
        <Ionicons name="videocam-outline" size={18} color="#FFFFFF" />
        <Text style={styles.joinBtnText}>Join Teleconsultation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
    marginBottom: spacing.md,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.blue,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary.blue,
  },
  timeTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  docAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTextCol: {
    flex: 1,
  },
  doctorName: {
    ...typography.h3,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  doctorSpecialty: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.blue,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    marginTop: spacing.sm,
    gap: 6,
    ...shadows.button,
  },
  joinBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
