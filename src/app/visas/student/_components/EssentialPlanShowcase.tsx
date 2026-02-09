"use client";

import { motion } from "framer-motion";
import { FileText, School, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        id: "servicios",
        title: "Servicios Básicos",
        description: "Gestión administrativa inicial y asesoría fundamental para tu proceso estudiantil.",
        icon: CheckCircle2,
        color: "bg-slate-50 text-black",
        image: "/assets/generated/student_essential_showcase.png"
    },
    {
        id: "escuela",
        title: "Aplicación escuela + I-20",
        description: "Te guiamos paso a paso en la obtención de tu formulario I-20, el documento llave para tu visa.",
        icon: School,
        color: "bg-slate-50 text-black",
        image: "/assets/generated/student_essential_showcase.png"
    },
    {
        id: "consular",
        title: "DS-160 + SEVIS + Cita",
        description: "Manejo experto de formularios consulares y programación estratégica de tu cita en la embajada.",
        icon: FileText,
        color: "bg-slate-50 text-black",
        image: "/assets/generated/student_essential_showcase.png"
    },
    {
        id: "entrevista",
        title: "Simulacro de Entrevista",
        description: "3 sesiones de preparación intensiva para que respondas con confianza y claridad ante el cónsul.",
        icon: MessageCircle,
        color: "bg-slate-50 text-black",
        image: "/assets/generated/student_essential_showcase.png"
    },
];

export default function EssentialPlanShowcase() {
    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="plan-esencial">
            <div className="container mx-auto px-6">

                {/* Header: Title + Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium text-xs uppercase tracking-widest mb-4">
                            PUNTO DE PARTIDA
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1.1]">
                            Lo <span className="text-slate-400">esencial</span> para tu<br />
                            <span className="text-black">Visa de Estudiante</span>
                        </h2>
                        <p className="mt-6 text-xl text-black font-normal leading-relaxed max-w-xl">
                            Todo lo que necesitas para asegurar tu admisión educativa y comenzar tu trámite consular con expertos.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="rounded-full px-10 py-7 bg-black hover:bg-black/90 text-white font-medium text-lg shadow-xl shadow-gray-200 transition-all"
                        onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Elegir Plan Esencial
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const cardImages = [
                            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop", // Admin
                            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop", // University
                            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop", // Consular
                            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"  // Prep
                        ];

                        return (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer bg-slate-100"
                            >
                                <img
                                    src={cardImages[index]}
                                    alt={feature.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Enhanced Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                                {/* Bottom Content with Backdrop Blur for the 'difuminado' effect */}
                                <div className="absolute bottom-0 left-0 p-8 w-full backdrop-blur-[2px] bg-black/5">
                                    <div className="flex items-center gap-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg">
                                            <Icon size={18} />
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-bold text-white tracking-tight mb-1 drop-shadow-md">
                                        {feature.title}
                                    </h4>
                                    <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100 pt-4">
                                        <p className="text-white text-sm leading-relaxed border-t border-white/20 pt-4 drop-shadow-sm font-normal">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer Message */}
                <div className="mt-20 flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-gray-200" />
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-black" />
                        Acompañamiento académico y consular premium
                    </p>
                    <div className="h-px w-12 bg-gray-200" />
                </div>
            </div>
        </section>
    );
}
