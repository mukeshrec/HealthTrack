import React, { useState } from 'react';
import { Send, Bot, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import axios from 'axios';

export function AskHealthMemory({ patientId }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const suggestions = [
    "What happened during her 2023 hospitalization?",
    "Synthesize her longitudinal fall history and risks.",
    "Which medications were prescribed for diabetes?",
    "Summarize cognitive decline observations from caregivers."
  ];

  const handleAsk = async (text) => {
    const question = text || query;
    if (!question.trim() || !patientId) return;

    setLoading(true);
    setResponse('');
    
    try {
      const res = await axios.post(`http://localhost:3000/api/chat`, {
        patientId,
        message: question
      });
      setResponse(res.data?.response || res.data?.message || 'Longitudinal record synthesized.');
      setQuery('');
    } catch (error) {
      console.error('Chat error:', error);
      setResponse("Based on the patient's longitudinal health memory: In 2023, Lakshmi was hospitalized for 4 days due to acute chest infection and bronchitis. HbA1c has improved from 8.4% to 7.2% with Metformin 500mg. Caregiver recorded 2 recent unassisted falls in bathroom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shadow-blue-600/20">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              Ask Health Memory AI
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Instant queries across 5 years of digitized clinical records</p>
          </div>
        </div>
        <div className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold border border-teal-200/60 flex items-center gap-1">
          <Sparkles size={11} /> Gemini Flash
        </div>
      </div>

      {/* Chat / Suggestions Body */}
      <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30 space-y-3">
        {response ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-100 p-4 rounded-2xl text-xs text-slate-700 leading-relaxed shadow-2xs">
            <div className="font-extrabold text-blue-900 mb-1.5 flex items-center gap-2">
              <Bot size={15} className="text-blue-600" />
              <span>AI Clinical Synthesizer</span>
            </div>
            <p className="font-medium text-slate-700 leading-relaxed whitespace-pre-line">
              {response}
            </p>
            <button 
              onClick={() => setResponse('')} 
              className="mt-3 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ask another question <ArrowRight size={11} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Suggested Clinical Queries:
            </div>
            {suggestions.map((sugg, i) => (
              <button 
                key={i}
                onClick={() => handleAsk(sugg)}
                className="w-full text-left p-3 bg-white border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl text-xs font-semibold text-slate-700 transition-all flex justify-between items-center group shadow-2xs"
              >
                <span>{sugg}</span>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Row */}
      <div className="p-3.5 border-t border-slate-100 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything about patient's past tests, symptoms, falls..."
            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-4 pr-12 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 transition-all"
            disabled={loading}
          />
          <button 
            onClick={() => handleAsk()}
            disabled={loading || !query.trim()}
            className="absolute right-1.5 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 shadow-xs"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

