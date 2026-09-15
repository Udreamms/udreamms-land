'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Mail,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Lightbulb,
  FileCheck,
  Lock,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AIS_PORTAL_URL,
  I94_PORTAL_URL,
  EMAIL_BODY_TEMPLATE,
  PLANTILLA_SIN_GOCE_SUELDO_URL,
  PLANTILLA_CERTIFICADO_LABORAL_URL
} from './resourcesData';

export const EmbassyInterviewStep: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`¡${label} copiado al portapapeles!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="bg-white border-2 border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header of Step 4 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 font-black text-lg">
            4
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Paso 4: Entrevista en Embajada, Cita AIS, Simulacros & Entrega
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase border border-emerald-200">
                Fase Consular Clave
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Portal AIS, asignación de credenciales estándar, simulacros de entrevista, plantilla de correo oficial y armado de dos carpetas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={AIS_PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="h-10 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>Abrir Portal Citas AIS</span>
            <ExternalLink className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>

      {/* Standard Credentials & Rules Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest">
              ESTÁNDAR OPERATIVO AIS
            </span>
            <h3 className="text-base font-bold text-emerald-950">
              Creación de Cuenta en Portal AIS
            </h3>
          </div>
          <p className="text-xs text-emerald-900">
            Al crear el correo y la cuenta del estudiante en el portal consular de citas (AIS), usar <strong>obligatoriamente</strong> la contraseña estándar de la agencia.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-inner shrink-0">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span className="text-sm sm:text-base font-mono font-black tracking-wider text-slate-900 select-all">
            @Udreamms2026
          </span>
          <Button
            type="button"
            onClick={() => handleCopy('@Udreamms2026', 'std_pwd', 'Contraseña estándar')}
            className="h-7 px-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'std_pwd' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey === 'std_pwd' ? 'Copiada' : 'Copiar'}</span>
          </Button>
        </div>
      </div>

      {/* Two Folders Checklist */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          Preparación de Documentación: Las 2 Carpetas del Postulante
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Carpeta 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">1</span>
                Primera Carpeta (Documentos Obligatorios)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                Mano Consular
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-1.5 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Pasaporte vigente:</strong> del titular y dependientes F-2 (si aplica).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Formulario I-20 oficial:</strong> firmado en la página 1 con fecha de recepción por el estudiante.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Carta de Aceptación</strong> emitida por la institución educativa aliada.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Recibo oficial de Tasa SEVIS (I-901):</strong> por $350 USD.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Página de Confirmación DS-160:</strong> con código de barras CEAC.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Extracto Bancario:</strong> demostrando fondos suficientes reportados en la aplicación.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Comprobante de pago y cita de la entrevista (AIS).</strong></span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span>2 fotografías físicas tamaño ID 5x5 cm fondo blanco.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span>Certificado de matrimonio / partidas de nacimiento de hijos (si aplica dependientes).</span>
              </li>
            </ul>
          </div>

          {/* Carpeta 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-text-white text-[10px] font-black flex items-center justify-center">2</span>
                Segunda Carpeta (Lazos Fuertes & Plantillas Notion)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                Soporte de Arraigo
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-2 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Certificado de Trabajo:</strong> demostrando cargo, antigüedad e ingresos mensuales.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Permiso especial sin goce de sueldo:</strong> carta del empleador comprometiéndose a mantener el contrato y autorizando el periodo de estudio.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Títulos de propiedad, vehículos, negocios</strong> o contratos de arrendamiento que demuestren que el postulante volverá a su país de origen.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>Declaración jurada de impuestos / solvencia del garante o patrocinador.</span>
              </li>
            </ul>

            {/* Notion Download Buttons for Templates */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row gap-2">
              <a
                href={PLANTILLA_SIN_GOCE_SUELDO_URL}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-8 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-purple-600" />
                <span>Plantilla Sin Goce de Sueldo</span>
              </a>
              <a
                href={PLANTILLA_CERTIFICADO_LABORAL_URL}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-8 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-purple-600" />
                <span>Plantilla Certificado Laboral</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-formatted Email Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-600" />
              Plantilla Oficial de Correo de Entrega de Documentación
            </span>
            <p className="text-[11px] text-slate-500">
              Asunto: <strong>Documentos</strong> • Listo para copiar y personalizar con el nombre del postulante.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => handleCopy(EMAIL_BODY_TEMPLATE, 'email_template', 'Plantilla de correo')}
            className="h-8 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
          >
            {copiedKey === 'email_template' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'email_template' ? 'Plantilla Copiada' : 'Copiar Plantilla Completa'}</span>
          </Button>
        </div>

        <pre className="bg-white p-4 rounded-xl border border-slate-200 text-[11px] text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto shadow-inner">
          {EMAIL_BODY_TEMPLATE}
        </pre>
      </div>

      {/* I-94 Portal Helper */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold">Consulta y Registro de Historial I-94</h4>
          </div>
          <p className="text-xs text-slate-300">
            Para verificar o descargar el historial de viajes previos a EE.UU. del estudiante en el portal oficial de CBP.
          </p>
        </div>
        <a
          href={I94_PORTAL_URL}
          target="_blank"
          rel="noreferrer"
          className="h-8 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer"
        >
          <span>Abrir Portal I-94</span>
          <ExternalLink className="w-3.5 h-3.5 text-white" />
        </a>
      </div>
    </div>
  );
};
