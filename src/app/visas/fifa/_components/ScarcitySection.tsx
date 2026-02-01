"use client";

import { FadeIn } from "./Animations";
import { Megaphone } from "lucide-react";

export default function ScarcitySection() {
    return (
        <div className="bg-black text-center py-6 px-4">
            <FadeIn className="inline-flex items-center gap-3 bg-red-600/20 text-red-500 px-6 py-2 rounded-full border border-red-500/50 animate-pulse">
                <Megaphone className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wider uppercase">ÚLTIMO LLAMADO: GRUPO ABRIL 2026</span>
            </FadeIn>
        </div>
    );
}
