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
                {/* Smooth fade to next section */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050507] to-transparent z-10" />
            </div>

            {/* Overlay Content (Static) */}
            <div className="absolute inset-0 flex items-end z-20 px-6 pb-20 md:px-[7rem] md:pb-20 pointer-events-none">
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 w-full">
                    
                    <div className="w-full md:max-w-[80%] lg:max-w-[70%] text-left">
                        <FadeIn>
                            <p className="text-white text-lg md:text-xl font-medium tracking-[0.2em] uppercase mb-4 drop-shadow-md opacity-80">
                                DOMINA EL INGLÉS EN ESTADOS UNIDOS
                            </p>
                        </FadeIn>

                        {/* H1: The Big Promise */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-white text-4xl md:text-6xl lg:text-7xl font-medium font-sans drop-shadow-xl tracking-tighter mb-4"
                        >
                            Visa de Estudiante F-1
                        </motion.h1>

                        {/* H2: The How/Credibility */}
                        <FadeIn delay={0.4}>
                            <p className="text-white text-sm md:text-xl max-w-3xl mb-8 drop-shadow-md leading-relaxed font-medium opacity-70">
                                Aprende inglés en las mejores instituciones del país
                            </p>
                        </FadeIn>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 shrink-0 mb-4 lg:mb-8">
                        <FadeIn delay={0.6}>
                            <a
                                href="https://wa.me/16507840581"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center justify-center px-8 py-3 gap-2 text-base font-medium text-white overflow-hidden rounded-full bg-transparent border border-white/40 hover:bg-blue-600 hover:border-blue-600 hover:scale-105 transition-all duration-300 shadow-lg pointer-events-auto"
                            >
                                Tengo algunas preguntas antes de empezar
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                </svg>
                            </a>
                        </FadeIn>
                    </div>
                </div>
            </div>



        </div>
    );
}
