"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";

const destinations = [
    {
        id: "nyc",
        title: "New York City",
        location: "La Gran Manzana",
        description: "Visita la Estatua de la Libertad, pasea por Central Park y vive la magia de Times Square en la ciudad que nunca duerme.",
        videoId: "DVwX0u534gw",
        thumbnail: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "orlando",
        title: "Orlando, Florida",
        location: "Capital de la Diversión",
        description: "El hogar de Walt Disney World y Universal Studios. El destino perfecto para la aventura familiar definitiva.",
        videoId: "DVwX0u534gw",
        thumbnail: "https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "miami",
        title: "Miami, Florida",
        location: "La Puerta de las Américas",
        description: "Disfruta de las playas cristalinas de South Beach, el sabor de Little Havana y el lujo de Brickell.",
        videoId: "DVwX0u534gw",
        thumbnail: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "vegas",
        title: "Las Vegas, Nevada",
        location: "Luces y Espectáculos",
        description: "Experimenta la vibrante energía del Strip, los espectáculos de clase mundial y la arquitectura icónica en el desierto.",
        videoId: "DVwX0u534gw",
        thumbnail: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "la",
        title: "Los Angeles, California",
        location: "Cuna del Entretenimiento",
        description: "Descubre Hollywood, relájate en las playas de Santa Mónica y disfruta del estilo de vida icónico de la costa oeste.",
        videoId: "DVwX0u534gw",
        thumbnail: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "sf",
        title: "San Francisco, California",
        location: "La Ciudad de la Bahía",
        description: "Cruza el Golden Gate, explora Alcatraz y disfruta de la gastronomía única del Pier 39.",
        videoId: "DVwX0u534gw",
        thumbnail: "https://images.unsplash.com/photo-1501594907352-04cda386c24b?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "chicago",
        title: "Chicago, Illinois",
        location: "La Ciudad de los Vientos",
        description: "Admira la arquitectura frente al lago, visita el Millennium Park y prueba la famosa pizza deep-dish.",
        videoId: "DVwX0u534gw",
        thumbnail: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "dc",
        title: "Washington D.C.",
        location: "El Corazón de la Nación",
        description: "Recorre la historia en el National Mall, visita el Capitolio y los museos más importantes del mundo.",
        videoId: "DVwX0u534gw",
        thumbnail: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?q=80&w=200&h=150&auto=format&fit=crop"
    },
];

export default function DestinationsShowcase() {
    const [activeDest, setActiveDest] = useState(destinations[0]);
    const [isMuted, setIsMuted] = useState(true);

    const getEmbedUrl = (videoId: string) => {
        let params = `autoplay=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&controls=0`;
        params += isMuted ? `&mute=1` : `&mute=0`;
        return `https://www.youtube.com/embed/${videoId}?${params}`;
    };

    return (
        <section className="py-24 bg-white text-black overflow-hidden border-t border-gray-100">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="flex justify-between items-end mb-16">
                    <div className="max-w-2xl">
                        <span className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block">
                            Tu Destino Soñado
                        </span>
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.1]">
                            Explora lo Mejor de USA<br />
                            <span className="text-gray-400">Tu Ruta Personalizada.</span>
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Left Column: Interactive List - Scrollable */}
                    <div className="w-full lg:w-[40%] flex flex-col relative h-[600px]">
                        <div className="overflow-y-auto h-full pr-4 space-y-4 no-scrollbar scroll-smooth relative">
                            {destinations.map((dest) => {
                                const isActive = activeDest.id === dest.id;

                                return (
                                    <motion.div
                                        layout
                                        key={dest.id}
                                        onClick={() => setActiveDest(dest)}
                                        className={`group cursor-pointer flex items-center justify-between p-4 rounded-3xl transition-all duration-500 border-2 ${isActive
                                            ? "bg-black text-white border-black scale-[1.02]"
                                            : "bg-white text-black border-transparent hover:border-gray-50 flex-shrink-0"
                                            }`}
                                    >
                                        <div className="flex-1 pr-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin size={14} className={isActive ? "text-gray-300" : "text-gray-400"} />
                                                <span className={`text-[10px] uppercase tracking-widest font-medium ${isActive ? "text-gray-300" : "text-gray-400"}`}>
                                                    {dest.location}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-medium mb-1 tracking-tight">
                                                {dest.title}
                                            </h4>
                                            <p className={`text-sm leading-relaxed line-clamp-2 ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                                                {dest.description}
                                            </p>
                                        </div>

                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={dest.thumbnail}
                                                alt={dest.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive ? "opacity-100 bg-black/20" : "opacity-0 group-hover:opacity-100 bg-black/40"}`}>
                                                <Play size={18} className="text-white fill-white" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Large Dynamic Video */}
                    <div className="w-full lg:w-[60%] lg:sticky lg:top-24">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDest.id}
                                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 1.02, x: -20 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-8 border-white bg-slate-100 group cursor-pointer"
                            >
                                <iframe
                                    key={`${activeDest.id}-${isMuted}`}
                                    src={getEmbedUrl(activeDest.videoId)}
                                    className="absolute inset-0 w-full h-full border-0 grayscale-[0.2] hover:grayscale-0 transition-all duration-700 pointer-events-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />

                                {/* Overlay for Sound Toggle */}
                                <div
                                    className="absolute inset-0 z-20 cursor-pointer"
                                    onClick={() => setIsMuted(!isMuted)}
                                />

                                {/* Sound Button */}
                                <div className="absolute bottom-10 right-10 z-30 pointer-events-none">
                                    <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all transform group-hover:scale-110">
                                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                    </div>
                                </div>

                                {/* Overlay Label */}
                                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-100 shadow-xl max-w-[80%] z-30">
                                    <h5 className="text-lg font-medium text-black mb-1">{activeDest.title}</h5>
                                    <p className="text-xs text-gray-500 font-medium leading-tight">Vive la experiencia real con Udreamms.</p>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Interactive Hint */}
                        <div className="mt-8 flex items-center justify-end gap-2 text-gray-400">
                            <span className="text-xs font-medium uppercase tracking-widest italic">Haz clic en la lista para cambiar el destino o en el video para el sonido</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>

                </div>
            </div>
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
