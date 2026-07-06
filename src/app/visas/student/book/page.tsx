"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";
import { Star, Volume2, BookOpen, CheckSquare, Download, User, Mail, Lock } from "lucide-react";

function BookHeader() {
  return (
    <header className="w-full bg-white border-b border-slate-100 font-sans z-50">
      <div className="w-full px-4 md:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* GRUPO IZQUIERDA: LOGO + TITULO */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group font-sans">
          <div className="w-8 h-8 relative transition-transform duration-300 group-hover:scale-110">
            <img
              src="/icons/new-icon-udreamms.png"
              alt="Udreamms"
              className="object-contain w-full h-full"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            Udreamms
          </span>
        </Link>

        {/* GRUPO DERECHA: ACCIONES */}
        <div className="flex items-center gap-3 font-sans">
          <Button
            asChild
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full h-9 px-4 text-sm font-medium transition-all font-sans"
          >
            <Link href="/login?mode=login">
              Iniciar Sesión
            </Link>
          </Button>

          <Button
            asChild
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-full h-9 px-5 font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md font-sans"
          >
            <Link href="/login?register=true">
              Comenzar
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function StudentBookPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <div className="student-book-page min-h-screen bg-white text-slate-900 font-sans flex flex-col relative">
      {/* Carga e inyección forzada de la tipografía Montserrat en todos los elementos */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        * {
          font-family: 'Montserrat', sans-serif !important;
        }
      `}} />

      <BookHeader />

      <main className="flex-1 w-full bg-white py-12 md:py-16 font-sans">
        <div className="w-full px-4 md:px-8 lg:px-12 flex flex-col space-y-12 font-sans">

          {/* SECCIÓN SUPERIOR: TÍTULO, SUBTÍTULO, RATING Y VIDEO */}
          <div className="flex flex-col items-center text-center space-y-8 w-full font-sans mx-auto">
            {/* Título Principal */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-slate-900 leading-[1.08] font-sans max-w-5xl">
              Obten la guia completa para obtener tu visa de estudiante y estudiar en Estados Unidos paso a paso
            </h1>

            {/* Subtítulo */}
            <p className="text-lg md:text-2xl font-medium tracking-tight bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] bg-clip-text text-transparent leading-snug font-sans pt-2 max-w-4xl">
              Sin cometer errores que pueden retrasar o poner en riesgo tu proceso
            </p>

            {/* Calificación y Social Proof */}
            <div className="flex items-center justify-center gap-2.5 flex-wrap text-lg md:text-xl font-sans font-normal pt-2">
              <span className="text-slate-900">Udreamms</span>
              <span className="text-slate-800">5.0</span>
              <span className="text-amber-400 text-xl md:text-2xl tracking-normal select-none">★★★★★</span>
              <span className="text-slate-500">(178)</span>
              <span className="text-slate-600">Mas de 500 estudiantes asesorados</span>
            </div>

            {/* Contenedor de Video */}
            <div className="w-full px-4 md:px-16 lg:px-[190px] pt-6 font-sans">
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-950">

                {/* Elemento de Video (YouTube Embed) */}
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    className="absolute inset-0 w-full h-full border-0"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

          </div>

          {/* SECCIÓN INFERIOR: TARJETA HORIZONTAL DE COMPRA */}
          <div className="w-full px-4 md:px-16 lg:px-[190px] font-sans">
            <div className="bg-black rounded-3xl border border-slate-800 shadow-2xl p-6 md:p-10 w-full font-sans text-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center font-sans">

                {/* Bloque Izquierdo: Libro, Descripción y Precios */}
                <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4 font-sans mx-auto w-full">
                  <div className="flex flex-row items-center gap-6 justify-center w-full font-sans">
                    {/* Portada Libro */}
                    <div className="relative w-28 md:w-36 aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 shadow-lg shrink-0">
                      <img
                        src="/book-udreamms.jpeg"
                        alt="Libro Digital Udreamms - Paso a paso para tu visa"
                        className="w-full h-full object-cover scale-110 origin-center"
                      />
                    </div>

                    {/* Precios */}
                    <div className="flex flex-col justify-center text-left font-sans">
                      <span className="text-xs md:text-sm font-medium text-slate-500 line-through font-sans">
                        Antes $49 USD
                      </span>
                      <div className="flex items-baseline gap-1 mt-1 font-sans">
                        <span className="text-[10px] font-normal text-slate-400 uppercase font-sans">Hoy solo</span>
                        <span className="text-3xl md:text-4xl font-medium text-white tracking-tight font-sans">
                          $29.99
                        </span>
                        <span className="text-base font-normal text-slate-400 font-sans">USD</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-normal text-slate-300 max-w-sm mx-auto font-sans">
                    Más de 120 páginas de estrategias, ejemplos y recursos prácticos
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto font-sans">
                    Obtén acceso inmediato a la guía completa y comienza hoy mismo a preparar tu proceso para estudiar en Estados Unidos con mayor claridad y confianza.
                  </p>
                </div>

                {/* Bloque Derecho: Formulario y CTA */}
                <div className="lg:col-span-7 flex flex-col space-y-4 font-sans">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
                    {/* Nombre */}
                    <div className="relative md:col-span-1 font-sans">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 font-sans">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Nombre"
                        required
                        suppressHydrationWarning
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full pl-9 pr-3 py-3 bg-transparent border border-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-slate-500 text-white font-sans"
                      />
                    </div>

                    {/* Apellido */}
                    <div className="relative md:col-span-1 font-sans">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 font-sans">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Apellido"
                        required
                        suppressHydrationWarning
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        className="w-full pl-9 pr-3 py-3 bg-transparent border border-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-slate-500 text-white font-sans"
                      />
                    </div>

                    {/* Correo */}
                    <div className="relative md:col-span-1 font-sans">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 font-sans">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        required
                        suppressHydrationWarning
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-3 bg-transparent border border-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-slate-500 text-white font-sans"
                      />
                    </div>

                    {/* Botón de Submit */}
                    <div className="md:col-span-3 mt-2 font-sans">
                      <button
                        type="submit"
                        suppressHydrationWarning
                        className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md text-center tracking-wide text-sm font-sans font-semibold py-4 px-6 rounded-xl"
                      >
                        QUIERO MI GUÍA AHORA
                      </button>
                    </div>
                  </form>

                  {/* Garantías de confianza */}
                  <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs text-slate-400 font-medium pt-2 border-t border-slate-800 font-sans">
                    <div className="flex items-center gap-1 font-sans">
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-sans">Pago 100% seguro</span>
                    </div>
                    <span>•</span>
                    <span className="font-sans font-medium">Acceso inmediato</span>
                    <span>•</span>
                    <span className="font-sans font-medium">Descarga digital</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Iconos/Beneficios inferiores */}
          <div className="w-full px-4 md:px-16 lg:px-[190px] font-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 w-full border-t border-slate-100 font-sans">
              <div className="flex flex-col items-center text-center p-2 font-sans">
                <BookOpen className="w-8 h-8 text-slate-900 mb-3" />
                <p className="text-base md:text-lg font-medium tracking-tight text-slate-800 leading-snug font-sans">
                  Aprende el proceso completo de la visa F1.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-2 font-sans">
                <CheckSquare className="w-8 h-8 text-slate-900 mb-3" />
                <p className="text-base md:text-lg font-medium tracking-tight text-slate-800 leading-snug font-sans">
                  Evita los errores más comunes en el DS-160 y la entrevista.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-2 font-sans">
                <Download className="w-8 h-8 text-slate-900 mb-3" />
                <p className="text-base md:text-lg font-medium tracking-tight text-slate-800 leading-snug font-sans">
                  Descarga la guía al instante y empieza hoy mismo.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
