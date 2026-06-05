'use client';

import React from "react";
import { FileText, Sparkles, UserCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal } from "../PortalContext";

export default function RecursosPage() {
  const { activeTopSection } = usePortal();

  const isStudent = activeTopSection === 'visa-estudiante';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight">Recursos adicionales</h2>
        <p className="text-sm text-white/50">Accede a tus herramientas de preparación y recursos adicionales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Product 1 */}
        <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] transition-all group">
          <FileText className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <h3 className="text-md font-normal">
              {isStudent ? "Guía de Entrevista Consular" : "Guía de Entrevista Consular (Turismo)"}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              {isStudent 
                ? "Recopilación de las preguntas más frecuentes del cónsul y consejos prácticos para responder con seguridad."
                : "Recopilación de las preguntas frecuentes sobre turismo, fondos económicos e intenciones de retorno."}
            </p>
          </div>
          <Button className="w-full h-10 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2">
            Descargar PDF
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Product 2 */}
        <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] transition-all group">
          <Sparkles className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <h3 className="text-md font-normal">
              {isStudent ? "Plantilla de Carta de Intención" : "Plantilla de Lazos de Arraigo"}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              {isStudent
                ? "Formato sugerido y redactado profesionalmente para demostrar tus lazos con tu país de origen."
                : "Modelo de redacción y documentos de soporte sugeridos para probar tus vínculos de arraigo."}
            </p>
          </div>
          <Button className="w-full h-10 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2">
            Descargar DOCX
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Product 3 */}
        <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] transition-all group">
          <UserCheck className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <h3 className="text-md font-normal">
              {isStudent ? "Checklist de Requisitos Consulares" : "Checklist de Requisitos Turísticos"}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              {isStudent
                ? "Lista de verificación interactiva de documentos indispensables que debes presentar el día de tu cita."
                : "Lista de verificación interactiva de lazos familiares, financieros y laborales para tu cita."}
            </p>
          </div>
          <Button className="w-full h-10 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2">
            Descargar PDF
            <Download className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
