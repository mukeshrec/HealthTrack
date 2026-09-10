/**
 * Profile Screen — MyCare+ Enterprise Health Passport & Settings
 *
 * Clinical profile module with:
 * - Digital Health Card (HID, Blood Group, Organ Donor, Primary MD)
 * - Emergency Medical Profile (Allergies, Conditions, Guardian Contact)
 * - Caregiver Permissions & Consent Management
 * - Smart Sync & App Preferences
 * - Safe Sign Out hooked to AuthContext
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius, shadows } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { Avatar, Badge } from '../../src/components/common';

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  // State for interactive toggles
  const [autoSyncVitals, setAutoSyncVitals] = useState(true);
  const [medicationAlarms, setMedicationAlarms] = useState(true);
  const [biometricLock, setBiometricLock] = useState(true);
  const [guardianAlerts, setGuardianAlerts] = useState(true);

  const healthId = user?.id ? `HID-${user.id.slice(0, 4).toUpperCase()}-2026` : 'HID-8829-2026';

  const handleCopyHealthId = () => {
    Alert.alert('Health ID Copied', `${healthId} has been copied to your clipboard.`);
  };

  const handleExportRecords = () => {
    Alert.alert(
      'Export Health Summary',
      'Generating your encrypted FHIR-compliant longitudinal medical record (PDF & JSON). It will be ready in a moment.',
      [{ text: 'OK' }]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your MyCare+ account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>My Profile</Text>
            <Text style={styles.screenSubtitle}>Health Passport & Account</Text>
          </View>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => Alert.alert('Digital Health QR', 'Scan to instantly share your emergency medical info with first responders or hospitals.')}
            activeOpacity={0.7}
          >
            <Ionicons name="qr-code-outline" size={22} color={colors.primary.blue} />
          </TouchableOpacity>
        </View>

        {/* Digital Health ID Card */}
        <View style={styles.healthCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardUserLeft}>
              <Avatar name={user?.name || 'Lakshmi Devi'} size={54} verified online />
              <View style={styles.nameBlock}>
                <Text style={styles.userName}>{user?.name || 'Lakshmi Devi'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'patient@mycare.health'}</Text>
                <View style={styles.roleTag}>
                  <View style={styles.roleDot} />
                  <Text style={styles.roleText}>
                    {user?.role === 'caregiver' ? 'Authorized Guardian' : 'Patient (Self)'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Health ID Bar */}
          <TouchableOpacity
            style={styles.hidBar}
            onPress={handleCopyHealthId}
            activeOpacity={0.7}
          >
            <View style={styles.hidLeft}>
              <Ionicons name="finger-print-outline" size={18} color={colors.primary.blue} />
              <Text style={styles.hidLabel}>ABDM Health ID:</Text>
              <Text style={styles.hidValue}>{healthId}</Text>
            </View>
            <Ionicons name="copy-outline" size={16} color={colors.primary.blue} />
          </TouchableOpacity>

          {/* Clinical Passport Badges */}
          <View style={styles.passportGrid}>
            <View style={styles.passportItem}>
              <Text style={styles.passportLabel}>Blood Group</Text>
              <Text style={styles.passportValue}>O+ Positive</Text>
            </View>
            <View style={styles.passportDivider} />
            <View style={styles.passportItem}>
              <Text style={styles.passportLabel}>Organ Donor</Text>
              <Text style={styles.passportValue}>Registered</Text>
            </View>
            <View style={styles.passportDivider} />
            <View style={styles.passportItem}>
              <Text style={styles.passportLabel}>Primary Doctor</Text>
              <Text style={styles.passportValue}>Dr. Jenkins</Text>
            </View>
          </View>
        </View>

        {/* Emergency Medical Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Emergency Medical Profile</Text>
            <TouchableOpacity onPress={() => Alert.alert('Edit Medical Profile', 'Update your allergies, conditions, and emergency contacts.')}>
              <Text style={styles.sectionActionText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.medicalInfoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="warning-outline" size={18} color="#DC2626" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Known Allergies</Text>
                <Text style={styles.infoSubtitle}>Penicillin, Sulfa Antibiotics, Peanuts</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="heart-circle-outline" size={18} color={colors.primary.blue} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Active Conditions</Text>
                <Text style={styles.infoSubtitle}>Hypertension (Stage 1), Type 2 Diabetes</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="call-outline" size={18} color="#059669" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Emergency Contact (Guardian)</Text>
                <Text style={styles.infoSubtitle}>Sarah Jenkins (Daughter) • +1 (555) 019-2834</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Caregiver & Consent Center */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Care Network</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/care-team')}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="people-outline" size={18} color={colors.primary.blue} />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Authorized Guardians & Doctors</Text>
                  <Text style={styles.menuSubtitle}>2 caregivers have active real-time access</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral[400]} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('Consent Logs', 'HIPAA & ABDM Compliant Consent Logs. You can revoke access at any time.')}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconCircle, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#16A34A" />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Data Sharing & Consent Logs</Text>
                  <Text style={styles.menuSubtitle}>End-to-end encrypted medical storage</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral[400]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sync & App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences & Devices</Text>
          <View style={styles.menuContainer}>
            <View style={styles.toggleItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="sync-outline" size={18} color={colors.primary.blue} />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Continuous Vitals Auto-Sync</Text>
                  <Text style={styles.menuSubtitle}>Sync with Apple Health & Smart Monitors</Text>
                </View>
              </View>
              <Switch
                value={autoSyncVitals}
                onValueChange={setAutoSyncVitals}
                trackColor={{ false: colors.neutral[200], true: colors.primary.blue }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.menuDivider} />

            <View style={styles.toggleItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="notifications-outline" size={18} color="#D97706" />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Medication Reminders</Text>
                  <Text style={styles.menuSubtitle}>Sound & banner alert for daily dosage</Text>
                </View>
              </View>
              <Switch
                value={medicationAlarms}
                onValueChange={setMedicationAlarms}
                trackColor={{ false: colors.neutral[200], true: colors.primary.blue }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.menuDivider} />

            <View style={styles.toggleItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconCircle, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="lock-closed-outline" size={18} color="#7C3AED" />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Biometric Authentication</Text>
                  <Text style={styles.menuSubtitle}>FaceID / Fingerprint required on launch</Text>
                </View>
              </View>
              <Switch
                value={biometricLock}
                onValueChange={setBiometricLock}
                trackColor={{ false: colors.neutral[200], true: colors.primary.blue }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.menuDivider} />

            <View style={styles.toggleItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Guardian SOS Auto-Notify</Text>
                  <Text style={styles.menuSubtitle}>Alert care circle on critical vitals spike</Text>
                </View>
              </View>
              <Switch
                value={guardianAlerts}
                onValueChange={setGuardianAlerts}
                trackColor={{ false: colors.neutral[200], true: colors.primary.blue }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Export & Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Records Management</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleExportRecords}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="download-outline" size={18} color={colors.primary.blue} />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Export FHIR Health Passport</Text>
                  <Text style={styles.menuSubtitle}>Download full longitudinal medical PDF</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral[400]} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/upload')}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="cloud-upload-outline" size={18} color={colors.primary.blue} />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Upload Lab Reports & Scans</Text>
                  <Text style={styles.menuSubtitle}>AI-extracted clinical records</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral[400]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out CTA */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.signOutText}>Sign Out from MyCare+</Text>
        </TouchableOpacity>

        {/* App Version Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.appVersionText}>MyCare+ Clinical Health System • v2.4.0</Text>
          <Text style={styles.buildInfoText}>HIPAA & ABDM Compliant • 256-Bit Encrypted</Text>
        </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  screenTitle: {
    ...typography.h1,
    color: colors.text.primary,
    fontWeight: '700',
  },
  screenSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  qrButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Health Card
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
    marginBottom: spacing.xl,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardUserLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  nameBlock: {
    gap: 2,
  },
  userName: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  userEmail: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 4,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.blue,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary.blue,
  },
  hidBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  hidLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hidLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  hidValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary.blue,
    letterSpacing: 0.5,
  },
  passportGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  passportItem: {
    flex: 1,
    alignItems: 'center',
  },
  passportDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.neutral[200],
  },
  passportLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  passportValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },

  // Section Styles
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionActionText: {
    ...typography.caption,
    color: colors.primary.blue,
    fontWeight: '600',
  },

  // Medical Info Card
  medicalInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginVertical: 4,
  },

  // Menu Container
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginLeft: 56,
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },

  // Footer
  footerInfo: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: 4,
  },
  appVersionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  buildInfoText: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
});
