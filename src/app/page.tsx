"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Hero from "@/components/landing/Hero";
import ChooseYourPath from "@/components/landing/ChooseYourPath";
import Stats from "@/components/landing/Stats";
import Services from "@/components/landing/Services";
import YouTubeSubscription from "@/components/landing/YouTubeSubscription";
import Roadmap from "@/components/landing/Roadmap";
import StageDetails from "@/components/landing/StageDetails";
import AppSection from "@/components/landing/AppSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import CalculatorSection from "@/components/landing/CalculatorSection";
import CtaSection from "@/components/landing/CtaSection";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { UpsellModal } from "@/components/landing/UpsellModal";
import Testimonial from "@/components/landing/Testimonial";
import JoinOurStudents from "@/components/landing/JoinOurStudents";
import CityPartnerships from "@/components/landing/CityPartnerships";
import PlanButtons from "@/components/landing/PlanButtons";

function HomeContent() {
  const searchParams = useSearchParams();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (searchParams.get('calculator') === 'true') {
      setShowCalculator(true);
      setTimeout(() => {
        document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const handleQuoteComplete = (total: number) => {
    setTotalPrice(total);
    setShowUpsell(true);
  };

  const handleStartQuote = () => {
    setShowCalculator(true);
    setTimeout(() => {
      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAppClick = () => {
    document.getElementById('app-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* TopBar eliminado */}
      <Header />
      
      <Hero onStartQuote={handleStartQuote} />
      
      <ChooseYourPath />
      
      <Stats />

      {/* Flujo Principal: Qué hacemos -> Cómo lo hacemos */}
      <Services onStartQuote={handleStartQuote} onAppClick={handleAppClick} />
      <Roadmap />

      {/* Auto-identificación del usuario */}
      <StageDetails />

      {/* Herramientas y Valor Diferencial */}
      <AppSection />
      <WhyChooseUs />

      {/* NUEVAS SECCIONES BAJO "POR QUÉ UDREAMMS" */}
      <JoinOurStudents />
      <Testimonial />
      <CityPartnerships />
      <PlanButtons />

      {/* Cierre / Conversión */}
      {showCalculator ? (
        <CalculatorSection onComplete={handleQuoteComplete} />
      ) : (
        <CtaSection onStartQuote={handleStartQuote} />
      )}

      {/* Prueba Social / Comunidad (Empujón final de confianza) */}
      <YouTubeSubscription />

      <Footer />
      <UpsellModal 
        isOpen={showUpsell} 
        onClose={() => setShowUpsell(false)}
        total={totalPrice}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
