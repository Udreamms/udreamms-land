"use client";

import { motion } from "framer-motion";
import { FadeIn, ScaleIn } from "../_components/Animations";
import {
    AlertTriangle, CheckCircle2, GraduationCap,
    ShieldCheck, BrainCircuit, Plane, Home,
    BookOpen, Languages, Sparkles, Quote, ChevronDown, ChevronUp
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
// import Roadmap from "@/components/landing/Roadmap"; // Component missing
import Services from "@/frontend/modules/marketing/home/secciones-ocultar/Services";

interface StudentMarketingProps {
    onStartQuote?: () => void;
    onAppClick?: () => void;
}

export default function StudentMarketing({ onStartQuote, onAppClick }: StudentMarketingProps) {
    return (
        <section className="bg-white text-abyss">
            {/* SECCIÓN DE SERVICIOS AGREGADA ARRIBA DEL ROADMAP */}
            <Services onStartQuote={onStartQuote} onAppClick={onAppClick} />

            {/* B. EL PROBLEMA REEMPLAZADO POR ROADMAP - Componente eliminado por faltar */}
            {/* <Roadmap /> */}
        </section>
    );
}
