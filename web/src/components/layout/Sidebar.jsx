import React from 'react';
import { Home, Search, User, HeartPulse, MessageSquare, Clock, Pill, FileText, Calendar, AlertTriangle, Settings, ShieldCheck, Activity } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { name: 'Home', icon: Home, active: true },
    { name: 'Find Patient', icon: Search, active: false },
    { name: 'Patient Overview', icon: User, active: false },
    { name: 'What Matters Now', icon: HeartPulse, active: false },
    { name: 'Ask Health Memory', icon: MessageSquare, active: false },
    { name: 'Patient Journey', icon: Clock, active: false },
    { name: 'Medications', icon: Pill, active: false },
    { name: 'Medical Documents', icon: FileText, active: false },
    { name: 'Upcoming & Follow-ups', icon: Calendar, active: false },
    { name: 'Emergency Profile', icon: AlertTriangle, active: false },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 h-screen flex flex-col fixed top-0 left-0 shadow-sm z-20">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Activity size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900 leading-tight">
              Health<span className="text-blue-600">Track</span>
            </div>
            <div className="text-[10px] text-blue-600/90 font-semibold tracking-wide mt-0.5">DOCTOR PORTAL</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.name}>
              <a 
                href="#" 
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  item.active 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' 
                    : 'text-slate-600 hover:bg-blue-50/70 hover:text-blue-700'
                }`}
              >
                <item.icon size={18} className={item.active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} />
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <a href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50/70 hover:text-blue-700 transition-colors">
            <Settings size={18} className="text-slate-400" />
            Settings
          </a>
        </div>
      </nav>

      {/* Bottom Illustration & Badge */}
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-4 rounded-2xl mb-3 relative overflow-hidden text-white shadow-md shadow-blue-600/15">
          <div className="relative z-10">
            <p className="text-sm font-extrabold leading-tight">Better context.</p>
            <p className="text-sm font-extrabold leading-tight mb-1 text-blue-100">Better care.</p>
            <p className="text-xs font-medium text-blue-100/90 leading-tight">Healthier tomorrows.</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
          <div className="absolute -top-4 right-2 w-16 h-16 bg-blue-400/20 rounded-full blur-md"></div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 px-2 py-1">
          <ShieldCheck size={16} className="text-blue-600 shrink-0" />
          <div className="text-[11px] leading-tight font-medium text-slate-500">
            Secure. Consent-Driven. <br/> Patient-Centric.
          </div>
        </div>
      </div>
    </aside>
  );
}
