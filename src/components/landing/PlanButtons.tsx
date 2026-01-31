"use client";

import Link from "next/link";

export default function PlanButtons() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center bg-black py-20 rounded-[4rem] px-6">
           <h4 className="text-3xl md:text-5xl font-black text-white mb-12 tracking-tight">
             ¿Listo para comenzar tu proceso?
           </h4>
           <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              {/* VISA DE TURISMO - Ahora a la izquierda */}
              <Link href="/visas/tourist" className="w-full md:w-auto">
                <button className="w-full md:w-72 py-5 px-8 bg-white text-black font-black text-lg rounded-full hover:bg-gray-200 transition-all transform hover:scale-105">
                  VISA DE TURISMO
                </button>
              </Link>

              {/* VISA DE ESTUDIANTE - Ahora en el CENTRO y color NEGRO */}
              <Link href="/visas/student" className="w-full md:w-auto">
                <button className="w-full md:w-72 py-5 px-8 bg-black text-white border-2 border-white font-black text-lg rounded-full hover:bg-white hover:text-black transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  VISA DE ESTUDIANTE
                </button>
              </Link>

              {/* FIFA FAN PASS - Ahora a la derecha con etiqueta */}
              <Link href="/visas/fifa" className="w-full md:w-auto relative group">
                {/* Etiqueta de tiempo limitado */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest animate-pulse z-10 shadow-lg">
                  Tiempo Limitado
                </div>
                <button className="w-full md:w-72 py-5 px-8 bg-[#D31245] text-white font-black text-lg rounded-full hover:bg-white hover:text-[#D31245] transition-all transform hover:scale-105">
                  FIFA FAN PASS
                </button>
              </Link>
           </div>
           <p className="mt-12 text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">
              Tu futuro en Estados Unidos comienza hoy
           </p>
        </div>
      </div>
    </section>
  );
}
