"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    CheckCircle2,
    School,
    FileText,
    MessageCircle,
    Plane,
    Car,
    Smartphone,
    Home,
    Users,
    Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        id: "basicos",
        title: "Servicios Básicos",
        icon: CheckCircle2,
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "escuela",
        title: "Aplicación escuela + I-20",
        icon: School,
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "consular",
        title: "DS-160 + SEVIS + Cita",
        icon: FileText,
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "entrevista",
        title: "Simulacro de Entrevista (3 sesiones)",
        icon: MessageCircle,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "vuelos",
        title: "Link tickets aéreos",
        icon: Plane,
        image: "/assets/vuelos.png"
    },
    {
        id: "pickup",
        title: "Pick-up Aeropuerto (UT)",
        icon: Car,
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "banco",
        title: "Banco, Celular y Licencia",
        icon: Smartphone,
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "alojamiento",
        title: "Búsqueda de Alojamiento (Incluido)",
        icon: Home,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "mentoria",
        title: "Mentoria de Adaptación (1 mes)",
        icon: Users,
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "idioma",
        title: "Clases de Inglés (1er Mes Gratis)",
        icon: Languages,
        image: "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&w=800&auto=format&fit=crop"
    },
];

const Row = ({ items, reverse = false }: { items: typeof features, reverse?: boolean }) => {
    // Triple the items to ensure the loop is absolutely seamless regardless of screen width
    const quadrupledItems = [...items, ...items, ...items, ...items];

    return (
        <div className="flex overflow-hidden group py-4 select-none">
            <motion.div
                className="flex gap-4 md:gap-6 shrink-0"
                animate={{
                    x: reverse ? ["-50%", "0%"] : ["0%", "-50%"]
                }}
                transition={{
                    duration: 80, // Much slower "slow" effect
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}
            >
                {quadrupledItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={`${item.id}-${idx}`}
                            className="relative w-[300px] md:w-[400px] aspect-[16/10] rounded-[2.5rem] overflow-hidden group/card shadow-2xl border border-white/10"
                        >
                            {/* Background Image */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                            />

                            {/* Pro Dark Overlay - Black range theme */}
                            <div className="absolute inset-0 bg-black/60 group-hover/card:bg-black/50 transition-colors duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                <div className="p-3 w-fit rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-white text-2xl md:text-3xl font-medium leading-tight tracking-tight drop-shadow-xl">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default function ElitePlanShowcase() {
    const row1 = features.slice(0, 5);
    const row2 = features.slice(5, 10);

    return (
        <section className="py-24 bg-white text-black overflow-hidden" id="plan-elite">
            <div className="container mx-auto px-6 mb-16">
                {/* Header Centered Title */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium text-xs uppercase tracking-widest mb-6">
                        ELITE EXPERIENCE
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tighter text-black leading-[0.9]">
                        Transforma<br />
                        tu <span className="text-slate-400">futuro</span>
                    </h2>
                </div>

                {/* Description and Button side-by-side */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
                    <p className="text-xl text-black font-normal leading-relaxed max-w-2xl text-center md:text-left">
                        El Plan Elite está diseñado para quienes no aceptan menos que la perfección.
                        Cada detalle de tu llegada y asentamiento en Estados Unidos está cubierto.
                    </p>
                    <Link href="/instructions-payment-student?plan=elite">
                        <Button
                            size="lg"
                            className="rounded-full px-10 py-8 bg-black hover:bg-black/90 text-white font-medium text-xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 shrink-0"
                        >
                            Elegir Plan Elite
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scrolling Rows Section - Cinematic Effect */}
            <div className="flex flex-col gap-2 md:gap-4">
                <Row items={row1} />
                <Row items={row2} reverse />
            </div>

            {/* Subtle bottom detail */}
            <div className="container mx-auto px-6 mt-16 flex justify-center">
                <div className="flex items-center gap-4 text-slate-300">
                    <div className="h-px w-24 bg-slate-100" />
                    <span className="text-xs uppercase tracking-[0.3em] font-bold">Udreamms Elite Standards</span>
                    <div className="h-px w-24 bg-slate-100" />
                </div>
            </div>
        </section>
    );
}
