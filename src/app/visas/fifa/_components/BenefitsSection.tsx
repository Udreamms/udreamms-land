"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { Radar, Shield, Users } from "lucide-react";

export default function BenefitsSection() {
    return (
        <section className="relative z-30 pb-20 px-6 bg-white">
            <div className="container mx-auto">
                <FadeIn className="mt-2 text-center space-y-12 max-w-4xl mx-auto">
                    {/* Phrase */}
                    <h3 className="text-3xl md:text-5xl font-black italic text-slate-900 leading-tight">
                        No vendemos visas. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">Vendemos goles en vivo.</span>
                    </h3>

                    {/* 3 Minimalist Points with Floating Icons (FIFA specific) */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                        {[
                            { label: "Radar de Citas de Cancelación", icon: Radar, color: "text-yellow-600", bg: "bg-yellow-50" },
                            { label: "Logística Tri-Nacional", icon: Shield, color: "text-green-600", bg: "bg-green-50" },
                            { label: "Comunidad de Fanáticos", icon: Users, color: "text-blue-600", bg: "bg-blue-50" }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="flex flex-col items-center gap-4 group">
                                    <motion.div
                                        className={`w-24 h-24 ${item.bg} rounded-3xl flex items-center justify-center shadow-lg shadow-gray-200/50 border border-slate-100 cursor-pointer`}
                                        animate={{ y: [0, -12, 0] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.5
                                        }}
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                    >
                                        <Icon className={`w-10 h-10 ${item.color}`} strokeWidth={2} />
                                    </motion.div>
                                    <span className="text-lg text-slate-900 font-bold max-w-[160px] leading-tight">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
