'use client';

import React from "react";
import { FileText, Sparkles, UserCheck, Download, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal } from "../PortalContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RecursosPage() {
  const router = useRouter();
  const { activeTopSection, isUnlocked } = usePortal();

  const isStudent = activeTopSection === 'visa-estudiante';
  const unlocked = isUnlocked('recursos', isStudent ? 'estudiante' : 'turista');

  const handleDownloadAttempt = (fileName: string) => {
    if (!unlocked) {
      toast.info("Estos recursos oficiales se desbloquean al adquirir un Plan de Asesoría de uDreamms.", {
        action: {
          label: "Ver Planes",
          onClick: () => router.push('/portal/planes'),
        },
      });
      return;
    }
    toast.success(`Descargando ${fileName}...`);
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Recursos adicionales</h2>
          <p className="text-sm text-slate-500">Accede a tus herramientas de preparación y recursos adicionales.</p>
        </div>
        {!unlocked && (
          <Button
            onClick={() => router.push('/portal/planes')}
            className="self-start md:self-auto h-9 px-4 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <span>Desbloquear con un Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {!unlocked && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3 text-amber-800 text-xs">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <p className="leading-relaxed">
            Puedes consultar el catálogo de recursos. Las descargas de plantillas oficiales y guías se liberan exclusivamente al adquirir cualquier <strong>Plan de Asesoría uDreamms</strong>.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Product 1 */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 space-y-4 hover:shadow-2xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FileText className="w-8 h-8 text-black transition-transform group-hover:scale-110" />
              {!unlocked && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Requiere Plan
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isStudent ? "Guía de Entrevista Consular" : "Guía de Entrevista Consular (Turismo)"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isStudent 
                  ? "Recopilación de las preguntas más frecuentes del cónsul y consejos prácticos para responder con seguridad."
                  : "Recopilación de las preguntas frecuentes sobre turismo, fondos económicos e intenciones de retorno."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleDownloadAttempt("Guía de Entrevista")}
            className={`w-full h-11 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
              unlocked
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            {unlocked ? (
              <>
                Descargar PDF
                <Download className="w-4 h-4 text-white" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Descargar PDF
              </>
            )}
          </Button>
        </div>

        {/* Product 2 */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 space-y-4 hover:shadow-2xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Sparkles className="w-8 h-8 text-black transition-transform group-hover:scale-110" />
              {!unlocked && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Requiere Plan
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isStudent ? "Plantilla de Carta de Intención" : "Plantilla de Lazos de Arraigo"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isStudent
                  ? "Formato sugerido y redactado profesionalmente para demostrar tus lazos con tu país de origen."
                  : "Modelo de redacción y documentos de soporte sugeridos para probar tus vínculos de arraigo."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleDownloadAttempt("Plantilla de Carta")}
            className={`w-full h-11 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
              unlocked
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            {unlocked ? (
              <>
                Descargar DOCX
                <Download className="w-4 h-4 text-white" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Descargar DOCX
              </>
            )}
          </Button>
        </div>

        {/* Product 3 */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 space-y-4 hover:shadow-2xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <UserCheck className="w-8 h-8 text-black transition-transform group-hover:scale-110" />
              {!unlocked && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Requiere Plan
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isStudent ? "Checklist de Requisitos Consulares" : "Checklist de Requisitos Turísticos"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isStudent
                  ? "Lista de verificación interactiva de documentos indispensables que debes presentar el día de tu cita."
                  : "Lista de verificación interactiva de lazos familiares, financieros y laborales para tu cita."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleDownloadAttempt("Checklist de Requisitos")}
            className={`w-full h-11 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
              unlocked
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            {unlocked ? (
              <>
                Descargar PDF
                <Download className="w-4 h-4 text-white" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Descargar PDF
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
