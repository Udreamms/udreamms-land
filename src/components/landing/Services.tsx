"use client";

import { useRef } from "react";
import { 
  Shield, 
  GraduationCap, 
  Globe, 
  Users, 
  Smartphone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface ServicesProps {
  onStartQuote?: () => void;
  onAppClick?: () => void;
}

export default function Services({ onStartQuote, onAppClick }: ServicesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      category: "Servicio Migratorio",
      title: "Tu Visa F-1 Aprobada",
      description: "Expertos en formulario I-20 y preparación para la entrevista consular. 95% de aprobación.",
      image: "/assets/hero-statue-liberty.jpg",
      icon: Shield,
    },
    {
      category: "Programas de Inglés",
      title: "Inglés de Alto Nivel",
      description: "Cursos intensivos, preparación TOEFL/IELTS e inglés de negocios en las mejores escuelas.",
      image: "/assets/hero-campus.jpg",
      icon: GraduationCap,
    },
    {
      category: "Servicio Aeropuerto",
      title: "Llega conectado",
      description: "Recogida en aeropuerto, SIM Card activa y cuenta bancaria lista desde el día 1.",
      image: "/assets/destino-aventura.jpg",
      icon: Globe,
    },
    {
      category: "Servicio Vivienda",
      title: "Hogar lejos de casa",
      description: "Homestays con familias americanas o residencias estudiantiles modernas y seguras.",
      image: "/assets/hero-living-space.jpg",
      icon: Users,
    },
     {
      category: "Descarga la App",
      title: "Udreamms App",
      description: "Gestiona documentos, conecta con roomies y recibe alertas en tiempo real.",
      image: "/assets/hero-newyork.jpg",
      icon: Smartphone,
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
        
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-white text-gray-900 relative overflow-hidden">
      
      <div className="container px-6 md:px-12 mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-gray-900">
              Todo lo que necesitas para <br />
              <span className="text-gray-400">triunfar en USA.</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed w-full">
              Un ecosistema de servicios diseñado para acompañarte en cada etapa de tu viaje.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center transition-all border border-gray-200 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center transition-all border border-gray-200 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-12 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service, index) => (
            <div 
              key={index}
              className="group snap-center shrink-0 w-[85vw] md:w-[400px] flex flex-col gap-4"
            >
              {/* THE CARD */}
              <div className="relative h-[500px] w-full rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-xl shadow-gray-200/50 border border-gray-200 transition-transform duration-300 group-hover:scale-[1.02]">
                {/* Image Background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Content Inside Card (Icon + Category) */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <service.icon className="w-6 h-6" />
                  </div>

                  {/* Category Title inside Card */}
                  <h3 className="text-4xl font-bold leading-tight text-white drop-shadow-lg">
                    {service.category}
                  </h3>
                </div>
              </div>

              {/* DESCRIPTION BELOW CARD */}
              <div className="px-2">
                <p className="text-gray-600 text-sm font-medium leading-relaxed">
                  {service.title}. {service.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={onStartQuote}
            className="group inline-flex items-center gap-6 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full pl-10 pr-2 py-2 transition-all duration-300 active:scale-95 shadow-sm"
          >
            <span className="text-lg font-bold">Ver mi Cotización Personalizada</span>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:translate-x-1 shadow-md">
              <ChevronRight className="w-6 h-6" strokeWidth={3} />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
