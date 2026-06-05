'use client';

import React from "react";
import { GraduationCap, Briefcase, Check } from "lucide-react";
import { usePortal } from "../PortalContext";
import LockOverlay from "../components/LockOverlay";

export default function ProcesoPage() {
  const { activeTopSection, isUnlocked } = usePortal();
  
  const isStudent = activeTopSection === 'visa-estudiante';
  const unlocked = isUnlocked('proceso', isStudent ? 'estudiante' : 'turista');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight">
          {isStudent ? "Mi Proceso de Admisión" : "Mi Proceso de Solicitud"}
        </h2>
        <p className="text-sm text-white/50">Monitorea y gestiona el avance de tu trámite de visa en tiempo real.</p>
      </div>

      <div className="relative min-h-[450px]">
        {!unlocked && (
          <LockOverlay itemId={isStudent ? 'proceso-estudiante' : 'proceso-turista'} />
        )}

        <div className={`w-full bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 space-y-8 ${!unlocked ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-normal uppercase tracking-widest">Servicio Activo</span>
              <h3 className="text-xl font-normal pt-1">
                {isStudent ? "Asesoría de Visa de Estudiante F-1" : "Asesoría de Visa de Turista B-2"}
              </h3>
            </div>
            {isStudent ? (
              <GraduationCap className="w-8 h-8 text-purple-400 shrink-0" />
            ) : (
              <Briefcase className="w-8 h-8 text-purple-400 shrink-0" />
            )}
          </div>

          {/* Stepper progress */}
          <div className="relative pt-4 pl-4 space-y-8">
            {/* Vertical line connecting steps */}
            <div className="absolute top-6 left-7 bottom-6 w-[2px] bg-gradient-to-b from-purple-500 via-purple-500/40 to-white/5" />

            {/* Step 1 */}
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-normal text-white">Registro e Inicio de Proceso</h4>
                <p className="text-xs text-white/50">Tu perfil ha sido registrado correctamente en la plataforma.</p>
                <span className="text-[10px] font-normal text-purple-400 uppercase tracking-widest">Completado</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-7 h-7 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-normal text-white">
                  {isStudent ? "Evaluación de Perfil Académico" : "Evaluación de Perfil Turístico"}
                </h4>
                <p className="text-xs text-white/50">
                  {isStudent 
                    ? "Nuestros expertos están validando tus datos e institución recomendada." 
                    : "Nuestros expertos están validando tus lazos familiares, económicos y laborales."}
                </p>
                <span className="text-[10px] font-normal text-amber-400 uppercase tracking-widest">En Progreso</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                <span className="text-xs font-normal">3</span>
              </div>
              <div className="space-y-1 opacity-50">
                <h4 className="text-sm font-normal text-white">Preparación de Documentación y Formulario DS-160</h4>
                <p className="text-xs text-white/50">
                  {isStudent
                    ? "Llenado y recopilación de documentos financieros y formularios consulares."
                    : "Llenado y recopilación de lazos en tu país y formulario consular DS-160."}
                </p>
                <span className="text-[10px] font-normal text-white/30 uppercase tracking-widest">Pendiente</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                <span className="text-xs font-normal">4</span>
              </div>
              <div className="space-y-1 opacity-50">
                <h4 className="text-sm font-normal text-white">Simulacro y Cita Consular</h4>
                <p className="text-xs text-white/50">Capacitación intensiva para tu entrevista presencial con el cónsul.</p>
                <span className="text-[10px] font-normal text-white/30 uppercase tracking-widest">Pendiente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
