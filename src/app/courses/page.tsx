"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Plus, GraduationCap, Globe, BookOpen, ArrowRight, CheckCircle2, Sparkles, Stars } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const courses = [
  {
    id: 1,
    category: "Inmersión Total",
    title: "Inglés Intensivo.",
    description: "Programa presencial de alto impacto en Estados Unidos. La forma más rápida de dominar el idioma.",
    icon: GraduationCap,
    color: "text-blue-500",
    features: [
      "18-20 horas de clase semanales",
      "Interacción real con nativos",
      "Certificación internacional"
    ],
    duration: "12-52 semanas",
    level: "Todos los niveles"
  },
  {
    id: 2,
    category: "Flexibilidad Total",
    title: "Inglés Online.",
    description: "Clases en vivo con profesores nativos desde la comodidad de tu hogar. Resultados garantizados.",
    icon: Globe,
    color: "text-purple-500",
    features: [
      "Clases 100% en vivo",
      "Horarios adaptables",
      "Plataforma interactiva"
    ],
    duration: "Flexible",
    level: "Todos los niveles"
  },
  {
    id: 3,
    category: "Turismo Educativo",
    title: "Intercultural.",
    description: "Exclusivo para visa de turista. Incluye clases, alojamiento, transporte y actividades culturales.",
    icon: Stars,
    color: "text-amber-500",
    features: [
      "Florida (Verano) / Utah (Invierno)",
      "Alojamiento y comidas",
      "Actividades VIP incluidas"
    ],
    duration: "4 semanas",
    level: "Todos los niveles"
  },
  {
    id: 4,
    category: "Exámenes Oficiales",
    title: "Preparación TOEFL.",
    description: "Estrategias avanzadas y práctica intensiva para alcanzar tu mejor puntaje en el examen oficial.",
    icon: BookOpen,
    color: "text-emerald-500",
    features: [
      "Simulacros reales oficiales",
      "Técnicas de examen",
      "Seguimiento de puntaje"
    ],
    duration: "12-24 semanas",
    level: "Intermedio-Avanzado"
  },
  {
    id: 5,
    category: "Certificación Global",
    title: "Programa IELTS.",
    description: "Preparación especializada disponible en las principales ciudades de Estados Unidos.",
    icon: BookOpen,
    color: "text-rose-500",
    features: [
      "Academic & General Training",
      "Práctica intensiva de Speaking",
      "Material oficial incluido"
    ],
    duration: "4-12 semanas",
    level: "Intermedio-Avanzado"
  },
  {
    id: 6,
    category: "Éxito Profesional",
    title: "Business English.",
    description: "Domina el lenguaje corporativo y financiero para destacar en el mercado laboral global.",
    icon: GraduationCap,
    color: "text-indigo-500",
    features: [
      "Presentaciones y negocios",
      "Negociación estratégica",
      "Redacción profesional"
    ],
    duration: "8-24 semanas",
    level: "Intermedio-Avanzado"
  }
];

export default function CoursesPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      <Header />
      
      <main>
        {/* Hero Section - Apple Display Style */}
        <section className="relative pt-40 pb-24 bg-[#F5F5F7]">
          <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
            <div className="max-w-4xl text-left">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-bold tracking-tight text-xl mb-4 block"
              >
                Oferta Académica
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-bold text-[#1d1d1f] tracking-tighter leading-[0.9] mb-8"
              >
                El camino correcto <br />
                para tus metas.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[#86868b] font-medium max-w-3xl leading-relaxed"
              >
                Programas diseñados para transformar tu nivel de inglés y abrirte las puertas de las mejores universidades y empresas en USA.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Courses Grid - Apple Style Cards */}
        <section className="py-24 bg-[#F5F5F7]">
          <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredId(course.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative bg-white rounded-[2.5rem] p-10 h-[580px] flex flex-col justify-between overflow-hidden shadow-sm hover:scale-[1.01] transition-all duration-500 ease-out border border-transparent hover:border-slate-100"
                >
                  {/* Top Content */}
                  <div className="z-10 relative">
                    <span className="text-xs font-bold text-[#86868b] uppercase tracking-[0.2em] mb-3 block">
                      {course.category}
                    </span>
                    <h3 className="text-4xl font-bold text-[#1d1d1f] mb-6 leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-lg font-medium text-[#86868b] leading-relaxed mb-8">
                      {course.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {course.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-[#1d1d1f] font-semibold text-sm">
                           <CheckCircle2 className={`w-5 h-5 ${course.color}`} />
                           {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Element */}
                  <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end justify-center pb-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                    <course.icon className={`w-72 h-72 ${course.color}`} />
                  </div>

                  {/* Action Button */}
                  <div className="relative z-10 flex items-center justify-between mt-8">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duración</span>
                        <span className="text-sm font-bold text-[#1d1d1f]">{course.duration}</span>
                     </div>
                     <Link href="/?calculator=true">
                        <button className="bg-[#1d1d1f] text-white rounded-full p-4 hover:bg-primary transition-colors shadow-lg group-hover:scale-110 duration-300">
                          <ArrowRight className="w-6 h-6" />
                        </button>
                     </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison / Advantage Section */}
        <section className="py-32 bg-white">
           <div className="container mx-auto px-6 md:px-12 max-w-5xl">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-bold text-[#1d1d1f] tracking-tight">¿Por qué Udreamms?</h2>
                <p className="text-xl text-[#86868b] mt-4 font-medium">La diferencia entre un curso y un plan estratégico.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-16">
                 {[
                   { title: "Metodología USA", desc: "No solo gramática. Te enseñamos a pensar, debatir y trabajar en el entorno real americano.", icon: Sparkles },
                   { title: "Partner Oficial", desc: "Contamos con alianzas directas en las escuelas más prestigiosas de los 50 estados.", icon: CheckCircle2 }
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col gap-6">
                      <div className="w-16 h-16 bg-[#F5F5F7] rounded-3xl flex items-center justify-center text-primary">
                         <item.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#1d1d1f]">{item.title}</h3>
                      <p className="text-[#86868b] text-lg leading-relaxed font-medium">{item.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Final CTA - Apple Display Style */}
        <section className="py-40 bg-[#F5F5F7]">
           <div className="container px-6 md:px-12 mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl text-left"
              >
                 <motion.div className="mb-10">
                    <Sparkles className="w-12 h-12 text-[#1d1d1f]" />
                 </motion.div>
                 
                 <span className="text-[#1d1d1f] font-bold tracking-tight text-xl mb-4 block">
                    Tu Futuro
                 </span>
                 
                 <h2 className="text-6xl md:text-8xl font-bold text-[#1d1d1f] tracking-tighter leading-[0.9] mb-10">
                   Asegura tu lugar <br />
                   en las mejores escuelas.
                 </h2>
                 
                 <p className="text-xl md:text-2xl text-[#86868b] mb-12 font-medium max-w-2xl leading-relaxed">
                   No pierdas tiempo con trámites confusos. Nuestro equipo experto gestiona tu admisión de principio a fin.
                 </p>
                 
                 <Link href="/?calculator=true">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-14 py-7 rounded-full bg-primary text-white font-black text-xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:shadow-primary/50 transition-all"
                    >
                      Solicitar Cotización
                    </motion.button>
                 </Link>
              </motion.div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
