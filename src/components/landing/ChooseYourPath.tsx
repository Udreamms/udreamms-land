"use client";

import Link from "next/link";
import { sendMetaEvent } from "@/lib/meta-events";
import {
  Search,
  FileCheck,
  ClipboardCheck,
  MessageSquare,
  MapPin,
  Activity,
  Map,
  Mic,
  Plane,
  ShieldCheck,
  Users,
  PhoneCall,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Car,
  Smartphone,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const paths = [
  {
    title: "Visa de Estudiante F-1",
    subtitle: "Lanza tu carrera profesional en universidades americanas.",
    description: "",
    features: [
      { text: "Diagnóstico de Perfil 360°", icon: Activity, desc: "Evaluación de probabilidades reales." },
      { text: "Gestión de Admisión I-20", icon: FileCheck, desc: "Tramitación directa con la universidad." },
      { text: "Recogida Aeropuerto & Traslado", icon: Car, desc: "Te recibimos personalmente al llegar." },
      { text: "Sim Card & Móvil USA", icon: Smartphone, desc: "Conectividad total desde el día 1." },
      { text: "Apertura Cuenta Bancaria", icon: Building2, desc: "Gestión financiera local sin estrés." },
      { text: "Alojamiento & Vivienda Pro", icon: MapPin, desc: "Opciones seguras cerca de tu escuela." },
      { text: "Comunidad Udreamms Plus", icon: Users, desc: "Networking y eventos exclusivos." }
    ],
    href: "/instructions-payment-student",
    buttonText: "Solicitar visa ahora",
    highlighted: true,
    glowColor: "bg-white/20",
    tag: "¡Cupos Limitados!",
    tagColor: "bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]"
  },
  {
    title: "Visa de Turismo B1/B2",
    subtitle: "Viajes de placer, negocios o salud sin fronteras.",
    description: "",
    features: [
      { text: "Auditoría de Perfil de Riesgo", icon: Search, desc: "Detectamos debilidades antes de aplicar." },
      { text: "Optimización DS-160", icon: FileCheck, desc: "Redacción estratégica sin errores." },
      { text: "Narrativa de Viaje Coherente", icon: Map, desc: "Propósito sólido y veraz ante el cónsul." },
      { text: "Entrenamiento Anti-Trampa", icon: Mic, desc: "Respuestas seguras a preguntas críticas." },
      { text: "Monitoreo de Citas 24/7", icon: Clock, desc: "Buscamos adelantar tu fecha de entrevista." },
      { text: "Dossier de Evidencias Pro", icon: ClipboardCheck, desc: "Qué documentos llevar y cuáles no." }
    ],
    href: "/instructions-payment-tourist",
    buttonText: "Solicitar visa ahora",
    glowColor: "bg-white/20",
    tag: "¡Cupos Limitados!",
    tagColor: "bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]"
  }
];

export default function ChooseYourPath() {
  const commonGradient = "from-blue-600 to-cyan-600";

  return (
    <section id="planes" className="pt-20 md:pt-28 pb-16 md:pb-20 bg-[#050507] relative overflow-hidden font-sans">
      {/* Sutil efecto de cuadrícula de fondo */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Degradado superior para suavizar la unión con el Hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#050507] -translate-y-full" />

      <div className="container max-w-[1500px] mx-auto px-6 relative z-10">

        {/* Header Centrado Simplificado - "Planes" tamaño reducido */}
        <div className="mb-12 md:mb-20 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-white leading-tight mb-4">
            Vive y Estudia en Estados Unidos
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Selecciona la ruta ideal para tu objetivo. Estrategias probadas para turismo, educación y eventos mundiales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl gap-5 md:gap-6 lg:gap-8 mx-auto">
          {paths.map((path, index) => (
            <div key={index} className="relative group w-full flex flex-col">

              {/* Glow Effect Background */}
              <div className={`absolute -inset-2 ${path.glowColor} rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Card Content */}
              <div className="relative flex-1 bg-black border border-white/10 rounded-[2rem] p-5 md:p-6 lg:p-8 flex flex-col ring-1 ring-white/5 shadow-2xl overflow-hidden hover:bg-black transition-colors duration-300">

                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl" />

                {/* Floating Tag for FIFA */}
                {path.tag && (
                  <div className={`absolute top-0 right-0 ${path.tagColor} text-white text-[10px] font-medium uppercase tracking-widest px-3 py-1.5 md:px-6 md:py-2 rounded-bl-3xl shadow-lg z-20 animate-pulse`}>
                    {path.tag}
                  </div>
                )}

                <div className="flex flex-col items-center text-center mb-4 md:mb-6 lg:mb-8">
                  <h3 className="text-xl md:text-2xl font-normal text-white tracking-tight mb-3 md:mb-4 leading-relaxed">{path.title}</h3>
                  <p className="text-slate-400 text-sm font-light leading-loose">{path.subtitle}</p>
                </div>

                {/* Price/Description removed as requested */}
                <div className="mb-0"></div>


                <div className="flex flex-col items-center gap-3 mt-2 mb-5 md:mb-8 w-full">
                  <Link 
                    href={path.href} 
                    onClick={() => sendMetaEvent('Lead', { source: 'ChooseYourPath: ' + path.title })}
                    className={`w-full py-2.5 md:py-3 rounded-full bg-transparent text-white font-normal text-base shadow-2xl hover:scale-[1.03] active:scale-95 transition-all duration-300 border border-white/40 hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] text-center`} 
                    aria-label={`Ir a ${path.title}`}
                  >
                    {path.buttonText}
                  </Link>
                </div>

                <div className="space-y-4 md:space-y-5 flex-1">
                  <p className="text-white font-normal text-xs uppercase tracking-widest opacity-50 mb-3 md:mb-5 text-center">¿Qué incluye el paquete?</p>
                  {path.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-slate-300 group/item cursor-default leading-loose">
                      <div className="mt-1.5 transition-transform group-hover/item:scale-110 shrink-0">
                        <feature.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-normal text-slate-100 group-hover/item:text-white transition-colors">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </div>



              </div>
            </div>
          ))}
        </div>



      </div>
    </section>
  );
}
