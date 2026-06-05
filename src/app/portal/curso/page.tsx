'use client';

import React from "react";
import { Video } from "lucide-react";
import { usePortal, studentModules, touristModules } from "../PortalContext";
import LockOverlay from "../components/LockOverlay";

export default function CursoPage() {
  const {
    activeTopSection,
    isUnlocked,
    activeStudentStep,
    setActiveStudentStep,
    activeTouristStep,
    setActiveTouristStep
  } = usePortal();

  const isStudent = activeTopSection === 'visa-estudiante';
  const unlocked = isUnlocked('curso', isStudent ? 'estudiante' : 'turista');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight">
          Master class express
        </h2>
        <p className="text-sm text-white/50">Capacítate con nuestros videocursos prácticos dictados por mentores autorizados.</p>
      </div>

      <div className="relative min-h-[450px]">
        {!unlocked && (
          <LockOverlay itemId={isStudent ? 'curso-estudiante' : 'curso-turista'} />
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${!unlocked ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
          
          {/* Video Player Area */}
          <div className="lg:col-span-2 bg-[#0d0d11] border border-white/5 rounded-3xl overflow-hidden flex flex-col">
            {isStudent ? (
              <div className="aspect-video bg-zinc-950 w-full relative flex items-center justify-center border-b border-white/5">
                <video
                  key={studentModules[activeStudentStep].videoUrl}
                  src={studentModules[activeStudentStep].videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              touristModules[activeTouristStep].videoUrl ? (
                <div className="aspect-video bg-zinc-950 w-full relative flex items-center justify-center border-b border-white/5">
                  <video
                    key={touristModules[activeTouristStep].videoUrl}
                    src={touristModules[activeTouristStep].videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-zinc-950 w-full relative flex items-center justify-center border-b border-white/5 group">
                  <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/0 transition-all pointer-events-none" />
                  <Video className="w-16 h-16 text-white/40 group-hover:text-white transition-all cursor-pointer" />
                  <span className="absolute bottom-4 left-4 px-3 py-1 rounded bg-black/60 backdrop-blur text-[10px] font-normal tracking-wider text-white/80">Vista previa del curso</span>
                </div>
              )
            )}
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-normal">
                {isStudent 
                  ? studentModules[activeStudentStep].title 
                  : touristModules[activeTouristStep].title}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {isStudent
                  ? studentModules[activeStudentStep].description
                  : touristModules[activeTouristStep].description}
              </p>
            </div>
          </div>

          {/* Modules List */}
          <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4">
            <h3 className="text-md font-normal tracking-wide border-b border-white/5 pb-2">Módulos del Curso</h3>
            
            <div className="space-y-2 overflow-y-auto max-h-[350px] pr-2 no-scrollbar">
              {isStudent ? (
                studentModules.map((mod, index) => {
                  const isActive = activeStudentStep === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveStudentStep(index)}
                      className={`p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer group ${
                        isActive 
                          ? "bg-purple-500/10 border border-purple-500/20" 
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <span className={`text-xs ${isActive ? "font-normal text-purple-400" : "text-white/80 group-hover:text-white"}`}>
                        {mod.title}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-normal text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded uppercase">
                          Viendo
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                touristModules.map((mod, index) => {
                  const isActive = activeTouristStep === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveTouristStep(index)}
                      className={`p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer group ${
                        isActive 
                          ? "bg-purple-500/10 border border-purple-500/20" 
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <span className={`text-xs ${isActive ? "font-normal text-purple-400" : "text-white/80 group-hover:text-white"}`}>
                        {mod.title}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-normal text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded uppercase">
                          Viendo
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
