"use client";

import { Smartphone } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

const servicesData = [
  {
    title: "Oportunidades",
    desc: "Encuentra ofertas de trabajo, becas y oportunidades de networking para estudiantes internacionales",
    cta: "Ver más",
    imageKeyword: "credit card banking",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Ftrabajo.mp4?alt=media&token=8c361ac9-8767-486e-bcb8-a951598571a5",
  },
  {
    title: "Vivienda",
    desc: "Te ayudamos a encontrar el lugar perfecto para vivir durante tu estadía en Estados Unidos.",
    cta: "Buscar vivienda",
    imageKeyword: "apartment interior",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Fhome.mp4?alt=media&token=8fe8f2cf-e608-47be-b2ff-b8d0212dd7c1",
  },
  {
    title: "Viajes y Aventuras",
    desc: "Descubre lugares increíbles, eventos y actividades para aprovechar tu estadía al máximo",
    cta: "Ver más",
    imageKeyword: "airplane window view",
    videoUrl: null,
  },
  {
    title: "Conocimiento Clave en USA",
    desc: "Guías prácticas sobre cultura, leyes, tips de vida diaria y todo lo que necesitas saber",
    cta: "Ver más",
    imageKeyword: "driving car usa",
    videoUrl: null,
  },
  {
    title: "Cuenta Bancaria",
    desc: "Te ayudamos con los trámites para crear una cuenta bancaria al llegar a Estados Unidos y recibir una tarjeta débito.",
    cta: "Abrir cuenta",
    imageKeyword: "credit card banking 2",
    videoUrl: null,
  },
  {
    title: "Compra/Renta de Auto",
    desc: "Te ayudamos para que puedas comprar/rentar un auto para movilizarte más fácilmente.",
    cta: "Ver autos",
    imageKeyword: "car rental 2",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Fcoche.mp4?alt=media&token=c0645f1b-3570-4bd9-b52e-739299cfb4ac",
  },
  {
    title: "Pase de Autobús",
    desc: "Te ayudamos a adquirir un pase de bus estudiantil económico.",
    cta: "Solicitar pase",
    imageKeyword: "bus public transport 2",
    videoUrl: null,
  },
  {
    title: "Scooter",
    desc: "Obtén información para comprar o rentar un scooter y moverte fácilmente por la ciudad",
    cta: "Ver opciones",
    imageKeyword: "scooter city",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Fscooter.mp4?alt=media&token=400bd256-8057-44f4-ab01-87765207a564",
  },
  {
    title: "Plan de Celular",
    desc: "Te ayudamos a sacar una línea de celular de USA ya sea en un plan individual o grupal.",
    cta: "Ver planes",
    imageKeyword: "smartphone using 2",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Flicencia.mp4?alt=media&token=f18b3fd9-abbe-4530-ba59-2ed99567b14c",
  },
  {
    title: "Licencia de Conducir",
    desc: "Te guiamos al seguir los pasos para tramitar una licencia de conducir del estado donde estudies.",
    cta: "Ver guía",
    imageKeyword: "driving car usa 2",
    videoUrl: null,
  },
  {
    title: "Seguro Médico",
    desc: "Te ayudamos a conseguir un seguro médico en caso que necesites uno.",
    cta: "Cotizar seguro",
    imageKeyword: "health insurance doctor 2",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Ftrabajo.mp4?alt=media&token=8c361ac9-8767-486e-bcb8-a951598571a5",
  },
  {
    title: "Vuelos Económicos",
    desc: "Te ayudamos a cotizar vuelos económicos hacia Estados Unidos.",
    cta: "Buscar vuelos",
    imageKeyword: "airplane window view 2",
    videoUrl: null
  }
];

export default function AppSection() {
  const reorderedServicesData = [...servicesData];
  // Swap elements at indices 1 and 2
  [reorderedServicesData[1], reorderedServicesData[2]] = [reorderedServicesData[2], reorderedServicesData[1]];

  return (
    <section id="app-section" className="bg-[#111111] py-20">
      <div className="container px-4 max-w-5xl">
        <div className="text-center mb-16 gap-6">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6">
            <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20"></div>
            <Smartphone className="w-10 h-10 text-primary-foreground relative" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            Udreamms App
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Tu compañera perfecta una vez que llegues a Estados Unidos
          </p>
          <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 inline-flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
            <p className="text-sm font-medium text-red-400">
              Esta aplicación es exclusiva para estudiantes que ya están en USA
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reorderedServicesData.map((service, index) => {
            return (
              <div key={index}
                className={`group relative overflow-hidden rounded-3xl h-[400px] w-full transition-all duration-300 ${index % 4 === 0 || index % 4 === 2 ? 'translate-y-12' : ''}`}>
                {service.videoUrl ? (
                  <video
                    src={service.videoUrl}
                    className="object-cover w-full h-full absolute inset-0 hover:scale-110 duration-500"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                  />
                ) : (
                  <div className="object-cover w-full h-full absolute inset-0 bg-black"></div>
                )}
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative flex flex-col h-full p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4 flex-grow">
                    {service.desc}
                  </p>
                   <Link
                    href="#"
                    className="inline-flex items-center justify-center text-black bg-white rounded-full px-4 py-2 font-medium hover:bg-gray-100 transition-colors w-fit self-start text-sm"
                  >
                    {service.cta}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 ml-2"
                    >
                      <path
                        fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L6.22 12h10.56a.75.75 0 010 1.5H6.22l.99 1.77a.75 0 01-1.04.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
