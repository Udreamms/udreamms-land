'use client';

import React from 'react';
import {
  X,
  Mail,
  Phone,
  Copy,
  Plus,
  Unlock,
  Lock,
  User,
  FileText,
  Globe,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ALL_COUNTRY_CODES } from '@/lib/countryCodes';
import { StudentCase, getStatusLabel, StaffTabType } from '../../types';

interface DossierHeaderProps {
  selectedCaseModal: StudentCase;
  caseModalGroup: StudentCase[];
  setSelectedCaseModal: React.Dispatch<React.SetStateAction<StudentCase | null>>;
  onClose: () => void;
  onMoveStatus: (caseId: string, newStatus: StaffTabType) => void;
  onCreateApplicant: (email: string, visaType: 'F-1' | 'B-2', name?: string) => void;
  onToggleEntitlement: (email: string, flag: string, currentVal: boolean) => void;
  onDeleteCase: (targetCase: StudentCase) => void;
  onCopy: (text: string, label: string) => void;
  isCreatingApplicant: boolean;
  togglingFlags: Set<string>;
  deletingCaseId?: string | null;
  isEditingDossier?: boolean;
  editedFormData?: Record<string, string>;
  startEditingDossier?: () => void;
  stopEditingDossier: () => void;
}

const SPANISH_COUNTRY_FLAGS: Record<string, string> = {
  peru: '🇵🇪',
  mexico: '🇲🇽',
  colombia: '🇨🇴',
  ecuador: '🇪🇨',
  bolivia: '🇧🇴',
  venezuela: '🇻🇪',
  argentina: '🇦🇷',
  chile: '🇨🇱',
  guatemala: '🇬🇹',
  honduras: '🇭🇳',
  elsalvador: '🇸🇻',
  nicaragua: '🇳🇮',
  costarica: '🇨🇷',
  panama: '🇵🇦',
  republicadominicana: '🇩🇴',
  dominicana: '🇩🇴',
  cuba: '🇨🇺',
  puertorico: '🇵🇷',
  estadosunidos: '🇺🇸',
  eeuu: '🇺🇸',
  usa: '🇺🇸',
  unitedstates: '🇺🇸',
  espana: '🇪🇸',
  spain: '🇪🇸',
  uruguay: '🇺🇾',
  paraguay: '🇵🇾',
  brasil: '🇧🇷',
  brazil: '🇧🇷',
  canada: '🇨🇦',
  haiti: '🇭🇹',
  italia: '🇮🇹',
  italy: '🇮🇹',
  francia: '🇫🇷',
  france: '🇫🇷',
  alemania: '🇩🇪',
  germany: '🇩🇪',
  reinounido: '🇬🇧',
  unitedkingdom: '🇬🇧',
};

const getCountryFlag = (country?: string): string => {
  if (!country) return '🌐';
  const clean = country
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');

  if (SPANISH_COUNTRY_FLAGS[clean]) {
    return SPANISH_COUNTRY_FLAGS[clean];
  }

  const found = ALL_COUNTRY_CODES.find((c) => {
    const cClean = c.country
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z]/g, '');
    return cClean === clean || clean.includes(cClean) || cClean.includes(clean);
  });

  return found?.flag || '🌐';
};

const calculateAge = (birthDateStr?: string): { age: number | null; display: string } => {
  if (!birthDateStr) return { age: null, display: '' };
  const str = birthDateStr.trim();
  let birthDate: Date | null = null;

  if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(str)) {
    const [y, m, d] = str.split(/[-/.]/).map((n) => parseInt(n, 10));
    birthDate = new Date(y, m - 1, d);
  } else if (/^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}$/.test(str)) {
    const [d, m, y] = str.split(/[-/.]/).map((n) => parseInt(n, 10));
    birthDate = new Date(y, m - 1, d);
  } else {
    const parsed = Date.parse(str);
    if (!isNaN(parsed)) birthDate = new Date(parsed);
  }

  if (!birthDate || isNaN(birthDate.getTime())) {
    return { age: null, display: str };
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age >= 0 && age < 120) {
    return { age, display: `${age} años` };
  }
  return { age: null, display: str };
};

