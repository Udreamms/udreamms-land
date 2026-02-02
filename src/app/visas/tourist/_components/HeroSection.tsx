"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./Animations";

const HERO_VIDEOS = [
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F20.mp4?alt=media&token=ba0c3197-3ef0-43bd-a46a-0a841ca6a04a",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F21.mp4?alt=media&token=3bfb665b-bef2-4ddc-a692-a1c8662d9c4f",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F22.mp4?alt=media&token=a4b320b2-2a8e-4acb-8898-7bdad562cefa",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F23.mp4?alt=media&token=d1ae89c2-73a2-483f-a9a2-f5da5362c424",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F24.mp4?alt=media&token=3cf7bf09-4f9b-4bdd-bbc2-34909e0a8308",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F25.mp4?alt=media&token=bc32055e-898d-4bc3-a373-85e5117672a3",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F26.mp4?alt=media&token=9edd3d3b-7d95-483f-b246-60b71fc02af0",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F27.mp4?alt=media&token=23f9017e-15a7-4bff-91d6-d028a7c16924",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F28.mp4?alt=media&token=7ff6289e-3870-4379-81e0-a1e66e14b50a",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F29.mp4?alt=media&token=c82af0b0-8061-432d-b6fb-2361329ba2bd",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F30.mp4?alt=media&token=1bf191b8-484c-42b2-8dfa-535c31f71c47",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F31.mp4?alt=media&token=1a066efa-8c92-4f04-9f75-dd8c3df820e7",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F32.mp4?alt=media&token=e5c96470-d36d-4877-9305-5ea8425b933f",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F33.mp4?alt=media&token=cb35e854-dbf9-4f40-a449-471a15cd4eb8",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F34.mp4?alt=media&token=d1e84fdf-8545-4230-b886-f4f39286223c",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F35.mp4?alt=media&token=d1e4c2b4-5f31-4e7d-8c5a-c3a9c4817359",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F36.mp4?alt=media&token=636a495c-e489-4953-a250-54089df8f1bf",
    "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F37.mp4?alt=media&token=2b3c6db8-5b74-4770-a4b1-94a2c924fdae"
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
                        key={videoSrc} // Force re-render on source change if needed, though mostly 1 per session
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
            <div className="absolute inset-0 flex flex-col justify-end pb-32 items-start z-20 text-left px-6 md:pl-[7rem] pointer-events-none">
                {/* Badge/Eyebrow */}
                <FadeIn delay={0.1}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-400/30 text-white font-bold text-xs uppercase tracking-widest mb-6 pointer-events-auto">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        Gestionamos tu proceso migratorio y tus vacaciones soñadas
                    </div>
                </FadeIn>

                {/* H1: The Big Promise */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white text-4xl md:text-7xl lg:text-8xl font-black font-sans drop-shadow-xl tracking-tighter mb-6 leading-tight"
                >
                    Explora USA <br />
                    <span className="text-blue-500">con total confianza.</span>
                </motion.h1>

                {/* H2: The How/Credibility */}
                <FadeIn delay={0.4}>
                    <p className="text-cloud/90 text-lg md:text-2xl max-w-2xl mb-10 drop-shadow-md leading-relaxed font-medium">
                        Gestionamos tu visa de turista y planificamos tu viaje a Estados Unidos.
                    </p>
                </FadeIn>

                <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-8 rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 font-black uppercase tracking-tight group"
                    onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    Ver Planes
                    <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="ml-3"
                    >
                        →
                    </motion.span>
                </Button>
            </div>


        </div>
    );
}
