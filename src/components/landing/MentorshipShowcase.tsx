"use client";

import { useRef } from "react";
import Link from "next/link";
import { sendMetaEvent } from "@/lib/meta-events";
import { Button } from "@/components/ui/button";
import InlineYouTubeFeature from "@/components/landing/InlineYouTubeFeature";

export default function MentorshipShowcase() {
    const containerRef = useRef(null);

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
                        <Link href="/contact" onClick={() => sendMetaEvent('Lead', { source: 'MentorshipShowcase: Quiero saber más' })}>
                           <Button className="mt-6 w-64 px-5 py-2.5 bg-transparent border border-black text-black rounded-full hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm">Quiero saber más</Button>
                        </Link>
                    </div>

                    {/* Right Column: Video/Media (Visually on Left on Desktop) */}
                    <div ref={containerRef} className="w-full lg:w-2/3 relative h-[280px] sm:h-[350px] lg:h-[650px] bg-[#0a0a0a] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
                        
                        <InlineYouTubeFeature
                            videoId="eIehK9fENJs"
                            startSeconds={17}
                            posterAlt="Mentorías Premium"
                            className="rounded-3xl"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
