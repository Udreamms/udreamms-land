"use client";

import { useRef } from "react";
import { Button } from '@/components/ui/button';
import { sendMetaEvent } from "@/lib/meta-events";

export default function FreeTrainingShowcase() {
    const ref = useRef(null);

    return (
        <section className="pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1500px]">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-24 items-center lg:items-center">
                    
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
                <Button onClick={() => sendMetaEvent('Lead', { source: 'FreeTrainingShowcase: Quiero saber más' })} className="mt-6 w-64 px-5 py-2.5 bg-transparent border border-black text-black rounded-full hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm">Quiero saber más</Button>
                    </div>

                    {/* Right Column: Video/Media */}
                    <div ref={ref} className="w-full lg:w-2/3 relative h-[280px] sm:h-[350px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Phantom%2FWhatsApp%20Image%202026-05-25%20at%205.09.26%20PM.jpeg?alt=media&token=b4f0e5c3-5524-4f89-b9a9-35eea571b392"
                            alt="Videos, Libros y Guías"
                            className="w-full h-full object-cover object-center rounded-3xl"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
