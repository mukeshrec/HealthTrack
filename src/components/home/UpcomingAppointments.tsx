/**
 * UpcomingAppointments — Clinical Consultations & Doctor Appointments
 *
 * Card list with:
 * - Doctor name, specialty, date, and location/virtual status
 * - 1-tap appointment actions
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
import type { Appointment } from '../../types';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onSeeAll?: () => void;
  onAppointmentPress?: (id?: string) => void;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  onSeeAll,
  onAppointmentPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Upcoming Consultations</Text>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Book New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardList}>
        {appointments.map((apt) => (
          <TouchableOpacity
            key={apt.id}
            style={styles.appointmentCard}
            onPress={() => onAppointmentPress?.(apt.id)}
            activeOpacity={0.75}
          >
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>{apt.date.split(' ')[0] || 'TOM'}</Text>
              <Text style={styles.dateNum}>{apt.date.split(' ')[1] || '12'}</Text>
            </View>

            <View style={styles.infoCol}>
              <Text style={styles.docName}>{apt.doctor?.name || 'Dr. Specialist'}</Text>
              <Text style={styles.docSpecialty}>{apt.doctor?.specialty || 'General Consultation'}</Text>
              <View style={styles.timeLocationRow}>
                <Ionicons name="time-outline" size={13} color={colors.text.tertiary} />
                <Text style={styles.timeText}>{apt.time}</Text>
                <Text style={styles.dot}>•</Text>
                <Ionicons name="videocam-outline" size={13} color={colors.primary.blue} />
                <Text style={[styles.locationText, { color: colors.primary.blue, fontWeight: '600' }]}>
                  Teleconsultation
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color={colors.neutral[400]} />
          </TouchableOpacity>
        ))}
      </View>
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
  sectionTitle: {
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
  cardList: {
    gap: spacing.sm,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
    gap: spacing.md,
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary.blue,
    textTransform: 'uppercase',
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary.blue,
  },
  infoCol: {
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  docSpecialty: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 1,
  },
  timeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  dot: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginHorizontal: 2,
  },
  locationText: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
});
