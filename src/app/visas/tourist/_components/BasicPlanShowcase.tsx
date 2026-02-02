"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        id: "auditoria",
        title: "Auditoría de Perfil Migratorio",
        description: "Analizamos tus puntos fuertes y débiles de forma personalizada.",
        icon: Users,
        color: "bg-red-50 text-red-600",
        image: "/assets/generated/tourist_basic_showcase.png"
    },
    {
        id: "gestion",
        title: "Gestión Completa de Visa B1/B2",
        description: "Nos encargamos del formulario DS-160 y toda la burocracia por ti.",
        icon: FileText,
        color: "bg-yellow-50 text-yellow-600",
        image: "/assets/generated/tourist_basic_showcase.png"
    },
    {
        id: "simulacion",
        title: "Simulación de Entrevista 1 a 1",
        description: "Acompañamiento personalizado para que vayas con total seguridad.",
        icon: Video,
        color: "bg-blue-50 text-blue-600",
        image: "/assets/generated/tourist_basic_showcase.png"
    },
];

export default function BasicPlanShowcase() {
    const [activeTab, setActiveTab] = useState(features[0]);

    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="plan-basico">
            <div className="container mx-auto px-6">

                {/* Header: Title + Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium text-xs uppercase tracking-widest mb-4">
                            Opción Esencial
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1.1]">
                            Empieza con el pie derecho<br />
                            <span className="text-black">Plan Básico</span>
                        </h2>
                        <p className="mt-6 text-xl text-black font-normal leading-relaxed max-w-xl">
                            Nuestra gestión incluye auditoría, llenado de formularios y preparación para la entrevista consular con acompañamiento 1 a 1.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="rounded-full px-10 py-7 bg-black hover:bg-black/90 text-white font-medium text-lg shadow-xl transition-all"
                        onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Elegir Plan Básico
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
                                {/* Floating Badge */}
                                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center">
                                    <span className="text-slate-500 text-xs font-medium uppercase tracking-widest mb-1">Aprobación</span>
                                    <span className="text-3xl font-medium tracking-tighter text-slate-900">98%</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Background Accents */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-red-100/50 rounded-full blur-[80px] -z-10" />
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-100/40 rounded-full blur-[60px] -z-10" />
                    </div>

                </div>

                {/* Footer Quote */}
                <div className="mt-20 flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-gray-200" />
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Gestión garantizada por expertos Udreamms
                    </p>
                    <div className="h-px w-12 bg-gray-200" />
                </div>
            </div>
        </section>
    );
}
