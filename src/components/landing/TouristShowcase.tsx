"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

export default function TouristShowcase() {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });

    return (
        <section className="py-16 lg:py-32 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1500px]">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-center lg:items-center">
                    
                    {/* Left Column: Text */}
                    <div className="w-full lg:w-[35%] flex flex-col pt-2 lg:pt-10 pr-0 lg:pr-8">
                        <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.1]">
                            <span className="text-3xl md:text-4xl lg:text-5xl block mb-2">Visa de Turismo</span>
                            <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">Tu puerta de entrada a USA</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-[1.7] font-light">
                            Gestionamos todo tu proceso migratorio para que obtengas tu visa de turista B1/B2: preparación profesional de documentos, seguimiento personalizado y simulaciones de entrevista consular.<br /><br /> Diseñamos tu viaje a Estados Unidos con itinerarios a medida para una experiencia sin contratiempos.
                        </p>
                    </div>

                    {/* Right Column: Video/Media */}
                    <div ref={ref} className="w-full lg:w-2/3 relative h-[400px] lg:h-[650px] bg-[#0a0a0a] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
                        {isInView ? (
                            <iframe
                                src="https://www.youtube.com/embed/ksaKUwErSGw?autoplay=1&mute=1&loop=1&playlist=ksaKUwErSGw"
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <img 
                                src="/assets/generated/tourist_showcase_disney.png" 
                                alt="Visa Turismo" 
                                className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-700" 
                            />
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
