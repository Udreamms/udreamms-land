'use client';

import React from "react";
import { FileText, Sparkles, UserCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal } from "../PortalContext";

export default function RecursosPage() {
  const { activeTopSection } = usePortal();

  const isStudent = activeTopSection === 'visa-estudiante';

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Recursos adicionales</h2>
        <p className="text-sm text-slate-500">Accede a tus herramientas de preparación y recursos adicionales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Product 1 */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 space-y-4 hover:shadow-2xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <FileText className="w-8 h-8 text-black transition-transform group-hover:scale-110" />
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
          <Button className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-blue-500/20 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2">
            Descargar PDF
            <Download className="w-4 h-4 text-white" />
          </Button>
        </div>

        {/* Product 2 */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 space-y-4 hover:shadow-2xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <Sparkles className="w-8 h-8 text-black transition-transform group-hover:scale-110" />
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
          <Button className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-blue-500/20 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2">
            Descargar DOCX
            <Download className="w-4 h-4 text-white" />
          </Button>
        </div>

        {/* Product 3 */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 space-y-4 hover:shadow-2xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <UserCheck className="w-8 h-8 text-black transition-transform group-hover:scale-110" />
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
          <Button className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-blue-500/20 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2">
            Descargar PDF
            <Download className="w-4 h-4 text-white" />
          </Button>
        </div>

      </div>
    </div>
  );
}
