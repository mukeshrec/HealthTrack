import React from 'react';
import { FileText, ArrowRight, Eye } from 'lucide-react';

export function RecentDocuments({ documents = [], onViewDoc, onViewAll }) {
  const displayDocs = documents && documents.length > 0 ? documents : [
    {
      id: 'doc-1',
      fileName: 'Prescription Record',
      category: 'Prescription',
      uploadDate: '12 Aug 2026',
      summary: 'Cardiology consultation & anti-hypertensive adjustment.',
      extractedText: 'Rx: Telmisartan 40mg OD, Metformin 500mg BD.'
    },
    {
      id: 'doc-2',
      fileName: 'Lab Report (CBC & HbA1c)',
      category: 'Lab Report',
      uploadDate: '05 Aug 2026',
      summary: 'Complete Blood Count & HbA1c screening.',
      extractedText: 'HbA1c: 7.2%, Blood Glucose: 132 mg/dL.'
    },
    {
      id: 'doc-3',
      fileName: 'Discharge Summary',
      category: 'Hospital Discharge',
      uploadDate: '14 Jan 2025',
      summary: 'Resolved lower respiratory tract chest infection.',
      extractedText: 'Discharged stable after IV antibiotics course.'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100/80 p-2 rounded-xl text-blue-700 shadow-2xs">
            <FileText size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">Recent Documents</h3>
        </div>
        <button 
          onClick={onViewAll}
          className="text-blue-700 hover:text-blue-800 font-bold text-xs flex items-center gap-1.5 hover:gap-2 transition-all bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs"
        >
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto">
        {displayDocs.slice(0, 3).map((doc, idx) => (
          <div key={doc.id || idx} className="flex items-center justify-between p-3 border border-slate-200/70 rounded-2xl hover:border-blue-300 hover:bg-blue-50/20 transition-all bg-slate-50/40 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/90 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                <FileText size={18} strokeWidth={2} />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-black text-slate-800 leading-tight group-hover:text-blue-700 transition-colors truncate max-w-[170px]" title={doc.fileName || doc.category}>
                  {doc.fileName || doc.category}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-1 truncate">
                  <span>{doc.uploadDate || doc.date || 'Aug 2026'}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-blue-700 font-bold truncate">{doc.category || 'Clinical'}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onViewDoc ? onViewDoc(doc) : (onViewAll && onViewAll())}
              className="px-3.5 py-1.5 bg-white border border-blue-200 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-2xs shrink-0 flex items-center gap-1"
            >
              <Eye size={12} /> View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

