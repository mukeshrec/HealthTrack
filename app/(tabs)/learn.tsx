/**
 * Learn Screen — MyCare+ Clinical Health Library & Knowledge Base
 *
 * Clinical education module with:
 * - Evidence-based medical guides & articles
 * - Topic filter pills (Cardiology, Diabetes, Medications, Nutrition, etc.)
 * - Search bar with real-time filtering
 * - Reading drawer modal with complete medical guidance
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../src/theme';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  summary: string;
  fullContent: string[];
  icon: keyof typeof Ionicons.glyphMap;
  accentBg: string;
  accentColor: string;
}

const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Managing Morning Hypertension Spikes',
    category: 'Cardiology',
    readTime: '4 min read',
    author: 'Dr. Sarah Jenkins, MD',
    summary: 'Why blood pressure surges between 6:00 AM and 10:00 AM and clinical steps to stay in target range.',
    icon: 'heart-outline',
    accentBg: '#EFF6FF',
    accentColor: colors.primary.blue,
    fullContent: [
      'The morning blood pressure surge is a natural circadian rhythm phenomenon. However, an excessive surge increases cardiovascular risk.',
      'Key Steps to Manage:',
      '1. Take your prescribed antihypertensive medication consistently at the same time each morning.',
      '2. Avoid rushing out of bed immediately. Sit upright for 60 seconds before standing.',
      '3. Limit caffeine intake before taking your morning BP measurement.',
      '4. Log your readings into MyCare+ Vitals for your doctor to review dosage effectiveness.',
    ],
  },
  {
    id: 'art-2',
    title: 'Understanding Postprandial Blood Glucose',
    category: 'Diabetes',
    readTime: '5 min read',
    author: 'Dr. Rajesh Patel, Endocrinologist',
    summary: 'A clinical guide to checking 2-hour post-meal blood sugar levels and preventing insulin resistance.',
    icon: 'water-outline',
    accentBg: '#FEF3C7',
    accentColor: '#D97706',
    fullContent: [
      'Postprandial glucose refers to blood sugar measured 2 hours after the start of a meal.',
      'Target Ranges for Adults with Diabetes:',
      '• Fasting: 80 - 130 mg/dL',
      '• 2 hours post-meal: Under 180 mg/dL (or under 140 mg/dL for non-diabetics)',
      'Clinical Recommendations:',
      '• Pair carbohydrates with lean protein and soluble fiber to slow glucose absorption.',
      '• A 10-minute gentle walk immediately after meals helps GLUT-4 glucose uptake in skeletal muscle.',
    ],
  },
  {
    id: 'art-3',
    title: 'Medication Interactions & Timing Protocol',
    category: 'Medications',
    readTime: '3 min read',
    author: 'Pharm. Lisa Ray, Clinical Pharmacist',
    summary: 'Crucial guidelines on spacing calcium supplements, thyroid drugs, and ACE inhibitors.',
    icon: 'medkit-outline',
    accentBg: '#ECFDF5',
    accentColor: '#059669',
    fullContent: [
      'Certain medications require specific spacing to avoid reduced bioavailability or adverse interactions.',
      'Critical Spacing Rules:',
      '• Levothyroxine: Must be taken on an empty stomach with plain water at least 30-60 minutes before breakfast.',
      '• Calcium & Iron: Must not be taken simultaneously with thyroid hormone or certain antibiotics (space by at least 4 hours).',
      '• Blood thinners (Warfarin/DOACs): Maintain consistent vitamin K intake and avoid NSAIDs like ibuprofen unless approved.',
    ],
  },
  {
    id: 'art-4',
    title: 'Recognizing Early Signs of Heat Stress in Seniors',
    category: 'Elderly Care',
    readTime: '6 min read',
    author: 'Dr. Michael Chen, Geriatrician',
    summary: 'How diminished thirst sensation affects hydration and warning signs of electrolyte imbalance.',
    icon: 'sunny-outline',
    accentBg: '#FFF7ED',
    accentColor: '#EA580C',
    fullContent: [
      'Seniors have lower fluid reserves and a reduced sensation of thirst, making dehydration common in warm weather.',
      'Warning Signs of Heat Exhaustion:',
      '• Heavy sweating followed by cold, pale, or clammy skin.',
      '• Dizziness, confusion, or weakness when standing.',
      '• Dark amber urine or output less than 3 times daily.',
      'Action Protocol:',
      'Move to an air-conditioned room, sip electrolyte solutions or water, and notify your caregiver immediately if dizziness persists.',
    ],
  },
];

const CATEGORIES = ['All Topics', 'Cardiology', 'Diabetes', 'Medications', 'Elderly Care'];

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['art-1']);

  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'All Topics' || art.category === selectedCategory;
    const matchesQuery =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Clinical Library</Text>
          <Text style={styles.screenSubtitle}>Verified Medical Knowledge & Health Guides</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={colors.neutral[400]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conditions, medications, tips..."
            placeholderTextColor={colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.neutral[400]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
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

        {/* Featured Clinical Insight Banner */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredBadge}>
            <Ionicons name="sparkles" size={14} color="#2563EB" />
            <Text style={styles.featuredBadgeText}>Daily Clinical Insight</Text>
          </View>
          <Text style={styles.featuredTitle}>Optimal Timing for Blood Pressure Medication</Text>
          <Text style={styles.featuredExcerpt}>
            Studies published in the Lancet show taking antihypertensives 30 minutes before sleep can improve 24-hour ambulatory pressure control.
          </Text>
          <TouchableOpacity
            style={styles.featuredCta}
            onPress={() => setActiveArticle(ARTICLES[0])}
            activeOpacity={0.7}
          >
            <Text style={styles.featuredCtaText}>Read Full Clinical Protocol</Text>
            <Ionicons name="arrow-forward" size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Articles List */}
        <View style={styles.articlesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All Topics' ? 'Curated Health Guides' : `${selectedCategory} Guides`}
            </Text>
            <Text style={styles.articlesCount}>{filteredArticles.length} articles</Text>
          </View>

          {filteredArticles.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            return (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => setActiveArticle(article)}
                activeOpacity={0.7}
              >
                <View style={styles.articleCardTop}>
                  <View style={[styles.articleIconBox, { backgroundColor: article.accentBg }]}>
                    <Ionicons name={article.icon} size={22} color={article.accentColor} />
                  </View>

                  <View style={styles.articleMeta}>
                    <View style={styles.categoryBadgeRow}>
                      <Text style={styles.articleCategory}>{article.category}</Text>
                      <Text style={styles.articleDot}>•</Text>
                      <Text style={styles.articleReadTime}>{article.readTime}</Text>
                    </View>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.bookmarkBtn}
                    onPress={() => toggleBookmark(article.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={isBookmarked ? colors.primary.blue : colors.neutral[400]}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.articleSummary} numberOfLines={2}>
                  {article.summary}
                </Text>

                <View style={styles.articleFooter}>
                  <View style={styles.authorRow}>
                    <Ionicons name="medical-outline" size={14} color={colors.primary.blue} />
                    <Text style={styles.authorName}>{article.author}</Text>
                  </View>
                  <View style={styles.readMoreRow}>
                    <Text style={styles.readMoreText}>Read Guide</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary.blue} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Article Detail Reading Modal */}
      <Modal
        visible={activeArticle !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveArticle(null)}
      >
        {activeArticle && (
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setActiveArticle(null)}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                {activeArticle.category}
              </Text>
              <TouchableOpacity
                style={styles.modalShareBtn}
                onPress={() => toggleBookmark(activeArticle.id)}
              >
                <Ionicons
                  name={bookmarkedIds.includes(activeArticle.id) ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={colors.primary.blue}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalMetaRow}>
                <View style={[styles.modalTag, { backgroundColor: activeArticle.accentBg }]}>
                  <Text style={[styles.modalTagText, { color: activeArticle.accentColor }]}>
                    {activeArticle.category}
                  </Text>
                </View>
                <Text style={styles.modalReadTime}>{activeArticle.readTime}</Text>
              </View>

              <Text style={styles.modalArticleTitle}>{activeArticle.title}</Text>

              <View style={styles.modalAuthorBox}>
                <View style={styles.modalAuthorAvatar}>
                  <Ionicons name="person" size={18} color={colors.primary.blue} />
                </View>
                <View>
                  <Text style={styles.modalAuthorName}>{activeArticle.author}</Text>
                  <Text style={styles.modalAuthorSubtitle}>Verified Medical Practitioner</Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalBody}>
                {activeArticle.fullContent.map((paragraph, idx) => (
                  <Text key={idx} style={styles.modalParagraph}>
                    {paragraph}
                  </Text>
                ))}
              </View>

              <View style={styles.disclaimerBox}>
                <Ionicons name="information-circle-outline" size={20} color={colors.text.tertiary} />
                <Text style={styles.disclaimerText}>
                  Medical Disclaimer: Content provided in MyCare+ Clinical Library is for informational purposes only and does not substitute professional clinical diagnosis or consultation.
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
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
  header: {
    marginBottom: spacing.md,
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

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },

  // Category Pills
  categoryScroll: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
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

  // Featured Card
  featuredCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: spacing.xl,
    ...shadows.soft,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  featuredTitle: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featuredExcerpt: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  featuredCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },

  // Articles Section
  articlesSection: {
    gap: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  articlesCount: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.card,
  },
  articleCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  articleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleMeta: {
    flex: 1,
    gap: 2,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary.blue,
    textTransform: 'uppercase',
  },
  articleDot: {
    fontSize: 10,
    color: colors.text.tertiary,
  },
  articleReadTime: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 2,
  },
  bookmarkBtn: {
    padding: 4,
  },
  articleSummary: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorName: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary.blue,
  },

  // Reading Modal
  modalSafeArea: {
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
  modalShareBtn: {
    padding: 4,
  },
  modalScrollView: {
    flex: 1,
  },
  modalContent: {
    padding: spacing.xl,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modalTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  modalTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalReadTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  modalArticleTitle: {
    ...typography.h1,
    fontSize: 22,
    color: colors.text.primary,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  modalAuthorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  modalAuthorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAuthorName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  modalAuthorSubtitle: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginBottom: spacing.lg,
  },
  modalBody: {
    gap: spacing.md,
  },
  modalParagraph: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text.primary,
  },
  disclaimerBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl * 1.5,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.text.tertiary,
    lineHeight: 16,
    flex: 1,
  },
});
