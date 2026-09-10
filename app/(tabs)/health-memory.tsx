/**
 * Health Memory Screen — Longitudinal Health Record, Documents & Dynamic Gemini OCR
 *
 * 100% Dynamic user documents driven:
 * - Direct connection to database via API_BASE_URL
 * - Real-time extracted prescriptions & lab reports from Gemini Vision AI
 * - 1.5s clinical delay gap on interactions
 * - Delete individual records & Clear all records actions
 * - Live search across title, medication name, and raw transcribed text
 * - Interactive detail modal with complete extracted text & 1-tap copy
 */

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, typography, spacing, borderRadius, shadows } from '../../src/theme';
import { SearchBar } from '../../src/components/common';
import { useAuth } from '../../src/context/AuthContext';
import { API_BASE_URL, delay } from '../../src/config/api';

export interface HealthRecord {
  id: string;
  documentId?: string;
  title: string;
  category: 'Prescription' | 'Lab Report' | 'Diagnosis' | 'Clinical Note' | 'Vaccine';
  doctor: string;
  facility: string;
  date: string;
  summary: string;
  extractedText?: string;
  status: 'Normal' | 'Follow-up Required' | 'Active' | 'Completed';
  provenance?: 'AI_EXTRACTED' | 'MANUAL';
  sourceDocumentId?: string;
  fileUrl?: string;
  fileName?: string;
  metrics?: { label: string; value: string }[];
}

const categories = ['All', 'Prescription', 'Lab Report', 'Diagnosis', 'Vaccine'] as const;

