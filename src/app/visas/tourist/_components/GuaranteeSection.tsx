"use client";

import { FadeIn } from "./Animations";
import { Shield, CheckCircle2 } from "lucide-react";

export default function GuaranteeSection() {
    return (
        <section className="bg-white py-20 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <FadeIn className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-abyss font-playfair mb-4">Garantía de Confianza Total</h2>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Entendemos que este es un paso importante. Por eso, si después de tu primera sesión de simulacro no te sientes con más confianza que antes, <strong className="text-abyss">te regalamos una segunda sesión de refuerzo totalmente GRATIS</strong>.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-gold" /> Sin letra chica
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-gold" /> Compromiso de Calidad
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
