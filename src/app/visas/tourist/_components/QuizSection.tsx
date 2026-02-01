"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { FadeIn } from "./Animations";

export default function QuizSection() {
    const [step, setStep] = useState(1);

    return (
        <section id="quiz" className="py-24 bg-cloud">
            <div className="container mx-auto px-6 max-w-2xl">
                <FadeIn className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    {step === 1 && (
                        <div className="space-y-6 fade-in">
                            <h2 className="text-2xl font-bold text-center mb-2 text-abyss">Verificar Disponibilidad de Cupo</h2>
                            <p className="text-center text-slate-600 mb-8">Debido a la alta demanda, responde 3 preguntas para confirmar si calificas para uno de los últimos lugares.</p>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-700">¿Tienes familiares directos viviendo en USA?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" onClick={() => setStep(2)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">Sí</Button>
                                    <Button variant="outline" onClick={() => setStep(2)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">No</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 fade-in">
                            <h2 className="text-2xl font-bold text-center mb-8 text-abyss">Situación Laboral</h2>
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-700">¿Trabajas o estudias actualmente?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" onClick={() => setStep(3)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">Sí, trabajo/estudio</Button>
                                    <Button variant="outline" onClick={() => setStep(3)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">No actualmente</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center fade-in">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-abyss">¡Tienes un perfil apto!</h2>
                            <p className="text-slate-600 mb-8">Tu perfil muestra lazos fuertes. Vamos a blindarlo para asegurar esa aprobación.</p>

                            <div className="bg-slate-50 p-6 rounded-xl mb-8 text-left border border-slate-100">
                                <h3 className="font-bold mb-2 text-abyss">Asesoría Inicial + Revisión</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Precio especial hoy:</span>
                                    <span className="text-xl font-bold text-abyss">$49 USD</span>
                                </div>
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90 h-14 text-lg rounded-xl text-white shadow-lg shadow-primary/20 transform transition hover:scale-[1.02]">
                                Agendar Asesoría Ahora
                            </Button>

                            <p className="text-xs text-slate-400 mt-6 italic">
                                "Pensé que me la negarían y Udreamms me preparó para preguntas que no esperaba" - Cliente Satisfecho
                            </p>
                        </div>
                    )}
                </FadeIn>
            </div>
        </section>
    );
}
