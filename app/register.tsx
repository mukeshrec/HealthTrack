import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../src/theme';
import { useAuth } from '../src/context/AuthContext';
import { Button } from '../src/components/common/Button';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'caregiver'>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      await register(email, password, name, role);
      // AuthContext will automatically redirect via navigation guard
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoIcon}>
              <Ionicons name="heart" size={32} color={colors.primary.teal} />
            </View>
            <Text style={styles.brandTitle}>Create an Account</Text>
            <Text style={styles.tagline}>Join Health Memory today.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.roleSelector}>
              <TouchableOpacity 
                style={[styles.roleOption, role === 'patient' && styles.roleActive]}
                onPress={() => setRole('patient')}
              >
                <Text style={[styles.roleText, role === 'patient' && styles.roleTextActive]}>Patient</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleOption, role === 'caregiver' && styles.roleActive]}
                onPress={() => setRole('caregiver')}
              >
                <Text style={[styles.roleText, role === 'caregiver' && styles.roleTextActive]}>Caregiver</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Mukesh V"
              placeholderTextColor={colors.neutral.gray400}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="mukesh@example.com"
              placeholderTextColor={colors.neutral.gray400}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.neutral.gray400}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Button
              title={isLoading ? "Creating Account..." : "Sign Up"}
              variant="primary"
              size="large"
              onPress={handleRegister}
              disabled={isLoading}
              style={styles.submitButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Log in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primary.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brandTitle: {
    ...typography.displayMedium,
    color: colors.text.primary,
  },
  tagline: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  form: {
    width: '100%',
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.gray100,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.xl,
  },
  roleOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  roleActive: {
    backgroundColor: colors.neutral.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
  roleTextActive: {
    color: colors.primary.teal,
    fontWeight: '600',
  },
  label: {
    ...typography.smallMedium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  footerLink: {
    ...typography.bodySemibold,
    color: colors.primary.teal,
  },
});
