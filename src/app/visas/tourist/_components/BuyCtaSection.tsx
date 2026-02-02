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
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 leading-[0.9] tracking-tighter">
                                ¿Todo listo para <br />
                                <span className="text-blue-500">tu aventura en USA?</span>
                            </h2>

                            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
                                Selecciona el plan que mejor se adapte a tus necesidades y comienza tu proceso de visado hoy mismo con gestión experta garantizada.
                            </p>

                            <Button
                                size="lg"
                                onClick={scrollToPlanes}
                                className="bg-white hover:bg-slate-100 text-slate-900 text-xl px-12 py-8 rounded-full shadow-xl transition-all hover:scale-105 font-medium group"
                            >
                                <ShoppingCart className="mr-3 w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                                Comprar mi Plan de Visa
                            </Button>

                            <p className="mt-8 text-sm text-gray-400 font-medium tracking-widest uppercase">
                                Pago 100% Seguro • Soporte 24/7 • Gestión Integral
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
