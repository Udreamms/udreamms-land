"use client";

import { Shield, Users, Globe, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Componente para animar el conteo
const CountUp = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={countRef} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

export default function Stats() {
  const stats = [
    {
      icon: Shield,
      number: 15,
      suffix: "+",
      title: "Años de Trayectoria",
      description: "Liderando el mercado educativo",
    },
    {
      icon: Users,
      number: 1250,
      suffix: "+",
      title: "Estudiantes Felices",
      description: "Sueños cumplidos en USA",
    },
    {
      icon: Globe,
      number: 25,
      suffix: "+",
      title: "Estados Disponibles",
      description: "Cobertura en todo el país",
    },
    {
      icon: CheckCircle2,
      number: 95,
      suffix: "%",
      title: "Tasa de Aprobación",
      description: "Garantía en tus trámites",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Elementos decorativos de fondo muy sutiles */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="container px-6 md:px-12 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 relative">
          
          {stats.map((stat, index) => {
            return (
              <div key={index} className="relative group flex flex-col items-center text-center">
                
                {/* Separador Vertical (Solo visible en Desktop entre columnas) */}
                {index !== 0 && (
                   <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-24 w-px bg-gray-100"></div>
                )}

                {/* Icono con fondo suave */}
                <div className="mb-6 p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:-translate-y-1">
                  <stat.icon className="w-8 h-8" strokeWidth={2} />
                </div>

                {/* Número Grande con Gradiente */}
                <div className="text-5xl md:text-6xl font-black mb-3 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                  <CountUp end={stat.number} suffix={stat.suffix} />
                </div>

                {/* Título y Descripción */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {stat.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium max-w-[200px] leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Borde inferior suave */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </section>
  );
}
