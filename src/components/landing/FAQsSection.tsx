"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsappIcon from "@/components/icons/WhatsappIcon";

const categories = [
  {
    id: "udreamms",
    title: "Udreamms",
    faqs: [
      {
        question: "¿Qué es Udreamms?",
        answer: "Udreamms es un ecosistema creado para ayudar a las personas a cumplir su sueño de vivir y estudiar en Estados Unidos, acompañándolas en todo el proceso de la preparación antes del viaje hasta su adaptación en el país. Brinda guías, recursos y herramientas prácticas para reducir el miedo, facilitar la integración y empoderar a cada estudiante para que logre sus metas y se desarrolle plenamente en el extranjero."
      },
      {
        question: "¿Por dónde empiezo?",
        answer: "Empiezas identificando en qué etapa te encuentras dentro del roadmap de cuatro fases de Udreamms. Este mapa te guía paso a paso desde cero hasta tu llegada y adaptación en Estados Unidos, para que sepas exactamente qué hacer en cada momento y avances de forma clara hacia tu objetivo de estudiar y vivir en USA."
      },
      {
        question: "¿Quién es la persona ideal para vivir esta experiencia?",
        answer: "La persona correcta para Udreamms es quien tiene el sueño de estudiar y vivir en Estados Unidos, pero necesita guía clara para saber por dónde empezar y cómo avanzar en el proceso. Es ideal para quienes quieren hacerlo de forma organizada, con acompañamiento en cada etapa, desde la preparación inicial hasta su adaptación en el país."
      },
      {
        question: "¿Qué es Luxor y cómo me beneficia?",
        answer: "Luxor es una moneda digital creada para los estudiantes de Udreamms, diseñada para que puedan acceder y prepararse antes de su viaje a Estados Unidos sin verse afectados por los cambios del dólar. Al iniciar el proceso, cada estudiante recibe 100 monedas como bienvenida, las cuales pueden utilizarse dentro del ecosistema para acceder a diferentes servicios y herramientas de apoyo."
      }
    ]
  },
  {
    id: "visa",
    title: "Proceso de Visa",
    faqs: [
      {
        question: "¿Qué tipo de visa necesito para estudiar en USA?",
        answer: "Necesitas una visa F-1 para estudios académicos. Te ayudamos con todo el proceso de solicitud y preparación para la entrevista."
      },
      {
        question: "¿Cuánto tiempo toma obtener la visa?",
        answer: "El proceso generalmente toma de 4 a 8 semanas desde la solicitud hasta la entrevista. Te recomendamos aplicar al menos 3 meses antes."
      },
      {
        question: "¿Qué documentos necesito para la visa?",
        answer: "Necesitas: formulario I-20, pasaporte válido, comprobante de pago SEVIS, fotos, y comprobante de fondos financieros."
      },
      {
        question: "¿Puedo trabajar con visa de estudiante?",
        answer: "Sí, puedes trabajar hasta 20 horas semanales en el campus durante el semestre y tiempo completo en vacaciones."
      }
    ]
  },
  {
    id: "programs",
    title: "Programas",
    faqs: [
      {
        question: "¿Cuánto dura el programa de inglés?",
        answer: "Los programas varían de 12 a 52 semanas dependiendo de tus objetivos. Ofrecemos desde cursos cortos hasta programas académicos."
      },
      {
        question: "¿Qué nivel de inglés necesito para empezar?",
        answer: "Nuestros programas aceptan desde nivel principiante hasta avanzado. Realizamos una prueba de nivelación al inicio."
      }
    ]
  },
  {
    id: "destinations",
    title: "Destinos",
    faqs: [
      {
        question: "¿En qué ciudades tienen programas?",
        answer: "Tenemos programas en New York, Los Angeles, Miami, Orlando, Boston, San Francisco, y más de 20 ciudades."
      },
      {
        question: "¿Cómo elijo la mejor ciudad para mí?",
        answer: "Te ayudamos a elegir basándonos en tus intereses, presupuesto, clima preferido y oportunidades profesionales."
      }
    ]
  },
  {
    id: "housing",
    title: "Vivienda",
    faqs: [
      {
        question: "¿Ayudan con el alojamiento?",
        answer: "Sí, te ayudamos a encontrar opciones de homestay, residencias estudiantiles o apartamentos compartidos cerca de tu escuela."
      },
      {
        question: "¿El alojamiento incluye comidas?",
        answer: "Generalmente no, a menos que sea un homestay con plan de alimentación específico."
      }
    ]
  }
];

export default function FAQsSection() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const filteredFaqs = selectedCategory === "all"
    ? categories.flatMap(cat => cat.faqs.map(faq => ({ ...faq, categoryId: cat.id, categoryTitle: cat.title })))
    : categories.find(cat => cat.id === selectedCategory)?.faqs.map(faq => {
      const cat = categories.find(c => c.id === selectedCategory)!;
      return { ...faq, categoryId: cat.id, categoryTitle: cat.title };
    }) || [];

  const toggleExpand = (id: string) => {
    setExpandedIndex(expandedIndex === id ? null : id);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 lg:py-28 bg-black font-sans text-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
            Tus dudas resueltas <br className="hidden md:inline" />
            <span className="text-gray-400">de forma directa</span>
          </h2>
          <p className="text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Encuentra claridad sobre visas, alojamiento y procesos académicos. Transparencia total desde el primer momento.
          </p>
        </div>

        {/* Category Pills (Filtros) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setExpandedIndex(null);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-white text-black shadow-md shadow-white/10"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Vertical Accordion List */}
        <div className="border-t border-white/10 divide-y divide-white/10 mb-20">
          <AnimatePresence initial={false}>
            {filteredFaqs.map((faq, idx) => {
              const id = `${faq.categoryId}-${idx}`;
              const isExpanded = expandedIndex === id;

              return (
                <div key={id} className="py-5 transition-colors duration-300 hover:bg-white/[0.02] px-2 rounded-xl">
                  <button
                    onClick={() => toggleExpand(id)}
                    className="w-full flex justify-between items-center text-left py-2 group focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-col gap-1 pr-6">
                      <span className="text-base md:text-lg font-medium text-white transition-colors duration-200">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all duration-300 ${
                        isExpanded ? "rotate-180 bg-white border-white text-black group-hover:bg-white group-hover:text-black" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: { height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25, delay: 0.05 } }
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: { height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.15 } }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pt-2 text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* WhatsApp CTA Dudas - Sin contenedor (Estilo Nota) */}
        <div className="mt-16 text-center max-w-xl mx-auto flex flex-col items-center">
          <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed">
            <span className="font-semibold text-white block mb-1 text-sm md:text-base">¿Aún tienes dudas?</span>
            Si no encontraste lo que buscabas, nuestro equipo de soporte está disponible para atenderte personalmente en cualquier momento.
          </p>
          
          <a
            href="https://wa.me/13858882799?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-auto px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium text-xs md:text-sm hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all duration-300"
          >
            <WhatsappIcon className="w-4 h-4" />
            <span className="ml-2">Chatear por WhatsApp</span>
          </a>
        </div>
        
      </div>
    </section>
  );
}
