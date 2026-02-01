"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import {
    Trophy, Clock, Users, MapPin, Ticket, Plane,
    Shield, Zap, Radio
} from "lucide-react";

export default function ValuePropsSection() {
    return (
        <div className="relative z-30 pt-24 pb-20 px-6 bg-white translate-y-[-100px] rounded-t-[3rem]">
            <div className="container mx-auto">
                {/* Floating Icons adapted for FIFA */}
                <FadeIn>
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-0">
                        {[
                            { icon: Trophy },
                            { icon: Ticket },
                            { icon: Users },
                            { icon: MapPin },
                            { icon: Clock },
                            { icon: Plane },
                            { icon: Radio }, // Live broadcast metaphor
                            { icon: Shield },
                            { icon: Zap }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            const yRange = 45;

                            return (
                                <motion.div
                                    key={index}
                                    className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center text-slate-800 hover:text-orange-600 hover:bg-white cursor-pointer border border-slate-100"
                                    animate={{
                                        y: [0, -yRange, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.2
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
