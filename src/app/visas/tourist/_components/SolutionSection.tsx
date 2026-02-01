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
                    <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                        Tu Vehículo Hacia la Aprobación
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-abyss font-playfair mb-6 leading-tight">
                        No necesitas suerte, <br className="hidden md:block" />
                        <span>necesitas una <span className="text-[#82111f]">estrategia.</span></span>
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Presentamos nuestro mecanismo único: <strong className="text-abyss">El Método SmartVisa 360°</strong>.
                        No solo llenamos papeles, construimos un caso irrefutable.
                    </p>
                </FadeIn>

                {/* Light Blue Container for Cards and Image - Intenser blue, square corners, and extended width/height */}
                <div className="bg-sky-100/50 px-8 md:px-14 py-16 md:py-24 border-y border-sky-200/30 relative mx-[-50px] md:mx-[-75px]">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Left: Content (Cards) */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            {/* Vertical list of solutions (Matching Agitation Style) */}
                            <div className="space-y-6">
                                <FadeIn delay={0.1}>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-abyss mb-1">1. Formulario Blindado</h4>
                                            <p className="text-sm text-slate-600">Representamos tu historia con las palabras clave exactas que los oficiales buscan para aprobar.</p>
                                        </div>
                                    </div>
                                </FadeIn>

                                <FadeIn delay={0.2}>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-abyss mb-1">2. Entrenamiento Consular</h4>
                                            <p className="text-sm text-slate-600">Simulacros 1 a 1 para dominar las preguntas difíciles y proyectar total autoridad.</p>
                                        </div>
                                    </div>
                                </FadeIn>

                                <FadeIn delay={0.3}>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-abyss mb-1">3. Diagnóstico de Certeza</h4>
                                            <p className="text-sm text-slate-600">Análisis predictivo con IA para conocer tu probabilidad real de éxito antes de aplicar.</p>
                                        </div>
                                    </div>
                                </FadeIn>
                            </div>
                        </div>

                        {/* Right: Image (Luxury Success) */}
                        <FadeIn className="w-full lg:w-1/2">
                            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-white">
                                <img
                                    src="/assets/generated/visa_success_family.png"
                                    alt="Familia exitosa celebrando su aprobación de visa"
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
