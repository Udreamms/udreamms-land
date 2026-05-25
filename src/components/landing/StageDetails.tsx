"use client";

import { motion } from "framer-motion";
import {
  FileCheck,
  GraduationCap,
  Plane,
  Smartphone,
  ArrowRight,
  Target,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stages = [
  {
    id: 1,
    tag: "FASE 1",
    title: "Preparándote para tu gran aventura",
    description: "Aún no cumples con los requisitos para aplicar a una escuela en Estados Unidos.",
    icon: FileCheck,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    supportText: "¿Cómo Udreamms te apoya en esta fase?",
    bullets: [
      { text: "Clases de inglés online para avanzar tu nivel.", action: "Ver Clases" },
      { text: "Programa de referidos para generar ingresos ($50 por cada referido).", action: "Programa de referidos" }
    ],
    objective: "construir las bases para avanzar al siguiente paso."
  },
  {
    id: 2,
    tag: "FASE 2",
    title: "Iniciando tu proceso migratorio",
    description: "Ya cuentas con los documentos necesarios para iniciar tu aplicación a una escuela.",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
    supportText: "¿Cómo Udreamms te apoya en esta fase?",
    bullets: [
      { text: "Asesoría migratoria (Plan Esencial).", action: "Ver Plan" },
      { text: "Aplicación a escuelas en Estados Unidos." },
      { text: "Simulación de entrevista para tu visa." }
    ],
    objective: "obtener tu aceptación en una institución."
  },
  {
    id: 3,
    tag: "FASE 3",
    title: "Organizando tu viaje a Estados Unidos",
    description: "Ya fuiste aceptado y tienes tu visa de estudiante.",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f?q=80&w=800&auto=format&fit=crop",
    supportText: "¿Cómo Udreamms te apoya en esta fase?",
    bullets: [
      { text: "Planes de acompañamiento: PRO, ELITE, ALL INCLUSIVE", action: "Ver Planes" },
      { text: "Guía para licencia de conducir." },
      { text: "Apertura de cuenta bancaria." },
      { text: "Chip de celular." },
      { text: "Búsqueda de vivienda." },
      { text: "Vuelos económicos." },
      { text: "Pick up en aeropuerto." },
      { text: "Clases de inglés (según plan)." },
      { text: "Mentoría de adaptación." }
    ],
    extraInfo: "ALL INCLUSIVE incluye además: Ticket aéreo, 4 meses de vivienda, 4 meses de inglés, 2 meses de mentoría.",
    objective: "llegar preparado y comenzar tu nueva vida en EE.UU."
  },
  {
    id: 4,
    tag: "FASE 4",
    title: "Tus primeros días en Estados Unidos",
    description: "Ya estás en Estados Unidos y empieza tu crecimiento.",
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop",
    supportText: "¿Cómo Udreamms te apoya en esta fase?",
    bullets: [
      { text: "Acceso a Udreamms App con herramientas exclusivas." },
      { text: "Recursos para adaptación y crecimiento." },
      { text: "Herramientas para tu vida académica y personal." },
      { text: "Acceso a oportunidades y guías prácticas." },
      { text: "Soporte continuo." }
    ],
    actionBottom: "Descargar App",
    objective: "crecer, desarrollarte y alcanzar tus metas en EE.UU."
  }
];

export default function StageDetails() {
  return (
    <section className="pt-32 bg-white overflow-hidden" id="fases-viaje">
      <div className="container mx-auto px-6 max-w-[1600px]">

        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 text-slate-900">
            ¡Identifica en qué fase <br />
            te encuentras!
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
            Identifica dónde estás en tu viaje y descubre cómo te podemos ayudar hoy mismo.
          </p>
        </div>

        {/* CSS Grid for nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-32">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className="group relative w-full flex flex-col justify-start rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white/90 backdrop-blur-sm border border-slate-200 transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                >
                  {/* Content Layout */}
                  <div className="relative p-6 w-full flex flex-col h-full z-10">
                    
                    {/* Header line: Icon and Tag with NO containers */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-[#9b4dca]">
                        <Icon size={24} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]">
                        {stage.tag}
                      </span>
                    </div>
                    
                    {stage.title && (
                      <h4 className={`text-lg md:text-xl font-medium tracking-tight leading-snug mb-2 ${stage.id === 3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] font-bold' : 'text-slate-900'}`}>
                        {stage.title}
                      </h4>
                    )}
                    
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-5">
                      {stage.description}
                    </p>

                    {/* How we help section */}
                    <div className="flex-1 border-t border-slate-100 pt-5">
                      <p className="font-medium text-xs mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]">
                        {stage.supportText}
                      </p>
                      
                      <ul className="space-y-3 mb-6">
                        {stage.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-600 leading-relaxed">{bullet.text}</span>
                          </li>
                        ))}
                      </ul>

                      {stage.extraInfo && (
                        <div className="mb-6">
                          <p className="text-[11px] text-emerald-600 leading-relaxed font-medium flex gap-2 items-start">
                            <span className="text-emerald-500 font-bold mt-0.5">★</span>
                            {stage.extraInfo}
                          </p>
                        </div>
                      )}

                      {stage.actionBottom && (
                        <div className="w-full mt-auto mb-5 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-[#9b4dca] uppercase tracking-wider mb-2">
                            Próximamente
                          </span>
                          <button className="w-full text-xs font-medium text-white bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] hover:opacity-90 py-3 rounded-full transition-all shadow-md transform hover:-translate-y-0.5">
                            {stage.actionBottom}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Objective without container */}
                    <div className="mt-auto flex items-start gap-2 pt-2">
                      <Target className="w-4 h-4 text-[#9b4dca] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong className="text-slate-800 font-medium">Objetivo: </strong> 
                        {stage.objective}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
