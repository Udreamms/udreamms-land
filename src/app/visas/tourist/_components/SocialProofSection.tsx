"use client";

import { FadeIn } from "./Animations";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function SocialProofSection() {
    return (
        <section className="bg-slate-50 border-t border-slate-200">
            {/* Stats Bar */}
            <div className="bg-abyss text-white py-12">
                <div className="container mx-auto px-6 max-w-6xl">
                    <FadeIn className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x divide-slate-800/50">
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-gold">98%</div>
                            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Aprobación Visa Americana</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-gold">500+</div>
                            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Visas de Turismo B1/B2</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-gold">15k</div>
                            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Citas Consulares</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-gold">24/7</div>
                            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Asesoría Migratoria</div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Testimonials (Real Chat Style) */}
            <div className="py-24 container mx-auto px-6 max-w-6xl">
                <FadeIn className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-abyss font-playfair mb-4">No confíes en nuestra palabra...</h2>
                    <p className="text-slate-600">Confía en los resultados de quienes ya están viajando.</p>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Review 1 */}
                    <FadeIn delay={0.1} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-green-100">
                                <img src="/assets/generated/testimonial_man.png" alt="Jose Martinez" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-abyss">Jose Martinez</div>
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Verificado
                                </div>
                            </div>
                            <div className="ml-auto flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 text-gold fill-gold" />)}
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm italic flex-grow">
                            "Increíble, en 2 semanas ya tenía mi cita. Pensé que por ser joven me negarían, pero el <strong className="text-abyss">Perfil Blindado</strong> hizo la diferencia."
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
                            Hace 2 días • Visa de Turismo
                        </div>
                    </FadeIn>

                    {/* Review 2 (WhatsApp Style) */}
                    <FadeIn delay={0.2} className="bg-[#E5DDD5] p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-[#d4d4d4] flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#00A884]"></div>
                        <div className="flex items-center gap-3 mb-4 mt-2">
                            <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white/50">
                                <img src="/assets/generated/testimonial_woman.png" alt="Ana Ruiz" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-abyss">Ana Ruiz</div>
                                <div className="text-xs text-slate-500">En línea</div>
                            </div>
                        </div>

                        <div className="bg-white p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg shadow-sm mb-2 self-start max-w-[90%]">
                            <p className="text-slate-700 text-sm">
                                ¡Chicos! ¡¡APROBADA!! 😭🇺🇸
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg shadow-sm self-start max-w-[90%]">
                            <p className="text-slate-700 text-sm">
                                Me preguntaron EXACTAMENTE lo que practicamos en el simulacro. No me puse nerviosa para nada. ¡Gracias!
                            </p>
                            <div className="text-[10px] text-slate-400 text-right mt-1 flex items-center justify-end gap-1">
                                10:42 AM <div className="text-blue-400 font-bold">✓✓</div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Review 3 */}
                    <FadeIn delay={0.3} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">CD</div>
                            <div>
                                <div className="font-bold text-sm text-abyss">Carlos Diaz</div>
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Verificado
                                </div>
                            </div>
                            <div className="ml-auto flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 text-gold fill-gold" />)}
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm italic flex-grow">
                            "Había sido rechazado 2 veces antes. Con SmartVisa entendí mis errores. La inversión valió cada centavo solo por la tranquilidad."
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
                            Hace 1 semana • Renovación
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
