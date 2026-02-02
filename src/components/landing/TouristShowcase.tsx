"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TouristShowcase() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Visual Impact */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src="/assets/generated/tourist_showcase_disney.png"
                                alt="Vacaciones en Familia USA"
                                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>

                        {/* Decorative element */}
                        <div className="absolute -bottom-6 -right-6 bg-gold text-white p-8 rounded-3xl shadow-xl hidden md:block">
                            <p className="text-4xl font-black italic">95%</p>
                            <p className="text-xs uppercase font-bold tracking-widest">Tasa de Éxito</p>
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-widest mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Visa de Turismo B1/B2
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                            Tus vacaciones soñadas <br /> <span className="text-blue-600">sin complicaciones.</span>
                        </h2>

                        <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                            Gestionamos tu Visa de Turismo de principio a fin para que tú solo te preocupes por hacer las maletas. Desde la estrategia consular hasta el itinerario de viaje.
                        </p>

                        <ul className="space-y-4 mb-12">
                            {[
                                "Llenado profesional del Formulario DS-160",
                                "Simulacros de Entrevista Individuales",
                                "Monitoreo de Citas Prioritarias",
                                "Planificación de Itinerario y Alojamiento"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-semibold">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/visas/tourist">
                                <Button size="lg" className="bg-slate-900 hover:bg-black text-white px-10 py-7 rounded-full text-lg font-bold shadow-xl flex items-center gap-3 group">
                                    Conoce el Plan Turismo
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
