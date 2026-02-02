"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const studentFeatures = [
  {
    id: "i20",
    title: "Aplicación I-20",
    description: "Gestión completa de tu proceso de admisión y obtención del formulario I-20 en las instituciones más prestigiosas.",
    image: "/assets/generated/student_showcase_campus.png",
  },
  {
    id: "nivelacion",
    title: "Nivelación Académica",
    description: "Programas de inglés y preparación académica diseñados para garantizar tu éxito en el sistema universitario de EE. UU.",
    image: "https://images.unsplash.com/photo-1523050853063-bd388fef54ce?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "finanzas",
    title: "Estrategia Financiera",
    description: "Asesoría experta en la presentación de solvencia económica y búsqueda de becas para optimizar tu inversión educativa.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "vida",
    title: "Vida Estudiantil",
    description: "Apoyo integral en alojamiento, seguros médicos y adaptación cultural para que disfrutes tu vida en el campus desde el primer día.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function StudentShowcase() {
  const [activeTab, setActiveTab] = useState(studentFeatures[0]);

  return (
    <section className="py-24 bg-slate-50 text-slate-900 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header: Title + Learn More Pill */}
        <div className="flex justify-between items-center mb-16 border-b border-slate-200 pb-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-blue-600">Visa de Estudiante</h3>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-slate-600 mt-1">
              Tu futuro académico empieza aquí
            </h2>
          </div>
          <Link href="/visas/student">
            <Button variant="outline" className="rounded-full px-8 py-6 border-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-600 font-bold border-2 transition-all">
              Explorar Plan
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-16 items-start">
          
          {/* Left Column (now on right visually): Interactive List */}
          <div className="w-full lg:w-1/3 flex flex-col">
            {studentFeatures.map((feature) => {
              const isActive = activeTab.id === feature.id;
              return (
                <div 
                  key={feature.id}
                  className="group cursor-pointer"
                  onClick={() => setActiveTab(feature)}
                >
                  <div className="py-6 border-b border-slate-200">
                    <h4 className={`text-xl font-medium transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {feature.title}
                    </h4>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-4 text-slate-500 leading-relaxed font-light text-lg">
                            {feature.description}
                          </p>
                          <div className="mt-8 border-t border-blue-600 w-full pt-4">
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (now on left visually): Dynamic Visual */}
          <div className="w-full lg:w-2/3 h-full min-h-[500px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full relative aspect-video lg:aspect-auto lg:h-[600px] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl"
              >
                <img 
                  src={activeTab.image} 
                  alt={activeTab.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-blue-600/90 backdrop-blur-md flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
