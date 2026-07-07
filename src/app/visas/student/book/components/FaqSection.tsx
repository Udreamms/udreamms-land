import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FaqSection() {
  return (
    <section className="w-full bg-[#f8fafc] py-24 md:py-32 px-4 md:px-8 lg:px-12 font-sans border-b border-slate-100 flex flex-col items-center">
      <div className="w-full px-4 md:px-16 lg:px-[190px] flex flex-col items-center font-sans">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0f2d59] tracking-tight leading-tight text-center font-sans">
          Preguntas Frecuentes
        </h2>

        <div className="w-full mt-10 space-y-6 font-sans text-left">
          {/* FAQ Item 1 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col font-sans">
            <h3 className="text-lg md:text-xl font-bold text-[#0f2d59] font-sans flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">?</span>
              ¿Qué es el libro digital de Udreamms y para qué sirve?
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-3 pl-9 font-sans">
              Es una guía completa que te enseña cómo obtener una visa de estudiante para Estados Unidos por tu cuenta, sin depender de una agencia. Pero no solo eso: también te muestra cómo moverte dentro del sistema como estudiante, desde acceder a recursos en EE. UU., entender costos de vida, hasta qué hacer si tu estatus cambia o está por vencer. Todo explicado de forma simple, con enlaces oficiales, pasos claros y orientación práctica para que sepas exactamente qué hacer en cada etapa.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col font-sans">
            <h3 className="text-lg md:text-xl font-bold text-[#0f2d59] font-sans flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">?</span>
              ¿Qué hace diferente a este libro?
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-3 pl-9 font-sans">
              No es teoría ni información genérica: es una guía práctica basada en el proceso real para aplicar a una visa de estudiante en Estados Unidos. A diferencia de otros recursos, aquí tienes el paso a paso completo, explicado de forma clara y estructurada, con enlaces oficiales, ejemplos y orientación que te lleva desde cero hasta entender todo el proceso sin confusión. Además, no se queda solo en la visa: también te prepara para la vida como estudiante en EE. UU., incluyendo recursos, costos y decisiones clave que normalmente nadie explica.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col font-sans">
            <h3 className="text-lg md:text-xl font-bold text-[#0f2d59] font-sans flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">?</span>
              ¿Necesito experiencia o ayuda de una agencia para poder aplicar a una visa de estudiante?
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-3 pl-9 font-sans">
              No. No necesitas experiencia previa ni pagar una agencia para iniciar tu proceso. De hecho, el sistema está diseñado para que cualquier persona pueda aplicar siguiendo los pasos correctos, siempre que tenga la información adecuada. Este libro te da exactamente eso: claridad, estructura y los recursos oficiales necesarios para que entiendas qué hacer, cómo hacerlo y en qué orden, sin depender de terceros ni pagar asesorías costosas.
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col font-sans">
            <h3 className="text-lg md:text-xl font-bold text-[#0f2d59] font-sans flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">?</span>
              ¿Este libro aumenta mis posibilidades de obtener la visa?
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-3 pl-9 font-sans">
              Te ayuda a entender todo el proceso y evitar errores comunes que suelen hacer que muchas solicitudes se compliquen o se retrasen. La aprobación final siempre depende del consulado, pero tener claridad y seguir el proceso correcto marca una gran diferencia en cómo presentas tu solicitud.
            </p>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="flex justify-center mt-12 font-sans">
          <Link href="#buy-now" className="inline-block font-sans">
            <Button
              suppressHydrationWarning
              className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-extrabold text-lg md:text-xl px-10 py-6 rounded-2xl shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all uppercase tracking-wide h-auto font-sans"
            >
              QUIERO MI LIBRO AHORA
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
