"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FadeIn } from "../_components/Animations";

export default function QuizSection() {
    const [showForm, setShowForm] = useState(false);

    return (
        <section id="quiz" className="py-24 bg-cloud">
            <div className="container mx-auto px-6 max-w-2xl text-center">
                <FadeIn>
                    <h2 className="text-3xl font-medium mb-8 text-abyss tracking-tight">¿Listo para comenzar tu viaje académico?</h2>
                    <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white h-16 px-10 rounded-xl text-xl font-medium shadow-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
                        Iniciar Evaluación de Perfil F-1 <ArrowRight className="w-6 h-6" />
                    </Button>
                    <p className="mt-4 text-sm text-slate-500">
                        Evaluación gratuita de 2 minutos.
                    </p>
                </FadeIn>
            </div>

            {/* Lead Gen Form Modal - Embedded logic specific to Student */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Evaluación de Perfil F-1</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre Completo</label>
                            <Input placeholder="Tu nombre" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">WhatsApp</label>
                            <Input placeholder="+1 234 567 890" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nivel de Estudios Actual</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="highschool">Secundaria / Bachillerato</SelectItem>
                                    <SelectItem value="university">Universitario</SelectItem>
                                    <SelectItem value="professional">Profesional / Postgrado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                            Ver Probabilidades
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
