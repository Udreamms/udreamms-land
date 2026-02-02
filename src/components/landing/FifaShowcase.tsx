"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FifaShowcase() {
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
                                src="/assets/generated/fifa_showcase_stadium.png"
                                alt="Aficionados en Estadio USA 2026"
                                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#D31245]/40 to-transparent" />
                        </div>

                        {/* Countdown or Promo Badge */}
                        <div className="absolute -top-6 -right-6 bg-[#D31245] text-white p-8 rounded-full shadow-xl hidden md:flex flex-col items-center justify-center w-40 h-40 animate-bounce">
                            <Trophy className="w-10 h-10 mb-2" />
                            <p className="text-sm font-black uppercase tracking-widest text-center leading-tight">Mundial <br /> 2026</p>
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-[#D31245] font-bold text-xs uppercase tracking-widest mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#D31245] animate-pulse" />
                            FIFA Fan Pass - Edición Limitada
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                            Asegura tu lugar en la <br /> <span className="text-[#D31245]">fiesta del fútbol.</span>
                        </h2>

                        <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                            No te pierdas el evento más grande de la década. Creamos una estrategia específica para que tu solicitud de visa sea aprobada con el objetivo de asistir al Mundial 2026, incluyendo beneficios exclusivos para fans.
                        </p>

                        <ul className="space-y-4 mb-12">
                            {[
                                "Estrategia de Visa enfocada en el Mundial",
                                "Asesoría en Logística de Estadios y Sedes",
                                "Gestión de Documentación para Aficionados",
                                "Acceso a la Red de Fanáticos Udreamms"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-semibold">
                                    <CheckCircle2 className="w-6 h-6 text-[#D31245] flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/visas/fifa">
                                <Button size="lg" className="bg-[#D31245] hover:bg-[#b00e3a] text-white px-10 py-7 rounded-full text-lg font-bold shadow-xl flex items-center gap-3 group">
                                    Ver FIFA Fan Pass
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