export default function HealthMemoryScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTimelineAndDocs = async () => {
    setIsLoading(true);
    try {
      // 1.5s delay gap for smooth UI update
      await delay(1200);

      // Fetch Uploaded Documents with full extracted text from Gemini
      const docsRes = await fetch(`${API_BASE_URL}/memory/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let fetchedRecords: HealthRecord[] = [];

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        if (Array.isArray(docsData) && docsData.length > 0) {
          const docRecords: HealthRecord[] = docsData.map((d: any) => ({
            id: `doc-${d.id}`,
            documentId: d.id,
            title: d.fileName || d.description || 'Uploaded Medical Record',
            category: d.fileType?.includes('pdf') ? 'Lab Report' : 'Prescription',
            doctor: 'Attending Physician',
            facility: 'Medical Document',
            date: new Date(d.uploadDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            summary: d.summary || 'Document transcribed with Gemini AI Vision.',
            extractedText: d.extractedText || '',
            status: d.status === 'EXTRACTED' ? 'Normal' : 'Active',
            provenance: 'AI_EXTRACTED',
            fileUrl: d.fileUrl,
            fileName: d.fileName,
          }));
          fetchedRecords = [...docRecords];
        }
      }

      setRecords(fetchedRecords);
    } catch (error) {
      console.warn('Network notice: Could not fetch from backend:', error);
      setRecords([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTimelineAndDocs();
    }, [token])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTimelineAndDocs();
  };

  const handleCopyText = async (text?: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert('Extracted Text Copied', 'The complete transcribed text has been copied to your clipboard.');
  };

  const handleDeleteRecord = (record: HealthRecord) => {
    Alert.alert(
      'Delete Medical Record',
      `Are you sure you want to delete "${record.title}" from your health memory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Remove from local state immediately
            setRecords((prev) => prev.filter((r) => r.id !== record.id));
            if (selectedRecord?.id === record.id) setSelectedRecord(null);

            // Delete from backend with 1.5s delay gap
            if (record.documentId) {
              try {
                await delay(1000);
                await fetch(`${API_BASE_URL}/memory/documents/${record.documentId}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${token}` }
                });
              } catch (e) {
                console.warn('Backend delete error:', e);
              }
            }
          },
        },
      ]
    );
  };

  const handleClearAllRecords = () => {
    if (records.length === 0) return;

    Alert.alert(
      'Clear All Records',
      'Are you sure you want to remove all extracted medical records from your Health Memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setRecords([]);
            setSelectedRecord(null);
            try {
              await delay(1200);
              await fetch(`${API_BASE_URL}/memory/clear-all`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
            } catch (e) {
              console.warn('Backend clear all error:', e);
            }
          },
        },
      ]
    );
  };

  const filteredRecords = records.filter((rec) => {
    const matchesCategory = selectedCategory === 'All' || rec.category === selectedCategory;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.extractedText && rec.extractedText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat: HealthRecord['category']) => {
    switch (cat) {
      case 'Lab Report':
        return { bg: '#EFF6FF', text: '#2563EB', icon: 'flask-outline' as const };
      case 'Prescription':
        return { bg: '#ECFDF5', text: '#059669', icon: 'medkit-outline' as const };
      case 'Diagnosis':
        return { bg: '#FFFBEB', text: '#D97706', icon: 'pulse-outline' as const };
      case 'Vaccine':
        return { bg: '#F5F3FF', text: '#7C3AED', icon: 'shield-checkmark-outline' as const };
      default:
        return { bg: '#F1F5F9', text: '#475569', icon: 'document-text-outline' as const };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.blue} />}
      >
        {/* Top Header Gradient */}
        <LinearGradient
          colors={['#2563EB', '#1D4ED8', '#1E3A8A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 16) }]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Health Memory</Text>
              <Text style={styles.headerSubtitle}>
                Longitudinal Medical Records & Gemini OCR
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.addRecordBtn} 
              onPress={() => router.push('/upload')}
              activeOpacity={0.8}
            >
              <Ionicons name="cloud-upload" size={18} color="#FFFFFF" />
              <Text style={styles.addRecordText}>Upload</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              placeholder="Search extracted text, medications, labs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </LinearGradient>

        <View style={styles.contentBody}>
          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Section Header with Record Count & Clear Action */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="documents-outline" size={18} color={colors.primary.blue} />
              <Text style={styles.sectionTitle}>
                {selectedCategory === 'All' ? 'Extracted Health Records' : `${selectedCategory}s`}
              </Text>
            </View>

            <View style={styles.headerRightControls}>
              <Text style={styles.recordsCount}>{filteredRecords.length} records</Text>
              {records.length > 0 && (
                <TouchableOpacity
                  style={styles.clearAllBtn}
                  onPress={handleClearAllRecords}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={14} color="#DC2626" />
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Loading State */}
          {isLoading && records.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary.blue} />
              <Text style={styles.loadingText}>Fetching documents from database...</Text>
            </View>
          ) : filteredRecords.length === 0 ? (
            /* Empty State - Clean */
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="document-text-outline" size={36} color={colors.primary.blue} />
              </View>
              <Text style={styles.emptyTitle}>No Extracted Records Found</Text>
              <Text style={styles.emptySubtitle}>
                Take a photo or upload a prescription or lab report. Gemini AI will extract all text and save it to your database.
              </Text>
              <TouchableOpacity
                style={styles.emptyUploadBtn}
                onPress={() => router.push('/upload')}
                activeOpacity={0.85}
              >
                <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
                <Text style={styles.emptyUploadBtnText}>Upload & Extract Record</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* 100% Dynamic Real Documents List */
            <View style={styles.recordsList}>
              {filteredRecords.map((record) => {
                const catConfig = getCategoryColor(record.category);
                const hasExtractedText = Boolean(record.extractedText && record.extractedText.trim().length > 0);

                return (
                  <TouchableOpacity
                    key={record.id}
                    style={styles.recordCard}
                    onPress={() => setSelectedRecord(record)}
                    activeOpacity={0.8}
                  >
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.cardHeaderLeft}>
                        <View style={[styles.categoryBadge, { backgroundColor: catConfig.bg }]}>
                          <Ionicons name={catConfig.icon} size={14} color={catConfig.text} />
                          <Text style={[styles.categoryBadgeText, { color: catConfig.text }]}>
                            {record.category}
                          </Text>
                        </View>

                        {record.provenance === 'AI_EXTRACTED' && (
                          <View style={styles.aiPill}>
                            <Ionicons name="sparkles" size={12} color="#2563EB" />
                            <Text style={styles.aiPillText}>Gemini OCR</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.cardHeaderRight}>
                        <Text style={styles.recordDate}>{record.date}</Text>
                        <TouchableOpacity
                          style={styles.deleteCardBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDeleteRecord(record);
                          }}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="trash-outline" size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Title & Facility */}
                    <Text style={styles.recordTitle}>{record.title}</Text>
                    <View style={styles.doctorFacilityRow}>
                      <Ionicons name="person-outline" size={13} color={colors.text.tertiary} />
                      <Text style={styles.doctorText}>{record.doctor}</Text>
                      <Text style={styles.dot}>•</Text>
                      <Ionicons name="business-outline" size={13} color={colors.text.tertiary} />
                      <Text style={styles.facilityText}>{record.facility}</Text>
                    </View>

                    {/* Summary */}
                    <Text style={styles.recordSummary}>{record.summary}</Text>

                    {/* Extracted Text Snippet Preview Box */}
                    {hasExtractedText && (
                      <View style={styles.ocrSnippetBox}>
                        <View style={styles.ocrSnippetHeader}>
                          <Ionicons name="scan-outline" size={13} color={colors.primary.blue} />
                          <Text style={styles.ocrSnippetLabel}>Extracted Text (Gemini OCR)</Text>
                        </View>
                        <Text style={styles.ocrSnippetText} numberOfLines={4}>
                          {record.extractedText}
                        </Text>
                      </View>
                    )}

                    {/* Card Footer */}
                    <View style={styles.cardFooter}>
                      <View style={styles.viewEvidenceBtn}>
                        <Text style={styles.viewEvidenceText}>View Full Transcription</Text>
                        <Ionicons name="chevron-forward" size={14} color={colors.primary.blue} />
                      </View>

                      {hasExtractedText && (
                        <TouchableOpacity
                          style={styles.copyIconBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleCopyText(record.extractedText);
                          }}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="copy-outline" size={16} color={colors.primary.blue} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Complete Record & Extracted Text Detail Modal */}
      <Modal
        visible={selectedRecord !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedRecord(null)}
      >
        {selectedRecord && (
          <View style={styles.modalContainer}>
            {/* Modal Top Bar */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedRecord(null)}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                {selectedRecord.category} Record
              </Text>
              <View style={styles.modalTopActions}>
                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => handleDeleteRecord(selectedRecord)}
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => handleCopyText(selectedRecord.extractedText || selectedRecord.summary)}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary.blue} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Category & AI Badges */}
              <View style={styles.modalBadgeRow}>
                <View style={[styles.modalCatPill, { backgroundColor: getCategoryColor(selectedRecord.category).bg }]}>
                  <Text style={[styles.modalCatPillText, { color: getCategoryColor(selectedRecord.category).text }]}>
                    {selectedRecord.category}
                  </Text>
                </View>

                <View style={styles.aiPill}>
                  <Ionicons name="sparkles" size={12} color="#2563EB" />
                  <Text style={styles.aiPillText}>Gemini Vision AI</Text>
                </View>
                <Text style={styles.modalDateText}>{selectedRecord.date}</Text>
              </View>

              <Text style={styles.modalTitle}>{selectedRecord.title}</Text>

              {/* Doctor & Facility Box */}
              <View style={styles.modalDoctorBox}>
                <View style={styles.modalDocAvatar}>
                  <Ionicons name="medkit" size={20} color={colors.primary.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalDocName}>{selectedRecord.doctor}</Text>
                  <Text style={styles.modalFacilityName}>{selectedRecord.facility}</Text>
                </View>
              </View>

              {/* Clinical Summary */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Clinical Overview</Text>
                <Text style={styles.modalSummaryText}>{selectedRecord.summary}</Text>
              </View>

              {/* Full Raw Extracted Text Box */}
              {selectedRecord.extractedText ? (
                <View style={styles.modalSection}>
                  <View style={styles.extractedTitleRow}>
                    <Text style={styles.modalSectionTitle}>Complete Extracted Text (Gemini OCR)</Text>
                    <TouchableOpacity
                      style={styles.copyInlineBtn}
                      onPress={() => handleCopyText(selectedRecord.extractedText)}
                    >
                      <Ionicons name="copy-outline" size={14} color={colors.primary.blue} />
                      <Text style={styles.copyInlineText}>Copy All</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalExtractedPaper}>
                    <Text style={styles.modalExtractedContent} selectable>
                      {selectedRecord.extractedText}
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Database & Security Notice */}
              <View style={styles.securityNotice}>
                <Ionicons name="shield-checkmark" size={18} color="#059669" />
                <Text style={styles.securityNoticeText}>
                  Stored securely in database. Transcribed with Gemini Vision AI.
                </Text>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl * 2,
  },
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  addRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addRecordText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchContainer: {
    marginTop: spacing.xs,
  },
  contentBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },

  // Category Pills
  categoryScroll: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  categoryChipActive: {
    backgroundColor: colors.primary.blue,
    borderColor: colors.primary.blue,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  recordsCount: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  clearAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 13,
    color: colors.text.secondary,
  },

  // Empty State
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginTop: spacing.md,
    ...shadows.card,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  emptyUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary.blue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    ...shadows.button,
  },
  emptyUploadBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Records List
  recordsList: {
    gap: spacing.md,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deleteCardBtn: {
    padding: 2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  aiPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  recordDate: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  recordTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  doctorFacilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  doctorText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  dot: {
    fontSize: 10,
    color: colors.text.tertiary,
  },
  facilityText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  recordSummary: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },

  // OCR Snippet Box
  ocrSnippetBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.sm,
  },
  ocrSnippetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ocrSnippetLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary.blue,
    textTransform: 'uppercase',
  },
  ocrSnippetText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#0F172A',
    lineHeight: 16,
  },

  // Card Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  viewEvidenceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewEvidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary.blue,
  },
  copyIconBtn: {
    padding: 4,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  modalTopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalActionBtn: {
    padding: 4,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  modalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modalCatPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  modalCatPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalDateText: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginLeft: 'auto',
  },
  modalTitle: {
    ...typography.h1,
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  modalDoctorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  modalDocAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDocName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  modalFacilityName: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  modalSection: {
    marginBottom: spacing.xl,
  },
  modalSectionTitle: {
    ...typography.h3,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  modalSummaryText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  extractedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  copyInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyInlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary.blue,
  },
  modalExtractedPaper: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalExtractedContent: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
    color: '#0F172A',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#ECFDF5',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  securityNoticeText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
  },
});
