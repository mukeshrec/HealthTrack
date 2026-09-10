import React, { useState } from 'react';
import { Search, Bell, Activity, ShieldAlert, Zap, HeartPulse, ChevronDown, CheckCircle2 } from 'lucide-react';

export function TopNav() {
  const [activePortal, setActivePortal] = useState('doctor');

  const portalOptions = [
    { id: 'patient', label: 'Patient View' },
    { id: 'doctor', label: 'Doctor Portal' },
    { id: 'caregiver', label: 'Caregiver Dashboard' },
    { id: 'hospital', label: 'Hospital Records' },
  ];

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 sticky top-0 z-30 w-full flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <HeartPulse size={22} className="stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-blue-800 to-teal-700 bg-clip-text text-transparent">
              CuraTrack
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded border border-blue-200/60">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Longitudinal Health Memory</p>
        </div>
      </div>

      {/* Center Segmented Portal Switcher (Reference 2 style) */}
      <div className="hidden lg:flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 shadow-inner">
        {portalOptions.map((portal) => {
          const isActive = activePortal === portal.id;
          return (
            <button
              key={portal.id}
              onClick={() => setActivePortal(portal.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 translate-y-[-0.5px]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {portal.label}
            </button>
          );
        })}
      </div>

      {/* Right Actions (Reference 1 & 2 combination) */}
      <div className="flex items-center gap-3.5">
        {/* Offline Ready Status */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/70 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Zap size={13} className="text-emerald-600" />
          <span>OFFLINE READY</span>
        </div>

        {/* SOS Emergency Button */}
        <button 
          onClick={() => alert('SOS Alert Triggered: Emergency Geriatric Response team & on-call physician notified.')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl text-xs font-extrabold shadow-sm shadow-red-500/30 transition-all active:scale-95"
        >
          <ShieldAlert size={15} />
          <span>SOS</span>
        </button>

        <div className="w-px h-6 bg-slate-200 mx-0.5"></div>

        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 relative transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Doctor Profile Pill */}
        <div className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            AM
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
              Dr. Arjun Mehta <span className="text-[10px]">✨</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Chief Geriatrician</div>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
