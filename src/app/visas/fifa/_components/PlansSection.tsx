"use client";

import { motion } from "framer-motion";
import { FadeIn, ScaleIn } from "./Animations";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Users,
    Map,
    Hotel,
    ShoppingBag,
    Star,
    CheckCircle2,
    Mail,
    Calendar,
    Video,
    HardDrive,
    MessageCircle,
    School,
    Plane,
    Car,
    CreditCard,
    Home,
    BookOpen,
    Languages,
    Bus,
    Ticket,
    Beer
} from "lucide-react";

// Google Brand Colors retained
const GoogleGradient = () => (
    <svg width="0" height="0">
        <defs>
            <linearGradient id="google-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4285F4" />
                <stop offset="33%" stopColor="#DB4437" />
                <stop offset="66%" stopColor="#F4B400" />
                <stop offset="100%" stopColor="#0F9D58" />
            </linearGradient>
        </defs>
    </svg>
);

const PLANS = [
    {
        name: "FAN PASS",
        price: "$450",
        originalPrice: "$585",
        discount: "30% OFF",
        description: "Lo esencial para tu viaje.",
        highlight: false,
        features: [
            { name: "Visa Express (Asesoría Urgente)", icon: FileText },
            { name: "Guía Logística Sedes Mundial", icon: Map },
        ]
    },
    {
        name: "FAN FOLLOW (PRO)",
        price: "$1,850",
        originalPrice: "$2,405",
        discount: "30% OFF",
        description: "Movilidad y estancia resuelta.",
        highlight: true,
        features: [
            { name: "Visa Express (Asesoría Urgente)", icon: FileText },
            { name: "Guía Logística Sedes Mundial", icon: Map },
            { name: "Ruta de Transporte Inter-Sedes", icon: Bus },
            { name: "Reserva de Alojamiento (Cerca Estadios)", icon: Hotel },
        ]
    },
    {
        name: "WORLD CUP ELITE",
        price: "$5,000+",
        originalPrice: "$6,500",
        discount: "30% OFF",
        description: "La experiencia VIP completa.",
        highlight: false,
        features: [
            { name: "Visa Express (Asesoría Urgente)", icon: FileText },
            { name: "Guía Logística Sedes Mundial", icon: Map },
            { name: "Ruta de Transporte Inter-Sedes", icon: Bus },
            { name: "Reserva de Alojamiento (Cerca Estadios)", icon: Hotel },
            { name: "Traslados Privados a los Partidos", icon: Car },
            { name: "Hospitality & Fan Zone VIP", icon: Beer },
        ]
    }
];

export default function PlansSection() {
    return (
        // Section Background white
        <section className="py-24 bg-white relative overflow-hidden" id="planes">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <FadeIn>
                        {/* Title - Professional Black */}
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            Elige tu Nivel de Fan
                        </h2>
                        {/* Subtitle - Professional Gray */}
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Paquetes diseñados para garantizar tu presencia en el evento deportivo más grande del mundo.
                        </p>
                    </FadeIn>
                </div>

                {/* Main Container - Professional Slate Theme (bg-slate-50) - Clean & Noise Free */}
                <div className="max-w-[1600px] mx-auto bg-slate-50 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">

                    {/* Limited Time Badge - Animated Gradient */}
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-bl-3xl shadow-lg z-20 animate-pulse">
                        ¡CUPOS LIMITADOS!
                    </div>

                    {/* Inject Gradient Definition */}
                    <GoogleGradient />

                    {/* Top Left Icons Row (Google Colorful Style - Untouched) */}
                    <div className="absolute top-8 left-8 md:left-12 flex items-center gap-4">
                        <Mail className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <Calendar className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <HardDrive className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <FileText className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <Video className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                    </div>

                    {/* Spacing for the header icons */}
                    <div className="mt-16"></div>

                    {/* Grid for 3 Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {PLANS.map((plan, index) => (
                            <ScaleIn delay={index * 0.1} key={index} className="h-full">
                                <div className={`
                                    relative p-6 rounded-3xl border transition-all duration-300 h-full flex flex-col bg-white
                                    ${plan.highlight
                                        ? "border-slate-800 shadow-2xl ring-1 ring-slate-800/10 z-10" // High contrast for PRO
                                        : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                                    }
                                `}>
                                    {/* Discount Badge - Subtle Slate */}
                                    <div className="absolute top-6 right-6 bg-slate-100 text-slate-700 px-4 py-2 rounded-md text-sm font-bold tracking-wide shadow-sm transform rotate-0">
                                        {plan.discount}
                                    </div>

                                    {plan.highlight && (
                                        // "Más Popular" - Solid Black/Slate-900 for professionalism
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-md">
                                            MÁS POPULAR
                                        </div>
                                    )}

                                    <div className="mb-6 mt-12">
                                        <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-slate-900" : "text-slate-800"}`}>
                                            {plan.name}
                                        </h3>

                                        <div className="flex flex-col items-start mb-4">
                                            {/* Strikethrough Original Price */}
                                            <span className="text-slate-400 line-through text-lg font-medium mb-0">
                                                {plan.originalPrice}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-500 text-base leading-snug">{plan.description}</p>
                                    </div>

                                    <Button
                                        // Button - Professional Slate/Black theme
                                        className="w-full mb-8 rounded-full py-6 font-bold text-lg shadow-sm transition-all duration-300 active:scale-95 border-2 bg-white text-slate-900 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                                    >
                                        Elegir Plan
                                    </Button>

                                    <div className="space-y-4 flex-grow">
                                        <p className="font-semibold text-xs text-slate-400 mb-4 uppercase tracking-wider border-b border-gray-100 pb-2">
                                            LO QUE INCLUYE:
                                        </p>
                                        {plan.features.map((feature, i) => {
                                            const Icon = feature.icon;
                                            return (
                                                <div key={i} className="flex items-start gap-3 text-slate-700">
                                                    {/* Icons kept colorful (google gradient) */}
                                                    <div className="mt-0.5 p-1.5 rounded-full flex-shrink-0 bg-green-50 shadow-sm border border-green-100">
                                                        <Icon size={20} stroke="url(#google-gradient)" strokeWidth={2.5} />
                                                    </div>
                                                    <span className="text-sm font-medium leading-[1.5] pt-0.5">
                                                        {feature.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </ScaleIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
