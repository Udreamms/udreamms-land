"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ value }: { value: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [displayValue, setDisplayValue] = useState("0");
    
    useEffect(() => {
        if (!isInView) return;
        
        const match = value.match(/^(\d+)(.*)$/);
        if (!match) {
            setDisplayValue(value);
            return;
        }
        
        const targetNumber = parseInt(match[1], 10);
        const suffix = match[2];
        
        let startTimestamp: number;
        const duration = 2000;
        
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeOut * targetNumber);
            
            setDisplayValue(current + suffix);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setDisplayValue(value);
            }
        };
        
        requestAnimationFrame(step);
    }, [isInView, value]);

    return <span ref={ref}>{displayValue}</span>;
}

const stats = [
    { value: "98%", label: "Aprobación Visa Americana" },
    { value: "500+", label: "Visas de Turismo B1/B2" },
    { value: "15k", label: "Citas Consulares" },
    { value: "24/7", label: "Asesoría Migratoria" }
];

export default function StatsSection() {
    return (
        <section className="bg-black py-24 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center gap-y-10">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center px-8 md:px-0 w-1/2 md:w-1/4"
                        >
                            <span className="text-4xl md:text-5xl font-medium tracking-tighter text-white mb-1">
                                <AnimatedCounter value={stat.value} />
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
