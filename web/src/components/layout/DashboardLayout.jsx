import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function DashboardLayout({ children, activeItem = 'Home', onNavItemClick }) {
  return (
    <div className="min-h-screen bg-[#F0F4F8] flex font-sans">
      <Sidebar activeItem={activeItem} onNavItemClick={onNavItemClick} />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="px-8 py-4 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-medium text-slate-500 bg-white shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-blue-700">HealthTrack Clinical Engine</span>
            <span>•</span>
            <span>Ayushman Bharat Digital Health Integration</span>
            <span>•</span>
            <span>HIPAA Compliant</span>
          </div>
          <div className="text-slate-400 font-semibold">More human care. Powered by Gemini AI.</div>
        </footer>
      </div>
    </div>
  );
}
