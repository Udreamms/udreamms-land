"use client";

import { Car, Smartphone, Building2, Users } from "lucide-react";

const steps = [
  {
    icon: Car,
    title: "Recogida Aeropuerto",
    description: "Te recibimos al llegar"
  },
  {
    icon: Smartphone,
    title: "Sim Card",
    description: "Conectado desde el día 1"
  },
  {
    icon: Building2,
    title: "Cuenta Bancaria",
    description: "Gestión financiera lista"
  },
  {
    icon: Users,
    title: "Comunidad",
    description: "Networking y eventos"
  }
];

export default function UdreammsEcosystem() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">
            El Ecosistema Udreamms
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto font-medium">
            "Las otras agencias te dan la visa y te dicen adiós. Nosotros te recibimos."
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gray-100 -z-10 -translate-y-8" />

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-[200px] group">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center mb-6 shadow-lg group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300 relative z-10">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
