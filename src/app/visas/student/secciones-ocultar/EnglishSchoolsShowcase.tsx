"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";

const schools = [
    {
        id: "miami",
        title: "OHLA Miami",
        location: "Miami, Florida",
        description: "Estudia inglés frente a las playas de South Beach. Un entorno vibrante con clima excepcional y una conexión cultural única para tu proceso académico.",
        videoId: "fXk63YvK_38",
        thumbnail: "https://www.ohla.com/wp-content/uploads/2021/05/ohla-logo.png"
    },
    {
        id: "nyc",
        title: "Kaplan New York",
        location: "New York City",
        description: "Sumérgete en la Gran Manzana. Aprende inglés rodeado de rascacielos, muceos de clase mundial y la energía imparable de Manhattan.",
        videoId: "M_865U8t6_Y",
        thumbnail: "https://logos-world.net/wp-content/uploads/2021/10/Kaplan-Logo.png"
    },
    {
        id: "la",
        title: "EC Los Angeles",
        location: "Los Angeles, California",
        description: "Aprende en la cuna del entretenimiento. Desde Hollywood hasta las playas de Santa Mónica, el estilo de vida de California impulsará tu aprendizaje.",
        videoId: "j7_L8hG_h9M",
        thumbnail: "https://www.ecenglish.com/static/images/logos/ec-logo.png"
    },
    {
        id: "boston",
        title: "EF Boston",
        location: "Boston, Massachusetts",
        description: "La capital de la educación en USA. Estudia inglés en una ciudad histórica llena de universidades de prestigio y un ambiente estudiantil inigualable.",
        videoId: "C9C3dUpS_XU",
        thumbnail: "https://www.ef.com.co/content/dam/efcom/res/images/logos/ef-logo-red.svg"
    },
    {
        id: "utah",
        title: "Lumos Language School",
        location: "Salt Lake City, Utah",
        description: "Experimenta la calidad académica en un entorno rodeado de montañas impresionante. Lumos ofrece una inmersión lingüística excepcional en el corazón de Utah.",
        videoId: "iHk9pT-l-3E",
        thumbnail: "https://lumos.edu/wp-content/uploads/2022/10/lumos-logo.png"
    },
    {
        id: "sf",
        title: "LSI San Francisco",
        location: "San Francisco, California",
        description: "Aprende inglés en la innovadora ciudad de la bahía. Descubre el Golden Gate y el Silicon Valley mientras perfeccionas tu comunicación global.",
        videoId: "C8vO46pE6vY",
        thumbnail: "https://www.lsi.edu/images/logo_lsi.png"
    },
    {
        id: "chicago",
        title: "ELS Chicago",
        location: "Chicago, Illinois",
        description: "Desarrolla tus habilidades en la 'Ciudad del Viento'. Un centro cultural y financiero ideal para estudiantes que buscan un entorno urbano dinámico.",
        videoId: "Y6vH57-l-h0",
        thumbnail: "https://www.els.edu/Content/Images/logo-els.png"
    }
];

export default function EnglishSchoolsShowcase() {
    const [activeSchool, setActiveSchool] = useState(schools[0]);
    const [isMuted, setIsMuted] = useState(true);

    const getEmbedUrl = (videoId: string) => {
        let params = `autoplay=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&controls=0`;
        params += isMuted ? `&mute=1` : `&mute=0`;
        return `https://www.youtube.com/embed/${videoId}?${params}`;
    };

    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="escuelas-ingles">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="flex justify-between items-end mb-16">
                    <div className="max-w-2xl">
                        <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400 mb-4 block">
                            Tu Futuro Académico
                        </span>
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.1] text-slate-950">
                            Escuelas de Inglés en<br />
                            <span className="text-slate-500">Estados Unidos</span>
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Left Column: Interactive List - More compact cards */}
                    <div className="w-full lg:w-[40%] h-[600px] overflow-y-auto hover-scrollbar pr-2 scroll-smooth">
                        <div className="space-y-4">
                            {schools.map((school, index) => {
                                const isActive = activeSchool.id === school.id;
                                const isBlack = index % 2 === 0;

                                return (
                                    <motion.div
                                        key={school.id}
                                        onClick={() => setActiveSchool(school)}
                                        className={`group cursor-pointer flex items-center justify-between p-5 rounded-[2rem] transition-all duration-500 border-2 ${isActive
                                            ? "bg-white text-slate-950 border-slate-950 scale-[1.01] shadow-xl"
                                            : "bg-white text-slate-900 border-slate-100 hover:border-slate-200 shadow-sm"
                                            }`}
                                    >
                                        <div className="flex-1 pr-4">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <MapPin size={12} className={isActive ? "text-slate-950" : "text-slate-400"} />
                                                <span className={`text-[9px] uppercase tracking-[0.15em] font-bold ${isActive ? "text-slate-950" : "text-slate-500"}`}>
                                                    {school.location}
                                                </span>
                                            </div>
                                            <h4 className={`text-lg font-bold mb-1.5 tracking-tight ${isActive ? "text-slate-950" : "text-slate-950"}`}>
                                                {school.title}
                                            </h4>
                                            <p className={`text-xs leading-relaxed line-clamp-2 font-medium transition-colors ${isActive ? "text-slate-600" : "text-slate-500"}`}>
                                                {school.description}
                                            </p>
                                        </div>

                                        {/* School Seal / Logo Thumbnail - More compact */}
                                        <div className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-md p-3.5 flex items-center justify-center border-2 ${isActive ? "bg-slate-50 border-slate-100" : "bg-white border-slate-50"}`}>
                                            <img
                                                src={school.thumbnail}
                                                alt={school.title}
                                                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive ? "opacity-100 bg-indigo-600/5" : "opacity-0 group-hover:opacity-100 bg-black/5"}`}>
                                                <Play size={16} className="text-black/10 fill-black/5" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Video Visual - Adjusted width to balance the layout */}
                    <div className="w-full lg:w-[60%] lg:sticky lg:top-32 mt-8 lg:mt-16">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSchool.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 border-4 border-white group cursor-pointer"
                            >
                                <iframe
                                    key={`${activeSchool.id}-${isMuted}`}
                                    src={getEmbedUrl(activeSchool.videoId)}
                                    className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />

                                {/* Overlay for Sound Toggle */}
                                <div
                                    className="absolute inset-0 z-20"
                                    onClick={() => setIsMuted(!isMuted)}
                                />

                                {/* Sound Button */}
                                <div className="absolute bottom-8 right-8 z-30 pointer-events-none">
                                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all transform group-hover:scale-110">
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </div>
                                </div>

                                {/* Label Overlay */}
                                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-100 shadow-2xl z-30 max-w-[80%]">
                                    <h5 className="text-lg font-bold text-slate-900 mb-0.5">{activeSchool.title}</h5>
                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Tu futuro campus te espera.</p>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Interactive Hint */}
                        <div className="mt-6 flex items-center justify-end gap-2 text-slate-300">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] italic">Intercambio real con Udreamms</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
