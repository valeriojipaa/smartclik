import React from 'react';
import { Sidebar } from '@/components/Sidebar';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="sc-app flex min-h-screen bg-[#F8F9FC] text-slate-900">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
