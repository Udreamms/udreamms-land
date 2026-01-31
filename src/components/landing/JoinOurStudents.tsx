"use client";

import { useEffect, useState, useRef } from "react";
import { Play, CheckCircle2, X } from "lucide-react";

const studentVideos = [
  { id: 1, thumb: "/assets/hero-campus.jpg", title: "¡Visa Aprobada!", video: "/assets/chatbot_media/9.mp4" },
  { id: 2, thumb: "/assets/hero-newyork.jpg", title: "Mi llegada a NY", video: "/assets/chatbot_media/8.mp4" },
  { id: 3, thumb: "/assets/hero-living-space.jpg", title: "Mi nueva casa", video: "/assets/chatbot_media/7.mp4" },
  { id: 4, thumb: "/assets/hero-campus.jpg", title: "Primer día de clases", video: "/assets/chatbot_media/6.mp4" },
  { id: 5, thumb: "/assets/hero-newyork.jpg", title: "Tour por la ciudad", video: "/assets/chatbot_media/9.mp4" },
  { id: 6, thumb: "/assets/hero-living-space.jpg", title: "Viviendo en USA", video: "/assets/chatbot_media/8.mp4" }
];

// Triplicamos la data para el efecto infinito
const duplicatedVideos = [...studentVideos, ...studentVideos, ...studentVideos];

export default function JoinOurStudents() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const handleCardClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (activeIndex !== index) {
      setActiveIndex(index);
      setPlayingId(null); // Reset playing state when changing card
    }
  };

  const handlePlayVideo = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setPlayingId(index);
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveIndex(null);
      setPlayingId(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden w-full">
      <div className="w-full">
        <div className="mb-12 text-center px-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-black">
            Únete a nuestros <br />
            <span className="text-gray-400">estudiantes.</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Mira las experiencias reales de quienes ya están cumpliendo su sueño con Udreamms.
          </p>
        </div>

        {/* Carrusel expandido al ancho completo */}
        <div className="relative w-full overflow-visible py-20 px-10">
          <div 
            className={`flex gap-10 animate-scroll-slow ${activeIndex !== null ? 'pause-animation' : ''}`}
            style={{ width: 'fit-content' }}
          >
            {duplicatedVideos.map((video, idx) => {
              const isActive = activeIndex === idx;
              const isPlaying = playingId === idx;
              
              return (
                <div 
                  key={idx} 
                  onClick={(e) => handleCardClick(e, idx)}
                  className={`relative aspect-[9/16] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-gray-100 shrink-0 cursor-pointer transition-all duration-500 ease-out
                    ${isActive ? 'w-[320px] md:w-[420px] z-50 scale-110 ring-4 ring-primary' : 'w-[250px] md:w-[320px] hover:scale-105'}
                  `}
                >
                  {/* Contenido de la tarjeta */}
                  <div className="absolute inset-0 bg-black">
                    {isPlaying ? (
                      <video 
                        src={video.video} 
                        autoPlay 
                        controls 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <img src={video.thumb} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
                        
                        {/* Overlay condicional */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10 flex items-center justify-center">
                          {isActive ? (
                            /* Botón de Play real cuando está resaltada */
                            <div 
                              onClick={(e) => handlePlayVideo(e, idx)}
                              className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-2xl scale-110 animate-pulse hover:scale-125 transition-transform"
                            >
                              <Play className="w-12 h-12 text-white fill-current ml-1" />
                            </div>
                          ) : (
                            /* Icono visual cuando es pequeña */
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                              <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" />
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Botón para cerrar resaltado */}
                    {isActive && (
                      <button 
                        className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-primary transition-colors z-30"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex(null);
                          setPlayingId(null);
                        }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* Texto inferior (se oculta cuando se reproduce para no estorbar) */}
                  <div className={`absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                    <p className="text-white text-lg md:text-xl font-bold mb-2">{video.title}</p>
                    <div className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                       <span className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Estudiante Udreamms</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-320px * 6 - 2rem * 6)); }
        }
        .animate-scroll-slow {
          animation: scroll-slow 60s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused !important;
        }
        .animate-scroll-slow:hover {
          animation-play-state: ${activeIndex !== null ? 'paused' : 'running'};
        }
      `}</style>
    </section>
  );
}
