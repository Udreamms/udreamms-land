'use client';

import React from 'react';
import {
  User,
  School,
  Heart,
  CreditCard,
  Home,
  Users,
  Briefcase,
  GraduationCap,
  Plane,
  Phone,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  StudentCase,
  DOSSIER_SECTIONS,
  FIELD_SELECT_OPTIONS,
  isSectionFilled,
} from '../../types';

interface DossierFormSectionsProps {
  selectedCaseModal: StudentCase;
  isEditingDossier: boolean;
  editedFormData: Record<string, string>;
  setEditedFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const DossierFormSections: React.FC<DossierFormSectionsProps> = ({
  selectedCaseModal,
  isEditingDossier,
  editedFormData,
  setEditedFormData,
}) => {
  const scrollToDossierSection = (anchor: string) => {
    if (typeof document === 'undefined') return;
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getFieldValue = (key: string): string =>
    (isEditingDossier ? editedFormData[key] : selectedCaseModal?.formData?.[key]) || '';

  const SectionStatusBadge = ({ filled }: { filled: boolean }) => (
    <span
      className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide flex items-center gap-1 ${
        filled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
      }`}
    >
      {filled && <CheckCircle2 className="w-2.5 h-2.5" />}
      {filled ? 'Con Datos' : 'Pendiente'}
    </span>
  );

  const renderEditableField = ({
    formKey,
    label,
    mono,
    multiline,
    className,
  }: {
    formKey: string;
    label: string;
    mono?: boolean;
    multiline?: boolean;
    className?: string;
  }) => {
    if (!isEditingDossier) {
      const value = selectedCaseModal.formData?.[formKey];
      return (
        <div className={className}>
          <span className="text-slate-500 font-semibold block">{label}:</span>
          <strong className={`text-slate-900 block ${mono ? 'font-mono' : ''}`}>{value || '-'}</strong>
        </div>
      );
    }
    const value = editedFormData[formKey] ?? '';
    const options = FIELD_SELECT_OPTIONS[formKey];
    return (
      <div className={className}>
        <label className="text-slate-500 font-semibold block mb-0.5">{label}:</label>
        {options ? (
          <select
            value={value}
            onChange={(e) => setEditedFormData((prev) => ({ ...prev, [formKey]: e.target.value }))}
            className="w-full h-8 px-2 rounded-md border border-blue-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Selecciona...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea
            value={value}
            onChange={(e) => setEditedFormData((prev) => ({ ...prev, [formKey]: e.target.value }))}
            rows={2}
            className="w-full px-2 py-1.5 rounded-md border border-blue-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setEditedFormData((prev) => ({ ...prev, [formKey]: e.target.value }))}
            className={`w-full h-8 px-2 rounded-md border border-blue-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              mono ? 'font-mono' : ''
            }`}
          />
        )}
      </div>
    );
  };

  const totalRegisteredCount = Object.values(selectedCaseModal.formData || {}).filter(Boolean).length;

  return (
    <>
      {/* Quick-Nav Sticky Bar */}
      <div className="sticky top-0 z-10 -mx-6 md:-mx-8 px-6 md:px-8 py-2.5 bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
        {DOSSIER_SECTIONS.map((sec) => {
          const filled = isSectionFilled(selectedCaseModal.formData || {}, sec.fields);
          return (
            <button
              key={sec.anchor}
              type="button"
              onClick={() => scrollToDossierSection(sec.anchor)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors border cursor-pointer ${
                filled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {filled && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Progress Overview Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-900">Progreso del Expediente:</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-2xs">
              {totalRegisteredCount} datos registrados
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {selectedCaseModal.notes || 'Datos sincronizados en tiempo real con la nube de Firebase.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Registrado: {selectedCaseModal.submittedAt || 'Reciente'}</span>
        </div>
      </div>

      {/* 1. INFORMACIÓN PERSONAL */}
      <div id="sec-1" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><User className="w-4 h-4 text-black" />1. Información Personal</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[0].fields) })}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-xs">
          {renderEditableField({ formKey: "apellidos", label: "Apellidos" })}
          {renderEditableField({ formKey: "nombres", label: "Nombres" })}
          {renderEditableField({ formKey: "fecha_nacimiento", label: "Fecha de Nacimiento" })}
          {renderEditableField({ formKey: "lugar_nacimiento", label: "Lugar de Nacimiento" })}
          {renderEditableField({ formKey: "ciudad_nacimiento", label: "Ciudad de Nacimiento" })}
          {renderEditableField({ formKey: "estado_nacimiento", label: "Estado / Provincia Nacimiento" })}
          {renderEditableField({ formKey: "pais_nacimiento", label: "País de Nacimiento" })}
          {renderEditableField({ formKey: "otra_nacionalidad", label: "¿Otra nacionalidad?" })}
          {renderEditableField({ formKey: "cuales_nacionalidades", label: "¿Cuáles nacionalidades?" })}
          {renderEditableField({ formKey: "residente_otro_pais", label: "¿Residente permanente otro país?" })}
          {renderEditableField({ formKey: "que_pais_residencia", label: "¿Qué país de residencia?" })}
          {renderEditableField({ formKey: "num_identificacion_nacional", label: "N° Documento Nacional (DNI / CURP)" })}
          {renderEditableField({ formKey: "rechazo_visa_detalle", label: "¿Rechazo de visa previo?", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5" })}
        </div>
      </div>

      {/* 2. INFORMACIÓN ADICIONAL (ESTUDIANTES F-1) */}
      <div id="sec-2" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><School className="w-4 h-4 text-black" />2. Información Adicional (Sólo para Estudiantes)</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[1].fields) })}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          {renderEditableField({ formKey: "motivo_estudio_ingles", label: "¿Por qué quieres estudiar inglés?", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-4" })}
          {renderEditableField({ formKey: "duracion_estudio", label: "Duración de Estudio" })}
          {renderEditableField({ formKey: "horario_estudio", label: "Horario de Estudio" })}
          {renderEditableField({ formKey: "semestre_inicio", label: "Semestre de Inicio" })}
          <div>
            <span className="text-slate-500 font-semibold block">Estado de Estudio USA:</span>
            <strong className="text-slate-900">Utah</strong>
          </div>
          {renderEditableField({ formKey: "nombre_escuela", label: "Nombre de la Escuela Seleccionada", className: "sm:col-span-2 lg:col-span-4" })}
          {getFieldValue('nombre_escuela') === 'Otra Escuela' &&
            renderEditableField({ formKey: "escuela_manual_nombre", label: "Nombre Manual de la Escuela (Otra Escuela)", className: "sm:col-span-2 lg:col-span-4" })}
          {renderEditableField({ formKey: "rechazo_estudiante_previo", label: "¿Te han rechazado la visa antes?" })}
          {getFieldValue('rechazo_estudiante_previo') === 'Sí' &&
            renderEditableField({ formKey: "detalle_rechazo_estudiante", label: "Detalle del rechazo anterior", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-4" })}
        </div>
      </div>

      {/* 3. ESTADO CIVIL */}
      <div id="sec-3" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-black" />3. Estado Civil</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[2].fields) })}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          {renderEditableField({ formKey: "estado_civil", label: "Estado Civil" })}
          {getFieldValue('estado_civil') === 'Casado' && (
            <>
              {renderEditableField({ formKey: "nombre_conyuge", label: "Nombre del Cónyuge" })}
              {renderEditableField({ formKey: "fecha_matrimonio", label: "Fecha de Matrimonio" })}
              {renderEditableField({ formKey: "fecha_nacimiento_conyuge", label: "Nacimiento Cónyuge" })}
              {renderEditableField({ formKey: "lugar_nacimiento_conyuge", label: "Lugar de Nacimiento Cónyuge" })}
              {renderEditableField({ formKey: "ciudad_conyuge", label: "Ciudad Cónyuge" })}
              {renderEditableField({ formKey: "estado_conyuge", label: "Estado / Provincia Cónyuge" })}
              {renderEditableField({ formKey: "pais_conyuge", label: "País Cónyuge" })}
            </>
          )}
        </div>
      </div>

      {/* 4. PASAPORTE */}
      <div id="sec-4" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-black" />4. Pasaporte</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[3].fields) })}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          {renderEditableField({ formKey: "num_pasaporte", label: "Número de Pasaporte", mono: true })}
          {renderEditableField({ formKey: "ciudad_pasaporte", label: "Ciudad de Emisión" })}
          {renderEditableField({ formKey: "estado_pasaporte", label: "Estado de Emisión" })}
          {renderEditableField({ formKey: "fecha_emision_pasaporte", label: "Fecha de Emisión" })}
          {renderEditableField({ formKey: "fecha_expiracion_pasaporte", label: "Fecha de Expiración" })}
          {renderEditableField({ formKey: "perdio_pasaporte", label: "¿Ha extraviado pasaporte antes?" })}
          {renderEditableField({ formKey: "tiene_visa_turista", label: "¿Tiene visa de turista?" })}
        </div>
      </div>

      {/* 5. DIRECCIÓN DE DOMICILIO ACTUAL */}
      <div id="sec-5" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><Home className="w-4 h-4 text-black" />5. Dirección de Domicilio Actual</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[4].fields) })}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-xs">
          {renderEditableField({ formKey: "direccion_domicilio", label: "Dirección", className: "sm:col-span-2" })}
          {renderEditableField({ formKey: "ciudad_domicilio", label: "Ciudad" })}
          {renderEditableField({ formKey: "estado_domicilio", label: "Estado / Provincia" })}
          {renderEditableField({ formKey: "pais_domicilio", label: "País" })}
          {renderEditableField({ formKey: "cp_domicilio", label: "Código Postal" })}
          {renderEditableField({ formKey: "celular_contacto", label: "Celular" })}
          {renderEditableField({ formKey: "email_contacto", label: "Email" })}
        </div>
      </div>

      {/* 6. PATROCINADOR / SPONSOR */}
      <div id="sec-6" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-black" />6. Patrocinador / Sponsor</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[5].fields) })}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          {renderEditableField({ formKey: "tiene_patrocinador", label: "¿Tiene Patrocinador?" })}
          {getFieldValue('tiene_patrocinador') === 'Sí' && (
            <>
              {renderEditableField({ formKey: "sponsor_nombres", label: "Nombres" })}
              {renderEditableField({ formKey: "sponsor_apellidos", label: "Apellidos" })}
              {renderEditableField({ formKey: "sponsor_parentesco", label: "Parentesco" })}
              {renderEditableField({ formKey: "sponsor_celular", label: "Teléfono" })}
              {renderEditableField({ formKey: "sponsor_email", label: "Email" })}
              {renderEditableField({ formKey: "sponsor_direccion", label: "Dirección Sponsor" })}
            </>
          )}
        </div>
      </div>

      {/* 7. HIJOS */}
      <div id="sec-7" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-black" />
            7. Hijos ({selectedCaseModal.formData.hijos_count || '0'} Hijos Registrados)
          </span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[6].fields) })}
        </h4>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {renderEditableField({ formKey: "hijos_count", label: "¿Cuántos hijos vendrán contigo?" })}
          </div>
          {Array.from({ length: parseInt(getFieldValue('hijos_count') || '0', 10) || 0 }).map((_, i) => {
            const hNum = i + 1;
            return (
              <div key={hNum} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {renderEditableField({ formKey: `hijo${hNum}_nombres`, label: `Hijo N° ${hNum} - Nombres` })}
                {renderEditableField({ formKey: `hijo${hNum}_apellidos`, label: "Apellidos" })}
                {renderEditableField({ formKey: `hijo${hNum}_fecha_nac`, label: "Fecha de Nacimiento" })}
                {renderEditableField({ formKey: `hijo${hNum}_pasaporte`, label: "Pasaporte", mono: true })}
              </div>
            );
          })}
          {(!getFieldValue('hijos_count') || getFieldValue('hijos_count') === '0') && (
            <p className="text-xs text-slate-500">El postulante indicó que no viajará con hijos.</p>
          )}
        </div>
      </div>

      {/* 8. PADRES */}
      <div id="sec-8" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-black" />8. Nombre de los Padres</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[7].fields) })}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {renderEditableField({ formKey: "nombre_mama", label: "Nombre Completo Mamá" })}
          {renderEditableField({ formKey: "fecha_nac_mama", label: "Fecha Nac. Mamá" })}
          {renderEditableField({ formKey: "nombre_papa", label: "Nombre Completo Papá" })}
          {renderEditableField({ formKey: "fecha_nac_papa", label: "Fecha Nac. Papá" })}
        </div>
      </div>

      {/* 9. INFORMACIÓN DE TRABAJO */}
      <div id="sec-9" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-black" />9. Información de Trabajo</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[8].fields) })}
        </h4>
        <div className="space-y-4 text-xs">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Empleo Actual</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {renderEditableField({ formKey: "trabajo_empresa", label: "Empresa" })}
              {renderEditableField({ formKey: "trabajo_direccion", label: "Dirección" })}
              {renderEditableField({ formKey: "trabajo_ciudad", label: "Ciudad" })}
              {renderEditableField({ formKey: "trabajo_estado", label: "Estado / Provincia" })}
              {renderEditableField({ formKey: "trabajo_cp", label: "Código Postal" })}
              {renderEditableField({ formKey: "trabajo_pais", label: "País" })}
              {renderEditableField({ formKey: "trabajo_telefono", label: "Teléfono Empresa" })}
              {renderEditableField({ formKey: "trabajo_fecha_inicio", label: "Fecha de Inicio" })}
              {renderEditableField({ formKey: "trabajo_salario", label: "Salario Mensual" })}
              {renderEditableField({ formKey: "trabajo_descripcion", label: "Descripción de Labores", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-6" })}
              {renderEditableField({ formKey: "trabajo_otras_fuentes", label: "¿Tienes más fuentes de ingreso?", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-6" })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {renderEditableField({ formKey: "trabajo_anterior_si", label: "¿Tuviste un empleo anterior al actual?" })}
            </div>
          </div>

          {getFieldValue('trabajo_anterior_si') === 'Sí' && (
            <div className="border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Empleo Anterior</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                {renderEditableField({ formKey: "trabajo_ant_empresa", label: "Empresa Anterior" })}
                {renderEditableField({ formKey: "trabajo_ant_direccion", label: "Dirección" })}
                {renderEditableField({ formKey: "trabajo_ant_ciudad", label: "Ciudad" })}
                {renderEditableField({ formKey: "trabajo_ant_estado", label: "Estado" })}
                {renderEditableField({ formKey: "trabajo_ant_cp", label: "Código Postal" })}
                {renderEditableField({ formKey: "trabajo_ant_cargo", label: "Cargo Desempeñado" })}
                {renderEditableField({ formKey: "trabajo_ant_supervisor", label: "Supervisor" })}
                {renderEditableField({ formKey: "trabajo_ant_fecha_inicio", label: "Fecha de Inicio" })}
                {renderEditableField({ formKey: "trabajo_ant_fecha_fin", label: "Fecha de Término" })}
                {renderEditableField({ formKey: "trabajo_ant_descripcion", label: "Descripción de Labores Anteriores", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-6" })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 10 & 11. EDUCACIÓN */}
      <div id="sec-10" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-black" />10 & 11. Historial Educativo</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[9].fields) })}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <strong className="text-slate-900 text-xs uppercase block border-b border-slate-200 pb-1">Educación Secundaria</strong>
            {renderEditableField({ formKey: "secundaria_nombre", label: "Institución" })}
            {renderEditableField({ formKey: "secundaria_direccion", label: "Dirección" })}
            {renderEditableField({ formKey: "secundaria_programa", label: "Programa / Título" })}
            {renderEditableField({ formKey: "secundaria_fecha_inicio", label: "Fecha Inicio" })}
            {renderEditableField({ formKey: "secundaria_fecha_fin", label: "Fecha Fin" })}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <strong className="text-slate-900 text-xs uppercase block border-b border-slate-200 pb-1">Universidad / Instituto</strong>
            {renderEditableField({ formKey: "universidad_nombre", label: "Institución" })}
            {renderEditableField({ formKey: "universidad_direccion", label: "Dirección" })}
            {renderEditableField({ formKey: "universidad_programa", label: "Carrera / Programa" })}
            {renderEditableField({ formKey: "universidad_fecha_inicio", label: "Fecha Inicio" })}
            {renderEditableField({ formKey: "universidad_fecha_fin", label: "Fecha Fin" })}
          </div>
        </div>
      </div>

      {/* 12. ENTRADA A ESTADOS UNIDOS Y ANTECEDENTES */}
      <div id="sec-12" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><Plane className="w-4 h-4 text-black" />12. Información requerida antes de entrar a EE.UU.</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[10].fields) })}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          {renderEditableField({ formKey: "usa_hospedaje_direccion", label: "Dirección de Hospedaje en EE.UU.", className: "sm:col-span-2 lg:col-span-3" })}
          {renderEditableField({ formKey: "usa_fecha_llegada", label: "Fecha de Llegada" })}
          {renderEditableField({ formKey: "usa_fecha_salida", label: "Fecha de Salida" })}
          {renderEditableField({ formKey: "usa_viajes_anteriores", label: "Viajes Anteriores a EE.UU.", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-6" })}
          {renderEditableField({ formKey: "usa_visas_anteriores_detalle", label: "Visas Americanas Anteriores", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-6" })}
          {renderEditableField({ formKey: "idiomas_habla", label: "Idiomas que habla" })}
          {renderEditableField({ formKey: "servicio_militar", label: "¿Servicio militar?" })}
          {renderEditableField({ formKey: "cambio_celular_5anos", label: "¿Cambió de celular en los últimos 5 años?" })}
          {renderEditableField({ formKey: "link_instagram", label: "Instagram" })}
          {renderEditableField({ formKey: "link_facebook", label: "Facebook", className: "sm:col-span-2" })}
          {renderEditableField({ formKey: "familia_en_usa", label: "¿Tiene familia en EE.UU.?" })}
          {getFieldValue('familia_en_usa') === 'Sí' &&
            renderEditableField({ formKey: "familia_usa_detalle", label: "Nombre Familiar / Relación / Estado migratorio", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-6" })}
          {renderEditableField({ formKey: "viajes_otros_paises_5anos", label: "Viajes a otros países en los últimos 5 años", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-4" })}
        </div>
      </div>

      {/* 13. CONTACTOS DE EMERGENCIA (NO FAMILIARES) */}
      <div id="sec-13" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-black" />13. Contactos de Emergencia (NO Familiares)</span>
          {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[11].fields) })}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Contacto 1 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <strong className="text-slate-900 font-bold block border-b border-slate-200 pb-1 uppercase tracking-wider text-[11px]">
              Contacto de Emergencia N° 1
            </strong>
            {renderEditableField({ formKey: "c1_nombre", label: "Nombre" })}
            {renderEditableField({ formKey: "c1_telefono", label: "Teléfono" })}
            {renderEditableField({ formKey: "c1_email", label: "Email" })}
            {renderEditableField({ formKey: "c1_direccion", label: "Dirección" })}
            {renderEditableField({ formKey: "c1_ciudad", label: "Ciudad" })}
            {renderEditableField({ formKey: "c1_estado", label: "Estado" })}
            {renderEditableField({ formKey: "c1_pais", label: "País" })}
            {renderEditableField({ formKey: "c1_cp", label: "Código Postal" })}
          </div>

          {/* Contacto 2 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <strong className="text-slate-900 font-bold block border-b border-slate-200 pb-1 uppercase tracking-wider text-[11px]">
              Contacto de Emergencia N° 2
            </strong>
            {renderEditableField({ formKey: "c2_nombre", label: "Nombre" })}
            {renderEditableField({ formKey: "c2_telefono", label: "Teléfono" })}
            {renderEditableField({ formKey: "c2_email", label: "Email" })}
            {renderEditableField({ formKey: "c2_direccion", label: "Dirección" })}
            {renderEditableField({ formKey: "c2_ciudad", label: "Ciudad" })}
            {renderEditableField({ formKey: "c2_estado", label: "Estado" })}
            {renderEditableField({ formKey: "c2_pais", label: "País" })}
            {renderEditableField({ formKey: "c2_cp", label: "Código Postal" })}
          </div>
        </div>
      </div>
    </>
  );
};
