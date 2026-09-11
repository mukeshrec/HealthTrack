import React, { useState } from 'react';
import { Send, Bot, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';

export function AskHealthMemory({ patientId, language = 'en-IN' }) {
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
      // Assuming a valid mock token for the backend or no strict auth
      const res = await axios.post(`http://localhost:3000/api/chat`, {
        patientId,
        message: question
      });
      
      let finalResponse = res.data.response;
      
      if (language !== 'en-IN') {
        try {
          const transRes = await axios.post(`http://localhost:3000/api/translate`, { 
            text: finalResponse, 
            targetLanguage: language 
          });
          if (transRes.data.translatedText) {
            finalResponse = transRes.data.translatedText;
          }
        } catch (e) {
          console.error("Translation failed for chat", e);
        }
      }
      
      setResponse(finalResponse);
      setQuery('');
    } catch (error) {
      console.error('Chat error:', error);
      setResponse("I couldn't retrieve that information right now. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-sm">
            <MessageIcon />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              Ask Health Memory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Get answers from the patient's complete history — recent or from years ago.</p>
          </div>
        </div>
        <div className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-[10px] font-bold border border-teal-100 flex items-center gap-1">
          <Sparkles size={12} /> AI
        </div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30">
        {response ? (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-slate-700 leading-relaxed">
            <div className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Bot size={16} /> AI Memory Synthesizer
            </div>
            {response}
          </div>
        ) : (
          <div className="space-y-2">
            {suggestions.map((sugg, i) => (
              <button 
                key={i}
                onClick={() => handleAsk(sugg)}
                className="w-full text-left p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-primary hover:text-primary transition-colors flex justify-between items-center group shadow-sm"
              >
                {sugg}
                <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-4 pr-14 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400"
            disabled={loading}
          />
          <button 
            onClick={() => handleAsk()}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white w-10 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom icon mimicking the UI chat icon
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
