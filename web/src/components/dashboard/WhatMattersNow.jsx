import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Activity, Brain, Pill } from 'lucide-react';
import axios from 'axios';

export function WhatMattersNow({ patientId, language = 'en-IN' }) {
  const [risks, setRisks] = useState([]);
  const [translatedRisks, setTranslatedRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const fetchRisks = async () => {
      try {
        setLoading(true);
        // Ensure to map to the correct backend port and endpoint
        const response = await axios.get(`http://localhost:3000/api/agents/${patientId}/risks`);
        const data = response.data || [];
        setRisks(data);
        setTranslatedRisks(data); // Initial untranslated data
      } catch (error) {
        console.error('Failed to fetch risks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
  }, [patientId]);

  useEffect(() => {
    const translateContent = async () => {
      if (risks.length === 0 || language === 'en-IN') {
        setTranslatedRisks(risks);
        return;
      }

      setTranslating(true);
      try {
        const promises = risks.map(async (risk) => {
          const titleRes = await axios.post(`http://localhost:3000/api/translate`, { text: risk.title, targetLanguage: language });
          const descRes = await axios.post(`http://localhost:3000/api/translate`, { text: risk.description, targetLanguage: language });
          return {
            ...risk,
            title: titleRes.data.translatedText || risk.title,
            description: descRes.data.translatedText || risk.description
          };
        });

        const translated = await Promise.all(promises);
        setTranslatedRisks(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedRisks(risks); // Fallback to english
      } finally {
        setTranslating(false);
      }
    };

    translateContent();
  }, [risks, language]);

  if (loading) {
    return <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>;
  }

  // If no dynamic risks are found, we'll use mock data that exactly matches the design for demonstration
  const displayRisks = translatedRisks.length > 0 ? translatedRisks : [
    {
      id: 'mock-1',
      severity: 'HIGH',
      title: '2 falls reported in the last 30 days',
      description: 'Previous: 0 falls | Recent: 2 falls',
      agentType: 'FALL_RISK'
    },
    {
      id: 'mock-2',
      severity: 'MEDIUM',
      title: 'Increasing confusion',
      description: 'More frequent caregiver observations compared to previous months.',
      agentType: 'DECLINE_TRAJECTORY'
    },
    {
      id: 'mock-3',
      severity: 'MEDIUM',
      title: 'Medication changed',
      description: 'Amlodipine stopped, Telmisartan started (12 Aug 2026).',
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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-purple-100 p-1.5 rounded-lg text-purple-600">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">What Matters Now?</h3>
              {translating && <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>}
            </div>
            <p className="text-sm text-slate-500">AI-detected key changes since the last consultation</p>
          </div>
        </div>
        <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
          View All Insights <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayRisks.map((risk) => {
          const styles = getSeverityStyles(risk.severity);
          
          return (
            <div key={risk.id} className={`${styles.bg} rounded-xl p-5 border border-white/50 relative overflow-hidden group`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`${styles.iconColor}`}>
                  {getIcon(risk.agentType)}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles.badgeBg} ${styles.badgeText}`}>
                  {risk.severity === 'CRITICAL' ? 'High' : risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1).toLowerCase()}
                </span>
              </div>
              
              <h4 className={`font-bold ${styles.title} mb-2 leading-tight`}>
                {risk.title}
              </h4>
              <p className={`text-sm ${styles.desc} mb-6 leading-relaxed`}>
                {risk.description}
              </p>
              
              <button className={`absolute bottom-5 left-5 text-sm font-bold flex items-center gap-1 ${styles.link} group-hover:gap-2 transition-all`}>
                View Evidence <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
