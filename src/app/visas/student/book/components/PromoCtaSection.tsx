import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export default function PromoCtaSection() {
  return (
    <section className="w-full bg-black py-24 md:py-32 px-4 md:px-8 lg:px-12 font-sans text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="w-full px-4 md:px-16 lg:px-[190px] flex flex-col items-center justify-center relative z-10 font-sans">
        <h2 className="text-2xl md:text-4xl font-extrabold text-white w-full tracking-tight leading-tight font-sans">
          ACCEDE AL INSTANTE A NUESTRO LIBRO DIGITAL: CÓMO OBTENER TU VISA DE ESTUDIANTE PASO A PASO EN 30 DÍAS.
        </h2>

        {/* Book Mockup (IMÁGENES) */}
        <div className="my-10 flex justify-center items-center font-sans">
          <div className="relative group w-56 h-80 rounded-r-lg shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-blue-900 to-indigo-950 p-6 flex flex-col justify-between border-y border-r border-white/20">
            {/* Glossy page edge overlay */}
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-r from-white/10 to-transparent" />

            <div className="flex flex-col items-center text-center space-y-2 font-sans">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 font-sans">GUÍA PASO A PASO</span>
              <h4 className="text-base font-extrabold text-white leading-tight mt-4 font-sans">
                CÓMO OBTENER TU VISA DE ESTUDIANTE F1
              </h4>
              <p className="text-[11px] text-slate-300 font-medium mt-1 font-sans">En 30 Días</p>
            </div>

            <div className="flex flex-col items-center text-center font-sans">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                <Plane className="w-5 h-5 text-blue-400 -rotate-45" />
              </div>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-sans">UDREAMMS</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-blue-400 w-full leading-snug mt-6 font-sans">
          LA METODOLOGÍA QUE USAN LAS AGENCIAS LO ENCONTRARÁS DENTRO DE ESTE LIBRO
        </h3>

        <p className="text-base md:text-lg text-slate-300 w-full leading-relaxed mt-4 font-sans">
          Este es el proceso real que usamos para guiar a nuestros estudiantes desde cero hasta entender todo el proceso de su visa, evitando errores costosos y confusión.
        </p>

        {/* CTA Button */}
        <Link href="#buy-now" className="inline-block mt-8 font-sans">
          <Button
            suppressHydrationWarning
            className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-extrabold text-lg md:text-xl px-10 py-6 rounded-2xl shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all uppercase tracking-wide h-auto font-sans"
          >
            SÍ, QUIERO MI LIBRO AHORA
          </Button>
        </Link>
      </div>
    </section>
  );
}
