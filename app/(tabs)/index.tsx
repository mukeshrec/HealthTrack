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
import {
  currentPatient,
  quickActions,
  medications,
  dailyHealthCheck,
  recentUpdates,
  upcomingAppointments,
} from '../../src/constants/mockData';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Logo + Bell + Avatar */}
        <Header patient={currentPatient} />

        {/* Greeting Card */}
        <GreetingCard patientName={currentPatient.firstName} />

        {/* Quick Action Cards */}
        <QuickActions actions={quickActions} />

        {/* Today's Care: Medications + Daily Check */}
        <TodaysCare
          medications={medications}
          dailyCheck={dailyHealthCheck}
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
