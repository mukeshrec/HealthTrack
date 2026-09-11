import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  FileText, 
  Pill, 
  Bot, 
  User, 
  Phone, 
  Droplet, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Stethoscope, 
  HeartPulse,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, DOCTOR_AUTH_TOKEN, FALLBACK_PATIENT, resolveGender } from './config/api';
import { PatientSearch } from './components/PatientSearch';
import { HealthRecords } from './components/HealthRecords';
import { MedicationsList } from './components/MedicationsList';
import { DoctorChatbot } from './components/DoctorChatbot';

export function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(FALLBACK_PATIENT);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Load patients list on mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/doctor/patients`, {
        headers: { Authorization: `Bearer ${DOCTOR_AUTH_TOKEN}` },
        timeout: 5000
      });

      if (res.data && res.data.length > 0) {
        setPatients(res.data);
        setIsLiveConnected(true);
        // Load details for first patient
        loadPatientDetails(res.data[0].id || res.data[0].healthId);
      } else {
        setPatients([FALLBACK_PATIENT]);
      }
    } catch (err) {
      console.warn('Using local clinical patient data:', err.message);
      setPatients([
        {
          id: '848382cf-218c-4f4d-9b29-2a2dd375c6da',
          name: 'Fayas MF',
          healthId: '1234 5678 9012',
          phone: '+91 98765 43210',
          age: 68,
          gender: 'Male',
          conditions: ['Type 2 Diabetes', 'Hypertension', 'Mild Dementia', 'Osteoarthritis']
        },
        {
          id: 'f4ef3d2a-18e3-4be4-bbab-5d0be485e464',
          name: 'Arun',
          healthId: 'HT-25JOP4',
          phone: '+91 98401 23456',
          age: 72,
          gender: 'Male',
          conditions: ['Hypertension', 'Type 2 Diabetes']
        },
        {
          id: '76d365bf-8154-486b-84e7-348f9bf86a04',
          name: 'Mukesh V',
          healthId: 'HT-882910',
          phone: '+91 98765 11223',
          age: 65,
          gender: 'Male',
          conditions: ['Hypertension']
        }
      ]);
      setSelectedPatient(FALLBACK_PATIENT);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientDetails = async (patientIdentifier) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/doctor/patients/${encodeURIComponent(patientIdentifier)}/full-profile`, {
        headers: { Authorization: `Bearer ${DOCTOR_AUTH_TOKEN}` },
        timeout: 5000
      });
      if (res.data && (res.data.user || res.data.profile)) {
        setSelectedPatient(res.data);
      }
    } catch (err) {
      console.warn('Profile load note:', err.message);
    }
  };

  const handleSelectPatient = (pt) => {
    const targetId = pt.id || pt.userId || pt.healthId || pt.name;
    loadPatientDetails(targetId);
    setSelectedPatient((prev) => ({
      ...prev,
      id: pt.id || pt.userId || targetId,
      user: {
        id: pt.id || pt.userId || targetId,
        name: pt.name || pt.user?.name || 'Patient',
        healthId: pt.healthId || pt.user?.healthId || 'HT-000000',
        phone: pt.phone || pt.user?.phone || '+91 98765 43210',
        role: 'patient'
      },
      profile: {
        ...prev.profile,
        age: pt.age || pt.profile?.age || 72,
        gender: resolveGender(pt.name || pt.user?.name, pt.gender || pt.profile?.gender),
        conditions: pt.conditions || prev.profile?.conditions || ['General Care']
      }
    }));
  };

  // Safe extractions
  const userName = selectedPatient.user?.name || selectedPatient.name || 'Arun Kumar';
  const userHealthId = selectedPatient.user?.healthId || selectedPatient.healthId || 'HT-984210';
  const rawGender = selectedPatient.profile?.gender || selectedPatient.gender;
  const userGender = resolveGender(userName, rawGender);
  const userAge = selectedPatient.profile?.age || selectedPatient.age || 72;
  const userPhone = selectedPatient.user?.phone || selectedPatient.phone || '+91 98401 23456';
  const userBlood = selectedPatient.profile?.bloodGroup || 'O+';
  const userAllergies = selectedPatient.profile?.allergies || ['Penicillin', 'Sulfa drugs'];
  const userConditions = selectedPatient.profile?.conditions || selectedPatient.profile?.existingConditions || ['Type 2 Diabetes', 'Hypertension'];
  const documents = selectedPatient.documents || FALLBACK_PATIENT.documents;
  const medications = selectedPatient.medications || FALLBACK_PATIENT.medications;
  const events = selectedPatient.events || FALLBACK_PATIENT.events;

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'PT';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Stethoscope size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 tracking-tight">HealthTrack</h1>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-md border border-blue-200">
                  Doctor Clinical Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold">Decision Support & Longitudinal Health Memory</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
              <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`}></span>
              <span>{isLiveConnected ? 'Live Database Sync' : 'Ready (Local Cache)'}</span>
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                DR
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-slate-900">Dr. Arjun Mehta</p>
                <p className="text-[10px] text-slate-500 font-semibold">Consultant Geriatrician</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Active Patient Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-400"></div>

          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 flex flex-col items-center justify-center text-blue-700 shadow-xs shrink-0">
              <User size={26} className="text-blue-600" />
              <span className="text-[11px] font-black text-blue-900 tracking-wider mt-0.5">{initials}</span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-black text-slate-900">{userName}</h2>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-lg border border-blue-100 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-blue-600" /> Verified ABHA
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-slate-500 font-semibold">
                <span className="text-blue-700 font-bold bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100">{userHealthId}</span>
                <span>•</span>
                <span className="text-slate-800 font-black">{userGender}</span>
                <span>•</span>
                <span>{userAge} years</span>
                <span>•</span>
                <span className="text-slate-700 flex items-center gap-1"><Phone size={11} /> {userPhone}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {userConditions.map((cond, i) => (
                  <span key={i} className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex-1 lg:flex-none min-w-[120px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Group</span>
              <span className="text-sm font-black text-slate-900 flex items-center gap-1 mt-0.5">
                <Droplet size={14} className="text-rose-600" /> {userBlood}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex-1 lg:flex-none min-w-[140px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drug Allergies</span>
              <span className="text-xs font-bold text-rose-700 truncate max-w-[140px] block mt-0.5" title={Array.isArray(userAllergies) ? userAllergies.join(', ') : userAllergies}>
                {Array.isArray(userAllergies) ? userAllergies.join(', ') : userAllergies}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('Search')}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Search size={14} /> Switch Patient
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'Overview', label: 'Clinical Overview', icon: Activity },
            { id: 'Search', label: 'Find & Search Patients', icon: Search },
            { id: 'Records', label: 'Extracted Health Records', icon: FileText },
            { id: 'Medications', label: 'Active Medications', icon: Pill },
            { id: 'Chatbot', label: 'Health Memory AI (Caregiver Bot)', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 border border-slate-200'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Views */}

        {/* 1. CLINICAL OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Records Snapshot */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <FileText size={16} className="text-blue-600" /> Extracted Documents
                  </h3>
                  <button onClick={() => setActiveTab('Records')} className="text-xs font-bold text-blue-600 hover:underline">
                    View All ({documents.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {documents.slice(0, 3).map((d, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <p className="font-bold text-slate-900 truncate">{d.fileName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{d.category} • {d.documentDate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Medications Snapshot */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Pill size={16} className="text-indigo-600" /> Active Prescriptions
                  </h3>
                  <button onClick={() => setActiveTab('Medications')} className="text-xs font-bold text-blue-600 hover:underline">
                    View All ({medications.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {medications.slice(0, 3).map((m, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-[11px] text-slate-500">{m.schedule}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-md">
                        {m.dosage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Chatbot Prompt Card */}
              <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-5 text-white shadow-md shadow-blue-500/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                      <Bot size={18} className="text-cyan-300" />
                    </div>
                    <h3 className="text-sm font-black">Ask Health Memory</h3>
                  </div>
                  <p className="text-xs text-blue-100 font-medium leading-relaxed">
                    Have questions about {userName}'s medication changes, falls, or doctor notes? Ask the caregiver clinical bot.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('Chatbot')}
                  className="mt-4 w-full py-2.5 bg-white hover:bg-blue-50 text-blue-900 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Bot size={15} /> Launch Clinical Assistant
                </button>
              </div>
            </div>

            {/* Embedded Extracted Health Records */}
            <HealthRecords documents={documents} events={events} patientName={userName} />

            {/* Embedded Medications List */}
            <MedicationsList medications={medications} allergies={userAllergies} patientName={userName} />
          </div>
        )}

        {/* 2. PATIENT SEARCH TAB */}
        {activeTab === 'Search' && (
          <PatientSearch
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={(pt) => {
              handleSelectPatient(pt);
              setActiveTab('Overview');
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* 3. EXTRACTED HEALTH RECORDS TAB */}
        {activeTab === 'Records' && (
          <HealthRecords documents={documents} events={events} patientName={userName} />
        )}

        {/* 4. ACTIVE MEDICATIONS TAB */}
        {activeTab === 'Medications' && (
          <MedicationsList medications={medications} allergies={userAllergies} patientName={userName} />
        )}

        {/* 5. CLINICAL CAREGIVER-GRADE CHATBOT TAB */}
        {activeTab === 'Chatbot' && (
          <DoctorChatbot patientId={selectedPatient.user?.id || selectedPatient.id} patientName={userName} />
        )}

      </main>
    </div>
  );
}
export default App;
