import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  User, 
  HeartPulse, 
  MessageSquare, 
  Clock, 
  Pill, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  HelpCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('Home');

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Find Patient', icon: Search },
    { name: 'Patient Overview', icon: User },
    { name: 'What Matters Now', icon: HeartPulse },
    { name: 'Ask Health Memory', icon: MessageSquare },
    { name: 'Patient Journey', icon: Clock },
    { name: 'Medications', icon: Pill },
    { name: 'Medical Documents', icon: FileText },
    { name: 'Upcoming & Follow-ups', icon: Calendar },
    { name: 'Emergency Profile', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 h-screen flex flex-col fixed top-0 left-0 z-20 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/30">
            <HeartPulse size={20} />
          </div>
          <div>
            <span className="font-extrabold text-base text-slate-800 tracking-tight">CuraTrack</span>
            <div className="text-[10px] text-slate-400 font-medium">Doctor Workspace</div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeItem === item.name;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 translate-x-1'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon 
                size={17} 
                className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} 
              />
              <span>{item.name}</span>
            </button>
          );
        })}

        {/* Secondary Links */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
            <HelpCircle size={16} className="text-slate-400" />
            <span>Help & Support</span>
          </button>
        </div>
      </nav>

      {/* Language Selector (Reference 1 style) */}
      <div className="px-4 py-2 border-t border-slate-100">
        <button className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/60 transition-colors">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-slate-500" />
            <span>English (IN)</span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>

      {/* Helper Card (Reference 1 CivicConnect Promo Card style) */}
      <div className="p-4 pt-2">
        <div className="bg-gradient-to-br from-blue-50 via-teal-50/60 to-indigo-50/50 p-3.5 rounded-2xl border border-blue-100 relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-blue-800 font-extrabold text-xs mb-1">
              <Sparkles size={13} className="text-blue-600" />
              <span>AI Health Memory</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug mb-2.5">
              Complete longitudinal history synthesis for geriatric care.
            </p>
            <button className="w-full py-1.5 px-3 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200/80 rounded-lg text-[11px] font-bold shadow-xs transition-colors">
              Clinical Insights
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
