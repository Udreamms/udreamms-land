"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BuyCtaSection() {
    const router = useRouter();

    const goToInstructions = (plan: string) => {
        router.push(`/instructions-payment-tourist?plan=${plan}`);
    };

    return (
        <section className="py-32 bg-transparent relative overflow-hidden border-t border-white/10">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="max-w-6xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-medium text-white mb-8 leading-[1.1] tracking-tighter">
                            ¿Todo listo para <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]">tu aventura en USA?</span>
                        </h2>

                        <p className="text-slate-300 text-xl md:text-2xl mb-16 max-w-3xl mx-auto font-normal leading-relaxed">
                            Selecciona el plan que mejor se adapte a tus necesidades.
                        </p>

                        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-6">
                            <Button
                                size="lg"
                                onClick={() => goToInstructions('basico')}
                                className="w-full sm:w-64 rounded-full py-4 font-medium text-lg shadow-xl transition-all duration-300 active:scale-95 border-2 bg-transparent text-white border-white/20 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                            >
                                Plan Básico
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => goToInstructions('premium')}
                                className="w-full sm:w-64 rounded-full py-4 font-medium text-lg shadow-xl transition-all duration-300 active:scale-95 border-2 bg-transparent text-white border-white/20 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                            >
                                Plan Premium
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => goToInstructions('vip')}
                                className="w-full sm:w-64 rounded-full py-4 font-medium text-lg shadow-xl transition-all duration-300 active:scale-95 border-2 bg-transparent text-white border-white/20 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                            >
                                Experiencia VIP
                            </Button>
                        </div>

                        <p className="mt-20 text-[10px] text-slate-500 font-medium tracking-[0.3em] uppercase">
                            Pago 100% Seguro • Soporte 24/7 • Gestión Integral
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
