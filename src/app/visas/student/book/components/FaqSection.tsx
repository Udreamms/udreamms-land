"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FaqItem[] = [
    {
      question: "¿Qué es el libro digital de Udreamms y para qué sirve?",
      answer: "Es una guía completa que te enseña cómo obtener una visa de estudiante para Estados Unidos por tu cuenta, sin depender de una agencia. Pero no solo eso: también te muestra cómo moverte dentro del sistema como estudiante, desde acceder a recursos en EE. UU., entender costos de vida, hasta qué hacer si tu estatus cambia o está por vencer. Todo explicado de forma simple, con enlaces oficiales, pasos claros y orientación práctica para que sepas exactamente qué hacer en cada etapa."
    },
    {
      question: "¿Qué hace diferente a este libro?",
      answer: "No es teoría ni información genérica: es una guía práctica basada en el proceso real para aplicar a una visa de estudiante en Estados Unidos. A diferencia de otros recursos, aquí tienes el paso a paso completo, explicado de forma clara y estructurada, con enlaces oficiales, ejemplos y orientación que te lleva desde cero hasta entender todo el proceso sin confusión. Además, no se queda solo en la visa: también te prepara para la vida como estudiante en EE. UU., incluyendo recursos, costos y decisiones clave que normalmente nadie explica."
    },
    {
      question: "¿Necesito experiencia o ayuda de una agencia para poder aplicar a una visa de estudiante?",
      answer: "No. No necesitas experiencia previa ni pagar una agencia para iniciar tu proceso. De hecho, el sistema está diseñado para que cualquier persona pueda aplicar siguiendo los pasos correctos, siempre que tenga la información adecuada. Este libro te da exactamente eso: claridad, estructura y los recursos oficiales necesarios para que entiendas qué hacer, cómo hacerlo y en qué orden, sin depender de terceros ni pagar asesorías costosas."
    },
    {
      question: "¿Este libro aumenta mis posibilidades de obtener la visa?",
      answer: "Te ayuda a entender todo el proceso y evitar errores comunes que suelen hacer que muchas solicitudes se compliquen o se retrasen. La aprobación final siempre depende del consulado, pero tener claridad y seguir el proceso correcto marca una gran diferencia en cómo presentas tu solicitud."
    }
  ];

  return (
    <section className="w-full bg-black py-24 md:py-32 px-4 md:px-8 lg:px-12 font-sans flex flex-col items-center relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center font-sans">
        
        {/* Encabezado */}
        <div className="text-center flex flex-col space-y-4 max-w-2xl mx-auto mb-16 font-sans">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            Tus dudas resueltas <br /> de forma directa
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans">
            Encuentra claridad sobre visas, alojamiento y procesos académicos. Transparencia total desde el primer momento.
          </p>
        </div>

        {/* Acordeón de FAQs */}
        <div className="w-full max-w-4xl mx-auto border-t border-white/10 divide-y divide-white/10 font-sans">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-5 font-sans">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left py-2 font-sans focus:outline-none group"
                >
                  <span className="text-base md:text-lg font-bold text-white group-hover:text-slate-300 transition-colors">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 ml-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-slate-900 group-hover:bg-slate-800 transition-colors">
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "transform rotate-180 text-white" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-350 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed pl-1 pb-2">
                      {faq.answer}
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
