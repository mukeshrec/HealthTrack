import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F4F7FB] flex font-sans">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <TopNav />

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="px-8 py-4 border-t border-slate-200 flex justify-between items-center text-xs font-medium text-slate-500 bg-white">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Health Memory</span>
            <span>|</span>
            <span>Government of India</span>
            <span>|</span>
            <span>Ayushman Bharat Digital Health</span>
          </div>
          <div>More human care. Powered by AI.</div>
        </footer>
      </div>
    </div>
  );
}
