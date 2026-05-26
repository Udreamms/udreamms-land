"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface CtaSectionProps {
  onStartQuote: () => void;
}

export default function CtaSection({ onStartQuote }: CtaSectionProps) {
  return (
    <section className="relative py-16 overflow-hidden bg-black">
      {/* Fondo con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />

      <div className="container relative z-10 px-4 mx-auto text-center">
        <div className="max-w-3xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white font-medium tracking-widest uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-white">
              Tu futuro te espera
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-medium text-white mb-5 tracking-tighter leading-tight"
          >
            ¿Listo para comenzar <br />
            tu aventura en USA?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-white mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Únete a los cientos de estudiantes que ya transformaron sus vidas.
            Obtén una cotización clara, honesta y sin compromisos hoy mismo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <button
              onClick={onStartQuote}
              className="group relative flex items-center justify-center px-12 py-6 text-xl md:text-2xl font-medium text-white transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_50px_rgba(220,38,38,0.4)] hover:shadow-primary/60 hover:-translate-y-1 w-full sm:w-auto"
            >
              Solicitar Cotización Ahora
              <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-sm text-white font-medium opacity-60"
          >
            Toma menos de 2 minutos • 100% Personalizado
          </motion.p>
        </div>
      </div>
    </section >
  );
}
