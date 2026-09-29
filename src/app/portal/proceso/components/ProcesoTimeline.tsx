'use client';

import React from 'react';
import {
  Inbox,
  School,
  FileCheck,
  FileText,
  CreditCard,
  Ticket,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Check
} from 'lucide-react';

export const TIMELINE_STAGES = [
  { id: 'nuevos', stepNumber: 1, title: 'Usuarios Registrados', shortDesc: 'Revisión inicial de expediente', icon: Inbox },
  { id: 'aplicacion_escuela', stepNumber: 2, title: 'Solicitud de Admisión', shortDesc: 'Envío y gestión con la escuela', icon: School },
  { id: 'i20_entregado', stepNumber: 3, title: 'I-20 Recibido', shortDesc: 'Formulario oficial emitido', icon: FileCheck },
  { id: 'ds160', stepNumber: 4, title: 'Preparación de Documentos', shortDesc: 'Llenado y revisión consular DS-160', icon: FileText },
  { id: 'sevis', stepNumber: 5, title: 'Tasa SEVIS (I-901)', shortDesc: 'Gestión y pago oficial SEVIS', icon: CreditCard },
  { id: 'comprar_cita', stepNumber: 6, title: 'Comprar Cita Embajada', shortDesc: 'Arancel MRV y fecha consular', icon: Ticket },
  { id: 'simulacro_entrevista', stepNumber: 7, title: 'Simulacro Entrevista', shortDesc: 'Preparación intensiva previa', icon: MessageSquare },
  { id: 'entrevista', stepNumber: 8, title: 'Cita en Embajada', shortDesc: 'Presentación consular presencial', icon: Calendar },
  { id: 'aprobados', stepNumber: 9, title: 'Aprobados', shortDesc: 'Trámite finalizado con éxito', icon: CheckCircle2 },
];

export const getStageIndex = (status?: string): number => {
  if (!status) return 0;
  const idx = TIMELINE_STAGES.findIndex((s) => s.id === status);
  return idx >= 0 ? idx : 0;
};

interface ProcesoTimelineProps {
  currentStageId?: string;
  applicantName: string;
}

export default function ProcesoTimeline({ currentStageId = 'nuevos', applicantName }: ProcesoTimelineProps) {
  const currentStageIndex = getStageIndex(currentStageId);
  const progressPercentage = Math.round(((currentStageIndex + 1) / TIMELINE_STAGES.length) * 100);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 space-y-6 shadow-sm">
      {/* Timeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h4 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
              Solicitud principal · {applicantName}
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-normal pt-1">
            Cada familiar o postulante tiene su propia tarjeta de seguimiento de expediente.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
            Paso {currentStageIndex + 1} de {TIMELINE_STAGES.length}
          </span>
        </div>
      </div>

      {/* Horizontal Progress Bar */}
      <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Steps Grid / Scroll Container without native scrollbars */}
      <div className="overflow-x-auto no-scrollbar pb-2 pt-1 -mx-2 px-2">
        <div className="grid grid-flow-col auto-cols-[minmax(140px,1fr)] md:grid-cols-9 gap-2 md:gap-3 min-w-[1080px] md:min-w-0">
          {TIMELINE_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-200 relative ${
                  isCurrent
                    ? 'bg-blue-50/70 border-2 border-blue-600 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50/80 border border-slate-200/80'
                    : 'bg-white border border-slate-100 opacity-60'
                }`}
              >
                {/* Step Badge / Circle */}
                <div className="mb-2.5 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/30 ring-4 ring-blue-100 animate-pulse">
                      {stage.stepNumber}
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center font-semibold text-xs">
                      {stage.stepNumber}
                    </div>
                  )}
                </div>

                {/* Step Title */}
                <h5
                  className={`text-xs leading-snug line-clamp-2 min-h-[32px] flex items-center justify-center ${
                    isCurrent
                      ? 'font-bold text-blue-950'
                      : isCompleted
                      ? 'font-semibold text-slate-900'
                      : 'font-medium text-slate-500'
                  }`}
                >
                  {stage.title}
                </h5>

                {/* Step Status Subtext */}
                <p className="text-[10px] text-slate-500 font-normal mt-1 leading-tight line-clamp-2">
                  {isCompleted ? (
                    <span className="text-emerald-700 font-medium">Completado</span>
                  ) : isCurrent ? (
                    <span className="text-blue-700 font-semibold">En proceso</span>
                  ) : (
                    <span className="text-slate-400">Pendiente</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
