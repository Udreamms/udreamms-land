'use client';

import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffTabType, StudentCase, STAFF_TABS_LIST } from '../types';

interface StaffSidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  activeTab: StaffTabType;
  setActiveTab: (tab: StaffTabType) => void;
  studentCases: StudentCase[];
  onLogout: () => void;
}

export const StaffSidebar: React.FC<StaffSidebarProps> = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  activeTab,
  setActiveTab,
  studentCases,
  onLogout,
}) => {
  return (
    <aside
      className={`shrink-0 fixed top-[18px] left-[18px] z-40 flex flex-col justify-between h-[calc(100vh-36px)] bg-white border border-slate-200 rounded-3xl p-3 md:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.06)] text-black overflow-y-auto no-scrollbar transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* Header with Udreamms Logo & Hamburger Toggle */}
        {isSidebarCollapsed ? (
          <div className="hidden md:flex flex-col items-center gap-3 mb-4 pb-3 border-b border-slate-100 px-1">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm"
              title="Expandir menú"
            >
              <Menu className="w-4 h-4 shrink-0 text-black" />
            </button>
            <div title="Udreamms" className="w-7 h-7 relative cursor-pointer group">
              <img
                src="/icons/new-icon-udreamms.png"
                alt="Udreamms"
                className="object-contain w-full h-full group-hover:scale-110 transition-transform"
              />
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-between mb-4 pb-3 border-b border-slate-100 px-2">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-7 h-7 relative shrink-0">
                <img
                  src="/icons/new-icon-udreamms.png"
                  alt="Udreamms"
                  className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-black">
                Udreamms
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm shrink-0"
              title="Colapsar menú"
            >
              <Menu className="w-4 h-4 shrink-0 text-black" />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">
          {STAFF_TABS_LIST.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = studentCases.filter((c) => c.status === tab.id).length;
            const unreadInTab = studentCases
              .filter((c) => c.status === tab.id && (c.unreadCount || 0) > 0)
              .reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full py-2.5 md:py-3 rounded-xl md:rounded-2xl transition-all duration-200 flex items-center shrink-0 cursor-pointer ${
                  isSidebarCollapsed
                    ? 'justify-center px-0'
                    : 'justify-between px-3 text-left'
                } ${
                  isActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-xs'
                    : 'hover:bg-slate-100 border border-transparent text-slate-700 font-medium'
                }`}
                title={tab.label}
              >
                <div
                  className={`flex items-center min-w-0 ${
                    isSidebarCollapsed ? 'justify-center w-full' : 'gap-3'
                  }`}
                >
                  <div className="relative shrink-0 flex items-center justify-center">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-black'}`} />
                    {unreadInTab > 0 && isSidebarCollapsed && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white animate-pulse" />
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-xs truncate">{tab.label}</span>
                  )}
                </div>

                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {unreadInTab > 0 && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse shadow-xs">
                        {unreadInTab}
                      </span>
                    )}
                    {tab.id === 'recursos' ? (
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                          isActive ? 'bg-amber-500 text-white shadow-xs' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Guía
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Logout */}
      <div className="pt-3 border-t border-slate-100 shrink-0">
        <Button
          onClick={onLogout}
          variant="outline"
          className={`w-full h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-bold uppercase tracking-wider flex items-center transition-all cursor-pointer ${
            isSidebarCollapsed ? 'justify-center px-0' : 'justify-center gap-2'
          }`}
          title="Cerrar Sesión Staff"
        >
          <LogOut className="w-4 h-4 text-red-600 shrink-0" />
          {!isSidebarCollapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </aside>
  );
};
