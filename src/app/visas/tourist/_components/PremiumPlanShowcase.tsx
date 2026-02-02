"use client";

import { motion } from "framer-motion";
import { Plane, Hotel, Calendar, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PremiumPlanShowcase() {
    const features = [
        {
            title: "Vuelos y Traslados Internos",
            description: "Gestionamos tus boletos y logística de transporte en USA.",
            icon: Plane,
            color: "bg-blue-50 text-blue-600",
        },
        {
            title: "Hospedaje 4–5 Estrellas",
            description: "Seleccionamos los mejores hoteles para que tu familia descanse al máximo.",
            icon: Hotel,
            color: "bg-orange-50 text-orange-600",
        },
        {
            title: "Itinerario de 8 Días / 7 Noches",
            description: "Totalmente planificado para que no te preocupes por nada.",
            icon: Calendar,
            color: "bg-purple-50 text-purple-600",
        },
        {
            title: "Actividades y Tickets Incluidos",
            description: "Entradas a actividades turísticas del destino que elijas.",
            icon: Sparkles,
            color: "bg-green-50 text-green-600",
        },
    ];

    return (
        <section className="py-24 bg-white overflow-hidden" id="plan-premium">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Content side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-10"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium text-xs uppercase tracking-widest">
                                <Sparkles size={14} />
                                La Opción Completa
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium text-slate-900 leading-[0.9] tracking-tighter">
                                Vacaciones de <br /> Ensueño: <span className="text-blue-500">Plan Premium.</span>
                            </h2>
                            <div className="space-y-4">
                                <p className="text-xl text-slate-700 font-medium leading-relaxed max-w-xl">
                                    Elige tu destino: <span className="text-blue-500">Florida, New York, California, Utah, Nevada o Hawaii.</span>
                                </p>
                                <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                                    ¿Por qué estresarte planeando? Nosotros nos encargamos de todo: desde la visa hasta el último detalle de tu aventura familiar.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-slate-100 transition-all hover:shadow-lg group">
                                        <div className={`p-4 rounded-2xl ${feature.color} group-hover:rotate-12 transition-transform shadow-sm`}>
                                            <Icon size={28} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-medium text-slate-900 mb-1">{feature.title}</h4>
                                            <p className="text-slate-600 font-medium leading-snug">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg md:text-xl px-10 py-7 rounded-full shadow-xl transition-all hover:scale-105 font-medium uppercase tracking-tight"
                                onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Elegir Plan Premium
                            </Button>
                            <Button
                                size="lg"
                                className="w-full sm:w-auto border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-lg md:text-xl px-10 py-7 rounded-full shadow-lg transition-all hover:scale-105 font-medium uppercase tracking-tight"
                                onClick={() => window.open('https://wa.me/yournumber', '_blank')}
                            >
                                Quiero saber más
                            </Button>
                        </div>

                        <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-blue-500" />
                            Todo incluido: viaja sin preocupaciones
                        </p>
                    </motion.div>

                    {/* Visual side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)] aspect-[4/5] md:aspect-auto">
                            <img
                                src="/assets/generated/tourist_premium_showcase.png"
                                alt="Familia feliz en Disney con el Plan Premium"
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[3s]"
                            />
                        </div>
                        {/* Background Accent */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-400/10 rounded-full blur-[120px] -z-10" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
