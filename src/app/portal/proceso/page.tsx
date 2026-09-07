'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Briefcase, Check, ArrowRight, ArrowLeft, ShieldCheck, Lock, Camera, Upload, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal } from "../PortalContext";
import LockOverlay from "../components/LockOverlay";
import FormularioConsular from "./components/FormularioConsular";
import { toast } from "sonner";

export default function ProcesoPage() {
  const router = useRouter();
  const { activeTopSection, setActiveTopSection, isUnlocked, user } = usePortal();
  
  // Selected process card state: 'estudiante' | 'turista' | null
  const [selectedCard, setSelectedCard] = useState<'estudiante' | 'turista' | null>(null);

  // Applicant Names State
  const [f1Name, setF1Name] = useState<string>('');
  const [b2Name, setB2Name] = useState<string>('');

  // Photo upload states
  const [studentPhoto, setStudentPhoto] = useState<string | null>(null);
  const [touristPhoto, setTouristPhoto] = useState<string | null>(null);

  const unlockedStudent = isUnlocked('proceso', 'estudiante');
  const unlockedTourist = isUnlocked('proceso', 'turista');

  // Read applicant names & photos from saved form data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedF1 = localStorage.getItem('udreamms_form_f1');
        if (savedF1) {
          const parsed = JSON.parse(savedF1);
          const fullName = `${parsed.nombres || ''} ${parsed.apellidos || ''}`.trim();
          if (fullName) setF1Name(fullName);
        }
        const savedB2 = localStorage.getItem('udreamms_form_b2');
        if (savedB2) {
          const parsed = JSON.parse(savedB2);
          const fullName = `${parsed.nombres || ''} ${parsed.apellidos || ''}`.trim();
          if (fullName) setB2Name(fullName);
        }

        const savedPhotoF1 = localStorage.getItem('udreamms_photo_f1');
        if (savedPhotoF1) setStudentPhoto(savedPhotoF1);

        const savedPhotoB2 = localStorage.getItem('udreamms_photo_b2');
        if (savedPhotoB2) setTouristPhoto(savedPhotoB2);
      } catch (e) {
        // ignore parse error
      }
    }
  }, [selectedCard]);

  // Handle card click
  const handleSelectProcess = (type: 'estudiante' | 'turista') => {
    setSelectedCard(type);
    setActiveTopSection(type === 'estudiante' ? 'visa-estudiante' : 'visa-turista');
  };

  const currentType = selectedCard || (activeTopSection === 'visa-estudiante' ? 'estudiante' : 'turista');
  const isStudent = currentType === 'estudiante';
  const unlocked = isStudent ? unlockedStudent : unlockedTourist;

  const currentPhoto = isStudent ? studentPhoto : touristPhoto;
  const setCurrentPhoto = async (photo: string | null) => {
    const photoKey = isStudent ? 'udreamms_photo_f1' : 'udreamms_photo_b2';
    if (photo) {
      if (typeof window !== 'undefined') localStorage.setItem(photoKey, photo);
      if (isStudent) setStudentPhoto(photo);
      else setTouristPhoto(photo);
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(photoKey);
      if (isStudent) setStudentPhoto(null);
      else setTouristPhoto(null);
    }

    try {
      const storageKey = `udreamms_form_${isStudent ? 'f1' : 'b2'}`;
      const savedForm = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      const parsedForm = savedForm ? JSON.parse(savedForm) : {};
      
      await fetch('/api/portal/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visaType: isStudent ? 'F-1' : 'B-2',
          formData: parsedForm,
          photoUrl: photo,
          userEmail: user?.email || parsedForm.email_contacto || '',
          userName: user?.displayName || `${parsedForm.nombres || ''} ${parsedForm.apellidos || ''}`.trim(),
          userId: user?.uid || '',
        })
      });
    } catch (err) {
      console.error('Error syncing photo with cloud:', err);
    }
  };

  // Handle Photo File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona un archivo de imagen válido (JPG, PNG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const photoData = event.target.result as string;
        setCurrentPhoto(photoData);
        toast.success("¡Fotografía oficial cargada y guardada automáticamente!");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Mi Proceso
          </h2>
          <p className="text-sm text-slate-500">
            {selectedCard 
              ? `Gestionando tu ${isStudent ? "Visa de Estudiante F-1" : "Visa de Turista B-2"}`
              : "Selecciona el servicio de visa que deseas gestionar."}
          </p>
        </div>

        {selectedCard && (
          <Button
            onClick={() => setSelectedCard(null)}
            className="self-start sm:self-auto h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            Volver a mis procesos
          </Button>
        )}
      </div>

      {/* VIEW 1: PROCESS CARDS SELECTION */}
      {!selectedCard ? (
        !unlockedStudent && !unlockedTourist ? (
          /* Empty State: No active visa processes purchased */
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-10 md:p-14 text-center space-y-4 max-w-2xl mx-auto mt-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                No tienes ningún proceso consular activo
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Cuando adquieras tu proceso de <strong>Visa de Estudiante (F-1)</strong> o <strong>Visa de Turista (B-2)</strong>, aparecerán aquí las tarjetas de gestión y el formulario consular para cada familiar.
              </p>
            </div>
            <div className="pt-2">
              <Button 
                onClick={() => router.push('/portal')}
                className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all"
              >
                Ver Servicios Disponibles
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Card 1: Visa de Estudiante F-1 (Only if purchased) */}
            {unlockedStudent && (
              <div 
                onClick={() => handleSelectProcess('estudiante')}
                className="group bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-7 h-7 text-black" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Servicio Activo
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Visa de Estudiante (F-1)
                    </h3>
                    
                    {/* Dynamic Applicant Name */}
                    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      f1Name 
                        ? "bg-blue-50 border-blue-200 text-blue-900 shadow-sm" 
                        : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}>
                      <User className={`w-4 h-4 ${f1Name ? "text-blue-600" : "text-black"}`} />
                      <span>Postulante: <span className={f1Name ? "text-slate-900 font-extrabold" : "font-normal text-slate-500"}>{f1Name || 'Sin asignar (Ingresar datos)'}</span></span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Seguimiento de trámite escolar, emisión de I-20, formulario DS-160 y simulacros de entrevista consular F-1.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                  <span className="text-xs font-semibold text-slate-500">
                    Acceso completo
                  </span>
                  <Button className="h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 group-hover:translate-x-1 transition-all shadow-md shadow-blue-500/20">
                    Abrir Proceso
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            )}

            {/* Card 2: Visa de Turista B-2 (Only if purchased) */}
            {unlockedTourist && (
              <div 
                onClick={() => handleSelectProcess('turista')}
                className="group bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Briefcase className="w-7 h-7 text-black" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Servicio Activo
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Visa de Turista (B-2)
                    </h3>

                    {/* Dynamic Applicant Name */}
                    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      b2Name 
                        ? "bg-blue-50 border-blue-200 text-blue-900 shadow-sm" 
                        : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}>
                      <User className={`w-4 h-4 ${b2Name ? "text-blue-600" : "text-black"}`} />
                      <span>Postulante: <span className={b2Name ? "text-slate-900 font-extrabold" : "font-normal text-slate-500"}>{b2Name || 'Sin asignar (Ingresar datos)'}</span></span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Evaluación de perfil turístico, estrategia de arraigo, DS-160 y preparación para entrevista consular B-2.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                  <span className="text-xs font-semibold text-slate-500">
                    Acceso completo
                  </span>
                  <Button className="h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 group-hover:translate-x-1 transition-all shadow-md shadow-blue-500/20">
                    Abrir Proceso
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            )}

          </div>
        )
      ) : (

        /* VIEW 2: DETAILED PROCESS STEPPER & PHOTO UPLOADER */
        <div className="relative min-h-[450px]">
          {!unlocked && (
            <LockOverlay itemId={isStudent ? 'proceso-estudiante' : 'proceso-turista'} />
          )}

          <div className="w-full bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 space-y-8">
            
            {/* Process Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-900 text-[10px] font-bold uppercase tracking-widest">
                    {unlocked ? "Servicio Activo" : "Servicio Bloqueado"}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Postulante: {isStudent ? (f1Name || 'Sin asignar') : (b2Name || 'Sin asignar')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 pt-1">
                  {isStudent ? "Asesoría de Visa de Estudiante F-1" : "Asesoría de Visa de Turista B-2"}
                </h3>
              </div>
              {isStudent ? (
                <GraduationCap className="w-8 h-8 text-black shrink-0" />
              ) : (
                <Briefcase className="w-8 h-8 text-black shrink-0" />
              )}
            </div>

            {/* SECCIÓN DE CARGA DE FOTOGRAFÍA OFICIAL */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  {/* Photo Preview Container */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                    {currentPhoto ? (
                      <img 
                        src={currentPhoto} 
                        alt="Fotografía de Visa" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                        <User className="w-8 h-8 text-slate-400" />
                        <span className="text-[9px] font-bold uppercase mt-1">Sin Foto</span>
                      </div>
                    )}
                  </div>

                  {/* Photo Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-black" />
                      <h4 className="text-sm font-bold text-slate-900">Fotografía Oficial para el Trámite</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                      Sube una fotografía reciente en fondo blanco (tipo pasaporte, 5x5 cm / 2x2 pulg) requerida para la postulación y el formulario DS-160.
                    </p>
                    {currentPhoto && (
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                        Fotografía Cargada
                      </span>
                    )}
                  </div>
                </div>

                {/* Upload & Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  <label className="flex-1 sm:flex-initial">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    <span className="w-full sm:w-auto h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-white" />
                      {currentPhoto ? "Cambiar Foto" : "Cargar Fotografía"}
                    </span>
                  </label>

                  {currentPhoto && (
                    <Button
                      onClick={() => {
                        setCurrentPhoto(null);
                        toast.info("Fotografía removida.");
                      }}
                      variant="outline"
                      className="h-10 w-10 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all"
                      title="Eliminar fotografía"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>

              </div>
            </div>

            {/* FORMULARIO CONSULAR OFICIAL */}
            <FormularioConsular 
              isStudent={isStudent} 
              onNameChange={(name) => {
                if (isStudent) setF1Name(name);
                else setB2Name(name);
              }}
            />

          </div>
        </div>
      )}

    </div>
  );
}


