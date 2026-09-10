import React from 'react';
import { Share2, ArrowRight, Activity, FileText, Calendar, AlertTriangle, Pill, Clock } from 'lucide-react';

export function PatientJourney({ events = [], onOpenModal }) {
  // Sort events chronologically if provided
  const displayEvents = events && events.length > 0 ? events : [
    { year: '2022', formattedDate: '15 Mar 2022', title: 'Diabetes diagnosed', subtitle: 'Clinic Visit', description: 'Diagnosed with Type 2 Diabetes; started Metformin 500mg.' },
    { year: '2023', formattedDate: '08 Nov 2023', title: 'Hospitalization (Chest infection)', subtitle: 'Hospital Record', description: 'Admitted for acute bronchopneumonia, treated with IV antibiotics.' },
    { year: '2024', formattedDate: '14 May 2024', title: 'Cognitive concerns', subtitle: 'Caregiver Report', description: 'Caregiver noted occasional memory lapses and orientation difficulty.' },
    { year: '2025', formattedDate: '22 Feb 2025', title: 'Mobility decline observed', subtitle: 'Doctor Note', description: 'Gait instability and knee osteoarthritis progression noted.' },
    { year: '2026', formattedDate: '12 Aug 2026', title: '2 falls reported', subtitle: 'Caregiver Report', description: 'Two non-syncopal falls occurred at bathroom entrance over 30 days.' }
  ];

  const nodeColors = [
    'bg-blue-600',
    'bg-indigo-600',
    'bg-sky-600',
    'bg-blue-500',
    'bg-rose-500',
    'bg-purple-600',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-blue-100/80 p-2 rounded-xl text-blue-700 shadow-2xs">
            <Share2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Patient Journey</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Chronological timeline of longitudinal clinical records & caregiver logs</p>
          </div>
        </div>
        <button 
          onClick={() => onOpenModal && onOpenModal('documents')}
          className="text-blue-700 hover:text-blue-800 font-bold text-xs flex items-center gap-1.5 hover:gap-2 transition-all bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs"
        >
          View Records <ArrowRight size={14} />
        </button>
      </div>

      {/* Timeline Graph Wrapper */}
      <div className="relative min-h-[220px] flex items-center pt-8 pb-4 overflow-x-auto my-auto scrollbar-thin">
        {/* Horizontal Line in Blue Gradient */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-indigo-400 to-sky-500 rounded-full -mt-10"></div>
        
        {/* Years & Nodes */}
        <div className="flex justify-between w-full min-w-[650px] relative z-10 px-4 -mt-16 gap-3">
          {displayEvents.slice(0, 5).map((ev, idx) => (
            <TimelineNode 
              key={ev.id || idx}
              year={ev.year || (ev.eventDate ? new Date(ev.eventDate).getFullYear() : '2026')} 
              color={nodeColors[idx % nodeColors.length]} 
              title={ev.title} 
              subtitle={ev.eventType || ev.subtitle || 'Health Record'}
              description={ev.description}
            />
          ))}
        </div>
      </div>

      {/* Bottom Nav Cards - Interactive with Modals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
        <NavCard 
          icon={Pill} 
          color="blue" 
          title="Medications" 
          subtitle="View active Rx & schedules" 
          onClick={() => onOpenModal && onOpenModal('medications')}
        />
        <NavCard 
          icon={FileText} 
          color="sky" 
          title="Medical Documents" 
          subtitle="Prescriptions & lab OCR" 
          onClick={() => onOpenModal && onOpenModal('documents')}
        />
        <NavCard 
          icon={Calendar} 
          color="indigo" 
          title="Upcoming & Follow-ups" 
          subtitle="Consults & test calendar" 
          onClick={() => onOpenModal && onOpenModal('followups')}
        />
        <NavCard 
          icon={AlertTriangle} 
          color="red" 
          title="Emergency Profile" 
          subtitle="Critical info & 1-click call" 
          onClick={() => onOpenModal && onOpenModal('emergency')}
        />
      </div>
    </div>
  );
}

function TimelineNode({ year, color, title, subtitle, description }) {
  return (
    <div className="flex flex-col items-center relative group w-44 shrink-0">
      <span className="text-xs font-black mb-3 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
        {year}
      </span>
      <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ring-3 ring-blue-100/80 z-10 ${color} group-hover:scale-125 transition-transform`}></div>
      
      {/* Node Content Card below */}
      <div className="absolute top-10 w-[160px] bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs group-hover:shadow-md group-hover:border-blue-300 transition-all text-left">
        <h4 className="text-xs font-black text-slate-800 leading-snug mb-1.5 line-clamp-2" title={title}>
          {title}
        </h4>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100/90 truncate">
          <FileText size={10} className="text-blue-600 shrink-0" />
          <span className="truncate">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

function NavCard({ icon: Icon, color, title, subtitle, onClick }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-600 group-hover:text-white',
    sky: 'bg-sky-50 text-sky-700 border-sky-200 group-hover:bg-sky-600 group-hover:text-white',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white',
    red: 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
  };

  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-start p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all text-left group bg-white active:scale-[0.98]"
    >
      <div className={`p-2.5 rounded-xl mb-3 border transition-colors ${colorMap[color]}`}>
        <Icon size={18} />
      </div>
      <div className="flex items-center justify-between w-full mb-1">
        <h4 className="text-xs font-black text-slate-800 group-hover:text-blue-700 transition-colors">{title}</h4>
        <ArrowRight size={13} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-[10px] text-slate-500 font-medium leading-snug">{subtitle}</p>
    </button>
  );
}

