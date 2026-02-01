"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { FileCheck, CalendarClock, MessageSquare } from "lucide-react";

export default function BenefitsSection() {
    return (
        <section className="relative z-30 pb-20 px-6 bg-cloud">
            <div className="container mx-auto">
                <FadeIn className="mt-2 text-center space-y-12 max-w-4xl mx-auto">
                    {/* Phrase */}
                    <h3 className="text-3xl md:text-5xl font-bold text-abyss font-playfair leading-tight">
                        Sabemos que el sistema puede ser difuso.<br />
                        <span className="text-slate-500">Nosotros lo hacemos invisible.</span>
                    </h3>

                    {/* 3 Minimalist Points with Floating Icons */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                        {[
                            { label: "Sin errores en el formulario", icon: FileCheck, color: "text-green-500", bg: "bg-green-50" },
                            { label: "Citas en tiempo récord", icon: CalendarClock, color: "text-blue-500", bg: "bg-blue-50" },
                            { label: "Entrevistas sin nervios", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" }
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
                                            delay: index * 0.5 // Staggered floating effect
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
