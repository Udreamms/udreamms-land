"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
        <section className="py-24 bg-white relative overflow-hidden" id="planes">
            <div className="w-full px-4 md:px-8">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h2 className="text-4xl md:text-5xl font-medium text-slate-900 mb-6 tracking-tight">
                            Elige tu Plan Ideal
                        </h2>
                        {/* Copy replaced with Hero subtitle as requested */}
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Integramos admisión universitaria y preparación consular estratégica en un solo lugar.
                        </p>
                    </FadeIn>
                </div>

                {/* Main Container - Gray Background as requested */}
                <div className="max-w-[1600px] mx-auto bg-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-md border border-slate-300 relative overflow-hidden">

                    {/* Limited Time Badge - Animated Gradient */}
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-medium uppercase tracking-widest px-6 py-2 rounded-bl-3xl shadow-lg z-20 animate-pulse">
                        ¡CUPOS LIMITADOS!
                    </div>

                    {/* Inject Gradient Definition */}
                    <GoogleGradient />

                    {/* Top Left Icons Row (Google Colorful Style) */}
                    <div className="absolute top-8 left-8 md:left-12 flex items-center gap-4">
                        <Mail className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <Calendar className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <HardDrive className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <FileText className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                        <Video className="w-8 h-8" stroke="url(#google-gradient)" strokeWidth={3} />
                    </div>

                    {/* Spacing for the header icons */}
                    <div className="mt-16"></div>

                    {/* Grid for 4 Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                        {PLANS.map((plan, index) => (
                            <ScaleIn delay={index * 0.1} key={index} className="h-full">
                                <div className={`
                                    relative p-6 rounded-3xl border transition-all duration-300 h-full flex flex-col bg-white
                                    ${plan.highlight
                                        ? "border-slate-400 shadow-xl ring-1 ring-slate-400/50 z-10"
                                        : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                                    }
                                `}>
                                    {/* Discount Badge - Dynamic based on plan data */}
                                    <div className="absolute top-6 right-6 bg-slate-200 text-slate-800 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide shadow-sm transform rotate-2">
                                        {plan.discount}
                                    </div>

                                    {plan.highlight && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-1 rounded-full text-sm font-medium tracking-wide shadow-md">
                                            MÁS POPULAR
                                        </div>
                                    )}

                                    <div className="mb-6 mt-12">
                                        <h3 className={`text-xl font-medium mb-2 ${plan.highlight ? "text-slate-900" : "text-slate-900"}`}>
                                            {plan.name}
                                        </h3>

                                        <div className="flex flex-col items-start mb-4">
                                            {/* Original Price Strikethrough added back */}
                                            <span className="text-slate-400 line-through text-base font-medium mb-0">
                                                {plan.originalPrice}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-medium text-slate-900 tracking-tighter">{plan.price}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-500 text-base leading-snug">{plan.description}</p>
                                    </div>

                                    <Link 
                                        href={`/instructions-payment-student?plan=${plan.name.toLowerCase().split(":")[1]?.trim().replace(" ", "-") || "esencial"}`} 
                                        className="w-full"
                                    >
                                        <Button
                                            className="w-full mb-8 rounded-full py-6 font-medium text-lg shadow-sm transition-all duration-300 active:scale-95 border-2 bg-white text-slate-900 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                                        >
                                            Elegir Plan
                                        </Button>
                                    </Link>

                                    <div className="space-y-4 flex-grow">
                                        <p className="font-medium text-xs text-slate-400 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">
                                            LO QUE INCLUYE:
                                        </p>
                                        {plan.features.map((feature, i) => {
                                            const Icon = feature.icon;
                                            return (
                                                <div key={i} className="flex items-start gap-3 text-slate-600">
                                                    {/* Icons kept colorful (google gradient) */}
                                                    <div className="mt-0.5 p-1.5 rounded-full flex-shrink-0 bg-white shadow-sm border border-slate-100">
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
