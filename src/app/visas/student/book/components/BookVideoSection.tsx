"use client";

import React, { useEffect, useRef } from "react";
import { ShieldCheck, Target, Users, Clock } from "lucide-react";

export default function BookVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hasScrolled = false;

    const handleScroll = () => {
      hasScrolled = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasScrolled) {
            video.play().catch((err) => {
              // Fail silently if browser blocks autoplay
              console.log("Autoplay prevented:", err);
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Triggers when 50% of the video is visible
    );

    observer.observe(video);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.unobserve(video);
    };
  }, []);

  return (
    <section className="w-full bg-[#050507] pb-16 md:pb-24 pt-4 md:pt-6 px-4 md:px-8 lg:px-12 font-sans border-t border-white/5 flex flex-col items-center justify-center -mt-10 md:-mt-16 relative z-30">
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center gap-10">
        {/* Contenedor de Video */}
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950">
          <div className="relative aspect-video w-full bg-black">
            <video
              ref={videoRef}
              src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Book%2FWhatsApp%20Video%202026-07-07%20at%203.28.30%20AM.mp4?alt=media&token=b970a7c7-3be5-4813-b9cf-644a039fbbdf"
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Barra Horizontal de Beneficios */}
        <div className="w-full bg-black border border-white/10 rounded-2xl py-6 px-8 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {/* Item 1 */}
            <div className="flex items-center gap-3 text-left w-full max-w-[240px]">
              <ShieldCheck className="w-8 h-8 text-white shrink-0" />
              <p className="text-white text-xs md:text-sm font-medium leading-tight">
                Información clara y actualizada
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3 text-left w-full max-w-[240px]">
              <Target className="w-8 h-8 text-white shrink-0" />
              <p className="text-white text-xs md:text-sm font-medium leading-tight">
                Estrategias que realmente funcionan
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3 text-left w-full max-w-[240px]">
              <Users className="w-8 h-8 text-white shrink-0" />
              <p className="text-white text-xs md:text-sm font-medium leading-tight">
                Creado por expertos en procesos F1
              </p>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-3 text-left w-full max-w-[240px]">
              <Clock className="w-8 h-8 text-white shrink-0" />
              <p className="text-white text-xs md:text-sm font-medium leading-tight">
                Acceso inmediato desde cualquier lugar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
