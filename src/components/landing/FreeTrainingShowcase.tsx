"use client";

import { useRef } from "react";
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { useInView } from "framer-motion";

export default function FreeTrainingShowcase() {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });

    return (
        <section className="py-16 lg:py-32 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1500px]">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-center lg:items-center">
                    
                    {/* Left Column: Text */}
                    <div className="w-full lg:w-[35%] flex flex-col pt-2 lg:pt-10 pr-0 lg:pr-8">
                        {/* Premium Capsule Tag */}
                        <div className="w-fit mb-6 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md select-none">
                            FREE ADVANCED TRAINING
                        </div>
                        
                        <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.1]">
                            <span className="text-3xl md:text-4xl lg:text-5xl block mb-2 font-medium">Videos, Libros y Guías</span>
                            <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">Para que triunfes en USA</span>
                        </h2>
                        
                        <p className="text-gray-600 text-base leading-[1.7] font-light">
                            Accede de forma inmediata a nuestra biblioteca digital de recursos gratuitos de primer nivel. Descarga guías prácticas paso a paso, audiolibros esenciales sobre desarrollo personal y finanzas, y masterclasses completas en video para preparar tu camino hacia el éxito.<br /><br />
                            Una recopilación estratégica de herramientas premium diseñadas para que tomes decisiones inteligentes, minimices riesgos y comiences a estructurar tu futuro en Estados Unidos hoy mismo.
                        </p>
                <Button className="mt-4 w-fit px-4 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition text-sm">Saber más</Button>
                    </div>

                    {/* Right Column: Video/Media */}
                    <div ref={ref} className="w-full lg:w-2/3 relative h-[400px] lg:h-[650px] bg-[#0a0a0a] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
                        {isInView ? (
                            <iframe
                                src="https://www.youtube.com/embed/wIh31q-3dPM?autoplay=1&mute=1&loop=1&playlist=wIh31q-3dPM"
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gray-950 flex items-center justify-center">
                                <div className="text-white text-sm opacity-45 font-medium tracking-wide">Cargando material premium...</div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
