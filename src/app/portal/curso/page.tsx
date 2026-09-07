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
    <div className="space-y-6 text-slate-900">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Master class express
        </h2>
        <p className="text-sm text-slate-500">Capacítate con nuestros videocursos prácticos dictados por mentores autorizados.</p>
      </div>

      <div className="relative min-h-[450px]">
        {!unlocked && (
          <LockOverlay itemId={isStudent ? 'curso-estudiante' : 'curso-turista'} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Video Player Area */}
          <div className="lg:col-span-2 bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden flex flex-col">
            {isStudent ? (
              <div className="aspect-video bg-slate-900 w-full relative flex items-center justify-center border-b border-slate-200">
                <video
                  key={studentModules[activeStudentStep].videoUrl}
                  src={studentModules[activeStudentStep].videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              touristModules[activeTouristStep].videoUrl ? (
                <div className="aspect-video bg-slate-900 w-full relative flex items-center justify-center border-b border-slate-200">
                  <video
                    key={touristModules[activeTouristStep].videoUrl}
                    src={touristModules[activeTouristStep].videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-slate-900 w-full relative flex items-center justify-center border-b border-slate-200 group">
                  <Video className="w-16 h-16 text-white/80 group-hover:text-white transition-all cursor-pointer" />
                  <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-[10px] font-bold tracking-wider text-white uppercase">Vista previa del curso</span>
                </div>
              )
            )}
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                {isStudent 
                  ? studentModules[activeStudentStep].title 
                  : touristModules[activeTouristStep].title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isStudent
                  ? studentModules[activeStudentStep].description
                  : touristModules[activeTouristStep].description}
              </p>
            </div>
          </div>

          {/* Modules List */}
          <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 space-y-4">
            <h3 className="text-md font-bold text-slate-900 tracking-wide border-b border-slate-100 pb-3">Módulos del Curso</h3>
            
            <div className="space-y-2 overflow-y-auto max-h-[350px] pr-2">
              {isStudent ? (
                studentModules.map((mod, index) => {
                  const isActive = activeStudentStep === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveStudentStep(index)}
                      className={`p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer group ${
                        isActive 
                          ? "bg-blue-50 border border-blue-200 text-blue-700" 
                          : "hover:bg-slate-50 border border-slate-100 text-slate-700"
                      }`}
                    >
                      <span className={`text-xs font-medium ${isActive ? "font-bold text-blue-700" : "text-slate-700 group-hover:text-slate-900"}`}>
                        {mod.title}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full uppercase">
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
                          ? "bg-blue-50 border border-blue-200 text-blue-700" 
                          : "hover:bg-slate-50 border border-slate-100 text-slate-700"
                      }`}
                    >
                      <span className={`text-xs font-medium ${isActive ? "font-bold text-blue-700" : "text-slate-700 group-hover:text-slate-900"}`}>
                        {mod.title}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full uppercase">
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
