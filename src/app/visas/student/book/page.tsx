"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";

// Sub-component imports for modular architecture
import BookHero from "./components/BookHero";
import BookVideoSection from "./components/BookVideoSection";
import PurchaseCard from "./components/PurchaseCard";
import GuideFeatureInfo from "./components/GuideFeatureInfo";
import CtaVideoSection from "./components/CtaVideoSection";
import SuccessStories from "./components/SuccessStories";
import BookChapters from "./components/BookChapters";
import PromoCtaSection from "./components/PromoCtaSection";
import FaqSection from "./components/FaqSection";

function BookHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 w-full bg-transparent border-b border-white/10 font-sans z-50">
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
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            Udreamms
          </span>
        </Link>

        {/* GRUPO DERECHA: ACCIONES */}
        <div className="flex items-center gap-3 font-sans">
          <Button
            asChild
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full h-9 px-4 text-sm font-medium transition-all font-sans"
          >
            <Link href="/login?mode=login">
              Iniciar Sesión
            </Link>
          </Button>

          <Button
            asChild
            className="bg-white text-slate-900 hover:bg-white/90 rounded-full h-9 px-5 font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md font-sans"
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
      {/* Carga e inyección forzada de la tipografía Montserrat, espaciado de letras tracking-tighter y peso medium en todos los elementos */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        * {
          font-family: 'Montserrat', sans-serif !important;
          letter-spacing: -0.02em !important;
          font-weight: 500 !important;
          line-height: 1.625 !important;
        }
        h1, h2, h3, h4, h5, h6 {
          line-height: 1.25 !important;
        }
      `}} />

      <BookHeader />

      <main className="flex-1 w-full bg-white font-sans">
        {/* HERO SECTION */}
        <BookHero />

        {/* VIDEO SECTION */}
        <BookVideoSection />

        {/* CONTENIDO DE COMPRA Y BENEFICIOS */}
        <div className="w-full px-4 md:px-8 lg:px-12 py-20 md:py-28 flex flex-col space-y-12 font-sans bg-white">
          <PurchaseCard 
            formData={formData} 
            setFormData={setFormData} 
            handleSubmit={handleSubmit} 
          />
        </div>

        {/* SECCIÓN DETALLE GUÍA Y BULLETS */}
        <GuideFeatureInfo />

        {/* SECCIÓN CTA VIDEO */}
        <CtaVideoSection />

        {/* SECCIÓN HISTORIAS DE ÉXITO */}
        <SuccessStories />

        {/* SECCIÓN CAPÍTULOS DEL LIBRO */}
        <BookChapters />

        {/* SECCIÓN PROMOCIÓN DEL LIBRO */}
        <PromoCtaSection />

        {/* SECCIÓN PREGUNTAS FRECUENTES */}
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
