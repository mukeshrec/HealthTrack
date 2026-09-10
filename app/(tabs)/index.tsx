/**
 * Home Screen — MyCare+ Enterprise Medical Dashboard
 *
 * Supports dual-role experience:
 * 1. Caregiver / Guardian: Linked patient directory + instant AI memory queries
 * 2. Patient: Real-world clinical vitals, teleconsultation hero, medication tracker
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Header,
  GreetingCard,
  VitalsSnapshot,
  QuickActions,
  TodaysCare,
  RecentUpdates,
  UpcomingAppointments,
} from '../../src/components/home';
import { CaregiverDashboard } from '../../src/components/home/CaregiverDashboard';
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

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // If logged in as Caregiver, show the Caregiver Guardian Console
  if (user?.role === 'caregiver') {
    return (
      <SafeAreaView style={styles.safeAreaCaregiver} edges={['top']}>
        <CaregiverDashboard />
      </SafeAreaView>
    );
  }

  // Header patient model
  const headerPatient = {
    ...currentPatient,
    firstName: user?.name ? user.name.split(' ')[0] : currentPatient.firstName,
    lastName: user?.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : currentPatient.lastName,
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'qa-medications' || actionId === 'qa-daily-check' || actionId === 'qa-speak') {
      router.push('/(tabs)/health-memory');
    } else if (actionId === 'qa-emergency') {
      triggerEmergencySOS();
    }
  };

  const triggerEmergencySOS = () => {
    Alert.alert(
      'Emergency SOS Initiated',
      'Connecting you immediately to the nearest on-call geriatric emergency physician and alerting your primary guardian (Anand Devi).',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Doctor Now',
          style: 'destructive',
          onPress: () => router.push('/(tabs)/care-team'),
        },
      ]
    );
  };

  const handleJoinTeleconsultation = () => {
    Alert.alert(
      'Connecting to Teleconsultation Room',
      'Establishing secure HIPAA-compliant video link with Dr. Ramesh Kumar, MD...',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Enter Consultation Room', onPress: () => router.push('/(tabs)/care-team') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Gradient Header matching enterprise standards */}
        <LinearGradient
          colors={['#2563EB', '#1D4ED8', '#1E3A8A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 16) }]}
        >
          <Header
            patient={headerPatient}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterSelect={setActiveFilter}
            onNotificationPress={() => router.push('/(tabs)/care-team')}
            onEmergencyPress={triggerEmergencySOS}
          />
        </LinearGradient>

        <View style={styles.bodyContent}>
          {/* Active Teleconsultation Hero Banner */}
          <GreetingCard
            patientName={headerPatient.firstName}
            upcomingCount={upcomingAppointments.length}
            onPressAction={() => router.push('/(tabs)/care-team')}
            onDoctorPress={() => router.push('/(tabs)/care-team')}
            onJoinCall={handleJoinTeleconsultation}
          />

          {/* Live Clinical Vitals Snapshot Carousel */}
          <VitalsSnapshot
            onVitalPress={() => router.push('/(tabs)/health-memory')}
            onSeeAll={() => router.push('/(tabs)/health-memory')}
          />

          {/* 2x2 Clinical Quick Action Grid */}
          <QuickActions
            actions={quickActions}
            onActionPress={handleQuickAction}
          />

          {/* Today's Care: Medications & Daily Check */}
          <TodaysCare
            medications={medications}
            dailyCheck={dailyHealthCheck}
            onSeeAllMedications={() => router.push('/(tabs)/health-memory')}
            onDailyCheckPress={() => router.push('/(tabs)/health-memory')}
          />

          {/* Upcoming Consultations */}
          <UpcomingAppointments
            appointments={upcomingAppointments}
            onSeeAll={() => router.push('/(tabs)/care-team')}
            onAppointmentPress={() => router.push('/(tabs)/care-team')}
          />

          {/* Recent Longitudinal Health Logs */}
          <RecentUpdates
            updates={recentUpdates}
            onSeeAll={() => router.push('/(tabs)/health-memory')}
            onUpdatePress={() => router.push('/(tabs)/health-memory')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaCaregiver: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: spacing.lg,
  },
  bodyContent: {
    marginTop: -spacing.xs,
  },
});
