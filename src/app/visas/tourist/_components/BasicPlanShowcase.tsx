"use client";

import { motion } from "framer-motion";
import { FileText, Users, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BasicPlanShowcase() {
    const features = [
        {
            title: "Auditoría de Perfil Migratorio",
            description: "Analizamos tus puntos fuertes y débiles de forma personalizada.",
            icon: Users,
            color: "bg-red-50 text-red-600",
        },
        {
            title: "Gestión Completa de Visa B1/B2",
            description: "Nos encargamos del formulario DS-160 y toda la burocracia por ti.",
            icon: FileText,
            color: "bg-yellow-50 text-yellow-600",
        },
        {
            title: "Simulación de Entrevista 1 a 1",
            description: "Acompañamiento personalizado para que vayas con total seguridad.",
            icon: Video,
            color: "bg-blue-50 text-blue-600",
        },
    ];

    return (
        <section className="py-24 bg-white overflow-hidden" id="plan-basico">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">

                    {/* Content side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-10"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest">
                                Opción Esencial
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1] tracking-tighter">
                                Empieza con el <br /> pie derecho: <span className="text-red-600 italic font-serif">Plan Básico.</span>
                            </h2>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                                Nuestra gestión incluye auditoría, llenado de formularios y preparación para la entrevista consular con acompañamiento 1 a 1.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="flex items-start gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:shadow-lg group">
                                        <div className={`p-4 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                            <Icon size={28} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-1">{feature.title}</h4>
                                            <p className="text-slate-600 font-medium leading-snug">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-8 pt-6">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xl px-16 py-9 rounded-full shadow-[0_10px_40px_rgba(220,38,38,0.3)] transition-all hover:scale-105 font-black uppercase tracking-tight"
                                onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Elegir Plan Básico
                            </Button>
                        </div>

                        <p className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            Gestión garantizada por expertos Udreamms
                        </p>
                    </motion.div>

                    {/* Visual side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.2)] aspect-[4/5] md:aspect-auto">
                            <img
                                src="/assets/generated/tourist_basic_showcase.png"
                                alt="Plan Turista Básico Udreamms"
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[2s]"
                            />
                            {/* Floating Badge */}
                            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Aprobación</span>
                                <span className="text-3xl font-black text-slate-900">98%</span>
                            </div>
                        </div>
                        {/* Background Accent */}
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-100/50 rounded-full blur-[100px] -z-10" />
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-100/40 rounded-full blur-[80px] -z-10" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
