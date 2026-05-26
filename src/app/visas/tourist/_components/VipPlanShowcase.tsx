"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Hotel, Calendar, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    return (
        <section className="py-24 md:py-32 bg-transparent text-white overflow-hidden" id="plan-vip">
            <div className="container mx-auto px-6">

                <div className="flex flex-col lg:flex-row gap-16 items-stretch relative pt-8">

                    {/* Left Column: Content + Interactive List */}
                    <div className="w-full lg:w-1/3 flex flex-col relative z-10">
                        {/* Decorative circle based on image */}
                        <svg className="absolute -top-16 -left-12 w-40 h-40 text-gray-800 -z-10 opacity-30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 50,0 A 50,50 0 0,0 0,50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                        </svg>

                        {/* Text Content */}
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/10 text-slate-300 font-medium text-[9px] uppercase tracking-widest mb-4 border border-white/5">
                                La Élite del Viajero
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tighter text-white leading-[1.1]">
                                Libertad Sin Límites<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">VIP EXPERIENCE</span>
                            </h2>
                            <div className="mt-4 space-y-2 max-w-sm">
                                <p className="text-sm text-slate-300 font-normal leading-relaxed">
                                    Elige tu gran ruta: Utah - Nevada - California | Miami - Orlando - Atlanta | New York - Boston - Washington DC.
                                </p>
                                <p className="text-xs text-slate-400 font-normal leading-relaxed">
                                    Para quienes no aceptan menos que la perfección. Un viaje épico diseñado bajo tus reglas con gestión integral 360°.
                                </p>
                            </div>
                        </div>

                        {/* Interactive List */}
                        <div className="flex flex-col mt-4">
                            {features.map((feature) => {
                                const isActive = activeTab.id === feature.id;
                                const Icon = feature.icon;

                                return (
                                    <div
                                        key={feature.id}
                                        className="group cursor-pointer"
                                        onClick={() => setActiveTab(feature)}
                                    >
                                        <div className="py-4 border-b border-white/10 last:border-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`p-1 rounded-lg transition-colors duration-300 ${isActive ? "bg-white/20 text-white" : "bg-transparent text-slate-400 group-hover:bg-white/10 group-hover:text-white"}`}>
                                                    <Icon size={16} strokeWidth={2.5} />
                                                </div>
                                                <h4 className={`text-base transition-colors duration-300 ${isActive ? 'font-medium text-white' : 'font-medium text-slate-400 group-hover:text-white'}`}>
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
                                                        className="overflow-hidden pl-[2rem]"
                                                    >
                                                        <p className="pt-1 text-slate-300 leading-relaxed font-normal text-xs pr-4">
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
                        
                        {/* Button moved to the bottom */}
                        <Button
                            className="mt-6 lg:mt-auto rounded-full px-6 py-4 bg-transparent border border-white/40 hover:bg-blue-600 hover:border-blue-600 text-white font-medium text-sm shadow-xl transition-all self-start"
                            onClick={() => router.push('/instructions-payment-tourist?plan=vip')}
                        >
                            Elegir Experiencia VIP
                        </Button>
                    </div>

                    {/* Right Column: Dynamic Visual */}
                    <div className="w-full lg:w-2/3 h-[400px] lg:h-auto relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-2xl"
                            >
                                <img
                                    src={activeTab.image}
                                    alt={activeTab.title}
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>

                {/* Footer Quote */}
                <div className="mt-20 flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-white/20" />
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                        Soporte exclusivo 24/7 incluido
                    </p>
                    <div className="h-px w-12 bg-white/20" />
                </div>
            </div>
        </section>
    );
}
