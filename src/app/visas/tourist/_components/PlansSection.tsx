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
    MessageCircle
} from "lucide-react";

// Google Brand Colors: Blue (#4285F4), Red (#DB4437), Yellow (#F4B400), Green (#0F9D58)
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
        name: "TURISTA BÁSICO",
        price: "$380",
        originalPrice: "$494",
        description: "Lo esencial para tu solicitud.",
        highlight: false,
        features: [
            { name: "Gestión de Visa (DS-160 + Cita)", icon: FileText },
            { name: "Preparación Entrevista", icon: Users },
        ]
    },
    {
        name: "TURISTA PREMIUM",
        price: "$1,500",
        originalPrice: "$1,950",
        description: "La experiencia completa y cómoda.",
        highlight: true,
        features: [
            { name: "Gestión de Visa (DS-160 + Cita)", icon: FileText },
            { name: "Preparación Entrevista", icon: Users },
            { name: "Itinerario Turístico Personalizado", icon: Map },
            { name: "Gestión de Hospedaje y Transporte", icon: Hotel },
        ]
    },
    {
        name: "EXPERIENCIA VIP",
        price: "$3,000",
        originalPrice: "$3,900",
        description: "Lujo y atención exclusiva.",
        highlight: false,
        features: [
            { name: "Gestión de Visa (DS-160 + Cita)", icon: FileText },
            { name: "Preparación Entrevista", icon: Users },
            { name: "Itinerario Turístico Personalizado", icon: Map },
            { name: "Gestión de Hospedaje y Transporte", icon: Hotel },
            { name: "Asesoría de Compras (Personal Shopper)", icon: ShoppingBag },
            { name: "Hoteles 4-5 Estrellas", icon: Star },
        ]
    }
];

export default function PlansSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden" id="planes">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h2 className="text-4xl md:text-5xl font-bold text-abyss mb-6">
                            Elige tu Plan Ideal
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Tenemos opciones diseñadas para cada tipo de viajero con ofertas por tiempo limitado.
                        </p>
                    </FadeIn>
                </div>

                {/* Main White Container wrapping all plans */}
                <div className="max-w-7xl mx-auto bg-sky-50 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 relative">

                    {/* Inject Gradient Definition */}
                    <GoogleGradient />

                    {/* Top Left Icons Row (Google Gradient Style) */}
                    <div className="absolute top-8 left-8 md:left-12 flex items-center gap-4">
                        <Mail className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <Calendar className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <HardDrive className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <FileText className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <Video className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                    </div>

                    {/* Spacing for the header icons */}
                    <div className="mt-16"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {PLANS.map((plan, index) => (
                            <ScaleIn delay={index * 0.1} key={index} className="h-full">
                                <div className={`
                                    relative p-8 rounded-3xl border transition-all duration-300 h-full flex flex-col min-h-[600px] bg-white
                                    ${plan.highlight
                                        ? "border-blue-500 shadow-2xl z-10 ring-2 ring-blue-500/20"
                                        : "border-slate-200 hover:border-blue-200 hover:shadow-xl"
                                    }
                                `}>
                                    {/* Discount Badge - Top Right (Light Blue / Celeste) */}
                                    <div className="absolute top-6 right-6 bg-cyan-200 text-cyan-900 px-4 py-2 rounded-lg text-sm font-bold tracking-wide shadow-sm transform rotate-2">
                                        30% OFF
                                    </div>

                                    {plan.highlight && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide shadow-md">
                                            MÁS POPULAR
                                        </div>
                                    )}

                                    {/* Increased top margin to separate Title from Badge */}
                                    <div className="mb-8 mt-12">
                                        <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-blue-700" : "text-abyss"}`}>
                                            {plan.name}
                                        </h3>

                                        <div className="flex flex-col items-start mb-4">
                                            <span className="text-gray-400 line-through text-lg font-medium mb-0">
                                                {plan.originalPrice}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold text-abyss">{plan.price}</span>
                                            </div>
                                        </div>

                                        {/* Increased Description Size */}
                                        <p className="text-slate-600 text-base">{plan.description}</p>
                                    </div>

                                    <Button
                                        className={`w-full mb-10 rounded-full py-6 font-bold text-lg shadow-lg transition-transform active:scale-95
                                            ${plan.highlight
                                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                                                : "bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-200 hover:bg-blue-50"
                                            }
                                        `}
                                    >
                                        Elegir Plan
                                    </Button>

                                    <div className="space-y-6 flex-grow">
                                        <p className="font-semibold text-sm text-abyss mb-6 uppercase tracking-wider border-b border-gray-100 pb-2">
                                            LO QUE INCLUYE:
                                        </p>
                                        {plan.features.map((feature, i) => {
                                            const Icon = feature.icon;
                                            return (
                                                <div key={i} className="flex items-start gap-4 text-slate-700">
                                                    {/* Feature Icon Style - Using Gradient for all to match request */}
                                                    <div className="mt-0.5 p-2 rounded-full flex-shrink-0 bg-slate-50">
                                                        <Icon size={24} stroke="url(#google-gradient)" strokeWidth={3} />
                                                    </div>
                                                    {/* Increased Feature Text Size */}
                                                    <span className="text-base font-medium leading-[1.5] pt-1">
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
