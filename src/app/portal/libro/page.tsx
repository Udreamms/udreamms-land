'use client';

import React from "react";
import { Download } from "lucide-react";
import { usePortal } from "../PortalContext";
import LockOverlay from "../components/LockOverlay";

export default function LibroPage() {
  const { activeTopSection, isUnlocked } = usePortal();

  const isStudent = activeTopSection === 'visa-estudiante';
  const unlocked = isUnlocked('libro', isStudent ? 'estudiante' : 'turista');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight">Mi Libro Digital</h2>
        <p className="text-sm text-white/50">Tu guía definitiva hacia Estados Unidos en formato ebook.</p>
      </div>

      <div className="relative min-h-[450px]">
        {!unlocked && (
          <LockOverlay itemId={isStudent ? 'libro-estudiante' : 'libro-turista'} />
        )}

        <div className={`bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 w-full font-sans ${!unlocked ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
          {/* Book Mockup cover */}
          <div className="w-48 h-64 shrink-0 rounded-2xl bg-gradient-to-tr from-[#1b1030] to-[#5b238d] border border-purple-500/30 flex flex-col justify-between p-4 shadow-[0_15px_35px_rgba(168,85,247,0.2)] hover:scale-105 transition-transform duration-300 relative group overflow-hidden">
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            <span className="text-[10px] font-normal tracking-widest text-purple-300 uppercase">uDreamms Ebook</span>
            <div className="space-y-1 z-10">
              <h4 className="text-md font-normal leading-tight text-white">
                {isStudent ? "OBTÉN TU" : "TU VIAJE EN"}
              </h4>
              <h4 className={`${isStudent ? "text-lg md:text-xl font-bold tracking-tight" : "text-2xl font-normal tracking-tighter"} text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white uppercase`}>
                {isStudent ? "VISA DE ESTUDIANTE" : "USA"}
              </h4>
              <p className="text-[9px] text-white/50 pt-1">
                {isStudent 
                  ? "en 30 días" 
                  : "Guía de aprobación de Visa de Turista"}
              </p>
            </div>
            <span className="text-[8px] tracking-[0.2em] uppercase text-white/40 z-10 font-normal">Edición 2026</span>
          </div>

          {/* Book details */}
          <div className="space-y-6 text-center md:text-left flex-1">
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-normal">
                {isStudent 
                  ? "Obtén tu Visa de Estudiante en 30 Días" 
                  : "Turista en USA: Guía para una Aprobación Consular Exitosa"}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
                {isStudent
                  ? "Descubre cómo obtener tu visa de estudiante para Estados Unidos con el libro digital Udreamms.\n\nEsta guía completa y actualizada te enseña a gestionar de forma autónoma y exitosa todo el proceso para obtener tu visa F1. Aprenderás paso a paso cómo preparar correctamente tu documentación oficial, llenar los formularios oficiales y presentarte a la entrevista en la embajada con total confianza.\n\nCon consejos prácticos basados en nuestra experiencia como agentes oficiales de escuelas en EE.UU. y enlaces oficiales actualizados, evitarás errores comunes que suelen retrasar o invalidar las solicitudes, ahorrando tiempo y dinero. Este libro está diseñado especialmente para personas de Latinoamérica que desean información clara, confiable y práctica para tomar el control de su trámite y cumplir su sueño de estudiar en Estados Unidos."
                  : "Este libro digital contiene los secretos prácticos de Udreamms para responder con precisión sobre tus planes turísticos, justificar fondos y garantizar tu retorno."}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href="https://hotmart.s3.amazonaws.com/product_contents/983dc68d-226b-49b9-b21d-8690a0e1781c/Libro%20Oficial%20Udreamms%202025.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIAlyHIes8td8SftGgCGD7a%2Fg6F7O75p935aSUeOFQqosAiEAtudMlgXKWth5wfHOvHfm%2BR0SXymggImEyeFI5AL9pNMqigUIcBADGgwwOTYzNTI1NjM4NzMiDDw9pm%2FUI%2B7JksJKGSrnBNxgSzENiekiJ%2Fzaoynv%2BfOsXHClS%2Fs4U7FeMwIcYd%2FQe%2BRRZ3u6JW%2BG6W%2BPAxFjEOJYDg3LF3P%2FfVdnq9OrJBlJt7eHi6z1MKbujl0ueuyg4%2FYL5xlCrDxeEBnqLlnBCSsTbOLjqzpIqP5FAePZqq5Oh7vcMxQHFqb4BE2dgnvAXw9p8J4dczy5bIqNGKIbpB1i%2FgTEf7FZ95woBgVx%2BvcGCiuS6aaE5iqYB9jNuql%2B%2Fa6nXowLL0Gl%2Fy2IMjhJcMS9iCrVr6Ayq%2FhJondfRBOFU1ieG3t8aqIkB%2FBjMggn%2B1ZpmzNuRj0mf8MZoTyt3wKYju7mE1a6IyfQyTfKxgCL%2FkRIGDY4THgOd7Ayng6yYlBpklAfIer20Snb%2BXP2pRGpIASstku7UmzDXKm8dKQoxdbyTkh3m5f9UVdgJTgvh4V%2FMPFaZJXQTZSKE71zFw7tXKmvog7Flzw2y9T0xNUsPL12bKZ1J30mSUDza6mQSb8RIiB8EdjqwwcYHWqqkYOjycz6ryydqjsf3%2Bi9Ww9jwwCZmz3lna7dvYy8%2Fx3xT940rQa9RwyDDjseeBFD973Z6ajTXLbhx8wbsXJyHOJnMpGf0V26BojuPlrlhVLCdT2YwDB7a0TxWd0O4hMFJqvgBn8Mp8D%2BnWCRzymHlbYvCZDgQgL8MwWT4Hj4rlzfYqJCji8u4jNQzIZhy6uqQe9eK9tZRCzjtG6piNmouuDKlx11CDFbu4iIZ%2FDuvIVyxLha%2Bc7LrnV9rqL2obhhFPKWLGdZLYJmkId5JbxBmS6woVHd%2BUgvCUt%2FCQWGjeiN8WP0HjmjDTD%2FxovRBjqZAejmeGz9ad0%2BRtJTPOTTeRWldUEhw8gnel1%2F72qsMwoAVUhOuhnfpxDtaJczmKhuPeWFkkPMJpDmi2H%2BkEYfM%2FfPgmwRIv%2FTx30m%2F%2BIqsr5zFS4KqMz%2FkOyKNaTXIkIuv%2Bz1WUVYvaA2gvgKRtnJUluBOYyPEUXo4yQZqMQNf6rtMqY03AoAN%2BlqNfrYAeQbjZnUExsLZ6RWfQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260605T150422Z&X-Amz-SignedHeaders=host&X-Amz-Expires=14400&X-Amz-Credential=ASIARM3YPOKQ5T63WM3E%2F20260605%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=84eafd387fce678c72e2dd8b19af547596d0244aba76eec203605e1b8174e19b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase px-8"
              >
                Descargar Libro
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
