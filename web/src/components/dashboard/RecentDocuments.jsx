import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export function RecentDocuments() {
  const documents = [
    {
      id: 1,
      type: 'Prescription',
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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <FileText size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Recent Documents</h3>
        </div>
        <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
          View All <ArrowRight size={16} />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors bg-slate-50/50 group">
            <div className="flex items-center gap-4">
              <div className="text-slate-300 group-hover:text-slate-400 transition-colors">
                <FileText size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-tight">{doc.type}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span>{doc.date}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{doc.author}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-primary hover:bg-slate-50 transition-colors shadow-sm">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
