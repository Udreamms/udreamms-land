"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { FileCheck, CalendarClock, MessageSquare } from "lucide-react";

export default function BenefitsSection() {
    return (
        <section className="relative z-30 pt-0 pb-16 px-6 bg-cloud text-center">
            <div className="container mx-auto">
                <FadeIn className="text-center max-w-4xl mx-auto">
                    {/* Phrase */}
                    <h3 className="text-3xl md:text-5xl font-bold text-abyss font-playfair leading-tight">
                        Vive unas vacaciones inolvidables <br />
                        <span className="text-slate-500">en Estados Unidos.</span>
                    </h3>
                </FadeIn>
            </div>
        </section>
    );
}
