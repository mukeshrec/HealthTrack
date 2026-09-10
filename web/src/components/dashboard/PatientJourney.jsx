import React from 'react';
import { Share2, ArrowRight, Activity, FileText, Calendar, AlertTriangle, Pill } from 'lucide-react';

export function PatientJourney() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-indigo-50 p-1.5 rounded-lg text-indigo-600 border border-indigo-100">
            <Share2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Patient Journey</h3>
            <p className="text-sm text-slate-500">A chronological view of key health events</p>
          </div>
        </div>
        <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
          View Full Timeline <ArrowRight size={16} />
        </button>
      </div>

      {/* Timeline Graph Wrapper */}
      <div className="flex-1 relative min-h-[200px] flex items-center pt-8 pb-4 overflow-x-auto">
        {/* Horizontal Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -mt-8"></div>
        
        {/* Years & Nodes */}
        <div className="flex justify-between w-full min-w-[600px] relative z-10 px-4 -mt-16">
          <TimelineNode year="2022" color="bg-blue-500" title="Diabetes diagnosed" subtitle="Clinic Visit" />
          <TimelineNode year="2023" color="bg-purple-500" title="Hospitalization (Chest infection)" subtitle="Hospital Record" />
          <TimelineNode year="2024" color="bg-green-500" title="Cognitive concerns" subtitle="Caregiver Report" />
          <TimelineNode year="2025" color="bg-orange-500" title="Mobility decline observed" subtitle="Doctor Note" />
          <TimelineNode year="2026" color="bg-red-500" title="2 falls reported" subtitle="Caregiver Report" />
        </div>
      </div>

      {/* Bottom Nav Cards */}
      <div className="grid grid-cols-4 gap-3 mt-auto pt-6 border-t border-slate-100">
        <NavCard icon={Pill} color="purple" title="Medications" subtitle="View current & past medications" />
        <NavCard icon={FileText} color="emerald" title="Medical Documents" subtitle="Prescriptions, reports, scans and more" />
        <NavCard icon={Calendar} color="blue" title="Upcoming & Follow-ups" subtitle="Scheduled visits and pending tests" />
        <NavCard icon={AlertTriangle} color="red" title="Emergency Profile" subtitle="Critical information at a glance" />
      </div>
    </div>
  );
}

function TimelineNode({ year, color, title, subtitle }) {
  return (
    <div className="flex flex-col items-center relative group w-40">
      <span className={`text-sm font-bold mb-3 ${color.replace('bg-', 'text-')}`}>{year}</span>
      <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10 ${color}`}></div>
      
      {/* Tooltip / Card below */}
      <div className="absolute top-10 w-[150px] bg-white border border-slate-200 rounded-lg p-3 shadow-sm group-hover:shadow-md transition-shadow">
        <h4 className="text-xs font-bold text-slate-800 leading-tight mb-2">{title}</h4>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
          <FileText size={10} />
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function NavCard({ icon: Icon, color, title, subtitle }) {
  const colorMap = {
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <button className="flex flex-col items-start p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left group bg-white">
      <div className={`p-2 rounded-lg mb-3 border ${colorMap[color]}`}>
        <Icon size={18} />
      </div>
      <div className="flex items-center justify-between w-full mb-1">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <ArrowRight size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
      </div>
      <p className="text-[10px] text-slate-500 leading-snug">{subtitle}</p>
    </button>
  );
}
