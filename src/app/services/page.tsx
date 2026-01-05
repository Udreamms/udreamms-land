'use client';

import React from 'react';
import { 
  ShieldCheck, Home as HomeIcon, Star, Heart, 
  Plane, CreditCard, Car, Smartphone, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

const services = [
  {
    title: "Trámite de Visa Americana",
    desc: "Asesoría experta en la obtención de tu visa F-1 o M-1. Te guiamos en todo el proceso del I-20, llenado del formulario DS-160 y preparación para tu entrevista consular.",
    icon: ShieldCheck,
    color: "text-indigo-400 bg-indigo-500/10",
    features: ["Asesoría I-20", "Simulacros de Entrevista", "Revisión de Documentación"]
  },
  {
    title: "Alojamiento y Vivienda",
    desc: "Encuentra el hogar perfecto lejos de casa. Gestionamos opciones que van desde Homestays con familias locales hasta residencias estudiantiles modernas y seguras.",
    icon: HomeIcon,
    color: "text-rose-400 bg-rose-500/10",
    features: ["Homestays", "Residencias Universitarias", "Seguridad 24/7"]
  },
  {
    title: "Oportunidades de Trabajo y Becas",
    desc: "Maximiza tu inversión. Te ayudamos a identificar programas con opciones de CPT/OPT y becas parciales para reducir tus costos educativos.",
    icon: Star,
    color: "text-amber-400 bg-amber-500/10",
    features: ["Asesoría CPT/OPT", "Búsqueda de Becas", "Networking Profesional"]
  },
  {
    title: "Seguro Médico Internacional",
    desc: "Tu salud es lo primero. Ofrecemos planes de cobertura médica completa que cumplen con los requisitos legales de las universidades en EE. UU.",
    icon: Heart,
    color: "text-pink-400 bg-pink-500/10",
    features: ["Cobertura Total", "Cumplimiento Legal", "Atención 24/7"]
  },
  {
    title: "Viajes y Experiencias",
    desc: "No todo es estudio. Organizamos tours y aventuras por los destinos más icónicos de Estados Unidos para que vivas la experiencia americana completa.",
    icon: Plane,
    color: "text-sky-400 bg-sky-500/10",
    features: ["Tours Grupales", "Tickets a Atracciones", "Guías Locales"]
  },
  {
    title: "Servicios Financieros",
    desc: "Facilitamos tu integración financiera. Te ayudamos a abrir tu primera cuenta bancaria en EE. UU. y a gestionar transferencias internacionales.",
    icon: CreditCard,
    color: "text-green-400 bg-green-500/10",
    features: ["Apertura de Cuentas", "Asesoría Financiera", "Tarjetas de Débito"]
  },
  {
    title: "Movilidad Estudiantil",
    desc: "Muévete con libertad. Te asesoramos en la compra de autos, renta de scooters o en la obtención de pases de transporte público con descuento.",
    icon: Car,
    color: "text-red-400 bg-red-500/10",
    features: ["Compra de Autos", "Renta de Scooters", "Pases de Bus/Metro"]
  },
  {
    title: "Conectividad Total",
    desc: "Mantente comunicado desde el primer día. Gestionamos tu plan de telefonía móvil con datos ilimitados y excelentes tarifas internacionales.",
    icon: Smartphone,
    color: "text-cyan-400 bg-cyan-500/10",
    features: ["Planes Móviles", "SIM Cards", "Internet de Alta Velocidad"]
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Header />
      
      <main className="pt-32 pb-20 px-6 md:px-[5cm]">
        {/* Hero Section Page */}
        <div className="max-w-4xl mb-20">
          <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Servicios Integrales</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.05]">
            Mucho más que una <br />
            <span className="text-gray-500 italic">agencia de estudios.</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed font-light">
            En Udreamms, nos encargamos de cada detalle de tu viaje a Estados Unidos. Desde el primer papel de tu visa hasta la llave de tu nuevo hogar, estamos contigo en cada paso.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${service.color}`}>
                <service.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed font-light">
                {service.desc}
              </p>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="ghost" className="p-0 hover:bg-transparent text-white group-hover:text-primary gap-2 font-bold transition-colors">
                Saber más <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative rounded-[3rem] overflow-hidden p-12 md:p-20 text-center bg-gradient-to-br from-neutral-900 to-black border border-white/5">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">¿Listo para comenzar tu aventura?</h2>
            <p className="text-gray-400 text-lg mb-12">
              Agenda una asesoría gratuita hoy mismo y permítenos diseñar tu plan de vida en Estados Unidos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full h-14 px-10 text-lg font-bold">
                Agendar Asesoría
              </Button>
              <Link href="/contact">
                <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-full h-14 px-10 text-lg font-bold">
                  Contactar Soporte
                </Button>
              </Link>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
