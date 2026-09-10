import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export function CaregiverDashboard() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [healthIdInput, setHealthIdInput] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://172.17.99.224:3000/api/connections/patients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRequestAccess = async () => {
    if (!healthIdInput) return;
    setIsRequesting(true);
    try {
      const response = await fetch('http://172.17.99.224:3000/api/connections/request', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ healthId: healthIdInput })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      Alert.alert('Success', 'Access requested! The patient must approve it on their device.');
      setIsModalVisible(false);
      setHealthIdInput('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to request access');
    } finally {
      setIsRequesting(false);
    }
  };

  const renderPatientCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.patientCard} 
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.patientIcon}>
        <Ionicons name="person" size={24} color={colors.primary.deepBlue} />
      </View>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientId}>HID: {item.healthId}</Text>
      </View>
      <TouchableOpacity style={styles.chatButton} onPress={() => router.push(`/chat/${item.id}`)}>
        <Ionicons name="chatbubbles" size={20} color={colors.neutral.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}</Text>
        <Text style={styles.subtitle}>Caregiver Dashboard</Text>
      </View>

      <TouchableOpacity style={styles.addPatientCard} onPress={() => setIsModalVisible(true)}>
        <View style={styles.addIconContainer}>
          <Ionicons name="add" size={24} color={colors.primary.teal} />
        </View>
        <View style={styles.addTextContainer}>
          <Text style={styles.addTitle}>Link New Patient</Text>
          <Text style={styles.addSubtitle}>Request access using their Health ID</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Linked Patients</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary.teal} style={{ marginTop: 20 }} />
      ) : patients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={48} color={colors.neutral.gray300} />
          <Text style={styles.emptyText}>No patients linked yet.</Text>
        </View>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={renderPatientCard}
          scrollEnabled={false}
          contentContainerStyle={{ gap: spacing.md }}
        />
      )}

      {/* Modal for requesting access */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Access</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalBody}>
              Ask the patient for their unique Health ID (HID) located on their profile screen.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. HT-A1B2C3"
              value={healthIdInput}
              onChangeText={setHealthIdInput}
              autoCapitalize="characters"
            />
            <Button 
              title={isRequesting ? "Requesting..." : "Send Request"} 
              onPress={handleRequestAccess}
              disabled={!healthIdInput || isRequesting}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  header: { marginBottom: spacing.xl },
  greeting: { ...typography.h2, color: colors.primary.deepBlue },
  subtitle: { ...typography.body, color: colors.text.secondary },
  addPatientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xxl,
  },
  addIconContainer: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.neutral.white,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md
  },
  addTextContainer: { flex: 1 },
  addTitle: { ...typography.bodySemibold, color: colors.primary.deepBlue },
  addSubtitle: { ...typography.small, color: colors.text.secondary },
  sectionTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.md },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  patientIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: colors.primary.tealSoft,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md
  },
  patientInfo: { flex: 1 },
  patientName: { ...typography.bodySemibold, color: colors.text.primary },
  patientId: { ...typography.small, color: colors.text.secondary },
  chatButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary.teal,
    alignItems: 'center', justifyContent: 'center'
  },
  emptyContainer: { alignItems: 'center', padding: spacing.xxl },
  emptyText: { ...typography.body, color: colors.text.secondary, marginTop: spacing.sm },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: spacing.xl
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    width: '100%', borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { ...typography.h3, color: colors.text.primary },
  modalBody: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.lg },
  input: {
    borderWidth: 1, borderColor: colors.border.light,
    borderRadius: borderRadius.md, padding: spacing.md,
    ...typography.body, marginBottom: spacing.xl,
    backgroundColor: colors.background.secondary
  }
});
