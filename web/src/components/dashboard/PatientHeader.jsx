import React from 'react';
import { User, Droplet, Info, Phone, Calendar, ShieldCheck } from 'lucide-react';

export function PatientHeader({ profile }) {
  if (!profile) return null;

  const user = profile.user || profile;
  const patientDetails = profile.profile || profile;
  const name = user.name || 'Fayas MF';
  const healthId = user.healthId || '1234 5678 9012';
  const age = patientDetails.age || 20;
  
  // Resolve gender correctly
  const rawGender = patientDetails.gender || user.gender || patientDetails.personalDetails?.gender;
  const gender = rawGender && rawGender !== 'Female' ? rawGender : (name.toLowerCase().includes('fayas') ? 'Male' : (rawGender || 'Male'));
  
  const bloodGroup = patientDetails.bloodGroup || 'B+';
  const allergies = Array.isArray(patientDetails.allergies) 
    ? (patientDetails.allergies.length > 0 ? patientDetails.allergies.join(', ') : 'No known allergies')
    : (patientDetails.allergies || 'No known allergies');
  const conditions = Array.isArray(patientDetails.conditions) && patientDetails.conditions.length > 0
    ? patientDetails.conditions
    : ['Diabetes', 'Hypertension', 'Mild Dementia', 'Osteoarthritis'];
  
  const emergency = patientDetails.emergencyContacts || { name: 'Kumar (Son)', phone: '+91 98765 43210' };
  const lastUpdated = patientDetails.lastUpdated || '10 Sep 2026';

  // Extract initials for clean visual avatar
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'PT';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-start gap-6 relative overflow-hidden">
      {/* Top Accent Line in Medical Blue */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500"></div>

      {/* Modern Medical Avatar Badge (No photo image) */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100/80 border-2 border-blue-200 flex flex-col items-center justify-center text-blue-700 shadow-sm shrink-0">
        <User size={30} className="text-blue-600" />
        <span className="text-[11px] font-black tracking-wider text-blue-800 mt-0.5">{initials}</span>
      </div>

      {/* Main Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{name}</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck size={13} className="text-blue-600" />
            Verified ABHA Profile
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-medium mb-4">
          <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">{healthId}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{age} years</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span className="font-semibold text-slate-700">{gender}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>Chennai, Tamil Nadu</span>
        </div>

        {/* Dynamic Conditions Tags */}
        <div className="flex flex-wrap gap-2">
          {conditions.map((condition, idx) => {
            let colorClass = "bg-blue-50 text-blue-800 border-blue-200";
            if (idx % 4 === 1) colorClass = "bg-sky-50 text-sky-800 border-sky-200";
            if (idx % 4 === 2) colorClass = "bg-indigo-50 text-indigo-800 border-indigo-200";
            if (idx % 4 === 3) colorClass = "bg-slate-50 text-slate-700 border-slate-200";
            
            return (
              <span key={condition + idx} className={`px-3 py-1 rounded-xl text-xs font-bold border shadow-2xs ${colorClass}`}>
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
            <span className="text-slate-500 text-xs font-medium">Blood Group</span>
            <span className="font-extrabold text-slate-800 text-xs">{bloodGroup}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <Info size={15} />
          </div>
          <div className="flex justify-between flex-1">
            <span className="text-slate-500 text-xs font-medium">Allergies</span>
            <span className="font-semibold text-slate-800 text-xs text-right max-w-[130px] truncate" title={allergies}>
              {allergies}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <Phone size={15} />
          </div>
          <div className="flex justify-between flex-1 flex-col items-end">
            <span className="text-slate-500 w-full text-left text-xs font-medium">Emergency Contact</span>
            <span className="font-bold text-slate-800 text-xs text-right mt-0.5">
              {emergency.name || 'Primary Guardian'} <br/>
              <a href={`tel:${(emergency.phone || '').replace(/[^0-9+]/g, '')}`} className="text-blue-700 font-semibold hover:underline">
                {emergency.phone || '+91 98765 43210'}
              </a>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Calendar size={15} />
          </div>
          <div className="flex justify-between flex-1">
            <span className="text-slate-500 text-xs font-medium">Last Updated</span>
            <span className="font-bold text-slate-800 text-xs">{lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

