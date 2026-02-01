"use client";

import { FadeIn } from "./Animations";
import { GraduationCap, ShieldCheck, BrainCircuit } from "lucide-react";

export default function SolutionSection() {
    return (
        <div className="w-full bg-slate-100/10 pt-32 pb-24 my-16 border-y border-slate-100 relative">
            {/* Decorative Elements */}
            <div className="absolute -left-20 top-40 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="absolute -right-20 bottom-40 w-64 h-64 bg-gold/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <FadeIn className="text-center mb-16 -mt-24">
                    <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                        Tu Ecosistema de Aprobación
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-abyss font-playfair mb-6 leading-tight">
                        No dejamos nada al azar. <br className="hidden md:block" />
                        <span>Admisión + <span className="text-[#82111f]">Estrategia Legal.</span></span>
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Integramos admisión académica y preparación consular para blindar tu solicitud desde el día 1.
                    </p>
                </FadeIn>

                {/* Light Blue Container for Cards and Image */}
                <div className="bg-sky-100/50 px-8 md:px-14 py-16 md:py-24 border-y border-sky-200/30 relative mx-[-50px] md:mx-[-75px]">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Left: Content (Cards) */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            {/* Vertical list of solutions */}
                            <div className="space-y-6">
                                <FadeIn delay={0.1}>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-abyss mb-1">1. Admisión Estratégica</h4>
                                            <p className="text-sm text-slate-600">Seleccionamos universidades con historial de aceptación a latinos y becas disponibles.</p>
                                        </div>
                                    </div>
                                </FadeIn>

                                <FadeIn delay={0.2}>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-abyss mb-1">2. Auditoría I-20 Blindada</h4>
                                            <p className="text-sm text-slate-600">Analizamos técnicamente tus documentos financieros antes del consulado.</p>
                                        </div>
                                    </div>
                                </FadeIn>

                                <FadeIn delay={0.3}>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                                            <BrainCircuit className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-abyss mb-1">3. Narrativa de Retorno</h4>
                                            <p className="text-sm text-slate-600">Entrenamiento para demostrar lazos y responder la pregunta trampa: "¿Te quedarás?".</p>
                                        </div>
                                    </div>
                                </FadeIn>
                            </div>
                        </div>

                        {/* Right: Image */}
                        <FadeIn className="w-full lg:w-1/2">
                            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop"
                                    alt="Estudiante feliz graduado"
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
