"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./Animations";

const videoLinks = [
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F1.mp4?alt=media&token=cc87cead-407d-4e4f-a643-6152d31eff1a",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F2.mp4?alt=media&token=da7a9e8f-b6c0-417a-9da6-dc8acc7a803f",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F3.mp4?alt=media&token=6b93ebfb-bff7-4fdd-b7f1-3a6f031dc7cd",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F4.mp4?alt=media&token=d43f4e35-bc28-40e0-b7db-3871c7b02d6a",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F5.mp4?alt=media&token=86eaddf6-c81d-477f-89b5-a8b2231d48dd",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F6.mp4?alt=media&token=276e7bbf-68ba-4cea-9218-ca2a07264974",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F7.mp4?alt=media&token=2635fd2d-9f24-4c54-a131-89161e9c503f",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F8.mp4?alt=media&token=0ac07147-6951-4a47-9e7a-f9d62a5c4c73",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F9.mp4?alt=media&token=bc0245ae-674a-429c-9f42-9d10ac01afe5",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F10.mp4?alt=media&token=4b2d3aff-79e1-4329-8b40-dbc0e94d32f2",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F11.mp4?alt=media&token=0586a415-4b0c-43d6-ab11-43fe62be8219",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F12.mp4?alt=media&token=e270d359-9f26-431a-a225-9048b1c15623",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F13.mp4?alt=media&token=53ddafbb-a7b0-419b-8c03-4312fed79fbc",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F14.mp4?alt=media&token=5fae2483-07a7-488e-ae3c-eca50662e59e",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F15.mp4?alt=media&token=97ba5129-e641-43ec-904c-9d748026bc4b",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F16.mp4?alt=media&token=691ecdde-3fab-4ee8-9519-edab33191b70",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F17.mp4?alt=media&token=54d31a5f-740b-4dc4-88da-1c9211e33a50",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F18.mp4?alt=media&token=00edcb39-3840-45fd-843b-c2df200236f9",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F19.mp4?alt=media&token=2be2fb6a-994d-481a-b595-40ab95f9bd6e",
  "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F20.mp4?alt=media&token=16c8c2bf-d460-4d38-bea0-f6e78e797f88"
];

export default function HeroSection() {
    const [activeVideo, setActiveVideo] = useState<0 | 1>(0);
    const [index0, setIndex0] = useState(0);
    const [index1, setIndex1] = useState(1);

    const video0Ref = useRef<HTMLVideoElement>(null);
    const video1Ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (video0Ref.current) {
            video0Ref.current.play().catch(e => console.log("Autoplay prevent:", e));
        }
    }, []);

    const handleTimeUpdate = (videoNum: 0 | 1) => {
        const currentRef = videoNum === 0 ? video0Ref.current : video1Ref.current;
        if (!currentRef) return;

        const { currentTime, duration } = currentRef;
        
        if (duration > 0 && duration - currentTime <= 1) {
            if (videoNum === activeVideo) {
                const nextVideo = videoNum === 0 ? 1 : 0;
                const nextRef = nextVideo === 0 ? video0Ref.current : video1Ref.current;
                
                if (nextRef) {
                    nextRef.currentTime = 0;
                    nextRef.play().catch(e => console.log("Play error:", e));
                }
                
                setActiveVideo(nextVideo);
                
                setTimeout(() => {
                    if (videoNum === 0) {
                        setIndex0((index1 + 1) % videoLinks.length);
                    } else {
                        setIndex1((index0 + 1) % videoLinks.length);
                    }
                }, 1000);
            }
        }
    };

    const handleEnded = (videoNum: 0 | 1) => {
        if (videoNum === activeVideo) {
            const nextVideo = videoNum === 0 ? 1 : 0;
            const nextRef = nextVideo === 0 ? video0Ref.current : video1Ref.current;
            
            if (nextRef) {
                nextRef.play().catch(e => console.log("Play error:", e));
            }
            setActiveVideo(nextVideo);
            
            if (videoNum === 0) {
                setIndex0((index1 + 1) % videoLinks.length);
            } else {
                setIndex1((index0 + 1) % videoLinks.length);
            }
        }
    };

    return (
        <div className="w-full bg-black relative h-screen overflow-hidden group">

            {/* Background Random Video */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    ref={video0Ref}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        activeVideo === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    muted
                    playsInline
                    onTimeUpdate={() => handleTimeUpdate(0)}
                    onEnded={() => handleEnded(0)}
                    src={videoLinks[index0]}
                />

                <video
                    ref={video1Ref}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        activeVideo === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    muted
                    playsInline
                    onTimeUpdate={() => handleTimeUpdate(1)}
                    onEnded={() => handleEnded(1)}
                    src={videoLinks[index1]}
                />
                
                {/* Fallback overlay color while loading or if fails */}
                <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />
            </div>

            {/* Overlay Content (Static) */}
            <div className="absolute inset-0 flex flex-col justify-end pb-32 z-30 px-6 md:px-12 lg:px-[7rem] pointer-events-none">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 w-full">
                    <div className="text-left">
                        {/* Badge/Eyebrow */}
                        <FadeIn delay={0.1}>
                            <p className="text-white font-medium text-xs uppercase tracking-widest mb-4">
                                Gestionamos tu proceso migratorio y tus vacaciones soñadas
                            </p>
                        </FadeIn>

                        {/* H1: The Big Promise */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-white text-2xl md:text-4xl lg:text-5xl font-medium font-sans drop-shadow-xl tracking-tighter mb-4 leading-[0.9]"
                        >
                            Explora USA <br />
                            <span className="text-white">con total confianza</span>
                        </motion.h1>

                        {/* H2: The How/Credibility */}
                        <FadeIn delay={0.4}>
                            <p className="text-white text-sm md:text-base max-w-2xl drop-shadow-md leading-relaxed font-medium">
                                Gestionamos tu visa de turista y planificamos tu viaje a Estados Unidos.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="pointer-events-auto shrink-0 mb-2">
                        <Button
                            className="bg-transparent border border-white/50 hover:bg-white/10 text-white text-sm px-6 py-3 h-auto rounded-full transition-all hover:scale-105 font-medium uppercase tracking-tight group backdrop-blur-sm"
                            onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Ver Planes
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="ml-2"
                            >
                                →
                            </motion.span>
                        </Button>
                    </div>
                </div>
            </div>


        </div>
    );
}
