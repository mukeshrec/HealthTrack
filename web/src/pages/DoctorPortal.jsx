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
        
        {/* 1. Unified Panoramic Clinical Hero Banner (CivicConnect / Hospital Enterprise Style) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1 max-w-3xl">
              {/* Status Tags */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-200/80 text-blue-700 text-[11px] font-extrabold shadow-2xs">
                  <Sparkles size={13} className="text-blue-600" />
                  <span>Geriatric Clinical Copilot Active</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200/80 text-emerald-700 text-[11px] font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>HIPAA Verified & Encrypted</span>
                </span>
              </div>

              {/* Greeting */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Good Morning, Dr. Arjun! ✨
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                Currently reviewing longitudinal geriatric care for{' '}
                <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/60">
                  {patientData?.user?.name || 'Lakshmi Narayanan'} (78 yrs · {patientData?.gender || 'Female'})
                </span>
                . 3 high-priority multi-agent risk flags detected across prescriptions & logs.
              </p>

              {/* Integrated Patient Aadhar Lookup Bar */}
              <form onSubmit={handleSearch} className="mt-5 flex flex-wrap sm:flex-nowrap items-center gap-2.5 max-w-2xl">
                <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xs focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search size={16} className="text-blue-600 shrink-0" />
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Patient Aadhar / Health ID</span>
                    <input 
                      type="text" 
                      value={hidInput}
                      onChange={(e) => setHidInput(e.target.value)}
                      className="bg-transparent border-none outline-none text-slate-900 font-extrabold text-xs placeholder:text-slate-400 placeholder:font-normal"
                      placeholder="e.g. 1234 5678 9012"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-sm shadow-blue-600/30 text-xs flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <Search size={14} />
                  <span>{loading ? 'Retrieving...' : 'View Patient Profile'}</span>
                </button>
              </form>

              {/* Quick Patient Switch Chips */}
              <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-500 font-medium">
                <span className="text-[10px] uppercase font-bold text-slate-400">Quick Switch:</span>
                <button 
                  onClick={() => { setHidInput('1234 5678 9012'); handleSearch(); }}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors"
                >
                  Lakshmi N (HT-89321)
                </button>
                <button 
                  onClick={() => { setHidInput('9876 5432 1098'); handleSearch(); }}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors"
                >
                  Mukesh V (HT-4109)
                </button>
              </div>
            </div>

            {/* Right Stat Summary Widget (CivicConnect style) */}
            <div className="w-full lg:w-72 bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between shrink-0">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Clinical Ward</span>
                <span className="text-xs font-extrabold text-blue-700 bg-white border border-blue-200/80 px-2.5 py-0.5 rounded-md shadow-2xs">Chennai Central</span>
              </div>

              <div className="space-y-2 mb-4 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Monitored Patients:</span>
                  <span className="font-extrabold text-slate-900">1,254 Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Avg Med Adherence:</span>
                  <span className="font-extrabold text-emerald-600">78% Today</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Active Risk Alerts:</span>
                  <span className="font-extrabold text-red-600">3 Priority Flags</span>
                </div>
              </div>

              <button 
                onClick={() => alert('Geriatric AI Multi-Agent Synthesizer running across 5-year history.')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-2.5 rounded-xl shadow-xs shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>Run AI Synthesis</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. KPI Metrics Row (CivicConnect 4-Card Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-2xs transition-shadow">
            <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Active AI Risks</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">3 Flags</span>
              <span className="text-[10px] font-bold text-red-600 block mt-0.5">1 Critical · 2 Moderate</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-2xs transition-shadow">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Med Adherence</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">78%</span>
              <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">+8% vs last month</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-2xs transition-shadow">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Extracted Records</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">18 Records</span>
              <span className="text-[10px] font-bold text-blue-600 block mt-0.5">100% OCR Digitized</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-2xs transition-shadow">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Longitudinal Span</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">5 Years</span>
              <span className="text-[10px] font-bold text-purple-600 block mt-0.5">2022 – 2026 Trajectory</span>
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

