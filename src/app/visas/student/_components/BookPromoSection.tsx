"use client";

import { motion } from "framer-motion";
import { FadeIn, ScaleIn } from "./Animations";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingCart } from "lucide-react";

export default function BookPromoSection() {
    return (
        <section className="bg-black py-32 relative overflow-hidden font-sans">

            <div className="container max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Contenido Izquierdo */}
                    <div className="flex-1 text-center lg:text-left">
                        <FadeIn>
                            <h2 className="text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight mb-6">
                                ¿Te gustaría hacer el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] font-normal">proceso por ti mismo?</span>
                            </h2>
                            <p className="text-base text-slate-300 leading-relaxed mb-6">
                                Udreamms creó este libro digital para guiarte paso a paso en tu proceso de visa, para que puedas hacerlo a tu ritmo y sin complicaciones.
                            </p>
                            
                            <div className="mb-6 inline-block text-left w-full max-w-lg">
                                <h3 className="text-xl font-medium text-white mb-4">Dentro del libro encontrarás:</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Links oficiales de todo el proceso migratorio",
                                        "Paso a paso para completar correctamente tu información",
                                        "Técnicas para responder las preguntas de la embajada",
                                        "Y mucho más contenido práctico"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-sm text-slate-300 font-normal leading-relaxed">• {item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Imagen Derecha y Botón */}
                    <div className="flex-1 w-full max-w-md mx-auto flex flex-col items-center">
                        <ScaleIn>
                            <div className="relative w-full aspect-[4/5] mx-auto overflow-hidden">
                                <img 
                                    src="/book-udreamms.jpeg" 
                                    alt="Libro Digital Udreamms - Paso a paso para tu visa" 
                                    className="w-full h-full object-cover block"
                                />
                                {/* Difuminado súper pesado para perder completamente los bordes en el fondo negro */}
                                <div className="absolute inset-0 shadow-[inset_0_0_150px_100px_#050507] pointer-events-none"></div>
                                <div className="absolute inset-0 shadow-[inset_0_0_80px_40px_#050507] pointer-events-none"></div>
                            </div>
                        </ScaleIn>

                        <div className="mt-8 w-full flex justify-center">
                            <Button asChild className="rounded-full px-8 py-3 w-full bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] border border-[#2d1b4e] hover:[transition-property:transform,box-shadow] hover:scale-105 text-white font-medium tracking-wide text-base transition-all active:scale-95 shadow-lg">
                                <a href="https://buy.stripe.com/bJeeVdckP87851w2HxenS0D" target="_blank" rel="noopener noreferrer">
                                    Obtener libro
                                </a>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
