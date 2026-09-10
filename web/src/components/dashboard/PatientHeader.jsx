import React from 'react';
import { User, Droplet, Info, Phone, Calendar, ShieldCheck } from 'lucide-react';

export function PatientHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-start gap-8 relative overflow-hidden">
      {/* Subtle top-border accent in blue */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500"></div>

      {/* Avatar */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-blue-50 shrink-0 border-2 border-blue-100 shadow-md">
        <img 
          src={profile.avatarUrl || "https://i.pravatar.cc/150?img=47"} 
          alt={profile.user?.name || "Patient Avatar"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile.user?.name || 'Unknown Patient'}</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-blue-600" />
            Verified Profile
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-medium mb-4">
          <span className="text-blue-700 font-bold bg-blue-50/70 px-2.5 py-0.5 rounded-lg border border-blue-100/80">{profile.user?.healthId || 'N/A'}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{profile.age || 78} years</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{profile.gender || 'Female'}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>Chennai, Tamil Nadu</span>
        </div>

        {/* Conditions Tags */}
        <div className="flex flex-wrap gap-2">
          {['Diabetes', 'Hypertension', 'Mild Dementia', 'Osteoarthritis'].map((condition, idx) => {
            let colorClass = "bg-blue-50 text-blue-800 border-blue-200";
            if (idx === 1) colorClass = "bg-sky-50 text-sky-800 border-sky-200";
            if (idx === 2) colorClass = "bg-indigo-50 text-indigo-800 border-indigo-200";
            if (idx === 3) colorClass = "bg-slate-50 text-slate-700 border-slate-200";
            
            return (
              <span key={condition} className={`px-3 py-1 rounded-xl text-xs font-bold border shadow-xs ${colorClass}`}>
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
            <span className="font-bold text-slate-800 text-xs">B+</span>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <Info size={15} />
          </div>
          <div className="flex justify-between flex-1">
            <span className="text-slate-500 text-xs">Allergies</span>
            <span className="font-semibold text-slate-800 text-xs text-right">No known allergies</span>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <Phone size={15} />
          </div>
          <div className="flex justify-between flex-1 flex-col items-end">
            <span className="text-slate-500 w-full text-left text-xs">Emergency Contact</span>
            <span className="font-bold text-slate-800 text-xs text-right mt-1">Kumar (Son) <br/><span className="text-blue-700 font-semibold">+91 98765 43210</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Calendar size={15} />
          </div>
          <div className="flex justify-between flex-1">
            <span className="text-slate-500 text-xs">Last Updated</span>
            <span className="font-bold text-slate-800 text-xs">10 Sep 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
