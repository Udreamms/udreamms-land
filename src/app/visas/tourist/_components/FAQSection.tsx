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
                            La decisión final siempre es del oficial consular. Nuestro método revisa y optimiza tu DS-160 para reducir errores o incongruencias, que son la causa más común de rechazo por "falta de lazos".
                        </div>
                    </div>

                    {/* FAQ Item 2 */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors group">
                            <span className="font-bold text-abyss">¿Necesito comprar vuelos o reservar hoteles antes de la visa?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed flex items-start gap-3">
                            <Lock className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                            <span>
                                <strong>¡No!</strong> La Embajada recomienda no reservar nada hasta tener la visa aprobada. Nosotros creamos un itinerario tentativo que puedes usar para la entrevista, sin gastar dinero.
                            </span>
                        </div>
                    </div>

                    {/* FAQ Item 3 */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors group">
                            <span className="font-bold text-abyss">¿Puedo pagar mi plan en cuotas?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            Sí, ofrecemos opciones de pago flexibles según el plan, para que puedas acceder al servicio sin problemas.
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
