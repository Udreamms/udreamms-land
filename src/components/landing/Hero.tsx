"use client";

import { useState, useEffect } from "react";

interface HeroProps {
  onStartQuote: () => void;
}

export default function Hero({ onStartQuote }: HeroProps) {
  const heroImage = "/assets/hero-statue-liberty.jpg";
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 15) + 1;
    setVideoSrc(`/assets/${randomNum}.mp4`);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-end overflow-hidden -mt-24 pt-32 pb-16">
      {/* Background Container */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {videoSrc && (
          <video
            key={videoSrc}
            className="absolute top-0 left-0 w-full h-full object-cover fade-in"
            autoPlay
            loop
            muted
            playsInline
            poster={heroImage}
          >
            <source src={videoSrc} type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        )}
        
        {/* Overlay degradado desde abajo para que se lean bien textos y botones */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>
      
      {/* Contenedor ancho completo alineado con el Header */}
      <div className="relative z-10 w-full px-6 md:px-12">
        
        {/* Flex container para separar Texto (Izquierda) y Botones (Derecha) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          
          {/* --- IZQUIERDA: Textos --- */}
          <div className="max-w-4xl text-left"> 
            
            {/* Título en 2 líneas */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white drop-shadow-2xl tracking-tight mb-4">
              ¿Listo para <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400">cambiar tu futuro?</span>
            </h1>
            
            {/* Subtítulo en una sola línea + Tagline mejorado */}
            <div className="text-lg md:text-xl text-gray-200 font-light drop-shadow-lg">
              <p className="inline md:block">
                Simplificamos el proceso de estudiar y vivir en Estados Unidos.
              </p>
              {/* Tagline mejorado con separadores */}
              <p className="mt-2 text-white font-medium flex items-center gap-3">
                Fácil <span className="text-primary">•</span> Seguro <span className="text-primary">•</span> Accesible
              </p>
            </div>
          </div>

          {/* --- DERECHA: Botones (Esquina inferior derecha) --- */}
          <div className="flex flex-wrap gap-4 shrink-0">
            <button
              onClick={onStartQuote}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white overflow-hidden rounded-full bg-primary shadow-lg hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              Obtén tu Cotización
            </button>
            
            <button
              onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white rounded-full border border-white/40 hover:bg-white hover:text-black hover:border-white hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              Ver Roadmap
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
