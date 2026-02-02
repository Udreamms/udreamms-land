"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Users, Video, Plane, Hotel, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        id: "vuelos",
        title: "Vuelos y Traslados Internos",
        description: "Gestionamos tus boletos y logística de transporte en USA.",
        icon: Plane,
        image: "/assets/generated/tourist_premium_showcase.png"
    },
    {
        id: "hospedaje",
        title: "Hospedaje 4–5 Estrellas",
        description: "Seleccionamos los mejores hoteles para que tu familia descanse al máximo.",
        icon: Hotel,
        image: "/assets/generated/tourist_premium_showcase.png"
    },
    {
        id: "itinerario",
        title: "Itinerario de 8 Días / 7 Noches",
        description: "Totalmente planificado para que no te preocupes por nada.",
        icon: Calendar,
        image: "/assets/generated/tourist_premium_showcase.png"
    },
    {
        id: "tickets",
        title: "Actividades y Tickets Incluidos",
        description: "Entradas a actividades turísticas del destino que elijas.",
        icon: Sparkles,
        image: "/assets/generated/tourist_premium_showcase.png"
    },
];

export default function PremiumPlanShowcase() {
    const [activeTab, setActiveTab] = useState(features[0]);

    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="plan-premium">
            <div className="container mx-auto px-6">

                {/* Header: Title + Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium text-xs uppercase tracking-widest mb-4">
                            La Opción Completa
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1.1]">
                            Vacaciones de Ensueño<br />
                            <span className="text-black">Plan Premium</span>
                        </h2>
                        <div className="mt-6 space-y-4 max-w-xl">
                            <p className="text-xl text-black font-normal leading-relaxed">
                                Elige tu destino: Florida, New York, California, Utah, Nevada o Hawaii.
                            </p>
                            <p className="text-lg text-black/70 font-normal leading-relaxed">
                                ¿Por qué estresarte planeando? Nosotros nos encargamos de todo: desde la visa hasta el último detalle de tu aventura familiar.
                            </p>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="rounded-full px-10 py-7 bg-black hover:bg-black/90 text-white font-medium text-lg shadow-xl transition-all"
                        onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Elegir Plan Premium
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Column: Interactive List */}
                    <div className="w-full lg:w-1/3 flex flex-col">
                        {features.map((feature) => {
                            const isActive = activeTab.id === feature.id;
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.id}
                                    className="group cursor-pointer"
                                    onClick={() => setActiveTab(feature)}
                                >
                                    <div className="py-6 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className={`p-2 rounded-lg transition-colors duration-300 bg-white ${isActive ? "text-black" : "text-black group-hover:bg-gray-50"}`}>
                                                <Icon size={20} strokeWidth={2.5} />
                                            </div>
                                            <h4 className={`text-xl transition-colors duration-300 ${isActive ? 'font-medium text-black' : 'font-medium text-black group-hover:text-black'}`}>
                                                {feature.title}
                                            </h4>
                                        </div>

                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                    className="overflow-hidden pl-[3.25rem]"
                                                >
                                                    <p className="pt-2 text-black leading-relaxed font-normal text-lg">
                                                        {feature.description}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Dynamic Visual */}
                    <div className="w-full lg:w-2/3 h-full min-h-[500px] relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="w-full h-full relative aspect-[4/3] lg:aspect-video rounded-[2.5rem] overflow-hidden bg-white shadow-2xl"
                            >
                                <img
                                    src={activeTab.image}
                                    alt={activeTab.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>

                {/* Footer Quote */}
                <div className="mt-20 flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-gray-200" />
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Todo incluido: viaja sin preocupaciones
                    </p>
                    <div className="h-px w-12 bg-gray-200" />
                </div>
            </div>
        </section>
    );
}
