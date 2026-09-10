import React from 'react';
import { Home, Search, User, HeartPulse, MessageSquare, Clock, Pill, FileText, Calendar, AlertTriangle, Settings, ShieldCheck } from 'lucide-react';

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
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed top-0 left-0">
      <div className="p-6">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <HeartPulse className="text-teal-500 fill-teal-100" size={24} />
          <div>
            Health Memory
            <div className="text-[10px] text-slate-500 font-normal mt-0.5">A lifetime of care. Together.</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <a 
                href="#" 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={18} className={item.active ? 'text-blue-600' : 'text-slate-400'} />
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-4 border-t border-slate-100">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <Settings size={18} className="text-slate-400" />
            Settings
          </a>
        </div>
      </nav>

      {/* Bottom Illustration & Badge */}
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-b from-blue-50 to-green-50 p-4 rounded-xl mb-4 relative overflow-hidden h-32">
          <div className="relative z-10">
            <p className="text-sm font-bold text-slate-800 leading-tight">Better context.</p>
            <p className="text-sm font-bold text-slate-800 leading-tight mb-1">Better care.</p>
            <p className="text-sm font-medium text-slate-600 leading-tight">Healthier tomorrows.</p>
          </div>
          {/* Abstract background shapes mimicking the image */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-200 rounded-full opacity-50 blur-xl"></div>
          <div className="absolute -bottom-2 left-2 w-16 h-16 bg-blue-200 rounded-full opacity-50 blur-lg"></div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
          <ShieldCheck size={16} className="text-slate-400" />
          <div>
            Secure. Consent-Driven. <br/> Patient-Centric.
          </div>
        </div>
      </div>
    </aside>
  );
}
