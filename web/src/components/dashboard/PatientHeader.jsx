import React from 'react';
import { 
  User, 
  Droplet, 
  Info, 
  Phone, 
  Calendar, 
  QrCode, 
  Activity, 
  Heart, 
  Wind, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function PatientHeader({ profile }) {
  if (!profile) return null;

  const patientName = profile.user?.name || 'Lakshmi Narayanan';
  const healthId = profile.user?.healthId || 'HT-2024-89321';
  const age = profile.age || 78;
  const gender = profile.gender || 'Female';
  const bloodGroup = profile.bloodGroup || 'O+';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Patient Hero Card (Reference 2 style) */}
      <div className="lg:col-span-4 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md shadow-blue-700/20 relative overflow-hidden flex flex-col justify-between">
        {/* Background Subtle Wave Accents */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-teal-400/10 rounded-full blur-xl pointer-events-none"></div>

        <div>
          {/* Header Info with Avatar & QR Scan */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 p-0.5 backdrop-blur-md border border-white/30 shadow-inner flex items-center justify-center shrink-0">
                <img 
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"} 
                  alt={patientName}
                  className="w-full h-full rounded-2xl object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight text-white leading-snug">
                    {patientName}
                  </h2>
                </div>
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  {age} yrs · {gender} · Blood: <span className="font-bold text-white">{bloodGroup}</span>
                </p>
              </div>
            </div>

            {/* Health ID Badge */}
            <div className="px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/25 rounded-xl text-[11px] font-bold text-white tracking-wider flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {healthId}
            </div>
          </div>

          {/* Emergency QR Scan Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white rounded-xl text-slate-800 shadow-sm">
                <QrCode size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Emergency QR Profile</div>
                <div className="text-[10px] text-blue-100">Scan for instant paramedic vitals</div>
              </div>
            </div>
            <button className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-bold text-white border border-white/30 transition-colors">
              View
            </button>
          </div>

          {/* 2x2 Frosted Vitals Grid (Reference 2 style) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-900/30 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex flex-col">
              <span className="text-lg font-black text-white tracking-tight">124/82</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-200 mt-0.5">
                <Activity size={12} className="text-blue-300" />
                <span>BP MMHG</span>
              </div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex flex-col">
              <span className="text-lg font-black text-white tracking-tight">7.2</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-teal-200 mt-0.5">
                <Droplet size={12} className="text-teal-300" />
                <span>HBA1C %</span>
              </div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex flex-col">
              <span className="text-lg font-black text-white tracking-tight">78</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-rose-200 mt-0.5">
                <Heart size={12} className="text-rose-300" />
                <span>BPM PULSE</span>
              </div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex flex-col">
              <span className="text-lg font-black text-white tracking-tight">98%</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-200 mt-0.5">
                <Wind size={12} className="text-cyan-300" />
                <span>SPO2 OXYGEN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Guardian Contact footer */}
        <div className="mt-5 pt-3.5 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
          <div className="flex items-center gap-1.5">
            <Phone size={13} className="text-emerald-300" />
            <span>Guardian: <strong>Anand Devi (+91 98765 43210)</strong></span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Verified</span>
        </div>
      </div>

      {/* Right Overview & Clinical Conditions (Reference 1 & 2 combination) */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
        <div>
          {/* Top Row: Adherence Indicator & Clinical Tags */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Diagnoses:</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>78% Medication Adherence Today</span>
            </div>
          </div>

          {/* Active Clinical Conditions Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { name: 'Type 2 Diabetes Mellitus', color: 'bg-red-50 text-red-700 border-red-200' },
              { name: 'Essential Hypertension', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { name: 'Mild Cognitive Decline', color: 'bg-purple-50 text-purple-700 border-purple-200' },
              { name: 'Severe Osteoarthritis (Knee)', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            ].map((cond) => (
              <span key={cond.name} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${cond.color} shadow-2xs`}>
                {cond.name}
              </span>
            ))}
          </div>

          {/* Allergies & Drug Contraindications (Reference 2 style) */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertCircle size={15} className="text-red-500" />
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Documented Allergies:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Penicillin', 'Aspirin (High Bleeding Risk)', 'Shellfish'].map((allergy) => (
                <span key={allergy} className="px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  ⚠️ {allergy}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Longitudinal Care Synopsis Footer */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Primary Physician</span>
            <span className="font-extrabold text-slate-800">Dr. Arjun Mehta, MD</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Assigned Hospital</span>
            <span className="font-extrabold text-slate-800">Sunrise Multi-Speciality</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Caregiver</span>
            <span className="font-extrabold text-slate-800">Nainika (Primary)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Last Synchronized</span>
            <span className="font-extrabold text-slate-800">11 Sep 2026, 03:40 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
