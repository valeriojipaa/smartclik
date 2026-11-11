'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Package,
  Layers,
  Store,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Sugestões do mês', href: '/sugestoes', icon: Calendar },
    { label: 'Meus produtos', href: '/produtos', icon: Package },
    { label: 'Minhas campanhas', href: '/campanhas', icon: Layers },
    { label: 'Minha loja', href: '/loja', icon: Store },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`sc-sidebar hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen p-5 select-none ${className}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">Smart</span>
              <span className="font-extrabold text-xl text-purple-600 tracking-tight">Click</span>
            </div>
            <p className="text-[11px] font-medium text-slate-600">Sua lista vira um encarte</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="sc-nav-icon"><Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                /></span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Link & Version */}
        <div className="pt-4 mt-auto border-t border-slate-100 space-y-2">
          <Link
            href="/admin"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
              pathname.startsWith('/admin')
                ? 'bg-slate-100 text-slate-800'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Painel Administrativo</span>
          </Link>
          <div className="px-3 text-[10px] text-slate-600">
            SmartClick • Seu espaço de criação
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sc-mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-2 py-1.5 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive ? 'text-purple-600' : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-purple-600' : 'text-slate-600'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