export const DossierHeader: React.FC<DossierHeaderProps> = ({
  selectedCaseModal,
  caseModalGroup,
  setSelectedCaseModal,
  onClose,
  onMoveStatus,
  onCreateApplicant,
  onToggleEntitlement,
  onDeleteCase,
  onCopy,
  isCreatingApplicant,
  togglingFlags,
  deletingCaseId,
  isEditingDossier,
  editedFormData,
  startEditingDossier,
  stopEditingDossier,
}) => {
  const isStudentTab = selectedCaseModal.visaType === 'F-1';
  const extras: { flag: string; label: string }[] = [
    {
      flag: isStudentTab ? 'purchased_curso_estudiante' : 'purchased_curso_turista',
      label: 'Master Class Express',
    },
    {
      flag: isStudentTab ? 'purchased_libro_estudiante' : 'purchased_libro_turista',
      label: 'Libro Digital',
    },
    {
      flag: isStudentTab ? 'purchased_recursos_estudiante' : 'purchased_recursos_turista',
      label: 'Recursos Adicionales',
    },
  ];

  // Extract comprehensive profile details from active formData & case record
  const activeFormData = (isEditingDossier && editedFormData && Object.keys(editedFormData).length > 0)
    ? { ...(selectedCaseModal.formData || {}), ...editedFormData }
    : (selectedCaseModal.formData || {});

  const nombres = activeFormData.nombres?.trim() || activeFormData.first_name?.trim();
  const apellidos = activeFormData.apellidos?.trim() || activeFormData.last_name?.trim();
  const fullFormName = [nombres, apellidos].filter(Boolean).join(' ');
  const displayName = fullFormName || selectedCaseModal.name || 'Sin nombre asignado';

  const email = activeFormData.email_contacto?.trim() || activeFormData.email?.trim() || selectedCaseModal.email || '';
  const phone = activeFormData.celular_contacto?.trim() || activeFormData.celular?.trim() || activeFormData.telefono?.trim() || activeFormData.phone?.trim() || selectedCaseModal.phone || '';
  
  let country = activeFormData.pais_domicilio?.trim() || activeFormData.pais_nacimiento?.trim() || activeFormData.pais?.trim() || activeFormData.country?.trim() || activeFormData.nacionalidad?.trim() || '';
  if (!country && phone) {
    const foundByCode = ALL_COUNTRY_CODES.find((c) => phone.startsWith(c.code));
    if (foundByCode) {
      country = foundByCode.country;
    }
  }

  const birthDateRaw = activeFormData.fecha_nacimiento?.trim() || activeFormData.birth_date?.trim() || activeFormData.fecha_nac?.trim() || activeFormData.birthDate?.trim() || '';
  const ageInfo = calculateAge(birthDateRaw);
  const flagEmoji = country ? getCountryFlag(country) : '🌐';

  return (
    <>
      {/* Top Bar with Avatar, Contact, Entitlements and Actions */}
      <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-200 flex items-stretch justify-between gap-4 shrink-0">
        <div className="flex items-stretch gap-4 sm:gap-5 flex-1 min-w-0">
          {/* Left Column: Enlarged Photo + Expediente Number with clear margin */}
          <div className="flex flex-col items-center justify-between shrink-0 gap-2.5">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white border border-slate-300 overflow-hidden flex items-center justify-center shadow-sm group">
              {selectedCaseModal.photoUrl ? (
                <a
                  href={selectedCaseModal.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  download="foto_oficial_5x5.jpg"
                  className="w-full h-full block relative cursor-pointer"
                  title="Clic para abrir y descargar la foto oficial en tamaño completo"
                >
                  <img
                    src={selectedCaseModal.photoUrl}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 p-1 text-center">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span>Ver / Descargar</span>
                  </span>
                </a>
              ) : (
                <User className="w-14 h-14 md:w-16 md:h-16 text-slate-400" />
              )}
            </div>
            <span className="h-8 px-3 rounded-full font-mono text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300 shadow-2xs inline-flex items-center justify-center">
              Expediente #{selectedCaseModal.expedienteNumber ?? 1}
            </span>
          </div>

          {/* Middle Column: Name + Contact (Top) & All Capsules (Bottom) */}
          <div className="flex flex-col justify-between flex-1 min-w-0 gap-3">
            <div className="space-y-1.5">
              {/* Row 1: Full Names (Nombres Completos) */}
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
                {displayName}
              </h3>

              {/* Row 2: Comprehensive Details from Dossier Form Questions */}
              <div className="flex items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 flex-wrap">
                {/* 1. Correo Electrónico */}
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className={email ? 'text-slate-800' : 'text-slate-400 italic'}>
                    {email || 'Sin correo registrado'}
                  </span>
                  {email && (
                    <button
                      onClick={() => onCopy(email, 'Email')}
                      className="hover:text-blue-600 p-0.5 cursor-pointer text-slate-400 transition-colors"
                      title="Copiar email"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </span>

                {/* 2. Número de Celular / Teléfono */}
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className={phone ? 'text-slate-800' : 'text-slate-400 italic'}>
                    {phone || 'Sin celular registrado'}
                  </span>
                  {phone && (
                    <button
                      onClick={() => onCopy(phone, 'Teléfono')}
                      className="hover:text-blue-600 p-0.5 cursor-pointer text-slate-400 transition-colors"
                      title="Copiar teléfono"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </span>

                {/* 3. País con Bandera */}
                <span className="flex items-center gap-1.5 font-semibold text-slate-800 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/80">
                  <span className="text-base leading-none shrink-0" role="img" aria-label={country || 'País'}>
                    {flagEmoji}
                  </span>
                  <span className={country ? 'text-slate-800' : 'text-slate-400 italic'}>
                    {country || 'Sin país registrado'}
                  </span>
                </span>

                {/* 4. Edad / Fecha de Nacimiento */}
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className={(ageInfo.display || birthDateRaw) ? 'text-slate-800' : 'text-slate-400 italic'}>
                    {ageInfo.display
                      ? `Edad: ${ageInfo.display}`
                      : birthDateRaw
                      ? `Nacimiento: ${birthDateRaw}`
                      : 'Sin edad registrada'}
                  </span>
                </span>
              </div>
            </div>

            {/* Row 3: All capsules strictly in a single line (perfectly aligned with Expediente #N and Editar Expediente) */}
            <div className="flex items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar h-8 shrink-0">
              {/* Status Selector Dropdown */}
              <div className="h-8 flex items-center gap-1.5 bg-white border border-slate-300 hover:border-blue-500 rounded-full px-3 shadow-2xs transition-colors shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Estado:
                </span>
                <select
                  value={selectedCaseModal.status}
                  onChange={(e) => onMoveStatus(selectedCaseModal.id, e.target.value as StaffTabType)}
                  className="bg-transparent text-slate-900 text-xs font-bold cursor-pointer focus:outline-none pr-1"
                  title="Cambiar estado del trámite"
                >
                  <option value="nuevos">📥 1. Usuarios Registrados</option>
                  <option value="aplicacion_escuela">🏫 2. Solicitud de Admisión</option>
                  <option value="i20_entregado">📄 3. I-20 Recibido</option>
                  <option value="ds160">📝 4. Preparación de Documentos</option>
                  <option value="sevis">💳 5. Tasa SEVIS (I-901)</option>
                  <option value="comprar_cita">🎟️ 6. Comprar Cita Embajada</option>
                  <option value="simulacro_entrevista">🎙️ 7. Simulacro Entrevista</option>
                  <option value="entrevista">📅 8. Cita en Embajada</option>
                  <option value="aprobados">✅ 9. Aprobados</option>
                  <option value="negados">❌ 10. Negados</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => onCreateApplicant(selectedCaseModal.email, 'F-1', selectedCaseModal.name)}
                disabled={isCreatingApplicant || !selectedCaseModal.email}
                className="h-8 px-3 rounded-full text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs transition-colors shrink-0"
                title="Agregar tarjeta F-1 para este cliente"
              >
                <Plus className="w-3.5 h-3.5" />
                Tarjeta F-1
              </button>
              
              <button
                type="button"
                onClick={() => onCreateApplicant(selectedCaseModal.email, 'B-2', selectedCaseModal.name)}
                disabled={isCreatingApplicant || !selectedCaseModal.email}
                className="h-8 px-3 rounded-full text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs transition-colors shrink-0"
                title="Agregar tarjeta B-2 para este cliente"
              >
                <Plus className="w-3.5 h-3.5" />
                Tarjeta B-2
              </button>

              <span className="w-px h-4 bg-slate-300 mx-0.5 shrink-0" />

              {extras.map((product) => {
                const unlocked = Boolean(selectedCaseModal.entitlements?.[product.flag]);
                const isToggling = togglingFlags.has(product.flag);
                return (
                  <button
                    key={product.flag}
                    type="button"
                    onClick={() => onToggleEntitlement(selectedCaseModal.email, product.flag, !unlocked)}
                    disabled={!selectedCaseModal.email || isToggling}
                    className={`h-8 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs shrink-0 ${
                      isToggling
                        ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-70'
                        : unlocked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 disabled:opacity-50'
                    }`}
                    title={
                      selectedCaseModal.email
                        ? unlocked
                          ? `Desbloqueado. Clic para bloquear "${product.label}"`
                          : `Bloqueado. Clic para desbloquear "${product.label}"`
                        : 'Este cliente no tiene correo registrado aún'
                    }
                  >
                    {isToggling ? (
                      <span className="w-3.5 h-3.5 shrink-0 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
                    ) : unlocked ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span>{product.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Close Button + Registration Date (Top) & Edit Button (Bottom) */}
        <div className="flex flex-col items-end justify-between shrink-0 gap-3">
          <div className="flex items-center gap-2">
            <span className="h-7 px-2.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 shadow-2xs inline-flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
              <span>Registrado: <strong className="text-slate-900 font-bold">{selectedCaseModal.submittedAt || 'Reciente'}</strong></span>
            </span>

            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Cerrar modal"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>

          {startEditingDossier && (
            isEditingDossier ? (
              <Button
                type="button"
                onClick={stopEditingDossier}
                className="h-8 px-4 rounded-full text-xs font-bold bg-slate-900 hover:bg-black text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-all shrink-0"
              >
                Terminar Edición
              </Button>
            ) : (
              <Button
                type="button"
                onClick={startEditingDossier}
                className="h-8 px-4 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-all shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                Editar Expediente
              </Button>
            )
          )}
        </div>
      </div>

      {/* Process Tabs Bar: ALWAYS visible to switch between client's active process cards */}
      <div className="px-5 md:px-6 pt-2 bg-slate-100/80 border-b border-slate-200 shrink-0 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 flex-nowrap shrink-0">
          <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Procesos:
          </span>
          {(caseModalGroup.length > 0 ? caseModalGroup : [selectedCaseModal]).map((c, idx) => {
            const groupList = caseModalGroup.length > 0 ? caseModalGroup : [selectedCaseModal];
            const sameTypeIndex = groupList.slice(0, idx).filter((o) => o.visaType === c.visaType).length;
            const sameTypeTotal = groupList.filter((o) => o.visaType === c.visaType).length;
            const visaLabel = c.visaType === 'F-1' ? 'Estudiante F-1' : 'Turista B-2';
            const cardName = c.formData?.nombres || c.name || '';
            const isSelected = selectedCaseModal?.id === c.id;

            return (
              <div key={c.id} className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCaseModal(c);
                    stopEditingDossier();
                  }}
                  className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-t border-x ${
                    isSelected
                      ? 'bg-white text-blue-600 border-slate-200 shadow-xs translate-y-[1px] relative z-10'
                      : 'bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 border-transparent'
                  }`}
                  title={`Ver expediente ${visaLabel}`}
                >
                  <span className="text-sm">{c.visaType === 'F-1' ? '🎓' : '✈️'}</span>
                  <span className="truncate max-w-[220px]">
                    {visaLabel}
                    {sameTypeTotal > 1 ? ` #${sameTypeIndex + 1}` : ''}
                    {cardName && cardName !== c.email ? ` (${cardName.split(' ')[0]})` : ''}
                  </span>
                </button>

                {groupList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeleteCase(c)}
                    disabled={deletingCaseId === c.id}
                    className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title={`Eliminar tarjeta ${visaLabel}`}
                  >
                    {deletingCaseId === c.id ? (
                      <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin inline-block" />
                    ) : (
                      <span className="text-xs">🗑️</span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Add Buttons on Tabs Bar */}
        <div className="flex items-center gap-1.5 shrink-0 pb-1">
          <button
            type="button"
            onClick={() => onCreateApplicant(selectedCaseModal.email, 'F-1', selectedCaseModal.name)}
            disabled={isCreatingApplicant || !selectedCaseModal.email}
            className="h-7 px-2.5 rounded-lg text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center gap-1 disabled:opacity-50 cursor-pointer shadow-2xs transition-colors shrink-0"
            title="Crear nueva tarjeta F-1 para este cliente"
          >
            <Plus className="w-3 h-3" />
            <span>F-1</span>
          </button>
          <button
            type="button"
            onClick={() => onCreateApplicant(selectedCaseModal.email, 'B-2', selectedCaseModal.name)}
            disabled={isCreatingApplicant || !selectedCaseModal.email}
            className="h-7 px-2.5 rounded-lg text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1 disabled:opacity-50 cursor-pointer shadow-2xs transition-colors shrink-0"
            title="Crear nueva tarjeta B-2 para este cliente"
          >
            <Plus className="w-3 h-3" />
            <span>B-2</span>
          </button>
        </div>
      </div>
    </>
  );
};
