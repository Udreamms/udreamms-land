"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./Animations";
import { Clock } from "lucide-react";

const HERO_VIDEOS = [
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F52.mp4?alt=media&token=dee4fc38-2e24-471c-8a1f-574b9f42a1e6",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F53.mp4?alt=media&token=6ca8a678-6377-45b8-90ce-8395275982c4",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F54.mp4?alt=media&token=ec3b50b4-3a49-4933-8adb-c682db2e2f6c",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F55.mp4?alt=media&token=9f1052ba-74c2-4559-99c6-a0e08ab39063",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F56.mp4?alt=media&token=8fb328b1-3204-4e02-a878-afcf2a935ea5",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F57.mp4?alt=media&token=976dab96-8382-48a5-9ad5-9781a7826f42",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F58.mp4?alt=media&token=8269d7b0-cd7b-4aab-8dac-4f18f1486e2e",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F59.mp4?alt=media&token=0be25504-0c77-4279-a4cb-32b8eb2636c0"
];

export default function HeroSection() {
    // FIFA Specific Logic (Countdown) logic retained
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
    const [videoSrc, setVideoSrc] = useState<string>("");

    useEffect(() => {
        // Random video selection
        const randomVideo = HERO_VIDEOS[Math.floor(Math.random() * HERO_VIDEOS.length)];
        setVideoSrc(randomVideo);

        // Countdown Logic
        const targetDate = new Date("2026-06-11T00:00:00").getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft({ days, hours, minutes });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-black relative h-screen overflow-hidden group">

            {/* Background Random Video */}
            <div className="absolute inset-0 w-full h-full">
                {videoSrc && (
                    <video
                        key={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                )}
                {/* Fallback overlay color */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Overlay Content (Static) - Adapted to Tourist Layout (Bottom Left) */}
            <div className="absolute inset-0 flex flex-col justify-end items-start z-20 text-left px-6 pb-20 md:pl-[7rem] md:pb-20 pointer-events-none">

                {/* Pre-title / Badge */}
                <FadeIn>
                    <div className="flex items-center gap-2 mb-4 text-yellow-400/90 font-medium tracking-widest uppercase text-sm md:text-base drop-shadow-md">
                        <Clock className="w-4 h-4" />
                        <span>EL RELOJ YA EMPEZÓ A CORRER: {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M</span>
                    </div>
                </FadeIn>

                {/* Content Group */}
                <div className="mb-8 drop-shadow-md">
                    {/* Top Phrase (Smaller, matching the bottom phrase size roughly) */}
                    <FadeIn>
                        <p className="text-cloud/90 text-lg md:text-xl font-medium tracking-wide mb-2">
                            Asegura tu lugar en la HISTORIA 2026
                        </p>
                    </FadeIn>

                    {/* Middle Title (Large, "Visa FIFA PAS") */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white text-5xl md:text-7xl lg:text-8xl font-medium font-sans tracking-tighter my-4 leading-[0.9]"
                    >
                        Visa FIFA PASS
                    </motion.h1>

                    {/* Bottom Phrase (Existing) */}
                    <FadeIn delay={0.4}>
                        <p className="text-cloud/80 text-lg md:text-xl max-w-lg leading-relaxed">
                            Visa + Logística Deportiva. Rastreo de citas prioritarias para el Mundial en USA, México y Canadá.
                        </p>
                    </FadeIn>
                </div>

            </div>

            {/* Bottom Right CTA Button - Fixed */}
            <div className="fixed bottom-40 right-36 z-50 pointer-events-auto">
                <FadeIn delay={0.8}>
                    <Button
                        size="lg"
                        className="bg-white hover:bg-slate-100 text-slate-900 text-xl px-12 py-5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.7)] transition-all hover:scale-105 font-medium"
                        onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Solicitar ahora
                    </Button>
                </FadeIn>
            </div>

        </div>
    );
}
