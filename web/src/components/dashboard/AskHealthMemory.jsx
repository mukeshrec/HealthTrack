import React, { useState } from 'react';
import { Send, Bot, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';

export function AskHealthMemory({ patientId }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const suggestions = [
    "What happened during her last hospitalization?",
    "Show her history of falls.",
    "What medications were used in 2023?",
    "When did her mobility start declining?",
    "Has she had this symptom before?"
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
      setResponse(res.data.response || res.data.reply || "Record queried successfully.");
      setQuery('');
    } catch (error) {
      console.error('Chat error:', error);
      setResponse("I couldn't retrieve that information right now. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-sm shadow-blue-500/20">
            <MessageIcon />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 tracking-tight flex items-center gap-2 text-sm">
              Ask Health Memory
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Get answers from the patient's complete history — recent or past.</p>
          </div>
        </div>
        <div className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold border border-blue-200 flex items-center gap-1">
          <Sparkles size={11} /> AI SYNTHESIS
        </div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30">
        {response ? (
          <div className="space-y-3">
            <div className="bg-blue-50/90 border border-blue-200 p-4 rounded-2xl text-xs text-slate-700 leading-relaxed shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="font-extrabold text-blue-900 flex items-center gap-2 text-xs">
                  <Bot size={15} className="text-blue-600" /> AI Longitudinal Synthesis
                </div>
                <button 
                  onClick={() => setResponse('')} 
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs"
                >
                  Clear
                </button>
              </div>
              <div className="whitespace-pre-line text-slate-800 font-medium leading-relaxed">
                {response}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {suggestions.map((sugg, i) => (
              <button 
                key={i}
                onClick={() => handleAsk(sugg)}
                className="w-full text-left p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50/40 transition-all flex justify-between items-center group shadow-xs"
              >
                {sugg}
                <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything about this patient's health..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium placeholder:text-slate-400"
            disabled={loading}
          />
          <button 
            onClick={() => handleAsk()}
            disabled={loading || !query.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-9 rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm shadow-blue-500/20 disabled:opacity-40"
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom icon mimicking the UI chat icon
const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
