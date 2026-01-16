"use client";

import { useEffect, useState, useRef } from "react";

const cities = [
  { name: "New York", img: "/assets/new york.jpg" },
  { name: "Miami", img: "/assets/miami.jpg" },
  { name: "Las Vegas", img: "/assets/vegas.jpg" },
  { name: "San Francisco", img: "/assets/san francisco.jpg" },
  { name: "San Diego", img: "/assets/san diego.jpg" },
  { name: "Denver", img: "/assets/denver.jpg" },
  { name: "Salt Lake City", img: "/assets/slc.jpg" },
  { name: "California", img: "/assets/california.jpg" },
  { name: "Austin", img: "/assets/austin-texas-skyline-and-landmarks-silhouette-vector.jpg" }
];

export default function CityPartnerships() {
  return (
    <section className="py-20 bg-white w-full overflow-hidden">
      {/* Header expandido al ancho completo */}
      <div className="w-full text-center mb-16 px-4">
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-4 text-black uppercase leading-tight">
          Tú eliges <br />
          <span className="text-gray-400">el destino.</span>
        </h2>
        <p className="text-xl md:text-2xl font-bold text-gray-400 tracking-tight max-w-5xl mx-auto">
          Tenemos convenios activos en cualquier ciudad que elijas.
        </p>
      </div>

      {/* Carrusel de ancho completo sin contenedores tipo tarjeta */}
      <div className="relative w-full overflow-hidden flex items-center py-10">
         <div className="flex gap-16 md:gap-32 items-center animate-scroll-left whitespace-nowrap">
            {[...cities, ...cities, ...cities].map((city, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center shrink-0">
                 {/* Imagen con tamaño uniforme y centrada */}
                 <div className="h-20 md:h-28 w-32 md:w-48 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500">
                    <img 
                      src={city.img} 
                      alt={city.name} 
                      className="max-h-full max-w-full object-contain" 
                    />
                 </div>
                 {/* Nombre de la ciudad organizado */}
                 <span className="mt-6 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-gray-300">
                   {city.name}
                 </span>
              </div>
            ))}
         </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-200px * 9 - 8rem * 9)); } 
        }
        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
        }
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
