/**
 * Home Screen — MyCare+ Enterprise Medical Dashboard
 *
 * Supports dual-role experience:
 * 1. Caregiver / Guardian: Linked patient directory + instant AI memory queries
 * 2. Patient: Real-world clinical vitals, teleconsultation hero, medication tracker
 */

import React, { useState, useEffect, useRef } from 'react';
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
  MedicineVoiceAlarmModal,
  AlarmPayload,
} from '../../src/components/home';
import { CaregiverDashboard } from '../../src/components/home/CaregiverDashboard';
import { colors, spacing } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { API_BASE_URL } from '../../src/config/api';
import {
  currentPatient,
  quickActions,
  medications,
  dailyHealthCheck,
  recentUpdates,
  upcomingAppointments,
} from '../../src/constants/mockData';

export default function HomeScreen() {
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Live Looping Voice Alarm State
  const [alarmData, setAlarmData] = useState<AlarmPayload | null>(null);
  const [isAlarmModalVisible, setIsAlarmModalVisible] = useState(false);
  const lastAlarmIdRef = useRef<string | null>(null);

  // Poll for active guardian voice alarms if logged in as patient
  useEffect(() => {
    if (user?.role === 'caregiver') return;

    const checkActiveAlarm = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications/active-alarm?patientId=${user?.id || 'default-patient'}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.active && data.alarm) {
            if (lastAlarmIdRef.current !== data.alarm.id) {
              lastAlarmIdRef.current = data.alarm.id;
              setAlarmData({
                id: data.alarm.id,
                medicineName: data.alarm.medicineName,
                dosage: data.alarm.dosage,
                instruction: data.alarm.instruction,
                slot: data.alarm.slot,
                time: data.alarm.time,
                senderName: data.alarm.senderName,
                patientName: user?.name ? user.name.split(' ')[0] : 'Lakshmi',
              });
              setIsAlarmModalVisible(true);
            }
          }
        }
      } catch (err) {
        // quiet fallback
      }
    };

    checkActiveAlarm();
    const interval = setInterval(checkActiveAlarm, 4000);
    return () => clearInterval(interval);
  }, [user, token]);

  const handleTestVoiceAlarm = () => {
    const sampleMed = medications[0] || {
      name: 'Metformin Hydrochloride',
      dosage: '500mg',
      schedule: 'After Breakfast',
      time: '08:00 AM'
    };

    setAlarmData({
      id: `test-alarm-${Date.now()}`,
      medicineName: sampleMed.name,
      dosage: sampleMed.dosage,
      instruction: 'After Breakfast',
      slot: 'Morning',
      time: '08:00 AM',
      senderName: 'Guardian Anand Devi',
      patientName: user?.name ? user.name.split(' ')[0] : 'Lakshmi',
    });
    setIsAlarmModalVisible(true);
  };

  const handleTurnOffAndTake = async () => {
    setIsAlarmModalVisible(false);
    if (alarmData?.id) {
      try {
        await fetch(`${API_BASE_URL}/notifications/dismiss-alarm`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            alarmId: alarmData.id,
            patientId: user?.id,
            taken: true
          })
        });
      } catch (e) {}
    }
    Alert.alert('Dose Logged', `${alarmData?.medicineName || 'Medicine'} marked as taken. Guardian notified.`);
  };

  const handleDismissAlarm = async () => {
    setIsAlarmModalVisible(false);
    if (alarmData?.id) {
      try {
        await fetch(`${API_BASE_URL}/notifications/dismiss-alarm`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            alarmId: alarmData.id,
            patientId: user?.id,
            taken: false
          })
        });
      } catch (e) {}
    }
  };

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

      {/* Looping Audible Voice Alarm Modal for Patient */}
      <MedicineVoiceAlarmModal
        visible={isAlarmModalVisible}
        alarmData={alarmData}
        onDismiss={handleDismissAlarm}
        onTakeMedicine={handleTurnOffAndTake}
      />

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

          {/* Today's Care: Medications & Daily Check with Test Voice Alarm Button */}
          <TodaysCare
            medications={medications}
            dailyCheck={dailyHealthCheck}
            onSeeAllMedications={() => router.push('/(tabs)/health-memory')}
            onDailyCheckPress={() => router.push('/(tabs)/health-memory')}
            onTestVoiceAlarm={handleTestVoiceAlarm}
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
