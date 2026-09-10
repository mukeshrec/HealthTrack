/**
 * UpcomingAppointments — Doctor appointment cards
 *
 * Lists upcoming appointments with date, time,
 * doctor name, and specialty.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectionHeader } from '../common/SectionHeader';
import { colors, typography, spacing, borderRadius } from '../../theme';
import type { Appointment } from '../../types';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

const AppointmentItem: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  return (
    <View style={styles.appointmentRow}>
      <Text style={styles.dateTime}>
        {appointment.date} • {appointment.time}
      </Text>
      <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
      <Text style={styles.specialty}>{appointment.doctor.specialty}</Text>
    </View>
  );
};

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
}) => {
  return (
    <View style={styles.container}>
      <SectionHeader
        title="Upcoming Appointments"
        icon="calendar-outline"
        iconColor={colors.primary.deepBlue}
        onSeeAll={() => {}}
        compact
      />

      {appointments.map((appt, index) => (
        <React.Fragment key={appt.id}>
          <AppointmentItem appointment={appt} />
          {index < appointments.length - 1 && (
            <View style={styles.divider} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appointmentRow: {
    marginBottom: spacing.md,
  },
  dateTime: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text.primary,
  },
  specialty: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.secondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginBottom: spacing.md,
  },
});
