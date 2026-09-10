/**
 * Health Memory — Mock Data
 *
 * Sample data matching the UI reference design.
 * Patient context: Lakshmi, an elderly Indian woman.
 */

import { colors } from '../theme/colors';
import type {
  Patient,
  Medication,
  DailyHealthCheck,
  HealthUpdate,
  Appointment,
  QuickAction,
} from '../types';

// ── Patient Profile ─────────────────────────────────
export const currentPatient: Patient = {
  id: 'patient-001',
  firstName: 'Lakshmi',
  lastName: 'Devi',
  age: 78,
  notificationCount: 3,
};

// ── Quick Actions ───────────────────────────────────
export const quickActions: QuickAction[] = [
  {
    id: 'qa-medications',
    title: 'Medications',
    subtitle: '2 due today',
    icon: 'medkit-outline',
    bgColor: colors.accent.medication.bg,
    iconColor: colors.accent.medication.icon,
    textColor: colors.accent.medication.text,
  },
  {
    id: 'qa-daily-check',
    title: 'Daily Check',
    subtitle: 'Not completed',
    icon: 'clipboard-outline',
    bgColor: colors.accent.dailyCheck.bg,
    iconColor: colors.accent.dailyCheck.icon,
    textColor: colors.accent.dailyCheck.text,
  },
  {
    id: 'qa-speak',
    title: 'Speak',
    subtitle: 'Add an update',
    icon: 'mic-outline',
    bgColor: colors.accent.speak.bg,
    iconColor: colors.accent.speak.icon,
    textColor: colors.accent.speak.text,
  },
  {
    id: 'qa-emergency',
    title: 'Emergency',
    subtitle: 'Quick access',
    icon: 'notifications-outline',
    bgColor: colors.accent.emergency.bg,
    iconColor: colors.accent.emergency.icon,
    textColor: colors.accent.emergency.text,
  },
];

// ── Medications ─────────────────────────────────────
export const medications: Medication[] = [
  {
    id: 'med-001',
    name: 'Amlodipine 5 mg',
    dosage: '5 mg',
    schedule: 'After breakfast',
    status: 'due_now',
    iconColor: '#E85454',
  },
  {
    id: 'med-002',
    name: 'Metformin 500 mg',
    dosage: '500 mg',
    schedule: 'After lunch',
    status: 'upcoming',
    timeUntil: 'In 3 hours',
    iconColor: '#4A7FF7',
  },
];

// ── Daily Health Check ──────────────────────────────
export const dailyHealthCheck: DailyHealthCheck = {
  id: 'dhc-001',
  title: 'Daily Health Check',
  description: 'Mood, sleep, mobility...',
  isCompleted: false,
};

// ── Health Updates / Recent ─────────────────────────
export const recentUpdates: HealthUpdate[] = [
  {
    id: 'update-001',
    date: 'Oct 12, 2024',
    description: 'Feeling better today',
    mood: 'good',
  },
  {
    id: 'update-002',
    date: 'Oct 10, 2024',
    description: 'Mild knee pain',
    mood: 'neutral',
  },
  {
    id: 'update-003',
    date: 'Oct 8, 2024',
    description: 'Good sleep',
    mood: 'great',
  },
];

// ── Upcoming Appointments ───────────────────────────
export const upcomingAppointments: Appointment[] = [
  {
    id: 'appt-001',
    doctor: {
      id: 'doc-001',
      name: 'Dr. Ramesh Kumar',
      specialty: 'General Physician',
    },
    date: 'Oct 18, 2024',
    time: '10:00 AM',
  },
  {
    id: 'appt-002',
    doctor: {
      id: 'doc-002',
      name: 'Dr. Priya Nair',
      specialty: 'Neurologist',
    },
    date: 'Oct 28, 2024',
    time: '11:30 AM',
  },
];
