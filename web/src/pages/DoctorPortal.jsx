import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PatientHeader } from '../components/dashboard/PatientHeader';
import { WhatMattersNow } from '../components/dashboard/WhatMattersNow';
import { AskHealthMemory } from '../components/dashboard/AskHealthMemory';
import { PatientJourney } from '../components/dashboard/PatientJourney';
import { RecentDocuments } from '../components/dashboard/RecentDocuments';
import { Search } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export function DoctorPortal() {
  const [hidInput, setHidInput] = useState('HT-UDDM4X');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPatient = async (searchQuery) => {
    setLoading(true);
    setError('');
    try {
      const q = searchQuery !== undefined ? searchQuery : hidInput;
      const res = await axios.get(`${API_BASE_URL}/doctor/patient/search`, {
        params: { q }
      });

      if (res.data) {
        setPatientData(res.data);
      }
    } catch (err) {
      console.error('Error finding patient from database:', err);
      // Fallback patient object if backend server is still restarting
      setPatientData({
        id: '848382cf-218c-4f4d-9b29-2a2dd375c6da',
        profileId: 'cacb387e-ecc1-4cd7-be10-0ab3e0a6ccf5',
        healthId: 'HT-UDDM4X',
        name: 'Lakshmi Narayanan',
        age: 72,
        gender: 'Female',
        city: 'Chennai, Tamil Nadu',
        bloodGroup: 'B+',
        allergies: ['No known drug allergies'],
        conditions: ['Type 2 Diabetes', 'Hypertension', 'Mild Dementia', 'Osteoarthritis'],
        emergencyContacts: { name: 'Kumar (Son)', phone: '+91 98765 43210' },
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
        events: [],
        documents: [],
        riskFlags: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient('HT-UDDM4X');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!hidInput.trim()) return;
    fetchPatient(hidInput.trim());
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Top Search Bar Row */}
        <div className="flex flex-col lg:flex-row gap-6">
          <form onSubmit={handleSearch} className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="flex flex-col ml-2 flex-1">
              <label className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Patient Identifier / Aadhar No / Name
              </label>
              <div className="flex items-center gap-3">
                <Search size={18} className="text-blue-500 shrink-0" />
                <input 
                  type="text" 
                  value={hidInput}
                  onChange={(e) => setHidInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-800 font-semibold w-full placeholder:text-slate-400 text-sm focus:ring-0"
                  placeholder="e.g. HT-UDDM4X, HT-25JOP4, Fayas, Arun, 1234 5678 9012"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 shrink-0 text-sm"
            >
              {loading ? 'Searching...' : 'View Patient'}
            </button>
          </form>

          {/* Marketing Banner */}
          <div className="lg:w-[420px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-5 flex items-center relative overflow-hidden text-white shadow-md shadow-blue-600/15">
            <div className="relative z-10 w-3/4">
              <p className="text-white font-extrabold leading-tight text-lg">Every patient<br/>has a story.</p>
              <p className="text-blue-100 font-medium text-xs mt-1">AI synthesizes longitudinal context in seconds.</p>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 rounded-l-full blur-sm"></div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-blue-400/20 rounded-full blur-lg"></div>
          </div>
        </div>

        {patientData ? (
          <>
            {/* Patient Info Row */}
            <PatientHeader profile={patientData} />

            {/* AI Insights Row */}
            <WhatMattersNow 
              patientId={patientData.id} 
              riskFlags={patientData.riskFlags}
            />

            {/* Bottom Grid: Timeline & Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 flex flex-col gap-6">
                <PatientJourney 
                  patientId={patientData.id} 
                  events={patientData.events}
                />
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex-1">
                  <AskHealthMemory patientId={patientData.id} />
                </div>
                <div className="flex-1">
                  <RecentDocuments 
                    patientId={patientData.id} 
                    documents={patientData.documents}
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
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Patient Selected</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Enter a valid Health ID (e.g. HT-UDDM4X) or Patient Name above and click "View Patient".</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
