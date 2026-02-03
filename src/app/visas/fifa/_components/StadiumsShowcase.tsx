"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const STADIUMS = [
    {
        id: "ny",
        title: "MetLife Stadium",
        location: "New York / New Jersey",
        description: "Sede de la Gran Final. Vive la magia de la costa este en el escenario más grande del mundo.",
        image: "https://images.unsplash.com/photo-1563222384-06654992523d?q=80&w=1000&auto=format&fit=crop",
        video: "https://www.youtube.com/embed/rJwVchePzEo?autoplay=1&mute=1&loop=1&playlist=rJwVchePzEo&controls=0&showinfo=0&rel=0&modestbranding=1",
    },
    {
        id: "la",
        title: "SoFi Stadium",
        location: "Los Angeles, California",
        description: "El estadio más moderno del mundo. Experimenta el lujo y el sol de California.",
        image: "https://images.unsplash.com/photo-1616428751842-835075c3db37?q=80&w=1000&auto=format&fit=crop",
        video: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F53.mp4?alt=media",
    },
    {
        id: "mia",
        title: "Hard Rock Stadium",
        location: "Miami, Florida",
        description: "Ambiente tropical, cultura vibrante y la pasión del fútbol en el sur de Florida.",
        image: "https://images.unsplash.com/photo-1628101662973-1f91910cf904?q=80&w=1000&auto=format&fit=crop",
        video: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F54.mp4?alt=media",
    },
    {
        id: "dal",
        title: "AT&T Stadium",
        location: "Dallas, Texas",
        description: "Una maravilla de la ingeniería. La escala monumental de Texas para el fútbol mundial.",
        image: "https://images.unsplash.com/photo-1621252119047-4952d7659556?q=80&w=1000&auto=format&fit=crop",
        video: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2F55.mp4?alt=media",
    },
    {
        id: "atl",
        title: "Mercedes-Benz Stadium",
        location: "Atlanta, Georgia",
        description: "Arquitectura vanguardista y un domo icónico para los momentos más emocionantes.",
        image: "https://images.unsplash.com/photo-1617486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop",
        video: "",
    },
    {
        id: "sf",
        title: "Levi's Stadium",
        location: "San Francisco Bay Area",
        description: "Sostenibilidad y tecnología en el corazón de Silicon Valley para el 2026.",
        image: "https://images.unsplash.com/photo-1549413204-c5b73652df49?q=80&w=1000&auto=format&fit=crop",
        video: "",
    },
    {
        id: "sea",
        title: "Lumen Field",
        location: "Seattle, Washington",
        description: "La atmósfera más ruidosa y apasionada de E.E.U.U. te espera en el Noroeste.",
        image: "https://images.unsplash.com/photo-1502175353174-a7470f73b361?q=80&w=1000&auto=format&fit=crop",
        video: "",
    },
    {
        id: "hou",
        title: "NRG Stadium",
        location: "Houston, Texas",
        description: "Toda la hospitalidad sureña en una de las sedes comerciales más grandes del torneo.",
        image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop",
        video: "",
    },
    {
        id: "phi",
        title: "Lincoln Financial Field",
        location: "Philadelphia, Pennsylvania",
        description: "Historia americana y pasión deportiva se unen en la Ciudad del Amor Fraternal.",
        image: "https://images.unsplash.com/photo-1563222409-9069695d8f6d?q=80&w=1000&auto=format&fit=crop",
        video: "",
    },
    {
        id: "kc",
        title: "Arrowhead Stadium",
        location: "Kansas City, Missouri",
        description: "El corazón de América. Una sede histórica para la Copa del Mundo más grande.",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop",
        video: "",
    },
    {
        id: "bos",
        title: "Gillette Stadium",
        location: "Boston, Massachusetts",
        description: "Tradición y excelencia deportiva en la legendaria región de Nueva Inglaterra.",
        image: "https://images.unsplash.com/photo-1622344735235-90035074dc88?q=80&w=1000&auto=format&fit=crop",
        video: "",
    }
];

function StadiumCard({ stadium }: { stadium: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="group relative h-[500px] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl"
        >
            {/* Background Image / Video */}
            <div className="absolute inset-0">
                <img
                    src={stadium.image}
                    alt={stadium.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {stadium.video && (
                    stadium.video.includes('youtube.com') ? (
                        <iframe
                            src={stadium.video}
                            className="absolute inset-0 w-full h-[150%] -top-[25%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            allow="autoplay; encrypted-media"
                            title={stadium.title}
                        />
                    ) : (
                        <video
                            src={stadium.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        />
                    )
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            {/* Top Content */}
            <div className="absolute top-0 left-0 right-0 p-8 pt-10">
                <h3 className="text-white text-3xl font-medium tracking-tight mb-2">
                    {stadium.title}
                </h3>
                <p className="text-white/80 text-lg font-normal leading-tight">
                    {stadium.location}
                </p>
            </div>

            {/* Bottom Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>
    );
}

export default function StadiumsShowcase() {
    const [startIndex, setStartIndex] = useState(0);
    const visibleCards = 4;

    const next = () => {
        if (startIndex + visibleCards < STADIUMS.length) {
            setStartIndex(prev => prev + 1);
        }
    };

    const prev = () => {
        if (startIndex > 0) {
            setStartIndex(prev => prev - 1);
        }
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container-fluid mx-auto px-6 max-w-[1600px]">

                {/* Section Header (Consistent with WorldCupElite) */}
                <div className="mb-16 md:pl-28">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 font-medium text-xs uppercase tracking-widest mb-4">
                        <MapPin size={14} />
                        Tu Destino Soñado
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1.1]">
                        Explora lo Mejor de USA<br />
                        <span className="text-slate-400">Tu Ruta Personalizada.</span>
                    </h2>
                </div>

                {/* Stadiums Slider Section */}
                <div className="relative px-4 md:px-14">
                    {/* Viewport */}
                    <div className="overflow-visible">
                        <motion.div
                            className="flex gap-8"
                            animate={{ x: `calc(-${startIndex * (100 / visibleCards)}% - ${startIndex * 2}rem)` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {STADIUMS.map((stadium) => (
                                <div
                                    key={stadium.id}
                                    className="flex-shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                                >
                                    <StadiumCard stadium={stadium} />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="mt-16 flex items-center justify-center gap-6">
                        <button
                            onClick={prev}
                            disabled={startIndex === 0}
                            className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${startIndex === 0 ? 'border-slate-100 text-slate-200' : 'border-slate-200 text-slate-900 bg-white hover:bg-slate-50 shadow-md active:scale-95'}`}
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button
                            onClick={next}
                            disabled={startIndex + visibleCards >= STADIUMS.length}
                            className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${startIndex + visibleCards >= STADIUMS.length ? 'border-slate-100 text-slate-200' : 'border-slate-200 text-slate-900 bg-white hover:bg-slate-50 shadow-md active:scale-95'}`}
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-slate-400 font-medium tracking-wider">
                    USA 2026 • SEDES OFICIALES
                </div>
            </div>
        </section>
    );
}
