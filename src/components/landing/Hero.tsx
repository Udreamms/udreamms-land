"use client";

import { useState, useEffect } from "react";

interface HeroProps {
  onStartQuote: () => void;
}

const videoLinks = [
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F9.mp4?alt=media&token=b4de0daa-1003-4f43-bef6-8eaeb4bc57e0",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F8.mp4?alt=media&token=89677f42-404e-41c9-87ae-1aefad506099",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F7.mp4?alt=media&token=d1f44bb4-e469-48a3-ba0c-52f325e62da3",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F6.mp4?alt=media&token=4323fe1c-71b3-4be7-84bc-05cfc9496bf6",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F5.mp4?alt=media&token=69cab0ea-6587-4642-b19e-900a6279df3b",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F4.mp4?alt=media&token=2d6bdf3c-e66b-4e8e-b13c-4f483cbf3a8b",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F3.mp4?alt=media&token=d69b168f-4c89-4edf-a214-95594eb42553",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F2.mp4?alt=media&token=30cf0664-af66-480f-bf0f-c2688607ab89",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F15.mp4?alt=media&token=d250de08-c183-4434-a6b7-ceb43d7d69ed",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F14.mp4?alt=media&token=d9825363-cad0-4093-8f94-e5a1265ee060",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F12.mp4?alt=media&token=9b03cdbd-1997-4b0b-8657-2081e4163e09",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F11.mp4?alt=media&token=5d571e45-0c77-4ad5-a283-92823cbc2a5b",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F10.mp4?alt=media&token=91d87b50-5e61-4a6a-a3ad-6b62d9da0ef7",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F1.mp4?alt=media&token=e23c109b-04e8-45b6-8f88-36460500dfd4",
];

export default function Hero({ onStartQuote }: HeroProps) {
  const heroImage = "/assets/hero-statue-liberty.jpg";
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * videoLinks.length);
    setVideoSrc(videoLinks[randomNum]);
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
