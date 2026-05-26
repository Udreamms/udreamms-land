"use client";

import { FadeIn } from "../_components/Animations";
import { Shield, CheckCircle2 } from "lucide-react";

export default function GuaranteeSection() {
    return (
        <section className="bg-white py-20 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <FadeIn className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-medium text-abyss font-playfair mb-4 tracking-tight">Garantía de Gestión Experta</h2>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Nos encargamos de todo el proceso de tu visa de turista y la planificación de tu viaje. Desde la documentación hasta las reservas, tú solo tienes que preocuparte por <strong className="text-abyss">disfrutar.</strong>
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-gold" /> Todo gestionado
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-gold" /> Sin sorpresas ni letra chica
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
