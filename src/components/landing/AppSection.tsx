"use client";

import { Smartphone, Briefcase, Bus, Plane, BookOpen } from "lucide-react";

export default function AppSection() {
  return (
    <section id="app-section" className="py-20 bg-gradient-to-br from-primary/5 to-primary-glow/5">
      <div className="container px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-2xl mb-6">
            <Smartphone className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Udreamms App
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Tu compañera perfecta una vez que llegues a Estados Unidos
          </p>
          <p className="text-base font-semibold text-primary">
            ⚠️ Esta aplicación es exclusiva para estudiantes que ya están en USA
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-card p-8 rounded-lg shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-all border border-primary/10 hover:border-primary/30">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Oportunidades</h3>
            <p className="text-muted-foreground">
              Encuentra ofertas de trabajo, becas y oportunidades de networking para estudiantes internacionales
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-all border border-primary/10 hover:border-primary/30">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
              <Bus className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Transporte</h3>
            <p className="text-muted-foreground">
              Información sobre transporte público, apps de movilidad y cómo moverte en tu ciudad
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-all border border-primary/10 hover:border-primary/30">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
              <Plane className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Viajes y Aventuras</h3>
            <p className="text-muted-foreground">
              Descubre lugares increíbles, eventos y actividades para aprovechar tu estadía al máximo
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-all border border-primary/10 hover:border-primary/30">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Conocimiento Clave en USA</h3>
            <p className="text-muted-foreground">
              Guías prácticas sobre cultura, leyes, tips de vida diaria y todo lo que necesitas saber
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
