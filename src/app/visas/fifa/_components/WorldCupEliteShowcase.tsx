"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Car, Beer, Users, Crown, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        id: "visa-express",
        category: "TRÁMITE",
        title: "Visa Express (Asesoría Urgente)",
        description: "Gestión prioritaria de tu documentación consular para asegurar tu ingreso a tiempo a los Estados Unidos para el inicio del torneo mundialista.",
        image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "guia-logistica",
        category: "LOGÍSTICA",
        title: "Guía Logística Sedes Mundial",
        description: "Mapas detallados y manuales de navegación para las 11 sedes oficiales exclusivamente en territorio estadounidense, con rutas optimizadas.",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "ruta-transporte",
        category: "MOVILIDAD",
        title: "Ruta de Transporte Inter-Sedes",
        description: "Logística optimizada para trayectos entre estadios en EE.UU., incluyendo vuelos domésticos e itinerarios de transporte privado VIP.",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "reserva-alojamiento",
        category: "ESTANCIA",
        title: "Reserva de Alojamiento (Cerca Estadios)",
        description: "Hospedaje seleccionado estratégicamente en las ciudades sede de EE.UU. para minimizar tiempos de traslado y maximizar el confort.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "traslados-privados",
        category: "TRASLADOS",
        title: "Traslados Privados a los Partidos",
        description: "Chofer privado a tu disposición para llevarte desde tu alojamiento hasta la puerta VIP del estadio, evitando cualquier tipo de tráfico.",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "hospitality",
        category: "HOSPITALITY",
        title: "Hospitality & Fan Zone VIP",
        description: "Gestión de acceso a zonas exclusivas de hospitalidad con catering premium directamente en los estadios oficiales de la FIFA.",
        image: "https://images.unsplash.com/photo-1511200922437-674384cf29b1?q=80&w=1000&auto=format&fit=crop"
    }
];

function EliteCard({ feature }: { feature: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 group"
        >
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-sm transition-shadow hover:shadow-xl relative">
                <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                />
            </div>
            <div className="space-y-4">
                <h3 className="text-3xl font-medium text-slate-950 leading-tight tracking-tight pr-4">
                    {feature.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-400 font-medium uppercase tracking-widest">
                    <span>{feature.category}</span>
                </div>
                <p className="text-slate-600 text-lg font-normal leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
}

export default function WorldCupEliteShowcase() {
    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="world-cup-elite-details">
            <div className="container-fluid mx-auto px-6 max-w-[1600px]">

                {/* Header: Title + Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 px-4">
                    <div className="md:pl-28">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white font-medium text-xs uppercase tracking-widest mb-4 shadow-lg">
                            <Crown size={14} fill="currentColor" />
                            World Cup Elite
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1.1]">
                            La experiencia <br />
                            <span className="text-slate-400">VIP definitiva</span>
                        </h2>
                        <p className="mt-6 text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
                            Diseñado para quienes no aceptan compromisos. Lujo, privacidad y el soporte más exclusivo que existe para vivir el Mundial 2026.
                        </p>
                    </div>
                    <div className="md:mr-16">
                        <Button
                            size="lg"
                            className="rounded-full px-10 py-7 bg-slate-900 hover:bg-black text-white font-medium text-lg shadow-2xl transition-all"
                            onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Elegir Plan Elite
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {/* First 4 services (Row 1) */}
                    {features.slice(0, 4).map((feature) => (
                        <EliteCard key={feature.id} feature={feature} />
                    ))}

                    {/* Remaining 2 services (Row 2), centered on LG screens */}
                    <div className="lg:col-span-4 flex flex-col md:flex-row lg:justify-center gap-8 lg:gap-10">
                        {features.slice(4).map((feature) => (
                            <div key={feature.id} className="lg:w-1/4">
                                <EliteCard feature={feature} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-20 flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-gray-200" />
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
                        Servicio Concierge 24/7 en cualquier sede
                    </p>
                    <div className="h-px w-12 bg-gray-200" />
                </div>
            </div>
        </section>
    );
}
