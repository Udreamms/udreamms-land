"use client";

import { FadeIn } from "./Animations";
import { Ban, TrendingDown, AlertTriangle } from "lucide-react";

export default function AgitationSection() {
    return (
        <div className="w-full bg-slate-100 py-24 my-16 skew-y-1">
            <div className="max-w-7xl mx-auto px-6 skew-y-[-1deg]">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Image */}
                    <FadeIn className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            {/* Placeholder img */}
                            <img
                                src="/assets/brochure-california.jpg"
                                alt="Viaje por las sedes del mundial"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1522158637959-30385a09e0da?q=80&w=1000&auto=format&fit=crop";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent opacity-80" />
                        </div>
                    </FadeIn>

                    {/* Right: The Data and Pain Points */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2 space-y-10">
                        <FadeIn>
                            <h3 className="text-3xl md:text-4xl font-black italic text-slate-900 leading-none mb-6">
                                SIGUE A TU SELECCIÓN<br />
                                <span className="text-red-600">SIN FRONTERAS.</span>
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                Con el Plan Fan Follow, nosotros nos encargamos de moverte entre ciudades y estadios. Tú solo grita gol.
                            </p>
                        </FadeIn>

                        {/* Vertical list of pains */}
                        <div className="space-y-6">
                            <FadeIn delay={0.1}>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500 flex items-start gap-5 hover:translate-x-2 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                        <TrendingDown className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-wide">Movilidad Inter-Sedes</h4>
                                        <p className="text-sm text-slate-600">Rutas de transporte coordinadas entre las ciudades anfitrionas.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-orange-500 flex items-start gap-5 hover:translate-x-2 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                        <Ban className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-wide">Hospedaje Estratégico</h4>
                                        <p className="text-sm text-slate-600">Hoteles seleccionados cerca de los estadios para evitar el tráfico del infierno.</p>
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
