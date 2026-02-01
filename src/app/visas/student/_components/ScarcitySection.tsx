"use client";

import { FadeIn } from "./Animations";
import { Timer } from "lucide-react";

export default function ScarcitySection() {
    return (
        <div className="bg-amber-50 border-y border-amber-100 py-4">
            <FadeIn className="container mx-auto px-6 max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                <div className="flex items-center gap-3 text-amber-800">
                    <div className="p-2 bg-amber-100 rounded-full animate-pulse">
                        <Timer className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">
                        <strong>Próximo Intake Fall 2025:</strong> Cierre de aplicaciones inminente. Quedan <span className="bg-amber-200 px-2 py-0.5 rounded text-amber-900 border border-amber-300">pocos cupos</span>.
                    </p>
                </div>
            </FadeIn>
        </div>
    );
}
