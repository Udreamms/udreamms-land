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
  FileSpreadsheet
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
  size?: number;
  uploadedAt?: string;
}

interface ApplicantInfo {
  id: string;
  name: string;
  photoUrl: string | null;
  passportDoc: AttachedDoc | null;
  bankStatementDoc: AttachedDoc | null;
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
          label: '2. Aplicación a la Escuela',
          color: 'bg-sky-50 text-sky-900 border-sky-200',
          dot: 'bg-sky-600',
          desc: 'Tu solicitud ha sido enviada a la institución educativa en USA.'
        };
      case 'i20_entregado':
        return {
          number: '3',
          label: '3. Formulario I-20 Entregado',
          color: 'bg-teal-50 text-teal-900 border-teal-200',
          dot: 'bg-teal-600',
          desc: '¡Tu I-20 oficial ha sido emitido con éxito por la institución!'
        };
      case 'ds160':
        return {
          number: '4',
          label: '4. Llenado Formulario DS-160',
          color: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-600',
          desc: 'El Staff está completando y revisando tu DS-160 oficial ante el Departamento de Estado.'
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
      } catch (e) {}

      cache[`f1_${id}`] = { id, name, photoUrl, passportDoc, bankStatementDoc, status };
    });

    // Load B2 cache
    touristApplicants.forEach((id) => {
      let name = '';
      let status: 'completado' | 'en_progreso' | 'pendiente' = 'pendiente';
      let photoUrl: string | null = null;
      let passportDoc: AttachedDoc | null = null;
      let bankStatementDoc: AttachedDoc | null = null;

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
      } catch (e) {}

      cache[`b2_${id}`] = { id, name, photoUrl, passportDoc, bankStatementDoc, status };
    });

    setApplicantsData(cache);
  }, [studentApplicants, touristApplicants]);

  useEffect(() => {
    refreshApplicantsData();
  }, [refreshApplicantsData, activeApplicant]);

  // Hydrate from Cloud Database (Firestore) on mount if available & poll for live status changes
  useEffect(() => {
    if (!user?.email) return;

    const hydrateFromCloud = async (visaType: 'F-1' | 'B-2') => {
      try {
        const res = await fetch(`/api/portal/submission?email=${encodeURIComponent(user.email!)}&visaType=${visaType}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.case) {
          const prefix = visaType === 'F-1' ? 'f1' : 'b2';
          const defaultId = '1';

          if (data.case.status) {
            setCloudStages(prev => ({
              ...prev,
              [prefix]: data.case.status,
            }));
          }
          
          if (data.case.formData && typeof window !== 'undefined') {
            const currentLocalForm = localStorage.getItem(`udreamms_form_${prefix}_${defaultId}`);
            if (!currentLocalForm) {
              localStorage.setItem(`udreamms_form_${prefix}_${defaultId}`, JSON.stringify(data.case.formData));
            }
          }
          if (data.case.photoUrl && typeof window !== 'undefined') {
            const currentLocalPhoto = localStorage.getItem(`udreamms_photo_${prefix}_${defaultId}`);
            if (!currentLocalPhoto) {
              localStorage.setItem(`udreamms_photo_${prefix}_${defaultId}`, data.case.photoUrl);
            }
          }
          if (data.case.passportDoc && typeof window !== 'undefined') {
            const currentLocalPassport = localStorage.getItem(`udreamms_passport_${prefix}_${defaultId}`);
            if (!currentLocalPassport) {
              localStorage.setItem(`udreamms_passport_${prefix}_${defaultId}`, JSON.stringify(data.case.passportDoc));
            }
          }
          if (data.case.bankStatementDoc && typeof window !== 'undefined') {
            const currentLocalBank = localStorage.getItem(`udreamms_bank_${prefix}_${defaultId}`);
            if (!currentLocalBank) {
              localStorage.setItem(`udreamms_bank_${prefix}_${defaultId}`, JSON.stringify(data.case.bankStatementDoc));
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

        if (rawForm) {
          try {
            const parsedForm = JSON.parse(rawForm);
            if (Object.keys(parsedForm).length > 0) {
              let passportDoc: any = null;
              let bankDoc: any = null;
              if (rawPassport) try { passportDoc = JSON.parse(rawPassport); } catch (e) {}
              if (rawBank) try { bankDoc = JSON.parse(rawBank); } catch (e) {}

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

    void pushLocalToCloud();
    void hydrateFromCloud('F-1');
    void hydrateFromCloud('B-2');

    // Poll every 12 seconds to reflect staff status changes in real-time
    const interval = setInterval(() => {
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

  // Cloud sync helper
  const syncToCloud = async (
    photo: string | null,
    passport: AttachedDoc | null,
    bankStatement: AttachedDoc | null
  ) => {
    if (!activeApplicant) return;
    const prefix = isSelectedStudent ? 'f1' : 'b2';
    const applicantId = activeApplicant.applicantId;

    try {
      const storageKey = `udreamms_form_${prefix}_${applicantId}`;
      const savedForm = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      const parsedForm = savedForm ? JSON.parse(savedForm) : {};

      const payload = {
        visaType: isSelectedStudent ? 'F-1' : 'B-2',
        applicantId,
        formData: parsedForm,
        photoUrl: photo,
        passportDoc: passport,
        bankStatementDoc: bankStatement,
        userEmail: user?.email || parsedForm.email_contacto || '',
        userName: user?.displayName || `${parsedForm.nombres || ''} ${parsedForm.apellidos || ''}`.trim(),
        userId: user?.uid || '',
      };

      const res = await fetch('/api/portal/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Fallback: send clean formData to ensure no textual fields are ever dropped
        await fetch('/api/portal/submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            photoUrl: photo && photo.length < 300000 ? photo : null,
            passportDoc: passport ? { name: passport.name, type: passport.type, size: passport.size } : null,
            bankStatementDoc: bankStatement ? { name: bankStatement.name, type: bankStatement.type, size: bankStatement.size } : null,
          }),
        });
      }
    } catch (err) {
      console.error('Error syncing documents with cloud:', err);
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
    await syncToCloud(photo, currentPassport, currentBankStatement);
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
    await syncToCloud(currentPhoto, doc, currentBankStatement);
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
    await syncToCloud(currentPhoto, currentPassport, doc);
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

  // Handlers for Passport file upload (PDF or Image)
  const handlePassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const doc: AttachedDoc = {
        name: file.name,
        type: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
        dataUrl: dataUrlToStore,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      await setCurrentPassportDoc(doc);
      toast.success(`¡Pasaporte guardado con éxito! (${isPdf ? 'Documento PDF' : 'Imagen'})`);
    } catch (err) {
      console.error('Error uploading passport:', err);
      toast.error("Error al procesar el archivo del pasaporte.");
    }
  };

  // Handlers for Bank Statement file upload (PDF or Image)
  const handleBankStatementUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const doc: AttachedDoc = {
        name: file.name,
        type: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
        dataUrl: dataUrlToStore,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      await setCurrentBankStatementDoc(doc);
      toast.success(`¡Estado de cuenta bancario guardado con éxito! (${isPdf ? 'Documento PDF' : 'Imagen'})`);
    } catch (err) {
      console.error('Error uploading bank statement:', err);
      toast.error("Error al procesar el estado de cuenta.");
    }
  };

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
                              {applicantName ? "Expediente consular en registro" : "Haz clic para llenar los datos y adjuntar documentos"}
                            </p>
                          </div>
                        </div>

                        {data?.status === 'completado' && hasPassport && (!isStudent || hasBank) && applicantPhoto ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase shrink-0 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-700" />
                            Expediente Completo
                          </span>
                        ) : data?.status === 'en_progreso' || hasPassport || (isStudent && hasBank) || applicantPhoto ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold uppercase shrink-0 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-700" />
                            En Registro
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-[10px] font-bold uppercase shrink-0">
                            Pendiente
                          </span>
                        )}
                      </div>

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

                      {/* Checklist / Attached Badges */}
                      <div className={`grid gap-2 pt-1 ${isStudent ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
                        <div className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-semibold flex items-center justify-between gap-1.5 ${
                          isFormComplete ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          <span className="truncate">Formulario DS-160</span>
                          {isFormComplete ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <span className="text-[9px] text-slate-400">Pend.</span>}
                        </div>

                        <div className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-semibold flex items-center justify-between gap-1.5 ${
                          applicantPhoto ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          <span className="truncate">Foto Oficial 5x5</span>
                          {applicantPhoto ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <span className="text-[9px] text-slate-400">Pend.</span>}
                        </div>

                        <div className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-semibold flex items-center justify-between gap-1.5 ${
                          hasPassport ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          <span className="truncate">Pasaporte</span>
                          {hasPassport ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <span className="text-[9px] text-slate-400">Pend.</span>}
                        </div>

                        {isStudent && (
                          <div className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-semibold flex items-center justify-between gap-1.5 ${
                            hasBank ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}>
                            <span className="truncate">Estado Cuenta</span>
                            {hasBank ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <span className="text-[9px] text-slate-400">Pend.</span>}
                          </div>
                        )}
                      </div>
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

              <div className={`grid gap-5 ${isSelectedStudent ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                
                {/* CARD 1: FOTOGRAFÍA OFICIAL 5x5 */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                        <Camera className="w-3 h-3 text-slate-600" />
                        Foto 5x5 cm
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
                        Pasaporte
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
                      <span className="w-full h-9 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        Añadir PDF
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

                {/* CARD 3: ESTADO DE CUENTA BANCARIO (SÓLO PARA VISA DE ESTUDIANTE F-1) */}
                {isSelectedStudent && (
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-2xs">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                          <Building2 className="w-3 h-3 text-emerald-600" />
                          Estado de Cuenta
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
                        <span className="w-full h-9 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                          <Upload className="w-3.5 h-3.5 text-white" />
                          Añadir PDF
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
                )}

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
