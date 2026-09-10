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
import { Search, UserCheck, Users, ChevronDown, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, DOCTOR_AUTH_TOKEN } from '../config/api';

export function DoctorPortal() {
  const [hidInput, setHidInput] = useState('1234 5678 9012');
  const [patientsList, setPatientsList] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal Drawer states
  const [activeModal, setActiveModal] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);

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
        // Fallback default load
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

  const handleSelectPatientFromDropdown = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const pt = patientsList.find(p => p.id === selectedId || p.healthId === selectedId);
    if (pt) {
      setHidInput(pt.healthId || pt.name);
      loadFullPatientProfile(selectedId);
    }
  };

  const handleViewEvidence = (risk) => {
    setSelectedRisk(risk);
    setActiveModal('evidence');
  };

  return (
    <DashboardLayout onNavigate={(tab) => {
      if (tab === 'records') setActiveModal('documents');
      if (tab === 'prescriptions') setActiveModal('medications');
      if (tab === 'schedule') setActiveModal('followups');
    }}>
      <div className="max-w-[1600px] mx-auto space-y-6">
        
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
                  onChange={handleSelectPatientFromDropdown}
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

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold">
            {error}
          </div>
        )}

        {patientData ? (
          <>
            {/* Patient Header Row */}
            <PatientHeader profile={patientData} />

            {/* AI Insights Row */}
            <WhatMattersNow 
              patientId={patientData.user?.id} 
              initialRisks={patientData.risks} 
              onViewEvidence={handleViewEvidence}
              onRefresh={() => loadFullPatientProfile(patientData.user?.id)}
            />

            {/* Bottom Grid: Longitudinal Timeline & Interactive Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 flex flex-col gap-6">
                <PatientJourney 
                  events={patientData.events} 
                  onOpenModal={(type) => setActiveModal(type)} 
                />
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex-1 min-h-[320px]">
                  <AskHealthMemory patientId={patientData.user?.id} />
                </div>
                <div className="flex-1 min-h-[260px]">
                  <RecentDocuments 
                    documents={patientData.documents} 
                    onViewDoc={() => setActiveModal('documents')}
                    onViewAll={() => setActiveModal('documents')}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">No Patient Record Loaded</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Enter a valid Patient Health ID or Aadhar number above and click "View Patient" to load their complete clinical profile.
            </p>
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

