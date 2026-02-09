"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "98%", label: "Aprobación Visa Americana" },
    { value: "500+", label: "Visas de Turismo B1/B2" },
    { value: "15k", label: "Citas Consulares" },
    { value: "24/7", label: "Asesoría Migratoria" }
];

export default function StatsBar() {
    return (
        <section className="bg-white py-14 border-y border-gray-100 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center gap-y-10">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`flex flex-col items-center text-center px-8 md:px-0 w-1/2 md:w-1/4 ${index !== 0 ? "md:border-l border-gray-100" : ""}`}
                        >
                            <span className="text-4xl md:text-5xl font-medium tracking-tighter text-black mb-1">
                                {stat.value}
                            </span>
                            <span className="text-[10px] md:text-[11px] text-slate-400 uppercase tracking-[0.15em] font-bold leading-tight max-w-[120px] md:max-w-none">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
