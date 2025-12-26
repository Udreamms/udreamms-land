"use client";

import { Shield, GraduationCap, Globe, Users, Smartphone, ArrowRight } from "lucide-react";

interface ServicesProps {
  onStartQuote: () => void;
  onAppClick: () => void;
}

export default function Services({ onStartQuote, onAppClick }: ServicesProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container px-6 md:px-12 mx-auto">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight text-left">
            Todo lo que necesitas para estudiar en <span className="text-primary">USA</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed text-left">
            Diseñamos cada servicio pensando en simplificar tu vida, desde el primer trámite hasta que aterrizas en tu nuevo hogar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Tarjeta 1: Migratorio */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 text-left">
                Servicio Migratorio
              </h3>
              <ul className="space-y-3 mb-6">
                {['Aplicación a escuela', 'Trámite SEVIS', 'Documentación', 'Preparación Consular'].map((item, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-left">
                    <span className="mr-2 text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tarjeta 2: Programas */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 text-left">
                Programas de Inglés
              </h3>
              <ul className="space-y-3 mb-6">
                {['Inglés Intensivo', 'Clases Online', 'TOEFL & IELTS', 'Inglés de Negocios'].map((item, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-left">
                    <span className="mr-2 text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tarjeta 3: Aeropuerto */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 text-left">
                Servicio Aeropuerto
              </h3>
              <ul className="space-y-3 mb-6">
                {['Recogida privada', 'Traslado seguro', 'Bienvenida cálida', 'Sim card local'].map((item, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-left">
                    <span className="mr-2 text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tarjeta 4: Vivienda */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 text-left">
                Servicio Vivienda
              </h3>
              <ul className="space-y-3 mb-6">
                {['Búsqueda personalizada', 'Homestays verificados', 'Residencias estudiantiles', 'Contratos seguros'].map((item, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-left">
                    <span className="mr-2 text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tarjeta 5: App (Destacada) - Ocupa 2 columnas en pantallas grandes */}
          <div 
            onClick={onAppClick}
            className="md:col-span-2 bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800 group cursor-pointer relative overflow-hidden flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Descarga la App Udreamms
                </h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Gestiona todo tu proceso desde tu celular. Accede a recursos exclusivos, conecta con otros estudiantes y mantente al día.
                </p>
                <div className="flex items-center text-primary font-semibold group-hover:text-white transition-colors">
                  Descargar ahora <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
