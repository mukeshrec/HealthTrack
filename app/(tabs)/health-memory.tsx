import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, typography, spacing, borderRadius, shadows } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function HealthMemoryScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTimeline = async () => {
    try {
      const response = await fetch('http://172.17.99.224:3000/api/memory/timeline', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch timeline');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTimeline();
    }, [token])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTimeline();
  };

  const renderEvent = ({ item }: { item: any }) => {
    const isAiExtracted = item.provenance === 'AI_EXTRACTED';
    
    return (
      <View style={styles.eventCard}>
        <View style={styles.eventTimelineLeft}>
          <View style={[styles.timelineDot, item.isFuture ? styles.timelineDotFuture : null]} />
          <View style={styles.timelineLine} />
        </View>
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventDate}>
              {new Date(item.eventDate).toLocaleDateString()}
            </Text>
            {isAiExtracted && (
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={12} color={colors.primary.deepBlue} />
                <Text style={styles.aiBadgeText}>AI Extracted</Text>
              </View>
            )}
          </View>
          <Text style={styles.eventTitle}>{item.title}</Text>
          {item.description ? <Text style={styles.eventDescription}>{item.description}</Text> : null}
          
          <View style={styles.eventTypeTag}>
            <Text style={styles.eventTypeText}>{item.eventType}</Text>
          </View>
          
          {item.sourceDocumentId && (
            <TouchableOpacity style={styles.viewEvidenceBtn}>
              <Ionicons name="document-text-outline" size={16} color={colors.primary.teal} />
              <Text style={styles.viewEvidenceText}>View Original Document</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Memory</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/upload')}>
          <Ionicons name="add" size={24} color={colors.neutral.white} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary.teal} />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="document-text-outline" size={64} color={colors.neutral.gray300} />
          <Text style={styles.emptyTitle}>No Health Records Yet</Text>
          <Text style={styles.emptySubtitle}>Upload a prescription or lab report to start building the health memory.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.teal} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.neutral.white,
    ...shadows.sm,
    zIndex: 10,
  },
  headerTitle: { ...typography.h2, color: colors.primary.deepBlue },
  addButton: {
    backgroundColor: colors.primary.teal,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  emptyTitle: { ...typography.h3, color: colors.text.primary, marginTop: spacing.lg },
  emptySubtitle: { ...typography.body, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm },
  listContent: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  eventCard: { flexDirection: 'row', marginBottom: spacing.md },
  eventTimelineLeft: { width: 30, alignItems: 'center' },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary.teal,
    borderWidth: 3,
    borderColor: colors.primary.tealSoft,
    zIndex: 2,
    marginTop: 4,
  },
  timelineDotFuture: {
    backgroundColor: colors.status.warning,
    borderColor: '#FFF3CD',
  },
  timelineLine: {
    position: 'absolute',
    top: 18,
    bottom: -spacing.md,
    width: 2,
    backgroundColor: colors.border.light,
    zIndex: 1,
  },
  eventContent: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginLeft: spacing.sm,
    ...shadows.sm,
  },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  eventDate: { ...typography.smallMedium, color: colors.text.secondary },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiBadgeText: { ...typography.small, fontSize: 10, color: colors.primary.deepBlue, marginLeft: 4, fontWeight: '600' },
  eventTitle: { ...typography.bodySemibold, color: colors.text.primary, marginBottom: spacing.xs },
  eventDescription: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.md },
  eventTypeTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: spacing.md,
  },
  eventTypeText: { ...typography.small, color: colors.text.secondary },
  viewEvidenceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  viewEvidenceText: {
    ...typography.smallMedium,
    color: colors.primary.teal,
    marginLeft: spacing.sm,
  }
});
