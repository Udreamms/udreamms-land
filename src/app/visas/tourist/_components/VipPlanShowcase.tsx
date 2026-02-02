"use client";

import { motion } from "framer-motion";
import { Star, Trophy, Shield, Rocket, Heart, CheckCircle2, Plane, Hotel, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VipPlanShowcase() {
    const features = [
        {
            title: "Vuelos y Traslados Internos",
            description: "Logística aérea y terrestre incluida en todas tus rutas.",
            icon: Plane,
            color: "bg-slate-900 text-white",
        },
        {
            title: "Hospedaje 4–5 Estrellas",
            description: "Garantizamos el máximo confort en los mejores hoteles de cada ciudad.",
            icon: Hotel,
            color: "bg-amber-100 text-amber-600",
        },
        {
            title: "Itinerario 15 Días - 14 Noches",
            description: "Una inmersión total diseñada cronológicamente para tu deleite.",
            icon: Calendar,
            color: "bg-purple-100 text-purple-600",
        },
        {
            title: "Actividades y Tickets Incluidos",
            description: "Acceso total a las experiencias más exclusivas de tu ruta.",
            icon: Sparkles,
            color: "bg-blue-100 text-blue-600",
        },
    ];

    return (
        <section className="py-24 bg-white overflow-hidden" id="plan-vip">
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
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 font-medium text-xs uppercase tracking-widest">
                                <Trophy size={14} />
                                La Élite del Viajero
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-sans font-medium text-slate-900 leading-[0.9] tracking-tighter">
                                Libertad Sin Límites: <br />
                                <span className="text-amber-500">VIP EXPERIENCE.</span>
                            </h2>
                            <div className="space-y-6">
                                <p className="text-xl text-slate-700 font-medium leading-relaxed max-w-xl">
                                    Elige tu gran ruta:
                                </p>
                                <ul className="space-y-2 text-lg text-slate-600 font-medium">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        Utah - Nevada - California
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        Miami - Orlando - Atlanta
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        New York - Boston - Washington DC
                                    </li>
                                </ul>
                                <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                                    Para quienes no aceptan menos que la perfección. Un viaje épico diseñado bajo tus reglas con gestión integral 360°.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="flex items-start gap-4 p-5 rounded-3xl bg-amber-50/50 border border-amber-100 transition-all hover:bg-amber-50 hover:shadow-lg group">
                                        <div className={`p-4 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                            <Icon size={28} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-medium text-slate-900 mb-1">{feature.title}</h4>
                                            <p className="text-slate-600 font-medium leading-snug">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white text-lg md:text-xl px-10 py-7 rounded-full shadow-xl transition-all hover:scale-105 font-medium uppercase tracking-tight"
                                onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Elegir Experiencia VIP
                            </Button>
                            <Button
                                size="lg"
                                className="w-full sm:w-auto border-2 border-slate-900 bg-slate-900 hover:bg-black text-white text-lg md:text-xl px-10 py-7 rounded-full shadow-lg transition-all hover:scale-105 font-medium uppercase tracking-tight"
                                onClick={() => window.open('https://wa.me/yournumber', '_blank')}
                            >
                                Quiero más información
                            </Button>
                        </div>

                        <div className="pt-4 flex items-center gap-2 text-slate-400 font-medium uppercase tracking-widest text-xs">
                            <CheckCircle2 size={16} className="text-amber-500" />
                            Soporte exclusivo 24/7 incluido
                        </div>
                    </motion.div>

                    {/* Visual side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.25)] border-4 border-slate-900 aspect-[4/5] md:aspect-auto">
                            <img
                                src="/assets/generated/tourist_vip_showcase.png"
                                alt="Experiencia VIP Udreamms"
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[5s]"
                            />
                        </div>
                        {/* Background Accent */}
                        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-amber-200/40 rounded-full blur-[120px] -z-10" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
