"use client";

import {
  ArrowRight,
  Plane,
  FileCheck,
  GraduationCap,
  MapPin
} from "lucide-react";

export default function StageDetails() {

  const stages = [
    {
      id: 1,
      tag: "Fase 1",
      title: "Preparación Inicial",
      description: "No tienes pasaporte ni fondos suficientes. Te ayudamos con clases de inglés y programas para generar ingresos.",
      icon: FileCheck,
      color: "text-blue-500",
    },
    {
      id: 2,
      tag: "Fase 2",
      title: "Aplicación y Obtención de Visa",
      description: "Tienes documentos listos. Es hora de aplicar a la escuela, gestionar el I-20 y prepararte para la embajada.",
      icon: GraduationCap,
      color: "text-purple-500",
    },
    {
      id: 3,
      tag: "Fase 3",
      title: "Planificación de Viaje",
      description: "¿Y ahora qué sigue? Búsqueda de vivienda, compra de vuelos y el checklist final antes de partir.",
      icon: Plane,
      color: "text-orange-500",
    },
    {
      id: 4,
      tag: "Fase 4",
      title: "Llegada y Primeros Días",
      description: "Adaptación inicial: Recogida en aeropuerto, cuenta bancaria, ITIN/SSN y acceso a la comunidad Udreamms.",
      icon: MapPin,
      color: "text-emerald-500",
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">

      <div className="container max-w-[1400px] mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="mb-12 pb-6 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-black">
            ¿En qué fase <br />
            <span className="text-gray-400">te encuentras?</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Identifica dónde estás en tu viaje y descubre cómo te podemos ayudar hoy mismo.
          </p>
        </div>

        {/* Grid Superior: 2 Filas de 2 Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {stages.map((stage) => (
            <div key={stage.id} className="group bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative flex flex-col justify-between h-[380px] hover:shadow-xl hover:shadow-gray-200 transition-all duration-300">
              <div>
                {/* Icon */}
                <div className="mb-4">
                  <stage.icon className={`w-12 h-12 ${stage.color}`} strokeWidth={1.5} />
                </div>

                {/* Title Part 1 (Tag) */}
                <div className="mb-2">
                  <span className={`text-xl font-bold ${stage.color}`}>
                    {stage.tag}
                  </span>
                </div>

                {/* Title Part 2 (Main Title) */}
                <h3 className={`text-3xl md:text-4xl font-bold ${stage.color} mb-4 leading-tight`}>
                  {stage.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}

        </div>

        {/* Tarjeta Inferior Grande: Fase 5 */}
        <div className="group bg-white rounded-[2.5rem] p-0 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-center h-full min-h-[250px]">

            {/* Imagen (Izquierda) - Fondo Blanco */}
            <div className="w-full lg:w-[25%] h-[200px] lg:h-full relative bg-white flex items-center justify-center p-6">
              <img
                src="/assets/Udreamms App.jpeg"
                alt="Udreamms App"
                className="w-auto h-full max-h-[150px] object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Contenido (Derecha) */}
            <div className="w-full lg:w-[75%] p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 bg-white">

              {/* Textos */}
              <div className="flex-1 space-y-4">
                <span className="text-xl font-bold text-[#D31245] mb-1 block">
                  Fase 5
                </span>

                <h3 className="text-3xl md:text-4xl font-black text-[#D31245] mb-3 leading-tight">
                  ¿Ya vives en USA?
                </h3>

                <div className="text-lg md:text-xl font-medium leading-relaxed">
                  <p className="text-gray-500 mb-4">
                    Si ya lograste tu sueño, únete a nuestra red de Alumnos. Te ayudamos a encontrar trabajo part-time, hacer networking y viajar por todo el país.
                  </p>

                  {/* Mensaje Llamativo */}
                  <p className="text-gray-500 font-bold">
                    Todo lo podrás hacer desde nuestra App. <br />
                    <span className="text-[#D31245]">Descárgala ya en App Store o Google Play.</span> <br />
                    ¡Te esperamos!
                  </p>
                </div>
              </div>

              {/* Botón a la derecha */}
              <div className="shrink-0 self-start lg:self-center">
                <button className="inline-flex items-center px-8 py-4 rounded-full bg-[#D31245] text-white font-bold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-base whitespace-nowrap">
                  Unirme a la comunidad
                  <ArrowRight className="w-5 h-5 ml-3" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
