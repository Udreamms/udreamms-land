'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Briefcase,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicantInfo, StageInfo } from '../types';

interface ProcesoCardsGridProps {
  unlockedStudent: boolean;
  unlockedTourist: boolean;
  studentApplicants: string[];
  touristApplicants: string[];
  visaFilter: 'all' | 'estudiante' | 'turista';
  setVisaFilter: (filter: 'all' | 'estudiante' | 'turista') => void;
  allCards: Array<{ visaType: 'estudiante' | 'turista'; applicantId: string }>;
  applicantsData: Record<string, ApplicantInfo>;
  cloudStages: Record<string, string>;
  getStageInfo: (stageId: string) => StageInfo;
  getPlanName: (isStudent: boolean) => string;
  onSelectApplicant: (card: { visaType: 'estudiante' | 'turista'; applicantId: string }) => void;
  onRemoveApplicant: (visaType: 'estudiante' | 'turista', applicantId: string, e: React.MouseEvent) => void;
}

export default function ProcesoCardsGrid({
  unlockedStudent,
  unlockedTourist,
  studentApplicants,
  touristApplicants,
  visaFilter,
  setVisaFilter,
  allCards,
  applicantsData,
  cloudStages,
  getStageInfo,
  getPlanName,
  onSelectApplicant,
  onRemoveApplicant,
}: ProcesoCardsGridProps) {
  const router = useRouter();

  if (allCards.length === 0) {
    return (
      <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600">
          <GraduationCap className="w-8 h-8 text-black" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            No tienes expedientes activos
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Para iniciar tu proceso consular, adquiere tu membresía o plan de asesoría para habilitar tu expediente.
          </p>
        </div>
        <div className="pt-2">
          <Button
            onClick={() => router.push('/portal/planes')}
            className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Ver Planes Disponibles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs if user has both types */}
      {unlockedStudent && unlockedTourist && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setVisaFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              visaFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({studentApplicants.length + touristApplicants.length})
          </button>
          <button
            onClick={() => setVisaFilter('estudiante')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              visaFilter === 'estudiante'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Estudiante F-1 ({studentApplicants.length})
          </button>
          <button
            onClick={() => setVisaFilter('turista')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              visaFilter === 'turista'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Turista B-2 ({touristApplicants.length})
          </button>
        </div>
      )}

      {/* Grid of Independent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {allCards.map((card) => {
          const isStudent = card.visaType === 'estudiante';
          const prefix = isStudent ? 'f1' : 'b2';
          const key = `${prefix}_${card.applicantId}`;
          const data = applicantsData[key];
          const applicantName = data?.name || '';
          const applicantPhoto = data?.photoUrl || null;
          const hasPassport = !!data?.passportDoc;
          const hasBank = !!data?.bankStatementDoc;

          return (
            <div
              key={`${card.visaType}_${card.applicantId}`}
              onClick={() => onSelectApplicant(card)}
              className="group bg-white border border-slate-200 hover:border-blue-400 shadow-xl hover:shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div className="space-y-5 relative z-10">
                {/* Top Row: Icon/Photo & Badges */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-105 transition-transform shrink-0">
                      {applicantPhoto ? (
                        <img
                          src={applicantPhoto}
                          alt="Foto"
                          className="w-full h-full object-cover"
                        />
                      ) : isStudent ? (
                        <GraduationCap className="w-8 h-8 text-black" />
                      ) : (
                        <Briefcase className="w-8 h-8 text-black" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wide bg-blue-50 text-blue-900 border border-blue-200">
                        {getPlanName(isStudent)}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {isStudent ? 'Visa de Estudiante (F-1)' : 'Visa de Turista (B-2)'}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => onRemoveApplicant(card.visaType, card.applicantId, e)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 flex items-center justify-center cursor-pointer shadow-2xs group/del"
                      title={`Eliminar tarjeta de ${isStudent ? 'Visa de Estudiante F-1' : 'Visa de Turista B-2'}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-600 group-hover/del:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Applicant Name */}
                <p className="text-sm font-bold text-slate-900 truncate">
                  {applicantName || 'Nombre sin asignar (Pendiente)'}
                </p>

                {/* Real-time Stage Progression Banner from Staff */}
                {(() => {
                  const currentStage = cloudStages[prefix] || 'nuevos';
                  const stageInfo = getStageInfo(currentStage);
                  return (
                    <div
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-2xs ${stageInfo.color}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${stageInfo.dot} animate-pulse shrink-0`} />
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                            Etapa Actual de tu Trámite:
                          </span>
                          <span className="text-xs font-black truncate block">
                            {stageInfo.label}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white/90 border border-current/20 px-2 py-0.5 rounded-full shrink-0">
                        Paso {stageInfo.number}/10
                      </span>
                    </div>
                  );
                })()}

                {/* Description & Included Features */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isStudent
                    ? 'Expediente académico, emisión de I-20, formulario oficial DS-160, pasaporte, solvencia económica y preparación para entrevista F-1.'
                    : 'Evaluación de perfil turístico, estrategia de arraigo, formulario oficial DS-160, pasaporte y simulacro de entrevista consular B-2.'}
                </p>
              </div>

              {/* Card Footer Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="text-xs font-semibold text-slate-500">
                  {data?.status === 'completado' && hasPassport && (!isStudent || hasBank)
                    ? 'Expediente listo para revisión'
                    : 'Completar datos y documentos'}
                </span>
                <Button className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 group-hover:translate-x-1 transition-all shadow-md shadow-blue-500/20 cursor-pointer">
                  <span>Gestionar Expediente</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
