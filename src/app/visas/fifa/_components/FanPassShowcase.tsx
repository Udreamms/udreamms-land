import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Map, CheckCircle2, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

const IMAGES = [
    "https://images.unsplash.com/photo-1556056504-517cf0121f37?w=1000&auto=format&fit=crop", // Modern stadium sunset
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&auto=format&fit=crop", // Soccer stadium top view
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1000&auto=format&fit=crop"  // Huge stadium interior
];

export default function FanPassShowcase() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="pt-16 pb-24 bg-white text-black overflow-hidden" id="fan-pass-details">
            <div className="container mx-auto px-6">

                {/* Header: Title + Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 font-medium text-xs uppercase tracking-widest mb-4">
                            <AlertOctagon size={14} />
                            Plan Fan Pass
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-[1.1]">
                            Lo esencial para asegurar<br />
                            tu lugar en el <span className="text-slate-400">Mundial</span>
                        </h2>
                        <p className="mt-6 text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
                            La base perfecta para el fan que ya tiene sus entradas y necesita solucionar su estatus migratorio.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="rounded-full px-10 py-7 bg-black hover:bg-slate-900 text-white font-medium text-lg shadow-xl shadow-slate-200 transition-all"
                        onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Elegir Fan Pass
                    </Button>
                </div>

                {/* New Layout - Left: Staggered Blobs | Right: Large Media */}
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0 mt-8 px-4">

                    {/* Left side: Staggered Features */}
                    <div className="lg:w-[50%] flex flex-col gap-12 md:gap-0 relative py-10 md:h-[700px] w-full">

                        {/* Blob 1: Visa Express (Top - Moved closer to center) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="md:absolute md:top-8 md:left-12 z-30 scale-100 md:scale-125 flex items-center justify-center w-full md:w-auto"
                        >
                            <div className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] flex items-center justify-center">
                                <div className="absolute inset-0 bg-white border border-slate-200 shadow-xl animate-morph"
                                    style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }} />
                                <div className="relative z-10 p-8 text-center flex flex-col items-center">
                                    <div className="p-3 rounded-2xl bg-slate-50 mb-4 border border-slate-100">
                                        <FileText size={28} className="text-slate-950" />
                                    </div>
                                    <h3 className="text-slate-950 text-2xl font-bold tracking-tight mb-2">Visa Express</h3>
                                    <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-3 block">(Asesoría Urgente)</span>
                                    <p className="text-slate-600 text-sm leading-relaxed max-w-[200px]">Priorizamos tu trámite consular para obtener tu visa en tiempo récord.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Blob 2: Guía Logística (Bottom - Moved closer to Blob 1) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="md:absolute md:bottom-8 md:right-12 z-20 scale-100 md:scale-125 flex items-center justify-center w-full md:w-auto"
                        >
                            <div className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] flex items-center justify-center">
                                <div className="absolute inset-0 bg-white border border-slate-200 shadow-xl animate-morph-delayed"
                                    style={{ borderRadius: "50% 50% 33% 67% / 55% 27% 73% 45%" }} />
                                <div className="relative z-10 p-8 text-center flex flex-col items-center">
                                    <div className="p-3 rounded-2xl bg-slate-50 mb-4 border border-slate-100">
                                        <Map size={28} className="text-slate-950" />
                                    </div>
                                    <h3 className="text-slate-950 text-2xl font-bold tracking-tight mb-2">Guía Logística</h3>
                                    <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-3 block">Sedes Mundial</span>
                                    <p className="text-slate-600 text-sm leading-relaxed max-w-[220px]">Mapas de sedes y transporte oficial en las 16 ciudades del Mundial.</p>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* Right side: Media (Carousel with Flying Paper Effect) */}
                    <div className="lg:w-[50%] w-full lg:-mt-32 relative z-40">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="relative group lg:pl-10 cursor-pointer"
                            onClick={() => setCurrentIndex((prev) => (prev + 1) % IMAGES.length)}
                        >
                            {/* Decorative frames */}
                            <div className="absolute -inset-4 bg-slate-100 rounded-[4rem] -rotate-2 z-0" />
                            <div className="absolute -inset-2 bg-slate-50 rounded-[4rem] rotate-1 z-0 border border-slate-200 shadow-inner" />

                            <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white aspect-[4/5] bg-slate-100">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentIndex}
                                        src={IMAGES[currentIndex]}
                                        alt="World Cup Experience"
                                        className="absolute inset-0 w-full h-full object-cover"
                                        initial={{
                                            x: 600,
                                            y: -200,
                                            rotate: 25,
                                            opacity: 0,
                                            scale: 0.8
                                        }}
                                        animate={{
                                            x: 0,
                                            y: 0,
                                            rotate: 0,
                                            opacity: 1,
                                            scale: 1
                                        }}
                                        exit={{
                                            x: -600,
                                            y: 200,
                                            rotate: -25,
                                            opacity: 0,
                                            scale: 0.8
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            ease: [0.23, 1, 0.32, 1]
                                        }}
                                    />
                                </AnimatePresence>

                                {/* Overlay Content */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12 pointer-events-none">
                                    <div className="space-y-2">
                                        <h4 className="text-white text-3xl font-bold tracking-tight">Experiencia de Estadio</h4>
                                        <p className="text-white/80 text-lg font-light leading-snug max-w-sm">Siente el rugido de la afición en el Mundial 2026. Tu viaje comienza aquí.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Styled Background Morph Animations */}
                    <style jsx>{`
                        .animate-morph {
                            animation: morph 8s ease-in-out infinite;
                        }
                        .animate-morph-delayed {
                            animation: morph 8s ease-in-out infinite;
                            animation-delay: 2s;
                        }
                        @keyframes morph {
                            0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                            25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
                            50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
                            75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
                            100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                        }
                    `}</style>
                </div>

                {/* Footer Message */}
                <div className="mt-24 flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-gray-200" />
                    <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-black" />
                        Acompañamiento VIP para el Mundial 2026
                    </p>
                    <div className="h-px w-12 bg-gray-200" />
                </div>
            </div>
        </section>
    );
}
