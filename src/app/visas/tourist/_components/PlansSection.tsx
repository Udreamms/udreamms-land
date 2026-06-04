"use client";

import { motion } from "framer-motion";
import { FadeIn, ScaleIn } from "./Animations";
import Link from "next/link";
import {
    FileText,
    Users,
    Map,
    Hotel,
    ShoppingBag,
    Star,
    CheckCircle2,
    Calendar,
    Video,
    Plane
} from "lucide-react";


const PLANS = [
    {
        name: "TURISTA BÁSICO",
        price: "$380",
        originalPrice: "$494",
        discount: "30% OFF",
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
        discount: "30% OFF",
        description: "La experiencia completa y cómoda.",
        highlight: true,
        features: [
            { name: "Elige ciudad: FL, NY, CA, UT, NV, HI", icon: Map },
            { name: "Itinerario 8 días / 7 noches totalmente planificado", icon: Calendar },
            { name: "Vuelos y traslados internos incluidos", icon: Plane },
            { name: "Hospedaje 4–5 estrellas seleccionado", icon: Hotel },
            { name: "Entradas a parques y actividades", icon: ShoppingBag },
            { name: "Experiencias: ski, hiking, naturaleza", icon: Star },
            { name: "Gestión total del viaje", icon: CheckCircle2 },
            { name: "💡 Todo incluido: viaja sin preocupaciones", icon: Star },
        ]
    },
    {
        name: "EXPERIENCIA VIP",
        price: "$4,990",
        originalPrice: "$6,500",
        discount: "30% OFF",
        description: "Lujo y atención exclusiva.",
        highlight: false,
        features: [
            { name: "Ruta Turística Multi-Estado – Todo Incluido", icon: Map },
            { name: "Itinerario personalizado 12–15 días", icon: Calendar },
            { name: "Vuelos y traslados internos incluidos", icon: Plane },
            { name: "Hospedaje 4–5 estrellas garantizado", icon: Star },
            { name: "Entradas a parques y experiencias premium", icon: ShoppingBag },
            { name: "Actividades exclusivas: shows y aventuras", icon: Video },
            { name: "Gestión integral del viaje, todo cubierto", icon: CheckCircle2 },
            { name: "💡 Todo incluido: solo llega y disfruta", icon: Star },
        ]
    }
];

export default function PlansSection() {
    return (
        <section id="planes" className="pt-24 md:pt-32 pb-24 md:pb-40 bg-[#050507] relative overflow-hidden font-sans">
            {/* Background effects */}
            <div className="absolute inset-0 bg-white/[0.02] bg-[size:50px_50px]" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#050507] -translate-y-full" />

            <div className="container max-w-[1200px] mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-20 max-w-4xl mx-auto">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-white leading-tight mb-4">
                            Elige tu Plan Ideal
                        </h2>
                        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Tenemos opciones diseñadas para cada tipo de viajero con ofertas por tiempo limitado.
                        </p>
                    </FadeIn>
                </div>

                {/* Grid for Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mx-auto">
                    {PLANS.map((plan, index) => (
                        <ScaleIn delay={index * 0.1} key={index} className="h-full w-full">
                            <div className="relative group w-full flex flex-col h-full">
                                
                                {/* Glow Effect Background */}
                                <div className="absolute -inset-2 bg-white/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Card Content */}
                                <div className={`relative flex-1 bg-black rounded-[2rem] p-6 md:p-8 flex flex-col overflow-hidden transition-colors duration-300 ${plan.highlight ? 'ring-1 ring-slate-500/50 shadow-2xl z-10' : 'ring-1 ring-white/5 shadow-2xl hover:bg-black'}`}>
                                    
                                    {/* Visual Accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl" />

                                    {/* Discount Badge */}
                                    {plan.discount && (
                                        <div className="absolute top-4 right-4 bg-slate-800 text-slate-200 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide shadow-sm transform rotate-2 border border-slate-700">
                                            {plan.discount}
                                        </div>
                                    )}

                                    {/* Recommended Badge */}
                                    {plan.highlight && (
                                        <div className="absolute top-0 right-1/2 translate-x-1/2 bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] text-white text-[10px] font-medium uppercase tracking-widest px-6 py-1.5 rounded-b-xl shadow-lg z-20">
                                            MÁS POPULAR
                                        </div>
                                    )}

                                    <div className="flex flex-col items-center text-center mt-8 mb-6">
                                        <h3 className="text-xl md:text-2xl font-normal text-white tracking-tight mb-3 leading-relaxed">
                                            {plan.name}
                                        </h3>
                                        <div className="flex flex-col items-center justify-center mb-2">
                                            <span className="text-slate-500 line-through text-sm font-medium">
                                                {plan.originalPrice}
                                            </span>
                                            <span className="text-4xl font-medium text-white tracking-tighter">
                                                {plan.price}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm font-light leading-loose mt-2">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center gap-3 mt-auto mb-6 w-full">
                                        <Link 
                                            href={`/instructions-payment-tourist?plan=${plan.name.toLowerCase().split(" ").pop()?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "basico"}`} 
                                            className="w-full py-3 rounded-full bg-transparent text-white font-medium text-base shadow-2xl hover:scale-[1.03] active:scale-95 transition-all duration-300 border border-white/40 hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] text-center flex items-center justify-center"
                                        >
                                            Elegir Plan
                                        </Link>
                                    </div>

                                    <div className="space-y-4 md:space-y-5 flex-1">
                                        <p className="text-white font-normal text-xs uppercase tracking-widest opacity-50 mb-3 text-center">
                                            LO QUE INCLUYE:
                                        </p>
                                        <ul className="space-y-4">
                                            {plan.features.map((feature, i) => {
                                                const Icon = feature.icon;
                                                return (
                                                    <li key={i} className="flex items-start gap-3 text-slate-300 group/item cursor-default leading-relaxed">
                                                        <Icon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0 transition-transform group-hover/item:scale-110" strokeWidth={1.5} />
                                                        <span className="text-sm font-normal text-slate-100 group-hover/item:text-white transition-colors text-left">
                                                            {feature.name}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </ScaleIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
