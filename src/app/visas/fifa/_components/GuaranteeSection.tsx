"use client";

import { FadeIn } from "./Animations";
import { BadgeCheck } from "lucide-react";

export default function GuaranteeSection() {
    return (
        <section className="bg-amber-50 relative overflow-hidden py-20 border-y border-amber-100">
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <FadeIn className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-amber-900/5 border border-amber-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-yellow-500/20">
                        <BadgeCheck className="w-12 h-12" />
                    </div>
                    <div className="text-center md:text-left flex-grow">
                        <h2 className="text-2xl md:text-3xl font-black italic text-slate-900 mb-3">GARANTÍA "PITAZO INICIAL"</h2>
                        <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                            Si obtenemos tu visa y por un error logístico de nuestra parte no llegas al partido, <strong className="text-yellow-600 bg-yellow-50 px-1">te reembolsamos tus honorarios + $500 USD en efectivo</strong>.
                        </p>
                        <p className="text-sm text-yellow-600 font-bold uppercase tracking-wide">TU RIESGO ES CERO. LA EMOCIÓN ES TOTAL.</p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
