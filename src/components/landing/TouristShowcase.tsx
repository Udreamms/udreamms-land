"use client";

import { useRef } from "react";
import Link from "next/link";
import { sendMetaEvent } from "@/lib/meta-events";
import { Button } from '@/components/ui/button';
import InlineYouTubeFeature from "@/components/landing/InlineYouTubeFeature";

export default function TouristShowcase() {
    const ref = useRef(null);

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1500px]">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-24 items-center lg:items-center">
                    
                    {/* Left Column: Text */}
                    <div className="w-full lg:w-[35%] flex flex-col pt-2 lg:pt-10 pr-0 lg:pr-8">
                        <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.1]">
                            <span className="text-3xl md:text-4xl lg:text-5xl block mb-2">Visa de Turismo</span>
                            <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">Tu puerta de entrada a USA</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-[1.7] font-light">
                            Gestionamos todo tu proceso migratorio para que obtengas tu visa de turista B1/B2: preparación profesional de documentos, seguimiento personalizado y simulaciones de entrevista consular.<br /><br /> Descubre los destinos más icónicos de Estados Unidos y recorre sus mejores ciudades. Te brindamos el respaldo necesario para que viajes con tranquilidad y vivas experiencias turísticas verdaderamente inolvidables.
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <Button asChild className="w-full sm:w-64 px-5 py-2.5 bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] border border-[#2d1b4e] text-white rounded-full hover:[transition-property:transform,box-shadow] transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm">
                                <Link href="/visas/tourist" onClick={() => sendMetaEvent('Lead', { source: 'TouristShowcase: Quiero saber más' })}>Quiero saber más</Link>
                            </Button>
                            <Button asChild className="w-full sm:w-64 px-5 py-2.5 bg-transparent border border-black text-black rounded-full hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm">
                                <a href="https://calendar.app.google/wvmELP7dKEmZKtL37" target="_blank" rel="noopener noreferrer" onClick={() => sendMetaEvent('Lead', { source: 'TouristShowcase: Agendar reunión virtual' })}>Agendar reunión virtual</a>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Video/Media */}
                    <div ref={ref} className="w-full lg:w-2/3 relative h-[280px] sm:h-[350px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl">
                        <InlineYouTubeFeature
                            videoId="ksaKUwErSGw"
                            posterSrc="/assets/generated/tourist_showcase_disney.png"
                            posterAlt="Visa Turismo"
                            className="rounded-3xl"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
