"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function BuyCtaSection() {
    const scrollToPlanes = () => {
        document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="py-32 bg-white relative overflow-hidden border-t border-slate-50">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="max-w-6xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-medium text-slate-900 mb-8 leading-[1.1] tracking-tighter">
                            ¿Todo listo para <br />
                            <span className="text-blue-600">tu aventura en USA?</span>
                        </h2>

                        <p className="text-slate-500 text-xl md:text-2xl mb-16 max-w-3xl mx-auto font-normal leading-relaxed">
                            Selecciona el plan que mejor se adapte a tus necesidades.
                        </p>

                        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-6">
                            <Button
                                size="lg"
                                onClick={scrollToPlanes}
                                className="w-full sm:w-64 rounded-full py-8 font-medium text-lg shadow-lg transition-all duration-300 active:scale-95 border-2 bg-white text-slate-900 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                            >
                                Plan Básico
                            </Button>
                            <Button
                                size="lg"
                                onClick={scrollToPlanes}
                                className="w-full sm:w-64 rounded-full py-8 font-medium text-lg shadow-lg transition-all duration-300 active:scale-95 border-2 bg-white text-slate-900 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                            >
                                Plan Premium
                            </Button>
                            <Button
                                size="lg"
                                onClick={scrollToPlanes}
                                className="w-full sm:w-64 rounded-full py-8 font-medium text-lg shadow-lg transition-all duration-300 active:scale-95 border-2 bg-white text-slate-900 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                            >
                                Experiencia VIP
                            </Button>
                        </div>

                        <p className="mt-20 text-[10px] text-slate-400 font-medium tracking-[0.3em] uppercase">
                            Pago 100% Seguro • Soporte 24/7 • Gestión Integral
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
