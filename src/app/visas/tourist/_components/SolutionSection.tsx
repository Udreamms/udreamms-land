"use client";

import { FadeIn } from "./Animations";
import { Shield, Sparkles, Zap } from "lucide-react";

export default function SolutionSection() {
    return (
        <div className="w-full bg-slate-100/10 pt-32 pb-24 my-16 border-y border-slate-100 relative">
            {/* Decorative Elements */}
            <div className="absolute -left-20 top-40 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="absolute -right-20 bottom-40 w-64 h-64 bg-gold/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <FadeIn className="text-center mb-16 -mt-24">
                    <h2 className="text-sm font-medium text-primary tracking-[0.2em] uppercase mb-4">
                        UDREAMMS
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-medium text-abyss font-playfair mb-6 leading-tight tracking-tight">
                        Descubre lo extraordinario con la <br className="hidden md:block" />
                        <span><span className="text-purple-600">Experiencia VIP.</span></span>
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Una travesía de 12 a 15 días recorriendo lo mejor de Estados Unidos con un servicio de clase mundial.
                    </p>
                </FadeIn>

                {/* Light Blue Container for Cards and Image - Intenser blue, square corners, and extended width/height */}
                <div className="bg-purple-50/50 px-8 md:px-14 py-16 md:py-24 border-y border-purple-200/30 relative mx-[-50px] md:mx-[-75px]">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Left: Content (Cards) */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            {/* Vertical list of solutions (Matching Agitation Style) */}
                            <div className="space-y-6">
                                <FadeIn delay={0.1}>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-abyss mb-1 tracking-tight">1. Ruta Multi-Estado</h4>
                                            <p className="text-sm text-slate-600">Explora lo mejor de la costa este y oeste en un solo viaje inolvidable.</p>
                                        </div>
                                    </div>
                                </FadeIn>

                                <FadeIn delay={0.2}>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-abyss mb-1 tracking-tight">2. Hospedaje y Traslados Incluidos</h4>
                                            <p className="text-sm text-slate-600">Hoteles 4-5 estrellas y transporte privado en cada destino.</p>
                                        </div>
                                    </div>
                                </FadeIn>

                                <FadeIn delay={0.3}>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-abyss mb-1 tracking-tight">3. Gestión integral del viaje, todo cubierto</h4>
                                            <p className="text-sm text-slate-600">Asesor de compras y guía exclusivo a tu disposición 24/7.</p>
                                        </div>
                                    </div>
                                </FadeIn>
                            </div>
                        </div>

                        {/* Right: Image (Luxury Success) */}
                        <FadeIn className="w-full lg:w-1/2">
                            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-white">
                                <img
                                    src="/assets/generated/luxury_travel_service.png"
                                    alt="Experiencia VIP en Las Vegas"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
