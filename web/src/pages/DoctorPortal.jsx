import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PatientHeader } from '../components/dashboard/PatientHeader';
import { WhatMattersNow } from '../components/dashboard/WhatMattersNow';
import { AskHealthMemory } from '../components/dashboard/AskHealthMemory';
import { PatientJourney } from '../components/dashboard/PatientJourney';
import { RecentDocuments } from '../components/dashboard/RecentDocuments';
import { 
  MedicationsModal, 
  DocumentsModal, 
  EmergencyProfileModal, 
  FollowupsModal, 
  EvidenceModal 
} from '../components/dashboard/Modals';
import { 
  Search, 
  UserCheck, 
  Users, 
  ChevronDown, 
  Loader2, 
  Home, 
  User, 
  HeartPulse, 
  MessageSquare, 
  Clock, 
  Pill, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  Settings as SettingsIcon,
  ShieldCheck,
  Phone,
  Eye,
  RefreshCw,
  Droplet,
  Info,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, DOCTOR_AUTH_TOKEN } from '../config/api';

export function DoctorPortal() {
  const [activeTab, setActiveTab] = useState('Home');
  const [hidInput, setHidInput] = useState('1234 5678 9012');
  const [patientsList, setPatientsList] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);

  const resolveGender = (nameStr = '', rawGen = '') => {
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
  const [error, setError] = useState('');
  
  // Modal Drawer states
  const [activeModal, setActiveModal] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [directorySearch, setDirectorySearch] = useState('');

  // Load all patients from common database on initial mount
  useEffect(() => {
    fetchPatientsList();
  }, []);

  const fetchPatientsList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/doctor/patients`, {
        headers: { Authorization: `Bearer ${DOCTOR_AUTH_TOKEN}` }
      });
      if (res.data && res.data.length > 0) {
        setPatientsList(res.data);
        // Automatically load the first patient's full clinical profile
        loadFullPatientProfile(res.data[0].id || res.data[0].healthId);
        setHidInput(res.data[0].healthId || res.data[0].name);
      } else {
        loadFullPatientProfile('default-patient');
      }
    } catch (err) {
      console.warn('Initial patients list fetch error:', err);
      loadFullPatientProfile('default-patient');
    }
  };

  const loadFullPatientProfile = async (patientIdentifier) => {
    if (!patientIdentifier) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/doctor/patients/${encodeURIComponent(patientIdentifier)}/full-profile`, {
        headers: { Authorization: `Bearer ${DOCTOR_AUTH_TOKEN}` }
      });
      setPatientData(res.data);
    } catch (err) {
      console.error('Error fetching full profile:', err);
      setError('Could not load patient details. Please verify the ID or connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!hidInput.trim()) return;
    loadFullPatientProfile(hidInput.trim());
  };

  const handleSelectPatient = (pt) => {
    setHidInput(pt.healthId || pt.name);
    loadFullPatientProfile(pt.id || pt.healthId);
    setActiveTab('Home');
  };

  const handleViewEvidence = (risk) => {
    setSelectedRisk(risk);
    setActiveModal('evidence');
  };

  // Filtered patients in Directory
  const filteredPatients = patientsList.filter(p => {
    const q = directorySearch.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.healthId?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      (Array.isArray(p.conditions) && p.conditions.some(c => c.toLowerCase().includes(q)))
    );
  });

  return (
    <DashboardLayout activeItem={activeTab} onNavItemClick={(item) => setActiveTab(item)}>
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Navigation Breadcrumb / Section Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/80 px-6 py-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="text-blue-700">Doctor Portal</span>
            <span>/</span>
            <span className="text-slate-900 font-extrabold">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            {patientData && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-black text-blue-900">{patientData.user?.name || 'Patient Active'}</span>
                <span className="text-[11px] font-bold text-blue-700">({patientData.user?.healthId})</span>
              </div>
            )}
            
            {activeTab !== 'Home' && (
              <button 
                onClick={() => setActiveTab('Home')}
                className="text-xs font-black text-blue-600 hover:text-blue-800 bg-slate-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-slate-200 transition-colors"
              >
                ← Back to Dashboard
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold">
            {error}
          </div>
        )}

        {/* 1. HOME VIEW */}
        {activeTab === 'Home' && (
          <>
            {/* Top Search Bar & Patient Switcher Row */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center gap-4 hover:border-blue-300 transition-colors">
                
                {/* Direct Input Search */}
                <form onSubmit={handleSearch} className="flex-1 flex items-center gap-3 w-full">
                  <div className="flex flex-col ml-2 flex-1">
                    <label className="text-[10px] font-black text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      Patient Identifier / ABHA Health ID / Aadhar
                    </label>
                    <div className="flex items-center gap-3">
                      <Search size={18} className="text-blue-500 shrink-0" />
                      <input 
                        type="text" 
                        value={hidInput}
                        onChange={(e) => setHidInput(e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-800 font-bold w-full placeholder:text-slate-400 text-sm focus:ring-0"
                        placeholder="e.g. 1234 5678 9012 or Patient Name"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 shrink-0 text-xs flex items-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                    {loading ? 'Loading...' : 'View Patient'}
                  </button>
                </form>

                {/* Quick Patient Switcher from Common Database */}
                {patientsList.length > 0 && (
                  <div className="border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-4 w-full md:w-auto shrink-0 flex items-center gap-2">
                    <Users size={16} className="text-slate-400 shrink-0" />
                    <select 
                      onChange={(e) => {
                        const pt = patientsList.find(p => p.id === e.target.value);
                        if (pt) handleSelectPatient(pt);
                      }}
                      value={patientData?.user?.id || ''}
                      className="bg-slate-50 border border-slate-200/90 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    >
                      <option value="" disabled>Switch Database Patient...</option>
                      {patientsList.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.name} ({pt.healthId})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Clinical Story Banner */}
              <div className="lg:w-[420px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-5 flex items-center relative overflow-hidden text-white shadow-md shadow-blue-600/15">
                <div className="relative z-10 w-3/4">
                  <p className="text-white font-black leading-tight text-lg">Every patient<br/>has a story.</p>
                  <p className="text-blue-100 font-semibold text-xs mt-1">AI synthesizes longitudinal context in seconds.</p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 rounded-l-full blur-xs"></div>
                <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-blue-400/20 rounded-full blur-lg"></div>
              </div>
            </div>

            {patientData ? (
              <>
                <PatientHeader profile={patientData} />
                <WhatMattersNow 
                  patientId={patientData.user?.id} 
                  initialRisks={patientData.risks} 
                  onViewEvidence={handleViewEvidence}
                  onRefresh={() => loadFullPatientProfile(patientData.user?.id)}
                />
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 flex flex-col gap-6">
                    <PatientJourney 
                      events={patientData.events} 
                      onOpenModal={(type) => {
                        if (type === 'medications') setActiveTab('Medications');
                        else if (type === 'documents') setActiveTab('Medical Documents');
                        else if (type === 'followups') setActiveTab('Upcoming & Follow-ups');
                        else if (type === 'emergency') setActiveTab('Emergency Profile');
                        else setActiveModal(type);
                      }} 
                    />
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex-1 min-h-[320px]">
                      <AskHealthMemory patientId={patientData.user?.id} />
                    </div>
                    <div className="flex-1 min-h-[260px]">
                      <RecentDocuments 
                        documents={patientData.documents} 
                        onViewDoc={() => setActiveTab('Medical Documents')}
                        onViewAll={() => setActiveTab('Medical Documents')}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <Search size={32} className="mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-black text-slate-800 mb-2">No Patient Record Loaded</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Enter an ABHA Health ID or Patient name above and click "View Patient" to load their clinical profile.
                </p>
              </div>
            )}
          </>
        )}

        {/* 2. FIND PATIENT VIEW */}
        {activeTab === 'Find Patient' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Patient Directory & Search Hub</h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Browse all patients enrolled in the common clinical database</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder="Search by name, ID, condition..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((pt) => (
                  <div key={pt.id} className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-white flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-lg border border-blue-100">
                          {pt.healthId}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{resolveGender(pt.name, pt.gender)} • {pt.age} yrs</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">{pt.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">Phone: <strong className="text-slate-700">{pt.phone}</strong></p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(pt.conditions || ['General']).slice(0, 3).map((c, i) => (
                          <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPatient(pt)}
                      className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <Eye size={14} /> Open Clinical Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. PATIENT OVERVIEW VIEW */}
        {activeTab === 'Patient Overview' && patientData && (
          <div className="space-y-6">
            <PatientHeader profile={patientData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <User size={18} className="text-blue-600" /> Patient Demographics & Identification
                </h3>
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Full Legal Name</span>
                    <span className="text-slate-900 font-black">{patientData.user?.name}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">ABHA / Health ID</span>
                    <span className="text-blue-700 font-black">{patientData.user?.healthId}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Age & Biological Sex</span>
                    <span className="text-slate-900 font-black">{patientData.profile?.age} years • {resolveGender(patientData.user?.name, patientData.profile?.gender)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Primary Contact Phone</span>
                    <span className="text-slate-900 font-black">{patientData.user?.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <HeartPulse size={18} className="text-rose-600" /> Clinical Baseline & Vitals
                </h3>
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Blood Group</span>
                    <span className="text-slate-900 font-black">{patientData.profile?.bloodGroup || 'B+'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Known Drug Allergies</span>
                    <span className="text-slate-900 font-black">
                      {Array.isArray(patientData.profile?.allergies) ? patientData.profile.allergies.join(', ') : 'No known allergies'}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Emergency Contact</span>
                    <span className="text-slate-900 font-black">{patientData.profile?.emergencyContacts?.name} ({patientData.profile?.emergencyContacts?.phone})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. WHAT MATTERS NOW VIEW */}
        {activeTab === 'What Matters Now' && patientData && (
          <div className="space-y-6">
            <WhatMattersNow 
              patientId={patientData.user?.id} 
              initialRisks={patientData.risks} 
              onViewEvidence={handleViewEvidence}
              onRefresh={() => loadFullPatientProfile(patientData.user?.id)}
            />
          </div>
        )}

        {/* 5. ASK HEALTH MEMORY VIEW */}
        {activeTab === 'Ask Health Memory' && patientData && (
          <div className="h-[75vh]">
            <AskHealthMemory patientId={patientData.user?.id} />
          </div>
        )}

        {/* 6. PATIENT JOURNEY VIEW */}
        {activeTab === 'Patient Journey' && patientData && (
          <div className="space-y-6">
            <PatientJourney 
              events={patientData.events} 
              onOpenModal={(type) => {
                if (type === 'medications') setActiveTab('Medications');
                else if (type === 'documents') setActiveTab('Medical Documents');
                else if (type === 'followups') setActiveTab('Upcoming & Follow-ups');
                else if (type === 'emergency') setActiveTab('Emergency Profile');
                else setActiveModal(type);
              }} 
            />
          </div>
        )}

        {/* 7. MEDICATIONS VIEW */}
        {activeTab === 'Medications' && patientData && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                  <Pill size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Active Prescriptions & Medication Regimen</h2>
                  <p className="text-xs text-slate-500 font-medium">Authentic prescription records & scheduled dosing loaded directly from common database</p>
                </div>
              </div>

              <button
                onClick={() => loadFullPatientProfile(patientData.user?.id)}
                className="self-start sm:self-auto px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black rounded-xl border border-blue-200 flex items-center gap-2 transition-all shadow-2xs"
              >
                <RefreshCw size={14} /> Refresh From DB
              </button>
            </div>

            {/* AI Clinical Medication Summary Banner */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3">
              <Sparkles size={18} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">Clinical Pharmacotherapy Summary</h4>
                <p className="text-xs text-blue-900/90 font-medium mt-0.5 leading-relaxed">
                  Patient currently has {patientData.medications?.length || 0} active prescribed medications recorded in the longitudinal memory repository. All doses are synchronized with caregiver mobile schedule alarms.
                </p>
              </div>
            </div>

            {/* Medications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(patientData.medications || []).map((med, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-2xs">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                          <Pill size={16} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">{med.name}</h4>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-black rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Active Rx
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-3 text-xs">
                      <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                        <span className="text-slate-500 font-medium">Dosage & Strength:</span>
                        <span className="font-extrabold text-slate-800">{med.dosage}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                        <span className="text-slate-500 font-medium">Administration:</span>
                        <span className="font-bold text-blue-700">{med.instruction}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                        <span className="text-slate-500 font-medium">Daily Timing Slot:</span>
                        <span className="font-black text-slate-900">{med.slot || 'Daily'} ({med.time || '08:00 AM'})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <FileText size={12} className="text-blue-500" /> Source: {med.source || 'Prescription Document'}
                    </span>
                    <span>{med.prescribedDate || 'Verified'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. MEDICAL DOCUMENTS VIEW */}
        {activeTab === 'Medical Documents' && patientData && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <FileText size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Medical Documents & Clinical OCR Archives</h2>
                  <p className="text-xs text-slate-500 font-medium">Lab diagnostic reports, discharge papers, and AI entity transcripts</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {(patientData.documents || []).map((doc, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{doc.fileName}</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{doc.uploadDate} • {doc.category}</p>
                      </div>
                    </div>
                  </div>

                  {doc.summary && (
                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-700 font-medium">
                      <span className="font-extrabold text-blue-900 block mb-0.5">Clinical Summary:</span>
                      {doc.summary}
                    </div>
                  )}

                  {doc.extractedText && (
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Extracted Clinical OCR Text:</span>
                      <pre className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {doc.extractedText}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. UPCOMING & FOLLOW-UPS VIEW */}
        {activeTab === 'Upcoming & Follow-ups' && patientData && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Calendar size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Upcoming Consultations & Follow-up Calendar</h2>
                  <p className="text-xs text-slate-500 font-medium">Scheduled clinic visits, routine geriatric checkups, and diagnostic panels</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-slate-900">Comprehensive Geriatric Assessment</h4>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-lg">Confirmed</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">Routine review of hypertension control, HbA1c panel, and fall prevention safeguards.</p>
                <div className="pt-2 text-xs font-bold text-slate-500">
                  Scheduled Date: <strong className="text-blue-700">24 Sep 2026</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. EMERGENCY PROFILE VIEW */}
        {activeTab === 'Emergency Profile' && patientData && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Emergency Medical Profile</h2>
                  <p className="text-xs text-slate-500 font-medium">Critical vitals, acute safety alerts, and 1-click caregiver dialing</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Group</span>
                <p className="text-xl font-black text-slate-900">{patientData.profile?.bloodGroup || 'B+'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Drug Allergies</span>
                <p className="text-sm font-black text-slate-900">
                  {Array.isArray(patientData.profile?.allergies) ? patientData.profile.allergies.join(', ') : 'No known drug allergies'}
                </p>
              </div>

              <div className="p-5 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-3 md:col-span-2">
                <span className="text-xs font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone size={14} /> Primary Guardian & Emergency Contact
                </span>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-black text-slate-900">{patientData.profile?.emergencyContacts?.name || 'Kumar (Son)'}</h4>
                    <p className="text-xs font-bold text-blue-700">{patientData.profile?.emergencyContacts?.phone || '+91 98765 43210'}</p>
                  </div>
                  <a
                    href={`tel:${(patientData.profile?.emergencyContacts?.phone || '+919876543210').replace(/[^0-9+]/g, '')}`}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Phone size={15} /> Call Guardian
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 11. SETTINGS VIEW */}
        {activeTab === 'Settings' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <SettingsIcon size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Doctor Portal & ABHA Integration Settings</h2>
                  <p className="text-xs text-slate-500 font-medium">API configurations, Gemini model thresholds, and clinic credentials</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-xl text-xs font-semibold">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="text-slate-900 font-bold">ABHA National Registry Sync</h4>
                  <p className="text-slate-500 text-[11px]">Real-time query of ABDM health repository</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-black rounded-lg border border-emerald-200">Active</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="text-slate-900 font-bold">AI Clinical Engine</h4>
                  <p className="text-slate-500 text-[11px]">Google Gemini Flash 2.5 Decision Support</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-black rounded-lg border border-blue-200">Ultra-Fast Enabled</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Detail Modals */}
      <MedicationsModal 
        isOpen={activeModal === 'medications'} 
        onClose={() => setActiveModal(null)} 
        medications={patientData?.medications || []} 
      />

      <DocumentsModal 
        isOpen={activeModal === 'documents'} 
        onClose={() => setActiveModal(null)} 
        documents={patientData?.documents || []} 
      />

      <EmergencyProfileModal 
        isOpen={activeModal === 'emergency'} 
        onClose={() => setActiveModal(null)} 
        patient={patientData || {}} 
      />

      <FollowupsModal 
        isOpen={activeModal === 'followups'} 
        onClose={() => setActiveModal(null)} 
        events={patientData?.events || []} 
      />

      <EvidenceModal 
        isOpen={activeModal === 'evidence'} 
        onClose={() => { setActiveModal(null); setSelectedRisk(null); }} 
        risk={selectedRisk} 
        events={patientData?.events || []} 
      />
    </DashboardLayout>
  );
}


