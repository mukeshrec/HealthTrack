export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const DOCTOR_AUTH_TOKEN = 'DOCTOR_TOKEN';

// Intelligent Gender Resolver
export const resolveGender = (nameStr = '', rawGen = '') => {
  const n = (nameStr || '').toLowerCase().trim();
  const maleNames = ['arun', 'fayas', 'kumar', 'ramesh', 'suresh', 'rahul', 'vijay', 'ajith', 'mukesh', 'rajesh', 'karthik', 'sanjay', 'manoj', 'vikas', 'amit', 'deepak', 'john', 'david', 'mohammed', 'ahmed', 'ali', 'hassan', 'alex', 'robert', 'michael', 'siddharth', 'pranav', 'ashwin', 'ganesh', 'shiva', 'hari', 'vishnu', 'surya'];
  const femaleNames = ['lakshmi', 'priya', 'anita', 'anitha', 'sarah', 'mary', 'sneha', 'pooja', 'kavitha', 'shanthi', 'deepa', 'divya', 'sangeetha', 'radha', 'swathi', 'geetha', 'kamala', 'meena', 'rekha', 'aarthi', 'bhavani', 'jaya'];

  if (maleNames.some(m => n.includes(m))) return 'Male';
  if (femaleNames.some(f => n.includes(f))) return 'Female';

  if (rawGen) {
    const rg = rawGen.trim().toLowerCase();
    if (rg === 'male' || rg === 'm') return 'Male';
    if (rg === 'female' || rg === 'f') return 'Female';
  }
  return 'Male';
};

// Fallback patient data if backend is starting or offline
export const FALLBACK_PATIENT = {
  user: {
    id: 'pt-1',
    name: 'Arun Kumar',
    healthId: 'HT-984210',
    email: 'arun.kumar@gmail.com',
    phone: '+91 98401 23456',
    role: 'patient'
  },
  profile: {
    id: 'prof-1',
    age: 72,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Sulfa drugs'],
    conditions: ['Type 2 Diabetes', 'Hypertension', 'Mild Cognitive Impairment', 'Osteoarthritis'],
    emergencyContacts: { name: 'Karthik Arun (Son)', phone: '+91 98401 99887' },
    lastUpdated: '11 Sep 2026'
  },
  documents: [
    {
      id: 'doc-1',
      fileName: 'Apollo_Discharge_Summary_Aug2026.pdf',
      fileType: 'application/pdf',
      category: 'Discharge Summary',
      documentDate: '2026-08-14',
      extractedText: 'Patient admitted following minor syncope. Blood pressure on admission 168/98 mmHg. Amlodipine discontinued; switched to Telmisartan 40mg OD.',
      summary: 'Cardiology discharge summary noting transition to Telmisartan and baseline renal function stability.',
      source: 'Apollo Hospitals Chennai'
    },
    {
      id: 'doc-2',
      fileName: 'Comprehensive_Metabolic_Panel_Jul2026.pdf',
      fileType: 'application/pdf',
      category: 'Lab Report',
      documentDate: '2026-07-28',
      extractedText: 'HbA1c: 7.4%. Fasting Blood Glucose: 138 mg/dL. Serum Creatinine: 1.1 mg/dL. eGFR: 68 mL/min. Total Cholesterol: 195 mg/dL.',
      summary: 'Glycemic control moderately elevated. Renal function stable within normal limits.',
      source: 'Dr. Lal PathLabs'
    },
    {
      id: 'doc-3',
      fileName: 'Geriatric_Neurology_Consultation_Jun2026.pdf',
      fileType: 'application/pdf',
      category: 'Doctor Note',
      documentDate: '2026-06-12',
      extractedText: 'MMSE Score: 24/30. Mild short-term memory lapses noted by caregiver. Advised structured daily routines and vitamin D3 supplementation.',
      summary: 'Cognitive baseline assessment confirming mild age-related memory deficit without focal deficits.',
      source: 'SIMS Hospital'
    }
  ],
  events: [
    {
      id: 'ev-1',
      title: 'Medication Transition Logged',
      description: 'Discontinued Amlodipine 5mg. Initiated Telmisartan 40mg once daily post-breakfast.',
      eventType: 'MEDICATION_CHANGE',
      formattedDate: '14 Aug 2026',
      year: '2026',
      source: 'Apollo Cardiology'
    },
    {
      id: 'ev-2',
      title: 'Minor Fall with Mechanical Cause',
      description: 'Caregiver noted minor trip over rug in hallway without head trauma. Vitals stable.',
      eventType: 'FALL_INCIDENT',
      formattedDate: '02 Aug 2026',
      year: '2026',
      source: 'Caregiver Log'
    },
    {
      id: 'ev-3',
      title: 'Routine Glycemic Panel (HbA1c 7.4%)',
      description: 'Fasting glucose 138 mg/dL. Advised dietary counseling and continued Metformin 500mg BD.',
      eventType: 'LAB_RESULT',
      formattedDate: '28 Jul 2026',
      year: '2026',
      source: 'Endocrinology OPD'
    }
  ],
  medications: [
    {
      id: 'med-1',
      name: 'Telmisartan',
      dosage: '40 mg',
      frequency: 'Once Daily (OD)',
      schedule: 'Morning (Post-Breakfast)',
      indication: 'Essential Hypertension',
      prescribedBy: 'Dr. R. Venkat (Cardiology)',
      startDate: '14 Aug 2026',
      status: 'ACTIVE'
    },
    {
      id: 'med-2',
      name: 'Metformin Hydrochloride',
      dosage: '500 mg',
      frequency: 'Twice Daily (BD)',
      schedule: 'Morning & Night (With Meals)',
      indication: 'Type 2 Diabetes Mellitus',
      prescribedBy: 'Dr. S. Preethi (Endocrinology)',
      startDate: '10 Jan 2025',
      status: 'ACTIVE'
    },
    {
      id: 'med-3',
      name: 'Atorvastatin',
      dosage: '10 mg',
      frequency: 'Once Daily (OD)',
      schedule: 'Bedtime (Night)',
      indication: 'Hyperlipidemia & Cardioprotection',
      prescribedBy: 'Dr. R. Venkat (Cardiology)',
      startDate: '10 Jan 2025',
      status: 'ACTIVE'
    },
    {
      id: 'med-4',
      name: 'Cholecalciferol (Vitamin D3)',
      dosage: '60,000 IU',
      frequency: 'Once Weekly (QW)',
      schedule: 'Every Sunday Morning',
      indication: 'Bone Health & Osteoarthritis Support',
      prescribedBy: 'Dr. M. Sundaram (Orthopedics)',
      startDate: '12 Jun 2026',
      status: 'ACTIVE'
    }
  ]
};
