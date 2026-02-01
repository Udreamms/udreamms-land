"use client";

import { FadeIn } from "./Animations";
import { ChevronDown, Lock } from "lucide-react";

export default function FAQSection() {
    return (
        <section className="bg-slate-50 py-24">
            <div className="container mx-auto px-6 max-w-3xl">
                <FadeIn className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-abyss font-playfair mb-4">Preguntas Frecuentes</h2>
                    <p className="text-slate-600">Resolvemos tus dudas antes de empezar.</p>
                </FadeIn>

                <FadeIn delay={0.2} className="space-y-4">
                    {/* FAQ Item 1 */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors group">
                            <span className="font-bold text-abyss">¿Qué pasa si me niegan la visa?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            Aunque ningún asesor puede garantizarte la visa al 100% (la decisión final es del oficial), nuestro método reduce drásticamente el margen de error humano, que es la causa del 35% de los rechazos. Te preparamos para que tu perfil brille.
                        </div>
                    </div>

                    {/* FAQ Item 2 */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors group">
                            <span className="font-bold text-abyss">¿Es seguro pagar en línea?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed flex items-start gap-3">
                            <Lock className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                            <span>
                                Absolutamente. Utilizamos pasarelas de pago encriptadas (como Stripe/PayPal) que protegen tus datos bancarios. Nosotros nunca vemos tu información financiera.
                            </span>
                        </div>
                    </div>

                    {/* FAQ Item 3 */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors group">
                            <span className="font-bold text-abyss">¿Cuánto tarda todo el proceso?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            La preparación de tu perfil y el llenado del formulario nos toma entre 24 a 48 horas una vez recibimos tu información. La fecha de la entrevista depende de la disponibilidad de la Embajada, pero te ayudamos a buscar citas cercanas.
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
