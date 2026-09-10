import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PatientHeader } from '../components/dashboard/PatientHeader';
import { MedicationSchedule } from '../components/dashboard/MedicationSchedule';
import { WhatMattersNow } from '../components/dashboard/WhatMattersNow';
import { AskHealthMemory } from '../components/dashboard/AskHealthMemory';
import { PatientJourney } from '../components/dashboard/PatientJourney';
import { RecentDocuments } from '../components/dashboard/RecentDocuments';
import { ActiveRiskAlerts } from '../components/ActiveRiskAlerts';
import { 
  Search, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Users, 
  ShieldAlert, 
  Pill, 
  FileText, 
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import axios from 'axios';

export function DoctorPortal() {
  const [hidInput, setHidInput] = useState('1234 5678 9012');
  const [patientData, setPatientData] = useState({
    user: { name: 'Lakshmi Narayanan', healthId: 'HT-2024-89321' },
    age: 78,
    gender: 'Female',
    bloodGroup: 'O+',
    id: '848382cf-218c-4f4d-9b29-2a2dd375c6da',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!hidInput.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:3000/api/connections/patients`, {
        headers: { Authorization: `Bearer TEST_TOKEN` }
      });
      
      const mockedProfileData = {
        user: { name: 'Lakshmi Narayanan', healthId: hidInput },
        age: 78,
        gender: 'Female',
        bloodGroup: 'O+',
        id: '848382cf-218c-4f4d-9b29-2a2dd375c6da',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      };

      setPatientData(mockedProfileData);
    } catch (err) {
      console.error('Error finding patient', err);
      setPatientData({
        user: { name: 'Lakshmi Narayanan', healthId: hidInput },
        age: 78,
        gender: 'Female',
        bloodGroup: 'O+',
        id: '848382cf-218c-4f4d-9b29-2a2dd375c6da',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-7 pb-12">
        
        {/* Top Search & CivicConnect-style Hero Greeting Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Patient Lookup Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Search size={16} className="text-blue-600" />
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Patient Aadhar / Health ID Lookup
                </label>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-4">
                Retrieve consent-verified longitudinal health records.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input 
                  type="text" 
                  value={hidInput}
                  onChange={(e) => setHidInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-800 font-bold text-xs flex-1 placeholder:text-slate-400"
                  placeholder="e.g. 1234 5678 9012"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-2xl transition-all shadow-xs shadow-blue-600/20 disabled:opacity-50 text-xs flex items-center justify-center gap-2"
              >
                <Search size={14} />
                <span>{loading ? 'Retrieving Records...' : 'View Patient Profile'}</span>
              </button>
            </form>
          </div>

          {/* Hero Greeting Banner (Reference 1 CivicConnect Banner Style) */}
          <div className="lg:col-span-8 bg-gradient-to-br from-blue-50 via-cyan-50/60 to-indigo-50/70 rounded-3xl border border-blue-100 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            {/* Background Aesthetic Blur Shapes */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-blue-200/40 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/3 w-36 h-36 bg-teal-200/30 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-blue-200 text-blue-800 text-[11px] font-extrabold mb-3 shadow-2xs">
                <Sparkles size={12} className="text-blue-600" />
                <span>Geriatric Clinical Copilot Active</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                Good Morning, Dr. Arjun! ✨
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                Reviewing longitudinal care trajectory for <span className="font-bold text-slate-900">{patientData?.user?.name || 'Lakshmi Narayanan'}</span> (78 yrs). 3 high-priority multi-agent risk flags require review.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-xl border border-slate-200/60">
                  <MapPin size={12} className="text-blue-600" /> Chennai Central Ward
                </span>
                <span className="flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-xl border border-slate-200/60">
                  <Users size={12} className="text-teal-600" /> 1,254 Monitored Patients
                </span>
              </div>
            </div>

            {/* Quick Action in Banner */}
            <div className="relative z-10 shrink-0">
              <button 
                onClick={() => alert('Geriatric AI Multi-Agent Synthesizer running across 5-year history.')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-sm shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>Run AI Synthesis</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Metrics Row (Reference 1 CivicConnect Style 4-Cards Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
              <ShieldAlert size={22} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Active AI Risks</span>
              <span className="text-xl font-black text-slate-900 leading-tight">3 Flags</span>
              <span className="text-[11px] font-bold text-red-600 block mt-0.5">1 Critical · 2 Moderate</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Med Adherence</span>
              <span className="text-xl font-black text-slate-900 leading-tight">78%</span>
              <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">+8% from last month</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Extracted Records</span>
              <span className="text-xl font-black text-slate-900 leading-tight">18 Records</span>
              <span className="text-[11px] font-bold text-blue-600 block mt-0.5">100% OCR Digitized</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Longitudinal Span</span>
              <span className="text-xl font-black text-slate-900 leading-tight">5 Years</span>
              <span className="text-[11px] font-bold text-purple-600 block mt-0.5">2022 – 2026 Trajectory</span>
            </div>
          </div>
        </div>

        {patientData ? (
          <>
            {/* 1. Patient Profile Header & Vitals (Reference 2 CuraTrack Hero Card) */}
            <PatientHeader profile={patientData} />

            {/* 2. Today's Medication Schedule (Reference 2 7-Day Calendar & Status) */}
            <MedicationSchedule />

            {/* 3. Active AI Risk Alerts & Geriatric Multi-Agent Flags */}
            <ActiveRiskAlerts patientId={patientData.id} />

            {/* 4. What Matters Now AI Insights */}
            <WhatMattersNow patientId={patientData.id} />

            {/* 5. Bottom Grid: Patient Journey Timeline + AI Chat & Recent Documents */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
              <div className="xl:col-span-7 flex flex-col">
                <PatientJourney />
              </div>
              <div className="xl:col-span-5 flex flex-col gap-6">
                <div className="flex-1">
                  <AskHealthMemory patientId={patientData.id} />
                </div>
                <div className="flex-1">
                  <RecentDocuments />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-extrabold text-slate-700 mb-2">No Patient Selected</h3>
            <p className="text-slate-500 text-xs font-medium">Enter a valid Aadhar No above and click "View Patient Profile" to load their clinical profile.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

