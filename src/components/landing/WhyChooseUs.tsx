"use client";

import { GraduationCap, Shield, Users, Globe } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Por qué elegir Udreamms?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Somos tu partner ideal para hacer realidad tu sueño americano
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Escuelas Certificadas</h3>
            <p className="text-muted-foreground">
              Trabajamos solo con instituciones acreditadas
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Proceso Seguro</h3>
            <p className="text-muted-foreground">
              Te guiamos en cada paso del proceso migratorio
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Apoyo Continuo</h3>
            <p className="text-muted-foreground">
              Estamos contigo antes, durante y después
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Todo Incluido</h3>
            <p className="text-muted-foreground">
              Aeropuerto, vivienda y servicios adicionales
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
