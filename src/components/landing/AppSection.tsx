"use client";

import { AlertTriangle } from "lucide-react";
import Link from 'next/link';

// Datos con descripciones para todos
const servicesData = [
  {
    title: "Cuenta Bancaria",
    desc: "Abre tu cuenta en dólares desde el primer día. Sin comisiones ocultas y con tarjeta de débito internacional.",
    cta: "Abrir cuenta",
    videoUrl: null, // Sin video (Negro + Texto)
  },
  {
    title: "Compra/Renta de Auto",
    desc: "Encuentra el vehículo ideal para tu presupuesto. Opciones de leasing flexibles para estudiantes internacionales.",
    cta: "Ver autos",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Fcoche.mp4?alt=media&token=c0645f1b-3570-4bd9-b52e-739299cfb4ac", // Con Video
  },
  {
    title: "Pase de Autobús",
    desc: "Muévete por la ciudad sin límites. Descuentos exclusivos del 50% en transporte público para miembros Udreamms.",
    cta: "Solicitar pase",
    videoUrl: null, // Sin video
  },
  {
    title: "Scooter",
    desc: "La forma más divertida y rápida de ir al campus. Alquiler por minutos o planes mensuales económicos.",
    cta: "Rentar",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Fscooter.mp4?alt=media&token=400bd256-8057-44f4-ab01-87765207a564", // Con Video
  },
  {
    title: "Plan de Celular",
    desc: "Mantente conectado con datos ilimitados 5G. Planes sin contrato forzoso y llamadas internacionales incluidas.",
    cta: "Ver planes",
    videoUrl: null, // Sin video
  },
  {
    title: "Licencia de Conducir",
    desc: "Guía paso a paso para obtener tu licencia americana. Te ayudamos con el examen teórico y práctico.",
    cta: "Ver guía",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Flicencia.mp4?alt=media&token=f18b3fd9-abbe-4530-ba59-2ed99567b14c", // Con Video
  },
  {
    title: "Seguro Médico",
    desc: "Cobertura completa ante cualquier emergencia. Cumple con todos los requisitos de tu visa F-1.",
    cta: "Cotizar seguro",
    videoUrl: null, // Sin video
  },
  {
    title: "Vuelos Económicos",
    desc: "Alertas de precios bajos para visitar a tu familia. Descuentos especiales en aerolíneas partner.",
    cta: "Buscar vuelos",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Ftrabajo.mp4?alt=media&token=8c361ac9-8767-486e-bcb8-a951598571a5", // Con Video
  }
];

// Duplicamos la data para el efecto de scroll infinito sin cortes
const infiniteData = [...servicesData, ...servicesData];

export default function AppSection() {
  return (
    <section id="app-section" className="bg-black py-32 overflow-hidden relative">
      
      {/* Header */}
      <div className="container px-4 mx-auto mb-16 text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
          Udreamms App
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 font-light">
          Tu compañera perfecta una vez que llegues a Estados Unidos
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-900/50 bg-red-950/20">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-red-400">
            Exclusivo para estudiantes en USA
          </span>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full flex overflow-hidden py-10"> 
        
        {/* Gradients laterales */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        {/* Track Animado */}
        <div className="flex gap-6 animate-scroll hover:pause px-4 items-center">
          {infiniteData.map((service, index) => {
            
            const hasVideo = index % 2 !== 0; 

            return (
              <div 
                key={index}
                className={`
                   relative shrink-0
                   w-[300px] h-[450px]
                   group overflow-hidden rounded-[2rem] border transition-all duration-500
                   ${hasVideo 
                      ? 'border-white/10 bg-black' 
                      : 'border-white/20 bg-[#080808] hover:bg-[#111]'
                   }
                `}
              >
                
                {/* 1. CASO CON VIDEO */}
                {hasVideo && (
                  <>
                    <div className="absolute inset-0 h-full w-full">
                        <video
                          src={service.videoUrl || ""}
                          className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>
                    </div>
                    
                    <div className="relative h-full w-full p-6 flex flex-col justify-between z-10">
                      <h3 className="text-2xl font-black text-white leading-none drop-shadow-xl tracking-tight">
                        {service.title}
                      </h3>
                      <Link
                        href="#"
                        className="inline-flex items-center justify-center bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full px-5 py-2.5 font-bold text-xs hover:bg-white hover:text-black transition-all duration-300 w-fit self-start group-hover:translate-x-1"
                      >
                        {service.cta}
                      </Link>
                    </div>
                  </>
                )}

                {/* 2. CASO SIN VIDEO (SOLO TEXTO) */}
                {!hasVideo && (
                  <div className="relative h-full w-full p-6 flex flex-col justify-between z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-base leading-relaxed font-light">
                        {service.desc}
                      </p>
                    </div>
                    
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center bg-white text-black rounded-full px-6 py-3 font-bold text-xs hover:bg-gray-200 transition-all duration-300 w-full group-hover:-translate-y-1 shadow-lg"
                    >
                      {service.cta}
                    </Link>

                    {/* Decoración sutil */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* Definición de la Animación en CSS (Inline para Next.js App Router) */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        .animate-scroll {
          animation: scroll 60s linear infinite; 
        }
        .hover\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
