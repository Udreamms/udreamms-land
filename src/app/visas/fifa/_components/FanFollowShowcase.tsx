"use client";

import { useState, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Map, Bus, Hotel, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        id: "visa-express",
        category: "VISA",
        title: "Visa Express (Asesoría Urgente)",
        description: "Gestión prioritaria de tu documentación consular para asegurar tu ingreso a tiempo a los Estados Unidos para el inicio del torneo.",
        images: [
            "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512418490979-92798cccf320?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1569050302277-fb31f234128e?q=80&w=800&auto=format&fit=crop"
        ]
    },
    {
        id: "guia-logistica",
        category: "LOGÍSTICA",
        title: "Guía Logística Sedes Mundial",
        description: "Mapas detallados y manuales de navegación para las 11 sedes oficiales exclusivamente en territorio estadounidense.",
        images: [
            "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512418490979-92798cccf320?q=80&w=800&auto=format&fit=crop"
        ]
    },
    {
        id: "transporte",
        category: "MOVILIDAD",
        title: "Ruta de Transporte Inter-Sedes",
        description: "Logística optimizada para trayectos entre estadios en EE.UU., incluyendo vuelos domésticos e itinerarios de transporte oficial.",
        images: [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517249023164-ec5d9fa57f0f?q=80&w=800&auto=format&fit=crop"
        ]
    },
    {
        id: "alojamiento",
        category: "ESTANCIA",
        title: "Reserva de Alojamiento (Cerca Estadios)",
        description: "Hospedaje seleccionado estratégicamente en las ciudades sede de EE.UU. para minimizar tiempos de traslado.",
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1551882547-ff43c61f3635?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop"
        ]
    }
];

// Feature Card Component with its own carousel state
function FeatureCard({ feature, idx }: { feature: any, idx: number }) {
    const [imgIdx, setImgIdx] = useState(0);

    const nextImg = (e?: MouseEvent) => {
        e?.stopPropagation();
        setImgIdx((prev) => (prev + 1) % feature.images.length);
    };

    // Auto-rotate
    useEffect(() => {
        const timer = setInterval(() => {
            setImgIdx((prev) => (prev + 1) % feature.images.length);
        }, 5000 + idx * 1000); // Staggered auto-rotation
        return () => clearInterval(timer);
    }, [feature.images.length, idx]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col h-full min-h-[520px] group transition-all hover:shadow-2xl hover:-translate-y-2 relative"
        >
            <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 block">
                {feature.category}
            </span>

            <h3 className="text-2xl md:text-3xl font-medium text-slate-950 leading-tight mb-6 tracking-tight">
                {feature.title}
            </h3>

            <p className="text-slate-600 text-lg font-normal leading-relaxed mb-12">
                {feature.description}
            </p>

            {/* Bottom Area: Image Carousel + Arrow Button */}
            <div className="mt-auto flex items-end justify-between gap-4">
                {/* Green Box: Image Carousel */}
                <div className="flex-1 h-36 rounded-3xl overflow-hidden border border-slate-100 relative bg-slate-50">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={feature.images[imgIdx]}
                            src={feature.images[imgIdx]}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                </div>

                {/* Pink/Black Circle: Arrow Button */}
                <div
                    onClick={nextImg}
                    className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer text-white"
                >
                    <ChevronRight size={28} strokeWidth={1.5} />
                </div>
            </div>
        </motion.div>
    );
}

export default function FanFollowShowcase() {
    const [activeTab, setActiveTab] = useState(features[0]);

    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="fan-follow-details">
            <div className="container mx-auto px-6">

                {/* Header: Title + Button */}
                {/* Header: Centered Title while keeping side elements */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    {/* Left side: Button */}
                    <div className="w-full md:w-1/4 flex justify-start order-2 md:order-1">
                        <Button
                            size="lg"
                            className="rounded-full px-10 py-7 bg-black hover:bg-slate-900 text-white font-medium text-lg shadow-xl shadow-slate-200 transition-all"
                            onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Elegir Fan Follow
                        </Button>
                    </div>

                    {/* Center: Title (Orange Highlight) */}
                    <div className="w-full md:w-1/2 text-center order-1 md:order-2 md:-mt-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 font-medium text-xs uppercase tracking-widest mb-4">
                            <Star size={14} fill="currentColor" />
                            Plan Fan Follow (PRO)
                        </div>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black leading-[1.1] max-w-[15ch] mx-auto">
                            Movilidad y estancia <span className="text-slate-400">totalmente</span> resuelta
                        </h2>
                    </div>

                    {/* Right side: Description */}
                    <div className="w-full md:w-1/4 text-left md:text-right order-3 md:pt-20">
                        <p className="text-xl text-slate-600 font-normal leading-relaxed max-w-sm md:ml-auto">
                            Para el fan que busca comodidad total. Delegas toda la logística de tu viaje mundialista en nosotros.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <FeatureCard key={feature.id} feature={feature} idx={idx} />
                    ))}
                </div>

                {/* Footer Message */}
                <div className="mt-20 flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-gray-200" />
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Logística completa inter-estadios garantizada
                    </p>
                    <div className="h-px w-12 bg-gray-200" />
                </div>
            </div>
        </section>
    );
}
