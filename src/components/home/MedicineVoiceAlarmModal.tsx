/**
 * MedicineVoiceAlarmModal — High-Priority Looping Voice Alarm for Patients
 *
 * Provides:
 * - Real-time looping audio speech with expo-speech until the patient turns off the alarm.
 * - Glowing animated alert UI for elderly & geriatric patients.
 * - 1-Tap "Turn Off & Mark Taken" confirmation.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

export interface AlarmPayload {
  id?: string;
  schedId?: string;
  doseKey?: string;
  medicineName: string;
  dosage: string;
  instruction: string;
  slot?: string;
  time?: string;
  senderName?: string;
  patientName?: string;
}

interface MedicineVoiceAlarmModalProps {
  visible: boolean;
  alarmData: AlarmPayload | null;
  onDismiss: () => void;
  onTakeMedicine: () => void;
}

export const MedicineVoiceAlarmModal: React.FC<MedicineVoiceAlarmModalProps> = ({
  visible,
  alarmData,
  onDismiss,
  onTakeMedicine,
}) => {
  const isAlarmActiveRef = useRef(false);
  const loopTimeoutRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Looping Voice Alarm Functionality
  const startAlarmSpeech = (data: AlarmPayload) => {
    isAlarmActiveRef.current = true;
    setIsSpeaking(true);

    const patient = data.patientName || 'Lakshmi';
    const speechText = `Attention ${patient}. It is time for your medicine. Please take ${data.medicineName}, ${data.dosage}, ${data.instruction}. Please take your medicine now.`;

    const speak = () => {
      if (!isAlarmActiveRef.current) return;

      Speech.speak(speechText, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.88,
        onStart: () => setIsSpeaking(true),
        onDone: () => {
          if (isAlarmActiveRef.current) {
            // Loop speech again after a brief 1.5s interval
            loopTimeoutRef.current = setTimeout(speak, 1500);
          }
        },
        onError: (err) => {
          console.warn('Speech error:', err);
          if (isAlarmActiveRef.current) {
            loopTimeoutRef.current = setTimeout(speak, 2000);
          }
        },
      });
    };

    // Stop any existing speech and begin alarm loop
    Speech.stop();
    speak();
  };

  const stopAlarmSpeech = () => {
    isAlarmActiveRef.current = false;
    setIsSpeaking(false);
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
    Speech.stop();
  };

  useEffect(() => {
    if (visible && alarmData) {
      // Start pulsing ring animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      startAlarmSpeech(alarmData);
    } else {
      stopAlarmSpeech();
    }

    return () => {
      stopAlarmSpeech();
    };
  }, [visible, alarmData]);

  const handleTurnOffAndTake = () => {
    stopAlarmSpeech();
    onTakeMedicine();
  };

  const handleDismiss = () => {
    stopAlarmSpeech();
    onDismiss();
  };

  if (!visible || !alarmData) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header Alarm Pulse */}
          <View style={styles.iconWrapper}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.iconCenterCircle}>
              <Ionicons name="alarm" size={40} color="#FFFFFF" />
            </View>
          </View>

          {/* Title & Badge */}
          <View style={styles.liveAlarmPill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveAlarmPillText}>LOUD MEDICINE ALARM ACTIVE</Text>
          </View>

          <Text style={styles.alarmTitle}>Time for Your Medicine</Text>
          <Text style={styles.alarmSubtitle}>
            {alarmData.senderName ? `Alert sent by ${alarmData.senderName}` : 'Scheduled Medication Reminder'}
          </Text>

          {/* Medicine Card Details */}
          <View style={styles.medDetailsCard}>
            <View style={styles.medRow}>
              <View style={styles.pillIconBox}>
                <Ionicons name="medical" size={22} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.medNameText}>{alarmData.medicineName}</Text>
                <Text style={styles.medDosageText}>{alarmData.dosage}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={14} color="#0284C7" />
                <Text style={styles.metaChipText}>{alarmData.time || 'Due Now'}</Text>
              </View>

              <View style={[styles.metaChip, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                <Ionicons name="restaurant-outline" size={14} color="#D97706" />
                <Text style={[styles.metaChipText, { color: '#B45309' }]}>
                  {alarmData.instruction || 'After Food'}
                </Text>
              </View>
            </View>

            {/* Voice Status Indicator */}
            <View style={styles.voiceStatusBox}>
              <Ionicons name="volume-high" size={18} color="#2563EB" />
              <Text style={styles.voiceStatusText}>
                {isSpeaking ? 'Voice speaking loudly until alarm is turned off...' : 'Alarm sounding...'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.confirmTakenBtn}
            onPress={handleTurnOffAndTake}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            <Text style={styles.confirmTakenText}>Turn Off Alarm & Mark Taken</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dismissBtn}
            onPress={handleDismiss}
            activeOpacity={0.7}
          >
            <Text style={styles.dismissText}>Dismiss / Snooze 5 Min</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.lg,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  iconWrapper: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  pulseCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  iconCenterCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  liveAlarmPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  liveAlarmPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991B1B',
    letterSpacing: 0.5,
  },
  alarmTitle: {
    ...typography.h2,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 4,
  },
  alarmSubtitle: {
    ...typography.body,
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: spacing.md,
  },
  medDetailsCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  pillIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.primary,
  },
  medDosageText: {
    fontSize: 13,
    color: '#6D28D9',
    fontWeight: '600',
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  voiceStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  voiceStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary.blue,
    flex: 1,
  },
  confirmTakenBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: borderRadius.full,
    ...shadows.card,
    marginBottom: spacing.sm,
  },
  confirmTakenText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dismissBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
  },
  dismissText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
});
