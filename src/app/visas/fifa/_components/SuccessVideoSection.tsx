"use client";

import { useState } from "react";
import { FadeIn } from "./Animations";
import { Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SuccessVideoSection() {
    const [isMuted, setIsMuted] = useState(true);

    // YouTube embed URL logic
    // autoplay=1: Starts automatically
    // mute=1: Start muted (required for autoplay in most browsers)
    // controls=0: Hide YouTube controls so we can use our custom mute button overlays (optional, but cleaner)
    // loop=1 & playlist: Video loops
    const videoSrc = `https://www.youtube.com/embed/u7ReSqyFW3Y?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=u7ReSqyFW3Y&modestbranding=1&rel=0`;

    return (
        <div className="w-full py-12">
            <FadeIn className="max-w-[calc(100%-40px)] md:max-w-6xl mx-auto relative overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-neutral-100">
                <div className="aspect-video w-full relative">

                    {/* Video Player */}
                    <iframe
                        className="absolute top-0 left-0 w-full h-full pointer-events-none" // pointer-events-none prevents clicking the YT video directly, ensuring users use our overlay controls if we had more. For just mute, it's fine.
                        src={videoSrc}
                        title="FIFA World Cup 2026 Promo"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                    {/* Text Content Overlay (Always Visible) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none z-10">
                        <h3 className="text-4xl md:text-6xl lg:text-7xl font-sans tracking-tighter text-white mb-4 italic uppercase drop-shadow-2xl">
                            Vive la Pasión <span className="text-yellow-500">En Vivo</span>
                        </h3>
                        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light tracking-wide drop-shadow-lg">
                            Siente el rugido del estadio. Nosotros nos encargamos del papeleo.
                        </p>
                    </div>

                    {/* Sound Control Button (Interactive) */}
                    <motion.button
                        onClick={() => setIsMuted(!isMuted)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-8 right-8 z-20 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg"
                    >
                        <AnimatePresence mode="wait">
                            {isMuted ? (
                                <motion.div
                                    key="muted"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <VolumeX size={24} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="unmuted"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <Volume2 size={24} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </FadeIn>
        </div>
    );
}
