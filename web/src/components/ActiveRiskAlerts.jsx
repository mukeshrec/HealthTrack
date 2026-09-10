import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Sparkles, Check, X, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';

export const ActiveRiskAlerts = ({ patientId, token }) => {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchRisks();
    }
  }, [patientId, token]);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/agents/${patientId}/risks`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setRisks(res.data || []);
    } catch (error) {
      console.error('Failed to fetch risk alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerAgents = async () => {
    try {
      setTriggering(true);
      await axios.post(`http://localhost:3000/api/agents/${patientId}/agents/run`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      alert('AI Geriatric Multi-Agent orchestrator triggered. Risk flags will synthesize in the background.');
      setTimeout(fetchRisks, 4000);
    } catch (error) {
      console.error('Failed to trigger agents:', error);
      alert('Failed to trigger AI Agents.');
    } finally {
      setTriggering(false);
    }
  };

  const dismissRisk = async (riskId) => {
    try {
      await axios.patch(`http://localhost:3000/api/agents/risks/${riskId}`, { status: 'DISMISSED' }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchRisks();
    } catch (error) {
      console.error('Failed to dismiss risk:', error);
    }
  };

  const resolveRisk = async (riskId) => {
    try {
      await axios.patch(`http://localhost:3000/api/agents/risks/${riskId}`, { status: 'RESOLVED' }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchRisks();
    } catch (error) {
      console.error('Failed to resolve risk:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 mb-6 shadow-xs animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-1/4 mb-4"></div>
        <div className="h-20 bg-slate-50 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs mb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-xs">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
              Active AI Risk Alerts & Geriatric Flags
            </h2>
            <p className="text-xs text-slate-500 font-medium">Synthesized across prescriptions, consultations, and caregiver logs</p>
          </div>
        </div>

        <button 
          onClick={triggerAgents}
          disabled={triggering}
          className="flex items-center gap-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 rounded-xl transition-all font-bold border border-blue-200/80 shadow-2xs disabled:opacity-60"
        >
          <RefreshCw size={13} className={triggering ? 'animate-spin' : ''} />
          <span>{triggering ? 'Running Multi-Agent Engine...' : 'Run AI Analysis'}</span>
        </button>
      </div>

      {/* Risks List */}
      {risks.length === 0 ? (
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-5 text-center flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>No critical risk flags detected. All longitudinal markers within stable parameters.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {risks.map(risk => {
            const isCritical = risk.severity === 'CRITICAL' || risk.severity === 'HIGH';
            return (
              <div 
                key={risk.id} 
                className={`rounded-2xl border p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between ${
                  isCritical 
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300' 
                    : 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                }`}
              >
                {/* Left accent color strip */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`} />

                <div className="ml-1.5 mb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      isCritical ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {risk.severity} RISK
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold bg-white/80 px-2 py-0.5 rounded border border-slate-200/60">
                      {risk.agentType.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className={`text-sm font-extrabold mb-1.5 leading-snug ${isCritical ? 'text-red-950' : 'text-amber-950'}`}>
                    {risk.title}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {risk.description}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="ml-1.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <button 
                    onClick={() => resolveRisk(risk.id)}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-[11px]"
                  >
                    <Check size={13} />
                    <span>Resolve</span>
                  </button>

                  <button 
                    onClick={() => dismissRisk(risk.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-600 font-bold text-[11px]"
                  >
                    <X size={13} />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveRiskAlerts;

