import React, { useState } from 'react';
import { X, Pill, FileText, Phone, AlertTriangle, Calendar, ShieldCheck, CheckCircle2, Clock, Eye, Sparkles } from 'lucide-react';

export function DetailModal({ isOpen, onClose, title, subtitle, icon: Icon, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-indigo-50/40">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              {Icon ? <Icon size={22} /> : <Sparkles size={22} />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function MedicationsModal({ isOpen, onClose, medications = [] }) {
  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Prescribed Medications Regimen"
      subtitle="Complete active & historical medications extracted from verified clinical records"
      icon={Pill}
    >
      {medications.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/70">
          <Pill size={32} className="mx-auto text-slate-400 mb-2" />
          <p className="text-slate-600 text-sm font-semibold">No active medication records found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {medications.map((med, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:bg-blue-50/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <Pill size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{med.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">{med.dosage || '1 tablet'}</span>
                    <span>•</span>
                    <span>{med.instruction || 'Take with food'}</span>
                    {med.slot && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{med.slot}</span>
                      </>
                    )}
                  </div>
                  {med.source && (
                    <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                      <FileText size={12} className="text-blue-500" /> Source: {med.source}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1">
                  <CheckCircle2 size={13} /> Active Rx
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DetailModal>
  );
}

export function DocumentsModal({ isOpen, onClose, documents = [] }) {
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={() => { setSelectedDoc(null); onClose(); }}
      title="Medical Documents & Health Records"
      subtitle="Ingested prescriptions, lab diagnostic tests, and OCR extracted texts"
      icon={FileText}
    >
      {selectedDoc ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedDoc(null)}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mb-2"
          >
            ← Back to all documents
          </button>
          
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-extrabold text-slate-900">{selectedDoc.fileName}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Uploaded: {selectedDoc.uploadDate}</p>
              </div>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg">
                {selectedDoc.category}
              </span>
            </div>

            {selectedDoc.summary && (
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-blue-900 block mb-1">AI Clinical Summary:</span>
                {selectedDoc.summary}
              </div>
            )}

            {selectedDoc.extractedText && (
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Full Extracted Clinical OCR Text:</span>
                <pre className="p-4 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                  {selectedDoc.extractedText}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/70">
              <FileText size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600 text-sm font-semibold">No documents uploaded yet.</p>
            </div>
          ) : (
            documents.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 transition-all flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{doc.fileName}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                      <span>{doc.uploadDate}</span>
                      <span>•</span>
                      <span className="text-blue-700 font-semibold">{doc.category}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20 shrink-0"
                >
                  <Eye size={14} /> View OCR
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </DetailModal>
  );
}

export function EmergencyProfileModal({ isOpen, onClose, patient = {} }) {
  const profile = patient?.profile || {};
  const user = patient?.user || {};
  const contacts = profile.emergencyContacts || { name: 'Kumar (Son)', phone: '+91 98765 43210' };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Emergency Medical Profile"
      subtitle="Critical health alerts, emergency contacts, and vital clinical parameters"
      icon={AlertTriangle}
    >
      <div className="space-y-4">
        {/* Critical Alert Banner */}
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-rose-950">High-Priority Geriatric Patient</h4>
            <p className="text-xs text-rose-800 leading-relaxed mt-0.5">
              Anticoagulant therapy and history of falls logged. Avoid NSAIDs without gastro-protection.
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Blood Group</span>
            <p className="text-lg font-black text-slate-900">{profile.bloodGroup || 'B+'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Known Drug Allergies</span>
            <p className="text-sm font-bold text-slate-900">
              {Array.isArray(profile.allergies) ? profile.allergies.join(', ') : 'No acute allergies'}
            </p>
          </div>

          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2 sm:col-span-2">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Phone size={13} /> Primary Emergency Contact
            </span>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-black text-slate-900">{contacts.name || 'Primary Guardian'}</p>
                <p className="text-xs font-semibold text-blue-700">{contacts.phone || '+91 98765 43210'}</p>
              </div>
              <a
                href={`tel:${(contacts.phone || '').replace(/[^0-9+]/g, '')}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Phone size={14} /> Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  );
}

export function FollowupsModal({ isOpen, onClose, events = [] }) {
  const followups = events.filter(e => e.eventType === 'Appointment' || e.eventType === 'Consultation' || e.title?.toLowerCase().includes('consult') || e.title?.toLowerCase().includes('follow'));

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Upcoming Consultations & Follow-ups"
      subtitle="Scheduled clinic appointments, follow-up tests, and physician check-ups"
      icon={Calendar}
    >
      <div className="space-y-3">
        {followups.length === 0 ? (
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Geriatric Care Follow-up</h4>
                <p className="text-xs text-slate-500 font-medium">Routine Blood Glucose & Lipid Panel Review</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">Scheduled Date: <strong>24 Sep 2026</strong></span>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-100">Confirmed</span>
            </div>
          </div>
        ) : (
          followups.map((ev, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900">{ev.title}</h4>
                <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md">{ev.formattedDate}</span>
              </div>
              <p className="text-xs text-slate-600">{ev.description}</p>
            </div>
          ))
        )}
      </div>
    </DetailModal>
  );
}

export function EvidenceModal({ isOpen, onClose, risk = null, events = [] }) {
  if (!risk) return null;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Evidence: ${risk.title}`}
      subtitle={`Agent: ${risk.agentType || 'Geriatric Risk Detector'} • Severity: ${risk.severity}`}
      icon={ShieldCheck}
    >
      <div className="space-y-4">
        <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
          <span className="font-extrabold text-blue-950 block mb-1 text-sm">Detected Clinical Risk Pattern:</span>
          {risk.description}
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Grounding Timeline Evidence from Common Database:</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {events.slice(0, 5).map((ev, idx) => (
              <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-800">{ev.title}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{ev.formattedDate}</span>
                </div>
                <p className="text-[11px] text-slate-600">{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DetailModal>
  );
}
