"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { FileCheck, CalendarClock, MessageSquare } from "lucide-react";

export default function BenefitsSection() {
    return (
        <section className="relative z-30 py-24 md:py-32 px-6 bg-transparent text-center">
            <div className="container mx-auto">
                <FadeIn className="text-center max-w-4xl mx-auto">
                    {/* Phrase */}
                    <h3 className="text-3xl md:text-5xl font-medium text-white font-sans tracking-tight leading-[1.1]">
                        Vive unas vacaciones inolvidables <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]">en Estados Unidos.</span>
                    </h3>
                </FadeIn>
            </div>
        </section>
    );
}
