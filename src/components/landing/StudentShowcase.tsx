"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

/** ~3.5 MB — apto para web/móvil. El .mov anterior pesaba ~1.8 GB y no cargaba. */
const STUDENT_SHOWCASE_VIDEO =
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2FVisa_Aprobada_Video_Generado.mp4?alt=media&token=5506d972-daaf-4514-8079-2b357abbddec";

const STUDENT_SHOWCASE_POSTER = "/assets/generated/student_showcase_campus.png";

export default function StudentShowcase() {
  const containerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px" });
  const [isMuted, setIsMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (!videoRef.current || videoFailed) return;
    if (isInView) {
      videoRef.current.play().catch(() => {
        /* Autoplay bloqueado en iOS sin interacción — el poster sigue visible */
      });
    } else {
      videoRef.current.pause();
    }
  }, [isInView, videoFailed]);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white text-black overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-[1500px]">
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-24 items-center lg:items-center">
          <div className="w-full lg:w-[35%] flex flex-col pt-2 lg:pt-10 pl-0 lg:pl-8">
            <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.1]">
              <span className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl block mb-2">
                Visa de Estudiante
              </span>
              <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">
                Tu futuro académico empieza aquí
              </span>
            </h2>
            <p className="text-gray-600 text-base leading-[1.7] font-light">
              Gestionamos todo tu proceso migratorio para que obtengas tu visa F-1:
              preparación profesional de documentos, seguimiento personalizado y
              simulaciones de entrevista consular.
              <br />
              <br />
              Acceso a instituciones reconocidas en Estados Unidos con programas de
              inglés ESL, TOEFL, inglés de negocios y preparación académica. Te
              ayudamos a elegir el programa ideal que se adapte a tus objetivos.
            </p>
            <Button
              asChild
              className="mt-6 w-fit px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition text-sm"
            >
              <Link href="/visas/student">Saber más</Link>
            </Button>
          </div>

          <div
            ref={containerRef}
            className="w-full lg:w-2/3 relative h-[280px] sm:h-[350px] lg:h-[650px] bg-[#0a0a0a] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl"
          >
            {!videoFailed ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-20"
                poster={STUDENT_SHOWCASE_POSTER}
                muted={isMuted}
                loop
                playsInline
                preload={isInView ? "auto" : "none"}
                onError={() => setVideoFailed(true)}
              >
                <source src={STUDENT_SHOWCASE_VIDEO} type="video/mp4" />
              </video>
            ) : (
              <img
                src={STUDENT_SHOWCASE_POSTER}
                alt="Estudiantes en campus en USA"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {!videoFailed && (
              <button
                type="button"
                aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = !isMuted;
                  setIsMuted(next);
                  if (videoRef.current) {
                    videoRef.current.muted = next;
                    void videoRef.current.play();
                  }
                }}
                className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all z-30"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
