'use client';

import React from 'react';
import {
  Sparkles,
  School,
  CreditCard,
  FileCheck,
  UserCheck,
  Layers,
  ArrowDown
} from 'lucide-react';
import { SchoolApplicationStep } from './resources/SchoolApplicationStep';
import { SevisPaymentStep } from './resources/SevisPaymentStep';
import { Ds160FormStep } from './resources/Ds160FormStep';
import { EmbassyInterviewStep } from './resources/EmbassyInterviewStep';
import { ConsularWorkflowStep } from './resources/ConsularWorkflowStep';

export const StaffResources: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 md:p-9 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Manual Operativo & Centro de Recursos Staff
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Guía Integral para Aplicación a Escuelas y Trámite Consular
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Todos los pasos del proceso consular unificados en una sola vista. Lo único que varía según el alumno es la escuela elegida en el <strong>Paso 1</strong>; los demás pasos (SEVIS, DS-160 y Cita Consular) son idénticos para todos los postulantes.
          </p>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-blue-400 to-transparent pointer-events-none" />
      </div>

      {/* Quick Jump Step Navigation Bar */}
      <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2 shadow-md flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-extrabold uppercase text-slate-400 px-3 shrink-0 hidden sm:inline">
          Pasos del Proceso:
        </span>

        <button
          type="button"
          onClick={() => scrollToSection('step-school')}
          className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <School className="w-3.5 h-3.5 text-blue-600" />
          <span>1. Escuela (Lumos, MILA, UCEDA, TALK)</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('step-sevis')}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
          <span>2. Tasa SEVIS ($350)</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('step-ds160')}
          className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <FileCheck className="w-3.5 h-3.5 text-sky-600" />
          <span>3. DS-160 (CEAC)</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('step-embassy')}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>4. Cita AIS, Carpetas & Correo</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('step-workflow')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-slate-700" />
          <span>5. Flujo Consular 10 Fases</span>
        </button>
      </div>

      {/* Unified Step-by-Step Sections */}
      <div className="space-y-8">
        {/* Step 1: School Selection (Variable) */}
        <div id="step-school" className="scroll-mt-18">
          <SchoolApplicationStep />
        </div>

        {/* Step 2: SEVIS Fee */}
        <div id="step-sevis" className="scroll-mt-18">
          <SevisPaymentStep />
        </div>

        {/* Step 3: DS-160 Consular Form */}
        <div id="step-ds160" className="scroll-mt-18">
          <Ds160FormStep />
        </div>

        {/* Step 4: Embassy Interview, AIS Account, Email Format & Folders */}
        <div id="step-embassy" className="scroll-mt-18">
          <EmbassyInterviewStep />
        </div>

        {/* Step 5: Consular Workflow & Quick Links */}
        <div id="step-workflow" className="scroll-mt-18">
          <ConsularWorkflowStep />
        </div>
      </div>
    </div>
  );
};
