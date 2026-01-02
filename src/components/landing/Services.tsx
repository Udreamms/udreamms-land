"use client";

import { 
  Shield, 
  GraduationCap, 
  Globe, 
  Users, 
  Smartphone, 
  Check,
  ChevronRight
} from "lucide-react";

interface ServicesProps {
  onStartQuote?: () => void;
  onAppClick?: () => void;
}

export default function Services({ onStartQuote, onAppClick }: ServicesProps) {
  
  const services = [
    {
      title: "Servicio Migratorio",
      icon: Shield,
      description: "Asesoría completa desde el formulario I-20 hasta tu entrevista consular.",
      features: ['Aplicación a escuela', 'Trámite SEVIS', 'Preparación Consular'],
      colSpan: "lg:col-span-2", // Tarjeta ancha
      gradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-50 text-blue-600",
      borderHover: "hover:border-blue-200"
    },
    {
      title: "Programas de Inglés",
      icon: GraduationCap,
      description: "Mejora tu nivel con cursos intensivos o clases online previas.",
      features: ['TOEFL & IELTS', 'Inglés de Negocios', 'Clases Online'],
      colSpan: "lg:col-span-1",
      gradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-50 text-purple-600",
      borderHover: "hover:border-purple-200"
    },
    {
      title: "Aterrizaje Suave",
      icon: Globe,
      description: "Servicio de aeropuerto y SimCard para que estés conectado al llegar.",
      features: ['Recogida privada', 'Sim card local', 'Bienvenida'],
      colSpan: "lg:col-span-1",
      gradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-50 text-emerald-600",
      borderHover: "hover:border-emerald-200"
    },
    {
      title: "Vivienda Segura",
      icon: Users,
      description: "Encontramos tu hogar ideal antes de que subas al avión.",
      features: ['Homestays verificados', 'Residencias', 'Contratos seguros'],
      colSpan: "lg:col-span-2", // Tarjeta ancha
      gradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-50 text-orange-600",
      borderHover: "hover:border-orange-200"
    }
  ];

  return (
    <section className="py-32 bg-white text-gray-900 relative overflow-hidden">
      
      {/* Fondo decorativo sutil (ahora claro) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gray-50 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container px-6 md:px-12 mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-20 md:text-center max-w-4xl mx-auto">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">
            Nuestros Servicios
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight text-gray-900">
            Todo lo que necesitas para <br className="hidden md:block" />
            triunfar en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">USA</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Diseñamos un ecosistema de servicios para simplificar tu vida, desde el primer trámite hasta que aterrizas en tu nuevo hogar.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Mapeo de Servicios Principales */}
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`
                ${service.colSpan} 
                group relative p-8 rounded-3xl border border-gray-100 bg-white overflow-hidden ${service.borderHover} transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50
              `}
            >
              {/* Hover Gradient Background (Sutil) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center mb-6 transition-colors`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-black transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-500 mb-8 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-500 font-medium group-hover:text-gray-800 transition-colors">
                      <div className="mr-3 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-white/80">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* TARJETA DE LA APP (Call to Action) */}
          <div 
            onClick={onAppClick}
            className="md:col-span-2 lg:col-span-3 cursor-pointer group relative p-1 rounded-3xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-primary hover:to-secondary transition-colors duration-500"
          >
            <div className="h-full bg-gray-50 rounded-[22px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
              
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

              <div className="relative z-10 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-primary text-xs font-bold uppercase mb-6 shadow-sm">
                  <Smartphone className="w-3 h-3" />
                  Disponible ahora
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Lleva tu proceso en el bolsillo
                </h3>
                <p className="text-gray-500 text-lg max-w-xl mb-8">
                  Descarga la App Udreamms. Gestiona documentos, conecta con roomies y recibe alertas en tiempo real sobre tu estatus migratorio.
                </p>
                
                <button className="inline-flex items-center text-primary font-bold group-hover:text-white transition-colors">
                  Descargar Aplicación
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Mockup Visual (Icono grande o ilustración) */}
              <div className="relative z-10 shrink-0">
                 <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-gray-200 group-hover:shadow-primary/20 group-hover:scale-105 transition-transform duration-300 rotate-3 group-hover:rotate-6">
                    <Smartphone className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
