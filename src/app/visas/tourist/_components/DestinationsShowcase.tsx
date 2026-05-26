"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";

const destinations = [
    {
        id: "nyc",
        title: "New York City",
        location: "La Gran Manzana",
        description: "Visita la Estatua de la Libertad, pasea por Central Park y vive la magia de Times Square en la ciudad que nunca duerme.",
        videoId: "TrWV7bq3FoY",
        thumbnail: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "orlando",
        title: "Orlando, Florida",
        location: "Capital de la Diversión",
        description: "El hogar de Walt Disney World y Universal Studios. El destino perfecto para la aventura familiar definitiva.",
        videoId: "G2MxoXw1Djo",
        thumbnail: "https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "miami",
        title: "Miami, Florida",
        location: "La Puerta de las Américas",
        description: "Disfruta de las playas cristalinas de South Beach, el sabor de Little Havana y el lujo de Brickell.",
        videoId: "qrm0y1ehBdQ",
        thumbnail: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "vegas",
        title: "Las Vegas, Nevada",
        location: "Luces y Espectáculos",
        description: "Experimenta la vibrante energía del Strip, los espectáculos de clase mundial y la arquitectura icónica en el desierto.",
        videoId: "_3Wqwc0hRak",
        thumbnail: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "la",
        title: "Los Angeles, California",
        location: "Cuna del Entretenimiento",
        description: "Descubre Hollywood, relájate en las playas de Santa Mónica y disfruta del estilo de vida icónico de la costa oeste.",
        videoId: "dyBKJuQ6NW0",
        thumbnail: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "sf",
        title: "San Francisco, California",
        location: "La Ciudad de la Bahía",
        description: "Cruza el Golden Gate, explora Alcatraz y disfruta de la gastronomía única del Pier 39.",
        videoId: "k6rG1vQO268",
        thumbnail: "https://images.unsplash.com/photo-1501594907352-04cda386c24b?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "chicago",
        title: "Chicago, Illinois",
        location: "La Ciudad de los Vientos",
        description: "Admira la arquitectura frente al lago, visita el Millennium Park y prueba la famosa pizza deep-dish.",
        videoId: "IZPMlfgx0hc",
        thumbnail: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=200&h=150&auto=format&fit=crop"
    },
    {
        id: "dc",
        title: "Washington D.C.",
        location: "El Corazón de la Nación",
        description: "Recorre la historia en el National Mall, visita el Capitolio y los museos más importantes del mundo.",
        videoId: "07DvPTHNA1c",
        thumbnail: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?q=80&w=200&h=150&auto=format&fit=crop"
    },
];

export default function DestinationsShowcase() {
    const [activeDest, setActiveDest] = useState(destinations[0]);
    const [isMuted, setIsMuted] = useState(true);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const toggleMute = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: nextMute ? 'mute' : 'unMute', args: [] }),
                '*'
            );
        }
    };

    const getEmbedUrl = (videoId: string) => {
        let params = `autoplay=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&controls=0&mute=1&enablejsapi=1`;
        return `https://www.youtube.com/embed/${videoId}?${params}`;
    };

    return (
        <section className="py-24 bg-[#050507] text-white overflow-hidden border-t border-white/10">
            <div className="container mx-auto px-6">

                <div className="flex justify-between items-end mb-16">
                    <div className="max-w-2xl">
                        <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 mb-4 block">
                            Tu Destino Soñado
                        </span>
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.1] text-white">
                            Explora lo Mejor de USA<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Tu Ruta Personalizada</span>
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
                                        className={`group cursor-pointer flex items-center justify-between p-4 rounded-3xl transition-all duration-500 border border-transparent ${isActive
                                            ? "bg-white/10 text-white border-white/20 scale-[1.02]"
                                            : "bg-transparent text-slate-300 hover:bg-white/5 flex-shrink-0"
                                            }`}
                                    >
                                        <div className="flex-1 pr-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin size={14} className={isActive ? "text-blue-400" : "text-slate-500"} />
                                                <span className={`text-[10px] uppercase tracking-widest font-medium ${isActive ? "text-blue-400" : "text-slate-500"}`}>
                                                    {dest.location}
                                                </span>
                                            </div>
                                            <h4 className={`text-xl font-medium mb-1 tracking-tight ${isActive ? "text-white" : "text-slate-200"}`}>
                                                {dest.title}
                                            </h4>
                                            <p className={`text-sm leading-relaxed line-clamp-2 ${isActive ? "text-slate-300" : "text-slate-500"}`}>
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
                                className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-black group cursor-pointer"
                            >
                                <iframe
                                    ref={iframeRef}
                                    key={activeDest.id}
                                    onLoad={() => {
                                        if (!isMuted && iframeRef.current?.contentWindow) {
                                            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
                                        }
                                    }}
                                    src={getEmbedUrl(activeDest.videoId)}
                                    className="absolute inset-0 w-full h-full border-0 grayscale-[0.2] hover:grayscale-0 transition-all duration-700 pointer-events-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />

                                {/* Overlay for Sound Toggle */}
                                <div
                                    className="absolute inset-0 z-20 cursor-pointer"
                                    onClick={toggleMute}
                                />

                                {/* Sound Button */}
                                <div className="absolute bottom-10 right-10 z-30 pointer-events-none">
                                    <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all transform group-hover:scale-110">
                                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                    </div>
                                </div>

                                {/* Overlay Label */}
                                <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-xl max-w-[80%] z-30">
                                    <h5 className="text-lg font-medium text-white mb-1">{activeDest.title}</h5>
                                    <p className="text-xs text-slate-400 font-medium leading-tight">Vive la experiencia real con Udreamms.</p>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Interactive Hint */}
                        <div className="mt-8 flex items-center justify-end gap-2 text-slate-500">
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
