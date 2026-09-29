'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  ArrowLeft,
  User,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal } from "../PortalContext";
import LockOverlay from "../components/LockOverlay";
import FormularioConsular from "./components/FormularioConsular";
import ProcesoTimeline from "./components/ProcesoTimeline";
import ProcesoInstructions from "./components/ProcesoInstructions";
import ProcesoDocsGrid from "./components/ProcesoDocsGrid";
import ProcesoCardsGrid from "./components/ProcesoCardsGrid";
import ProcesoDocModal from "./components/ProcesoDocModal";
import { AttachedDoc, ApplicantInfo, ActiveApplicantState } from "./types";
import { toast } from "sonner";

export default function ProcesoPage() {
  const router = useRouter();
  const { isUnlocked, user, dbUser } = usePortal();

  // Active applicant selected for detailed form editing (null = viewing main cards grid)
  const [activeApplicant, setActiveApplicant] = useState<ActiveApplicantState | null>(null);

  // Document preview modal state
  const [previewDocModal, setPreviewDocModal] = useState<{
    title: string;
    doc: AttachedDoc;
  } | null>(null);

  const handleDirectDownload = async (url: string, filename: string) => {
    try {
      if (url.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Multi-applicants list for Student Visa (F-1)
  const [studentApplicants, setStudentApplicants] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('udreamms_applicants_f1');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Multi-applicants list for Tourist Visa (B-2)
  const [touristApplicants, setTouristApplicants] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('udreamms_applicants_b2');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Detailed info per applicant cache
  const [applicantsData, setApplicantsData] = useState<Record<string, ApplicantInfo>>({});

  // Filter state for cards: 'all' | 'estudiante' | 'turista'
  const [visaFilter, setVisaFilter] = useState<'all' | 'estudiante' | 'turista'>('all');

  // Real-time Cloud Stage from Staff Portal (nuevos, aplicacion_escuela, i20_entregado, etc.)
  const [cloudStages, setCloudStages] = useState<{ f1?: string; b2?: string }>({});

  const getStageInfo = (status?: string) => {
    switch (status) {
      case 'nuevos':
        return {
          number: '1',
          label: '1. Procesos Nuevos / En Revisión Inicial',
          color: 'bg-blue-50 text-blue-900 border-blue-200',
          dot: 'bg-blue-600',
          desc: 'El equipo consular está validando tu documentación inicial.'
        };
      case 'aplicacion_escuela':
        return {
          number: '2',
          label: '2. Solicitud de Admisión',
          color: 'bg-sky-50 text-sky-900 border-sky-200',
          dot: 'bg-sky-600',
          desc: 'Tu solicitud ha sido enviada a la institución educativa en USA.'
        };
      case 'i20_entregado':
        return {
          number: '3',
          label: '3. Formulario I-20 Recibido',
          color: 'bg-teal-50 text-teal-900 border-teal-200',
          dot: 'bg-teal-600',
          desc: '¡Tu I-20 oficial ha sido emitido con éxito por la institución!'
        };
      case 'ds160':
        return {
          number: '4',
          label: '4. Preparación de Documentos',
          color: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-600',
          desc: 'El Staff está completando y revisando tu documentación oficial y DS-160 ante el Departamento de Estado.'
        };
      case 'sevis':
        return {
          number: '5',
          label: '5. Pago de Tasa SEVIS (I-901)',
          color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          dot: 'bg-indigo-600',
          desc: 'Procesando el pago y comprobante de la tasa SEVIS obligatoria.'
        };
      case 'comprar_cita':
        return {
          number: '6',
          label: '6. Listo para Comprar Cita Embajada',
          color: 'bg-orange-50 text-orange-900 border-orange-200',
          dot: 'bg-orange-600',
          desc: 'Expediente listo para programar y agendar tu cita consular.'
        };
      case 'simulacro_entrevista':
        return {
          number: '7',
          label: '7. Simulacro de Entrevista Consular',
          color: 'bg-violet-50 text-violet-900 border-violet-200',
          dot: 'bg-violet-600',
          desc: 'Sesión de preparación intensiva para tu entrevista con el oficial consular.'
        };
      case 'entrevista':
        return {
          number: '8',
          label: '8. Cita Presencial en Embajada',
          color: 'bg-purple-50 text-purple-900 border-purple-200',
          dot: 'bg-purple-600',
          desc: 'Asistencia y presentación ante la Embajada de Estados Unidos.'
        };
      case 'aprobados':
        return {
          number: '9',
          label: '9. ¡Visa Aprobada y Trámite Exitoso!',
          color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          dot: 'bg-emerald-600',
          desc: '¡Felicidades! Tu visa ha sido aprobada por el Consulado.'
        };
      case 'negados':
        return {
          number: '10',
          label: '10. Trámite Denegado',
          color: 'bg-red-50 text-red-900 border-red-200',
          dot: 'bg-red-600',
          desc: 'Consulta con el Staff de Udreamms para conocer opciones de apelación o re-postulación.'
        };
      default:
        return {
          number: '1',
          label: '1. Procesos Nuevos / En Registro',
          color: 'bg-blue-50 text-blue-900 border-blue-200',
          dot: 'bg-blue-600',
          desc: 'Tu proceso está activo. Completa tus datos y documentos.'
        };
    }
  };

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

    // Helper to safely parse stored documents
    const loadDoc = (key: string, legacyKey?: string): AttachedDoc | null => {
      try {
        const raw = localStorage.getItem(key) || (legacyKey ? localStorage.getItem(legacyKey) : null);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    };

    // Load F1 cache
    studentApplicants.forEach((id) => {
      let name = '';
      let status: 'completado' | 'en_progreso' | 'pendiente' = 'pendiente';
      let photoUrl: string | null = null;
      let passportDoc: AttachedDoc | null = null;
      let bankStatementDoc: AttachedDoc | null = null;
      let sevisDoc: AttachedDoc | null = null;
      let i20Doc: AttachedDoc | null = null;
      let ds160Doc: AttachedDoc | null = null;
      let acceptanceLetterDoc: AttachedDoc | null = null;
      let affidavitDoc: AttachedDoc | null = null;
      let embassyAppointmentDoc: AttachedDoc | null = null;

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
        passportDoc = loadDoc(`udreamms_passport_f1_${id}`, id === '1' ? 'udreamms_passport_f1' : undefined);
        bankStatementDoc = loadDoc(`udreamms_bank_f1_${id}`, id === '1' ? 'udreamms_bank_f1' : undefined);
        sevisDoc = loadDoc(`udreamms_sevis_f1_${id}`, id === '1' ? 'udreamms_sevis_f1' : undefined);
        i20Doc = loadDoc(`udreamms_i20_f1_${id}`, id === '1' ? 'udreamms_i20_f1' : undefined);
        ds160Doc = loadDoc(`udreamms_ds160_f1_${id}`, id === '1' ? 'udreamms_ds160_f1' : undefined);
        acceptanceLetterDoc = loadDoc(`udreamms_acceptance_f1_${id}`, id === '1' ? 'udreamms_acceptance_f1' : undefined);
        affidavitDoc = loadDoc(`udreamms_affidavit_f1_${id}`, id === '1' ? 'udreamms_affidavit_f1' : undefined);
        embassyAppointmentDoc = loadDoc(`udreamms_embassy_f1_${id}`, id === '1' ? 'udreamms_embassy_f1' : undefined);
      } catch (e) {}

      cache[`f1_${id}`] = {
        id,
        name,
        photoUrl,
        passportDoc,
        bankStatementDoc,
        sevisDoc,
        i20Doc,
        ds160Doc,
        acceptanceLetterDoc,
        affidavitDoc,
        embassyAppointmentDoc,
        status
      };
    });

    // Load B2 cache
    touristApplicants.forEach((id) => {
      let name = '';
      let status: 'completado' | 'en_progreso' | 'pendiente' = 'pendiente';
      let photoUrl: string | null = null;
      let passportDoc: AttachedDoc | null = null;
      let bankStatementDoc: AttachedDoc | null = null;
      let sevisDoc: AttachedDoc | null = null;
      let i20Doc: AttachedDoc | null = null;
      let ds160Doc: AttachedDoc | null = null;
      let acceptanceLetterDoc: AttachedDoc | null = null;
      let affidavitDoc: AttachedDoc | null = null;
      let embassyAppointmentDoc: AttachedDoc | null = null;

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
        passportDoc = loadDoc(`udreamms_passport_b2_${id}`, id === '1' ? 'udreamms_passport_b2' : undefined);
        bankStatementDoc = loadDoc(`udreamms_bank_b2_${id}`, id === '1' ? 'udreamms_bank_b2' : undefined);
        sevisDoc = loadDoc(`udreamms_sevis_b2_${id}`, id === '1' ? 'udreamms_sevis_b2' : undefined);
        i20Doc = loadDoc(`udreamms_i20_b2_${id}`, id === '1' ? 'udreamms_i20_b2' : undefined);
        ds160Doc = loadDoc(`udreamms_ds160_b2_${id}`, id === '1' ? 'udreamms_ds160_b2' : undefined);
        acceptanceLetterDoc = loadDoc(`udreamms_acceptance_b2_${id}`, id === '1' ? 'udreamms_acceptance_b2' : undefined);
        affidavitDoc = loadDoc(`udreamms_affidavit_b2_${id}`, id === '1' ? 'udreamms_affidavit_b2' : undefined);
        embassyAppointmentDoc = loadDoc(`udreamms_embassy_b2_${id}`, id === '1' ? 'udreamms_embassy_b2' : undefined);
      } catch (e) {}

      cache[`b2_${id}`] = {
        id,
        name,
        photoUrl,
        passportDoc,
        bankStatementDoc,
        sevisDoc,
        i20Doc,
        ds160Doc,
        acceptanceLetterDoc,
        affidavitDoc,
        embassyAppointmentDoc,
        status
      };
    });

    setApplicantsData(cache);
  }, [studentApplicants, touristApplicants]);

  useEffect(() => {
    refreshApplicantsData();
  }, [refreshApplicantsData, activeApplicant]);

  // Hydrate from Cloud Database (Firestore) on mount if available & poll for live status changes
  useEffect(() => {
    if (!user?.email) return;

    const hydrateFromCloud = async (visaType: 'F-1' | 'B-2', applicantId: string = '1') => {
      try {
        const res = await fetch(`/api/portal/submission?email=${encodeURIComponent(user.email!)}&visaType=${visaType}&applicantId=${encodeURIComponent(applicantId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.case) {
          const prefix = visaType === 'F-1' ? 'f1' : 'b2';
          const defaultId = applicantId;

          if (data.case.status) {
            setCloudStages(prev => ({
              ...prev,
              [prefix]: data.case.status,
            }));
          }
          
          if (typeof window !== 'undefined' && data.case.formData) {
            localStorage.setItem(`udreamms_form_${prefix}_${defaultId}`, JSON.stringify(data.case.formData));
          }

          if (typeof window !== 'undefined') {
            if (data.case.photoUrl) {
              localStorage.setItem(`udreamms_photo_${prefix}_${defaultId}`, data.case.photoUrl);
            } else {
              localStorage.removeItem(`udreamms_photo_${prefix}_${defaultId}`);
            }
            if (data.case.passportDoc) {
              localStorage.setItem(`udreamms_passport_${prefix}_${defaultId}`, JSON.stringify(data.case.passportDoc));
            } else {
              localStorage.removeItem(`udreamms_passport_${prefix}_${defaultId}`);
            }
            if (data.case.bankStatementDoc) {
              localStorage.setItem(`udreamms_bank_${prefix}_${defaultId}`, JSON.stringify(data.case.bankStatementDoc));
            } else {
              localStorage.removeItem(`udreamms_bank_${prefix}_${defaultId}`);
            }
            if (data.case.sevisDoc) {
              localStorage.setItem(`udreamms_sevis_${prefix}_${defaultId}`, JSON.stringify(data.case.sevisDoc));
            } else {
              localStorage.removeItem(`udreamms_sevis_${prefix}_${defaultId}`);
            }
            if (data.case.i20Doc) {
              localStorage.setItem(`udreamms_i20_${prefix}_${defaultId}`, JSON.stringify(data.case.i20Doc));
            } else {
              localStorage.removeItem(`udreamms_i20_${prefix}_${defaultId}`);
            }
            if (data.case.ds160Doc) {
              localStorage.setItem(`udreamms_ds160_${prefix}_${defaultId}`, JSON.stringify(data.case.ds160Doc));
            } else {
              localStorage.removeItem(`udreamms_ds160_${prefix}_${defaultId}`);
            }
            if (data.case.acceptanceLetterDoc) {
              localStorage.setItem(`udreamms_acceptance_${prefix}_${defaultId}`, JSON.stringify(data.case.acceptanceLetterDoc));
            } else {
              localStorage.removeItem(`udreamms_acceptance_${prefix}_${defaultId}`);
            }
            if (data.case.affidavitDoc) {
              localStorage.setItem(`udreamms_affidavit_${prefix}_${defaultId}`, JSON.stringify(data.case.affidavitDoc));
            } else {
              localStorage.removeItem(`udreamms_affidavit_${prefix}_${defaultId}`);
            }
            if (data.case.embassyAppointmentDoc) {
              localStorage.setItem(`udreamms_embassy_${prefix}_${defaultId}`, JSON.stringify(data.case.embassyAppointmentDoc));
            } else {
              localStorage.removeItem(`udreamms_embassy_${prefix}_${defaultId}`);
            }
          }
          refreshApplicantsData();
        }
      } catch (err) {
        console.warn('Could not hydrate case from cloud:', err);
      }
    };

    // 1. Immediately push any existing local data (from previous offline/failed attempts) up to cloud
    const pushLocalToCloud = async () => {
      if (typeof window === 'undefined') return;
      for (const prefix of ['f1', 'b2'] as const) {
        const defaultId = '1';
        const storageKey = `udreamms_form_${prefix}_${defaultId}`;
        const rawForm = localStorage.getItem(storageKey);
        const photoKey = `udreamms_photo_${prefix}_${defaultId}`;
        const rawPhoto = localStorage.getItem(photoKey) || localStorage.getItem(`udreamms_photo_${prefix}`);
        const passportKey = `udreamms_passport_${prefix}_${defaultId}`;
        const rawPassport = localStorage.getItem(passportKey) || localStorage.getItem(`udreamms_passport_${prefix}`);
        const bankKey = `udreamms_bank_${prefix}_${defaultId}`;
        const rawBank = localStorage.getItem(bankKey) || localStorage.getItem(`udreamms_bank_${prefix}`);
        const sevisKey = `udreamms_sevis_${prefix}_${defaultId}`;
        const rawSevis = localStorage.getItem(sevisKey) || localStorage.getItem(`udreamms_sevis_${prefix}`);
        const i20Key = `udreamms_i20_${prefix}_${defaultId}`;
        const rawI20 = localStorage.getItem(i20Key) || localStorage.getItem(`udreamms_i20_${prefix}`);
        const ds160Key = `udreamms_ds160_${prefix}_${defaultId}`;
        const rawDs160 = localStorage.getItem(ds160Key) || localStorage.getItem(`udreamms_ds160_${prefix}`);
        const acceptanceKey = `udreamms_acceptance_${prefix}_${defaultId}`;
        const rawAcceptance = localStorage.getItem(acceptanceKey) || localStorage.getItem(`udreamms_acceptance_${prefix}`);
        const affidavitKey = `udreamms_affidavit_${prefix}_${defaultId}`;
        const rawAffidavit = localStorage.getItem(affidavitKey) || localStorage.getItem(`udreamms_affidavit_${prefix}`);
        const embassyKey = `udreamms_embassy_${prefix}_${defaultId}`;
        const rawEmbassy = localStorage.getItem(embassyKey) || localStorage.getItem(`udreamms_embassy_${prefix}`);

        if (rawForm) {
          try {
            const parsedForm = JSON.parse(rawForm);
            if (Object.keys(parsedForm).length > 0) {
              let passportDoc: any = null;
              let bankDoc: any = null;
              let sevisDoc: any = null;
              let i20Doc: any = null;
              let ds160Doc: any = null;
              let acceptanceDoc: any = null;
              let affidavitDoc: any = null;
              let embassyDoc: any = null;
              if (rawPassport) try { passportDoc = JSON.parse(rawPassport); } catch (e) {}
              if (rawBank) try { bankDoc = JSON.parse(rawBank); } catch (e) {}
              if (rawSevis) try { sevisDoc = JSON.parse(rawSevis); } catch (e) {}
              if (rawI20) try { i20Doc = JSON.parse(rawI20); } catch (e) {}
              if (rawDs160) try { ds160Doc = JSON.parse(rawDs160); } catch (e) {}
              if (rawAcceptance) try { acceptanceDoc = JSON.parse(rawAcceptance); } catch (e) {}
              if (rawAffidavit) try { affidavitDoc = JSON.parse(rawAffidavit); } catch (e) {}
              if (rawEmbassy) try { embassyDoc = JSON.parse(rawEmbassy); } catch (e) {}

              await fetch('/api/portal/submission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  visaType: prefix === 'f1' ? 'F-1' : 'B-2',
                  applicantId: defaultId,
                  formData: parsedForm,
                  photoUrl: rawPhoto && rawPhoto.length < 350000 ? rawPhoto : null,
                  passportDoc: passportDoc ? { name: passportDoc.name, type: passportDoc.type, size: passportDoc.size } : null,
                  bankStatementDoc: bankDoc ? { name: bankDoc.name, type: bankDoc.type, size: bankDoc.size } : null,
                  sevisDoc: sevisDoc ? { name: sevisDoc.name, type: sevisDoc.type, size: sevisDoc.size } : null,
                  i20Doc: i20Doc ? { name: i20Doc.name, type: i20Doc.type, size: i20Doc.size } : null,
                  ds160Doc: ds160Doc ? { name: ds160Doc.name, type: ds160Doc.type, size: ds160Doc.size } : null,
                  acceptanceLetterDoc: acceptanceDoc ? { name: acceptanceDoc.name, type: acceptanceDoc.type, size: acceptanceDoc.size } : null,
                  affidavitDoc: affidavitDoc ? { name: affidavitDoc.name, type: affidavitDoc.type, size: affidavitDoc.size } : null,
                  embassyAppointmentDoc: embassyDoc ? { name: embassyDoc.name, type: embassyDoc.type, size: embassyDoc.size } : null,
                  userEmail: user?.email || parsedForm.email_contacto || '',
                  userName: user?.displayName || `${parsedForm.nombres || ''} ${parsedForm.apellidos || ''}`.trim(),
                  userId: user?.uid || '',
                })
              });
            }
          } catch (e) {
            console.warn('Error auto-pushing local data to cloud:', e);
          }
        }
      }
    };

    // Discover applicant cards that exist in the cloud but not on this browser — most often
    // ones Staff created directly for a client who needs multiple cards under one visa
    // service. Merges into the local list (never removes a locally-known id) and hydrates
    // each newly-discovered card's data.
    const syncApplicantList = async (visaType: 'F-1' | 'B-2') => {
      try {
        const res = await fetch(`/api/portal/applicants?email=${encodeURIComponent(user.email!)}&visaType=${visaType}`);
        if (!res.ok) return;
        const data = await res.json();
        const cloudIds: string[] = data.applicantIds || [];
        const isStudent = visaType === 'F-1';
        const setApplicants = isStudent ? setStudentApplicants : setTouristApplicants;
        const hasPlan = isStudent ? unlockedStudent : unlockedTourist;

        if (cloudIds.length > 0) {
          setApplicants((prev) => {
            const isSame = prev.length === cloudIds.length && prev.every((id) => cloudIds.includes(id));
            return isSame ? prev : cloudIds;
          });
          for (const id of cloudIds) {
            await hydrateFromCloud(visaType, id);
          }
        } else if (hasPlan) {
          // If the user paid for a plan but no cloud cards have been seeded yet, initialize with card '1'
          setApplicants((prev) => (prev.length > 0 ? prev : ['1']));
          await hydrateFromCloud(visaType, '1');
        } else {
          // No cards in cloud and no unlocked plan: clear list completely
          setApplicants([]);
        }
      } catch (err) {
        console.warn('Could not sync applicant list from cloud:', err);
      }
    };

    // Push first, then hydrate — hydration now treats the cloud as authoritative for files,
    // so it must run after any pending local-only upload has actually reached the cloud,
    // otherwise hydration could immediately erase it locally again.
    void (async () => {
      await pushLocalToCloud();
      await syncApplicantList('F-1');
      await syncApplicantList('B-2');
      await hydrateFromCloud('F-1');
      await hydrateFromCloud('B-2');
    })();

    // Poll every 12 seconds to reflect staff status changes in real-time
    const interval = setInterval(() => {
      void syncApplicantList('F-1');
      void syncApplicantList('B-2');
      void hydrateFromCloud('F-1');
      void hydrateFromCloud('B-2');
    }, 12000);

    return () => clearInterval(interval);
  }, [user?.email, refreshApplicantsData]);

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
    const prefix = isStudent ? 'f1' : 'b2';

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`udreamms_form_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_form_${prefix}`);
      localStorage.removeItem(`udreamms_photo_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_photo_${prefix}`);
      localStorage.removeItem(`udreamms_passport_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_passport_${prefix}`);
      localStorage.removeItem(`udreamms_bank_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_bank_${prefix}`);
      localStorage.removeItem(`udreamms_sevis_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_sevis_${prefix}`);
      localStorage.removeItem(`udreamms_i20_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_i20_${prefix}`);
      localStorage.removeItem(`udreamms_ds160_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_ds160_${prefix}`);
      localStorage.removeItem(`udreamms_acceptance_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_acceptance_${prefix}`);
      localStorage.removeItem(`udreamms_affidavit_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_affidavit_${prefix}`);
      localStorage.removeItem(`udreamms_embassy_${prefix}_${idToRemove}`);
      localStorage.removeItem(`udreamms_embassy_${prefix}`);
    }

    if (user?.email) {
      void fetch(`/api/portal/submission?email=${encodeURIComponent(user.email)}&visaType=${isStudent ? 'F-1' : 'B-2'}&applicantId=${encodeURIComponent(idToRemove)}`, {
        method: 'DELETE',
      }).catch(err => console.error('Error deleting applicant card from cloud:', err));
    }

    if (list.length <= 1) {
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
  const currentPassport = currentApplicantData?.passportDoc || null;
  const currentBankStatement = currentApplicantData?.bankStatementDoc || null;
  const currentSevis = currentApplicantData?.sevisDoc || null;
  const currentI20 = currentApplicantData?.i20Doc || null;
  const currentDs160 = currentApplicantData?.ds160Doc || null;
  const currentAcceptance = currentApplicantData?.acceptanceLetterDoc || null;
  const currentAffidavit = currentApplicantData?.affidavitDoc || null;
  const currentEmbassy = currentApplicantData?.embassyAppointmentDoc || null;

  // Helper to compress images on client side to guarantee fast uploads and prevent Firestore quota limits
  const compressImageFile = (file: File, maxDim = 600, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => resolve(e.target?.result as string);
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Uploads a base64 data URL to Firebase Storage and returns a permanent, small download URL.
  const uploadToStorage = async (
    dataUrl: string,
    fileName: string,
    contentType: string,
    docType: 'photo' | 'passport' | 'bank' | 'sevis' | 'i20' | 'ds160' | 'acceptance' | 'affidavit' | 'embassyAppointment'
  ): Promise<string | null> => {
    if (!activeApplicant) return null;
    try {
      const res = await fetch('/api/portal/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl,
          fileName,
          contentType,
          docType,
          visaType: isSelectedStudent ? 'F-1' : 'B-2',
          applicantId: activeApplicant.applicantId,
          email: user?.email || '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        console.error('Error uploading file to storage:', data);
        toast.error('No se pudo subir el archivo a la nube. Tus datos de texto sí se guardaron, intenta subir el archivo de nuevo.');
        return null;
      }
      return data.url as string;
    } catch (err) {
      console.error('Error uploading file to storage:', err);
      toast.error('No se pudo subir el archivo a la nube. Revisa tu conexión e intenta de nuevo.');
      return null;
    }
  };

  // Cloud sync helper supporting all 9 document fields
  const syncToCloud = async (
    photo: string | null | undefined,
    passport: AttachedDoc | null | undefined,
    bankStatement: AttachedDoc | null | undefined,
    sevis: AttachedDoc | null | undefined = undefined,
    i20: AttachedDoc | null | undefined = undefined,
    ds160: AttachedDoc | null | undefined = undefined,
    acceptance: AttachedDoc | null | undefined = undefined,
    affidavit: AttachedDoc | null | undefined = undefined,
    embassy: AttachedDoc | null | undefined = undefined
  ) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;

    try {
      const storageKey = `udreamms_form_${prefix}_${applicantId}`;
      const savedForm = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      const parsedForm = savedForm ? JSON.parse(savedForm) : {};

      const payload: Record<string, any> = {
        visaType: isSelectedStudent ? 'F-1' : 'B-2',
        applicantId,
        formData: parsedForm,
        userEmail: user?.email || parsedForm.email_contacto || '',
        userName: user?.displayName || `${parsedForm.nombres || ''} ${parsedForm.apellidos || ''}`.trim(),
        userId: user?.uid || '',
      };

      if (photo !== undefined) payload.photoUrl = photo || null;
      if (passport !== undefined) {
        payload.passportDoc = passport ? { name: passport.name, type: passport.type, url: passport.url || '', size: passport.size } : null;
      }
      if (bankStatement !== undefined) {
        payload.bankStatementDoc = bankStatement ? { name: bankStatement.name, type: bankStatement.type, url: bankStatement.url || '', size: bankStatement.size } : null;
      }
      if (sevis !== undefined) {
        payload.sevisDoc = sevis ? { name: sevis.name, type: sevis.type, url: sevis.url || '', size: sevis.size } : null;
      }
      if (i20 !== undefined) {
        payload.i20Doc = i20 ? { name: i20.name, type: i20.type, url: i20.url || '', size: i20.size } : null;
      }
      if (ds160 !== undefined) {
        payload.ds160Doc = ds160 ? { name: ds160.name, type: ds160.type, url: ds160.url || '', size: ds160.size } : null;
      }
      if (acceptance !== undefined) {
        payload.acceptanceLetterDoc = acceptance ? { name: acceptance.name, type: acceptance.type, url: acceptance.url || '', size: acceptance.size } : null;
      }
      if (affidavit !== undefined) {
        payload.affidavitDoc = affidavit ? { name: affidavit.name, type: affidavit.type, url: affidavit.url || '', size: affidavit.size } : null;
      }
      if (embassy !== undefined) {
        payload.embassyAppointmentDoc = embassy ? { name: embassy.name, type: embassy.type, url: embassy.url || '', size: embassy.size } : null;
      }

      const res = await fetch('/api/portal/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error('Error syncing documents with cloud:', errBody);
        toast.error('No se pudo sincronizar tu documento con el servidor. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error syncing documents with cloud:', err);
      toast.error('No se pudo sincronizar tu documento con el servidor. Revisa tu conexión.');
    }
  };

  // Set Official Photo
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
    const photoStorageUrl = photo ? await uploadToStorage(photo, 'foto-5x5.jpg', 'image/jpeg', 'photo') : null;
    await syncToCloud(photoStorageUrl, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  };

  // Set Passport Document
  const setCurrentPassportDoc = async (doc: AttachedDoc | null) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;
    const storageKey = `udreamms_passport_${prefix}_${applicantId}`;

    if (doc) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(doc));
        } catch (e) {
          console.warn('Storage quota limit reached in local storage for passport:', e);
        }
      }
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(storageKey);
    }

    refreshApplicantsData();
    await syncToCloud(undefined, doc, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  };

  // Set Bank Statement Document
  const setCurrentBankStatementDoc = async (doc: AttachedDoc | null) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;
    const storageKey = `udreamms_bank_${prefix}_${applicantId}`;

    if (doc) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(doc));
        } catch (e) {
          console.warn('Storage quota limit reached in local storage for bank statement:', e);
        }
      }
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(storageKey);
    }

    refreshApplicantsData();
    await syncToCloud(undefined, undefined, doc, undefined, undefined, undefined, undefined, undefined, undefined);
  };

  // Set SEVIS Document
  const setCurrentSevisDoc = async (doc: AttachedDoc | null) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;
    const storageKey = `udreamms_sevis_${prefix}_${applicantId}`;

    if (doc) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(doc));
        } catch (e) {
          console.warn('Storage quota limit reached in local storage for sevis:', e);
        }
      }
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(storageKey);
    }

    refreshApplicantsData();
    await syncToCloud(undefined, undefined, undefined, doc, undefined, undefined, undefined, undefined, undefined);
  };

  // Set I-20 Document
  const setCurrentI20Doc = async (doc: AttachedDoc | null) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;
    const storageKey = `udreamms_i20_${prefix}_${applicantId}`;

    if (doc) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(doc));
        } catch (e) {
          console.warn('Storage quota limit reached in local storage for i20:', e);
        }
      }
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(storageKey);
    }

    refreshApplicantsData();
    await syncToCloud(undefined, undefined, undefined, undefined, doc, undefined, undefined, undefined, undefined);
  };

  // Set DS-160 Document
  const setCurrentDs160Doc = async (doc: AttachedDoc | null) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;
    const storageKey = `udreamms_ds160_${prefix}_${applicantId}`;

    if (doc) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(doc));
        } catch (e) {
          console.warn('Storage quota limit reached in local storage for ds160:', e);
        }
      }
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(storageKey);
    }

    refreshApplicantsData();
    await syncToCloud(undefined, undefined, undefined, undefined, undefined, doc, undefined, undefined, undefined);
  };

  // Set Acceptance Letter Document
  const setCurrentAcceptanceLetterDoc = async (doc: AttachedDoc | null) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;
    const storageKey = `udreamms_acceptance_${prefix}_${applicantId}`;

    if (doc) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(doc));
        } catch (e) {
          console.warn('Storage quota limit reached in local storage for acceptance letter:', e);
        }
      }
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(storageKey);
    }

    refreshApplicantsData();
    await syncToCloud(undefined, undefined, undefined, undefined, undefined, undefined, doc, undefined, undefined);
  };

  // Set Affidavit Document
  const setCurrentAffidavitDoc = async (doc: AttachedDoc | null) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;
    const storageKey = `udreamms_affidavit_${prefix}_${applicantId}`;

    if (doc) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(doc));
        } catch (e) {
          console.warn('Storage quota limit reached in local storage for affidavit:', e);
        }
      }
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(storageKey);
    }

    refreshApplicantsData();
    await syncToCloud(undefined, undefined, undefined, undefined, undefined, undefined, undefined, doc, undefined);
  };

  // Set Embassy Appointment Document
  const setCurrentEmbassyAppointmentDoc = async (doc: AttachedDoc | null) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;
    const storageKey = `udreamms_embassy_${prefix}_${applicantId}`;

    if (doc) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(doc));
        } catch (e) {
          console.warn('Storage quota limit reached in local storage for embassy appointment:', e);
        }
      }
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem(storageKey);
    }

    refreshApplicantsData();
    await syncToCloud(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, doc);
  };

  // Handlers for Photo file input with automatic compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona un archivo de imagen válido (JPG, PNG).");
      return;
    }

    try {
      const compressedDataUrl = await compressImageFile(file, 600, 0.82);
      await setCurrentPhoto(compressedDataUrl);
      toast.success("¡Fotografía oficial 5x5 optimizada y guardada en la nube con éxito!");
    } catch (err) {
      console.error('Error compressing photo:', err);
      toast.error("Hubo un problema al procesar la fotografía.");
    }
  };

  // Helper generic doc uploader
  const handleGenericFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: 'passport' | 'bank' | 'sevis' | 'i20' | 'ds160' | 'acceptance' | 'affidavit' | 'embassyAppointment',
    docLabel: string,
    setter: (doc: AttachedDoc | null) => Promise<void>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      toast.error("Formato no válido. Por favor sube un archivo en formato PDF o una imagen (JPG, PNG).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("El archivo excede el tamaño máximo permitido (15MB).");
      return;
    }

    try {
      let dataUrlToStore = '';
      if (isImage) {
        dataUrlToStore = await compressImageFile(file, 1000, 0.75);
      } else {
        const reader = new FileReader();
        dataUrlToStore = await new Promise((resolve) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      const storageUrl = await uploadToStorage(dataUrlToStore, file.name, file.type || 'application/pdf', docType);

      const doc: AttachedDoc = {
        name: file.name,
        type: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
        dataUrl: dataUrlToStore,
        url: storageUrl || undefined,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      await setter(doc);
      if (storageUrl) {
        toast.success(`¡${docLabel} guardado y sincronizado con éxito! (${isPdf ? 'Documento PDF' : 'Imagen'})`);
      }
    } catch (err) {
      console.error(`Error uploading ${docLabel}:`, err);
      toast.error(`Error al procesar el archivo de ${docLabel}.`);
    }
  };

  // Individual Handlers
  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleGenericFileUpload(e, 'passport', 'Pasaporte Oficial', setCurrentPassportDoc);

  const handleBankStatementUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleGenericFileUpload(e, 'bank', 'Estado de Cuenta Bancario', setCurrentBankStatementDoc);

  const handleSevisUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleGenericFileUpload(e, 'sevis', 'Comprobante SEVIS (I-901)', setCurrentSevisDoc);

  const handleI20Upload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleGenericFileUpload(e, 'i20', 'Formulario I-20', setCurrentI20Doc);

  const handleDs160Upload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleGenericFileUpload(e, 'ds160', 'Confirmación DS-160', setCurrentDs160Doc);

  const handleAcceptanceLetterUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleGenericFileUpload(e, 'acceptance', 'Carta de Aceptación', setCurrentAcceptanceLetterDoc);

  const handleAffidavitUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleGenericFileUpload(e, 'affidavit', 'Affidavit of Support', setCurrentAffidavitDoc);

  const handleEmbassyAppointmentUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleGenericFileUpload(e, 'embassyAppointment', 'Comprobante Cita Embajada', setCurrentEmbassyAppointmentDoc);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Collect all independent cards to display
  const allCards: Array<{
    visaType: 'estudiante' | 'turista';
    applicantId: string;
    index: number;
    totalInType: number;
  }> = [];

  const effectiveStudentApplicants = (unlockedStudent && studentApplicants.length === 0) ? ['1'] : studentApplicants;
  const effectiveTouristApplicants = (unlockedTourist && touristApplicants.length === 0) ? ['1'] : touristApplicants;

  if (unlockedStudent && (visaFilter === 'all' || visaFilter === 'estudiante')) {
    effectiveStudentApplicants.forEach((id, idx) => {
      allCards.push({
        visaType: 'estudiante',
        applicantId: id,
        index: idx,
        totalInType: effectiveStudentApplicants.length,
      });
    });
  }

  if (unlockedTourist && (visaFilter === 'all' || visaFilter === 'turista')) {
    effectiveTouristApplicants.forEach((id, idx) => {
      allCards.push({
        visaType: 'turista',
        applicantId: id,
        index: idx,
        totalInType: effectiveTouristApplicants.length,
      });
    });
  }

  return (
    <div className="w-full min-w-0 space-y-6 text-slate-900 pb-12">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Mi Proceso Consular
          </h2>
          <p className="text-sm text-slate-500 font-normal">
            {activeApplicant
              ? `Expediente y Documentación de ${currentApplicantData?.name || `Postulante #${(isSelectedStudent ? studentApplicants : touristApplicants).indexOf(activeApplicant.applicantId) + 1}`}`
              : "Gestiona los trámites, formularios DS-160, pasaportes y estados de cuenta de cada solicitud o familiar."}
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
        <ProcesoCardsGrid
          unlockedStudent={unlockedStudent}
          unlockedTourist={unlockedTourist}
          studentApplicants={studentApplicants}
          touristApplicants={touristApplicants}
          visaFilter={visaFilter}
          setVisaFilter={setVisaFilter}
          allCards={allCards}
          applicantsData={applicantsData}
          cloudStages={cloudStages}
          getStageInfo={getStageInfo}
          getPlanName={getPlanName}
          onSelectApplicant={(card) => setActiveApplicant({ visaType: card.visaType, applicantId: card.applicantId })}
          onRemoveApplicant={handleRemoveApplicant}
        />
      ) : (

        /* VIEW 2: DETAILED PROCESS FORM & PHOTO & ATTACHMENTS FOR SELECTED APPLICANT */
        <div className="w-full bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 space-y-8">
            
            {/* Process Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-900 text-[10px] font-bold uppercase tracking-widest">
                    Expediente Activo
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    {currentApplicantData?.name || 'Nombre sin asignar'}
                  </span>
                  {/* Real-time Stage in detailed header */}
                  {(() => {
                    const currentStage = cloudStages[isSelectedStudent ? 'f1' : 'b2'] || 'nuevos';
                    const stageInfo = getStageInfo(currentStage);
                    return (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs ${stageInfo.color}`}>
                        <span className={`w-2 h-2 rounded-full ${stageInfo.dot} animate-pulse`} />
                        <span>Etapa: {stageInfo.label}</span>
                      </span>
                    );
                  })()}
                </div>
                <h3 className="text-xl font-bold text-slate-900 pt-1">
                  {isSelectedStudent ? "Expediente Consular — Visa de Estudiante F-1" : "Expediente Consular — Visa de Turista B-2"}
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

            {/* SECCIÓN 1: INSTRUCCIONES OBLIGATORIAS DE DOCUMENTACIÓN */}
            <ProcesoInstructions isSelectedStudent={isSelectedStudent} />

            {/* SECCIÓN 1.5: LÍNEA DE TIEMPO DEL EXPEDIENTE (9 FASES DEL STAFF) */}
            <ProcesoTimeline
              currentStageId={cloudStages[isSelectedStudent ? 'f1' : 'b2']}
              applicantName={currentApplicantData?.name || user?.displayName || 'Postulante'}
            />

            {/* SECCIÓN 2: CARGA DE DOCUMENTOS OFICIALES */}
            <ProcesoDocsGrid
              isSelectedStudent={isSelectedStudent}
              currentApplicantData={currentApplicantData}
              currentPhoto={currentPhoto}
              setCurrentPhoto={setCurrentPhoto}
              currentPassport={currentPassport}
              setCurrentPassportDoc={setCurrentPassportDoc}
              currentBankStatement={currentBankStatement}
              setCurrentBankStatementDoc={setCurrentBankStatementDoc}
              currentSevis={currentSevis}
              setCurrentSevisDoc={setCurrentSevisDoc}
              currentI20={currentI20}
              setCurrentI20Doc={setCurrentI20Doc}
              currentDs160={currentDs160}
              setCurrentDs160Doc={setCurrentDs160Doc}
              currentAcceptance={currentAcceptance}
              setCurrentAcceptanceLetterDoc={setCurrentAcceptanceLetterDoc}
              currentAffidavit={currentAffidavit}
              setCurrentAffidavitDoc={setCurrentAffidavitDoc}
              currentEmbassy={currentEmbassy}
              setCurrentEmbassyAppointmentDoc={setCurrentEmbassyAppointmentDoc}
              handlePhotoUpload={handlePhotoUpload}
              handlePassportUpload={handlePassportUpload}
              handleBankStatementUpload={handleBankStatementUpload}
              handleSevisUpload={handleSevisUpload}
              handleI20Upload={handleI20Upload}
              handleDs160Upload={handleDs160Upload}
              handleAcceptanceLetterUpload={handleAcceptanceLetterUpload}
              handleAffidavitUpload={handleAffidavitUpload}
              handleEmbassyAppointmentUpload={handleEmbassyAppointmentUpload}
              onPreview={(title, doc) => setPreviewDocModal({ title, doc })}
              onDownload={handleDirectDownload}
            />

            {/* SECCIÓN 3: FORMULARIO CONSULAR OFICIAL DS-160 */}
            <div className="pt-2">
              <FormularioConsular 
                isStudent={isSelectedStudent} 
                applicantId={activeApplicant.applicantId}
                onNameChange={() => refreshApplicantsData()}
              />
            </div>
          </div>
        )}

      {/* DOCUMENT PREVIEW MODAL */}
      <ProcesoDocModal
        previewDocModal={previewDocModal}
        onClose={() => setPreviewDocModal(null)}
        onDownload={handleDirectDownload}
      />

    </div>
  );
}
