/**
 * Health Memory — Type Definitions
 *
 * Core domain types for the elderly health memory system.
 */

// ── Patient ─────────────────────────────────────────
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  avatarUri?: string;
  notificationCount: number;
}

// ── Medications ─────────────────────────────────────
export type MedicationStatus = 'due_now' | 'upcoming' | 'taken' | 'missed';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;       // e.g. "After breakfast"
  status: MedicationStatus;
  timeUntil?: string;     // e.g. "In 3 hours"
  iconColor: string;
}

// ── Daily Health Check ──────────────────────────────
export interface DailyHealthCheck {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

// ── Health Updates ──────────────────────────────────
export type MoodType = 'great' | 'good' | 'neutral' | 'bad';

export interface HealthUpdate {
  id: string;
  date: string;
  description: string;
  mood: MoodType;
}

// ── Appointments ────────────────────────────────────
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
}

// ── Quick Actions ───────────────────────────────────
export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

// ── Care Team ───────────────────────────────────────
export interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  avatarUri?: string;
}

// ── Tab Route ───────────────────────────────────────
export type TabRoute = 'index' | 'health-memory' | 'care-team' | 'learn' | 'profile';
