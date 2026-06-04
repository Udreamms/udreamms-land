"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { FadeIn } from "../_components/Animations";

export default function QuizSection() {
    const [step, setStep] = useState(1);

    return (
        <section id="quiz" className="py-24 bg-cloud">
            <div className="container mx-auto px-6 max-w-2xl">
                <FadeIn className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    {step === 1 && (
                        <div className="space-y-6 fade-in">
                            <h2 className="text-2xl font-medium text-center mb-8 text-abyss tracking-tight">Verifica si Calificas</h2>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-700">1. ¿Tienes pasaporte vigente para viajar a EE. UU.?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" onClick={() => setStep(2)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">Sí</Button>
                                    <Button variant="outline" onClick={() => setStep(2)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">No</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 fade-in">
                            <h2 className="text-2xl font-medium text-center mb-8 text-abyss tracking-tight">Verifica si Calificas</h2>
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-700">2. ¿Planeas viajar a Estados Unidos por turismo en los próximos 12 meses?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" onClick={() => setStep(3)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">Sí</Button>
                                    <Button variant="outline" onClick={() => setStep(3)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">No</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 fade-in">
                            <h2 className="text-2xl font-medium text-center mb-8 text-abyss tracking-tight">Verifica si Calificas</h2>
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-700">3. ¿Estás listo para iniciar tu trámite y gestión de viaje con nuestro equipo?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" onClick={() => setStep(4)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">Sí</Button>
                                    <Button variant="outline" onClick={() => setStep(4)} className="h-12 border-slate-200 hover:border-primary hover:text-abyss hover:bg-primary/5 transition-all">No</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center fade-in">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-medium mb-4 text-abyss tracking-tight">¡Felicidades! Cumples con los requisitos.</h2>
                            <p className="text-slate-600 mb-8">Reserva tu plan antes de que se agoten los últimos cupos.</p>

                            <a
                                href="https://wa.me/13858882799?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] h-14 text-lg rounded-xl text-white shadow-lg shadow-green-500/20 transform transition hover:scale-[1.02] flex items-center justify-center gap-2 font-medium"
                            >
                                Contactar por WhatsApp
                            </a>
                        </div>
                    )}
                </FadeIn>
            </div>
        </section>
    );
}
