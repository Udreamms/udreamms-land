"use client";

import { Button } from '@/components/ui/button';
import { sendMetaEvent } from "@/lib/meta-events";

export default function FreeTrainingShowcase() {
    return (
        <section className="pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex flex-col items-center text-center">
                    
                    {/* Premium Capsule Tag */}
                    <div className="w-fit mb-6 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md select-none">
                        FREE ADVANCED TRAINING
                    </div>
                    
                    <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.1]">
                        <span className="text-3xl md:text-4xl lg:text-5xl block mb-2 font-medium">Videos, Libros y Guías</span>
                        <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">Para que triunfes en USA</span>
                    </h2>
                    
                    <p className="text-gray-600 text-base leading-[1.7] font-light max-w-2xl">
                        Accede de forma inmediata a nuestra biblioteca digital de recursos gratuitos de primer nivel. Descarga guías prácticas paso a paso, audiolibros esenciales sobre desarrollo personal y finanzas, y masterclasses completas en video para preparar tu camino hacia el éxito.<br /><br />
                        Una recopilación estratégica de herramientas premium diseñadas para que tomes decisiones inteligentes, minimices riesgos y comiences a estructurar tu futuro en Estados Unidos hoy mismo.
                    </p>
                    
                    <Button 
                        onClick={() => sendMetaEvent('Lead', { source: 'FreeTrainingShowcase: Quiero saber más' })} 
                        className="mt-8 w-64 px-5 py-2.5 bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] border border-[#2d1b4e] text-white rounded-full hover:[transition-property:transform,box-shadow] transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm"
                    >
                        Quiero saber más
                    </Button>
                </div>
            </div>
        </section>
    );
}
