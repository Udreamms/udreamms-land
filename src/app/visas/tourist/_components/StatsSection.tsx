"use client";

import { FadeIn } from "./Animations";

export default function StatsSection() {
    return (
        <section className="bg-white py-16 border-y border-gray-100">
            <div className="container mx-auto px-6 max-w-6xl">
                <FadeIn className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
                    <div className="space-y-2">
                        <div className="text-3xl md:text-5xl font-medium tracking-tighter text-black">98%</div>
                        <div className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-medium">Aprobación Visa Americana</div>
                    </div>
                    <div className="space-y-2 border-l border-gray-100">
                        <div className="text-3xl md:text-5xl font-medium tracking-tighter text-black">500+</div>
                        <div className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-medium">Visas de Turismo B1/B2</div>
                    </div>
                    <div className="space-y-2 border-l border-gray-100">
                        <div className="text-3xl md:text-5xl font-medium tracking-tighter text-black">15k</div>
                        <div className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-medium">Citas Consulares</div>
                    </div>
                    <div className="space-y-2 border-l border-gray-100">
                        <div className="text-3xl md:text-5xl font-medium tracking-tighter text-black">24/7</div>
                        <div className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-medium">Asesoría Migratoria</div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
