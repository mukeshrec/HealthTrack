import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Activity, Brain, Pill } from 'lucide-react';
import axios from 'axios';

export function WhatMattersNow({ patientId, riskFlags }) {
  const [risks, setRisks] = useState(riskFlags || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (riskFlags && riskFlags.length > 0) {
      setRisks(riskFlags);
      return;
    }

    if (!patientId) return;

    const fetchRisks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/agents/${patientId}/risks`);
        if (response.data && response.data.length > 0) {
          setRisks(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch risks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
  }, [patientId, riskFlags]);

  if (loading && risks.length === 0) {
    return <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>;
  }

  // If dynamic risks are present from database, display them; otherwise fallback to curated clinical demo insights
  const displayRisks = risks.length > 0 ? risks : [
    {
      id: 'mock-1',
      severity: 'HIGH',
      title: '2 falls reported in the last 30 days',
      description: 'Previous: 0 falls | Recent: 2 falls reported by caregiver.',
      agentType: 'FALL_RISK'
    },
    {
      id: 'mock-2',
      severity: 'MEDIUM',
      title: 'Increasing confusion & disorientation',
      description: 'More frequent caregiver observations compared to previous quarters.',
      agentType: 'DECLINE_TRAJECTORY'
    },
    {
      id: 'mock-3',
      severity: 'MEDIUM',
      title: 'Active Medication Regimen Adjusted',
      description: 'Metformin 500mg, Amlodipine 5mg active under daily scheduled monitoring.',
      agentType: 'POLYPHARMACY'
    }
  ];

  const getIcon = (agentType) => {
    if (agentType.includes('FALL')) return <Activity size={20} />;
    if (agentType.includes('DECLINE') || agentType.includes('COGNITIVE')) return <Brain size={20} />;
    if (agentType.includes('POLYPHARMACY') || agentType.includes('MEDICATION')) return <Pill size={20} />;
    return <Activity size={20} />;
  };

  const getSeverityStyles = (severity) => {
    if (severity === 'CRITICAL' || severity === 'HIGH') {
      return {
        bg: 'bg-red-50',
        badgeBg: 'bg-red-100',
        badgeText: 'text-red-700',
        iconColor: 'text-red-600',
        title: 'text-red-950',
        desc: 'text-red-800/80',
        link: 'text-red-700'
      };
    }
    return {
      bg: 'bg-orange-50',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-700',
      iconColor: 'text-orange-600',
      title: 'text-orange-950',
      desc: 'text-orange-800/80',
      link: 'text-orange-700'
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-blue-100/80 p-2 rounded-xl text-blue-700 shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">What Matters Now?</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">AI-detected key changes since the last consultation</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1.5 hover:gap-2 transition-all bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
          View All Insights <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayRisks.map((risk) => {
          const styles = getSeverityStyles(risk.severity);
          
          return (
            <div key={risk.id} className={`${styles.bg} rounded-2xl p-5 border border-white/60 relative overflow-hidden group shadow-xs hover:shadow-md transition-all`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`${styles.iconColor}`}>
                  {getIcon(risk.agentType)}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${styles.badgeBg} ${styles.badgeText}`}>
                  {risk.severity === 'CRITICAL' ? 'High' : risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1).toLowerCase()}
                </span>
              </div>
              
              <h4 className={`font-bold ${styles.title} mb-2 leading-tight text-sm`}>
                {risk.title}
              </h4>
              <p className={`text-xs ${styles.desc} mb-6 leading-relaxed`}>
                {risk.description}
              </p>
              
              <button className={`text-xs font-extrabold flex items-center gap-1.5 ${styles.link} group-hover:gap-2.5 transition-all mt-auto`}>
                View Evidence <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
