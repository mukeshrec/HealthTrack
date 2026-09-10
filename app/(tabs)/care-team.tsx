import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { colors, typography, spacing, borderRadius, shadows } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/common/Button';

export default function CareTeamScreen() {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://172.17.99.224:3000/api/connections/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (connectionId: string) => {
    try {
      const response = await fetch('http://172.17.99.224:3000/api/connections/accept', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ connectionId })
      });
      if (response.ok) {
        Alert.alert('Success', 'Caregiver approved!');
        fetchRequests();
      } else {
        throw new Error('Failed to accept');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to approve caregiver.');
    }
  };

  const copyHealthId = async () => {
    if (user?.healthId) {
      await Clipboard.setStringAsync(user.healthId);
      Alert.alert('Copied!', 'Health ID copied to clipboard.');
    }
  };

  const renderRequest = ({ item }: { item: any }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestInfo}>
        <Ionicons name="person-circle" size={40} color={colors.primary.deepBlue} />
        <View style={styles.requestText}>
          <Text style={styles.caregiverName}>{item.caregiver.name}</Text>
          <Text style={styles.caregiverEmail}>{item.caregiver.email}</Text>
        </View>
      </View>
      <Button title="Approve" onPress={() => acceptRequest(item.id)} />
    </View>
  );

  if (user?.role !== 'patient') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Care Team</Text>
          <Text style={styles.description}>Patients manage their care team here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Care Team</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.hidCard}>
          <Text style={styles.hidTitle}>Your Health ID (HID)</Text>
          <Text style={styles.hidSubtitle}>Share this with your caregiver so they can request access to your health memory.</Text>
          <TouchableOpacity style={styles.hidRow} onPress={copyHealthId}>
            <Text style={styles.hidText}>{user?.healthId}</Text>
            <Ionicons name="copy-outline" size={24} color={colors.primary.teal} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Pending Requests</Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary.teal} style={{ marginTop: 20 }} />
        ) : requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={48} color={colors.neutral.gray300} />
            <Text style={styles.emptyText}>No pending requests.</Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={item => item.id}
            renderItem={renderRequest}
            contentContainerStyle={{ gap: spacing.md }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.neutral.white,
    ...shadows.sm,
    zIndex: 10,
  },
  headerTitle: { ...typography.h2, color: colors.primary.deepBlue },
  content: { flex: 1, padding: spacing.xl },
  hidCard: {
    backgroundColor: colors.primary.deepBlue,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xxl,
    ...shadows.md,
  },
  hidTitle: { ...typography.h3, color: colors.neutral.white, marginBottom: spacing.xs },
  hidSubtitle: { ...typography.small, color: colors.neutral.gray200, marginBottom: spacing.lg },
  hidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  hidText: { ...typography.h2, color: colors.neutral.white, letterSpacing: 2 },
  sectionTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.md },
  requestCard: {
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  requestInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  requestText: { marginLeft: spacing.sm },
  caregiverName: { ...typography.bodySemibold, color: colors.text.primary },
  caregiverEmail: { ...typography.small, color: colors.text.secondary },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  title: { ...typography.h2, color: colors.text.primary },
  description: { ...typography.body, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm },
  emptyContainer: { alignItems: 'center', padding: spacing.xxl },
  emptyText: { ...typography.body, color: colors.text.secondary, marginTop: spacing.sm },
});
