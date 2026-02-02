"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Plus, FileText, GraduationCap, MapPin, Home, HelpCircle, Sparkles, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  {
    id: "visa",
    title: "Proceso de Visa",
    icon: FileText,
    color: "text-blue-500",
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
    icon: GraduationCap,
    color: "text-purple-500",
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
    icon: MapPin,
    color: "text-red-500",
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
    icon: Home,
    color: "text-emerald-500",
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

export default function FAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const filteredFaqs = selectedCategory === "all"
    ? categories.flatMap(cat => cat.faqs.map(faq => ({ ...faq, category: cat.title, icon: cat.icon, color: cat.color })))
    : categories.find(cat => cat.id === selectedCategory)?.faqs.map(faq => {
      const cat = categories.find(c => c.id === selectedCategory)!;
      return { ...faq, category: cat.title, icon: cat.icon, color: cat.color };
    }) || [];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      <Header />

      <main>
        {/* Hero Section - Apple Style Title */}
        <section className="relative pt-40 pb-20 overflow-hidden bg-[#F5F5F7]">
          <div className="container px-6 md:px-12 relative z-10">
            <div className="max-w-4xl text-left">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-medium tracking-tight text-xl mb-4 block"
              >
                Preguntas y Respuestas
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-medium text-[#1d1d1f] tracking-tighter leading-[0.9] mb-8"
              >
                Tus dudas resueltas <br />
                de forma directa.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed max-w-2xl"
              >
                Encuentra claridad sobre visas, alojamiento y procesos académicos. Transparencia total desde el primer momento.
              </motion.p>

              <div className="flex flex-wrap gap-3 mt-12">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === "all" ? 'bg-[#1d1d1f] text-white' : 'bg-white text-[#1d1d1f] border border-slate-200 hover:bg-slate-100'}`}
                >
                  Todas
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id ? 'bg-[#1d1d1f] text-white' : 'bg-white text-[#1d1d1f] border border-slate-200 hover:bg-slate-100'}`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#F5F5F7]">
          <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
            {/* Grid de Tarjetas FAQ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              <AnimatePresence mode="popLayout">
                {filteredFaqs.map((faq, index) => {
                  const id = `${faq.category}-${index}`;
                  const isExpanded = expandedIndex === id;

                  return (
                    <motion.div
                      layout
                      key={id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className={`group relative bg-white rounded-[2.5rem] p-10 min-h-[420px] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 border border-transparent hover:border-slate-100 ${isExpanded ? 'lg:col-span-2' : ''}`}
                    >
                      <div className="z-10 relative text-left">
                        <span className="text-xs font-medium text-[#86868b] uppercase tracking-[0.2em] mb-4 block">
                          {faq.category}
                        </span>
                        <h3 className="text-2xl md:text-4xl font-medium text-[#1d1d1f] mb-6 leading-tight">
                          {faq.question}
                        </h3>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-lg md:text-xl font-medium text-[#86868b] leading-relaxed mt-6"
                            >
                              {faq.answer}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end justify-center pb-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                        <faq.icon className={`w-64 h-64 ${faq.color}`} />
                      </div>

                      <div className="absolute bottom-8 right-8">
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : id)}
                          className={`rounded-full p-4 transition-all duration-500 shadow-lg ${isExpanded ? 'bg-[#1d1d1f] text-white' : 'bg-[#F5F5F7] text-[#1d1d1f] hover:bg-primary hover:text-white'}`}
                        >
                          {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* --- SOPORTE FINAL --- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3.5rem] p-10 md:p-24 shadow-sm border border-slate-50 text-center max-w-5xl mx-auto"
            >
              <MessageCircle className="w-16 h-16 text-primary mx-auto mb-8" />
              <h2 className="text-4xl md:text-6xl font-medium text-[#1d1d1f] mb-8 tracking-tighter">
                ¿Aún tienes dudas?
              </h2>
              <p className="text-xl text-[#86868b] mb-12 font-medium max-w-2xl mx-auto">
                Si no encontraste lo que buscabas, nuestro equipo de soporte está disponible para atenderte personalmente.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 rounded-full bg-primary text-white font-medium text-xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:shadow-primary/50 transition-all flex items-center gap-3"
                >
                  Hablar por WhatsApp
                  <Sparkles className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
