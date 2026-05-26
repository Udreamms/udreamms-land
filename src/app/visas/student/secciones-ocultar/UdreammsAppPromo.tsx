"use client";

import { Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export default function UdreammsAppPromo() {
    return (
        <section className="py-40 bg-[#D31245] relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
            <div className="max-w-5xl mx-auto flex flex-col items-center">

                {/* Main Heading with Integrated Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center mb-6"
                >
                    <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-medium text-white leading-[1.1] tracking-[-0.04em] flex flex-wrap items-center justify-center gap-x-6">
                        <span>Descarga</span>
                        <span className="inline-block w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden shadow-lg translate-y-2 hover:scale-105 transition-transform duration-500 shrink-0">
                            <img
                                src="/icons/new-icon-udreamms.png"
                                alt="App Icon"
                                className="w-full h-full object-cover"
                            />
                        </span>
                        <span>Udreamms</span>
                    </h2>
                    <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-medium text-white leading-[1.1] tracking-[-0.04em]">
                        para comenzar
                    </h2>
                </motion.div>

                {/* Subtitle / Trusted By */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-white/60 text-lg md:text-xl font-medium mt-4 mb-12"
                >
                    Utilizada por cientos de estudiantes en Estados Unidos
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                >
                    <a
                        href="#"
                        className="flex items-center gap-3 bg-white text-[#D31245] px-10 py-5 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-300 shadow-xl shadow-black/10"
                    >
                        <Smartphone className="w-5 h-5" />
                        Descargar Udreamms App
                    </a>
                    <span className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg border border-white/20 select-none animate-pulse">
                        Próximamente
                    </span>
                </motion.div>
            </div>

            {/* Subtle Background Pattern (Optional for depth) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="grid grid-cols-12 h-full">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="border-r border-white h-full" />
                    ))}
                </div>
            </div>
        </section>
    );
}
