"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, Play } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        id: 1,
        videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2FVisa_Aprobada_Video_Generado.mp4?alt=media&token=5506d972-daaf-4514-8079-2b357abbddec",
        name: "@udreamms",
        description: "Nuestros estudiantes logrando sus metas."
    },
    {
        id: 2,
        videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2FVisa_Aprobada_Video_Generado.mp4?alt=media&token=5506d972-daaf-4514-8079-2b357abbddec",
        name: "@udreamms",
        description: "Tu éxito es nuestra prioridad."
    },
    {
        id: 3,
        videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2FVisa_Aprobada_Video_Generado.mp4?alt=media&token=5506d972-daaf-4514-8079-2b357abbddec",
        name: "@udreamms",
        description: "Acompañamiento en cada paso."
    },
    {
        id: 4,
        videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2FVisa_Aprobada_Video_Generado.mp4?alt=media&token=5506d972-daaf-4514-8079-2b357abbddec",
        name: "@udreamms",
        description: "Viviendo el sueño americano."
    }
];

export default function VideoTestimonials() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 350;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container px-6 md:px-12 mx-auto">
                <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="max-w-4xl">
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 text-black">
                            Historias de Éxito <span className="text-red-600">Reales</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-medium leading-relaxed">
                            Descubre por qué cientos de estudiantes confían en nosotros para su futuro.
                        </p>
                    </div>

                    <div className="hidden md:flex gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full bg-white shadow-md text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full bg-white shadow-md text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide"
                >
                    {testimonials.map((test) => (
                        <div
                            key={test.id}
                            onMouseEnter={() => setHoveredCardId(test.id)}
                            onMouseLeave={() => setHoveredCardId(null)}
                            className="relative shrink-0 snap-center w-[220px] md:w-[260px] aspect-[9/16] bg-black rounded-[2rem] overflow-hidden group shadow-2xl"
                        >
                            {hoveredCardId === test.id ? (
                                <video
                                    src={test.videoUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover opacity-100 transition-opacity duration-300"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-cover bg-center opacity-40 filter blur-[1px]" style={{ backgroundImage: `url('/assets/hero-campus.jpg')` }} />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent pointer-events-none" />
                                </div>
                            )}

                            {hoveredCardId !== test.id && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl transition-all group-hover:scale-110 group-hover:bg-white/35">
                                        <Play className="w-6 h-6 fill-white text-white ml-1" />
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-2">
                                <a
                                    href="https://www.instagram.com/udreamms/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-white font-medium hover:text-pink-400 transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                    {test.name}
                                </a>
                                <p className="text-white/80 text-sm font-medium">
                                    {test.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="https://www.instagram.com/udreamms/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-medium py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                        Ver más en Instagram
                        <Instagram className="w-5 h-5" />
                    </a>
                </div>
            </div>
            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section>
    );
}
