"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { GraduationCap, ShieldCheck, BrainCircuit } from "lucide-react";

export default function BenefitsSection() {
    return (
        <section className="relative z-30 pb-20 px-6 bg-cloud">
            <div className="container mx-auto">
                <FadeIn className="mt-2 text-center space-y-12 max-w-4xl mx-auto">
                    {/* Phrase */}
                    <h3 className="text-3xl md:text-5xl font-bold text-abyss font-playfair leading-tight">
                        Tu admisión académica está lista.<br />
                        <span className="text-slate-500">Ahora blindemos tu entrada legal.</span>
                    </h3>

                    {/* 3 Minimalist Points with Floating Icons (Student specific) */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                        {[
                            { label: "Admisión Universitaria Estratégica", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
                            { label: "Auditoría I-20 Blindada", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50" },
                            { label: "Narrativa de Retorno (Lazos)", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-50" }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="flex flex-col items-center gap-4 group">
                                    <motion.div
                                        className={`w-20 h-20 ${item.bg} rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100/50 border border-white/50 cursor-pointer`}
                                        animate={{ y: [0, -12, 0] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.5
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <Icon className={`w-10 h-10 ${item.color}`} strokeWidth={1.5} />
                                    </motion.div>
                                    <span className="text-lg text-slate-700 font-medium max-w-[160px] leading-tight">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
