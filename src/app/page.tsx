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
import UdreammsAppShowcase from "@/components/landing/UdreammsAppShowcase";
import FAQsSection from "@/components/landing/FAQsSection";
import TouristShowcase from "@/components/landing/TouristShowcase";
import StudentShowcase from "@/components/landing/StudentShowcase";
import MentorshipShowcase from "@/components/landing/MentorshipShowcase";
import FreeTrainingShowcase from "@/components/landing/FreeTrainingShowcase";
import UdreammsTVShowcase from "@/components/landing/UdreammsTVShowcase";
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
      <StudentShowcase />
      <TouristShowcase />
      <MentorshipShowcase />
      <FreeTrainingShowcase />
      <UdreammsTVShowcase />

      <Stats />

      {/* Flujo Principal: Qué hacemos -> Cómo lo hacemos (Ocultado temporalmente) */}
      {/* <Services onStartQuote={handleStartQuote} onAppClick={handleAppClick} /> */}

      {/* Herramientas y Valor Diferencial (Ocultado temporalmente) */}
      {/* <ExperienceSection /> */}
      <UdreammsAppShowcase />
      <FAQsSection />
      {/* <WhyChooseUs /> */}

      {/* <JoinOurStudents /> */}

      {/* Prueba Social / Comunidad (Empujón final de confianza) */}
      {/* <YouTubeSubscription /> */}

      <Footer />
    </div>
  );
}
