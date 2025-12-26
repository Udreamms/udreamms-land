"use client";

import { Heart, Target, Lightbulb, Zap } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-6 md:px-12 mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight">
            ¿Por qué Udreamms?
          </h2>
          <p className="text-xl text-gray-600">
            No somos solo una agencia, somos tu partner en esta aventura.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta Grande Destacada */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl transition-shadow duration-300">
             <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center shrink-0 text-primary">
                <Heart className="w-10 h-10" />
             </div>
             <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Acompañamiento Humano</h3>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Sabemos que irte a otro país da miedo. Por eso nuestro equipo está contigo no solo en los papeles, sino cuando necesitas a alguien con quien hablar.
                </p>
             </div>
          </div>

          {/* Tarjetas Pequeñas */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
             <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                <Target className="w-7 h-7" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-gray-900">Enfoque en Resultados</h3>
             <p className="text-gray-500">
               Optimizamos cada aplicación para maximizar tus chances de aceptación.
             </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
             <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <Lightbulb className="w-7 h-7" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-gray-900">Innovación Constante</h3>
             <p className="text-gray-500">
               Usamos tecnología propia para hacer tu proceso más rápido y transparente.
             </p>
          </div>

          <div className="lg:col-span-2 bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl transition-shadow duration-300">
             <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center shrink-0 text-purple-600">
                <Zap className="w-10 h-10" />
             </div>
             <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Rapidez y Eficiencia</h3>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Sin burocracia innecesaria. Nuestro sistema digital agiliza la recolección de documentos y evita errores comunes.
                </p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
