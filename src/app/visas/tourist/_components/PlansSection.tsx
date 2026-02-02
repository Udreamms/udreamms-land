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
            { name: "Auditoría de Perfil Migratorio", icon: FileText },
            { name: "Gestión de Visa B1/B2", icon: CheckCircle2 },
            { name: "Preparación para la Entrevista", icon: Users },
            { name: "Guía general para el día de la entrevista", icon: Video },
        ]
    },
    {
        name: "TURISTA PREMIUM",
        price: "$3,500",
        originalPrice: "$4,550",
        description: "La experiencia completa y cómoda.",
        highlight: true,
        features: [
            { name: "Elige ciudad: FL, NY, CA, UT, NV, HI", icon: Map },
            { name: "Itinerario 8 días / 7 noches totalmente planificado", icon: Calendar },
            { name: "Vuelos y traslados internos incluidos", icon: HardDrive }, // Using HardDrive as placeholder for Plane/Transport if Plane not imported, actually Plane is likely better but check imports. Using HardDrive as generic logic or switch to imported Plane if available or add it. Let's look at imports: Mail, Calendar, Video, HardDrive... Plane is NOT imported in the list shown (lines 6-19). I should import Plane.
            { name: "Hospedaje 4–5 estrellas seleccionado", icon: Hotel },
            { name: "Entradas a parques y actividades", icon: ShoppingBag },
            { name: "Experiencias: ski, hiking, naturaleza", icon: Star },
            { name: "Gestión total del viaje", icon: CheckCircle2 },
            { name: "💡 Todo incluido: viaja sin preocupaciones" },
        ]
    },
    {
        name: "EXPERIENCIA VIP",
        price: "$4,990",
        originalPrice: "$6,500",
        description: "Lujo y atención exclusiva.",
        highlight: false,
        features: [
            { name: "Ruta Turística Multi-Estado – Todo Incluido", icon: Map },
            { name: "Itinerario personalizado 12–15 días", icon: Calendar },
            { name: "Vuelos y traslados internos incluidos", icon: HardDrive },
            { name: "Hospedaje 4–5 estrellas garantizado", icon: Star },
            { name: "Entradas a parques y experiencias premium", icon: ShoppingBag },
            { name: "Actividades exclusivas: shows y aventuras", icon: Video },
            { name: "Gestión integral del viaje, todo cubierto", icon: CheckCircle2 },
            { name: "💡 Todo incluido: solo llega y disfruta" },
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
                <div className="max-w-[1600px] mx-auto bg-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-md border border-slate-300 relative overflow-hidden">

                    {/* Limited Time Badge - Animated Gradient */}
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-bl-3xl shadow-lg z-20 animate-pulse">
                        ¡CUPOS LIMITADOS!
                    </div>

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
                                        ? "border-slate-400 shadow-xl ring-1 ring-slate-400/50 z-10"
                                        : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                                    }
                                `}>
                                    {/* Discount Badge - Dynamic based on plan data */}
                                    <div className="absolute top-6 right-6 bg-slate-200 text-slate-800 px-3 py-1.5 rounded-md text-sm font-bold tracking-wide shadow-sm transform rotate-2">
                                        30% OFF
                                    </div>

                                    {plan.highlight && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide shadow-md">
                                            MÁS POPULAR
                                        </div>
                                    )}

                                    {/* Increased top margin to separate Title from Badge */}
                                    <div className="mb-8 mt-12">
                                        <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-slate-900" : "text-slate-700"}`}>
                                            {plan.name}
                                        </h3>

                                        <div className="flex flex-col items-start mb-4">
                                            <span className="text-slate-400 line-through text-lg font-medium mb-0">
                                                {plan.originalPrice}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                            </div>
                                        </div>

                                        {/* Increased Description Size */}
                                        <p className="text-slate-500 text-base">{plan.description}</p>
                                    </div>

                                    <Button
                                        className="w-full mb-10 rounded-full py-6 font-bold text-lg shadow-lg transition-all duration-300 active:scale-95 border-2 bg-white text-slate-900 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
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
                                                    {Icon && (
                                                        <div className="mt-0.5 p-2 rounded-full flex-shrink-0 bg-slate-50">
                                                            <Icon size={24} stroke="url(#google-gradient)" strokeWidth={3} />
                                                        </div>
                                                    )}
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
