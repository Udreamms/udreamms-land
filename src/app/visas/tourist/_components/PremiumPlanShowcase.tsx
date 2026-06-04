"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Users, Video, Plane, Hotel, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    return (
        <section className="py-24 md:py-32 bg-transparent text-white overflow-hidden" id="plan-premium">
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
                                La Opción Completa
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tighter text-white leading-[1.1]">
                                Vacaciones de Ensueño<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]">Plan Premium</span>
                            </h2>
                            <div className="mt-4 space-y-2 max-w-sm">
                                <p className="text-sm text-slate-300 font-normal leading-relaxed">
                                    Elige tu destino: Florida, New York, California, Utah, Nevada o Hawaii.
                                </p>
                                <p className="text-xs text-slate-400 font-normal leading-relaxed">
                                    ¿Por qué estresarte planeando? Nosotros nos encargamos de todo: desde la visa hasta el último detalle de tu aventura familiar.
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
                                        <div className="py-4 last:border-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`transition-colors duration-300 ${isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-400'}`}>
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
                        
                        {/* Buttons moved to the bottom */}
                        <div className="mt-6 lg:mt-auto flex flex-col sm:flex-row gap-4 self-start w-full sm:w-auto">
                            <Button
                                className="w-full sm:w-auto px-6 py-3 bg-transparent border border-white/40 text-white rounded-full hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm font-medium"
                                onClick={() => router.push('/instructions-payment-tourist?plan=premium')}
                            >
                                Elegir Plan Premium
                            </Button>
                            <Button
                                asChild
                                className="w-full sm:w-auto px-6 py-3 bg-transparent border border-white/40 text-white rounded-full hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm font-medium"
                            >
                                <a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3X9M9IxjU-0QyoLH4nwKpy5WjuxDwM-KQC0QrZS_Mcri7IKWXEPWn4s5eOtySu9m_EFqZQgpv0" target="_blank" rel="noopener noreferrer">
                                    Agendar reunión virtual
                                </a>
                            </Button>
                        </div>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        Todo incluido: viaja sin preocupaciones
                    </p>
                    <div className="h-px w-12 bg-white/20" />
                </div>
            </div>
        </section>
    );
}
