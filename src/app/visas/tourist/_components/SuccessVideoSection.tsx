"use client";

import { Instagram, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const baseVideos = [
    "BMUmTjVBqxI",
    "4VLdkd8Slko",
    "YqSJmu3Au0k",
    "_YjuuYRG08c"
];

const touristVideos = [
    { id: 1, videoId: baseVideos[0], handle: "@udreamms", title: "Aventuras en USA 🇺🇸" },
    { id: 2, videoId: baseVideos[1], handle: "@udreamms", title: "Descubriendo nuevos lugares ✨" },
    { id: 3, videoId: baseVideos[2], handle: "@udreamms", title: "Vacaciones inolvidables 🌴" },
    { id: 4, videoId: baseVideos[3], handle: "@udreamms", title: "Viviendo el sueño 🗽" }
];

export default function SuccessVideoSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
    const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

    const getEmbedUrl = (videoId: string, isUnmuted: boolean) => {
        let params = `autoplay=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&controls=0`;
        params += isUnmuted ? `&mute=0` : `&mute=1`;
        return `https://www.youtube.com/embed/${videoId}?${params}`;
    };

    const toggleAudio = (id: number) => {
        setActiveVideoId(activeVideoId === id ? null : id);
    };

    return (
        <section className="py-24 md:py-32 bg-transparent overflow-hidden w-full">
            <div className="w-full max-w-[1600px] px-6 md:px-12 mx-auto">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-medium tracking-tight mb-4 text-white">
                        Historias de Éxito Reales
                    </h2>
                    <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed">
                        Descubre por qué cientos de turistas confían en nosotros para su viaje a USA.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center w-full">
                    <style jsx>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {touristVideos.map((story) => {
                        const isUnmuted = activeVideoId === story.id;
                        return (
                            <div
                                key={story.id}
                                onClick={() => toggleAudio(story.id)}
                                onMouseEnter={() => setHoveredCardId(story.id)}
                                onMouseLeave={() => setHoveredCardId(null)}
                                className="relative w-full max-w-[400px] aspect-[9/16] rounded-[2rem] overflow-hidden group cursor-pointer shadow-2xl transition-all duration-500 bg-black border border-white/10"
                            >
                                <div className="absolute inset-0 bg-black pointer-events-none">
                                    {hoveredCardId === story.id ? (
                                        <iframe
                                            key={`${story.id}-${isUnmuted ? 'sound' : 'muted'}`}
                                            src={getEmbedUrl(story.videoId, isUnmuted)}
                                            className="w-[300%] h-full -ml-[100%] object-cover pointer-events-none opacity-100 transition-opacity duration-500"
                                            title={`YouTube Short ${story.id}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            frameBorder="0"
                                        />
                                    ) : (
                                        <img
                                            src={`https://img.youtube.com/vi/${story.videoId}/hqdefault.jpg`}
                                            alt={story.title}
                                            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100 brightness-110 contrast-[1.15] saturate-[1.2]"
                                        />
                                    )}
                                    {/* HD Overlay Enhancements */}
                                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
                                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                                </div>

                                <div className="absolute top-6 right-6 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-black/80">
                                        {isUnmuted ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white/70" />}
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                                    <div className="flex items-center gap-2 mb-3">
                                        <img
                                            src="/icons/new-icon-udreamms.png"
                                            alt="Udreamms Logo"
                                            className="w-5 h-5 object-contain"
                                        />
                                        <span className="font-medium text-sm tracking-wide text-slate-200">{story.handle}</span>
                                    </div>
                                    <p className="font-medium text-lg leading-snug text-white">{story.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center mt-32">
                    <Button
                        className="rounded-full bg-transparent border border-white/40 hover:bg-white/10 text-white font-medium px-10 py-6 text-lg shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                        onClick={() => window.open('https://www.instagram.com/_udreamms/', '_blank')}
                    >
                        Ver más en Instagram
                        <Instagram className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
