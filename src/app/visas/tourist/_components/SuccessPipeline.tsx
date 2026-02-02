"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { Search, Target, Plane } from "lucide-react";

const STEPS = [
    {
        title: "Auditoría de Perfil",
        description: "Analizamos tu situación actual para identificar los puntos fuertes y débiles de tu perfil migratorio.",
        icon: Search,
        color: "bg-blue-600",
    },
    {
        title: "Estrategia de Éxito",
        description: "Creamos una narrativa sólida, gestionamos tu DS-160 y realizamos simulacros de entrevista de alta fidelidad.",
        icon: Target,
        color: "bg-orange-600",
    },
    {
        title: "Aprobación y Viaje",
        description: "Te acompañamos hasta el momento de tu cita y te ayudamos a planificar tu entrada triunfal a los Estados Unidos.",
        icon: Plane,
        color: "bg-green-600",
    },
];

export default function SuccessPipeline() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h2 className="text-4xl md:text-5xl font-medium text-slate-900 mb-6 tracking-tight uppercase">
                            El Sistema de <span className="text-blue-600">Éxito Migratorio</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                            No es solo un trámite, es un sistema diseñado para maximizar tus probabilidades de aprobación mediante 3 fases estratégicas.
                        </p>
                    </FadeIn>
                </div>

                <div className="relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300"
                                >
                                    <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-8 shadow-lg shadow-${step.color.split('-')[1]}-200`}>
                                        <Icon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-medium text-slate-900 mb-4 tracking-tight">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {step.description}
                                    </p>

                                    {/* Step Number */}
                                    <div className="mt-8 text-4xl font-medium text-slate-100 group-hover:text-slate-200 transition-colors">
                                        0{index + 1}
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
