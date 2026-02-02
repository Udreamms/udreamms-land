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
                        <strong>Alta Demanda:</strong> Solo nos quedan <span className="bg-amber-200 px-2 py-0.5 rounded text-amber-900 border border-amber-300">4 cupos</span> para asesoría este mes.
                    </p>
                </div>
                <div className="hidden md:block w-px h-6 bg-amber-200" />
                <div className="flex items-center gap-2 text-xs text-amber-700">
                    <span>Progreso de cupos:</span>
                    <div className="w-32 h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-amber-500 rounded-full" />
                    </div>
                    <span className="font-medium">85%</span>
                </div>
            </FadeIn>
        </div>
    );
}
