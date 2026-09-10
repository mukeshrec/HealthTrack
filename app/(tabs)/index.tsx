/**
 * Home Screen — Health Memory
 *
 * Main dashboard assembling all home components:
 * Header, GreetingCard, QuickActions, TodaysCare,
 * RecentUpdates, and UpcomingAppointments.
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/home/Header';
import { GreetingCard } from '../../src/components/home/GreetingCard';
import { QuickActions } from '../../src/components/home/QuickActions';
import { TodaysCare } from '../../src/components/home/TodaysCare';
import { RecentUpdates } from '../../src/components/home/RecentUpdates';
import { UpcomingAppointments } from '../../src/components/home/UpcomingAppointments';
import { colors, spacing } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import {
  currentPatient,
  quickActions,
  medications,
  dailyHealthCheck,
  recentUpdates,
  upcomingAppointments,
} from '../../src/constants/mockData';

import { CaregiverDashboard } from '../../src/components/home/CaregiverDashboard';

export default function HomeScreen() {
  const { user } = useAuth();

  // Create a patient mock with the current user's details for the header
  const headerPatient = {
    ...currentPatient,
    firstName: user?.name?.split(' ')[0] || currentPatient.firstName,
    lastName: user?.name?.split(' ')[1] || currentPatient.lastName,
  };

  if (user?.role === 'caregiver') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <CaregiverDashboard />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Logo + Bell + Avatar */}
        <Header patient={headerPatient} />

        {/* Greeting Card */}
        <GreetingCard patientName={user?.name || currentPatient.firstName} role={user?.role} />

        {/* Quick Action Cards */}
        <QuickActions actions={quickActions} />

        {/* Today's Care: Medications + Daily Check */}
        <TodaysCare
          medications={medications}
          dailyCheck={dailyHealthCheck}
          role={user?.role}
        />

        {/* Bottom Row: Recent Updates | Upcoming Appointments */}
        <View style={styles.bottomRow}>
          <View style={styles.bottomCol}>
            <RecentUpdates updates={recentUpdates} />
          </View>
          <View style={styles.bottomCol}>
            <UpcomingAppointments appointments={upcomingAppointments} />
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bottomRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  bottomCol: {
    flex: 1,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
