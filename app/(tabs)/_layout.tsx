/**
 * Tab Layout — Bottom Navigation
 *
 * Professional medical bottom navigation with custom active pill indicators
 * matching the reference blue UI design.
 */

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Platform, Alert } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows, borderRadius, spacing } from '../../src/theme';
import { MedicineVoiceAlarmModal, AlarmPayload } from '../../src/components/home';
import { useAuth } from '../../src/context/AuthContext';
import { API_BASE_URL } from '../../src/config/api';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color?: string | any;
  size: number;
  focused: boolean;
  label: string;
};

const TabIcon = ({ name, color, size, focused, label }: TabIconProps) => (
  <View style={styles.iconWrapper}>
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons
        name={name}
        size={focused ? 22 : 20}
        color={focused ? colors.neutral.white : '#8E9DB8'}
      />
    </View>
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);
  const { user, token } = useAuth();

  // Global Medicine Voice Alarm State (Active on all tabs)
  const [alarmData, setAlarmData] = useState<AlarmPayload | null>(null);
  const [isAlarmModalVisible, setIsAlarmModalVisible] = useState(false);
  const lastAlarmIdRef = useRef<string | null>(null);
  const triggeredDosesRef = useRef<Set<string>>(new Set());

  // Robust time matching helper for automatic scheduled alarms
  const isTimeDueNow = (schedTime: string) => {
    if (!schedTime) return false;
    const isPM = /pm/i.test(schedTime);
    const isAM = /am/i.test(schedTime);
    const schedMeridian = isPM ? 'PM' : (isAM ? 'AM' : 'AM');
    const digitsOnly = schedTime.replace(/[a-zA-Z]/g, '').trim().replace(/[\.\s]+/g, ':');
    const [hStr, mStr] = digitsOnly.split(':');
    let schedH = parseInt(hStr || '0', 10);
    let schedM = parseInt(mStr || '0', 10);
    if (isNaN(schedH)) return false;
    if (schedH > 12) schedH = schedH - 12;
    if (schedH === 0) schedH = 12;

    const now = new Date();
    let nowH = now.getHours();
    const nowM = now.getMinutes();
    const nowMeridian = nowH >= 12 ? 'PM' : 'AM';
    nowH = nowH % 12 === 0 ? 12 : nowH % 12;

    // Check exact minute match
    if (schedH === nowH && schedM === nowM && schedMeridian === nowMeridian) {
      return true;
    }

    // Check if within 2-minute current window
    const schedTotalMins = (schedMeridian === 'PM' && schedH !== 12 ? (schedH + 12) * 60 : (schedMeridian === 'AM' && schedH === 12 ? 0 : schedH * 60)) + schedM;
    const nowTotalMins = now.getHours() * 60 + now.getMinutes();
    let diff = nowTotalMins - schedTotalMins;
    if (diff < 0) diff += 1440; // Handle midnight rollover
    if (diff >= 0 && diff <= 3) {
      return true;
    }

    return false;
  };

  // Real-time listener for scheduled doses & guardian triggers
  useEffect(() => {
    const checkAlarmAndSchedules = async () => {
      try {
        const patientTarget = user?.id || 'default-patient';

        // 1. Check for guardian-triggered alarms
        const alarmRes = await fetch(`${API_BASE_URL}/notifications/active-alarm?patientId=${patientTarget}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (alarmRes.ok) {
          const alarmJson = await alarmRes.json();
          if (alarmJson && alarmJson.active && alarmJson.alarm) {
            if (lastAlarmIdRef.current !== alarmJson.alarm.id) {
              lastAlarmIdRef.current = alarmJson.alarm.id;
              setAlarmData({
                id: alarmJson.alarm.id,
                medicineName: alarmJson.alarm.medicineName,
                dosage: alarmJson.alarm.dosage,
                instruction: alarmJson.alarm.instruction,
                slot: alarmJson.alarm.slot,
                time: alarmJson.alarm.time,
                senderName: alarmJson.alarm.senderName,
                patientName: user?.name ? user.name.split(' ')[0] : 'Lakshmi',
              });
              setIsAlarmModalVisible(true);
              return;
            }
          }
        }

        // 2. Check scheduled clinical regimen for automatic due dose alarm
        const medRes = await fetch(`${API_BASE_URL}/memory/medications?patientId=${patientTarget}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (medRes.ok) {
          const medData = await medRes.json();
          const schedules = Array.isArray(medData?.schedules) ? medData.schedules : [];
          
          schedules.forEach((sched: any) => {
            if (!sched.taken && sched.time) {
              if (isTimeDueNow(sched.time)) {
                const doseKey = `${sched.id || sched.name}-${sched.time}-${new Date().toDateString()}-${new Date().getHours()}:${new Date().getMinutes()}`;
                if (!triggeredDosesRef.current.has(doseKey)) {
                  triggeredDosesRef.current.add(doseKey);
                  setAlarmData({
                    id: `sched-${sched.id || Date.now()}`,
                    medicineName: sched.name,
                    dosage: sched.dosage || '1 tablet',
                    instruction: sched.instruction || 'After Food',
                    slot: sched.slot || 'Morning',
                    time: sched.time,
                    senderName: 'Scheduled Regimen Reminder',
                    patientName: user?.name ? user.name.split(' ')[0] : 'Lakshmi',
                  });
                  setIsAlarmModalVisible(true);
                }
              }
            }
          });
        }
      } catch (e) {
        // quiet fallback
      }
    };

    checkAlarmAndSchedules();
    const interval = setInterval(checkAlarmAndSchedules, 3000);
    return () => clearInterval(interval);
  }, [user, token]);

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
    Alert.alert('Dose Logged', `${alarmData?.medicineName || 'Medicine'} marked as taken.`);
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

  return (
    <View style={{ flex: 1 }}>
      {/* Global Medicine Voice Alarm Modal (Sounds on any active tab) */}
      <MedicineVoiceAlarmModal
        visible={isAlarmModalVisible}
        alarmData={alarmData}
        onDismiss={handleDismissAlarm}
        onTakeMedicine={handleTurnOffAndTake}
      />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary.blue,
          tabBarInactiveTintColor: '#8E9DB8',
          tabBarStyle: [
            styles.tabBar,
            {
              height: 64 + bottomPadding,
              paddingBottom: bottomPadding + 4,
            },
          ],
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={size}
                focused={focused}
                label="Home"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="health-memory"
          options={{
            title: 'Memory',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name={focused ? 'calendar' : 'calendar-outline'}
                color={color}
                size={size}
                focused={focused}
                label="Memory"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="care-team"
          options={{
            title: 'Care Team',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name={focused ? 'people' : 'people-outline'}
                color={color}
                size={size}
                focused={focused}
                label="Care Team"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="learn"
          options={{
            title: 'Learn',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name={focused ? 'book' : 'book-outline'}
                color={color}
                size={size}
                focused={focused}
                label="Learn"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name={focused ? 'person' : 'person-outline'}
                color={color}
                size={size}
                focused={focused}
                label="Profile"
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F8',
    paddingTop: 8,
    ...shadows.bottomTab,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabLabel: {
    ...typography.tiny,
    fontWeight: '600',
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 38,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: colors.primary.blue,
    ...shadows.soft,
  },
});
