import React, { useState } from 'react';
import { Pill, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

export function MedicationSchedule() {
  const [selectedDay, setSelectedDay] = useState(13);

  const daysOfWeek = [
    { day: 'MON', date: 10, dots: ['bg-teal-500', 'bg-teal-500', 'bg-teal-500'] },
    { day: 'TUE', date: 11, dots: ['bg-teal-500', 'bg-red-500'] },
    { day: 'WED', date: 12, dots: ['bg-teal-500', 'bg-teal-500', 'bg-red-500'] },
    { day: 'THU', date: 13, dots: ['bg-teal-500', 'bg-blue-500', 'bg-slate-300'], active: true },
    { day: 'FRI', date: 14, dots: ['bg-slate-300', 'bg-slate-300'] },
    { day: 'SAT', date: 15, dots: ['bg-slate-300', 'bg-slate-300'] },
    { day: 'SUN', date: 16, dots: ['bg-slate-300'] },
  ];

  const [medications, setMedications] = useState([
    {
      id: 'med-1',
      name: 'Metformin 500mg',
      instruction: 'After breakfast · Type 2 Diabetes Mellitus',
      time: '8:00 AM',
      taken: true,
      accentColor: 'border-teal-500 bg-teal-500/10 text-teal-700',
      pillBg: 'bg-teal-100 text-teal-600',
    },
    {
      id: 'med-2',
      name: 'Amlodipine 5mg',
      instruction: 'Before lunch · Essential Hypertension',
      time: '1:00 PM',
      taken: false,
      accentColor: 'border-amber-500 bg-amber-500/10 text-amber-700',
      pillBg: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'med-3',
      name: 'Atorvastatin 10mg',
      instruction: 'After dinner · Lipid & Cholesterol Management',
      time: '9:00 PM',
      taken: false,
      accentColor: 'border-blue-500 bg-blue-500/10 text-blue-700',
      pillBg: 'bg-blue-100 text-blue-600',
    },
  ]);

  const toggleMedication = (id) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
      {/* Header with Title & Adherence badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">💊</span>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              TODAY'S MEDICATION SCHEDULE
            </h3>
            <p className="text-xs text-slate-500 font-medium">Real-time prescription adherence regimen</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>78% ADHERENCE TODAY</span>
        </div>
      </div>

      {/* 7-Day Horizontal Calendar Strip (Reference 2 style) */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-6">
        {daysOfWeek.map((item) => {
          const isSelected = selectedDay === item.date;
          return (
            <button
              key={item.date}
              onClick={() => setSelectedDay(item.date)}
              className={`flex flex-col items-center py-3 px-1 rounded-2xl border transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.day}</span>
              <span className={`text-base font-extrabold my-1 ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                {item.date}
              </span>
              <div className="flex gap-1 mt-1">
                {item.dots.map((dotColor, idx) => (
                  <span key={idx} className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Medication Cards with Left Colored Accent Borders */}
      <div className="space-y-3">
        {medications.map((med) => (
          <div
            key={med.id}
            className={`flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs transition-all relative overflow-hidden`}
          >
            {/* Left colored bar indicator */}
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${med.accentColor.split(' ')[0].replace('border-', 'bg-')}`}></div>

            <div className="flex items-center gap-3.5 ml-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${med.pillBg}`}>
                <Pill size={20} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{med.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{med.instruction}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                <Clock size={13} className="text-slate-400" />
                <span>{med.time}</span>
              </div>

              <button
                onClick={() => toggleMedication(med.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  med.taken
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                }`}
              >
                {med.taken ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Taken</span>
                  </>
                ) : (
                  <>
                    <span className="w-3.5 h-3.5 rounded border border-slate-400"></span>
                    <span>Pending</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
