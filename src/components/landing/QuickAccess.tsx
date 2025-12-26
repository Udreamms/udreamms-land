"use client";

import { Map, BookOpen, School, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function QuickAccess() {
  const cards = [
    {
      icon: Map,
      title: "¿En qué etapa estás?",
      description: "Descubre tu camino ideal hacia Estados Unidos con nuestro roadmap interactivo.",
      action: "Ver Roadmap",
      href: "#roadmap", // Scroll al roadmap
      isScroll: true
    },
    {
      icon: BookOpen,
      title: "Descarga la Guía",
      description: "Obtén gratis nuestra guía completa con todo lo que necesitas saber para estudiar en USA.",
      action: "Descargar Gratis",
      href: "/brochures",
      isScroll: false
    },
    {
      icon: School,
      title: "Escuelas Aliadas",
      description: "Conoce las prestigiosas instituciones donde podrás estudiar y vivir tu experiencia.",
      action: "Ver Escuelas",
      href: "/destinos",
      isScroll: false
    }
  ];

  const handleClick = (e: React.MouseEvent, href: string, isScroll: boolean) => {
    if (isScroll) {
      e.preventDefault();
      const element = document.getElementById(href.replace('#', ''));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-white relative z-20">
      <div className="container mx-auto px-4">
        {/* ELIMINADO: -mt-32. Ahora es un grid normal sin superposición */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Link 
              href={card.href}
              key={index}
              onClick={(e) => handleClick(e, card.href, card.isScroll)}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group flex flex-col items-start"
            >
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
                <card.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              
              <p className="text-gray-500 mb-6 leading-relaxed flex-grow">
                {card.description}
              </p>
              
              <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                {card.action} <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
