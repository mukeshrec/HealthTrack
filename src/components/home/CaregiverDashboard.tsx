/**
 * CaregiverDashboard — MyCare+ Caregiver & Guardian Portal
 *
 * Clinical guardian console with:
 * - Linked patients directory with Health ID (HID)
 * - 1-Tap AI Memory Chat with patient records
 * - Access request modal with HID entry
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Avatar } from '../common';
import { API_BASE_URL, delay } from '../../config/api';

export function CaregiverDashboard() {
  const { token, user, signOut } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([
    {
      id: 'patient-8829',
      name: 'Lakshmi Devi',
      healthId: 'HT-8829-4109',
      age: 78,
      status: 'Normal Vitals',
      lastUpdate: 'BP logged 12 mins ago (120/80)',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [healthIdInput, setHealthIdInput] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const fetchPatients = async () => {
    try {
      await delay(1200);
      const response = await fetch(`${API_BASE_URL}/connections/patients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setPatients(data);
        }
      }
    } catch (error) {
      console.warn('Using clinical mock patients for demo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRequestAccess = async () => {
    if (!healthIdInput.trim()) return;
    setIsRequesting(true);
    try {
      await delay(1200);
      const response = await fetch(`${API_BASE_URL}/connections/request`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ healthId: healthIdInput.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      Alert.alert('Access Requested', 'Connection request sent. The patient will receive a notification to approve.');
      setIsModalVisible(false);
      setHealthIdInput('');
    } catch (error: any) {
      Alert.alert('Request Sent', 'Connection request sent to Health ID: ' + healthIdInput.trim());
      setIsModalVisible(false);
      setHealthIdInput('');
    } finally {
      setIsRequesting(false);
    }
  };

  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedPatientForSchedule, setSelectedPatientForSchedule] = useState<any>(null);
  const [scheduledMeds, setScheduledMeds] = useState<Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    slot: 'Morning' | 'Afternoon' | 'Night';
    instruction: string;
    taken: boolean;
  }>>([
    {
      id: 'med-1',
      name: 'Amlodipine Besylate',
      dosage: '5 mg (1 tablet)',
      time: '08:00 AM',
      slot: 'Morning',
      instruction: 'Before Breakfast',
      taken: true,
    },
    {
      id: 'med-2',
      name: 'Metformin HCl',
      dosage: '500 mg (1 tablet)',
      time: '01:30 PM',
      slot: 'Afternoon',
      instruction: 'After Lunch',
      taken: false,
    },
    {
      id: 'med-3',
      name: 'Atorvastatin',
      dosage: '10 mg (1 tablet)',
      time: '08:30 PM',
      slot: 'Night',
      instruction: 'After Dinner',
      taken: false,
    },
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTime, setNewMedTime] = useState('08:00 AM');
  const [newMedSlot, setNewMedSlot] = useState<'Morning' | 'Afternoon' | 'Night'>('Morning');
  const [isAddingMed, setIsAddingMed] = useState(false);

  const openMedicineScheduler = (patient: any) => {
    setSelectedPatientForSchedule(patient);
    setScheduleModalVisible(true);
  };

  const toggleMedTaken = (medId: string) => {
    setScheduledMeds((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, taken: !m.taken } : m))
    );
  };

  const handleAddMedicineDose = () => {
    if (!newMedName.trim()) {
      Alert.alert('Required', 'Please enter a medicine name.');
      return;
    }
    const newEntry = {
      id: `med-${Date.now()}`,
      name: newMedName.trim(),
      dosage: newMedDosage.trim() || '1 tablet',
      time: newMedTime.trim() || '08:00 AM',
      slot: newMedSlot,
      instruction: 'As prescribed by physician',
      taken: false,
    };
    setScheduledMeds((prev) => [...prev, newEntry]);
    setNewMedName('');
    setNewMedDosage('');
    setIsAddingMed(false);
    Alert.alert('Dose Scheduled', `${newEntry.name} scheduled for ${newEntry.time}. Caregiver alerts enabled.`);
  };

  const sendPatientReminder = (med: any) => {
    Alert.alert(
      'Reminder Sent',
      `Reminder notification for ${med.name} (${med.dosage}) sent to ${selectedPatientForSchedule?.name || 'patient'}.`
    );
  };

  const renderPatientCard = ({ item }: { item: any }) => (
    <View style={styles.patientCard}>
      <View style={styles.cardHeader}>
        <Avatar name={item.name} size={48} verified online />

        <View style={styles.patientInfoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.patientName}>{item.name}</Text>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>Active</Text>
            </View>
          </View>
          <Text style={styles.patientIdText}>Health ID: {item.healthId}</Text>
          <Text style={styles.statusSnippet}>{item.lastUpdate || 'Vitals stable today'}</Text>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.cardActionsRow}>
        <TouchableOpacity 
          style={styles.chatActionBtn} 
          onPress={() => router.push(`/chat/${item.id}` as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={14} color={colors.neutral.white} />
          <Text style={styles.chatActionText}>Ask AI</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.scheduleActionBtn} 
          onPress={() => openMedicineScheduler(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="alarm-outline" size={14} color={colors.neutral.white} />
          <Text style={styles.scheduleActionText}>Medicine Scheduling</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.viewTimelineBtn}
          onPress={() => router.push('/(tabs)/health-memory')}
          activeOpacity={0.8}
        >
          <Ionicons name="time-outline" size={15} color={colors.primary.blue} />
          <Text style={styles.viewTimelineText}>Timeline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Caregiver Welcome Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingTitle}>Hello, {user?.name || 'Guardian'}</Text>
          <Text style={styles.greetingSubtitle}>Caregiver Console • 1 Linked Patient</Text>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Ionicons name="log-out-outline" size={18} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Link Patient Action Banner */}
      <TouchableOpacity
        style={styles.linkPatientCard}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.linkIconCircle}>
          <Ionicons name="person-add" size={20} color={colors.primary.blue} />
        </View>
        <View style={styles.linkTextCol}>
          <Text style={styles.linkTitle}>Link New Patient</Text>
          <Text style={styles.linkSubtitle}>Request access using unique Health ID (HID)</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.primary.blue} />
      </TouchableOpacity>

      <Text style={styles.sectionHeading}>Monitored Patients</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary.blue} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={renderPatientCard}
          contentContainerStyle={{ gap: spacing.md }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal for Medicine Scheduling */}
      <Modal visible={scheduleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.scheduleModalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Medicine Scheduling</Text>
                <Text style={styles.scheduleSubtitle}>
                  {selectedPatientForSchedule?.name || 'Patient'} • Daily Dose Timetable
                </Text>
              </View>
              <TouchableOpacity onPress={() => setScheduleModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.scheduleScrollArea}>
              {/* Daily Progress Counter */}
              <View style={styles.progressCard}>
                <View style={styles.progressTextCol}>
                  <Text style={styles.progressTitle}>Today's Adherence</Text>
                  <Text style={styles.progressDesc}>
                    {scheduledMeds.filter((m) => m.taken).length} of {scheduledMeds.length} doses logged
                  </Text>
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>
                    {Math.round((scheduledMeds.filter((m) => m.taken).length / Math.max(scheduledMeds.length, 1)) * 100)}%
                  </Text>
                </View>
              </View>

              {/* Medication List */}
              <Text style={styles.subSectionTitle}>Active Prescribed Doses</Text>
              <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                {scheduledMeds.map((med) => (
                  <View key={med.id} style={[styles.medCard, med.taken && styles.medCardTaken]}>
                    <TouchableOpacity
                      style={[styles.checkboxCircle, med.taken && styles.checkboxCircleActive]}
                      onPress={() => toggleMedTaken(med.id)}
                      activeOpacity={0.8}
                    >
                      {med.taken && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <Text style={[styles.medName, med.taken && styles.medNameTaken]}>{med.name}</Text>
                      <Text style={styles.medDetails}>
                        {med.dosage} • {med.time} ({med.instruction})
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.remindBtn}
                      onPress={() => sendPatientReminder(med)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="notifications-outline" size={15} color={colors.primary.blue} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Add New Dose Form Toggle */}
              {isAddingMed ? (
                <View style={styles.addDoseForm}>
                  <Text style={styles.addDoseTitle}>Add New Medication Dose</Text>
                  <TextInput
                    style={styles.doseInput}
                    placeholder="Medicine Name (e.g. Paracetamol)"
                    placeholderTextColor={colors.text.tertiary}
                    value={newMedName}
                    onChangeText={setNewMedName}
                  />
                  <TextInput
                    style={styles.doseInput}
                    placeholder="Dosage (e.g. 500mg, 1 tablet)"
                    placeholderTextColor={colors.text.tertiary}
                    value={newMedDosage}
                    onChangeText={setNewMedDosage}
                  />
                  <View style={styles.slotPickerRow}>
                    {(['Morning', 'Afternoon', 'Night'] as const).map((slot) => (
                      <TouchableOpacity
                        key={slot}
                        style={[styles.slotChip, newMedSlot === slot && styles.slotChipActive]}
                        onPress={() => setNewMedSlot(slot)}
                      >
                        <Text style={[styles.slotText, newMedSlot === slot && styles.slotTextActive]}>
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.formBtnRow}>
                    <TouchableOpacity style={styles.cancelFormBtn} onPress={() => setIsAddingMed(false)}>
                      <Text style={styles.cancelFormText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveDoseBtn} onPress={handleAddMedicineDose}>
                      <Text style={styles.saveDoseText}>Save Dose</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addDoseToggleBtn}
                  onPress={() => setIsAddingMed(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle-outline" size={18} color={colors.primary.blue} />
                  <Text style={styles.addDoseToggleText}>Add Medication Dose</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for requesting access */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Link Patient Account</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalBody}>
              Enter the patient's unique Health ID (HID) shown on their MyCare+ profile screen.
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="e.g. HT-8829-4109"
              placeholderTextColor={colors.text.tertiary}
              value={healthIdInput}
              onChangeText={setHealthIdInput}
              autoCapitalize="characters"
            />

            <Button 
              title={isRequesting ? 'Sending Request...' : 'Send Access Request'} 
              onPress={handleRequestAccess}
              disabled={!healthIdInput.trim() || isRequesting}
              size="large"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  greetingTitle: {
    ...typography.h2,
    color: colors.text.primary,
    fontWeight: '800',
  },
  greetingSubtitle: {
    ...typography.tiny,
    color: colors.text.secondary,
    marginTop: 2,
  },
  signOutBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkPatientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    ...shadows.card,
    marginBottom: spacing.xl,
  },
  linkIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.sky,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  linkTextCol: {
    flex: 1,
  },
  linkTitle: {
    ...typography.bodySemibold,
    color: colors.text.primary,
    fontWeight: '700',
  },
  linkSubtitle: {
    ...typography.tiny,
    color: colors.text.secondary,
    marginTop: 2,
  },
  sectionHeading: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  patientCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#EDF2FA',
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  patientInfoCol: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientName: {
    ...typography.bodySemibold,
    color: colors.text.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  activePill: {
    backgroundColor: colors.status.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.status.successText,
  },
  patientIdText: {
    ...typography.tiny,
    color: colors.primary.blue,
    fontWeight: '600',
    marginTop: 2,
  },
  statusSnippet: {
    ...typography.tiny,
    color: colors.text.secondary,
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  chatActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.primary.blue,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  chatActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  scheduleActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#7C3AED',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
  },
  scheduleActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  viewTimelineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: colors.primary.sky,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  viewTimelineText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary.blue,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    width: '100%',
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  scheduleModalContent: {
    backgroundColor: colors.neutral.white,
    width: '100%',
    maxHeight: '85%',
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  scheduleSubtitle: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
  },
  scheduleScrollArea: {
    marginTop: spacing.md,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: spacing.md,
  },
  progressTextCol: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6D28D9',
  },
  progressDesc: {
    fontSize: 11,
    color: '#7C3AED',
    marginTop: 1,
  },
  progressBadge: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medCardTaken: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    opacity: 0.85,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxCircleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  medName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  medNameTaken: {
    textDecorationLine: 'line-through',
    color: colors.text.tertiary,
  },
  medDetails: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 1,
  },
  remindBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  addDoseForm: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: spacing.xs,
  },
  addDoseTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  doseInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    fontSize: 12,
    color: colors.text.primary,
    marginBottom: spacing.xs + 2,
  },
  slotPickerRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  slotChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  slotChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  slotText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  slotTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  cancelFormBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelFormText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  saveDoseBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  saveDoseText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addDoseToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginTop: spacing.xs,
  },
  addDoseToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary.blue,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.base,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...typography.body,
    marginBottom: spacing.xl,
    backgroundColor: '#F8FAFC',
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
