"use client";

import { CheckCircle2, ChevronRight, UserPlus, FileText, School, Plane } from "lucide-react";

export default function Roadmap() {
  const steps = [
    {
      icon: UserPlus,
      title: "Registro",
      description: "Crea tu cuenta en nuestra plataforma y completa tu perfil inicial.",
      color: "bg-blue-500"
    },
    {
      icon: FileText,
      title: "Asesoría",
      description: "Recibe orientación personalizada para elegir el mejor programa para ti.",
      color: "bg-indigo-500"
    },
    {
      icon: School,
      title: "Aplicación",
      description: "Gestionamos tu admisión a la institución educativa seleccionada.",
      color: "bg-purple-500"
    },
    {
      icon: Plane,
      title: "Viaje",
      description: "Prepara tu visa, maletas y comienza tu nueva vida en USA.",
      color: "bg-primary"
    }
  ];

  return (
    <section id="roadmap" className="py-24 bg-white relative overflow-hidden">
      <div className="container px-6 md:px-12 mx-auto relative z-10">
        
        <div className="mb-20 text-center md:text-left max-w-2xl">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Tu Camino al Éxito</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Roadmap del Estudiante
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Un proceso claro y transparente, paso a paso, diseñado para que sepas exactamente qué esperar en cada etapa.
          </p>
        </div>

        <div className="relative">
          {/* Línea conectora horizontal (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 z-0"></div>

          <div className="grid md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col md:block relative group">
                  {/* Icono Circulo */}
                  <div className={`w-24 h-24 rounded-full ${step.color} shadow-lg shadow-${step.color}/20 flex items-center justify-center mb-8 mx-auto md:mx-0 relative z-10 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-10 h-10 text-white" />
                    
                    {/* Número de paso */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center font-bold text-gray-900 shadow-sm text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="text-center md:text-left px-4 md:px-0">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>

                  {/* Flecha conectora móvil */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-4 text-gray-300">
                      <ChevronRight className="w-6 h-6 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-16 text-center md:text-left">
           <button className="inline-flex items-center font-semibold text-primary hover:text-primary/80 transition-colors group">
             Ver detalles completos del proceso 
             <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </section>
  );
}
