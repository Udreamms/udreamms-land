"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Sparkles, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PreApplicationForm from "./_components/PreApplicationForm";

const brochures = [
  {
    id: 1,
    title: "Estudia Inglés en Utah",
    description: "Orem, Salt Lake City",
    image: "/assets/brochure-utah.jpg",
    tag: "Aventura"
  },
  {
    id: 2,
    title: "Estudia Inglés en Florida",
    description: "Miami, Orlando, Boca Ratón, Jacksonville, Aventura",
    image: "/assets/brochure-florida.jpg",
    tag: "Sol & Playa"
  },
  {
    id: 3,
    title: "Estudia Inglés en New York",
    description: "New York, New Jersey",
    image: "/assets/brochure-newyork.jpg",
    tag: "Metrópolis"
  },
  {
    id: 4,
    title: "Estudia Inglés en California",
    description: "California",
    image: "/assets/brochure-california.jpg",
    tag: "Tech"
  },
  {
    id: 5,
    title: "Estudia Inglés en Washington D.C.",
    description: "Washington D.C. - La capital de Estados Unidos",
    image: "/assets/brochure-washington.jpg",
    tag: "Capital"
  },
  {
    id: 6,
    title: "Estudia Inglés en Virginia",
    description: "Virginia - Historia y belleza natural",
    image: "/assets/brochure-virginia.jpg",
    tag: "Naturaleza"
  },
  {
    id: 7,
    title: "Estudia Inglés en Boston",
    description: "Boston - Cuna de la educación en Estados Unidos",
    image: "/assets/brochure-boston.jpg",
    tag: "Académico"
  },
  {
    id: 8,
    title: "Estudia Inglés en Georgia",
    description: "Atlanta",
    image: "/assets/brochure-georgia.jpg",
    tag: "Dinámico"
  }
];

export default function BrochuresPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  const [showPreApplication, setShowPreApplication] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isFormValid = formData.nombre && formData.apellido && formData.email && formData.telefono;

  const handleDownload = (brochureTitle: string) => {
    if (!isFormValid) return;
    alert(`Descargando: ${brochureTitle}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      <Header />

      <main>
        {/* Hero Section - Apple Style */}
        <section className="relative pt-40 pb-20 overflow-hidden bg-white">
          <div className="container px-6 md:px-12 relative z-10">
            <div className="max-w-4xl text-left">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-medium tracking-tight text-xl mb-4 block"
              >
                Documentación
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-medium text-[#1d1d1f] tracking-tighter leading-[0.9] mb-8"
              >
                Todo lo que necesitas <br />
                saber por escrito.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed max-w-2xl"
              >
                Descarga guías detalladas sobre programas, costos y vida estudiantil en Estados Unidos. Información clara para decisiones importantes.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10"
              >
                <button
                  onClick={() => setShowPreApplication(true)}
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-medium text-white overflow-hidden rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
                >
                  Aplica Ya
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Form Section - Modernized */}
        <section className="py-12 bg-white">
          <div className="container px-6 md:px-12 max-w-7xl mx-auto">
            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm overflow-hidden">
              <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-5">
                  <h2 className="text-3xl font-medium text-[#1d1d1f] mb-4 tracking-tight">Acceso Instantáneo</h2>
                  <p className="text-[#86868b] mb-6 leading-relaxed font-medium">
                    Completa tus datos una sola vez para habilitar la descarga de todos nuestros materiales informativos.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Precios actualizados 2026</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Guía de alojamiento</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nombre" className="text-[10px] font-medium uppercase tracking-widest text-slate-400 pl-1">Nombre</Label>
                      <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ej: Juan" className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="apellido" className="text-[10px] font-medium uppercase tracking-widest text-slate-400 pl-1">Apellido</Label>
                      <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Ej: Pérez" className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[10px] font-medium uppercase tracking-widest text-slate-400 pl-1">Correo Electrónico</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="telefono" className="text-[10px] font-medium uppercase tracking-widest text-slate-400 pl-1">WhatsApp</Label>
                    <Input id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleInputChange} placeholder="+1 234 567 8900" className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brochures Grid */}
        <section className="py-20 bg-white">
          <div className="container px-6 md:px-12 max-w-7xl mx-auto">
            <div className="text-left mb-12">
              {!isFormValid ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-50 text-amber-600 font-medium text-sm border border-amber-100">
                  <AlertCircle className="w-4 h-4" />
                  Completa el formulario arriba para habilitar las descargas
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-50 text-green-600 font-medium text-sm border border-green-100">
                  <CheckCircle2 className="w-4 h-4" />
                  ¡Todo listo! Ya puedes descargar tus brochures
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {brochures.map((brochure, index) => (
                <motion.div
                  key={brochure.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index % 3 * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={brochure.image}
                        alt={brochure.title}
                        className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-medium uppercase tracking-widest">
                          {brochure.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-medium text-[#1d1d1f] mb-2 tracking-tight group-hover:text-primary transition-colors">
                        {brochure.title}
                      </h3>
                      <p className="text-[#86868b] text-sm mb-8 leading-relaxed line-clamp-2 h-10 font-medium">
                        {brochure.description}
                      </p>

                      <Button
                        onClick={() => handleDownload(brochure.title)}
                        className={`w-full h-14 rounded-2xl font-medium text-base transition-all ${isFormValid ? 'bg-primary text-white shadow-lg hover:shadow-primary/30' : 'bg-slate-100 text-slate-400'}`}
                        disabled={!isFormValid}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        {isFormValid ? "Descargar PDF" : "Habilitar Descarga"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-24 bg-white">
          <div className="container px-6 md:px-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-medium text-[#1d1d1f] mb-6 tracking-tight">¿Prefieres ayuda personalizada?</h2>
              <p className="text-[#86868b] text-lg mb-10 leading-relaxed font-medium">
                Si tienes dudas específicas sobre alguno de nuestros destinos, nuestros asesores están listos para escucharte.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-12 py-6 rounded-full bg-[#1d1d1f] text-white font-medium text-xl transition-all"
              >
                Hablar con un experto
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {showPreApplication && (
        <PreApplicationForm onClose={() => setShowPreApplication(false)} />
      )}
    </div>
  );
}
