import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../src/theme';
import { useAuth } from '../src/context/AuthContext';
import { Button } from '../src/components/common/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
  const { user, token, completeOnboarding } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const handleSubmit = async () => {
    if (!dob || !bloodGroup) {
      Alert.alert('Required Fields', 'Please fill in at least Date of Birth and Blood Group.');
      return;
    }

    setIsLoading(true);

    const payload = {
      personalDetails: { dob },
      existingConditions: existingConditions.split(',').map(s => s.trim()).filter(Boolean),
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
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
      Alert.alert('Error', error.message || 'Could not save profile');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Help us personalize your health memory.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} />
          <TextInput style={styles.input} placeholder="Blood Group (e.g., O+)" value={bloodGroup} onChangeText={setBloodGroup} />
          <TextInput style={styles.input} placeholder="Preferred Language" value={preferredLanguage} onChangeText={setPreferredLanguage} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Context</Text>
          <TextInput style={styles.input} placeholder="Existing Conditions (comma separated)" value={existingConditions} onChangeText={setExistingConditions} />
          <TextInput style={styles.input} placeholder="Allergies (comma separated)" value={allergies} onChangeText={setAllergies} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Important Medical History" multiline numberOfLines={3} value={medicalHistory} onChangeText={setMedicalHistory} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <TextInput style={styles.input} placeholder="Contact Name" value={emergencyContactName} onChangeText={setEmergencyContactName} />
          <TextInput style={styles.input} placeholder="Contact Phone" keyboardType="phone-pad" value={emergencyContactPhone} onChangeText={setEmergencyContactPhone} />
        </View>

        <Button
          title={isLoading ? "Saving..." : "Complete Profile"}
          onPress={handleSubmit}
          disabled={isLoading}
          style={styles.submitBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.primary },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.xl },
  title: { ...typography.h1, color: colors.text.primary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.text.secondary },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.h3, color: colors.primary.deepBlue, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...typography.body,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  submitBtn: { marginTop: spacing.lg },
});
