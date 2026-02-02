"use client";

import { FadeIn } from "./Animations";
import { Star, Zap, Plane } from "lucide-react";

export default function SocialProofSection() {
    return (
        <section className="bg-black text-white border-t border-zinc-800 relative overflow-hidden">
            {/* Background noise */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

            {/* Stats Bar */}
            <div className="border-b border-zinc-800 py-12 relative z-10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <FadeIn className="flex flex-wrap justify-center gap-12 md:gap-24 text-center">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-4xl md:text-5xl font-medium tracking-tight text-yellow-500 italic">
                                <Zap className="w-8 h-8 fill-current" /> 14 Días
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-medium">Récord Cita Conseguida</div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-4xl md:text-5xl font-medium tracking-tight text-green-500 italic">
                                <Plane className="w-8 h-8 fill-current" /> 100%
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-medium">Asistencia a Partido Inaugural</div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-24 container mx-auto px-6 max-w-6xl relative z-10">
                <FadeIn className="text-center mb-16">
                    <span className="text-green-500 font-medium tracking-widest uppercase text-sm mb-4 block">Resultados Comprobados</span>
                    <h2 className="text-3xl md:text-5xl font-medium tracking-tight italic mb-6 text-white">"PENSÉ QUE NO LLEGABA..."</h2>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Review 1 */}
                    <FadeIn delay={0.1} className="bg-zinc-900/80 border border-white/10 p-8 rounded-2xl relative backdrop-blur-sm">
                        <div className="absolute top-6 right-6 text-yellow-500 flex"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-medium text-lg">AR</div>
                            <div>
                                <div className="font-medium">Alejandro R.</div>
                                <div className="text-xs text-gray-400">Fanático de Argentina</div>
                            </div>
                        </div>
                        <p className="text-gray-300 italic text-sm">
                            "Tenía boletos para la final pero cita para 2027. El Radar consiguió un hueco en 3 semanas. ¡Increíble!"
                        </p>
                    </FadeIn>

                    {/* Review 2 (Highlighted) */}
                    <FadeIn delay={0.2} className="bg-zinc-800 border border-yellow-500/50 p-8 rounded-2xl relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-medium italic px-3 py-1 rounded-bl-xl uppercase">Caso Qatar</div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center font-medium text-lg">MC</div>
                            <div>
                                <div className="font-medium">María C.</div>
                                <div className="text-xs text-gray-400">Fanática de México</div>
                            </div>
                        </div>
                        <p className="text-gray-300 italic text-sm">
                            "Me salvaron de un error en frontera que me hubiera deportado. La guía logística vale oro. Nos vemos en el Azteca."
                        </p>
                    </FadeIn>

                    {/* Review 3 */}
                    <FadeIn delay={0.3} className="bg-zinc-900/80 border border-white/10 p-8 rounded-2xl relative backdrop-blur-sm">
                        <div className="absolute top-6 right-6 text-yellow-500 flex"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-medium text-lg">JL</div>
                            <div>
                                <div className="font-medium">Jorge L.</div>
                                <div className="text-xs text-gray-400">Fanático de España</div>
                            </div>
                        </div>
                        <p className="text-gray-300 italic text-sm">
                            "Estaba por perder $4k en vuelos. Revisaron mi DS-160 y me prepararon. Aprobado a la primera."
                        </p>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
