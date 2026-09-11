import React from 'react';
import { Search, User, ShieldCheck, Phone, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { resolveGender } from '../config/api';

export function PatientSearch({ patients, selectedPatient, onSelectPatient, searchQuery, setSearchQuery }) {
  const filtered = patients.filter((p) => {
    const q = (searchQuery || '').toLowerCase();
    const name = (p.name || p.user?.name || '').toLowerCase();
    const hid = (p.healthId || p.user?.healthId || '').toLowerCase();
    const phone = (p.phone || p.user?.phone || '').toLowerCase();
    const conditions = Array.isArray(p.conditions) ? p.conditions.join(' ').toLowerCase() : '';
    return name.includes(q) || hid.includes(q) || phone.includes(q) || conditions.includes(q);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            Patient Directory & Search
          </h2>
          <p className="text-xs text-slate-500 font-medium">Search and select registered patients across the common hospital database</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, ABHA ID, Phone..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-400 text-xs font-semibold">
            No patients match "{searchQuery}"
          </div>
        ) : (
          filtered.map((pt) => {
            const name = pt.name || pt.user?.name || 'Patient';
            const healthId = pt.healthId || pt.user?.healthId || 'HT-000000';
            const rawGen = pt.gender || pt.profile?.gender || '';
            const gender = resolveGender(name, rawGen);
            const age = pt.age || pt.profile?.age || 70;
            const phone = pt.phone || pt.user?.phone || '+91 98765 43210';
            const isSelected = selectedPatient && (selectedPatient.id === pt.id || selectedPatient.user?.id === pt.id || selectedPatient.healthId === healthId);

            const initials = name
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'PT';

            return (
              <button
                key={pt.id || healthId}
                onClick={() => onSelectPatient(pt)}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/80 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-md border border-blue-200">
                      {healthId}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {gender} • {age} yrs
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
                      {initials}
                    </div>
                    <div className="truncate">
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {name}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Phone size={10} /> {phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? 'text-blue-700' : 'text-slate-500'}>
                    {isSelected ? 'Currently Viewing' : 'Click to View Profile'}
                  </span>
                  <ChevronRight size={14} className={isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:translate-x-0.5 transition-transform'} />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
