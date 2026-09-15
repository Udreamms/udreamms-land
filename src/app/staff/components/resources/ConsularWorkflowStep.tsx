'use client';

import React from 'react';
import {
  Layers,
  Globe,
  ExternalLink,
  CheckCircle2,
  Calendar,
  School,
  FileCheck,
  CreditCard,
  UserCheck,
  Award
} from 'lucide-react';
import {
  LUMOS_PORTAL_URL,
  MILA_JOTFORM_URL,
  SEVIS_FEE_URL,
  DS160_URL,
  AIS_PORTAL_URL,
  I94_PORTAL_URL
} from './resourcesData';

export const ConsularWorkflowStep: React.FC = () => {
  const workflowPhases = [
    { num: 1, title: 'Usuarios Registrados', desc: 'Validar pasaporte vigente, foto 5x5 y estado de cuenta inicial.' },
    { num: 2, title: 'Solicitud de Admisión', desc: 'Llenar portal de Lumos, MILA, UCEDA o TALK y remitir a admisiones.' },
    { num: 3, title: 'I-20 Recibido', desc: 'Descargar I-20 oficial emitido por la escuela y subirlo al expediente.' },
    { num: 4, title: 'Preparación de Documentos', desc: 'Reunir antecedentes, solvencia económica y certificados laborales.' },
    { num: 5, title: 'Tasa SEVIS (I-901)', desc: 'Pagar $350 USD en fmjfee.com con SEVIS ID y código de escuela.' },
    { num: 6, title: 'Formulario DS-160 & Cita', desc: 'Llenar CEAC, crear cuenta en AIS con @Udreamms2026 y agendar CAS/Embajada.' },
    { num: 7, title: 'Simulacro de Entrevista', desc: 'Coaching 1 a 1 con el postulante resolviendo preguntas consulares clave.' },
    { num: 8, title: 'Cita en Embajada', desc: 'El estudiante acude con Carpeta 1 (mano) y Carpeta 2 (soporte).' },
    { num: 9, title: 'Aprobados', desc: 'Festejar visa aprobada, coordinar retiro de pasaporte y viaje a EE.UU.' },
    { num: 10, title: 'Negados / Reaplicación', desc: 'Analizar carta 214(b), reforzar arraigo y programar nueva postulación.' },
  ];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header of Step 5 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md font-black text-lg">
            5
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Paso 5: Flujo Consular Integral (10 Fases) & Enlaces Rápidos
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-extrabold uppercase border border-slate-300">
                Manual Operativo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Secuencia oficial de 10 etapas para llevar a cualquier estudiante de registrado a visado aprobado.
            </p>
          </div>
        </div>
      </div>

      {/* 10 Phases Timeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {workflowPhases.map((phase) => (
          <div
            key={phase.num}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 flex flex-col justify-between gap-2 shadow-2xs transition-all"
          >
            <div className="space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                {phase.num}
              </span>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{phase.title}</h4>
              <p className="text-[11px] text-slate-500 leading-snug">{phase.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Official Links Grid */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-600" />
          Enlaces Rápidos a Portales Oficiales:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <a
            href={LUMOS_PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold text-slate-800 flex items-center justify-between gap-1 transition-colors"
          >
            <span className="truncate">Lumos Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>

          <a
            href={MILA_JOTFORM_URL}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold text-slate-800 flex items-center justify-between gap-1 transition-colors"
          >
            <span className="truncate">MILA Form</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>

          <a
            href={SEVIS_FEE_URL}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold text-slate-800 flex items-center justify-between gap-1 transition-colors"
          >
            <span className="truncate">fmjfee (SEVIS)</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>

          <a
            href={DS160_URL}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold text-slate-800 flex items-center justify-between gap-1 transition-colors"
          >
            <span className="truncate">CEAC DS-160</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>

          <a
            href={AIS_PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold text-slate-800 flex items-center justify-between gap-1 transition-colors"
          >
            <span className="truncate">Citas AIS</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>

          <a
            href={I94_PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold text-slate-800 flex items-center justify-between gap-1 transition-colors"
          >
            <span className="truncate">Portal I-94</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
