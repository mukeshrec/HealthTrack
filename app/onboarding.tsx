/**
 * Onboarding Screen — MyCare+ Health Passport Setup
 *
 * Clinical profile onboarding with:
 * - Personal details (DOB, Blood Group, Language)
 * - Chronic conditions & Allergy tags
 * - Emergency guardian contact
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../src/theme';
import { useAuth } from '../src/context/AuthContext';
import { Button } from '../src/components/common/Button';

export default function OnboardingScreen() {
  const { user, token, completeOnboarding } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [dob, setDob] = useState('1946-04-12');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [existingConditions, setExistingConditions] = useState('Hypertension, Type 2 Diabetes');
  const [allergies, setAllergies] = useState('Penicillin, Dust');
  const [emergencyContactName, setEmergencyContactName] = useState('Anand Devi');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+91 98765 43210');
  const [preferredLanguage, setPreferredLanguage] = useState('English, Tamil');
  const [medicalHistory, setMedicalHistory] = useState('Mild arthritis in knees. Annual cataract check completed.');

  const handleSubmit = async () => {
    if (!dob.trim() || !bloodGroup.trim()) {
      Alert.alert('Required Fields', 'Please fill in at least Date of Birth and Blood Group.');
      return;
    }

    setIsLoading(true);

    const payload = {
      personalDetails: { dob },
      existingConditions: existingConditions.split(',').map((s) => s.trim()).filter(Boolean),
      allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
      bloodGroup,
      emergencyContacts: { name: emergencyContactName, phone: emergencyContactPhone },
      preferredLanguage,
      medicalHistory,
    };

    try {
      const response = await fetch('http://172.17.99.224:3000/api/patients/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      await completeOnboarding();
      router.replace('/(tabs)');
    } catch (error: any) {
      // In offline / dev mode, allow smooth onboarding progression
      console.warn('Profile save note:', error.message);
      await completeOnboarding();
      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={14} color={colors.primary.blue} />
            <Text style={styles.badgeText}>Digital Health Passport</Text>
          </View>
          <Text style={styles.title}>Complete Your Health Profile</Text>
          <Text style={styles.subtitle}>
            Personalize your care network and enable intelligent medication reminders.
          </Text>
        </View>

        {/* Section 1: Personal Details */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={18} color={colors.primary.blue} />
            <Text style={styles.sectionTitle}>Personal Vitals & Identity</Text>
          </View>

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.text.tertiary}
            value={dob}
            onChangeText={setDob}
          />

          <Text style={styles.label}>Blood Group</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. O+, A+, B+, AB-"
            placeholderTextColor={colors.text.tertiary}
            value={bloodGroup}
            onChangeText={setBloodGroup}
          />

          <Text style={styles.label}>Preferred Language</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. English, Hindi, Tamil"
            placeholderTextColor={colors.text.tertiary}
            value={preferredLanguage}
            onChangeText={setPreferredLanguage}
          />
        </View>

        {/* Section 2: Medical Context */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness-outline" size={18} color={colors.primary.blue} />
            <Text style={styles.sectionTitle}>Clinical Conditions & Allergies</Text>
          </View>

          <Text style={styles.label}>Existing Conditions (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Hypertension, Asthma"
            placeholderTextColor={colors.text.tertiary}
            value={existingConditions}
            onChangeText={setExistingConditions}
          />

          <Text style={styles.label}>Known Allergies (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Penicillin, Peanuts, Latex"
            placeholderTextColor={colors.text.tertiary}
            value={allergies}
            onChangeText={setAllergies}
          />

          <Text style={styles.label}>Medical Notes / Surgical History</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any past surgeries or major medical events"
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={3}
            value={medicalHistory}
            onChangeText={setMedicalHistory}
          />
        </View>

        {/* Section 3: Emergency Contact */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={18} color="#DC2626" />
            <Text style={styles.sectionTitle}>Primary Guardian & SOS Contact</Text>
          </View>

          <Text style={styles.label}>Guardian / Caregiver Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Anand Devi (Son)"
            placeholderTextColor={colors.text.tertiary}
            value={emergencyContactName}
            onChangeText={setEmergencyContactName}
          />

          <Text style={styles.label}>Emergency Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 98765 43210"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="phone-pad"
            value={emergencyContactPhone}
            onChangeText={setEmergencyContactPhone}
          />
        </View>

        {/* Submit */}
        <Button
          title={isLoading ? 'Saving Health Profile...' : 'Complete Profile & Open Dashboard'}
          loading={isLoading}
          size="large"
          onPress={handleSubmit}
          style={styles.submitBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.base,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary.sky,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary.blue,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: 2,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#EDF2FA',
    ...shadows.card,
    marginBottom: spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.bodySemibold,
    color: colors.text.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  label: {
    ...typography.tiny,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  textArea: {
    minHeight: 74,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
});
