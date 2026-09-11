import React from 'react';
import { Pill, Clock, AlertTriangle, CheckCircle, ShieldAlert, UserCheck, Calendar } from 'lucide-react';

export function MedicationsList({ medications = [], allergies = [], patientName = '' }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Pill size={20} className="text-blue-600" />
            Active Medications & Pharmacotherapy Regimen
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Current active prescriptions, schedules, dosages, and prescribing doctors for {patientName || 'Patient'}
          </p>
        </div>

        {/* Allergy Warning Pill if any */}
        {allergies && allergies.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 shadow-2xs">
            <ShieldAlert size={14} className="text-rose-600 shrink-0" />
            <span>Allergies: {Array.isArray(allergies) ? allergies.join(', ') : allergies}</span>
          </div>
        )}
      </div>

      {medications.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs font-semibold">
          No active medications currently registered in this patient's health record.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med, idx) => {
            const isCritical = (med.name || '').toLowerCase().includes('warfarin') || (med.name || '').toLowerCase().includes('aspirin');

            return (
              <div
                key={med.id || idx}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isCritical
                    ? 'border-amber-300 bg-amber-50/40 hover:bg-white'
                    : 'border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-md border border-blue-200">
                      {med.frequency || 'Daily Regimen'}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle size={10} /> {med.status || 'ACTIVE'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    {med.name}
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                      {med.dosage}
                    </span>
                  </h3>

                  <div className="mt-3 space-y-2 text-xs font-semibold">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={14} className="text-blue-600 shrink-0" />
                      <span>Timing: <strong className="text-slate-900">{med.schedule || 'As Directed'}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Pill size={14} className="text-indigo-600 shrink-0" />
                      <span>Indication: <strong className="text-slate-900">{med.indication || 'Maintenance Therapy'}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <UserCheck size={14} className="text-slate-500 shrink-0" />
                      <span>Prescribed by: <strong className="text-slate-800">{med.prescribedBy || 'Attending Physician'}</strong></span>
                    </div>

                    {med.startDate && (
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <Calendar size={13} className="shrink-0" />
                        <span>Initiated on: {med.startDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isCritical && (
                  <div className="p-2.5 bg-amber-100/70 border border-amber-200 rounded-xl flex items-center gap-2 text-[11px] font-bold text-amber-900">
                    <AlertTriangle size={13} className="text-amber-700 shrink-0" />
                    <span>Requires coagulation and bleeding monitoring when combined with NSAIDs.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
