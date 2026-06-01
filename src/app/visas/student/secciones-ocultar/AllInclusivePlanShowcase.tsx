"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Plane,
    Home,
    Star,
    MessageCircle,
    CheckCircle2,
    School,
    FileText,
    Car,
    Smartphone,
    Users,
    Languages
} from "lucide-react";

const features = [
    {
        id: "basicos",
        title: "Servicios Básicos",
        description: "Gestión administrativa completa y asesoría legal para tu absoluta tranquilidad durante el proceso.",
        icon: CheckCircle2,
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "escuela",
        title: "Aplicación escuela + I-20",
        description: "Trámite integral de tu admisión escolar y obtención garantizada de tu formulario I-20.",
        icon: School,
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "consular",
        title: "DS-160 + SEVIS + Cita",
        description: "Llenado profesional de formularios consulares y programación estratégica de tu cita en la embajada.",
        icon: FileText,
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "entrevista",
        title: "Simulacro de Entrevista (Ilimitadas)",
        description: "Prepárate sin límites con nuestros expertos hasta que domines cada respuesta para el cónsul.",
        icon: MessageCircle,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "vuelos",
        title: "Tickets aéreos a USA (incluidos)",
        description: "Olvida el costo de los vuelos; tus pasajes aéreos ida y vuelta están totalmente cubiertos por nosotros.",
        icon: Plane,
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "pickup",
        title: "Pick-up Aeropuerto (UT)",
        description: "Recepción privada y traslado seguro desde el aeropuerto directamente hasta tu nueva zona de residencia.",
        icon: Car,
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "servicios_locales",
        title: "Banco, Celular y Licencia",
        description: "Acompañamiento presencial para abrir tu cuenta bancaria, línea telefónica y gestionar trámites legales locales.",
        icon: Smartphone,
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "alojamiento",
        title: "Búsqueda de Alojamiento (4 Meses Pagados)",
        description: "Disfruta de la comodidad de una vivienda asegurada y totalmente pagada durante tu primer cuatrimestre.",
        icon: Home,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "mentoria",
        title: "Mentoria de Adaptación (4 meses)",
        description: "Soporte personalizado y continuo durante 4 meses para asegurar una transición perfecta a tu nueva vida.",
        icon: Users,
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "ingles",
        title: "Clases de Inglés (4 Meses Pagados)",
        description: "Perfecciona tu nivel de comunicación con clases premium especializadas, incluidas por 4 meses.",
        icon: Languages,
        image: "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&w=1200&auto=format&fit=crop"
    },
];

export default function AllInclusivePlanShowcase() {
    const [activeTab, setActiveTab] = useState(features[0]);

    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="plan-allinclusive">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium text-xs uppercase tracking-widest mb-4">
                            All-Inclusive VIP
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1.1]">
                            Sin Preocupaciones<br />
                            <span className="text-slate-400">Todo Incluido</span>
                        </h2>
                        <p className="mt-6 text-xl text-black font-normal leading-relaxed max-w-xl">
                            La solución definitiva donde nosotros nos encargamos de absolutamente todo, desde tu boleto de avión hasta tu hogar en USA.
                        </p>
                    </div>
                    <Link href="/instructions-payment-student?plan=allinclusive">
                        <Button
                            size="lg"
                            className="rounded-full px-10 py-4 bg-black hover:bg-black/90 text-white font-medium text-base shadow-xl shadow-gray-200 transition-all"
                        >
                            Elegir All-Inclusive
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Column: Interactive List (Now on the left) */}
                    <div className="w-full lg:w-1/2 flex flex-col max-h-[700px] overflow-y-auto pr-6 custom-scrollbar">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .custom-scrollbar::-webkit-scrollbar {
                                width: 5px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-track {
                                background: transparent;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                background: #e2e8f0;
                                border-radius: 10px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                background: #cbd5e1;
                            }
                            .custom-scrollbar {
                                scrollbar-width: thin;
                                scrollbar-color: #e2e8f0 transparent;
                            }
                        `}} />
                        {features.map((feature, index) => {
                            const isActive = activeTab.id === feature.id;
                            const Icon = feature.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <div
                                    key={feature.id}
                                    className="group cursor-pointer"
                                    onClick={() => setActiveTab(feature)}
                                >
                                    <div className="py-5 border-b border-slate-100 last:border-0">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className={`p-2 transition-all duration-300 ${isActive ? "scale-110" : ""}`}>
                                                <Icon
                                                    size={32}
                                                    strokeWidth={2}
                                                    className={`transition-colors duration-300 ${isActive
                                                        ? "text-black"
                                                        : isEven
                                                            ? "text-black"
                                                            : "text-slate-300"
                                                        }`}
                                                />
                                            </div>
                                            <h4 className={`text-xl transition-colors duration-300 font-medium text-black group-hover:text-slate-400`}>
                                                {feature.title}
                                            </h4>
                                        </div>

                                        <div className="pl-[3.25rem]">
                                            <p className={`text-slate-500 leading-relaxed font-normal text-sm md:text-base transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Dynamic Visual (Now on the right) */}
                    <div className="w-full lg:w-1/2 h-full min-h-[500px] sticky top-24">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="w-full h-full relative aspect-[4/3] lg:aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 shadow-2xl border border-slate-100"
                            >
                                <img
                                    src={activeTab.image}
                                    alt={activeTab.title}
                                    className="w-full h-full object-cover transition-all duration-700"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Background Accents */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-100 rounded-full blur-[100px] -z-10" />
                    </div>

                </div>
            </div>
        </section>
    );
}
