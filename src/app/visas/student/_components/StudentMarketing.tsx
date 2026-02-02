"use client";

import { motion } from "framer-motion";
import { FadeIn, ScaleIn } from "./Animations";
import {
    AlertTriangle, CheckCircle2, GraduationCap,
    ShieldCheck, BrainCircuit, Plane, Home,
    BookOpen, Languages, Sparkles, Quote, ChevronDown, ChevronUp
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import Roadmap from "@/components/landing/Roadmap";
import Services from "@/components/landing/Services";

interface StudentMarketingProps {
    onStartQuote?: () => void;
    onAppClick?: () => void;
}

export default function StudentMarketing({ onStartQuote, onAppClick }: StudentMarketingProps) {
    return (
        <section className="bg-white text-abyss">



            {/* SECCIÓN DE SERVICIOS AGREGADA ARRIBA DEL ROADMAP */}
            <Services onStartQuote={onStartQuote} onAppClick={onAppClick} />

            {/* B. EL PROBLEMA REEMPLAZADO POR ROADMAP */}
            <Roadmap />





        </section>
    );
}
