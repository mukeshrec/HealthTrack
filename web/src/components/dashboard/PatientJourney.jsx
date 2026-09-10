import React from 'react';
import { Share2, ArrowRight, Activity, FileText, Calendar, AlertTriangle, Pill } from 'lucide-react';

export function PatientJourney() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-blue-100/80 p-2 rounded-xl text-blue-700 shadow-xs">
            <Share2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Patient Journey</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">A chronological view of key health events</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1.5 hover:gap-2 transition-all bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
          View Full Timeline <ArrowRight size={14} />
        </button>
      </div>

      {/* Timeline Graph Wrapper */}
      <div className="flex-1 relative min-h-[200px] flex items-center pt-8 pb-4 overflow-x-auto">
        {/* Horizontal Line in Blue Gradient */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-indigo-500 rounded-full -mt-8"></div>
        
        {/* Years & Nodes */}
        <div className="flex justify-between w-full min-w-[600px] relative z-10 px-4 -mt-16">
          <TimelineNode year="2022" color="bg-blue-600" title="Diabetes diagnosed" subtitle="Clinic Visit" />
          <TimelineNode year="2023" color="bg-indigo-600" title="Hospitalization (Chest infection)" subtitle="Hospital Record" />
          <TimelineNode year="2024" color="bg-sky-600" title="Cognitive concerns" subtitle="Caregiver Report" />
          <TimelineNode year="2025" color="bg-blue-500" title="Mobility decline observed" subtitle="Doctor Note" />
          <TimelineNode year="2026" color="bg-rose-500" title="2 falls reported" subtitle="Caregiver Report" />
        </div>
      </div>

      {/* Bottom Nav Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-auto pt-6 border-t border-slate-100">
        <NavCard icon={Pill} color="blue" title="Medications" subtitle="View current & past medications" />
        <NavCard icon={FileText} color="sky" title="Medical Documents" subtitle="Prescriptions, reports, scans" />
        <NavCard icon={Calendar} color="indigo" title="Upcoming & Follow-ups" subtitle="Scheduled visits & tests" />
        <NavCard icon={AlertTriangle} color="red" title="Emergency Profile" subtitle="Critical info at a glance" />
      </div>
    </div>
  );
}

function TimelineNode({ year, color, title, subtitle }) {
  return (
    <div className="flex flex-col items-center relative group w-40">
      <span className={`text-xs font-black mb-3 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100`}>{year}</span>
      <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ring-2 ring-blue-100 z-10 ${color}`}></div>
      
      {/* Tooltip / Card below */}
      <div className="absolute top-10 w-[150px] bg-white border border-slate-200 rounded-xl p-3 shadow-xs group-hover:shadow-md group-hover:border-blue-300 transition-all">
        <h4 className="text-xs font-bold text-slate-800 leading-tight mb-2">{title}</h4>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
          <FileText size={10} className="text-blue-500" />
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function NavCard({ icon: Icon, color, title, subtitle }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100 group-hover:bg-blue-600 group-hover:text-white',
    sky: 'bg-sky-50 text-sky-700 border-sky-100 group-hover:bg-sky-600 group-hover:text-white',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white',
    red: 'bg-rose-50 text-rose-700 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
  };

  return (
    <button className="flex flex-col items-start p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left group bg-white">
      <div className={`p-2 rounded-xl mb-3 border transition-colors ${colorMap[color]}`}>
        <Icon size={18} />
      </div>
      <div className="flex items-center justify-between w-full mb-1">
        <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{title}</h4>
        <ArrowRight size={13} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-[10px] text-slate-500 leading-snug">{subtitle}</p>
    </button>
  );
}
