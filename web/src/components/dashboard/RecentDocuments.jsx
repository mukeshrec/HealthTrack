import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export function RecentDocuments() {
  const documents = [
    {
      id: 1,
      type: 'Prescription Record',
      date: '12 Aug 2026',
      author: 'Dr. S. Kumar'
    },
    {
      id: 2,
      type: 'Lab Report (CBC)',
      date: '05 Aug 2026',
      author: 'Apollo Hospital'
    },
    {
      id: 3,
      type: 'Discharge Summary',
      date: '14 Jan 2025',
      author: 'MIOT Hospital'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100/80 p-2 rounded-xl text-blue-700 shadow-xs">
            <FileText size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Documents</h3>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1.5 hover:gap-2 transition-all bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/20 transition-all bg-slate-50/50 group">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                <FileText size={18} strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{doc.type}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-1">
                  <span>{doc.date}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{doc.author}</span>
                </div>
              </div>
            </div>
            <button className="px-3.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-xs">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
