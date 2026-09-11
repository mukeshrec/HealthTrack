import React, { useState } from 'react';
import { FileText, Calendar, Filter, Sparkles, Eye, Download, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export function HealthRecords({ documents = [], events = [], patientName = '' }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const categories = ['ALL', 'Discharge Summary', 'Lab Report', 'Doctor Note', 'Prescription'];

  const filteredDocs = documents.filter((doc) => {
    if (activeCategory === 'ALL') return true;
    return (doc.category || '').toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Extracted Clinical Health Records & OCR Data
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            AI-extracted diagnostic summaries, discharge reports, and lab metrics for {patientName || 'Patient'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Records Grid */}
      {filteredDocs.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs font-semibold">
          No extracted health records found for category "{activeCategory}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc, idx) => (
            <div
              key={doc.id || idx}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-md border border-blue-100">
                    {doc.category || 'Clinical Document'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar size={12} /> {doc.documentDate || 'Recent'}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {doc.fileName || 'Medical Report'}
                </h3>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                  Source: <span className="text-slate-700">{doc.source || 'Hospital Health Record'}</span>
                </p>

                {/* AI Extracted Summary Badge */}
                {doc.summary && (
                  <div className="mt-3 p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-black text-blue-800 uppercase tracking-wider">
                      <Sparkles size={12} className="text-blue-600" /> AI Extracted Clinical Summary
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>
                )}

                {/* Extracted Raw OCR Snippet */}
                {doc.extractedText && (
                  <div className="mt-2.5 p-2.5 bg-slate-100 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Extracted OCR Text</p>
                    <p className="text-xs font-mono text-slate-800 line-clamp-3 leading-relaxed">
                      {doc.extractedText}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified ABHA Record
                </span>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-all"
                >
                  <Eye size={12} /> Full Document
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-black rounded-lg border border-blue-100">
                  {selectedDoc.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">{selectedDoc.fileName}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedDoc.source} • {selectedDoc.documentDate}</p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {selectedDoc.summary && (
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
                <span className="text-xs font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> Clinical Intelligence Summary
                </span>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed">{selectedDoc.summary}</p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Complete Extracted Text & Notes</h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {selectedDoc.extractedText || 'No additional raw text found.'}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
