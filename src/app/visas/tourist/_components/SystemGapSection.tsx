"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { AlertTriangle, FileCheck, MessageSquare } from "lucide-react";

export default function SystemGapSection() {
    return (
        <section className="relative z-30 pb-20 px-6 bg-cloud">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-center mt-24 max-w-6xl mx-auto">

                    {/* Left Column: Text */}
                    <motion.div
                        className="text-left space-y-8 pointer-events-none relative z-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >

                        <h2 className="text-3xl md:text-5xl text-abyss font-bold font-playfair block leading-[1.2] tracking-tight drop-shadow-sm mb-8">
                            Empieza con el pie derecho: <span className="text-primary">Plan Turista Básico.</span>
                        </h2>

                        {/* Inter-phrase Obstacles - Vertical Pill Stack (Matching Image) */}
                        <div className="flex flex-col gap-4 mb-8 pr-2 w-full max-w-lg mx-auto">
                            {/* 1. Auditoría */}
                            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group w-full">
                                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                    <AlertTriangle size={20} />
                                </div>
                                <span className="text-lg font-medium text-slate-700">Auditoría de Perfil Migratorio</span>
                            </div>

                            {/* 2. Gestión */}
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group w-full">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
                                    <FileCheck size={20} />
                                </div>
                                <span className="text-lg font-medium text-slate-700">Gestión de Visa B1/B2</span>
                            </div>

                            {/* 3. Preparación */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group w-full">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:scale-110 transition-transform">
                                    <MessageSquare size={20} />
                                </div>
                                <span className="text-lg font-medium text-slate-700">Preparación para la Entrevista</span>
                            </div>
                        </div>

                        <p className="text-xl md:text-2xl text-slate-600 font-medium block leading-relaxed max-w-xl mb-8">
                            Nos encargamos de tu visa para que tú solo te enfoques en <strong className="text-abyss">viajar.</strong>
                        </p>


                    </motion.div>

                    {/* Right Column: Video/Image Replacement */}
                    <FadeIn delay={0.2} className="relative rounded-3xl overflow-hidden w-full md:w-[480px] h-[620px] mt-0 mx-auto md:mr-0 group shadow-2xl">
                        <img
                            src="/assets/generated/visa_preparation_success.png"
                            alt="Preparación exitosa de visa"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-abyss/20 via-transparent to-transparent pointer-events-none" />
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
