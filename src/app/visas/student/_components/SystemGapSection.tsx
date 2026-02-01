"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { AlertTriangle, FileWarning, XCircle } from "lucide-react";

export default function SystemGapSection() {
    return (
        <section className="relative z-30 pb-20 px-6 bg-cloud">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-center mt-24 max-w-6xl mx-auto">

                    {/* Left Column: Text (Student Focused) */}
                    <motion.div
                        className="text-left space-y-8 pointer-events-none relative z-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >

                        <h2 className="text-3xl md:text-5xl text-abyss font-bold font-playfair block leading-[1.2] tracking-tight drop-shadow-sm mb-8">
                            Ser admitido en la universidad <span className="text-primary">es solo el 50%</span> del camino.
                        </h2>

                        {/* Inter-phrase Obstacles - Vertical Pill Stack */}
                        <div className="flex flex-col gap-4 mb-8 pr-2 w-full max-w-lg mx-auto">
                            {/* 1. I-20 */}
                            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group w-full">
                                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                    <FileWarning size={20} />
                                </div>
                                <span className="text-lg font-medium text-slate-700">Errores en Formulario I-20</span>
                            </div>

                            {/* 2. Immigrant Intent */}
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group w-full">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
                                    <AlertTriangle size={20} />
                                </div>
                                <span className="text-lg font-medium text-slate-700">Intención Migratoria (Lazos)</span>
                            </div>

                            {/* 3. Rejection */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group w-full">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:scale-110 transition-transform">
                                    <XCircle size={20} />
                                </div>
                                <span className="text-lg font-medium text-slate-700">Rechazo = Beca Perdida</span>
                            </div>
                        </div>

                        <p className="text-xl md:text-2xl text-slate-600 font-medium block leading-relaxed max-w-xl">
                            El oficial no evalúa tu talento académico, evalúa tu <strong className="text-abyss">riesgo migratorio.</strong>
                        </p>
                    </motion.div>

                    {/* Right Column: Image */}
                    <FadeIn delay={0.2} className="relative rounded-3xl overflow-hidden w-full md:w-[480px] h-[620px] mt-0 mx-auto md:mr-0 group">
                        {/* Using a placeholder or existing student image */}
                        <img
                            src="/assets/generated/student_stress.png"
                            alt="Estudiante preocupado"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                                // Fallback if image doesn't exist yet
                                e.currentTarget.src = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1000&auto=format&fit=crop";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-abyss/20 via-transparent to-transparent pointer-events-none" />
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
