'use client';

import React from 'react';
import { Info, FileText, CreditCard, Building2 } from 'lucide-react';

interface ProcesoInstructionsProps {
  isSelectedStudent: boolean;
}

export default function ProcesoInstructions({ isSelectedStudent }: ProcesoInstructionsProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-slate-50 border border-blue-200 rounded-3xl p-5 md:p-7 space-y-4 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          <Info className="w-5 h-5 text-white" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm md:text-base font-bold text-blue-950">
            {isSelectedStudent
              ? 'Instrucciones Obligatorias para Adjuntar Documentos (F-1)'
              : 'Instrucciones para Adjuntar Documentos de Postulante (B-2)'}
          </h4>
          <p className="text-xs text-blue-900/80 leading-relaxed font-medium">
            {isSelectedStudent
              ? 'Para asegurar la correcta revisión de tu trámite de estudiante y emisión de I-20, por favor adjunta los siguientes documentos siguiendo las especificaciones oficiales:'
              : 'Para completar tu trámite de Visa de Turista y llenado oficial del formulario DS-160, por favor adjunta tu fotografía oficial y la fotografía/escaneo de tu pasaporte vigente:'}
          </p>
        </div>
      </div>

      <div
        className={`grid gap-3 pt-2 text-xs ${
          isSelectedStudent ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {/* Rule 1: Formato PDF Escaneado */}
        <div className="p-4 rounded-2xl bg-white/80 border border-blue-100 space-y-2 shadow-2xs backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <strong className="text-slate-900 font-bold text-xs">Formato Preferido: PDF o Imagen Nítida</strong>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Preferiblemente <strong>escaneado y en formato PDF</strong> (también se aceptan fotografías nítidas en JPG/PNG). Asegúrate de que las 4 esquinas sean visibles y todo el texto sea 100% legible sin sombras ni reflejos.
          </p>
        </div>

        {/* Rule 2: Pasaporte Oficial */}
        <div className="p-4 rounded-2xl bg-white/80 border border-blue-100 space-y-2 shadow-2xs backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <strong className="text-slate-900 font-bold text-xs">Fotografía / Escaneo de Pasaporte</strong>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Escaneo o foto a color de la página principal (con fotografía y datos biográficos). Debe tener al menos <strong>6 meses de vigencia</strong> respecto a tu fecha estimada de viaje.
          </p>
        </div>

        {/* Rule 3: Estado de Cuenta (SÓLO PARA ESTUDIANTES) */}
        {isSelectedStudent && (
          <div className="p-4 rounded-2xl bg-white/80 border border-blue-100 space-y-2 shadow-2xs backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <strong className="text-slate-900 font-bold text-xs">Estado de Cuenta Bancario</strong>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Extracto bancario oficial reciente de los <strong>últimos 3 meses</strong> que demuestre la solvencia económica del postulante o de su patrocinador/sponsor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
