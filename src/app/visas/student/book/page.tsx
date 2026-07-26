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
import CheckoutForm from "./components/CheckoutForm";

function BookHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-transparent backdrop-blur-sm font-sans z-50 transition-all duration-300">
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

        {/* GRUPO DERECHA: CTA */}
        <div className="flex items-center font-sans">
          <Button
            asChild
            suppressHydrationWarning
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm px-4 py-2 rounded-xl transition-all font-sans cursor-pointer"
          >
            <Link href="#checkout-top" className="font-sans">
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
  const [activeCheckoutId, setActiveCheckoutId] = useState<string | null>(null);

  const startCheckout = (sectionId: string) => {
    setActiveCheckoutId(sectionId);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document.getElementById(`checkout-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  };

  return (
    <div className="student-book-page min-h-screen bg-black text-slate-100 font-sans flex flex-col relative">
      {/* Carga e inyección forzada de la tipografía Montserrat, espaciado de letras tracking-tighter y peso medium en todos los elementos */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        html {
          scroll-behavior: smooth !important;
        }
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

      <main className="flex-1 w-full bg-black font-sans">
        {/* HERO SECTION */}
        <BookHero />

        {/* VIDEO SECTION */}
        <BookVideoSection />

        {/* CHECKOUT FORM 1 */}
        <div id="checkout-top" className="w-full py-12 bg-black">
          <CheckoutForm 
            formData={formData} 
            setFormData={setFormData} 
            onStartCheckout={() => startCheckout("top")}
            checkoutActive={activeCheckoutId === "top"}
            onResetCheckout={() => setActiveCheckoutId(null)}
          />
        </div>

        {/* CARACTERÍSTICAS Y TESTIMONIOS */}
        <div className="w-full py-12 bg-black">
          <PurchaseCard />
        </div>

        {/* SECCIÓN DETALLE GUÍA Y BULLETS */}
        <GuideFeatureInfo />

        {/* SECCIÓN CTA VIDEO */}
        <CtaVideoSection />

        {/* SECCIÓN HISTORIAS DE ÉXITO */}
        <SuccessStories />

        {/* CHECKOUT FORM 2 */}
        <div id="checkout-middle" className="w-full py-12 bg-black">
          <CheckoutForm 
            formData={formData} 
            setFormData={setFormData} 
            onStartCheckout={() => startCheckout("middle")}
            checkoutActive={activeCheckoutId === "middle"}
            onResetCheckout={() => setActiveCheckoutId(null)}
          />
        </div>

        {/* SECCIÓN CAPÍTULOS DEL LIBRO */}
        <BookChapters />

        {/* SECCIÓN PROMOCIÓN DEL LIBRO */}
        <PromoCtaSection />

        {/* SECCIÓN PREGUNTAS FRECUENTES */}
        <FaqSection />

        {/* CHECKOUT FORM 3 */}
        <div id="checkout-bottom" className="w-full py-16 bg-black">
          <CheckoutForm 
            formData={formData} 
            setFormData={setFormData} 
            onStartCheckout={() => startCheckout("bottom")}
            checkoutActive={activeCheckoutId === "bottom"}
            onResetCheckout={() => setActiveCheckoutId(null)}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
