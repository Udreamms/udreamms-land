"use client";

import { FadeIn } from "../_components/Animations";
import { ChevronDown, Lock } from "lucide-react";

export default function FAQSection() {
    return (
        <section className="bg-slate-50 py-24">
            <div className="container mx-auto px-6 max-w-3xl">
                <FadeIn className="text-center mb-16">
                    <h2 className="text-3xl font-medium text-abyss font-playfair mb-4 tracking-tight">Preguntas Frecuentes</h2>
                    <p className="text-slate-600">Resolvemos tus dudas sobre el proceso F-1.</p>
                </FadeIn>

                <FadeIn delay={0.2} className="space-y-4">
                    {/* FAQ Item 1 */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors group">
                            <span className="font-medium text-abyss">¿Necesito inglés perfecto?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            No necesariamente. Muchas universidades ofrecen programas de "Conditional Admission" donde estudias inglés primero. Te ayudamos a encontrar estas opciones.
                        </div>
                    </div>

                    {/* FAQ Item 2 */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors group">
                            <span className="font-medium text-abyss">¿Puedo trabajar en USA?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed flex items-start gap-3">
                            <span>
                                Con visa F-1 puedes trabajar legalmente en el campus hasta 20 horas/semana. Luego de graduarte, puedes aplicar a OPT (Optional Practical Training) para trabajar 1-3 años en tu área.
                            </span>
                        </div>
                    </div>

                    {/* FAQ Item 3 */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors group">
                            <span className="font-medium text-abyss">¿Qué pasa si me niegan la visa?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            Un rechazo no es el fin. Analizamos la causa (seccion 214b usualmente) y re-aplicamos con una estrategia corregida. Nuestra tasa de éxito en re-aplicaciones es muy alta.
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
