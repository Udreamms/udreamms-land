"use client";

import { FadeIn } from "./Animations";
import { CheckCircle2, Sparkles, Quote } from "lucide-react";

export default function SocialProofSection() {
    return (
        <section className="bg-slate-50 border-t border-slate-200">
            {/* Stats Bar */}
            <div className="bg-abyss text-white py-12">
                <div className="container mx-auto px-6 max-w-6xl">
                    <FadeIn className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x divide-slate-800/50">
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-blue-400">$5M+</div>
                            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Becas Gestionadas</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-green-400">98%</div>
                            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Aprobación F-1</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-purple-400">50+</div>
                            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Universidades Aliadas</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-yellow-400">200+</div>
                            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Estudiantes en USA</div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-24 container mx-auto px-6 max-w-6xl">
                <FadeIn className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-abyss font-playfair mb-4">Tu Futuro Visualizado</h2>
                    <p className="text-slate-600">Historias de quienes hoy caminan por el campus de sus sueños.</p>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Review 1 */}
                    <FadeIn delay={0.1} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xl">VM</div>
                            <div>
                                <div className="font-bold text-sm text-abyss">Valentina M.</div>
                                <div className="text-xs text-blue-500 flex items-center gap-1">
                                    Admitida en NYU
                                </div>
                            </div>
                            <Quote className="ml-auto w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-slate-600 text-sm italic flex-grow">
                            "Mi mayor miedo era la entrevista. El equipo hizo un simulacro tan real que cuando llegué a la embajada, sentí que ya lo había vivido."
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 text-gold fill-gold" />)}
                        </div>
                    </FadeIn>

                    {/* Review 2 */}
                    <FadeIn delay={0.2} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">Beca 80%</div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-xl">JR</div>
                            <div>
                                <div className="font-bold text-sm text-abyss">Juan R.</div>
                                <div className="text-xs text-purple-500">Georgia Tech</div>
                            </div>
                            <Quote className="ml-auto w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-slate-600 text-sm italic flex-grow">
                            "Pensé que mis finanzas no daban. La auditoría encontró errores que me hubieran costado la visa. Me ayudaron a estructurar todo."
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 text-gold fill-gold" />)}
                        </div>
                    </FadeIn>

                    {/* Review 3 */}
                    <FadeIn delay={0.3} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center font-bold text-white text-xl">SC</div>
                            <div>
                                <div className="font-bold text-sm text-abyss">Sofia C.</div>
                                <div className="text-xs text-orange-500">Berklee College</div>
                            </div>
                            <Quote className="ml-auto w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-slate-600 text-sm italic flex-grow">
                            "El proceso es confuso, pero se encargaron de todo. Terminé en una universidad mejor de lo que imaginaba gracias a su lista estratégica."
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 text-gold fill-gold" />)}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
