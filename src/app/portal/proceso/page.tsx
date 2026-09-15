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
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  Eye,
  Download,
  X,
  CheckCircle2,
  Info,
  FileSpreadsheet,
  Ticket,
  School,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal } from "../PortalContext";
import LockOverlay from "../components/LockOverlay";
import FormularioConsular from "./components/FormularioConsular";
import { toast } from "sonner";

export interface AttachedDoc {
  name: string;
  type: string;
  dataUrl: string;
  url?: string;
  size?: number;
  uploadedAt?: string;
}

interface ApplicantInfo {
  id: string;
  name: string;
  photoUrl: string | null;
  passportDoc: AttachedDoc | null;
  bankStatementDoc: AttachedDoc | null;
  sevisDoc: AttachedDoc | null;
  i20Doc: AttachedDoc | null;
  ds160Doc: AttachedDoc | null;
  acceptanceLetterDoc: AttachedDoc | null;
  affidavitDoc: AttachedDoc | null;
  embassyAppointmentDoc: AttachedDoc | null;
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

  // Document preview modal state
  const [previewDocModal, setPreviewDocModal] = useState<{
    title: string;
    doc: AttachedDoc;
  } | null>(null);

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
        if (cloudIds.length === 0) return;

        const setApplicants = visaType === 'F-1' ? setStudentApplicants : setTouristApplicants;
        let newIds: string[] = [];
        setApplicants(prev => {
          newIds = cloudIds.filter(id => !prev.includes(id));
          if (newIds.length === 0) return prev;
          return [...prev, ...newIds];
        });
        for (const id of newIds) {
          await hydrateFromCloud(visaType, id);
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
            Mi Proceso Consular
          </h2>
          <p className="text-sm text-slate-500">
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
                Cuando adquieras tu plan de <strong>Visa de Estudiante (F-1)</strong> o <strong>Visa de Turista (B-2)</strong>, aparecerán aquí las tarjetas independientes de cada solicitud para que llenes los datos y cargues tus documentos oficiales (Pasaporte, Estado de Cuenta y Fotografía).
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
                const hasPassport = !!data?.passportDoc;
                const hasBank = !!data?.bankStatementDoc;
                const isFormComplete = data?.status === 'completado';

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

                      {/* Applicant Name */}
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {applicantName || "Nombre sin asignar (Pendiente)"}
                      </p>

                      {/* Real-time Stage Progression Banner from Staff */}
                      {(() => {
                        const currentStage = cloudStages[prefix] || 'nuevos';
                        const stageInfo = getStageInfo(currentStage);
                        return (
                          <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-2xs ${stageInfo.color}`}>
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
                          ? "Expediente académico, emisión de I-20, formulario oficial DS-160, pasaporte, solvencia económica y preparación para entrevista F-1."
                          : "Evaluación de perfil turístico, estrategia de arraigo, formulario oficial DS-160, pasaporte y simulacro de entrevista consular B-2."}
                      </p>

                    </div>

                    {/* Card Footer Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                      <span className="text-xs font-semibold text-slate-500">
                        {data?.status === 'completado' && hasPassport && (!isStudent || hasBank) ? 'Expediente listo para revisión' : 'Completar datos y documentos'}
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
        )
      ) : (

        /* VIEW 2: DETAILED PROCESS FORM & PHOTO & ATTACHMENTS FOR SELECTED APPLICANT */
        <div className="relative min-h-[450px]">
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
            <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-slate-50 border border-blue-200 rounded-3xl p-5 md:p-7 space-y-4 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm md:text-base font-bold text-blue-950">
                    {isSelectedStudent ? "Instrucciones Obligatorias para Adjuntar Documentos (F-1)" : "Instrucciones para Adjuntar Documentos de Postulante (B-2)"}
                  </h4>
                  <p className="text-xs text-blue-900/80 leading-relaxed font-medium">
                    {isSelectedStudent 
                      ? "Para asegurar la correcta revisión de tu trámite de estudiante y emisión de I-20, por favor adjunta los siguientes documentos siguiendo las especificaciones oficiales:"
                      : "Para completar tu trámite de Visa de Turista y llenado oficial del formulario DS-160, por favor adjunta tu fotografía oficial y la fotografía/escaneo de tu pasaporte vigente:"}
                  </p>
                </div>
              </div>

              <div className={`grid gap-3 pt-2 text-xs ${isSelectedStudent ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                
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

            {/* SECCIÓN 2: CARGA DE DOCUMENTOS OFICIALES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <span>Documentos y Archivos Oficiales del Postulante</span>
                </h4>
                <span className="text-[11px] font-semibold text-slate-500">
                  Formatos admitidos: PDF, JPG, PNG (hasta 15MB)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
                
                {/* CARD 1: FOTOGRAFÍA OFICIAL 5x5 */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <Camera className="w-3 h-3 text-blue-600" />
                        1. Foto 5x5 cm
                      </span>
                      {currentPhoto ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Cargada
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner group">
                      {currentPhoto ? (
                        <>
                          <img 
                            src={currentPhoto} 
                            alt="Fotografía de Visa" 
                            className="w-full h-full object-cover" 
                          />
                          <button
                            type="button"
                            onClick={() => setPreviewDocModal({
                              title: "Fotografía Oficial 5x5 cm",
                              doc: { name: "Fotografia_Oficial_5x5.jpg", type: "image/jpeg", dataUrl: currentPhoto }
                            })}
                            className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-white" />
                            Ver Foto
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center space-y-1">
                          <User className="w-10 h-10 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">Sin Fotografía</span>
                          <span className="text-[9px] text-slate-400">Fondo blanco 5x5 cm</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Fotografía Tipo Pasaporte
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Fondo blanco liso, frente descubierta, sin lentes, para el DS-160.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="image/jpeg,image/png,image/webp" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                      <span className="w-full h-9 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        {currentPhoto ? "Cambiar" : "Cargar Foto"}
                      </span>
                    </label>

                    {currentPhoto && (
                      <Button
                        onClick={() => {
                          setCurrentPhoto(null);
                          toast.info("Fotografía removida.");
                        }}
                        variant="outline"
                        className="h-9 w-9 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                        title="Eliminar fotografía"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* CARD 2: FOTOGRAFÍA / ESCANEO DE PASAPORTE */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <CreditCard className="w-3 h-3 text-indigo-600" />
                        2. Pasaporte
                      </span>
                      {currentPassport ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Adjunto
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner group">
                      {currentPassport ? (
                        currentPassport.type === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-extrabold text-xs shadow-2xs">
                              PDF
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={currentPassport.name}>
                              {currentPassport.name}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {formatFileSize(currentPassport.size)}
                            </span>
                          </div>
                        ) : (
                          <>
                            <img 
                              src={currentPassport.dataUrl} 
                              alt="Pasaporte" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1.5 text-center text-white text-[10px] font-semibold truncate">
                              {currentPassport.name}
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center space-y-1">
                          <CreditCard className="w-10 h-10 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">Sin Pasaporte</span>
                          <span className="text-[9px] text-slate-400">PDF escaneado o foto</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Página de Datos del Pasaporte
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Preferiblemente en <strong>PDF escaneado</strong> o foto nítida (mín. 6 meses de vigencia).
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="application/pdf,image/jpeg,image/png,image/webp" 
                        onChange={handlePassportUpload} 
                        className="hidden" 
                      />
                      <span className="w-full h-9 px-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        Añadir Pasaporte
                      </span>
                    </label>

                    {currentPassport && (
                      <>
                        <Button
                          onClick={() => setPreviewDocModal({
                            title: "Pasaporte Oficial del Postulante",
                            doc: currentPassport
                          })}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Ver pasaporte"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentPassportDoc(null);
                            toast.info("Pasaporte removido.");
                          }}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* CARD 3: ESTADO DE CUENTA BANCARIO */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <Building2 className="w-3 h-3 text-emerald-600" />
                        3. Estado de Cuenta
                      </span>
                      {currentBankStatement ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Adjunto
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner group">
                      {currentBankStatement ? (
                        currentBankStatement.type === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-extrabold text-xs shadow-2xs">
                              PDF
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={currentBankStatement.name}>
                              {currentBankStatement.name}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {formatFileSize(currentBankStatement.size)}
                            </span>
                          </div>
                        ) : (
                          <>
                            <img 
                              src={currentBankStatement.dataUrl} 
                              alt="Estado de Cuenta" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1.5 text-center text-white text-[10px] font-semibold truncate">
                              {currentBankStatement.name}
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center space-y-1">
                          <Building2 className="w-10 h-10 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">Sin Estado de Cuenta</span>
                          <span className="text-[9px] text-slate-400">PDF escaneado oficial</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Solvencia Económica Bancaria
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Preferiblemente en <strong>PDF escaneado</strong> (últimos 3 meses del titular o sponsor).
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="application/pdf,image/jpeg,image/png,image/webp" 
                        onChange={handleBankStatementUpload} 
                        className="hidden" 
                      />
                      <span className="w-full h-9 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        Añadir Estado
                      </span>
                    </label>

                    {currentBankStatement && (
                      <>
                        <Button
                          onClick={() => setPreviewDocModal({
                            title: "Estado de Cuenta Bancario",
                            doc: currentBankStatement
                          })}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Ver estado de cuenta"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentBankStatementDoc(null);
                            toast.info("Estado de cuenta removido.");
                          }}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* CARD 4: COMPROBANTE SEVIS (I-901) */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <Ticket className="w-3 h-3 text-purple-600" />
                        4. SEVIS (I-901)
                      </span>
                      {currentSevis ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Adjunto
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner group">
                      {currentSevis ? (
                        currentSevis.type === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-extrabold text-xs shadow-2xs">
                              PDF
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={currentSevis.name}>
                              {currentSevis.name}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {formatFileSize(currentSevis.size)}
                            </span>
                          </div>
                        ) : (
                          <>
                            <img 
                              src={currentSevis.dataUrl} 
                              alt="Comprobante SEVIS" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1.5 text-center text-white text-[10px] font-semibold truncate">
                              {currentSevis.name}
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center space-y-1">
                          <Ticket className="w-10 h-10 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">Sin Comprobante SEVIS</span>
                          <span className="text-[9px] text-slate-400">PDF de confirmación I-901</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Comprobante Tasa SEVIS I-901
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Recibo oficial en <strong>PDF o imagen</strong> emitido por FMJfee / DHS para tu trámite.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="application/pdf,image/jpeg,image/png,image/webp" 
                        onChange={handleSevisUpload} 
                        className="hidden" 
                      />
                      <span className="w-full h-9 px-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        Añadir SEVIS
                      </span>
                    </label>

                    {currentSevis && (
                      <>
                        <Button
                          onClick={() => setPreviewDocModal({
                            title: "Comprobante SEVIS (I-901)",
                            doc: currentSevis
                          })}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Ver comprobante SEVIS"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentSevisDoc(null);
                            toast.info("Comprobante SEVIS removido.");
                          }}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* CARD 5: FORMULARIO I-20 (OFICIAL DE LA ESCUELA) */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <GraduationCap className="w-3 h-3 text-amber-600" />
                        5. Formulario I-20
                      </span>
                      {currentI20 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Adjunto
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner group">
                      {currentI20 ? (
                        currentI20.type === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-extrabold text-xs shadow-2xs">
                              PDF
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={currentI20.name}>
                              {currentI20.name}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {formatFileSize(currentI20.size)}
                            </span>
                          </div>
                        ) : (
                          <>
                            <img 
                              src={currentI20.dataUrl} 
                              alt="Formulario I-20" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1.5 text-center text-white text-[10px] font-semibold truncate">
                              {currentI20.name}
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center space-y-1">
                          <GraduationCap className="w-10 h-10 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">Sin Formulario I-20</span>
                          <span className="text-[9px] text-slate-400">Certificado oficial de elegibilidad</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Formulario I-20 Oficial
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Documento oficial emitido por la institución educativa acreditada en EE.UU.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="application/pdf,image/jpeg,image/png,image/webp" 
                        onChange={handleI20Upload} 
                        className="hidden" 
                      />
                      <span className="w-full h-9 px-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        Añadir I-20
                      </span>
                    </label>

                    {currentI20 && (
                      <>
                        <Button
                          onClick={() => setPreviewDocModal({
                            title: "Formulario I-20 Oficial",
                            doc: currentI20
                          })}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Ver Formulario I-20"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentI20Doc(null);
                            toast.info("Formulario I-20 removido.");
                          }}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* CARD 6: CONFIRMACIÓN DS-160 */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <FileCheck className="w-3 h-3 text-sky-600" />
                        6. Confirmación DS-160
                      </span>
                      {currentDs160 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Adjunta
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner group">
                      {currentDs160 ? (
                        currentDs160.type === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-extrabold text-xs shadow-2xs">
                              PDF
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={currentDs160.name}>
                              {currentDs160.name}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {formatFileSize(currentDs160.size)}
                            </span>
                          </div>
                        ) : (
                          <>
                            <img 
                              src={currentDs160.dataUrl} 
                              alt="Confirmación DS-160" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1.5 text-center text-white text-[10px] font-semibold truncate">
                              {currentDs160.name}
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center space-y-1">
                          <FileCheck className="w-10 h-10 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">Sin Confirmación DS-160</span>
                          <span className="text-[9px] text-slate-400">Hoja con código de barras CEAC</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Hoja de Confirmación DS-160
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Hoja de confirmación oficial con código de barras del Departamento de Estado.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="application/pdf,image/jpeg,image/png,image/webp" 
                        onChange={handleDs160Upload} 
                        className="hidden" 
                      />
                      <span className="w-full h-9 px-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        Añadir DS-160
                      </span>
                    </label>

                    {currentDs160 && (
                      <>
                        <Button
                          onClick={() => setPreviewDocModal({
                            title: "Hoja de Confirmación DS-160",
                            doc: currentDs160
                          })}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Ver confirmación DS-160"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentDs160Doc(null);
                            toast.info("Confirmación DS-160 removida.");
                          }}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* CARD 7: CARTA DE ACEPTACIÓN */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <School className="w-3 h-3 text-teal-600" />
                        7. Carta de Aceptación
                      </span>
                      {currentAcceptance ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Adjunta
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner group">
                      {currentAcceptance ? (
                        currentAcceptance.type === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-extrabold text-xs shadow-2xs">
                              PDF
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={currentAcceptance.name}>
                              {currentAcceptance.name}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {formatFileSize(currentAcceptance.size)}
                            </span>
                          </div>
                        ) : (
                          <>
                            <img 
                              src={currentAcceptance.dataUrl} 
                              alt="Carta de Aceptación" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1.5 text-center text-white text-[10px] font-semibold truncate">
                              {currentAcceptance.name}
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center space-y-1">
                          <School className="w-10 h-10 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">Sin Carta de Aceptación</span>
                          <span className="text-[9px] text-slate-400">Documento de admisión escolar</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Carta Oficial de Admisión
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Carta membretada emitida por el departamento de admisiones de la escuela.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="application/pdf,image/jpeg,image/png,image/webp" 
                        onChange={handleAcceptanceLetterUpload} 
                        className="hidden" 
                      />
                      <span className="w-full h-9 px-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        Añadir Carta
                      </span>
                    </label>

                    {currentAcceptance && (
                      <>
                        <Button
                          onClick={() => setPreviewDocModal({
                            title: "Carta de Aceptación de la Escuela",
                            doc: currentAcceptance
                          })}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Ver carta de aceptación"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentAcceptanceLetterDoc(null);
                            toast.info("Carta de aceptación removida.");
                          }}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* CARD 8: AFFIDAVIT OF SUPPORT */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <ShieldCheck className="w-3 h-3 text-rose-600" />
                        8. Affidavit of Support
                      </span>
                      {currentAffidavit ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Adjunto
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner group">
                      {currentAffidavit ? (
                        currentAffidavit.type === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-extrabold text-xs shadow-2xs">
                              PDF
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={currentAffidavit.name}>
                              {currentAffidavit.name}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {formatFileSize(currentAffidavit.size)}
                            </span>
                          </div>
                        ) : (
                          <>
                            <img 
                              src={currentAffidavit.dataUrl} 
                              alt="Affidavit of Support" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1.5 text-center text-white text-[10px] font-semibold truncate">
                              {currentAffidavit.name}
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center space-y-1">
                          <ShieldCheck className="w-10 h-10 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">Sin Affidavit</span>
                          <span className="text-[9px] text-slate-400">Declaración jurada de solvencia</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Declaración de Patrocinio
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Carta de patrocinio económico firmada y notariada por el sponsor o garante.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="application/pdf,image/jpeg,image/png,image/webp" 
                        onChange={handleAffidavitUpload} 
                        className="hidden" 
                      />
                      <span className="w-full h-9 px-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        Añadir Affidavit
                      </span>
                    </label>

                    {currentAffidavit && (
                      <>
                        <Button
                          onClick={() => setPreviewDocModal({
                            title: "Affidavit of Support (Patrocinio)",
                            doc: currentAffidavit
                          })}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Ver affidavit"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentAffidavitDoc(null);
                            toast.info("Affidavit of Support removido.");
                          }}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* CARD 9: COMPROBANTE CITA EMBAJADA */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <Calendar className="w-3 h-3 text-fuchsia-600" />
                        9. Cita Embajada (AIS)
                      </span>
                      {currentEmbassy ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Adjunto
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-36 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner group">
                      {currentEmbassy ? (
                        currentEmbassy.type === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-extrabold text-xs shadow-2xs">
                              PDF
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={currentEmbassy.name}>
                              {currentEmbassy.name}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {formatFileSize(currentEmbassy.size)}
                            </span>
                          </div>
                        ) : (
                          <>
                            <img 
                              src={currentEmbassy.dataUrl} 
                              alt="Comprobante de Cita" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1.5 text-center text-white text-[10px] font-semibold truncate">
                              {currentEmbassy.name}
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-3 text-center space-y-1">
                          <Calendar className="w-10 h-10 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">Sin Cita Embajada</span>
                          <span className="text-[9px] text-slate-400">Confirmación del portal AIS / CAS</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        Confirmación Cita Consular
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Hoja de confirmación de cita oficial para el CAS y entrevista consular en la Embajada.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="application/pdf,image/jpeg,image/png,image/webp" 
                        onChange={handleEmbassyAppointmentUpload} 
                        className="hidden" 
                      />
                      <span className="w-full h-9 px-3 rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        Añadir Cita
                      </span>
                    </label>

                    {currentEmbassy && (
                      <>
                        <Button
                          onClick={() => setPreviewDocModal({
                            title: "Comprobante Cita Consular Embajada (AIS)",
                            doc: currentEmbassy
                          })}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Ver comprobante de cita"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentEmbassyAppointmentDoc(null);
                            toast.info("Comprobante de cita consular removido.");
                          }}
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* SECCIÓN 3: FORMULARIO CONSULAR OFICIAL DS-160 */}
            <div className="pt-2">
              <FormularioConsular 
                isStudent={isSelectedStudent} 
                applicantId={activeApplicant.applicantId}
                onNameChange={() => refreshApplicantsData()}
              />
            </div>

          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {previewDocModal.doc.type === 'application/pdf' ? 'PDF' : 'IMG'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {previewDocModal.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-sm sm:max-w-md">
                    {previewDocModal.doc.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewDocModal.doc.dataUrl}
                  download={previewDocModal.doc.name}
                  className="h-9 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Descargar archivo"
                >
                  <Download className="w-3.5 h-3.5 text-slate-700" />
                  <span className="hidden sm:inline">Descargar</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDocModal(null)}
                  className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-auto bg-slate-100/50 flex items-center justify-center min-h-[400px]">
              {previewDocModal.doc.type === 'application/pdf' || previewDocModal.doc.name.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={previewDocModal.doc.dataUrl}
                  title={previewDocModal.doc.name}
                  className="w-full h-[65vh] rounded-2xl border border-slate-200 bg-white shadow-sm"
                />
              ) : (
                <div className="max-h-[65vh] flex items-center justify-center">
                  <img
                    src={previewDocModal.doc.dataUrl}
                    alt={previewDocModal.doc.name}
                    className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-md border border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <Button
                onClick={() => setPreviewDocModal(null)}
                className="h-9 px-5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold"
              >
                Cerrar Visor
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
