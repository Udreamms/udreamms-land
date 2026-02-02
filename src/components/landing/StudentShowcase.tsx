"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentShowcase() {
    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">

                    {/* Visual Impact */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src="/assets/generated/student_showcase_campus.png"
                                alt="Estudiante en Campus USA"
                                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>

                        {/* Exclusive Badge */}
                        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-tighter text-slate-500">Programas de Inglés</p>
                                    <p className="text-lg font-black text-slate-900">Aceptación Garantizada</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-widest mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Visa de Estudiante F-1
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                            Domina el inglés y <br /> <span className="text-blue-600">crece profesionalmente.</span>
                        </h2>

                        <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                            Tu camino académico en Estados Unidos comienza con la asesoría correcta. Nos encargamos de tu admisión en las mejores instituciones de idiomas y de que tu perfil sea impecable para la embajada.
                        </p>

                        <ul className="space-y-4 mb-12">
                            {[
                                "Aplicación y Trámite de I-20",
                                "Certificación Académica y Nivelación",
                                "Estrategia de Solvencia Económica",
                                "Apoyo en Alojamiento y Vida Estudiantil"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-semibold">
                                    <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/visas/student">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 rounded-full text-lg font-bold shadow-xl flex items-center gap-3 group">
                                    Explorar Plan Estudiante
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
