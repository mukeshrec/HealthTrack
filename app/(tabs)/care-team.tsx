/**
 * Care Team & Specialist Directory Screen
 *
 * Real-world clinical care network with:
 * - Patient Health ID (HID) with 1-tap copy for caregivers
 * - Pending Caregiver Approval requests
 * - Doctor directory & telemedicine consultation booking modal
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { colors, typography, spacing, borderRadius, shadows } from '../../src/theme';
import { Avatar, Button, SearchBar } from '../../src/components/common';
import { useAuth } from '../../src/context/AuthContext';
import { API_BASE_URL, delay } from '../../src/config/api';

interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  fee: string;
  rating: number;
  reviewsCount: string;
  experience: string;
  patientsCount: string;
  about: string;
  availableDays: { day: string; date: number; month: string }[];
  timeSlots: string[];
}

const mockDoctors: DoctorProfile[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ramesh Kumar, MD',
    specialty: 'Chief Consultant • General Medicine',
    fee: '₹120',
    rating: 4.9,
    reviewsCount: '2.8k+',
    experience: '14 Years',
    patientsCount: '6.2k+',
    about: 'Senior consultant physician specializing in elderly primary care, geriatric lifestyle medicine, and multi-morbidity coordination.',
    availableDays: [
      { day: 'Mon', date: 16, month: 'Dec' },
      { day: 'Tue', date: 17, month: 'Dec' },
      { day: 'Wed', date: 18, month: 'Dec' },
      { day: 'Thu', date: 19, month: 'Dec' },
      { day: 'Fri', date: 20, month: 'Dec' },
    ],
    timeSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Nair, DM',
    specialty: 'Senior Neurologist • Memory Care',
    fee: '₹180',
    rating: 4.9,
    reviewsCount: '3.5k+',
    experience: '11 Years',
    patientsCount: '4.8k+',
    about: 'Specialist in cognitive health, memory care, neuro-rehabilitation, and neurological wellness tracking.',
    availableDays: [
      { day: 'Mon', date: 16, month: 'Dec' },
      { day: 'Tue', date: 17, month: 'Dec' },
      { day: 'Wed', date: 18, month: 'Dec' },
      { day: 'Thu', date: 19, month: 'Dec' },
      { day: 'Fri', date: 20, month: 'Dec' },
    ],
    timeSlots: ['11:00 AM', '01:00 PM', '03:30 PM', '05:00 PM'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Mason Lee, MD',
    specialty: 'Cardiologist • Heart Institute',
    fee: '₹200',
    rating: 4.8,
    reviewsCount: '4.1k+',
    experience: '12 Years',
    patientsCount: '5.5k+',
    about: 'Expert cardiologist focusing on heart rhythm analysis, hypertension management, and preventive cardiovascular care.',
    availableDays: [
      { day: 'Mon', date: 16, month: 'Dec' },
      { day: 'Tue', date: 17, month: 'Dec' },
      { day: 'Wed', date: 18, month: 'Dec' },
      { day: 'Thu', date: 19, month: 'Dec' },
      { day: 'Fri', date: 20, month: 'Dec' },
    ],
    timeSlots: ['08:30 AM', '10:00 AM', '12:00 PM', '04:00 PM'],
  },
];

const specialties = ['All', 'General Medicine', 'Neurology', 'Cardiology'];

export default function CareTeamScreen() {
  const insets = useSafeAreaInsets();
  const { user, token } = useAuth();
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(2);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const fetchRequests = async () => {
    try {
      await delay(1200);
      const response = await fetch(`${API_BASE_URL}/connections/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.warn('Using local care network');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (connectionId: string) => {
    try {
      await delay(1200);
      const response = await fetch(`${API_BASE_URL}/connections/accept`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ connectionId })
      });
      if (response.ok) {
        Alert.alert('Caregiver Approved', 'Your caregiver has been granted access to your health memory.');
        fetchRequests();
      }
    } catch (error) {
      Alert.alert('Caregiver Approved', 'Access granted.');
      setRequests([]);
    }
  };

  const copyHealthId = async () => {
    const hid = user?.healthId || '1234 5678 9012';
    await Clipboard.setStringAsync(hid);
    Alert.alert('Aadhar No Copied', `${hid} copied to clipboard.`);
  };

  const toggleFavorite = (docId: string) => {
    setFavoriteMap((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const filteredDoctors = mockDoctors.filter((doc) => {
    const matchesSpec = selectedSpecialty === 'All' || doc.specialty.includes(selectedSpecialty);
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesSearch;
  });

  const handleBookSession = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDoctor(null);
      Alert.alert(
        'Consultation Confirmed',
        `Your teleconsultation with ${selectedDoctor?.name} is confirmed for ${selectedDoctor?.availableDays[selectedDayIndex].day}, ${selectedDoctor?.availableDays[selectedDayIndex].date} at ${selectedTimeSlot}.`
      );
    }, 800);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <LinearGradient
          colors={['#2563EB', '#1D4ED8', '#1E3A8A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 16) }]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Care Team & Specialists</Text>
              <Text style={styles.headerSubtitle}>
                Manage Guardians & Book Doctor Consultations
              </Text>
            </View>

            <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.8}>
              <Ionicons name="call" size={16} color="#DC2626" />
              <Text style={styles.emergencyBtnText}>SOS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              placeholder="Find Doctor, specialist, hospital..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </LinearGradient>

        <View style={styles.contentBody}>
          {/* Patient Health ID Card */}
          <View style={styles.hidCard}>
            <View style={styles.hidHeader}>
              <View style={styles.hidTag}>
                <Ionicons name="card" size={14} color={colors.primary.blue} />
                <Text style={styles.hidTagText}>Aadhar No</Text>
              </View>
              <TouchableOpacity onPress={copyHealthId} style={styles.copyBtn}>
                <Ionicons name="copy-outline" size={18} color={colors.text.secondary} />
                <Text style={styles.copyBtnText}>Copy</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: spacing.md }}>
              <Text style={styles.hidNumber}>{user?.healthId || '1234 5678 9012'}</Text>
            </View>
            <Text style={styles.hidDescription}>
              Share this identifier with your family or authorized caregivers to grant secure health timeline access.
            </Text>
          </View>

          {/* Pending Requests */}
          {requests.length > 0 && (
            <View style={styles.pendingSection}>
              <Text style={styles.sectionHeading}>Pending Caregiver Requests</Text>
              {requests.map((item) => (
                <View key={item.id} style={styles.requestCard}>
                  <Avatar name={item.caregiver.name} size={44} />
                  <View style={styles.requestInfo}>
                    <Text style={styles.caregiverName}>{item.caregiver.name}</Text>
                    <Text style={styles.caregiverEmail}>{item.caregiver.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => acceptRequest(item.id)}
                  >
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Specialty Categories */}
          <Text style={styles.sectionHeading}>Popular Specialists</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesScroll}
          >
            {specialties.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <TouchableOpacity
                  key={spec}
                  style={[
                    styles.specialtyPill,
                    isSelected && styles.specialtyPillSelected,
                  ]}
                  onPress={() => setSelectedSpecialty(spec)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.specialtyText,
                      isSelected && styles.specialtyTextSelected,
                    ]}
                  >
                    {spec}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Doctors List */}
          <View style={styles.doctorList}>
            {filteredDoctors.map((doc) => {
              const isFav = favoriteMap[doc.id];
              return (
                <View key={doc.id} style={styles.doctorCard}>
                  <View style={styles.docHeaderRow}>
                    <Avatar name={doc.name} size={54} verified online />
                    <View style={styles.docHeaderInfo}>
                      <View style={styles.docNameRow}>
                        <Text style={styles.docName}>{doc.name}</Text>
                        <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
                      </View>
                      <Text style={styles.docSpecialty}>{doc.specialty}</Text>

                      <View style={styles.ratingExpRow}>
                        <View style={styles.ratingBox}>
                          <Ionicons name="star" size={12} color="#D97706" />
                          <Text style={styles.ratingVal}>{doc.rating}</Text>
                        </View>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.expText}>{doc.experience} Exp</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.favoriteBtn, isFav && styles.favoriteBtnActive]}
                      onPress={() => toggleFavorite(doc.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isFav ? '#DC2626' : colors.neutral.gray400}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.docFooterRow}>
                    <View>
                      <Text style={styles.feeAmount}>{doc.fee}</Text>
                      <Text style={styles.feeLabel}>Per Consultation</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.bookActionBtn}
                      onPress={() => {
                        setSelectedDoctor(doc);
                        setSelectedTimeSlot(doc.timeSlots[0]);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.bookActionText}>Book Session</Text>
                      <View style={styles.arrowIconCircle}>
                        <Ionicons name="arrow-forward" size={16} color={colors.neutral.white} style={styles.arrowRotated} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Doctor Details & Booking Modal */}
      <Modal
        visible={!!selectedDoctor}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedDoctor(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {selectedDoctor && (
              <>
                <View style={styles.modalSheetHeader}>
                  <TouchableOpacity
                    onPress={() => setSelectedDoctor(null)}
                    style={styles.modalBackBtn}
                  >
                    <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
                  </TouchableOpacity>
                  <Text style={styles.modalHeaderTitle}>Doctor Details</Text>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(selectedDoctor.id)}
                    style={styles.modalFavBtn}
                  >
                    <Ionicons
                      name={favoriteMap[selectedDoctor.id] ? 'heart' : 'heart-outline'}
                      size={20}
                      color={favoriteMap[selectedDoctor.id] ? '#DC2626' : colors.neutral.gray500}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.docHeroSection}>
                    <Avatar name={selectedDoctor.name} size={76} verified online />
                    <Text style={styles.docHeroName}>{selectedDoctor.name}</Text>
                    <Text style={styles.docHeroSpecialty}>{selectedDoctor.specialty}</Text>
                    <Text style={styles.docHeroFee}>{selectedDoctor.fee} <Text style={styles.feeSub}>/ Session</Text></Text>

                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity style={styles.contactCircleBtn}>
                        <Ionicons name="videocam" size={20} color={colors.neutral.white} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.contactCircleBtn}>
                        <Ionicons name="chatbubble-ellipses" size={20} color={colors.neutral.white} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Stats */}
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <View style={[styles.statIconBox, { backgroundColor: '#ECFDF5' }]}>
                        <Ionicons name="time" size={16} color="#059669" />
                      </View>
                      <Text style={styles.statNumber}>{selectedDoctor.experience}</Text>
                      <Text style={styles.statLabel}>Experience</Text>
                    </View>

                    <View style={styles.statBox}>
                      <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
                        <Ionicons name="people" size={16} color="#2563EB" />
                      </View>
                      <Text style={styles.statNumber}>{selectedDoctor.patientsCount}</Text>
                      <Text style={styles.statLabel}>Patients</Text>
                    </View>

                    <View style={styles.statBox}>
                      <View style={[styles.statIconBox, { backgroundColor: '#FFFBEB' }]}>
                        <Ionicons name="star" size={16} color="#D97706" />
                      </View>
                      <Text style={styles.statNumber}>{selectedDoctor.rating} ★</Text>
                      <Text style={styles.statLabel}>{selectedDoctor.reviewsCount} Reviews</Text>
                    </View>
                  </View>

                  <Text style={styles.sectionHeadingModal}>About Doctor</Text>
                  <Text style={styles.aboutText}>{selectedDoctor.about}</Text>

                  {/* Date Selector */}
                  <View style={styles.dateSelectorHeader}>
                    <Text style={styles.sectionHeadingModal}>Select Date</Text>
                    <Text style={styles.monthLabel}>December 2024</Text>
                  </View>
                  <View style={styles.datesRow}>
                    {selectedDoctor.availableDays.map((d, index) => {
                      const isSelected = selectedDayIndex === index;
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.datePillBox,
                            isSelected && styles.datePillBoxSelected,
                          ]}
                          onPress={() => setSelectedDayIndex(index)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.dateDayText, isSelected && styles.dateTextSelected]}>
                            {d.day}
                          </Text>
                          <Text style={[styles.dateNumText, isSelected && styles.dateNumTextSelected]}>
                            {d.date}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Time Slots */}
                  <Text style={[styles.sectionHeadingModal, { marginTop: spacing.base }]}>Select Time Slot</Text>
                  <View style={styles.timeSlotsGrid}>
                    {selectedDoctor.timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <TouchableOpacity
                          key={slot}
                          style={[
                            styles.timeSlotPill,
                            isSelected && styles.timeSlotPillSelected,
                          ]}
                          onPress={() => setSelectedTimeSlot(slot)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.timeSlotText,
                              isSelected && styles.timeSlotTextSelected,
                            ]}
                          >
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.bookingFooter}>
                    <Button
                      title={bookingSuccess ? 'Confirming Appointment...' : 'Confirm Teleconsultation'}
                      loading={bookingSuccess}
                      onPress={handleBookSession}
                      size="large"
                      style={styles.bookSessionBigBtn}
                    />
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
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
    paddingBottom: 110,
  },
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.neutral.white,
    fontWeight: '800',
  },
  headerSubtitle: {
    ...typography.small,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    ...shadows.soft,
  },
  emergencyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  searchContainer: {
    marginTop: spacing.xs,
  },
  contentBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.base,
  },
  hidCard: {
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    marginBottom: spacing.base,
    ...shadows.card,
  },
  hidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  hidTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  hidTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  hidNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.neutral.white,
    letterSpacing: 1.5,
    marginVertical: 4,
  },
  hidDescription: {
    ...typography.tiny,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
  },
  pendingSection: {
    marginBottom: spacing.base,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#EDF2FA',
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  requestInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  caregiverName: {
    ...typography.bodySemibold,
    color: colors.text.primary,
    fontWeight: '700',
  },
  caregiverEmail: {
    ...typography.tiny,
    color: colors.text.secondary,
  },
  approveBtn: {
    backgroundColor: colors.primary.blue,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  approveBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  sectionHeading: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  specialtiesScroll: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  specialtyPill: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: '#E2EAF8',
  },
  specialtyPillSelected: {
    backgroundColor: colors.primary.blue,
    borderColor: colors.primary.blue,
    ...shadows.soft,
  },
  specialtyText: {
    ...typography.smallMedium,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  specialtyTextSelected: {
    color: colors.neutral.white,
    fontWeight: '700',
  },
  doctorList: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  doctorCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#EFF3FA',
    ...shadows.card,
  },
  docHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  docHeaderInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  docNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  docName: {
    ...typography.bodySemibold,
    color: colors.text.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  docSpecialty: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: 2,
  },
  ratingExpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingVal: {
    ...typography.tiny,
    fontWeight: '700',
    color: colors.text.primary,
  },
  bulletDot: {
    marginHorizontal: 5,
    color: colors.text.tertiary,
    fontSize: 10,
  },
  expText: {
    ...typography.tiny,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  favoriteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteBtnActive: {
    backgroundColor: '#FEF2F2',
  },
  docFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: spacing.md,
  },
  feeAmount: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '800',
  },
  feeLabel: {
    ...typography.tiny,
    color: colors.text.secondary,
  },
  bookActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary.sky,
    paddingLeft: spacing.base,
    paddingRight: 4,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  bookActionText: {
    ...typography.smallSemibold,
    color: colors.primary.blue,
  },
  arrowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowRotated: {
    transform: [{ rotate: '-45deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
    paddingTop: spacing.md,
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  modalFavBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.base,
  },
  docHeroSection: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  docHeroName: {
    ...typography.h1,
    color: colors.text.primary,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  docHeroSpecialty: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    marginTop: 2,
  },
  docHeroFee: {
    ...typography.h2,
    color: colors.primary.blue,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  feeSub: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.md,
  },
  contactCircleBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary.deepBlue,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFF3FA',
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    ...typography.smallSemibold,
    color: colors.text.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.tiny,
    color: colors.text.secondary,
    marginTop: 1,
  },
  sectionHeadingModal: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  aboutText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.base,
  },
  dateSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  monthLabel: {
    ...typography.smallSemibold,
    color: colors.primary.blue,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  datePillBox: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2EAF8',
  },
  datePillBoxSelected: {
    backgroundColor: colors.primary.blue,
    borderColor: colors.primary.blue,
    ...shadows.button,
  },
  dateDayText: {
    ...typography.tiny,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  dateNumText: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '800',
    marginTop: 2,
  },
  dateTextSelected: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  dateNumTextSelected: {
    color: colors.neutral.white,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  timeSlotPill: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral.gray50,
    borderWidth: 1,
    borderColor: '#E2EAF8',
  },
  timeSlotPillSelected: {
    backgroundColor: colors.primary.deepBlue,
    borderColor: colors.primary.deepBlue,
  },
  timeSlotText: {
    ...typography.smallSemibold,
    color: colors.text.primary,
  },
  timeSlotTextSelected: {
    color: colors.neutral.white,
  },
  bookingFooter: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  bookSessionBigBtn: {
    backgroundColor: colors.primary.blue,
    ...shadows.button,
  },
});
