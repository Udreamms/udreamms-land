"use client";

import { Shield, GraduationCap, Globe, Users, Smartphone } from "lucide-react";

interface ServicesProps {
  onStartQuote: () => void;
  onAppClick: () => void;
}

export default function Services({ onStartQuote, onAppClick }: ServicesProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-glow">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Todo lo que necesitas para estudiar en Estados Unidos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg hover:shadow-xl transition-all border border-white/20 hover:border-white/40 group">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">
              Servicio Migratorio
            </h3>
            <ul className="space-y-2 text-white/90 mt-4">
              <li>✓ Aplicación a escuela</li>
              <li>✓ SEVIS</li>
              <li>✓ Documentación y preparación</li>
              <li>✓ Cita Consular</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg hover:shadow-xl transition-all border border-white/20 hover:border-white/40 group">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">
              Programas de Inglés
            </h3>
            <ul className="space-y-2 text-white/90 mt-4">
              <li>✓ Inglés Intensivo</li>
              <li>✓ Inglés Online</li>
              <li>✓ TOEFL & IELTS</li>
              <li>✓ Inglés de Negocios</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg hover:shadow-xl transition-all border border-white/20 hover:border-white/40 group">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">
              Servicio Aeropuerto
            </h3>
            <ul className="space-y-2 text-white/90 mt-4">
              <li>✓ Recogida en aeropuerto</li>
              <li>✓ Traslado a domicilio</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg hover:shadow-xl transition-all border border-white/20 hover:border-white/40 group">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">
              Servicio Vivienda
            </h3>
            <ul className="space-y-2 text-white/90 mt-4">
              <li>✓ Búsqueda de vivienda</li>
              <li>✓ Aplicación y documentación</li>
              <li>✓ Soporte durante el proceso</li>
            </ul>
          </div>

          <div 
            onClick={onAppClick}
            className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg hover:shadow-xl transition-all border border-white/20 hover:border-white/40 group cursor-pointer"
          >
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">
              Descarga la App
            </h3>
            <div className="text-3xl font-bold text-white mb-4">Udreamms</div>
            <p className="text-white/90">
              Para estudiantes que ya están en USA
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStartQuote}
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold bg-white text-primary rounded-lg shadow-lg hover:scale-105 transition-all hover:bg-white/95"
          >
            Ver mi Cotización Personalizada
          </button>
        </div>
      </div>
    </section>
  );
}
