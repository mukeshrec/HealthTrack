import React, { useState } from 'react';
import { 
  Share2, 
  ArrowRight, 
  Activity, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  Pill, 
  Clock, 
  Stethoscope,
  Building2,
  CheckCircle2
} from 'lucide-react';

export function PatientJourney() {
  const [activeFilter, setActiveFilter] = useState('All');

  const timelineEvents = [
    {
      year: '2022',
      date: '14 May 2022',
      type: 'Consultation',
      icon: Stethoscope,
      color: 'blue',
      title: 'Type 2 Diabetes Mellitus Diagnosed',
      doctor: 'Dr. S. Mehta · Diabetology',
      summary: 'HbA1c: 8.4%. Initiated Metformin 500mg BID. Recommended lifestyle modification.',
      source: 'Clinic Record'
    },
    {
      year: '2023',
      date: '10 Nov 2023',
      type: 'Hospitalization',
      icon: Building2,
      color: 'purple',
      title: 'Acute Chest Infection & Bronchitis',
      doctor: 'Sunrise Hospital · Pulmonology',
      summary: 'Admitted for 4 days. IV Antibiotics course completed. Oxygen saturation stabilized at 98%.',
      source: 'Discharge Summary'
    },
    {
      year: '2024',
      date: '18 Jun 2024',
      type: 'Cognitive Concern',
      icon: Activity,
      color: 'emerald',
      title: 'Mild Cognitive Fatigue & Memory Lapses',
      doctor: 'Caregiver Observation Log',
      summary: 'Family noted occasional forgetfulness of medication times and appointments. MMSE score: 26/30.',
      source: 'Caregiver Report'
    },
    {
      year: '2025',
      date: '22 Jan 2025',
      type: 'Mobility',
      icon: Clock,
      color: 'amber',
      title: 'Knee Osteoarthritis & Gait Instability',
      doctor: 'Dr. Ramesh Kumar · Orthopedics',
      summary: 'Bilateral knee joint space narrowing. Prescribed physiotherapy and walking stick support.',
      source: 'Physiotherapy Note'
    },
    {
      year: '2026',
      date: '12 Aug 2026',
      type: 'Fall Risk',
      icon: AlertTriangle,
      color: 'red',
      title: '2 Unassisted Falls in Bathroom',
      doctor: 'Caregiver Alert Log',
      summary: 'Slip incident without fracture. Recommended grab bars installation and nightlight.',
      source: 'Caregiver High Alert'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
              <Share2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Patient Journey & Health Timeline</h3>
              <p className="text-xs text-slate-500 font-medium">5-Year longitudinal clinical trajectory across care providers</p>
            </div>
          </div>

          <button className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors">
            View Full Timeline <ArrowRight size={14} />
          </button>
        </div>

        {/* Stepper Timeline (Reference 2 style vertical structured cards) */}
        <div className="relative pl-6 border-l-2 border-slate-100 space-y-4 my-4 ml-3">
          {timelineEvents.map((event, idx) => {
            const Icon = event.icon;
            const nodeColorMap = {
              blue: 'bg-blue-600 ring-blue-100',
              purple: 'bg-purple-600 ring-purple-100',
              emerald: 'bg-emerald-600 ring-emerald-100',
              amber: 'bg-amber-600 ring-amber-100',
              red: 'bg-red-600 ring-red-100',
            };

            return (
              <div key={idx} className="relative group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ${nodeColorMap[event.color]} transition-transform group-hover:scale-125`} />

                {/* Event Card */}
                <div className="bg-slate-50/60 hover:bg-white p-4 rounded-2xl border border-slate-200/70 hover:border-slate-300 hover:shadow-2xs transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{event.year}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-xs font-bold text-slate-700">{event.title}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{event.date}</span>
                  </div>

                  <div className="text-xs text-blue-600 font-bold mb-1">
                    {event.doctor}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {event.summary}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav Cards (Reference 1 4-Box Action Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-4 border-t border-slate-100">
        <NavCard icon={Pill} color="purple" title="Medications" subtitle="4 active prescriptions" />
        <NavCard icon={FileText} color="emerald" title="Medical Documents" subtitle="18 records digitized" />
        <NavCard icon={Calendar} color="blue" title="Follow-ups" subtitle="Next: 24 Sep 2026" />
        <NavCard icon={AlertTriangle} color="red" title="Emergency Profile" subtitle="Paramedic SOS sync" />
      </div>
    </div>
  );
}

function NavCard({ icon: Icon, color, title, subtitle }) {
  const colorMap = {
    purple: 'bg-purple-50 text-purple-600 border-purple-200/70',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
    blue: 'bg-blue-50 text-blue-600 border-blue-200/70',
    red: 'bg-red-50 text-red-600 border-red-200/70',
  };

  return (
    <button className="flex flex-col items-start p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-2xs transition-all text-left bg-white group">
      <div className={`p-2 rounded-xl mb-2.5 border ${colorMap[color]}`}>
        <Icon size={16} />
      </div>
      <div className="flex items-center justify-between w-full mb-0.5">
        <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h4>
        <ArrowRight size={12} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-[10px] text-slate-500 font-medium">{subtitle}</p>
    </button>
  );
}

