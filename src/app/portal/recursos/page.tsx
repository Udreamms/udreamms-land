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

  const unlockedBook = isUnlocked('libro', isStudent ? 'estudiante' : 'turista');

  return (
    <div className="w-full min-w-0 space-y-6 text-slate-900 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Recursos adicionales</h2>
          <p className="text-sm text-slate-500 font-normal">Accede a tus herramientas de preparación, plantillas oficiales y tu libro digital.</p>
        </div>
        {!unlocked && (
          <Button
            onClick={() => router.push('/portal/planes')}
            className="self-start md:self-auto h-9 px-4 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-medium flex items-center gap-2 shadow-sm"
          >
            <span>Desbloquear con un Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Featured Ebook Section */}
      <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-7 flex flex-col md:flex-row items-center gap-6 w-full font-sans transition-all duration-300">
        {/* Book Mockup cover */}
        <div className="w-40 h-56 md:w-44 md:h-60 shrink-0 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-black border border-slate-700 flex flex-col justify-between p-4 shadow-xl hover:scale-102 transition-transform duration-300 relative group overflow-hidden text-white">
          <span className="text-[10px] font-semibold tracking-widest text-slate-300 uppercase">uDreamms Ebook</span>
          <div className="space-y-1 z-10">
            <h4 className="text-xs font-semibold leading-tight text-slate-200">
              {isStudent ? "OBTÉN TU" : "TU VIAJE EN"}
            </h4>
            <h4 className={`${isStudent ? "text-base font-bold tracking-tight" : "text-lg font-bold tracking-tight"} text-white uppercase`}>
              {isStudent ? "VISA DE ESTUDIANTE" : "USA TURISMO"}
            </h4>
            <p className="text-[9px] text-slate-300 pt-0.5">
              {isStudent 
                ? "en 30 días" 
                : "Guía de aprobación de Visa"}
            </p>
          </div>
          <span className="text-[8px] tracking-[0.2em] uppercase text-slate-400 z-10 font-semibold">Edición 2026</span>
        </div>

        {/* Book details */}
        <div className="space-y-4 text-center md:text-left flex-1 min-w-0">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Libro Oficial
              </span>
              {!unlockedBook && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Requiere Compra
                </span>
              )}
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-900">
              {isStudent 
                ? "Obtén tu Visa de Estudiante en 30 Días" 
                : "Turista en USA: Guía para una Aprobación Consular Exitosa"}
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
              {isStudent
                ? "Descubre cómo obtener tu visa de estudiante para Estados Unidos con el libro digital Udreamms. Aprende paso a paso cómo gestionar tu documentación oficial, llenar formularios y presentarte a la entrevista consular."
                : "Este libro digital contiene los secretos prácticos de Udreamms para responder con precisión sobre tus planes turísticos, justificar fondos y garantizar tu retorno."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
            {unlockedBook ? (
              <a
                href="https://hotmart.s3.amazonaws.com/product_contents/983dc68d-226b-49b9-b21d-8690a0e1781c/Libro%20Oficial%20Udreamms%202025.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIAlyHIes8td8SftGgCGD7a%2Fg6F7O75p935aSUeOFQqosAiEAtudMlgXKWth5wfHOvHfm%2BR0SXymggImEyeFI5AL9pNMqigUIcBADGgwwOTYzNTI1NjM4NzMiDDw9pm%2FUI%2B7JksJKGSrnBNxgSzENiekiJ%2Fzaoynv%2BfOsXHClS%2Fs4U7FeMwIcYd%2FQe%2BRRZ3u6JW%2BG6W%2BPAxFjEOJYDg3LF3P%2FfVdnq9OrJBlJt7eHi6z1MKbujl0ueuyg4%2FYL5xlCrDxeEBnqLlnBCSsTbOLjqzpIqP5FAePZqq5Oh7vcMxQHFqb4BE2dgnvAXw9p8J4dczy5bIqNGKIbpB1i%2FgTEf7FZ95woBgVx%2BvcGCiuS6aaE5iqYB9jNuql%2B%2Fa6nXowLL0Gl%2Fy2IMjhJcMS9iCrVr6Ayq%2FhJondfRBOFU1ieG3t8aqIkB%2FBjMggn%2B1ZpmzNuRj0mf8MZoTyt3wKYju7mE1a6IyfQyTfKxgCL%2FkRIGDY4THgOd7Ayng6yYlBpklAfIer20Snb%2BXP2pRGpIASstku7UmzDXKm8dKQoxdbyTkh3m5f9UVdgJTgvh4V%2FMPFaZJXQTZSKE71zFw7tXKmvog7Flzw2y9T0xNUsPL12bKZ1J30mSUDza6mQSb8RIiB8EdjqwwcYHWqqkYOjycz6ryydqjsf3%2Bi9Ww9jwwCZmz3lna7dvYy8%2Fx3xT940rQa9RwyDDjseeBFD973Z6ajTXLbhx8wbsXJyHOJnMpGf0V26BojuPlrlhVLCdT2YwDB7a0TxWd0O4hMFJqvgBn8Mp8D%2BnWCRzymHlbYvCZDgQgL8MwWT4Hj4rlzfYqJCji8u4jNQzIZhy6uqQe9eK9tZRCzjtG6piNmouuDKlx11CDFbu4iIZ%DuvIVyxLha%2Bc7LrnV9rqL2obhhFPKWLGdZLYJmkId5JbxBmS6woVHd%2BUgvCUt%2FCQWGjeiN8WP0HjmjDTD%2FxovRBjqZAejmeGz9ad0%2BRtJTPOTTeRWldUEhw8gnel1%2F72qsMwoAVUhOuhnfpxDtaJczmKhuPeWFkkPMJpDmi2H%2BkEYfM%2FfPgmwRIv%2FTx30m%2F%2BIqsr5zFS4KqMz%2FkOyKNaTXIkIuv%2Bz1WUVYvaA2gvgKRtnJUluBOYyPEUXo4yQZqMQNf6rtMqY03AoAN%2BlqNfrYAeQbjZnUExsLZ6RWfQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260605T150422Z&X-Amz-SignedHeaders=host&X-Amz-Expires=14400&X-Amz-Credential=ASIARM3YPOKQ5T63WM3E%2F20260605%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=84eafd387fce678c72e2dd8b19af547596d0244aba76eec203605e1b8174e19b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-102 active:scale-95 transition-all text-xs font-semibold tracking-wider uppercase px-6 shadow-md shadow-blue-500/20"
              >
                Descargar Libro
                <Download className="w-4 h-4 text-white" />
              </a>
            ) : (
              <Button
                onClick={() => router.push('/portal/tienda')}
                className="h-10 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold tracking-wider uppercase px-6 flex items-center gap-2 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-slate-300" />
                <span>Desbloquear Libro ($29.99 USD)</span>
              </Button>
            )}
          </div>
        </div>
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
              <h3 className="text-base font-semibold text-slate-900">
                {isStudent ? "Guía de Entrevista Consular" : "Guía de Entrevista Consular (Turismo)"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isStudent 
                  ? "Recopilación de las preguntas más frecuentes del cónsul y consejos prácticos para responder con seguridad."
                  : "Recopilación de las preguntas frecuentes sobre turismo, fondos económicos e intenciones de retorno."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleDownloadAttempt("Guía de Entrevista")}
            className={`w-full h-11 rounded-full text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
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
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Requiere Plan
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                {isStudent ? "Plantilla de Carta de Intención" : "Plantilla de Lazos de Arraigo"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isStudent
                  ? "Formato sugerido y redactado profesionalmente para demostrar tus lazos con tu país de origen."
                  : "Modelo de redacción y documentos de soporte sugeridos para probar tus vínculos de arraigo."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleDownloadAttempt("Plantilla de Carta")}
            className={`w-full h-11 rounded-full text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
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
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Requiere Plan
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                {isStudent ? "Checklist de Requisitos Consulares" : "Checklist de Requisitos Turísticos"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isStudent
                  ? "Lista de verificación interactiva de documentos indispensables que debes presentar el día de tu cita."
                  : "Lista de verificación interactiva de lazos familiares, financieros y laborales para tu cita."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleDownloadAttempt("Checklist de Requisitos")}
            className={`w-full h-11 rounded-full text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
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
