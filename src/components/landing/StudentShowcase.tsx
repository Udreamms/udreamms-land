"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export default function StudentShowcase() {
    const containerRef = useRef(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px" });
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (!videoRef.current) return;
        if (isInView) {
            videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
        } else {
            videoRef.current.pause();
        }
    }, [isInView]);

    return (
        <section className="py-24 lg:py-32 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1500px]">
                <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-24 items-center lg:items-center">
                    
                    {/* Left Column: Text (Visually on Right) */}
                    <div className="w-full lg:w-[35%] flex flex-col pt-2 lg:pt-10 pl-0 lg:pl-8">
                        <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.1]">
                            <span className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl whitespace-nowrap block mb-2">Visa de Estudiante</span>
                            <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">Tu futuro académico empieza aquí</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-[1.7] font-light">
                            Gestionamos todo tu proceso migratorio para que obtengas tu visa F-1: preparación profesional de documentos, seguimiento personalizado y simulaciones de entrevista consular.<br /><br />
                            Acceso a instituciones reconocidas en Estados Unidos con programas de inglés ESL, TOEFL, inglés de negocios y preparación académica. Te ayudamos a elegir el programa ideal que se adapte a tus objetivos.
                        </p>
                    </div>

                    {/* Right Column: Video/Media */}
                    <div ref={containerRef} className="w-full lg:w-2/3 relative h-[400px] lg:h-[650px] bg-[#0a0a0a] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
                        
                        <video
                            ref={videoRef}
                            src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2FVideo%20completo.mov?alt=media&token=f11b4b46-3521-45e7-bbd0-46c18a10bcb8"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-20 opacity-100`}
                            muted={isMuted}
                            loop
                            playsInline
                        />
                        
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMuted(!isMuted);
                            }}
                            className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all z-30"
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
