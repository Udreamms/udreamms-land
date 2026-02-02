"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, Sparkles, ShieldCheck, Globe2, Target, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PartnershipsPage() {
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
                className="text-indigo-600 font-medium tracking-tight text-xl mb-4 block"
              >
                Partnerships
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-medium text-[#1d1d1f] tracking-tighter leading-[0.9] mb-8"
              >
                Crezcamos juntos. <br />
                Alianzas con impacto.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[#86868b] font-medium max-w-3xl leading-relaxed"
              >
                Colaboramos con instituciones educativas y organizaciones para facilitar el camino de los estudiantes hacia el éxito en Estados Unidos.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Form Section - Apple Clean Style */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left Column: Benefits */}
              <div className="space-y-12">
                <div>
                  <h2 className="text-3xl font-medium text-[#1d1d1f] mb-6">¿Por qué aliarse con Udreamms?</h2>
                  <p className="text-[#86868b] text-lg font-medium leading-relaxed">
                    Ofrecemos una infraestructura sólida para que las escuelas y agencias puedan brindar un servicio de relocalización y soporte académico de primer nivel.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    { title: "Integración Fluida", desc: "Soporte técnico y logístico para tus estudiantes.", icon: Globe2, color: "text-blue-500" },
                    { title: "Soporte 24/7", desc: "Equipo local en USA disponible para cualquier emergencia.", icon: ShieldCheck, color: "text-emerald-500" },
                    { title: "Red de Expertos", desc: "Acceso a consultores especializados en el sistema americano.", icon: Target, color: "text-purple-500" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-[#1d1d1f] mb-1">{item.title}</h4>
                        <p className="text-[#86868b] font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-[#F5F5F7] rounded-[3rem] p-8 md:p-12 border border-slate-200"
              >
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-widest text-[#86868b] ml-1">Nombre de la Organización</Label>
                    <Input placeholder="Ej: Universidad de Utah" className="h-14 rounded-2xl bg-white border-0 text-lg focus-visible:ring-indigo-500 shadow-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-widest text-[#86868b] ml-1">Persona de Contacto</Label>
                    <Input placeholder="Nombre completo" className="h-14 rounded-2xl bg-white border-0 text-lg focus-visible:ring-indigo-500 shadow-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-widest text-[#86868b] ml-1">Email Corporativo</Label>
                    <Input type="email" placeholder="alianzas@institucion.edu" className="h-14 rounded-2xl bg-white border-0 text-lg focus-visible:ring-indigo-500 shadow-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-widest text-[#86868b] ml-1">Mensaje</Label>
                    <Textarea
                      placeholder="Cuéntanos cómo podemos colaborar..."
                      className="min-h-[120px] rounded-2xl bg-white border-0 text-lg resize-none focus-visible:ring-indigo-500 p-4 shadow-sm"
                    />
                  </div>

                  <Button className="w-full h-14 rounded-full bg-[#1d1d1f] hover:bg-[#333] text-white font-medium text-lg transition-all shadow-xl hover:shadow-2xl mt-4">
                    Enviar Solicitud
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Support CTA */}
        <section className="py-32 bg-white text-center">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Building2 className="w-16 h-16 text-[#1d1d1f] mx-auto mb-8" />
              <h2 className="text-4xl md:text-8xl font-medium text-[#1d1d1f] mb-8 tracking-tighter leading-[0.9]">
                Fortalezca su <br />
                propuesta educativa.
              </h2>
              <p className="text-xl text-[#86868b] mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                Si eres un reclutador o representante escolar, agenda una llamada para explorar beneficios exclusivos para tus alumnos.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-14 py-7 rounded-full bg-[#1d1d1f] text-white font-medium text-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all"
              >
                Agendar una Llamada
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
