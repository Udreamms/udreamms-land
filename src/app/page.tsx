"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import ChooseYourPath from "@/components/landing/ChooseYourPath";
import Stats from "@/components/landing/Stats";
import Services from "@/components/landing/Services";
import YouTubeSubscription from "@/components/landing/YouTubeSubscription";
import ExperienceSection from "@/components/landing/ExperienceSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import TouristShowcase from "@/components/landing/TouristShowcase";
import StudentShowcase from "@/components/landing/StudentShowcase";
import FifaShowcase from "@/components/landing/FifaShowcase";
import JoinOurStudents from "@/components/landing/JoinOurStudents";

export default function Home() {
  const handleStartQuote = () => {
    window.location.href = "/visas/student#calculator-section";
  };

  const handleAppClick = () => {
    document.getElementById('app-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <Hero onStartQuote={handleStartQuote} />

      <ChooseYourPath />

      {/* Product Showcases */}
      <TouristShowcase />
      <StudentShowcase />
      <FifaShowcase />

      <Stats />

      {/* Flujo Principal: Qué hacemos -> Cómo lo hacemos */}
      <Services onStartQuote={handleStartQuote} onAppClick={handleAppClick} />

      {/* Herramientas y Valor Diferencial */}
      <ExperienceSection />
      <WhyChooseUs />

      <JoinOurStudents />

      {/* Prueba Social / Comunidad (Empujón final de confianza) */}
      <YouTubeSubscription />

      <Footer />
    </div>
  );
}
