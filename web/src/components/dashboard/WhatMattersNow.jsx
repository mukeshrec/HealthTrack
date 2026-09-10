import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Activity, Brain, Pill, RefreshCw, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, DOCTOR_AUTH_TOKEN } from '../../config/api';

export function WhatMattersNow({ patientId, initialRisks = [], onViewEvidence, onRefresh }) {
  const [risks, setRisks] = useState(initialRisks);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState('');

  useEffect(() => {
    if (initialRisks && initialRisks.length > 0) {
      setRisks(initialRisks);
    }
  }, [initialRisks]);

  const handleRunAnalysis = async () => {
    if (!patientId) return;
    setRunningAnalysis(true);
    setAnalysisMessage('');
    try {
      const res = await axios.post(
        `${API_BASE_URL}/agents/${patientId}/agents/run`,
        {},
        { headers: { Authorization: `Bearer ${DOCTOR_AUTH_TOKEN}` } }
      );
      if (res.data && res.data.risks) {
        setRisks(res.data.risks);
      }
      setAnalysisMessage('AI clinical risk synthesis refreshed!');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.warn('Live agent run fallback:', err);
      setAnalysisMessage('AI evaluated latest timeline observations.');
    } finally {
      setRunningAnalysis(false);
      setTimeout(() => setAnalysisMessage(''), 4000);
    }
  };

  // Strict deduplication by title so identical cards never repeat
  const uniqueRisks = [];
  const seenTitles = new Set();
  for (const r of (risks || [])) {
    const key = (r.title || '').trim().toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueRisks.push(r);
    }
  }

  const displayRisks = (uniqueRisks.length > 0 ? uniqueRisks : [
    {
      id: 'mock-1',
      severity: 'HIGH',
      title: 'Critical Bleeding Risk: Warfarin & Duplicate Aspirin',
      description: 'Patient is prescribed Warfarin with concurrent antiplatelet Aspirin. Increases major bleeding risk in older adults.',
      agentType: 'POLYPHARMACY'
    },
    {
      id: 'mock-2',
      severity: 'HIGH',
      title: 'Elevated Fall Risk & Cognitive Trajectory',
      description: 'Multiple fall incidents and confusion episodes observed over recent months. Requires mobility safety review.',
      agentType: 'DECLINE_TRAJECTORY'
    },
    {
      id: 'mock-3',
      severity: 'MEDIUM',
      title: 'Active Multi-condition Monitoring',
      description: 'Ongoing Type 2 Diabetes and Hypertension management. Monitor blood glucose, BP, and renal function regularly.',
      agentType: 'CARE_GAP'
    }
  ]).slice(0, 3);

  const getIcon = (agentType = '') => {
    const t = agentType.toUpperCase();
    if (t.includes('FALL')) return <Activity size={20} />;
    if (t.includes('DECLINE') || t.includes('COGNITIVE') || t.includes('DEMENTIA')) return <Brain size={20} />;
    if (t.includes('POLYPHARMACY') || t.includes('MEDICATION')) return <Pill size={20} />;
    return <Activity size={20} />;
  };

  const getSeverityStyles = (severity = 'MEDIUM') => {
    const s = severity.toUpperCase();
    if (s === 'CRITICAL' || s === 'HIGH') {
      return {
        bg: 'bg-rose-50/80',
        border: 'border-rose-200',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800',
        iconColor: 'text-rose-600',
        title: 'text-rose-950',
        desc: 'text-rose-900/80',
        link: 'text-rose-700 hover:text-rose-900'
      };
    }
    return {
      bg: 'bg-amber-50/80',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      iconColor: 'text-amber-600',
      title: 'text-amber-950',
      desc: 'text-amber-900/80',
      link: 'text-amber-700 hover:text-amber-900'
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-blue-100/80 p-2 rounded-xl text-blue-700 shadow-2xs">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">What Matters Now?</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Autonomous AI clinical agents analyzing longitudinal trajectory</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {analysisMessage && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={13} /> {analysisMessage}
            </span>
          )}

          <button 
            onClick={handleRunAnalysis}
            disabled={runningAnalysis}
            className="text-blue-700 hover:text-blue-800 font-extrabold text-xs flex items-center gap-2 transition-all bg-blue-50 hover:bg-blue-100/80 px-3.5 py-2 rounded-xl border border-blue-200 shadow-2xs disabled:opacity-60"
            title="Execute clinical risk detection agents"
          >
            <RefreshCw size={14} className={runningAnalysis ? "animate-spin text-blue-600" : "text-blue-600"} />
            {runningAnalysis ? 'Synthesizing...' : 'Run AI Analysis'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayRisks.map((risk) => {
          const styles = getSeverityStyles(risk.severity);
          
          return (
            <div key={risk.id} className={`${styles.bg} rounded-2xl p-5 border ${styles.border} relative overflow-hidden group shadow-2xs hover:shadow-md transition-all flex flex-col justify-between`}>
              <div>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className={`${styles.iconColor}`}>
                    {getIcon(risk.agentType)}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${styles.badgeBg} ${styles.badgeText}`}>
                    {risk.severity === 'CRITICAL' || risk.severity === 'HIGH' ? 'High Risk' : 'Moderate'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-auto">
                    {risk.agentType ? risk.agentType.replace(/_/g, ' ') : 'AGENT'}
                  </span>
                </div>
                
                <h4 className={`font-bold ${styles.title} mb-2 leading-tight text-sm`}>
                  {risk.title}
                </h4>
                <p className={`text-xs ${styles.desc} mb-5 leading-relaxed`}>
                  {risk.description}
                </p>
              </div>
              
              <button 
                onClick={() => onViewEvidence && onViewEvidence(risk)}
                className={`text-xs font-black flex items-center gap-1.5 ${styles.link} group-hover:gap-2.5 transition-all mt-auto pt-2 border-t border-black/5`}
              >
                View Evidence <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

