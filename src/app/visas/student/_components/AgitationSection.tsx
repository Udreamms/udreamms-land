"use client";

import { FadeIn } from "./Animations";
import { TrendingUp, FileWarning, XCircle } from "lucide-react";

export default function AgitationSection() {
    return (
        <div className="w-full bg-red-50 py-24 my-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Image with emotional weight */}
                    <FadeIn className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-red-100">
                            {/* Placeholder img */}
                            <img
                                src="/assets/generated/student_stress_rejection.png"
                                alt="Estudiante rechazado"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-abyss/20 via-transparent to-transparent opacity-40" />
                        </div>
                    </FadeIn>

                    {/* Right: The Data and Pain Points */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2 space-y-10">
                        <FadeIn>
                            <h3 className="text-3xl md:text-4xl font-medium text-abyss leading-tight mb-6 tracking-tight">
                                Causas Reales de <span className="text-red-500">Rechazo de Visa F-1</span>
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Tener una carta de aceptación de Harvard no te garantiza la visa si fallas en lo básico.
                            </p>
                        </FadeIn>

                        {/* Vertical list of pains */}
                        <div className="space-y-6">
                            <FadeIn delay={0.1}>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-abyss shrink-0">
                                        <TrendingUp className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-abyss mb-1 tracking-tight">Inconsistencias Financieras (35%)</h4>
                                        <p className="text-sm text-slate-600">Si tu I-20 dice una cosa y tus estados de cuenta otra, es rechazo automático.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                        <FileWarning className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-abyss mb-1 tracking-tight">Mal desempeño en entrevista (25%)</h4>
                                        <p className="text-sm text-slate-600">No saber explicar por qué elegiste esa universidad o cómo pagarás tus estudios.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.3}>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-start gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                        <XCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-abyss mb-1 tracking-tight">Falta de lazos demostrables (15%)</h4>
                                        <p className="text-sm text-slate-600">Parecer una amenaza migratoria que se quedará a trabajar ilegalmente.</p>
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
