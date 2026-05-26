"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function MentorshipShowcase() {
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
        <section className="py-12 md:py-16 lg:py-20 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1500px]">
                <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-24 items-center lg:items-center">
                    
                    {/* Left Column: Text (Visually on Right on Desktop) */}
                    <div className="w-full lg:w-[35%] flex flex-col pt-2 lg:pt-10 pl-0 lg:pl-8">
                        <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.1]">
                            <span className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl block mb-2 font-medium">Mentorías Premium</span>
                            <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">Acompañamiento por quienes ya lo lograron</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-[1.7] font-light mb-8">
                            Acelera tu integración y triunfa en Estados Unidos con el acompañamiento personalizado de mentores experimentados. Aprende sobre planificación financiera, inserción en el mercado laboral estadounidense, cultura de negocios y desarrollo de carrera directo de profesionales que ya recorrieron el camino y alcanzaron el éxito.<br /><br />
                            Diseñamos sesiones individuales y grupales 1 a 1 adaptadas a tus objetivos específicos para que evites errores comunes, ahorres miles de dólares y multipliques tus oportunidades desde el primer día.
                        </p>
                        <Link href="/contact">
                           <Button className="mt-6 w-fit px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition text-sm">Saber más</Button>
                        </Link>
                    </div>

                    {/* Right Column: Video/Media (Visually on Left on Desktop) */}
                    <div ref={containerRef} className="w-full lg:w-2/3 relative h-[280px] sm:h-[350px] lg:h-[650px] bg-[#0a0a0a] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
                        
                        <video
                            ref={videoRef}
                            src="https://assets.mixkit.co/videos/preview/mixkit-team-of-creative-people-working-in-office-42277-large.mp4"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-20 opacity-100"
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
