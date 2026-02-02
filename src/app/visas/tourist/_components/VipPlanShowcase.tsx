"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Hotel, Calendar, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        id: "vuelos",
        title: "Vuelos y Traslados Internos",
        description: "Logística aérea y terrestre incluida en todas tus rutas.",
        icon: Plane,
        image: "/assets/generated/tourist_vip_showcase.png"
    },
    {
        id: "hospedaje",
        title: "Hospedaje 4–5 Estrellas",
        description: "Garantizamos el máximo confort en los mejores hoteles de cada ciudad.",
        icon: Hotel,
        image: "/assets/generated/tourist_vip_showcase.png"
    },
    {
        id: "itinerario",
        title: "Itinerario 15 Días - 14 Noches",
        description: "Una inmersión total diseñada cronológicamente para tu deleite.",
        icon: Calendar,
        image: "/assets/generated/tourist_vip_showcase.png"
    },
    {
        id: "tickets",
        title: "Actividades y Tickets Incluidos",
        description: "Acceso total a las experiencias más exclusivas de tu ruta.",
        icon: Sparkles,
        image: "/assets/generated/tourist_vip_showcase.png"
    },
];

export default function VipPlanShowcase() {
    const [activeTab, setActiveTab] = useState(features[0]);

    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="plan-vip">
            <div className="container mx-auto px-6">

                {/* Header: Title + Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium text-xs uppercase tracking-widest mb-4">
                            La Élite del Viajero
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1.1]">
                            Libertad Sin Límites<br />
                            <span className="text-black">VIP EXPERIENCE</span>
                        </h2>
                        <div className="mt-8 space-y-6 max-w-xl">
                            <p className="text-xl text-black font-normal leading-relaxed">
                                Elige tu gran ruta: Utah - Nevada - California | Miami - Orlando - Atlanta | New York - Boston - Washington DC.
                            </p>
                            <p className="text-lg text-black/70 font-normal leading-relaxed">
                                Para quienes no aceptan menos que la perfección. Un viaje épico diseñado bajo tus reglas con gestión integral 360°.
                            </p>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="rounded-full px-10 py-7 bg-black hover:bg-black/90 text-white font-medium text-lg shadow-xl transition-all"
                        onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Elegir Experiencia VIP
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
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Soporte exclusivo 24/7 incluido
                    </p>
                    <div className="h-px w-12 bg-gray-200" />
                </div>
            </div>
        </section>
    );
}
