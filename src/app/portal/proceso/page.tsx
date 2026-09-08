'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Camera,
  Upload,
  Trash2,
  User,
  Plus,
  Users,
  FileCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal } from "../PortalContext";
import LockOverlay from "../components/LockOverlay";
import FormularioConsular from "./components/FormularioConsular";
import { toast } from "sonner";

interface ApplicantInfo {
  id: string;
  name: string;
  photoUrl: string | null;
  status: 'completado' | 'en_progreso' | 'pendiente';
}

interface ActiveApplicantState {
  visaType: 'estudiante' | 'turista';
  applicantId: string;
}

export default function ProcesoPage() {
  const router = useRouter();
  const { isUnlocked, user, dbUser } = usePortal();

  // Active applicant selected for detailed form editing (null = viewing main cards grid)
  const [activeApplicant, setActiveApplicant] = useState<ActiveApplicantState | null>(null);

  // Multi-applicants list for Student Visa (F-1)
  const [studentApplicants, setStudentApplicants] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('udreamms_applicants_f1');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return ['1'];
  });

  // Multi-applicants list for Tourist Visa (B-2)
  const [touristApplicants, setTouristApplicants] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('udreamms_applicants_b2');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return ['1'];
  });

  // Detailed info per applicant cache
  const [applicantsData, setApplicantsData] = useState<Record<string, ApplicantInfo>>({});

  // Filter state for cards: 'all' | 'estudiante' | 'turista'
  const [visaFilter, setVisaFilter] = useState<'all' | 'estudiante' | 'turista'>('all');

  const unlockedStudent = isUnlocked('proceso', 'estudiante');
  const unlockedTourist = isUnlocked('proceso', 'turista');
  const hasUnlockedProcess = unlockedStudent || unlockedTourist;

  const getPlanName = (isStudent: boolean) => {
    if (isStudent) {
      if (dbUser?.purchased_plan_allinclusive) return 'Plan 4: All-Inclusive';
      if (dbUser?.purchased_plan_elite) return 'Plan 3: Elite';
      if (dbUser?.purchased_plan_pro) return 'Plan 2: VIP';
      if (dbUser?.purchased_plan_esencial) return 'Plan 1: Esencial';
      return 'Plan 1: Esencial';
    } else {
      if (dbUser?.purchased_plan_turista_vip) return 'Plan 3: Experiencia VIP';
      if (dbUser?.purchased_plan_turista_premium) return 'Plan 2: Turista Premium';
      if (dbUser?.purchased_plan_turista_basico) return 'Plan 1: Turista Básico';
      return 'Plan 1: Turista Básico';
    }
  };

  const refreshApplicantsData = useCallback(() => {
    if (typeof window === 'undefined') return;
    const cache: Record<string, ApplicantInfo> = {};

    // Load F1 cache
    studentApplicants.forEach((id) => {
      let name = '';
      let status: 'completado' | 'en_progreso' | 'pendiente' = 'pendiente';
      let photoUrl: string | null = null;

      try {
        const rawForm = localStorage.getItem(`udreamms_form_f1_${id}`) || (id === '1' ? localStorage.getItem('udreamms_form_f1') : null);
        if (rawForm) {
          const parsed = JSON.parse(rawForm);
          const fullName = `${parsed.nombres || ''} ${parsed.apellidos || ''}`.trim();
          if (fullName) name = fullName;
          const filledFields = Object.values(parsed).filter(Boolean).length;
          if (filledFields > 15) status = 'completado';
          else if (filledFields > 2) status = 'en_progreso';
        }

        photoUrl = localStorage.getItem(`udreamms_photo_f1_${id}`) || (id === '1' ? localStorage.getItem('udreamms_photo_f1') : null);
      } catch (e) {}

      cache[`f1_${id}`] = { id, name, photoUrl, status };
    });

    // Load B2 cache
    touristApplicants.forEach((id) => {
      let name = '';
      let status: 'completado' | 'en_progreso' | 'pendiente' = 'pendiente';
      let photoUrl: string | null = null;

      try {
        const rawForm = localStorage.getItem(`udreamms_form_b2_${id}`) || (id === '1' ? localStorage.getItem('udreamms_form_b2') : null);
        if (rawForm) {
          const parsed = JSON.parse(rawForm);
          const fullName = `${parsed.nombres || ''} ${parsed.apellidos || ''}`.trim();
          if (fullName) name = fullName;
          const filledFields = Object.values(parsed).filter(Boolean).length;
          if (filledFields > 15) status = 'completado';
          else if (filledFields > 2) status = 'en_progreso';
        }

        photoUrl = localStorage.getItem(`udreamms_photo_b2_${id}`) || (id === '1' ? localStorage.getItem('udreamms_photo_b2') : null);
      } catch (e) {}

      cache[`b2_${id}`] = { id, name, photoUrl, status };
    });

    setApplicantsData(cache);
  }, [studentApplicants, touristApplicants]);

  useEffect(() => {
    refreshApplicantsData();
  }, [refreshApplicantsData, activeApplicant]);

  // Save applicants list to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('udreamms_applicants_f1', JSON.stringify(studentApplicants));
    }
  }, [studentApplicants]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('udreamms_applicants_b2', JSON.stringify(touristApplicants));
    }
  }, [touristApplicants]);

  // Add a new applicant card
  const handleAddApplicant = (visaType: 'estudiante' | 'turista') => {
    const isStudent = visaType === 'estudiante';
    const list = isStudent ? studentApplicants : touristApplicants;
    const nextId = String(Date.now());
    const nextList = [...list, nextId];
    if (isStudent) setStudentApplicants(nextList);
    else setTouristApplicants(nextList);
    toast.success(`¡Nueva tarjeta de postulante agregada (#${nextList.length}) para ${isStudent ? 'Visa de Estudiante F-1' : 'Visa de Turista B-2'}!`);
  };

  // Remove an applicant
  const handleRemoveApplicant = (visaType: 'estudiante' | 'turista', idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isStudent = visaType === 'estudiante';
    const list = isStudent ? studentApplicants : touristApplicants;
    if (list.length <= 1) {
      const prefix = isStudent ? 'f1' : 'b2';
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`udreamms_form_${prefix}_${idToRemove}`);
        localStorage.removeItem(`udreamms_form_${prefix}`);
        localStorage.removeItem(`udreamms_photo_${prefix}_${idToRemove}`);
        localStorage.removeItem(`udreamms_photo_${prefix}`);
      }
      refreshApplicantsData();
      toast.info(`Datos del formulario de ${isStudent ? 'Visa de Estudiante F-1' : 'Visa de Turista B-2'} reiniciados.`);
      return;
    }
    const nextList = list.filter((id) => id !== idToRemove);
    if (isStudent) setStudentApplicants(nextList);
    else setTouristApplicants(nextList);
    toast.info("Tarjeta removida del proceso.");
  };

  // Current active applicant data
  const isSelectedStudent = activeApplicant?.visaType === 'estudiante';
  const activeApplicantKey = activeApplicant ? `${isSelectedStudent ? 'f1' : 'b2'}_${activeApplicant.applicantId}` : '';
  const currentApplicantData = activeApplicantKey ? applicantsData[activeApplicantKey] : null;
  const currentPhoto = currentApplicantData?.photoUrl || null;

  const setCurrentPhoto = async (photo: string | null) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;
    const photoKey = `udreamms_photo_${prefix}_${applicantId}`;

    if (photo) {
      if (typeof window !== 'undefined') localStorage.setItem(photoKey, photo);
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(photoKey);
    }

    refreshApplicantsData();

    try {
      const storageKey = `udreamms_form_${prefix}_${applicantId}`;
      const savedForm = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      const parsedForm = savedForm ? JSON.parse(savedForm) : {};

      await fetch('/api/portal/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visaType: isSelectedStudent ? 'F-1' : 'B-2',
          applicantId,
          formData: parsedForm,
          photoUrl: photo,
          userEmail: user?.email || parsedForm.email_contacto || '',
          userName: user?.displayName || `${parsedForm.nombres || ''} ${parsedForm.apellidos || ''}`.trim(),
          userId: user?.uid || '',
        }),
      });
    } catch (err) {
      console.error('Error syncing photo with cloud:', err);
    }
  };

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
        toast.success("¡Fotografía oficial cargada y guardada!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Collect all independent cards to display
  const allCards: Array<{
    visaType: 'estudiante' | 'turista';
    applicantId: string;
    index: number;
    totalInType: number;
  }> = [];

  if (unlockedStudent && (visaFilter === 'all' || visaFilter === 'estudiante')) {
    studentApplicants.forEach((id, idx) => {
      allCards.push({
        visaType: 'estudiante',
        applicantId: id,
        index: idx,
        totalInType: studentApplicants.length,
      });
    });
  }

  if (unlockedTourist && (visaFilter === 'all' || visaFilter === 'turista')) {
    touristApplicants.forEach((id, idx) => {
      allCards.push({
        visaType: 'turista',
        applicantId: id,
        index: idx,
        totalInType: touristApplicants.length,
      });
    });
  }

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Mi Proceso
          </h2>
          <p className="text-sm text-slate-500">
            {activeApplicant
              ? `Formulario Consular y Foto de ${currentApplicantData?.name || `Postulante #${(isSelectedStudent ? studentApplicants : touristApplicants).indexOf(activeApplicant.applicantId) + 1}`}`
              : "Gestiona los trámites, formularios DS-160 y fotografías oficiales de cada solicitud o familiar."}
          </p>
        </div>

        {activeApplicant ? (
          <Button
            onClick={() => setActiveApplicant(null)}
            className="self-start sm:self-auto h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            Volver a todas las tarjetas
          </Button>
        ) : hasUnlockedProcess && (
          <div className="flex items-center gap-2">
            {unlockedStudent && (
              <Button
                onClick={() => router.push('/portal/planes?tab=estudiante')}
                className="h-10 px-4 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Tarjeta Estudiante</span>
              </Button>
            )}
            {unlockedTourist && (
              <Button
                onClick={() => router.push('/portal/planes?tab=turista')}
                className="h-10 px-4 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Tarjeta Turista</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* VIEW 1: INDEPENDENT CARDS GRID */}
      {!activeApplicant ? (
        !hasUnlockedProcess ? (
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
                Cuando adquieras tu plan de <strong>Visa de Estudiante (F-1)</strong> o <strong>Visa de Turista (B-2)</strong>, aparecerán aquí las tarjetas independientes de cada solicitud para que llenes los datos y cargues las fotos.
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
        ) : (
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
                const isPrincipal = card.index === 0;

                return (
                  <div
                    key={`${card.visaType}_${card.applicantId}`}
                    onClick={() => setActiveApplicant({ visaType: card.visaType, applicantId: card.applicantId })}
                    className="group bg-white border border-slate-200 hover:border-blue-400 shadow-xl hover:shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="space-y-5 relative z-10">
                      {/* Top Row: Icon/Photo & Badges */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-105 transition-transform shrink-0">
                            {applicantPhoto ? (
                              <img src={applicantPhoto} alt="Foto" className="w-full h-full object-cover" />
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
                              {isStudent ? "Visa de Estudiante (F-1)" : "Visa de Turista (B-2)"}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => handleRemoveApplicant(card.visaType, card.applicantId, e)}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 flex items-center justify-center cursor-pointer shadow-2xs group/del"
                            title={`Eliminar tarjeta de ${isStudent ? 'Visa de Estudiante F-1' : 'Visa de Turista B-2'}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-600 group-hover/del:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>

                      {/* Applicant Name Banner */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {applicantName || "Nombre sin asignar (Pendiente)"}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {applicantName ? "Información consular en registro" : "Haz clic para llenar los datos de este postulante"}
                            </p>
                          </div>
                        </div>

                        {data?.status === 'completado' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase shrink-0 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-700" />
                            Listo
                          </span>
                        ) : data?.status === 'en_progreso' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold uppercase shrink-0 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-700" />
                            En curso
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-[10px] font-bold uppercase shrink-0">
                            Pendiente
                          </span>
                        )}
                      </div>

                      {/* Description & Included Features */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isStudent 
                          ? "Seguimiento de trámite escolar, emisión de I-20, formulario oficial consular DS-160 y preparación para entrevista F-1."
                          : "Evaluación de perfil turístico, estrategia de arraigo laboral/familiar, DS-160 oficial y simulacro de entrevista consular B-2."}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Servicio Activo
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold">
                          <FileCheck className="w-3 h-3 text-slate-600" />
                          Formulario DS-160
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold">
                          <Camera className="w-3 h-3 text-slate-600" />
                          Foto Oficial 5x5
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold">
                          <ShieldCheck className="w-3 h-3 text-slate-600" />
                          Asesoría Consular
                        </span>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                      <span className="text-xs font-semibold text-slate-500">
                        {data?.status === 'completado' ? 'Formulario guardado' : 'Requiere completar datos'}
                      </span>
                      <Button className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 group-hover:translate-x-1 transition-all shadow-md shadow-blue-500/20 cursor-pointer">
                        <span>Llenar Formulario y Foto</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (

        /* VIEW 2: DETAILED PROCESS FORM & PHOTO FOR SELECTED APPLICANT */
        <div className="relative min-h-[450px]">
          <div className="w-full bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 space-y-8">
            
            {/* Process Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-900 text-[10px] font-bold uppercase tracking-widest">
                    Servicio Activo
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    {currentApplicantData?.name || 'Nombre sin asignar'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 pt-1">
                  {isSelectedStudent ? "Formulario Consular — Visa de Estudiante F-1" : "Formulario Consular — Visa de Turista B-2"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isSelectedStudent ? (
                  <GraduationCap className="w-8 h-8 text-black shrink-0" />
                ) : (
                  <Briefcase className="w-8 h-8 text-black shrink-0" />
                )}
              </div>
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
                      <h4 className="text-sm font-bold text-slate-900">
                        Fotografía Oficial del Postulante
                      </h4>
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
                      className="h-10 w-10 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
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
              isStudent={isSelectedStudent} 
              applicantId={activeApplicant.applicantId}
              onNameChange={() => refreshApplicantsData()}
            />

          </div>
        </div>
      )}

    </div>
  );
}


