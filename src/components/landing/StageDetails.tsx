"use client";

import { 
  ArrowRight, 
  Plane, 
  FileCheck, 
  GraduationCap, 
  MapPin
} from "lucide-react";

export default function StageDetails() {
  
  // Datos estructurados
  const stages = [
    {
      id: 1,
      tag: "Etapa 1",
      title: "Aún no califico",
      description: "No tienes pasaporte ni fondos suficientes. Te ayudamos con clases de inglés y programas para generar ingresos.",
      linkText: "Ver cómo prepararme",
      icon: FileCheck,
      color: "text-blue-600",
      bgIcon: "bg-blue-50",
      border: "border-blue-100",
      hoverBorder: "group-hover:border-blue-200"
    },
    {
      id: 2,
      tag: "Etapa 2",
      title: "Tengo todo para comenzar",
      description: "Tienes documentos listos. Es hora de aplicar a la escuela, gestionar el I-20 y prepararte para la embajada.",
      linkText: "Iniciar aplicación",
      icon: GraduationCap,
      color: "text-purple-600",
      bgIcon: "bg-purple-50",
      border: "border-purple-100",
      hoverBorder: "group-hover:border-purple-200"
    },
    {
      id: 3,
      tag: "Etapa 3",
      title: "Visa Aprobada",
      description: "¿Y ahora qué sigue? Búsqueda de vivienda, compra de vuelos y el checklist final antes de partir.",
      linkText: "Organizar mi viaje",
      icon: Plane,
      color: "text-orange-600",
      bgIcon: "bg-orange-50",
      border: "border-orange-100",
      hoverBorder: "group-hover:border-orange-200"
    },
    {
      id: 4,
      tag: "Etapa 4",
      title: "Llegamos a USA",
      description: "Adaptación inicial: Recogida en aeropuerto, cuenta bancaria, SSN y acceso a la comunidad Udreamms.",
      linkText: "Guía de llegada",
      icon: MapPin,
      color: "text-emerald-600",
      bgIcon: "bg-emerald-50",
      border: "border-emerald-100",
      hoverBorder: "group-hover:border-emerald-200"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white skew-x-12 translate-x-1/4 pointer-events-none opacity-50"></div>

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-16 pb-8 border-b border-gray-200">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
            Tu Estatus Actual
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            ¿En qué etapa te encuentras?
          </h2>
           <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Identifica dónde estás en tu viaje y descubre cómo te podemos ayudar hoy mismo con soluciones a tu medida.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {stages.map((stage) => (
            <div key={stage.id} className={`group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border ${stage.border} ${stage.hoverBorder}`}>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                
                {/* Icono */}
                <div className={`w-16 h-16 rounded-2xl ${stage.bgIcon} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                   <stage.icon className={`w-8 h-8 ${stage.color}`} />
                </div>
                
                {/* Contenido */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                     <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500`}>
                        {stage.tag}
                     </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {stage.title}
                  </h3>
                  
                  <p className="text-gray-500 leading-relaxed text-sm md:text-base font-medium">
                    {stage.description}
                  </p>

                  <div className="pt-2">
                    <span className={`inline-flex items-center text-sm font-bold ${stage.color} hover:opacity-80 transition-opacity mt-2 cursor-pointer`}>
                      {stage.linkText}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* Tarjeta Especial: Meta Final (Full Width) */}
           <div className="group cursor-pointer md:col-span-2 mt-4 relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-black p-1 shadow-2xl hover:shadow-primary/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative h-full bg-[#0a0a0a] rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
                 
                 {/* Fondo decorativo interno */}
                 <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

                 <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl md:text-5xl">🎯</span>
                 </div>
                 
                 <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
                    <div>
                       <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                          El Destino
                       </span>
                       <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                         ¿Ya vives en USA?
                       </h3>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                      Si ya lograste tu sueño, únete a nuestra red de Alumni. Te ayudamos a encontrar trabajo part-time, hacer networking y viajar por todo el país.
                    </p>
                 </div>

                 <div className="relative z-10 shrink-0">
                    <button className="inline-flex items-center px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition-colors">
                      Unirme a la Comunidad
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </section>
  );
}
