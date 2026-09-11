import React from 'react';
import { User, Droplet, Info, Phone, Calendar } from 'lucide-react';

export function PatientHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-start gap-8">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 shrink-0 border-4 border-white shadow-md">
        <img 
          src={profile.avatarUrl || "https://i.pravatar.cc/150?img=47"} 
          alt={profile.user?.name || "Patient Avatar"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-slate-800">{profile.user?.name || 'Unknown Patient'}</h2>
          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
            Active Patient
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mb-4">
          <span className="text-slate-700 font-semibold">Aadhar No: {profile.user?.healthId || 'N/A'}</span>
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
            // Give different colors to different conditions based on the mockup
            let colorClass = "bg-red-50 text-red-700 border-red-100";
            if (idx === 1) colorClass = "bg-blue-50 text-blue-700 border-blue-100";
            if (idx === 2) colorClass = "bg-purple-50 text-purple-700 border-purple-100";
            if (idx === 3) colorClass = "bg-slate-50 text-slate-700 border-slate-200";
            
            return (
              <span key={condition} className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
                {condition}
              </span>
            );
          })}
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="w-64 border-l border-slate-100 pl-8 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Droplet size={16} className="text-slate-400 shrink-0" />
          <div className="flex justify-between flex-1">
            <span className="text-slate-500">Blood Group</span>
            <span className="font-semibold text-slate-800">B+</span>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div className="flex justify-between flex-1">
            <span className="text-slate-500">Allergies</span>
            <span className="font-semibold text-slate-800 text-right">No known allergies</span>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div className="flex justify-between flex-1 flex-col items-end">
            <span className="text-slate-500 w-full text-left">Emergency Contact</span>
            <span className="font-semibold text-slate-800 text-right mt-1">Kumar (Son) <br/>+91 98765 43210</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar size={16} className="text-slate-400 shrink-0" />
          <div className="flex justify-between flex-1">
            <span className="text-slate-500">Last Updated</span>
            <span className="font-semibold text-slate-800">10 Sep 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
