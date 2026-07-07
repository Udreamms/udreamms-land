import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export default function PromoCtaSection() {
  return (
    <section className="w-full bg-black py-24 md:py-32 px-4 md:px-8 lg:px-12 font-sans text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center relative z-10 font-sans">
        
        {/* Contenedor principal alineado al libro con overlays internos */}
        <div className="relative w-full max-w-[600px] md:max-w-[1100px] aspect-[3/4] transition-all duration-500 hover:scale-[1.01] flex items-center justify-center font-sans overflow-hidden">
          
          {/* Portada del libro en 3D */}
          <img
            src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Book%2FMuckup%20(1).png?alt=media&token=90d03452-cb19-47fc-9e75-1d84cf6ba50c"
            alt="Libro Digital Udreamms - Paso a paso para tu visa"
            className="w-full h-full object-contain z-0"
          />

          {/* Borde Superior Interno: Título */}
          <div className="absolute top-6 md:top-10 lg:top-14 inset-x-0 px-8 md:px-16 text-center z-10 select-none">
            <h2 className="text-sm sm:text-xl md:text-3xl lg:text-4xl font-medium tracking-tighter leading-[1.08] bg-gradient-to-r from-[#c084fc] to-[#f472b6] bg-clip-text text-transparent drop-shadow-lg">
              ACCEDE AL INSTANTE A NUESTRO LIBRO DIGITAL: CÓMO OBTENER TU VISA DE ESTUDIANTE PASO A PASO EN 30 DÍAS.
            </h2>
          </div>

          {/* Borde Inferior Interno: Metodología y descripción */}
          <div className="absolute bottom-6 md:bottom-10 lg:bottom-14 inset-x-0 px-8 md:px-16 text-center z-10 select-none">
            <h3 className="text-xs sm:text-base md:text-xl lg:text-2xl font-medium tracking-tight leading-snug bg-gradient-to-r from-[#c084fc] to-[#f472b6] bg-clip-text text-transparent drop-shadow-lg">
              LA METODOLOGÍA QUE USAN LAS AGENCIAS LO ENCONTRARÁS DENTRO DE ESTE LIBRO
            </h3>
            <p className="text-[10px] sm:text-xs md:text-base lg:text-lg font-medium text-slate-300 tracking-tight leading-relaxed mt-2 md:mt-3 lg:mt-4 max-w-3xl mx-auto drop-shadow-md">
              Este es el proceso real que usamos para guiar a nuestros estudiantes desde cero hasta entender todo el proceso de su visa, evitando errores costosos y confusión.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
