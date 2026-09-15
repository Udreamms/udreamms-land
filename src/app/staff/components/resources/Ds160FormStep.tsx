'use client';

import React from 'react';
import { FileCheck, ExternalLink, Lightbulb, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DS160_URL } from './resourcesData';

export const Ds160FormStep: React.FC = () => {
  return (
    <div className="bg-white border-2 border-sky-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header of Step 3 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 font-black text-lg">
            3
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Paso 3: Formulario Consular Oficial DS-160 (CEAC)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-extrabold uppercase border border-sky-200">
                Departamento de Estado EE.UU.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Consular Electronic Application Center (CEAC) • Transcripción oficial de las 13 secciones del expediente.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={DS160_URL}
            target="_blank"
            rel="noreferrer"
            className="h-10 px-5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-sky-500/20 transition-all cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>Abrir Portal CEAC (DS-160)</span>
            <ExternalLink className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>

      {/* Info Callout */}
      <div className="bg-gradient-to-r from-sky-50/90 to-blue-50/70 border border-sky-200 rounded-2xl p-5 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-sky-950 font-bold">
          <Lightbulb className="w-4 h-4 text-sky-600" />
          <span>Reglas de Oro para Llenar el DS-160:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
          <li>
            Guardar de inmediato el <strong>Application ID (ej. AA00XXXXXX)</strong> y la respuesta a la pregunta de seguridad.
          </li>
          <li>
            Todos los datos deben coincidir 100% con el Pasaporte, Formulario I-20 y los campos editables del expediente en Staff.
          </li>
          <li>
            Al finalizar y firmar electrónicamente, descargar la <strong>Hoja de Confirmación DS-160</strong> con código de barras y adjuntarla en el recuadro <strong>6. Confirmación DS-160</strong>.
          </li>
        </ul>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
              1
            </span>
            <strong className="text-slate-900 font-bold text-xs">Iniciar Nueva Solicitud</strong>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Elegir la Embajada o Consulado correspondiente (ej. Lima, Perú / Bogotá, Colombia / Quito, Ecuador) y empezar la solicitud.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
              2
            </span>
            <strong className="text-slate-900 font-bold text-xs">Transcribir Expediente</strong>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Copiar ordenadamente las 13 secciones del expediente: Datos Personales, Escuela, Sponsor, Familia, Trabajo y Viajes anteriores.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
              3
            </span>
            <strong className="text-slate-900 font-bold text-xs">Firmar y Descargar Confirmación</strong>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Cargar foto 5x5, firmar con el número de pasaporte y descargar la hoja de confirmación para el estudiante y la embajada.
          </p>
        </div>
      </div>
    </div>
  );
};
