import React from 'react';
import { User, Droplet, Info, Phone, Calendar, ShieldCheck } from 'lucide-react';

export function PatientHeader({ profile }) {
  if (!profile) return null;

  const patientName = profile.name || profile.user?.name || 'Lakshmi Narayanan';
  const healthId = profile.healthId || profile.user?.healthId || 'HT-UDDM4X';
  const age = profile.age || 72;
  const gender = profile.gender || 'Female';
  const city = profile.city || 'Chennai, Tamil Nadu';
  const bloodGroup = profile.bloodGroup || 'B+';
  const allergiesList = Array.isArray(profile.allergies) && profile.allergies.length > 0
    ? profile.allergies
    : ['No known drug allergies'];
  const conditionsList = Array.isArray(profile.conditions) && profile.conditions.length > 0
    ? profile.conditions
    : ['Type 2 Diabetes', 'Hypertension', 'Mild Dementia', 'Osteoarthritis'];
  
  const emergency = profile.emergencyContacts || {};
  const emergencyName = emergency.name || 'Kumar (Son)';
  const emergencyPhone = emergency.phone || '+91 98765 43210';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-start gap-8 relative overflow-hidden">
      {/* Subtle top-border accent in blue */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500"></div>

      {/* Avatar */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-blue-50 shrink-0 border-2 border-blue-100 shadow-md">
        <img 
          src={profile.avatarUrl || `https://i.pravatar.cc/150?u=${patientName}`} 
          alt={patientName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{patientName}</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-blue-600" />
            Verified Profile
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-medium mb-4">
          <span className="text-blue-700 font-bold bg-blue-50/70 px-2.5 py-0.5 rounded-lg border border-blue-100/80">{healthId}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{age} years</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{gender}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{city}</span>
        </div>

        {/* Conditions Tags */}
        <div className="flex flex-wrap gap-2">
          {conditionsList.map((condition, idx) => {
            let colorClass = "bg-blue-50 text-blue-800 border-blue-200";
            if (idx % 4 === 1) colorClass = "bg-sky-50 text-sky-800 border-sky-200";
            if (idx % 4 === 2) colorClass = "bg-indigo-50 text-indigo-800 border-indigo-200";
            if (idx % 4 === 3) colorClass = "bg-slate-50 text-slate-700 border-slate-200";
            
            return (
              <span key={`${condition}-${idx}`} className={`px-3 py-1 rounded-xl text-xs font-bold border shadow-xs ${colorClass}`}>
                {condition}
              </span>
            );
          })}
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 space-y-3 shrink-0">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Droplet size={15} />
          </div>
          <div className="flex justify-between flex-1">
            <span className="text-slate-500 text-xs">Blood Group</span>
            <span className="font-bold text-slate-800 text-xs">{bloodGroup}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <Info size={15} />
          </div>
          <div className="flex justify-between flex-1">
            <span className="text-slate-500 text-xs">Allergies</span>
            <span className="font-semibold text-slate-800 text-xs text-right">
              {allergiesList.join(', ')}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <Phone size={15} />
          </div>
          <div className="flex justify-between flex-1 flex-col items-end">
            <span className="text-slate-500 w-full text-left text-xs">Emergency Contact</span>
            <span className="font-bold text-slate-800 text-xs text-right mt-1">{emergencyName} <br/><span className="text-blue-700 font-semibold">{emergencyPhone}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Calendar size={15} />
          </div>
          <div className="flex justify-between flex-1">
            <span className="text-slate-500 text-xs">Last Updated</span>
            <span className="font-bold text-slate-800 text-xs">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
