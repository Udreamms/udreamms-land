"use client";

import { FadeIn } from "./Animations";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
    return (
        <section className="bg-white py-24">
            <div className="container mx-auto px-6 max-w-3xl">
                <FadeIn className="text-center mb-16">
                    <h2 className="text-3xl font-black italic text-slate-900 mb-4">PREGUNTAS DEL HINCHA</h2>
                    <p className="text-slate-600">Todo lo que necesitas saber antes del viaje.</p>
                </FadeIn>

                <FadeIn delay={0.2} className="space-y-4">
                    {/* FAQ Item 1 */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors group">
                            <span className="font-bold text-slate-900">¿Necesito visa separada para Canada/Mexico?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-yellow-500 transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            Depende de tu nacionalidad. USA requiere visa B1/B2. Canadá a veces solo eTA si ya tienes visa USA. Nuestro paquete incluye el análisis completo de tu ruta para que no te falte ningún papel.
                        </div>
                    </div>

                    {/* FAQ Item 2 */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors group">
                            <span className="font-bold text-slate-900">¿El Radar garantiza la cita?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-yellow-500 transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            El Radar monitorea 24/7. Históricamente conseguimos adelantos para el 92% de nuestros clientes en los primeros 14 días. Si no hay cupos, te ponemos en lista de espera prioritaria.
                        </div>
                    </div>

                    {/* FAQ Item 3 */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors group">
                            <span className="font-bold text-slate-900">¿Ayudan con boletos de partido?</span>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-yellow-500 transition-colors" />
                        </button>
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            Nos enfocamos en la logística legal y consular. Sin embargo, nuestra comunidad VIP suele tener acceso a preventas y reventa segura verificada entre miembros.
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
