import React, { useState } from 'react';
import { FileText, ArrowRight, X, Eye, Calendar, Building2 } from 'lucide-react';

export function RecentDocuments({ documents = [] }) {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const defaultDocs = [
    {
      id: '1',
      fileName: 'Prescription Record',
      fileType: 'PRESCRIPTION',
      uploadDate: '12 Aug 2026',
      summary: 'Prescribed by Dr. S. Kumar. Metformin 500mg BD, Amlodipine 5mg OD.'
    },
    {
      id: '2',
      fileName: 'Lab Report (CBC & HbA1c)',
      fileType: 'LAB_REPORT',
      uploadDate: '05 Aug 2026',
      summary: 'Apollo Hospital Pathology. Fasting Blood Sugar 142 mg/dL, HbA1c 7.4%.'
    },
    {
      id: '3',
      fileName: 'Discharge Summary',
      fileType: 'DISCHARGE_SUMMARY',
      uploadDate: '14 Jan 2025',
      summary: 'MIOT Hospital Cardiology Department. Patient stabilized and discharged.'
    }
  ];

  const docList = documents && documents.length > 0 ? documents : defaultDocs;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100/80 p-2 rounded-xl text-blue-700 shadow-xs">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Medical Documents</h3>
            <span className="text-[10px] text-slate-400 font-medium">{docList.length} indexed records</span>
          </div>
        </div>
        <button 
          onClick={() => setSelectedDoc(docList[0])}
          className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1.5 hover:gap-2 transition-all bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
        >
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
        {docList.slice(0, 5).map((doc) => {
          const title = doc.fileName || doc.title || doc.fileType || 'Medical Record';
          const dateStr = doc.uploadDate || (doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Recent');
          const previewText = doc.summary || doc.extractedText?.slice(0, 80) || 'Medical EHR Document';

          return (
            <div 
              key={doc.id || doc.fileName} 
              className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/20 transition-all bg-slate-50/50 group"
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                  <FileText size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors truncate">
                    {title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-1 truncate">
                    <span>{dateStr}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0"></span>
                    <span className="truncate">{doc.fileType || 'Document'}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDoc(doc)}
                className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-xs shrink-0 flex items-center gap-1"
              >
                <Eye size={12} /> View
              </button>
            </div>
          );
        })}
      </div>

      {/* Document Detail Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedDoc.fileName || selectedDoc.title || 'Document Record'}
                  </h3>
                  <span className="text-xs text-blue-600 font-semibold">{selectedDoc.fileType || 'EHR Record'}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold">Upload Date:</span>
                  <span className="text-slate-800 font-bold">{selectedDoc.uploadDate || 'Recent'}</span>
                </div>
                {selectedDoc.fileUrl && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold">Resource URL:</span>
                    <span className="text-blue-600 font-mono text-[10px] truncate max-w-[240px]">{selectedDoc.fileUrl}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Extracted Summary & Clinical Content</h4>
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedDoc.summary || selectedDoc.extractedText || 'No extra textual notes recorded for this attachment.'}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
