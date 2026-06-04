"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn, ScaleIn } from "./Animations";
import { Button } from "@/components/ui/button";
import { sendMetaEvent } from "@/lib/meta-events";
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
    Languages
} from "lucide-react";

// Restore Google Brand Colors: Blue (#4285F4), Red (#DB4437), Yellow (#F4B400), Green (#0F9D58)
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
        name: "PLAN 1: ESENCIAL",
        price: "$380",
        originalPrice: "$494",
        discount: "30% OFF",
        description: "El punto de partida ideal.",
        highlight: false,
        features: [
            { name: "Servicios Básicos", icon: CheckCircle2 },
            { name: "Aplicación escuela + I-20", icon: School },
            { name: "DS-160 + SEVIS + Cita", icon: FileText },
            { name: "Simulacro de Entrevista (3 sesiones)", icon: MessageCircle },
        ]
    },
    {
        name: "PLAN 2: PRO",
        price: "$850",
        originalPrice: "$1,700",
        discount: "50% OFF",
        description: "Para quienes buscan seguridad.",
        highlight: true,
        features: [
            { name: "Servicios Básicos", icon: CheckCircle2 },
            { name: "Aplicación escuela + I-20", icon: School },
            { name: "DS-160 + SEVIS + Cita", icon: FileText },
            { name: "Simulacro de Entrevista (3 sesiones)", icon: MessageCircle },
            { name: "Link vuelos / Seguro Médico", icon: Plane },
            { name: "Pick-up Aeropuerto (UT)", icon: Car },
            { name: "Banco, Celular y Licencia", icon: CreditCard },
        ]
    },
    {
        name: "PLAN 3: ELITE",
        price: "$2,500",
        originalPrice: "$3,250",
        discount: "30% OFF",
        description: "Soporte completo y alojamiento.",
        highlight: false,
        features: [
            { name: "Servicios Básicos", icon: CheckCircle2 },
            { name: "Aplicación escuela + I-20", icon: School },
            { name: "DS-160 + SEVIS + Cita", icon: FileText },
            { name: "Simulacro de Entrevista (3 sesiones)", icon: MessageCircle },
            { name: "Link tickets aéreos", icon: Plane },
            { name: "Pick-up Aeropuerto (UT)", icon: Car },
            { name: "Banco, Celular y Licencia", icon: CreditCard },
            { name: "Búsqueda de Alojamiento (Aplicación de vivienda incluida)", icon: Home },
            { name: "Mentoria de Adaptación (1 mes)", icon: Users },
            { name: "Clases de Inglés (1er Mes Gratis)", icon: Languages },
        ]
    },
    {
        name: "PLAN 4: ALL-INCLUSIVE",
        price: "$10,000",
        originalPrice: "$13,000",
        discount: "30% OFF",
        description: "La experiencia VIP definitiva.",
        highlight: false,
        features: [
            { name: "Servicios Básicos", icon: CheckCircle2 },
            { name: "Aplicación escuela + I-20", icon: School },
            { name: "DS-160 + SEVIS + Cita", icon: FileText },
            { name: "Simulacro de Entrevista (Ilimitadas)", icon: MessageCircle },
            { name: "Tickets aéreos a USA (incluidos)", icon: Plane },
            { name: "Pick-up Aeropuerto (UT)", icon: Car },
            { name: "Banco, Celular y Licencia", icon: CreditCard },
            { name: "Búsqueda de Alojamiento (4 Meses Pagados)", icon: Home },
            { name: "Mentoria de Adaptación (4 meses)", icon: Star },
            { name: "Clases de Inglés (4 Meses Pagados)", icon: Languages },
        ]
    }
];

export default function PlansSection() {
    return (
        <section id="planes" className="pt-24 md:pt-32 pb-24 md:pb-40 bg-[#050507] relative overflow-hidden font-sans">
            {/* Background effects */}
            <div className="absolute inset-0 bg-white/[0.02] bg-[size:50px_50px]" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#050507] -translate-y-full" />

            <div className="container max-w-[1600px] mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-20 max-w-4xl mx-auto">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-white leading-tight mb-4">
                            Elige tu Plan Ideal
                        </h2>
                        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Integramos admisión universitaria y preparación consular estratégica en un solo lugar.
                        </p>
                    </FadeIn>
                </div>

                {/* Grid for 4 Plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch mx-auto">
                    {PLANS.map((plan, index) => (
                        <ScaleIn delay={index * 0.1} key={index} className="h-full w-full">
                            <div className="relative group w-full flex flex-col h-full">
                                
                                {/* Glow Effect Background */}
                                <div className="absolute -inset-2 bg-white/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Card Content */}
                                <div className={`relative flex-1 bg-black border rounded-[2rem] p-6 md:p-8 flex flex-col overflow-hidden transition-colors duration-300 ${plan.highlight ? 'border-slate-500 ring-1 ring-slate-500/50 shadow-2xl z-10' : 'border-white/10 ring-1 ring-white/5 shadow-2xl hover:bg-black'}`}>
                                    
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
                                            href={`/instructions-payment-student?plan=${plan.name.toLowerCase().split(":")[1]?.trim().replace(" ", "-") || "esencial"}`} 
                                            onClick={() => sendMetaEvent('InitiateCheckout', { content_name: plan.name, currency: 'USD', value: parseFloat(plan.price.replace('$', '').replace(',', '')) })}
                                            className="w-full py-3 rounded-full bg-transparent text-white font-normal text-base shadow-2xl active:scale-95 transition-all duration-300 border border-white/40 hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] hover:scale-105 text-center"
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
                                                        <div className="mt-0.5 transition-transform group-hover/item:scale-110 shrink-0">
                                                            <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                                                        </div>
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
