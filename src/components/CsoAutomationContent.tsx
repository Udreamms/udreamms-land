
"use client";
// src/components/CsoAutomationContent.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Clock, Users, FileText, Settings, ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';

export function CsoAutomationContent() {
  const router = useRouter();

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-sky-400" />,
      title: "Respuestas Rápidas",
      description: "Crea y gestiona plantillas de mensajes para responder más rápido a las preguntas comunes.",
      action: "Gestionar Plantillas",
      href: "#"
    },
    {
      icon: <Bot className="w-8 h-8 text-emerald-400" />,
      title: "Chatbots",
      description: "Construye y despliega chatbots para gestionar conversaciones automáticamente 24/7.",
      action: "Ir a Chatbots",
      href: "/cso/automation/chatbots"
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      title: "Sugerencias de IA",
      description: "Activa sugerencias de respuesta impulsadas por IA basadas en los mensajes del cliente.",
      action: "Configurar IA",
      href: "#"
    },
    {
      icon: <Users className="w-8 h-8 text-rose-400" />,
      title: "Asignación de Chats",
      description: "Establece reglas para asignar automáticamente nuevas conversaciones a miembros específicos del equipo.",
      action: "Definir Reglas",
      href: "#"
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-400" />,
      title: "Mensajes Programados",
      description: "Gestiona y visualiza todos los mensajes que están programados para ser enviados en el futuro.",
      action: "Ver Programación",
      href: "#"
    },
    {
      icon: <Settings className="w-8 h-8 text-slate-400" />,
      title: "Flujos de Trabajo",
      description: "Crea flujos de trabajo avanzados, como añadir una etiqueta si un mensaje contiene una palabra específica.",
      action: "Crear Flujos",
      href: "#"
    }
  ];

  const handleCardClick = (href: string) => {
    if (href && href !== "#") {
      router.push(href);
    }
    // Puedes añadir un toast o alerta si el href es "#" para indicar que está en desarrollo.
  };

  return (
    <main className="flex-1 p-8 md:p-12 bg-neutral-950 text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Centro de Automatización</h1>
        <p className="text-neutral-400 mt-3 text-lg">
          Configura herramientas para agilizar tu comunicación y ahorrar tiempo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group relative flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => handleCardClick(feature.href)}
          >
            <div className="p-6 flex-grow">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="text-neutral-400 mt-2 text-sm">{feature.description}</p>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <div className="flex items-center text-blue-500 font-semibold text-sm">
                <span>{feature.action}</span>
                <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
