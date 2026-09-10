import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-10 w-full shadow-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Clinical Decision Portal</h1>
        </div>
        <div className="w-px h-5 bg-slate-200"></div>
        <p className="text-xs text-blue-700/80 font-semibold bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-100">
          Complete Context • AI-Assisted Synthesis
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors">
          <Search size={17} />
        </button>
        <button className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors relative">
          <Bell size={17} />
          <span className="absolute 1 top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
        </button>
        
        <div className="w-px h-6 bg-slate-200"></div>

        <button className="flex items-center gap-3 text-left p-1.5 pl-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/20">
            DR
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 leading-tight">Dr. Arjun Mehta</div>
            <div className="text-[11px] text-blue-600 font-medium">Internal Medicine</div>
          </div>
          <ChevronDown size={15} className="text-slate-400 ml-1" />
        </button>
      </div>
    </header>
  );
}
