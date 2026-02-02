"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { AlertTriangle, Scale, CreditCard, UserCheck, FileWarning, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
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
                className="text-primary font-medium tracking-tight text-xl mb-4 block"
              >
                Acuerdo Legal
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-medium text-[#1d1d1f] tracking-tighter leading-[0.9] mb-8"
              >
                Términos y <br />
                Condiciones.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[#86868b] font-medium max-w-2xl leading-relaxed"
              >
                Bienvenido a Udreamms LLC. Al utilizar nuestros servicios, usted acepta los términos descritos en este documento.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-sm font-medium text-slate-400 uppercase tracking-widest"
              >
                Última actualización: Enero 2026
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section - Structured Style */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <div className="space-y-20">

              {/* Disclaimer: Critical Information */}
              <div className="bg-amber-50 border-2 border-amber-100 p-8 md:p-12 rounded-[3rem] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-medium text-amber-900 uppercase tracking-wider">Descargo Legal Importante</h2>
                  </div>
                  <div className="grid gap-6 text-amber-800/80 font-medium">
                    <p><strong className="text-amber-900">No somos el Gobierno:</strong> Udreamms LLC es una entidad privada. NO estamos afiliados con USCIS ni con ninguna entidad gubernamental de USA.</p>
                    <p><strong className="text-amber-900">No garantizamos Visas:</strong> La aprobación es decisión exclusiva de los oficiales consulares. No realizamos reembolsos basados en negaciones de visa.</p>
                    <p><strong className="text-amber-900">No es Asesoría Legal:</strong> Nuestra orientación es estrictamente educativa y de acompañamiento logístico.</p>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <div className="space-y-8">
                <h2 className="text-3xl font-medium text-[#1d1d1f] tracking-tight flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary text-sm font-medium shadow-sm">02</span>
                  Descripción de Servicios
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Asesoría en aplicación escolar",
                    "Llenado de formularios (F-1 / B1-B2)",
                    "Simulación de entrevistas",
                    "Gestión de vivienda y transporte"
                  ].map((service, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-700 font-medium">
                      <UserCheck className="w-5 h-5 text-primary" /> {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments & Refunds */}
              <div className="space-y-8">
                <h2 className="text-3xl font-medium text-[#1d1d1f] tracking-tight flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary text-sm font-medium shadow-sm">03</span>
                  Pagos y Reembolsos
                </h2>
                <div className="p-10 rounded-[3rem] border border-slate-100 bg-white shadow-sm">
                  <div className="flex gap-6 items-start mb-8">
                    <CreditCard className="w-8 h-8 text-primary shrink-0" />
                    <p className="text-[#86868b] font-medium leading-relaxed">Las tarifas por servicios de asesoría de Udreamms LLC no son reembolsables una vez que el servicio ha comenzado (ej: tras la primera asesoría o llenado de formulario).</p>
                  </div>
                  <div className="flex gap-6 items-start">
                    <FileWarning className="w-8 h-8 text-primary shrink-0" />
                    <p className="text-[#86868b] font-medium leading-relaxed">El estudiante es responsable del pago directo a terceros (tasas SEVIS, MRV Fee, boletos aéreos y alojamiento).</p>
                  </div>
                </div>
              </div>

              {/* Jurisdiction */}
              <div className="bg-[#1d1d1f] text-white p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-medium mb-6 tracking-tight flex items-center gap-4">
                    <Scale className="w-8 h-8 text-primary" /> Ley Aplicable
                  </h2>
                  <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8">
                    Estos términos se rigen por las leyes del Estado de Utah, Estados Unidos. Cualquier disputa se resolverá exclusivamente en los tribunales del Condado de Salt Lake, Utah.
                  </p>
                  <div className="flex items-center gap-4 text-primary font-medium">
                    <HelpCircle className="w-5 h-5" />
                    <span>¿Dudas? +1 385 888 2799</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
