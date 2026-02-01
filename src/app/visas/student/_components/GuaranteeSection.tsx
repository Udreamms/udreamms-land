"use client";

import { FadeIn } from "./Animations";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function GuaranteeSection() {
    return (
        <section className="bg-white py-20 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <FadeIn className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-blue-200">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-abyss font-playfair mb-4">Garantía de Validez Académica</h2>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Si tras nuestra evaluación inicial no podemos presentarte <strong className="text-blue-600">al menos 3 opciones universitarias reales</strong> que se ajusten a tu perfil y presupuesto, te devolvemos el 100% de tu inversión en la consulta.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-500" /> Riesgo Cero
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-500" /> Transparencia Total
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
