"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { AlertOctagon, Ban, TrendingDown } from "lucide-react";

export default function SystemGapSection() {
    return (
        <section className="relative z-30 pb-20 px-6 bg-white">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-center mt-12 max-w-6xl mx-auto">

                    {/* Left Column: Text (FIFA Focused) */}
                    <motion.div
                        className="text-left space-y-8 pointer-events-none relative z-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-2 mb-4 text-red-600 font-bold uppercase text-sm tracking-widest animate-pulse">
                            <AlertOctagon className="w-5 h-5" />
                            <span>Alerta Roja Mundialista</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl text-slate-900 font-black italic block leading-[1] tracking-tighter drop-shadow-sm mb-8">
                            Asegura tu lugar con el <br />
                            <span className="text-red-600 underline decoration-red-200 underline-offset-8">Plan Fan Pass.</span>
                        </h2>

                        {/* Inter-phrase Obstacles - Vertical Pill Stack */}
                        <div className="flex flex-col gap-4 mb-8 pr-2 w-full max-w-lg mx-auto">
                            {/* 1. Visa */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-red-200 transition-all group w-full">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <TrendingDown size={20} />
                                </div>
                                <span className="text-lg font-bold text-slate-800">Visa Express (Prioridad)</span>
                            </div>

                            {/* 2. Logistics */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-red-200 transition-all group w-full">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <Ban size={20} />
                                </div>
                                <span className="text-lg font-bold text-slate-800">Guía de Sedes 2026</span>
                            </div>
                        </div>

                        <p className="text-xl md:text-2xl text-slate-600 font-medium block leading-relaxed max-w-xl mb-8">
                            No dejes que el tiempo te deje fuera de juego. Tu entrada comienza con la visa.
                        </p>

                        <div className="flex justify-start">
                            <a href="#planes" className="bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-red-700 transition-all flex items-center gap-2 group">
                                Solicitar ahora
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                    </motion.div>

                    {/* Right Column: Image */}
                    <FadeIn delay={0.2} className="relative rounded-3xl overflow-hidden w-full md:w-[480px] h-[620px] mt-0 mx-auto md:mr-0 group shadow-2xl skew-y-3">
                        <img
                            src="/assets/slc.jpg"
                            alt="Estadio Mundialista"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                            onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent pointer-events-none" />
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
