"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./Animations";

const HERO_VIDEOS = [
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F38.mp4?alt=media&token=46ff6d7a-0e96-4afe-b0c5-64859fe5c24f",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F39.mp4?alt=media&token=34116134-df7c-4cc3-bc78-1e8a2e92baef",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F40.mp4?alt=media&token=e73efa42-2fdb-48a8-b13f-5751588b0f78",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F41.mp4?alt=media&token=5b6e7f9b-bef2-4cf6-aebd-800612b8b65c",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F42.mp4?alt=media&token=d102b55c-ba91-47ff-ac85-575af5dc72cb",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F43.mp4?alt=media&token=8cf05a07-b122-49f3-ab7e-ecedf5a9fdbd",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F44.mp4?alt=media&token=c807159d-1d85-47d6-8dff-75d1ed55679f",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F45.mp4?alt=media&token=c9a4c69b-61ff-4778-b01e-ce7365430dbf",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F46.mp4?alt=media&token=8eb12f95-7421-48fc-b19e-6bd37bee1d78",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F47.mp4?alt=media&token=830ef897-3931-4efe-a8b2-145f1bd7d717",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F48.mp4?alt=media&token=0e04282b-bb26-4a5f-868d-dc9e38cc73fd",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F49.mp4?alt=media&token=9889a8e1-35a5-4b6b-91e9-e0075cd67112",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F50.mp4?alt=media&token=e1f378f1-9805-4fa9-873e-e8771cb15c57",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F51.mp4?alt=media&token=23d951f3-11f9-4436-8596-9f56713e5d95"
];

export default function HeroSection() {
    const [videoSrc, setVideoSrc] = useState<string>("");

    useEffect(() => {
        // Hydration mismatch avoidance: pick random video only on client
        const randomVideo = HERO_VIDEOS[Math.floor(Math.random() * HERO_VIDEOS.length)];
        setVideoSrc(randomVideo);
    }, []);

    return (
        <div className="w-full bg-black relative h-screen overflow-hidden group">

            {/* Background Random Video */}
            <div className="absolute inset-0 w-full h-full">
                {videoSrc && (
                    <video
                        key={videoSrc} // Force re-render on source change if needed
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                )}
                {/* Fallback overlay color while loading or if fails */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Overlay Content (Static) */}
            <div className="absolute inset-0 flex flex-col justify-end items-start z-20 text-left px-6 pb-20 md:pl-[7rem] md:pb-20 pointer-events-none">

                <FadeIn>
                    <p className="text-cloud/90 text-lg md:text-xl font-medium tracking-widest uppercase mb-2 drop-shadow-md">
                        DOMINA EL INGLÉS EN ESTADOS UNIDOS
                    </p>
                </FadeIn>

                {/* H1: The Big Promise */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white text-4xl md:text-6xl lg:text-7xl font-bold font-sans drop-shadow-xl tracking-tighter mb-4"
                >
                    Visa de Estudiante F-1
                </motion.h1>

                {/* H2: The How/Credibility */}
                <FadeIn delay={0.4}>
                    <p className="text-cloud/80 text-sm md:text-xl max-w-3xl mb-8 drop-shadow-md leading-relaxed">
                        Aprende inglés en las mejores instituciones del país
                    </p>
                </FadeIn>

            </div>

            {/* Bottom Right CTA Button - Fixed */}
            <div className="fixed bottom-40 right-36 z-50 pointer-events-auto">
                <FadeIn delay={0.8}>
                    <Button
                        size="lg"
                        className="bg-white hover:bg-slate-100 text-abyss text-xl px-12 py-5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.7)] transition-all hover:scale-105 font-bold"
                        onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Solicitar ahora
                    </Button>
                </FadeIn>
            </div>

        </div>
    );
}
