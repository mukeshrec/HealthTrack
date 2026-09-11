import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PatientHeader } from '../components/dashboard/PatientHeader';
import { WhatMattersNow } from '../components/dashboard/WhatMattersNow';
import { AskHealthMemory } from '../components/dashboard/AskHealthMemory';
import { PatientJourney } from '../components/dashboard/PatientJourney';
import { RecentDocuments } from '../components/dashboard/RecentDocuments';
import { Search } from 'lucide-react';
import axios from 'axios';

export function DoctorPortal() {
  const [hidInput, setHidInput] = useState('1234 5678 9012');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Multilingual State
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  
  const languages = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'हिंदी (Hindi)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)' },
    { code: 'bn-IN', name: 'বাংলা (Bengali)' },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!hidInput.trim()) return;

    setLoading(true);
    setError('');
    try {
      // Fetch the actual patient from the backend by Aadhar No (healthId)
      const res = await axios.get(`http://localhost:3000/api/patients/by-healthid/${hidInput.trim()}`);
      setPatientData(res.data);
    } catch (err) {
      console.error('Error finding patient', err);
      setError('Patient not found with that Aadhar No.');
      setPatientData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Top Search Bar Row */}
        <div className="flex gap-6">
          <form onSubmit={handleSearch} className="flex-1 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex items-center gap-4">
            <div className="flex flex-col ml-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Enter Patient Aadhar No</label>
              <div className="flex items-center gap-3">
                <Search size={18} className="text-slate-400" />
                <input 
                  type="text" 
                  value={hidInput}
                  onChange={(e) => setHidInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-800 font-medium w-[300px] placeholder:text-slate-300"
                  placeholder="e.g. 1234 5678 9012"
                />
              </div>
              {error && <span className="text-red-500 text-xs font-bold mt-1">{error}</span>}
            </div>
            
            {/* Language Selector */}
            <div className="ml-auto mr-4 flex flex-col items-end">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Translate AI Insights</label>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none font-medium"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'View Patient'}
            </button>
          </form>

          {/* Marketing Banner */}
          <div className="w-[400px] bg-blue-50 rounded-2xl border border-blue-100 p-5 flex items-center relative overflow-hidden">
            <div className="relative z-10 w-2/3">
              <p className="text-blue-900 font-bold leading-tight text-lg">Every patient<br/>has a story.</p>
              <p className="text-blue-700 font-medium text-sm mt-1">You see the bigger picture.</p>
            </div>
            {/* Using a placeholder for the doctor/patient image in the banner */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-blue-200/50 backdrop-blur-sm rounded-l-full mix-blend-multiply"></div>
          </div>
        </div>

        {patientData ? (
          <>
            {/* Patient Info Row */}
            <PatientHeader profile={patientData} />

            {/* AI Insights Row */}
            <WhatMattersNow patientId={patientData.id} language={selectedLanguage} />

            {/* Bottom Grid: Timeline & Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 flex flex-col gap-6">
                <PatientJourney />
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex-1">
                  <AskHealthMemory patientId={patientData.id} language={selectedLanguage} />
                </div>
                <div className="flex-1">
                  <RecentDocuments />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Patient Selected</h3>
            <p className="text-slate-500">Enter a valid Aadhar No above and click "View Patient" to load their clinical profile.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
