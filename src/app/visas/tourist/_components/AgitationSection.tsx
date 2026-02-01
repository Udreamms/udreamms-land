"use client";

import { FadeIn } from "./Animations";
import { FileText, CircleDollarSign, Zap } from "lucide-react";

export default function AgitationSection() {
    return (
        <div className="w-full bg-red-50 py-24 my-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Image with emotional weight */}
                    <FadeIn className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-red-100">
                            <img
                                src="/assets/generated/visa_stress_visual.png"
                                alt="Persona estresada por la complejidad de la visa"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-abyss/20 via-transparent to-transparent opacity-40" />
                        </div>
                    </FadeIn>

                    {/* Right: The Data and Pain Points */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2 space-y-10">
                        <FadeIn>
                            <h3 className="text-3xl md:text-4xl font-bold text-abyss leading-tight mb-6">
                                ¿Sabías que más del <span className="text-red-500">35% de las solicitudes</span> son rechazadas por errores evitables?
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                El verdadero obstáculo no es tu perfil, es no saber cómo presentarlo ante el oficial consular.
                            </p>
                        </FadeIn>

                        {/* Vertical list of pains */}
                        <div className="space-y-6">
                            <FadeIn delay={0.1}>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-abyss shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-abyss mb-1">1. Burocracia Confusa</h4>
                                        <p className="text-sm text-slate-600">El DS-160 tiene más de 100 preguntas técnicas que pueden bloquear tu perfil.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                        <CircleDollarSign className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-abyss mb-1">2. Costo del Error</h4>
                                        <p className="text-sm text-slate-600">La tarifa de <strong className="text-abyss">$185 USD no es reembolsable</strong>. Si fallas, pierdes tu dinero.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.3}>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-abyss mb-1">3. Nervios de Acero</h4>
                                        <p className="text-sm text-slate-600">La entrevista dura menos de 3 minutos. Un titubeo puede ser motivo de rechazo.</p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
