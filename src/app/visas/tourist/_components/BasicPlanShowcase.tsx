"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    return (
        <section className="py-16 bg-white text-black overflow-hidden" id="plan-basico">
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
                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-[9px] uppercase tracking-widest mb-4">
                                Opción Esencial
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tighter text-black leading-[1.1]">
                                Empieza con el pie derecho<br />
                                <span className="text-black">Plan Básico</span>
                            </h2>
                            <p className="mt-4 text-sm text-black font-normal leading-relaxed max-w-sm">
                                Nuestra gestión incluye auditoría, llenado de formularios y preparación para la entrevista consular con acompañamiento 1 a 1.
                            </p>
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
                                        <div className="py-4 border-b border-gray-100 last:border-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`p-1 rounded-lg transition-colors duration-300 bg-white ${isActive ? "text-black" : "text-black group-hover:bg-gray-50"}`}>
                                                    <Icon size={16} strokeWidth={2.5} />
                                                </div>
                                                <h4 className={`text-base transition-colors duration-300 ${isActive ? 'font-medium text-black' : 'font-medium text-black group-hover:text-black'}`}>
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
                                                        <p className="pt-1 text-black leading-relaxed font-normal text-xs pr-4">
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
                            className="mt-6 lg:mt-auto rounded-full px-6 py-4 bg-black hover:bg-black/90 text-white font-medium text-sm shadow-xl transition-all self-start"
                            onClick={() => router.push('/instructions-payment-tourist?plan=basico')}
                        >
                            Elegir Plan Básico
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
                                className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden bg-white shadow-2xl"
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
