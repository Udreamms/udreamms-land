"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Check } from "lucide-react";
import { FadeIn } from "./Animations";

export default function QuizSection() {
    // FIFA "Quiz" is effectively the final CTA block
    return (
        <section id="quiz" className="py-24 bg-black text-center px-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-600/20 via-black to-black opacity-50 pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <FadeIn>
                    <h2 className="text-4xl md:text-6xl font-medium mb-8 leading-none text-white tracking-tight">
                        LA COPA NO ESPERA.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">TU ASIENTO SE ENFRÍA.</span>
                    </h2>

                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-md mb-8">
                        <div className="flex flex-col gap-4 mb-8 text-left max-w-lg mx-auto">
                            <div className="flex items-center gap-3 text-lg text-gray-300">
                                <Check className="text-green-500 w-6 h-6 shrink-0" /> <span className="font-medium tracking-tight">Activación Inmediata del Radar</span>
                            </div>
                            <div className="flex items-center gap-3 text-lg text-gray-300">
                                <Check className="text-green-500 w-6 h-6 shrink-0" /> <span className="font-medium tracking-tight">Acceso a la Comunidad "Mundialistas"</span>
                            </div>
                            <div className="flex items-center gap-3 text-lg text-gray-300">
                                <Check className="text-green-500 w-6 h-6 shrink-0" /> <span className="font-medium tracking-tight">Guía de Sedes 2026 de regalo</span>
                            </div>
                        </div>

                        <a
                            href="https://wa.me/1234567890?text=Hola,%20quiero%20activar%20mi%20Radar%20de%20Citas%20para%20el%20Mundial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-[#25D366] hover:bg-[#1efc76] text-black font-medium py-6 rounded-2xl text-xl md:text-2xl transition-all shadow-[0_0_40px_rgba(37,211,102,0.3)] hover:scale-[1.02] flex items-center justify-center gap-3"
                        >
                            <MessageCircle className="w-8 h-8" />
                            ACTIVAR MI PLAN MUNDIALISTA
                        </a>
                        <p className="mt-4 text-sm text-gray-500">Respuesta promedio: 3 minutos • 24/7</p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
