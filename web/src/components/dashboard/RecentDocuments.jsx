import React from 'react';
import { FileText, ArrowRight, Eye, ShieldCheck, Download } from 'lucide-react';

export function RecentDocuments() {
  const documents = [
    {
      id: 1,
      type: 'Prescription',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      date: '12 Aug 2026',
      author: 'Dr. S. Kumar (Geriatrician)',
      facility: 'Sunrise Hospital',
    },
    {
      id: 2,
      type: 'Lab Report (CBC & HbA1c)',
      badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
      date: '05 Aug 2026',
      author: 'City Diagnostics Lab',
      facility: 'HbA1c: 7.2% (Controlled)',
    },
    {
      id: 3,
      type: 'Hospital Discharge Summary',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      date: '14 Jan 2025',
      author: 'MIOT Hospital Pulmonology',
      facility: 'Acute Bronchitis Resolved',
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Recent Clinical Documents</h3>
            <p className="text-[11px] text-slate-500 font-medium">18 verified longitudinal health records</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors">
          View All <ArrowRight size={13} />
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-2.5 flex-1">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            className="flex items-center justify-between p-3.5 border border-slate-200/70 rounded-2xl hover:border-slate-300 hover:bg-slate-50/70 transition-all bg-white shadow-2xs group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition-colors shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{doc.type}</h4>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                  <span>{doc.date}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-slate-700 font-semibold">{doc.author}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => alert(`Opening ${doc.type} (${doc.date}) extracted record preview.`)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 hover:border-blue-200 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

