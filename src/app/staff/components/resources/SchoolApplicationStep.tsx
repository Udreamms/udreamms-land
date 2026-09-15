'use client';

import React, { useState } from 'react';
import {
  School,
  MapPin,
  FileText,
  Building2,
  ExternalLink,
  Copy,
  Check,
  Download,
  Mail,
  Lightbulb,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  SchoolType,
  SCHOOLS_LIST,
  LUMOS_PORTAL_URL,
  MILA_JOTFORM_URL,
  UCEDA_PDF_URL,
  TALK_PDF_URL
} from './resourcesData';

export const SchoolApplicationStep: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolType>('lumos');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`¡${label} copiado al portapapeles!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="bg-white border-2 border-blue-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header of Step 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 font-black text-lg">
            1
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Paso 1: Aplicación y Admisión a la Escuela (F-1 / I-20)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-extrabold uppercase border border-blue-200">
                Variable por Escuela
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Selecciona abajo la escuela a la que postula el estudiante para cargar su respectivo formulario, código o correo de admisiones.
            </p>
          </div>
        </div>
      </div>

      {/* School Selector Buttons */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Elige la escuela aliada para ver su guía:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCHOOLS_LIST.map((school) => {
            const isSelected = selectedSchool === school.id;
            return (
              <button
                key={school.id}
                type="button"
                onClick={() => setSelectedSchool(school.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {school.id === 'lumos' && <School className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />}
                    {school.id === 'mila' && <MapPin className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-slate-500'}`} />}
                    {school.id === 'uceda' && <FileText className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-500'}`} />}
                    {school.id === 'talk' && <Building2 className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-500'}`} />}
                    <span className="text-xs font-black text-slate-900 line-clamp-1">{school.name}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${school.badgeColor}`}>
                    {school.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic School View: LUMOS */}
      {selectedSchool === 'lumos' && (
        <div className="space-y-5 animate-in fade-in duration-200 border-t border-slate-100 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-blue-950 flex items-center gap-2">
                <School className="w-4 h-4 text-blue-600" />
                Lumos Language School (Utah)
              </h3>
              <p className="text-xs text-blue-900/80">
                Campus Salt Lake City & Orem, Utah • Registro en portal oficial de Lumos.
              </p>
            </div>
            <a
              href={LUMOS_PORTAL_URL}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Abrir Portal Lumos</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          </div>

          {/* Agency Code Box */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest">
                  ¡CÓDIGO OBLIGATORIO!
                </span>
                <h4 className="text-sm font-bold text-amber-950">Código de Agencia para Lumos</h4>
              </div>
              <p className="text-xs text-amber-900">
                Ingresar en el campo <em>"Agency / Referral Code"</em> para asociar el caso a Udreamms.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-amber-300 shadow-inner shrink-0">
              <span className="text-base font-mono font-black tracking-widest text-slate-900 select-all">
                UDREAMMS
              </span>
              <Button
                type="button"
                onClick={() => handleCopy('UDREAMMS', 'lumos_code', 'Código UDREAMMS')}
                className="h-7 px-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'lumos_code' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'lumos_code' ? 'Copiado' : 'Copiar'}</span>
              </Button>
            </div>
          </div>

          {/* Step list for Lumos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">1. Datos del Alumno</span>
              <p className="text-slate-600 text-[11px]">
                Copiar del expediente nombres exactos como en pasaporte, fecha de nacimiento, domicilio y teléfono.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">2. Código y Documentos</span>
              <p className="text-slate-600 text-[11px]">
                Escribir <strong className="font-mono text-amber-900">UDREAMMS</strong> y adjuntar Pasaporte y Solvencia Bancaria descargados del expediente.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">3. Cambiar a "Solicitud de Admisión"</span>
              <p className="text-slate-600 text-[11px]">
                Al terminar el formulario, actualizar la tarjeta del expediente en Staff a la pestaña <strong>Solicitud de Admisión</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic School View: MILA */}
      {selectedSchool === 'mila' && (
        <div className="space-y-5 animate-in fade-in duration-200 border-t border-slate-100 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-purple-950 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                MILA International Language Academy (Orlando, Florida)
              </h3>
              <p className="text-xs text-purple-900/80">
                Formulario Oficial JotForm con selección del agente de Udreamms.
              </p>
            </div>
            <a
              href={MILA_JOTFORM_URL}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Abrir Formulario JotForm MILA</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          </div>

          {/* Agent Selection Box */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest">
                  ¡AGENTE OBLIGATORIO!
                </span>
                <h4 className="text-sm font-bold text-purple-950">Agente Responsable en MILA</h4>
              </div>
              <p className="text-xs text-purple-900">
                Hacer clic en <em>"Siguiente"</em>, seleccionar <strong>"Valentina Vega Udreamms LLC"</strong> y hacer clic en <em>"Próximo"</em> para comenzar el llenado normal.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-purple-300 shadow-inner shrink-0">
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-900 select-all">
                Valentina Vega Udreamms LLC
              </span>
              <Button
                type="button"
                onClick={() => handleCopy('Valentina Vega Udreamms LLC', 'mila_agent', 'Agente Valentina Vega')}
                className="h-7 px-2.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'mila_agent' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'mila_agent' ? 'Copiado' : 'Copiar'}</span>
              </Button>
            </div>
          </div>

          {/* Step list for MILA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">1. Elegir Agente</span>
              <p className="text-slate-600 text-[11px]">
                En la primera pantalla del JotForm, clic en siguiente y seleccionar obligatoriamente a Valentina Vega.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">2. Cargar Datos y Archivos</span>
              <p className="text-slate-600 text-[11px]">
                Completar información personal del estudiante y cargar copia de pasaporte y extracto financiero.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">3. Confirmación</span>
              <p className="text-slate-600 text-[11px]">
                Enviar formulario y pasar el caso a <strong>Solicitud de Admisión</strong> en el panel de Staff.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic School View: UCEDA */}
      {selectedSchool === 'uceda' && (
        <div className="space-y-5 animate-in fade-in duration-200 border-t border-slate-100 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50/70 border border-teal-200 rounded-2xl p-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-teal-950 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                UCEDA International
              </h3>
              <p className="text-xs text-teal-900/80">
                Llenar formulario oficial en PDF y remitir vía correo a Admisiones UCEDA con Pasaporte y Extracto Bancario.
              </p>
            </div>
            <a
              href={UCEDA_PDF_URL}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Descargar PDF Formulario UCEDA</span>
            </a>
          </div>

          {/* Email Recipient Box */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-300 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[9px] font-black uppercase tracking-widest">
                  DESTINATARIO ADMISIONES
                </span>
                <h4 className="text-sm font-bold text-teal-950">Contacto Directo UCEDA</h4>
              </div>
              <p className="text-xs text-teal-900">
                Enviar PDF de aplicación + Pasaporte + Extracto bancario del postulante a Stephanie Fugon.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-teal-300 shadow-inner shrink-0">
              <Mail className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-mono font-bold text-slate-900 select-all">
                stephanie.fugon@uceda.edu
              </span>
              <Button
                type="button"
                onClick={() => handleCopy('stephanie.fugon@uceda.edu', 'uceda_email', 'Correo UCEDA')}
                className="h-7 px-2.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'uceda_email' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'uceda_email' ? 'Copiado' : 'Copiar'}</span>
              </Button>
            </div>
          </div>

          {/* Step list for UCEDA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">1. Descargar y Llenar PDF</span>
              <p className="text-slate-600 text-[11px]">
                Descargar el formulario <em>Initial_F1-Application_UCEDA.pdf</em> y completar los campos del alumno.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">2. Adjuntar Documentos</span>
              <p className="text-slate-600 text-[11px]">
                Adjuntar Pasaporte vigente y extracto bancario en PDF al correo electrónico.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">3. Enviar a Stephanie Fugon</span>
              <p className="text-slate-600 text-[11px]">
                Enviar a <strong className="text-teal-900">stephanie.fugon@uceda.edu</strong> y registrar en el panel de Staff.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic School View: TALK */}
      {selectedSchool === 'talk' && (
        <div className="space-y-5 animate-in fade-in duration-200 border-t border-slate-100 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-rose-950 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-rose-600" />
                TALK English Schools (Miami, Boston, San Francisco, Atlanta)
              </h3>
              <p className="text-xs text-rose-900/80">
                Llenar Booking Form oficial en PDF y enviar por correo a admisiones TALK con Pasaporte y Solvencia.
              </p>
            </div>
            <a
              href={TALK_PDF_URL}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Descargar PDF Booking Form TALK</span>
            </a>
          </div>

          {/* Email Recipient Box */}
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-300 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest">
                  DESTINATARIO ADMISIONES
                </span>
                <h4 className="text-sm font-bold text-rose-950">Contacto Directo TALK</h4>
              </div>
              <p className="text-xs text-rose-900">
                Enviar Booking Form en PDF + Pasaporte + Extracto bancario del postulante a Taisa Bezerra.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-rose-300 shadow-inner shrink-0">
              <Mail className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-mono font-bold text-slate-900 select-all">
                taisa.bezerra@talk.edu
              </span>
              <Button
                type="button"
                onClick={() => handleCopy('taisa.bezerra@talk.edu', 'talk_email', 'Correo TALK')}
                className="h-7 px-2.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'talk_email' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'talk_email' ? 'Copiado' : 'Copiar'}</span>
              </Button>
            </div>
          </div>

          {/* Step list for TALK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">1. Descargar Booking Form</span>
              <p className="text-slate-600 text-[11px]">
                Descargar <em>Booking_Form.pdf</em> y completar sede elegida (Miami, Boston, etc.) y semanas de curso.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">2. Documentos Adjuntos</span>
              <p className="text-slate-600 text-[11px]">
                Incluir Pasaporte vigente escaneado y comprobante de fondos bancarios del postulante o sponsor.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">3. Remitir a Taisa Bezerra</span>
              <p className="text-slate-600 text-[11px]">
                Enviar a <strong className="text-rose-900">taisa.bezerra@talk.edu</strong> y registrar en el panel de Staff.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
