"use client";

import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMetaEvent } from "@/lib/meta-events";

export default function UdreammsAppShowcase() {
    return (
        <section className="py-16 md:py-24 lg:py-28 bg-black text-white overflow-hidden">
            <div className="container px-6 md:px-12 mx-auto">
                <div className="flex flex-col items-center text-center group">
                    <p className="text-white font-medium mb-6 tracking-tight uppercase text-sm md:text-base">
                        Esta aplicación solo está disponible para estudiantes en USA
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-8">
                        <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white leading-none">
                            Descarga
                        </h2>
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden shrink-0">
                            <img
                                src="/icons/new-icon-udreamms.png"
                                alt="Udreamms App Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white leading-none">
                            Udreamms
                        </h2>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-10 leading-none">
                        para comenzar
                    </h2>

                    <p className="text-lg md:text-xl text-white/60 font-medium mb-12 max-w-2xl tracking-tight">
                        Utilizada por cientos de estudiantes en Estados Unidos
                    </p>

                    <div className="relative">
                        <Button onClick={() => sendMetaEvent('Lead', { source: 'UdreammsAppShowcase: Descargar' })} className="rounded-full bg-white text-black hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white font-medium px-12 py-8 text-xl shadow-2xl transition-all border-none flex items-center gap-3">
                            <Smartphone className="w-6 h-6" />
                            Descargar Udreamms App
                        </Button>
                        <span className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg border border-white/20 select-none animate-pulse">
                            Próximamente
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
