"use client";

import { Shield, Users, Globe, CheckCircle } from "lucide-react";
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
      description: "Liderando el mercado educativo.",
    },
    {
      icon: Users,
      number: 1250,
      suffix: "+",
      title: "Estudiantes Felices",
      description: "Sueños cumplidos en USA.",
    },
    {
      icon: Globe,
      number: 25,
      suffix: "+",
      title: "Estados Disponibles",
      description: "Cobertura en todo el país.",
    },
    {
      icon: CheckCircle,
      number: 99,
      suffix: "%",
      title: "Tasa de Aprobación",
      description: "Garantía en tus trámites.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container px-6 md:px-12 mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            return (
              <div key={index} className="flex flex-col items-center text-center group cursor-default">
                <div className="text-5xl md:text-6xl font-extrabold text-black mb-2 tracking-tighter group-hover:text-primary transition-colors duration-300">
                  <CountUp end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="h-1 w-12 bg-gray-200 rounded-full mb-4 group-hover:bg-primary transition-colors duration-300"></div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {stat.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
