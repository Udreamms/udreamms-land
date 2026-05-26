"use client";

import { FadeIn } from "../_components/Animations";
import { FileText, CircleDollarSign, Zap } from "lucide-react";

export default function AgitationSection() {
    return (
        <div className="w-full bg-red-50 py-24 my-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Image with emotional weight */}
                    <FadeIn className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl">
                            <img
                                src="/assets/hero-newyork.jpg"
                                alt="Experiencia Premium en New York"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-abyss/20 via-transparent to-transparent opacity-40" />
                        </div>
                    </FadeIn>

                    {/* Right: The Data and Pain Points */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2 space-y-10">
                        <FadeIn>
                            <h3 className="text-3xl md:text-4xl font-medium text-abyss leading-tight mb-6 tracking-tight">
                                Viaja sin límites con el <br />
                                <span className="text-blue-600">Plan Turista Premium.</span>
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Olvídate de la planificación. Nosotros diseñamos cada día de tu aventura en ciudades icónicas como NY, Miami o LA.
                            </p>
                        </FadeIn>

                        {/* Vertical list of pains */}
                        <div className="space-y-6">
                            <FadeIn delay={0.1}>
                                <div className="bg-white p-6 rounded-3xl shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                                    <div className="bg-gradient-to-r from-purple-800 to-purple-400 text-white rounded-2xl p-2 flex items-center justify-center shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-abyss mb-1 tracking-tight">1. Itinerario Personalizado</h4>
                                        <p className="text-sm text-slate-600">8 días y 7 noches planificados al detalle para ti.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <div className="bg-white p-6 rounded-3xl shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                                    <div className="bg-gradient-to-r from-purple-800 to-purple-400 text-white rounded-2xl p-2 flex items-center justify-center shrink-0">
                                        <CircleDollarSign className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-abyss mb-1 tracking-tight">2. Logística Completa</h4>
                                        <p className="text-sm text-slate-600">Vuelos, traslados y hoteles 4-5 estrellas incluidos.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.3}>
                                <div className="bg-white p-6 rounded-3xl shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                                    <div className="bg-gradient-to-r from-purple-800 to-purple-400 text-white rounded-2xl p-2 flex items-center justify-center shrink-0">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-abyss mb-1 tracking-tight">3. Experiencias Únicas</h4>
                                        <p className="text-sm text-slate-600">Acceso a parques, shows y aventuras exclusivas.</p>
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
