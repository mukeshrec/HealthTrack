import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800">Doctor Portal</h1>
        <div className="w-px h-6 bg-slate-200"></div>
        <p className="text-sm text-slate-500 font-medium">Complete context. Better decisions.</p>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Search size={20} />
        </button>
        <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="w-px h-6 bg-slate-200"></div>

        <button className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            DR
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">Dr. Arjun Mehta</div>
            <div className="text-xs text-slate-500">General Physician</div>
          </div>
          <ChevronDown size={16} className="text-slate-400 ml-2" />
        </button>
      </div>
    </header>
  );
}
