"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    School,
    FileText,
    MessageCircle,
    Plane,
    Car,
    CreditCard
} from "lucide-react";

const features = [
    {
        id: "servicios",
        title: "Servicios Básicos",
        description: "Gestión administrativa inicial y asesoría fundamental.",
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "escuela",
        title: "Aplicación escuela + I-20",
        description: "Trámite del documento I-20 para tu admisión escolar.",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "consular",
        title: "DS-160 + SEVIS + Cita",
        description: "Llenado de formularios y agenda estratégica consular.",
        thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "entrevista",
        title: "Simulacro de Entrevista",
        description: "Preparación intensiva para responder con éxito al cónsul.",
        thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "vuelos",
        title: "Vuelos y Seguro Médico",
        description: "Apoyo en logística aérea y seguro de viaje internacional.",
        thumbnail: "/assets/vuelos.png"
    },
    {
        id: "pickup",
        title: "Pick-up Aeropuerto (UT)",
        description: "Recepción y transporte privado a tu zona de estadía.",
        thumbnail: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "asentamiento",
        title: "Servicios de Asentamiento",
        description: "Soporte en trámites de banco, celular y licencia local.",
        thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=300&auto=format&fit=crop"
    },
];

export default function ProPlanShowcase() {
    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="plan-pro">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium text-xs uppercase tracking-widest mb-4">
                            NIVEL PROFESIONAL
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1.1]">
                            Seguridad y Confort<br />
                            <span className="text-slate-400">Plan Pro</span>
                        </h2>
                        <p className="mt-6 text-xl text-black font-normal leading-relaxed max-w-xl">
                            Diseñado para quienes buscan no solo la visa, sino una llegada organizada y sin complicaciones.
                        </p>
                    </div>
                    <Link href="/instructions-payment-student?plan=pro">
                        <Button
                            size="lg"
                            className="rounded-full px-10 py-4 bg-black hover:bg-black/90 text-white font-medium text-base shadow-xl shadow-gray-200 transition-all"
                        >
                            Elegir Plan Pro
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start max-h-[750px]">

                    {/* Left Column: Large Hero Image */}
                    <div className="w-full lg:w-1/2 h-full">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full relative aspect-[1/1.1] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border border-slate-100"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop"
                                alt="Udreamms Pro Experience"
                                className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </motion.div>
                    </div>

                    {/* Right Column: Scrollable List with Invisible Scrollbar */}
                    <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] overflow-y-auto no-scrollbar pr-4">
                        {features.map((feature, index) => {
                            return (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group flex items-center justify-between gap-8 py-8 border-b border-slate-100 last:border-0"
                                >
                                    {/* Text Content */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-medium text-black tracking-tight group-hover:text-black/60 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-slate-500 text-base font-normal leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Thumbnail Image */}
                                    <div className="hidden sm:block shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-md border border-white">
                                        <img
                                            src={feature.thumbnail}
                                            alt={feature.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
