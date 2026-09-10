import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActiveRiskAlerts = ({ patientId, token }) => {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId && token) {
      fetchRisks();
    }
  }, [patientId, token]);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/agents/${patientId}/risks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRisks(res.data);
    } catch (error) {
      console.error('Failed to fetch risk alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerAgents = async () => {
    try {
      await axios.post(`http://localhost:3000/api/agents/${patientId}/agents/run`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('AI Agents have been triggered. Risks will be updated shortly.');
      // Polling or manual refresh would be needed to get new risks
      setTimeout(fetchRisks, 5000);
    } catch (error) {
      console.error('Failed to trigger agents:', error);
      alert('Failed to trigger AI Agents.');
    }
  };

  const dismissRisk = async (riskId) => {
    try {
      await axios.patch(`http://localhost:3000/api/agents/risks/${riskId}`, { status: 'DISMISSED' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRisks();
    } catch (error) {
      console.error('Failed to dismiss risk:', error);
    }
  };

  if (loading) return <div className="text-sm text-gray-500 animate-pulse">Checking for critical risks...</div>;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="bg-rose-100 text-rose-600 p-1.5 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </span>
          Active AI Risk Alerts
        </h2>
        <button 
          onClick={triggerAgents}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-xs shadow-blue-500/20"
        >
          Run AI Analysis
        </button>
      </div>

      {risks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 text-center">
          <p className="text-slate-500 text-xs font-medium">No active risks detected for this patient.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {risks.map(risk => (
            <div key={risk.id} className={`rounded-2xl border p-4 shadow-xs relative overflow-hidden ${
              risk.severity === 'CRITICAL' ? 'bg-rose-50/70 border-rose-200' : 
              risk.severity === 'HIGH' ? 'bg-amber-50/70 border-amber-200' : 
              'bg-blue-50/70 border-blue-200'
            }`}>
              {/* Severity indicator bar */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                risk.severity === 'CRITICAL' ? 'bg-rose-600' : 
                risk.severity === 'HIGH' ? 'bg-amber-600' : 'bg-blue-600'
              }`}></div>
              
              <div className="flex justify-between items-start ml-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      risk.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 uppercase tracking-wider' : 
                      risk.severity === 'HIGH' ? 'bg-amber-100 text-amber-800 uppercase tracking-wider' : 
                      'bg-blue-100 text-blue-800 uppercase tracking-wider'
                    }`}>
                      {risk.severity} RISK
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Agent: {risk.agentType.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold mb-1 ${
                    risk.severity === 'CRITICAL' ? 'text-rose-950' : 
                    risk.severity === 'HIGH' ? 'text-amber-950' : 'text-slate-900'
                  }`}>{risk.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{risk.description}</p>
                </div>
                <button 
                  onClick={() => dismissRisk(risk.id)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                  title="Dismiss alert"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveRiskAlerts;
