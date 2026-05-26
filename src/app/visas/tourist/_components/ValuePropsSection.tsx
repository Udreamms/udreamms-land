"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import {
    FileCheck, MessageSquare, CalendarClock, Plane, AlertTriangle,
    CheckCircle2, Sparkles, Zap, Shield
} from "lucide-react";

export default function ValuePropsSection() {
    return (
        <div className="relative z-30 pt-32 pb-12 px-6 bg-transparent">
            <div className="container mx-auto">
                {/* 1. Sound Wave Icons Row (First - Centered) */}
                <FadeIn>
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-12">
                        {[
                            { icon: FileCheck },
                            { icon: MessageSquare },
                            { icon: CalendarClock },
                            { icon: Plane },
                            { icon: AlertTriangle },
                            { icon: CheckCircle2 },
                            { icon: Sparkles },
                            { icon: Zap },
                            { icon: Shield }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            // Sound Wave Effect:
                            const yRange = 45;

                            return (
                                <motion.div
                                    key={index}
                                    // Changed default color to text-black as requested
                                    className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center text-black cursor-pointer border border-slate-50"
                                    animate={{
                                        y: [0, -yRange, 0],
                                    }}
                                    transition={{
                                        duration: 2, // Faster, rhythmic duration
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.2 // Linear delay creates the "wave" propagation
                                    }}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                >
                                    <Icon strokeWidth={1.5} className="w-6 h-6 md:w-8 md:h-8" />
                                </motion.div>
                            );
                        })}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
